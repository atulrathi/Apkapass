const bcrypt = require("bcrypt");

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.hashOTP = async (otp) => {
  return bcrypt.hash(otp, 10);
};

exports.compareOTP = async (otp, hash) => {
  return bcrypt.compare(otp, hash);
};