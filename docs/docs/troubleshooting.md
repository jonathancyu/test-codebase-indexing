# Common Troubleshooting Errors

## Failed to set up container networking

> Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint frontend (d8e476497a003baf1624f5b1a813b18e7970b063c2ff383f63fc3d918e42eb14): Bind for 0.0.0.0:3000 failed: port is already allocatedView in Docker Desktop o View Config w Enable Watch

This indicates there may be an issue with Docker networking.  Cleaning up the current Docker environment can help with this.

```bash
docker system prune -a
```

## The security token included in the request is expired

> Error fetching config: The security token included in the request is expired

This typically occurs when the AWS SSO login has expired.  Refresh the token for that.  



## Relation users does not exist


> Error loading users: HTTP error! status: 500, message: {"detail":"relation \"users\" does not exist\nLINE 1: SELECT \* FROM users\n ^\n"}

This can occur when the database has not been initialized.  You will need to run the migration and upgrade first.


## Could not find any VPCs

```bash
[Error at /testApp-infra-dev/Network/VPC] Could not find any VPCs matching {"account":"381491916950","region":"us-west-2","filter":{"tag:Name":"control-tower-vpc","isDefault":"false"},"returnAsymmetricSubnets":true,"lookupRoleArn":"arn:aws:iam::381491916950:role/cdk-hnb659fds-lookup-role-381491916950-us-west-2"}
```

This error indicates that the account you are trying to deploy to does not have the VPC necessary.  See [VPC Setup](https://docs.resources.8090.dev/user_guide/account_creation/vpc-setup/) for more information on configuring the required VPC.