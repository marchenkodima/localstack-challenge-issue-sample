const { cognito } =  require('../../lib/cognito');
const { getEnvVar } = require('../../lib/getEnvVar');

// initiates sign in by starting custom auth challenge (sending SMS to phone number)
const handler = async (event) => {
  console.log('event:', JSON.stringify(event, null, 2));

  const payload = JSON.parse(event.body);

  const auth = await cognito
    .initiateAuth({
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: getEnvVar('END_USER_COGNITO_USER_POOL_CLIENT'),
      AuthParameters: {
        USERNAME: payload.phone_number,
      },
    }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(auth),
  };
};

module.exports = {
  main: handler,
}
