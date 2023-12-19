import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { createHash } from "crypto";
import mongooseConnect from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req,res)
  const form = new multiparty.Form();
  const { files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ files });
    });
  });

  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const readStream = createReadStream(file.path);

    const hash = createHash("md5");

    readStream.on("data", (chunk) => {
      hash.update(chunk);
    });
    const md5Hash = await new Promise((resolve) => {
      readStream.on("end", () => {
        resolve(hash.digest("hex"));
      });

      readStream.on("error", (err) => {
        // console.error("File read error:", err);
        reject(err);
      });
    });
    const timestamp = Date.now();

    const newFilename = `${md5Hash}_${timestamp}.${ext}`;

    const uploadStream = createReadStream(file.path);

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: newFilename,
        Body: uploadStream,
        ACL: "public-read",
        ContentType: file.headers["content-type"],
      })
    );
    const link = `https://${process.env.BUCKET_NAME}.s3.us-east-1.amazonaws.com/${newFilename}`;
    links.push(link);
  }
  res.json({links});
}

export const config = {
  api: {
    bodyParser: false,
  },
};