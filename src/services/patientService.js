import db from '../models/index.js';
import 'dotenv/config';
import emailService from './emailService.js';

const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: 'Hỏi Dân IT patient name',
                    time: '8:00 - 9:00 Chủ nhật 24/07/2022',
                    doctorName: 'Nguyễn Thọ Lộ',
                    redirectLink: 'https://bookingcare.vn/pho-giao-su-tien-si-bac-si-nguyen-tho-lo-d60.html',
                });

                //update
                let user = await db.User.findOrCreate({
                    where: { email: data.email }, // so sánh data.email truyền vào với email của user
                    defaults: {
                        email: data.email, // nếu không có thì rơi vao default để tạo mới data.email
                        roleId: 'R3', // truyền thêm roleId của patient
                    },
                });

                // create
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                        },
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Create new user success!!!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    postBookAppointment,
};
