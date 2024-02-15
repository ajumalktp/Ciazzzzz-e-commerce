const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const uploadImage = multer({ storage:storage}).single('image')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/logo");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  });
  
  const uploadLogo = multer({ storage:storage}).single('logo')

module.exports = {uploadImage,uploadLogo}