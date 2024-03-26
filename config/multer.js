const multer = require("multer");
const path = require("path");

// storage path
const localStoragePath = path.join(__dirname, "..", "uploads");

// local multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, localStoragePath); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    // generating unique suffix
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // new file name
    const newFileName = uniqueSuffix + path.extname(file.originalname);

    // saving uploaded file's name
    req.uploadedFileName = newFileName;
    req.uploadedFilePath = path.join(localStoragePath, newFileName);
    req.uploadedFileMimeType = file.mimetype;

    // renaming the file
    cb(null, newFileName);
  },
});

// file size limit and allowed MIME types
const fileSizeLimit = 100 * 1024 * 1024; // 100MB file size limit
const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"]; // allowed MIME types

// custom file filter function for allowed MIME types
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // accept the file
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed file types: JPEG, PNG, PDF. And maximum allowed content size is 5MB."
      ),
      false
    ); // reject the file
  }
};

// assigning storage
const multerUpload = multer({
  storage,
  limits: {
    fileSize: fileSizeLimit, // file size limit
  },
  fileFilter: fileFilter, // file filter for allowed MIME types
});

module.exports = multerUpload;
