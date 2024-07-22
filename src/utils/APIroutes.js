const host = 'http://localhost:4000'

const routes = {
  host,
  registerRoute: `${host}/api/auth/register`,
  loginRoute: `${host}/api/auth/login`,
  setAvatarRoute: `${host}/api/auth/setAvatar`,
  allUsersRoute: `${host}/api/auth/allUsers`,
  sendMessageRoute: `${host}/api/messages/addmessage`,
  getAllMessageRoute: `${host}/api/messages/getmessage`,
}

module.exports = routes
