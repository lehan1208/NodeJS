import bcrypt from "bcryptjs";
import db from "../models/index.js";
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
        gender: data.gender === "1" ? true : false,
        roleId: data.role,
      });
      resolve("Create new user success!!");
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

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true, // hiển thị những phần quan trọng
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfoByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });

      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        // tìm user trong db với điều kiện = id truyền vào
        where: { id: data.id },
      });
      if (user) {
        // nếu có user => update lại firstname/lastname/ address
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save(); // after updating => await user.save() lưu thông tin

        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await user.destroy();
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoByUserId,
  updateUserData,
  deleteUserById,
};

// Sử dụng new Promiss
// Sau khi click Sign in => service có nhiệm vụ nhận data từ controller và thao tác về phía database
// Sau khi hashPassword thì đưa vào db
