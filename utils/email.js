const {createTransport} = require("nodemailer")

const sendEmail = async (options) => {
    // 1) Create Transporter
    const transporter = createTransport({
        'host': 'smtp.mailtrap.io',
        'port': 25,
        auth: {
            user:'25b67704e033c9',
            pass: '294cbfd22bc253'
        }
     })
    // 2)Define Email Options

    const mailOptions = {
        from: 'admin',
        to: options.email,
        subject: options.subject,
        text:options.message
    }

   await  transporter.sendMail(mailOptions)
}

module.exports=sendEmail