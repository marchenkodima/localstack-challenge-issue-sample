const defineAuthChallenge = async (event) => {
  console.log('event', JSON.stringify(event, null, 2));
  try {
    // If user is not registered
    if (event.request.userNotFound) {
      event.response.failAuthentication = true;
      event.response.issueTokens = false;
      throw new Error('User does not exist');
    }

    // The user provided the right answer; succeed auth
    if (
      event.request.session &&
      event.request.session.length > 0 &&
      event.request.session.slice(-1)[0].challengeResult === true
    ) {
      event.response.failAuthentication = false;
      event.response.issueTokens = true;
      console.log('Correct verification code received; authentication succeeded');
    } else {
      // The user did not provide a correct answer yet; present challenge
      event.response.challengeName = 'CUSTOM_CHALLENGE';
      event.response.failAuthentication = false;
      event.response.issueTokens = false;
      console.log('Requesting verification code from user');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Define Auth Challenge Trigger Error: ${error.message}`);
    } else {
      throw new Error(
        `Define Auth Challenge Trigger Error: An unknown error occurred: ${JSON.stringify(error, null, 2)}`,
      );
    }
  }

  return event;
};

module.exports = {
  main: defineAuthChallenge,
}
