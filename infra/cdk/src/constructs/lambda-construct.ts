import { Construct } from 'constructs';
import { DockerImageFunction, Architecture } from 'aws-cdk-lib/aws-lambda';
import { ISecurityGroup, IVpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { DatabaseCluster, DatabaseProxy } from 'aws-cdk-lib/aws-rds';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import { DockerImageCode } from 'aws-cdk-lib/aws-lambda';

export interface LambdaConstructProps {
  vpc: IVpc;
  securityGroup: ISecurityGroup;
  environment: string;
  aurora: DatabaseCluster;
  proxy: DatabaseProxy;
  subnetType: SubnetType;
  databaseName?: string;
  environmentVariablesSecret?: Secret;
}

export class LambdaConstruct extends Construct {
  public readonly handler: DockerImageFunction;

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    const lambdaPath = path.join(__dirname, '../../../../../backend');

    // Get CodeArtifact token from environment
    const codeArtifactToken = process.env.CODEARTIFACT_AUTH_TOKEN;
    if (!codeArtifactToken) {
      throw new Error('CODEARTIFACT_AUTH_TOKEN environment variable is required');
    }

    this.handler = new DockerImageFunction(this, 'Handler', {
      code: DockerImageCode.fromImageAsset(lambdaPath, {
        buildArgs: {
          CODEARTIFACT_TOKEN: codeArtifactToken,
          provenance: 'false',
          sbom: 'false',
        },
      }),
      timeout: Duration.seconds(60),
      memorySize: 256,
      architecture: Architecture.X86_64,
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: props.subnetType,
      },
      securityGroups: [props.securityGroup],
      environment: {
        PROXY_ENDPOINT: props.proxy.endpoint,
        RDS_PROXY_ENDPOINT: props.proxy.endpoint,
        DB_NAME: 'postgres',
        DB_USERNAME: 'postgres',
        DEPLOYMENT_TYPE: 'lambda',
        ...(props.environmentVariablesSecret && {
          ENVIRONMENT_VARIABLES_SECRET_ARN: props.environmentVariablesSecret.secretArn,
          ENVIRONMENT_VARIABLES_SECRET_NAME: props.environmentVariablesSecret.secretName,
        }),
      },
    });

    // Grant proxy connection permissions
    props.proxy.grantConnect(this.handler);

    // Grant additional IAM permissions
    this.handler.addToRolePolicy(
      new PolicyStatement({
        actions: ['rds-db:connect', 'rds:GenerateDBAuthToken'],
        resources: [
          `arn:aws:rds-db:${props.proxy.stack.region}:${props.proxy.stack.account}:dbuser/${props.proxy.dbProxyName}/*`,
        ],
      }),
    );

    // Grant CloudFormation permissions for service connections
    this.handler.addToRolePolicy(
      new PolicyStatement({
        actions: ['cloudformation:DescribeStacks'],
        resources: ['*'], // CloudFormation DescribeStacks requires wildcard
      }),
    );
  }
}
