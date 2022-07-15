import db from '../models/index.js';

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

// const saveInfoDoctor = (inputData) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!inputData.id || !inputData.contentHTML || !inputData.contentMarkdown) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Missing required fields',
//                 });
//             } else {
//                 await db.Markdown.save({
//                     contentHTML: inputData.contentHTML,
//                     contentMarkdown: inputData.contentMarkdown,
//                     description: inputData.description,
//                     doctorId: inputData.doctorId,
//                 });
//                 resolve({
//                     errCode: 0,
//                     errMessage: 'Save info successfully!!',
//                 });
//             }
//         } catch (err) {
//             reject({
//                 errCode: 1,
//                 errMessage: 'Error from server...' + err,
//             });
//             // console.log('Something has been wrong!!!' + err);
//         }
//     });
// };

const saveInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required fields',
                });
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                });
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

module.exports = { getTopDoctorHome, getAllDoctor, saveInfoDoctor };
