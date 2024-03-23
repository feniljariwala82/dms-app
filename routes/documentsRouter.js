var express = require("express");
var router = express.Router();
const multerUpload = require("../config/multer");
const DocumentModel = require("../models/DocumentModel");
const logError = require("../utils/logError");

/* POST document store . */
router.post("/", multerUpload.single("document"), async (req, res, next) => {
  try {
    await DocumentModel.store(req.user._id, req.uploadedFileName);
    return res.status(200).json("Hello world");
  } catch (error) {
    return res
      .status(400)
      .json(logError(error, "An error occurred while uploading document"));
  }
});

module.exports = router;
