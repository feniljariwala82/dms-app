const mongoose = require("mongoose");
const { Schema } = mongoose;
const Document = require("../schemas/documentsSchema");
const UserException = require("../exceptions/UserException");

class DocumentModel {
  /**
   * @description stores document
   * @param {Schema.Types.ObjectId} _id
   * @param {string} fileName
   */
  static store = async (_id, fileName) => {
    await Document.create({
      userId: _id,
      categories: [],
      storagePath: fileName,
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
}

module.exports = DocumentModel;
