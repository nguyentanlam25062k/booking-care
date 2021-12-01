require('dotenv').config()
const nodemailer = require('nodemailer')

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD // generated ethereal password
        }
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Nguyễn Tấn Lâm 👻" <nguyentanlam25062k@gmail.com>', // sender address
        to: dataSend.receiveEmail, // list of receivers
        subject: 'Thông tin đặt lịch khám bệnh ✔', // Subject line
        html: getBodyHtmlEmail(dataSend)
        // html body
    })
}

let getBodyHtmlEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hoi dan IT chanel</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            <p>Nếu các thông tin trên là đúng sự thật, vui lòng kích vào đường link trên để hoàn tất thủ tục đặt lịch khám bệnh.</p>
            <div>
                <a href=${dataSend.redirectLink} target='_blank'>Click here!</a>
            </div>
            <div>Xin chân thành cảm hơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
            <h3>Dear ${dataSend.patientName}!</h3>
            <p>You received this email because you booked an online medical appointment on Hoi dan IT chanel</p>
            <p>Information to schedule an appointment:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>If the above information is correct, please click on the link above to complete the procedure to book an appointment.</p>
            <div>
                <a href=${dataSend.redirectLink} target='_blank'>Click here!</a>
            </div>
            <div>Sincerely thank you!</div>
        `
    }
    return result
}

// async..await is not allowed in global scope, must use a wrapper
async function main() {}

module.exports = { sendSimpleEmail }
