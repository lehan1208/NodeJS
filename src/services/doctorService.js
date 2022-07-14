import db from '../models/index.js';

const getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {exclude: ['password']},
                raw: true,
                nest: true,
                // include: [
                //     { module: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                //     { module: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                // ],
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

module.exports = { getTopDoctorHome };
