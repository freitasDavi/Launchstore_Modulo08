const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9e2191e4cc4bcd",
      pass: "71a34e74fca3c4"
    }
  })

