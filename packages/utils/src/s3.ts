import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { awsEnv } from "@repo/env/awsEnv";

const S3Config: S3ClientConfig = {
  region: awsEnv.AWS_REGION,
  credentials: {
    accessKeyId: awsEnv.AWS_S3_ACCESS_KEY,
    secretAccessKey: awsEnv.AWS_S3_SECRET_KEY,
  },
};

const s3Client = new S3Client(S3Config);

export const uploadToS3 = async ({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer;
  contentType: string;
}) => {
  const putObject = new PutObjectCommand({
    Bucket: awsEnv.AWS_S3_BUCKET, // our bucket name
    Key: key, // file name or location inside the bucket.
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(putObject);
};

export async function getPresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: awsEnv.AWS_S3_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5,
  });
}
