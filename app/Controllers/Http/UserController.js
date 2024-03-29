'use strict'

class UserController {

  async login ({ request, auth, response, session}) {
    const { username, password } = request.all()
    try {
      await auth.attempt(username, password)
      return response.json({status: 'success'})

    } catch (e) {
      console.log(e)
      return response.status(401).json({status: 'error', message:'wrong username or password'})
    }
  }
}

module.exports = UserController
