// Data is loaded by Gamma's real bootstrap, not an HTTP mock.
export const gammaSeed = {
  users: [
    {
      id: '88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f',
      cid: 'mscott',
      nick: 'Gamma Smoke Member',
      firstName: 'Michael',
      lastName: 'Scott',
      acceptanceYear: 2005
    }
  ],
  superGroups: [
    {
      id: 'aed27030-ad90-4526-855c-1e909b1dcecb',
      name: 'digit',
      prettyName: 'digIT',
      type: 'COMMITTEE'
    }
  ],
  groups: [
    {
      id: 'acd27030-ad90-4526-855c-1e909b1dcecb',
      name: 'digit-test',
      prettyName: 'digIT test',
      superGroupId: 'aed27030-ad90-4526-855c-1e909b1dcecb',
      members: [
        {
          userId: '88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f',
          postId: '7bb1db15-730d-4864-bfc3-99abe7c0ccf8'
        }
      ]
    }
  ],
  posts: [
    {
      id: '7bb1db15-730d-4864-bfc3-99abe7c0ccf8',
      postName: { sv: 'Testordförande', en: 'Gamma Smoke Chair' }
    }
  ]
};
