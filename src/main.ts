import express, { Application, json, Response, Request } from "express";
import cors from "cors";
import { S3 } from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

const app: Application = express();

const s3 = new S3({
  accessKeyId: "AKIAWLHEZRD4MVTI67C7",
  secretAccessKey: "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",
});

const upload = multer({ dest: "./public/images" });

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "intesla",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

app.use(cors());

app.use(json());

app.post(
  "/upload",
  uploadS3.single("imagen"),
  (req: Request, res: Response) => {
    console.log(req.file);
    res.json({ msg: `Successfully uploaded  ${req.files}  files!` });
  }
);

app.listen(3001, () => {
  console.log("> Listening on port 3001");
});
