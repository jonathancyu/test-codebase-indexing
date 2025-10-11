# Cognito User Setup

In order to use the Auth provided by Cognito, users must be created.

This can be in in the [cognito console](http://console.aws.amazon.com/cognito/v2/idp/user-pools/).

Users can be created in the `User Management` section of the associated User Pool.  For this deployment, an email address is required.  To create a user, select:

- Send an email invitation
- Fill in email address
- Mark email address as verified
- Generate a password
- Click `Create user`

Once this is done, an email will be sent to the email address used with a temporary password.  This password can be used to login to the site.  Once logged in, the user will be required to change their password

## Groups

In addition to a user, an admin Group must be created to access the resources in our client.  

To create a group from the user pool console select Groups in `User Management`.

- Create Group
- Use `admin` for Group Name
- Click `Create group`
- Click `admin` group
- Click `Add user to group`
- Select the user to add
- Click `Add`


