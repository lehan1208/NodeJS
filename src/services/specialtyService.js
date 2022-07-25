import db from '../models/index.js';

const createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                }); // convert item.image from base64 to string binary
            }

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: data,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                });
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    }
                    data.doctorSpecialty = doctorSpecialty;
                } else data = {};
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data,
                    // không hiện được data.doctorSpecialty
                    doctorSpecialty: data.doctorSpecialty,
                });
            }
        } catch (e) {
            reject(e);
            console.log(e);
        }
    });
};

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
};
