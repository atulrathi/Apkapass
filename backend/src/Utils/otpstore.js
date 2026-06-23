const redisClient = require('../config/redis');

const OTP_EXPIRY = 300; // 5 minutes

// 🔹 SET OTP
const setOtp = async (phone, hashedOtp) => {
  const key = `otp:${phone}`;

  const result = await redisClient.set(key, hashedOtp, {
    EX: 300,
    NX: true, 
  });

  return result; 
};

// 🔹 GET OTP
const getOtp = async (phone) => {
  return await redisClient.get(`otp:${phone}`);
};

// 🔹 DELETE OTP
const deleteOtp = async (phone) => {
  await redisClient.del(`otp:${phone}`);
};

// 🔹 Rate limit (PHONE + IP)
const incrementOtpRequest = async (phone, ip) => {
  const phoneKey = `otp_req:phone:${phone}`;
  const ipKey = `otp_req:ip:${ip}`;

  const phoneCount = await redisClient.incr(phoneKey);
  const ipCount = await redisClient.incr(ipKey);

  // set expiry only first time
  if (phoneCount === 1) {
    await redisClient.expire(phoneKey, OTP_EXPIRY);
  }

  if (ipCount === 1) {
    await redisClient.expire(ipKey, OTP_EXPIRY);
  }

  return { phoneCount, ipCount };
};

// 🔹 Track failed OTP attempts
const incrementOtpFail = async (phone) => {
  const key = `otp_fail:${phone}`;

  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, OTP_EXPIRY);
  }

  return count;
};

// 🔹 Clear failed attempts
const clearOtpFail = async (phone) => {
  await redisClient.del(`otp_fail:${phone}`);
};

module.exports = {
  setOtp,
  getOtp,
  deleteOtp,
  incrementOtpRequest,
  incrementOtpFail,
  clearOtpFail,
};