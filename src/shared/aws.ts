import { S3 } from "@aws-sdk/client-s3";

// https://docs.digitalocean.com/products/spaces/reference/s3-sdk-examples/#configure-a-client
const s3Client = new S3({
  // forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://sgp1.digitaloceanspaces.com",
  region: "sgp1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY || "",
    secretAccessKey: process.env.SPACES_SECRET || "",
  },
});

export { s3Client };
