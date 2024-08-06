# Steps to reproduce:
1. Run `LOCALSTACK_API_KEY={your_api_key} npm run localstack`
2. Run `npm run deploy` to run deployment against localstack
3. Create a user by sending a POST request to `{api_url}/sign-up` with the following payload (Body):
```
{
    "phone_number": "+12131234125",
    "name": "First Last",
    "email": "test1@email.com"
}
```

4. Initiate sign in by sending a POST request to `{api_url}/initiate-sign-in` with the following payload (Body):
```
{
    "phone_number": "+12131234125"
}
```

As a result auth tokens are returned instead of starting a challenge. From the logs of define auth challenge lambda the following request is coming in:
```
{
  "version": "$LATEST",
  "triggerSource": "DefineAuthChallenge_Authentication",
  "userName": "+12131234125",
  "region": "us-west-2",
  "userPoolId": "us-west-2_02091c9afcd947c58abff7190dda5182",
  "callerContext": {
    "awsSdkVersion": "aws-sdk-unknown-unknown",
    "clientId": "84zfs1fo3f5nv6umjx0inqql6l"
  },
  "request": {
    "session": [
      {
        "challengeName": null,
        "challengeResult": true,
        "challengeMetadata": null
      }
    ],
    "userAttributes": {
      "name": "First Last",
      "phone_number": "+12131234125",
      "phone_number_verified": "true",
      "sub": "795f930e-e90b-4109-80ee-780fbe494b86",
      "cognito:user_status": "CONFIRMED"
    }
  },
  "response": {
    "challengeName": null,
    "failAuthentication": null,
    "issueTokens": null
  }
}
```

5. Run deployment against a live environment. E.g. `AWS_PROFILE=your_profile STAGE=dev npm run deploy`
6. Repeat steps 3, 4

Check the logs of define auth challenge lambda. The request.session section is different and doesn't have a successful challenge result. Which is expected since the user is not authorized
```
{
  "version": "1",
  "region": "us-west-2",
  "userPoolId": "us-west-2_mhTuU5DoB",
  "userName": "customzxdb355831",
  "callerContext": {
    "awsSdkVersion": "aws-sdk-nodejs-2.987.0",
    "clientId": "6h4c7bp8fam62nloqasq5elnso"
  },
  "triggerSource": "DefineAuthChallenge_Authentication",
  "request": {
    "userAttributes": {
      "sub": "a871b310-3001-701c-4995-50a203a4e9b5",
      "cognito:user_status": "CONFIRMED",
      "name": "First Last",
      "phone_number_verified": "true",
      "phone_number": "+12131234127",
      "email": "test1@email.com"
    },
    "session": []
  },
  "response": {
    "challengeName": null,
    "issueTokens": null,
    "failAuthentication": null
  }
}
```