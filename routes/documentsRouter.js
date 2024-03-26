const express = require("express");
const router = express.Router();
const path = require("path");
const { rm } = require("fs/promises");
const cors = require("cors");
const multerUpload = require("../config/multer");
const DocumentModel = require("../models/DocumentModel");
const logError = require("../utils/logError");
const ContentManagementService = require("../services/ContentManagementService");
const documentIdsValidator = require("../middlewares/validators/documents/documentBulkDestroyValidator");

/* POST document store . */
router.post("/", multerUpload.single("document"), async (req, res, next) => {
  // content manager
  const contentManger = new ContentManagementService(process.env.DRIVE);
  // content key
  const key = path.basename(req.uploadedFilePath);

  try {
    // uploading content
    await contentManger.upload(req.uploadedFilePath, key);

    // saving document into the database
    await DocumentModel.store(
      req.user._id,
      req.uploadedFileName,
      req.uploadedFileMimeType
    );

    return res.status(200).json("Document uploaded");
  } catch (error) {
    // removing file on failure from local file system
    await rm(req.uploadedFilePath);

    // on failure deleting the uploaded content
    if (await contentManger.exists(key)) {
      await contentManger.delete(key);
    }

    return res
      .status(400)
      .json(logError(error, "An error occurred while uploading document"));
  }
});

// GET document list
router.get("/", async (req, res, next) => {
  try {
    const documents = await DocumentModel.getAllByUserId(req.user._id);
    return res.status(200).json(documents);
  } catch (error) {
    return res
      .status(400)
      .json(logError(error, "An error occurred while loading documents"));
  }
});

// GET document download
router.get(
  "/downloads/:id",
  cors({
    exposedHeaders: ["Content-Disposition"],
  }),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      // checking document existence
      const document = await DocumentModel.getDocByUserIdAndDocId(
        req.user._id,
        id
      );

      // content manager
      const contentManager = new ContentManagementService(process.env.DRIVE);

      // downloads file
      await contentManager.download(res, document.storagePath);
    } catch (error) {
      return res
        .status(400)
        .json(logError(error, "An error occurred while downloading document"));
    }
  }
);

// GET document read
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // checking document existence
    const document = await DocumentModel.getDocByUserIdAndDocId(
      req.user._id,
      id
    );

    // content manager
    const contentManager = new ContentManagementService(process.env.DRIVE);

    // generates signed url for the key
    const url = await contentManager.getSignedUrl(document.storagePath);

    return res.status(200).json(url);
  } catch (error) {
    return res
      .status(400)
      .json(logError(error, "An error occurred while reading document"));
  }
});

// DELETE document destroy
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  // content manager
  const contentManager = new ContentManagementService(process.env.DRIVE);

  try {
    // checking document existence
    const document = await DocumentModel.getDocByUserIdAndDocId(
      req.user._id,
      id
    );

    // generates signed url for the key
    await contentManager.delete(document.storagePath);

    // deleting from the database
    await DocumentModel.destroy(id);

    return res.status(200).json("Document removed successfully");
  } catch (error) {
    return res
      .status(400)
      .json(logError(error, "An error occurred while deleting document"));
  }
});

// DELETE document bulk destroy
router.delete("/destroy/bulk", documentIdsValidator, async (req, res, next) => {
  const { ids } = req.body;

  // content manager
  const contentManager = new ContentManagementService(process.env.DRIVE);

  try {
    // fetching all the documents
    const documents = await DocumentModel.getAllByIds(ids);

    // deletes documents from the cloud
    await contentManager.deleteMany(documents.map((doc) => doc.storagePath));

    // deletes data
    await DocumentModel.destroyMany(ids);

    return res.status(200).json("Documents successfully deleted");
  } catch (error) {
    return res
      .status(400)
      .json(logError(error, "An error occurred while deleting document"));
  }
});

module.exports = router;
