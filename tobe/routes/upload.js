const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  },
  region: 'ap-northeast-2'
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'chaining', // 저장하고자하는 S3 버킷명
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  }),
})

router.post('/', upload.array("photos", 10), async (req, res) => {
  console.log(req.files);
  const photos = req.files.map(file => file.location);
  res.send({ success: true, photos });
})

module.exports = router;
