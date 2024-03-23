const mongoose = require("mongoose");
const { Schema } = mongoose;
const Document = require("../schemas/documentsSchema");

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
}

module.exports = DocumentModel;
