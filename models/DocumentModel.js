const mongoose = require("mongoose");
const { Schema } = mongoose;
const Document = require("../schemas/documentsSchema");
const UserException = require("../exceptions/UserException");
const ContentManagementService = require("../services/ContentManagementService");

class DocumentModel {
  /**
   * @description stores document
   * @param {Schema.Types.ObjectId} _id
   * @param {string} fileName
   * @param {string} mimeType
   */
  static store = async (_id, fileName, mimeType) => {
    await Document.create({
      userId: _id,
      categories: [],
      storagePath: fileName,
      mimeType,
    });
  };

  /**
   * @description gets document by user id and document id
   * @param {string} userId
   * @param {string} documentId
   */
  static getDocByUserIdAndDocId = async (userId, documentId) => {
    const document = await Document.findOne({ userId, _id: documentId });
    if (!document) {
      throw UserException("Document not found");
    }
    return document;
  };

  /**
   * @description deletes a document by id
   * @param {string} _id
   */
  static destroy = async (_id) => {
    await Document.deleteOne({ _id });
  };

  /**
   * @description deletes documents with given id list
   * @param {string[]} _ids
   */
  static destroyMany = async (_ids) => {
    await Document.deleteMany({ _id: { $in: _ids } });
  };

  /**
   * @description gets documents with given id list
   * @param {string[]} _ids
   */
  static getAllByIds = async (_ids) => {
    const documents = await Document.find({ _id: { $in: _ids } });
    return documents;
  };

  static getAllByUserId = async (userId) => {
    const documents = await Document.find({ userId });

    // for each documents loading signed url
    for (const document of documents) {
      const contentManager = new ContentManagementService(process.env.DRIVE);
      const url = await contentManager.getSignedUrl(document.storagePath);
      document.storagePath = url;
    }

    return documents;
  };
}

module.exports = DocumentModel;
