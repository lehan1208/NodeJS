import patientService from '../services/patientService.js';

const postBookAppointment = async (req, res) => {
    // đối với method POST thì req.body
    try {
        let info = await patientService.postBookAppointment(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

module.exports = {
    postBookAppointment: postBookAppointment,
};
