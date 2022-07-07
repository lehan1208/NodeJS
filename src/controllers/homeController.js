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
  return res.render('about/aboutMe.ejs');
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

module.exports = {
  getHomePage: getHomePage,
  getAboutMe: getAboutMe,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
};
