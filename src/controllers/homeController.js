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
  console.log(message);
  return res.send('post-crud from sever');
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDservice.getAllUser();
  // console.log('-------------');
  // console.log(data);
  // console.log('-------------');

  return res.render('displayCRUD.ejs', {
    dataTable: data,
  });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  console.log(userId);

  if (userId) {
    let userData = await CRUDservice.getUserInfoByUserId(userId);
    return res.render('editCRUD.ejs', {
      userData: userData,
    });
  } else {
    return res.send('Users ID not found!');
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;

  await CRUDservice.updateUserData(data);
  return res.send('Updated User"s info');
};

module.exports = {
  getHomePage: getHomePage,
  getAboutMe: getAboutMe,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
};
