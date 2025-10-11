// !!!!!! WARNING !!!!!!
// DO NOT UPDATE THIS SECRET IN CDK - update using the environment_variable_manager package
// !!!!!! WARNING !!!!!!

import { Construct } from 'constructs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { SecretValue } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IGrantable } from 'aws-cdk-lib/aws-iam';

export interface EnvironmentVariablesConstructProps {
  stackName: string;
  environment: string;
  initialVariables?: Record<string, string>;
}

export class EnvironmentVariablesConstruct extends Construct {
  public readonly secret: Secret;

  constructor(scope: Construct, id: string, props: EnvironmentVariablesConstructProps) {
    super(scope, id);

    // Create the secret with initial variables
    const initialSecretValue = {
      ENVIRONMENT: props.environment,
      ...props.initialVariables,
    };

    this.secret = new Secret(this, 'EnvironmentVariables', {
      secretName: `${props.stackName}-EnvironmentVariables`,
      description:
        'Environment variables for the stack. DO NOT UPDATE THIS SECRET IN CDK - update using the environment_variable_manager package',
      secretStringValue: SecretValue.unsafePlainText(
        Buffer.from(JSON.stringify(initialSecretValue)).toString('base64'),
      ),
    });
  }

  /**
   * Grants read access to the environment variables secret
   * @param grantee The entity to grant read access to
   */
  public grantRead(grantee: IGrantable): void {
    this.secret.grantRead(grantee);
  }

  /**
   * Grants write access to the environment variables secret
   * @param grantee The entity to grant write access to
   */
  public grantWrite(grantee: IGrantable): void {
    grantee.grantPrincipal.addToPrincipalPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['secretsmanager:PutSecretValue', 'secretsmanager:UpdateSecret'],
        resources: [this.secret.secretArn],
      }),
    );
  }
}
