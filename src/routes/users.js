const express = require('express')
const routes = express.Router()

const sessionController = require('../app/controllers/sessionController')
const userController = require('../app/controllers/userController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const { isLoggedRedirectToUsers, olnyUsers } = require('../app/middlewares/session')


// Login/Logout 
routes.get('/login', isLoggedRedirectToUsers, sessionController.loginForm)
routes.post('/login', SessionValidator.login, sessionController.login)
routes.post('/logout', sessionController.logout)

// // Reset Password/forgot
routes.get('/forgot-password', sessionController.forgotForm)
routes.get('/password-reset', sessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, sessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, sessionController.reset)



// // User Register User Controller
routes.get('/register', userController.registerForm)
routes.post('/register', UserValidator.post, userController.post)

routes.get('/', olnyUsers, UserValidator.show, userController.show)
routes.put('/', UserValidator.update, userController.update)
routes.delete('/', userController.delete)

module.exports = routes