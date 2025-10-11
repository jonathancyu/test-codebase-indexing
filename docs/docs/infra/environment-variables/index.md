# Environment Variable Management

Environment variables are managed through the 8090 constructs library [here](https://8090-inc.github.io/constructs/tools/environment_variable_manager).

## Secret Setup

The stack automatically creates a secret in AWS Secrets Manager via the `infra/src/constructs/environment-variables-construct.ts` file. This secret has the format of `{StackName}-EnvironmentVariables`.

## Updating Environment Variables

!!! warning
    This secret should only be updated using the method below. If you update the secret inside the CDK code, you risk losing your environment variables.

In order to edit the environment variables, you will need to have the `environment_variable_manager` tool installed, login to the aws account through `aws sso login`, and run the `environment_variable_manager` command.

```bash
env-manager edit --secret-name {StackName}-EnvironmentVariables --profile {AWSProfileName}
```

Please see the [environment_variable_manager](https://8090-inc.github.io/constructs/tools/environment_variable_manager) documentation for more information.
