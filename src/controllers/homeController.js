let getHomePage = (req, res) => {
  return res.render('homepage.ejs');
};

let getAboutMe = (req, res) => {
  return res.render('about/aboutMe.ejs');
};

module.exports = {
  getHomePage: getHomePage,
  getAboutMe,
};
