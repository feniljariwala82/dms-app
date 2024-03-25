const { S3Client } = require("@aws-sdk/client-s3");

/**
 * S3 client
 */
const S3_CLIENT = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION_NAME,
});

module.exports = S3_CLIENT;
