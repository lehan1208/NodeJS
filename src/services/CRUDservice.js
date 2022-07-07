import bcrypt from 'bcryptjs';
import db from '../models/index.js';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === '1' ? true : false,
        roleId: data.role,
      });
      resolve('Create new user success!!');
    } catch (e) {
      reject(e);
    }
  });

  console.log(data);
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
      // Sử dụng resolve thay cho return
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewUser,
};

// Sử dụng new Promiss
// Sau khi click Sign in => service có nhiệm vụ nhận data từ controller và thao tác về phía database
// Sau khi hashPassword thì đưa vào db
