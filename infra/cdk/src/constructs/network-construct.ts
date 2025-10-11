import { Construct } from 'constructs';
import { VpcConstruct } from '@8090-inc/vpc';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';

export interface NetworkConstructProps {
  environment: string;
  resourcePrefix: string;
}

export class NetworkConstruct extends Construct {
  public readonly vpc: VpcConstruct;
  public readonly lambdaSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: NetworkConstructProps) {
    super(scope, id);

    // Create VPC
    this.vpc = new VpcConstruct(this, 'VPC', {
      environment: props.environment,
      resourcePrefix: props.resourcePrefix,
    });

    // Create Lambda security group
    this.lambdaSecurityGroup = new SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc: this.vpc.vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });
  }
}
