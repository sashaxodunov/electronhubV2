
import 'server-only'

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const endpoint = process.env.S3_ENDPOINT
const region = process.env.S3_REGION
const bucket = process.env.S3_BUCKET
const accessKeyId = process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

function getConfig() {
  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error('Не настроены переменные окружения Timeweb S3')
  }

  return { endpoint, region, bucket, accessKeyId, secretAccessKey }
}

let client: S3Client | undefined

function getS3Client(): S3Client {
  if (client) return client

  const config = getConfig()

  client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  return client
}

export async function uploadStoredObject(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<void> {
  const config = getConfig()

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
}

export async function uploadPdf(
  key: string,
  body: Buffer,
): Promise<void> {
  await uploadStoredObject(key, body, 'application/pdf')
}

export async function deleteStoredObject(key: string): Promise<void> {
  const config = getConfig()

  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  )
}

export async function getStoredObject(key: string) {
  const config = getConfig()

  return getS3Client().send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  )
}

export async function storedObjectExists(key: string): Promise<boolean> {
  const config = getConfig()

  try {
    await getS3Client().send(
      new HeadObjectCommand({
        Bucket: config.bucket,
        Key: key,
      }),
    )

    return true
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } })
      .$metadata?.httpStatusCode

    if (status === 404) return false

    throw error
  }
}

export async function getStoredObjectInfo(key: string) {
  const config = getConfig()

  const result = await getS3Client().send(
    new HeadObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  )

  return {
    size: result.ContentLength ?? 0,
    createdAt: result.LastModified ?? null,
    modifiedAt: result.LastModified ?? null,
    contentType: result.ContentType ?? null,
  }
}
