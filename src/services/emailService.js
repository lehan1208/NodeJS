import 'dotenv/config';
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Hoc Lap Trinh" <silversoul.j@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: 'Thông tin đặt lịch khám bệnh', // Subject line
        html: getBodyHTMLEmail(dataSend),
        // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch hẹn trên Bookingcare.vn</p>
        <p>Thông tin đặt lịch khám:</p>
        <h4><b>Thời gian: ${dataSend.time}</b></h4>
        <h4><b>Bác sĩ: ${dataSend.doctorName}</b></h4>

        <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link dưới đây để xác nhận hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here!</a>
        </div>

        <div>Xin chân thành cảm ơn!</div>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an appointment on Bookingcare.vn</p>
        <p>Information to schedule an appointment:</p>
        <h4><b>Time: ${dataSend.time}</b></h4>
        <h4><b>Doctor: ${dataSend.doctorName}</b></h4>

        <p>If the above information is correct, please click on the link below to confirm completion of the medical appointment booking procedure</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here!</a>
        </div>

        <div>Sincerely,</div>
        `;
    }
    return result;
};

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
};
