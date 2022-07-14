import doctorService from '../services/doctorService.js';

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
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

module.exports = { getTopDoctorHome: getTopDoctorHome };
