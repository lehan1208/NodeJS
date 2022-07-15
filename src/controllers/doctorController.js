import doctorService from '../services/doctorService.js';

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 15;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctor();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server...',
        });
    }
};

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    postInfoDoctor: postInfoDoctor,
};
