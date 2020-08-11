const User = require('../models/user')
const { compare } = require('bcryptjs')


async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({where: {email} })

    if(!user) return res.render("session/login", {
            user: req.body,
            error: "Usuário não cadastrado!"
    })
    
    const passed = await compare(password, user.password)

    if(!passed) return res.render("session/login", {
        user: req.body,
        error: "Senha incorreta"
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body 

    try {
        let user = await User.findOne({ where: { email } })

        if(!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Email não cadastrado!"
        })

        req.user = user
        
        next()
    } catch (err) {
        console.error(err)
    }

}

async function reset(req, res, next) {
    // Procurar o usuário
    const { email, password, token, passwordRepeat } = req.body

    const user = await User.findOne({where: {email} })

    if(!user) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: "Usuário não cadastrado!"
    })
    // Ver se a senha bate
    if(password != passwordRepeat) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'As senhas não conferem'
    })
    // Verificar se o token bate
    if (token != user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token Inválido! Solicite uma nova recuperação de senha.'
    })
    // Verificar se o token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())
    
    if(now > user.reset_token_expires) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token Expirado! Solicite uma nova recuperação de senha.'
    })

    req.user = user
    next()

}

module.exports = {
    login,
    forgot,
    reset
}