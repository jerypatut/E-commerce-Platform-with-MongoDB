require('dotenv').config();

module.exports = {
  secure: process.env.EMAIL_SECURE === 'true', // Konversi dari string ke boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  service: process.env.EMAIL_SERVICE,
};
