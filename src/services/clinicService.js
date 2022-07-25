import db from '../models/index.js';

const createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown ||
                !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
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

const getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
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

const getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                });
                if (data) {
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Info.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId'],
                    });

                    data.doctorClinic = doctorClinic;
                } else data = {};
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data,
                    // không hiện được data.doctorClinic
                    doctorClinic: data.doctorClinic,
                });
            }
        } catch (e) {
            reject(e);
            console.log(e);
        }
    });
};

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById,
};
