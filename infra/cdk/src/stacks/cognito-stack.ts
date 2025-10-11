import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CognitoResources } from '@8090-inc/cognito';

export interface CognitoStackProps extends StackProps {
  projectName: string;
  environment: string;
}

export class CognitoStack extends Stack {
  public readonly cognitoResources: CognitoResources;

  constructor(scope: Construct, id: string, props: CognitoStackProps) {
    super(scope, id, props);

    // Create Cognito resources
    this.cognitoResources = new CognitoResources(this, 'CognitoResources', {
      resourcePrefix: `${props.projectName}-${props.environment}`,
      userPoolName: `${props.projectName}-${props.environment}-user-pool`,
    });
  }
}
