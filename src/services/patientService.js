import db from '../models/index.js';
import 'dotenv/config';
import emailService from './emailService.js';
import { v4 as uuidv4 } from 'uuid';

const buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

    return result;
};

const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.timeType ||
                !data.date ||
                !data.fullName ||
                !data.selectedGender ||
                !data.address ||
                !data.phoneNumber
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });

                //update
                let user = await db.User.findOrCreate({
                    where: { email: data.email }, // so sánh data.email truyền vào với email của user
                    defaults: {
                        email: data.email, // nếu không có thì rơi vao default để tạo mới data.email
                        roleId: 'R3', // truyền thêm roleId của patient
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                        phoneNumber: data.phoneNumber,
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
                            token: token,
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

const postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        token: data.token,
                        doctorId: data.doctorId,
                        statusId: 'S1',
                    },
                    raw: false,
                    // raw:false để trả về object sequelize sau đó mới .save()
                    // raw:true để trả về object javascript
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Verify success!!!',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been verified or does not exist!!!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
};
