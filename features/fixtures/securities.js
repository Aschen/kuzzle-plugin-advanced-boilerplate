// See https://docs.kuzzle.io/api/1/controller-admin/load-securities/

module.exports = {
  users: {
    admin: {
      content: {
        profileIds: ['admin']
      },
      credentials: {
        local: {
          username: 'admin',
          password: 'password'
        }
      }
    },
    alyx: {
      content: {
        profileIds: ['default']
      },
      credentials: {
        local: {
          username: 'alyx',
          password: 'password'
        }
      }
    } 
  }
};