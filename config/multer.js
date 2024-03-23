const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const UserException = require("../exceptions/UserException");

// Configure AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "your-region", // Specify your AWS region
});

// storage path
const localStoragePath = path.join(__dirname, "..", "uploads");

// file storage provider
let storage;

// if development
if (process.env.NODE_ENV === "development") {
  // local multer storage configuration
  storage = multer.diskStorage({
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

      // renaming the file
      cb(null, newFileName);
    },
  });
} else {
  // multer storage configuration for AWS S3
  storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME, // Specify your S3 bucket name
    acl: "private", // Set the access control level for uploaded files
    key: function (req, file, cb) {
      // generating unique suffix
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      // new file name
      const newFileName = uniqueSuffix + path.basename(file.originalname);

      // saving uploaded file's name
      req.uploadedFileName = newFileName;

      // renaming the file
      cb(null, newFileName);
    },
  });
}

// file size limit and allowed MIME types
const fileSizeLimit = 5 * 1024 * 1024; // 5MB file size limit
const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"]; // allowed MIME types

// custom file filter function for allowed MIME types
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      UserException(
        "Invalid file type. Allowed file types: JPEG, PNG, PDF.",
        "INVALID_INPUT"
      ),
      false
    ); // Reject the file
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
