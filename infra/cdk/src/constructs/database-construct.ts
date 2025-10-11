import { Construct } from 'constructs';
import { AuroraConstruct } from '@8090-inc/aurora-rds';
import { IVpc, ISecurityGroup } from 'aws-cdk-lib/aws-ec2';

export interface DatabaseConstructProps {
  environment: string;
  vpc: IVpc;
  lambdaSecurityGroup: ISecurityGroup;
  databaseName: string;
}

export class DatabaseConstruct extends Construct {
  public readonly aurora: AuroraConstruct;

  constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
    super(scope, id);

    // Create Aurora RDS
    this.aurora = new AuroraConstruct(this, 'Aurora', {
      environment: props.environment,
      vpc: props.vpc,
      lambdaSecurityGroup: props.lambdaSecurityGroup,
      databaseName: props.databaseName,
    });
  }

  public get cluster() {
    return this.aurora.cluster;
  }

  public get proxy() {
    return this.aurora.proxy;
  }

  public get ec2Connector() {
    return this.aurora.ec2Connector;
  }
}
