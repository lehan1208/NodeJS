import db from '../models/index.js';
import 'dotenv/config';
import _ from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['password'] },
                raw: true,
                nest: true,
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
            });

            resolve({
                errCode: 0,
                data: users,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const getAllDoctor = (doctors) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password', 'image'] },
                order: [['createdAt', 'DESC']],
            });
            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const saveInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !inputData.doctorId ||
                !inputData.contentHTML ||
                !inputData.contentMarkdown ||
                !inputData.selectedPrice ||
                !inputData.selectedPayment ||
                !inputData.selectedProvince ||
                !inputData.nameClinic ||
                !inputData.addressClinic ||
                !inputData.note
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required fields',
                });
            } else {
                // upsert  to MARKDOWN info table

                let markDownInfo = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false,
                });
                if (markDownInfo) {
                    // update
                    (markDownInfo.contentHTML = inputData.contentHTML),
                        (markDownInfo.contentMarkdown = inputData.contentMarkdown),
                        (markDownInfo.description = inputData.description),
                        (markDownInfo.updateAt = new Date()),
                        await markDownInfo.save();
                } else {
                    // create
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                }

                // upsert  to DOCTOR info table
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false,
                });
                console.log(inputData.doctorId);

                if (doctorInfo) {
                    // update
                    (doctorInfo.doctorId = inputData.doctorId),
                        (doctorInfo.priceId = inputData.selectedPrice.value),
                        (doctorInfo.provinceId = inputData.selectedProvince.value),
                        (doctorInfo.paymentId = inputData.selectedPayment.value),
                        (doctorInfo.nameClinic = inputData.nameClinic),
                        (doctorInfo.addressClinic = inputData.addressClinic),
                        (doctorInfo.note = inputData.note),
                        await doctorInfo.save();
                } else {
                    // create
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice.value,
                        provinceId: inputData.selectedProvince.value,
                        paymentId: inputData.selectedPayment.value,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save info successfully!!',
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

const getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required fields',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: { exclude: ['password'] },
                    raw: true,
                    nest: true,
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentMarkdown', 'doctorId', 'contentHTML'],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                });

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

const bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required fields',
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                // get all existed data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formattedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                });

                // compare difference
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(schedule);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save schedule successfully!!',
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

const getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required fields',
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    raw: true,
                    nest: true,
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                });
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};
module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
};
