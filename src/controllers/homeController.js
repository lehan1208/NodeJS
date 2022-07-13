import db from '../models/index';
import CRUDservice from '../services/CRUDservice';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', { data: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
    }
};

let getAboutMe = (req, res) => {
    return res.render('aboutMe.ejs');
};

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};

// việc tạo user tốn tgian nên để tránh mất đồng bộ => async/await
let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body);
    return res.send('Đã thêm User!!');
};

let displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data,
    });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;

    if (userId) {
        let userData = await CRUDservice.getUserInfoByUserId(userId);
        return res.render('editCRUD.ejs', {
            userData: userData,
        });
    } else {
        return res.send('Không tìm thấy User');
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDservice.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers,
    });
};

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;

    if (userId) {
        await CRUDservice.deleteUserById(userId);
        return res.send('Xóa User thành công!!');
    } else {
        return res.send('Không tìm thấy User');
    }
};

module.exports = {
    getHomePage: getHomePage,
    getAboutMe: getAboutMe,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
};
