const userId = '88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f';

// Import the production service, including its URL construction and auth header.
const GammaService = require('../../src/services/gammaService').default;

test('reads a seeded user and nickname through the real Gamma info API', async () => {
  const info = await GammaService.getUser(userId);
  expect(info.user).toMatchObject({
    id: userId,
    firstName: 'Michael',
    lastName: 'Scott',
    nick: 'Boss',
    acceptanceYear: 2005
  });
  expect(Array.isArray(info.groups)).toBe(true);
  expect(await GammaService.getNick(userId)).toBe('Boss');
});

test('rejects an invalid API token through the production service', async () => {
  const validToken = process.env.GAMMA_API_KEY_TOKEN;
  try {
    process.env.GAMMA_API_KEY_TOKEN = 'invalid-integration-test-token';
    jest.resetModules();
    const unauthorizedService =
      require('../../src/services/gammaService').default;
    await expect(unauthorizedService.getUser(userId)).rejects.toThrow(
      'Gamma request failed with status 401'
    );
  } finally {
    process.env.GAMMA_API_KEY_TOKEN = validToken;
    jest.resetModules();
  }
});
