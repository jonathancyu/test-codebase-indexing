import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { LambdaConstruct } from '../constructs/lambda-construct';
import { EnvironmentVariablesConstruct } from '../constructs/environment-variables-construct';
import { NetworkConstruct } from '../constructs/network-construct';
import { DatabaseConstruct } from '../constructs/database-construct';
import { ApiConstruct } from '../constructs/api-construct';
import { AuthConstruct } from '../constructs/auth-construct';
import { StaticSiteInfrastructure, StaticSiteDeployment } from '@8090-inc/static-site';

export interface InfraStackProps extends StackProps {
  projectName: string;
  environment: string;
  stackName: string;
}

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    // Create network resources
    const network = new NetworkConstruct(this, 'Network', {
      environment: props.environment,
      resourcePrefix: props.environment,
    });

    // Create database name consistently
    const dbName = `${props.projectName.replace(/-/g, '_')}_${props.environment}`;

    // Create database resources
    const database = new DatabaseConstruct(this, 'Database', {
      environment: props.environment,
      vpc: network.vpc.vpc,
      lambdaSecurityGroup: network.lambdaSecurityGroup,
      databaseName: dbName,
    });

    // Create environment variables secret
    const environmentVariables = new EnvironmentVariablesConstruct(this, 'EnvironmentVariables', {
      stackName: props.stackName,
      environment: props.environment,
    });

    // Create regular Lambda functions
    const lambda = new LambdaConstruct(this, 'Lambda', {
      vpc: network.vpc.vpc,
      securityGroup: network.lambdaSecurityGroup,
      environment: props.environment,
      aurora: database.cluster,
      proxy: database.proxy,
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      databaseName: dbName,
      environmentVariablesSecret: environmentVariables.secret,
    });

    // Grant read access to the Lambda function
    environmentVariables.grantRead(lambda.handler);

    // Get Cognito parameters from SSM
    const userPoolArn = StringParameter.valueForStringParameter(
      this,
      `/${props.projectName}-${props.environment}/cognito/user-pool-arn`,
    );

    // Get the UserPool from the ARN
    const cognitoUserPool = UserPool.fromUserPoolArn(this, 'ImportedUserPool', userPoolArn);

    // Create Static Site infrastructure first
    const infrastructure = new StaticSiteInfrastructure(this, 'StaticSiteInfra', {
      cloudFrontConfig: {
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
        ],
      },
    });

    // Create API Gateway
    const api = new ApiConstruct(this, 'Api', {
      projectName: props.projectName,
      environment: props.environment,
      cognitoUserPool,
      lambdaHandler: lambda.handler,
      allowedOrigins: [`https://${infrastructure.distribution.distributionDomainName}`],
    });

    // Create Auth resources
    const auth = new AuthConstruct(this, 'Auth', {
      resourcePrefix: `${props.projectName}-${props.environment}`,
      userPool: cognitoUserPool,
      callbackUrls: [`https://${infrastructure.distribution.distributionDomainName}/callback`],
      logoutUrls: [`https://${infrastructure.distribution.distributionDomainName}`],
    });

    // Create static site deployment with all configuration available
    new StaticSiteDeployment(this, 'StaticSiteDeploy', {
      infrastructure,
      cognitoConfiguration: {
        userPoolId: cognitoUserPool.userPoolId,
        userPoolClientId: auth.userPoolClient.userPoolClientId,
        identityPoolId: auth.identityPool.ref,
        domain: infrastructure.distribution.distributionDomainName,
        region: Stack.of(this).region,
      },
      appPath: '../../frontend',
      additionalConfig: {
        apiUrl: api.url,
      },
    });

    // Add outputs
    new CfnOutput(this, `${props.projectName}-${props.environment}-api-endpoint`, {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new CfnOutput(this, `${props.projectName}-${props.environment}-aurora-endpoint`, {
      value: database.cluster.clusterEndpoint.hostname,
      description: 'Aurora cluster endpoint',
    });

    new CfnOutput(this, `${props.projectName}-${props.environment}-cloudfront-domain`, {
      value: infrastructure.distribution.distributionDomainName,
      description: 'CloudFront domain name',
    });

    new CfnOutput(this, `${props.projectName}-${props.environment}-site-bucket`, {
      value: infrastructure.bucket.bucketName,
      description: 'Site bucket name',
    });

    new CfnOutput(this, `${props.projectName}-${props.environment}-ec2-instance-id`, {
      value: database.ec2Connector?.instance.instanceId || '',
      description: 'EC2 Instance ID for database access',
    });

    new CfnOutput(this, `${props.projectName}-${props.environment}-proxy-endpoint`, {
      value: database.proxy.endpoint,
      description: 'RDS Proxy endpoint',
    });
  }
}
