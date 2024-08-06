const { cognito } =  require('../../lib/cognito');
const { getEnvVar } = require('../../lib/getEnvVar');

// creates a user and assigns a random password to bypass force change password challenge
// later user signs in by phone number completing the phone verification challenge
const handler = async (event) => {
  console.log('event:', JSON.stringify(event, null, 2));

  const payload = JSON.parse(event.body);

  const userId = generateCustomId();
  const user = await cognito.adminCreateUser({
    UserPoolId: getEnvVar('END_USER_COGNITO_USER_POOL'),
    Username: userId,
    DesiredDeliveryMediums: ['EMAIL'], // EMAIL is just to bypass user pool configuration to send messages
    UserAttributes: [
      {
        Name: 'email',
        Value: payload.email, // email is to not set up Pinpoint
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'name',
        Value: payload.name,
      },
      {
        Name: 'phone_number',
        Value: payload.phone_number,
      },
      {
        Name: 'phone_number_verified',
        Value: 'true',
      },
    ],
  }).promise();
  await cognito.adminSetUserPassword({
    UserPoolId: getEnvVar('END_USER_COGNITO_USER_POOL'),
    Username: userId,
    Password: 'mockPassword123!',
    Permanent: true,
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

const generateCustomId = () => {
  return 'custom' + Math.random().toString(36).substring(2);
};

module.exports = {
  main: handler,
}
