import handbookService from '../services/handbookService';

const createHandbook = async (req, res) => {
    try {
        let info = await handbookService.createHandbook(req.body);
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
    createHandbook,
};
