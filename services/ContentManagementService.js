const { readFile, rm, stat } = require("fs/promises");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const path = require("path");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const S3_CLIENT = require("../config/s3Client");
const UserException = require("../exceptions/UserException");

class ContentManagementService {
  drive = "local"; // local, s3

  /**
   * @description drive you want to use
   * @param {"local"|"s3"} drive
   */
  constructor(drive) {
    this.drive = drive;
  }

  /**
   * @description uploads content
   * @param {string} completeFileStoragePath
   */
  upload = async (completeFileStoragePath, key) => {
    switch (this.drive) {
      case "s3": {
        // if cloud is S3 then
        // reading file
        const fileBuffer = await readFile(completeFileStoragePath);

        // generating put object command
        const command = new PutObjectCommand({
          ACL: "private",
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
        });

        // uploading file to S3 cloud
        await S3_CLIENT.send(command);

        // after uploading the file removing the file from local file system
        await rm(completeFileStoragePath);
        break;
      }

      default: {
        // doing nothing cz the file is already uploaded to local file system
        break;
      }
    }
  };

  /**
   * @description gets file's signed url
   * @param {string} key
   */
  getSignedUrl = async (key) => {
    switch (this.drive) {
      case "s3": {
        // s3

        // generating get object command
        const command = new GetObjectCommand({
          ACL: "private",
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        });

        // generating signed url for 1 minute expiry time
        const url = await getSignedUrl(S3_CLIENT, command, {
          expiresIn: 60 * 1000, // 1 minute
        });

        return url;
      }

      default: {
        // local
        return `/uploads/${key}`;
      }
    }
  };

  /**
   * @description deletes a content
   * @param {string} key
   */
  delete = async (key) => {
    switch (this.drive) {
      case "s3": {
        // s3

        // generating delete object command
        const command = new DeleteObjectCommand({
          ACL: "private",
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        });

        // sending command
        await S3_CLIENT.send(command);

        break;
      }

      default: {
        // local
        const filePath = path.join(__dirname, "..", "uploads", key);

        // removing the file
        await rm(filePath);

        break;
      }
    }
  };

  /**
   * @description checks key existence
   * @param {string} key
   */
  exists = async (key) => {
    let exists = false;

    switch (this.drive) {
      case "s3": {
        // s3

        try {
          // generating delete object command
          const command = new HeadObjectCommand({
            ACL: "private",
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
          });

          // sending command
          await S3_CLIENT.send(command);

          exists = true;
        } catch (error) {
          exists = false;
        }

        break;
      }

      default: {
        // local
        const filePath = path.join(__dirname, "..", "uploads", key);

        if (fs.existsSync(filePath)) {
          exists = true;
        } else {
          exists = false;
        }

        break;
      }
    }

    return exists;
  };

  /**
   * @description downloads a file using key
   * @param {string} key
   */
  download = async (res, key) => {
    switch (this.drive) {
      case "s3": {
        // s3

        // generating delete object command
        const command = new GetObjectCommand({
          ACL: "private",
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        });

        // sending command
        const { Body } = await S3_CLIENT.send(command);

        // setting headers to indicate file download
        res.setHeader("Content-disposition", "attachment; filename=" + key);
        // setting stream content type
        res.setHeader("Content-type", "application/octet-stream");

        // pipe the object stream to the response
        Body.pipe(res);

        break;
      }

      default: {
        // local
        const storagePath = path.join(__dirname, "..", "uploads", key);

        // if file does not exists then throwing the error
        if (!fs.existsSync(storagePath)) {
          throw UserException("Content does not exist");
        }

        // checking file stats
        const fileStat = await stat(storagePath);

        // setting headers to indicate file download
        res.setHeader("Content-disposition", "attachment; filename=" + key);
        // setting stream content type
        res.setHeader("Content-type", "application/octet-stream");
        // setting content size
        res.setHeader("Content-Length", fileStat.size);

        // create a read stream to read the file
        const fileStream = fs.createReadStream(storagePath);

        // pipe the file stream to the response
        fileStream.pipe(res);
        break;
      }
    }
  };
}

module.exports = ContentManagementService;
