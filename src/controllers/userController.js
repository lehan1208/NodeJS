import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing input parameters",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    errMessage: userData.errMessage,
    // user: userData.user ? userData.user : {},
    user: userData.user ? userData.user : { user: "Not exist!" },
  });
};

module.exports = { handleLogin: handleLogin };
