import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";
import { getAuthData } from "~encore/auth";

const imagesBucket = new Bucket("images", { public: true });

export interface GetUploadUrlRequest {
  filename: string;
  contentType: string;
}

export interface GetUploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

// Gets a signed upload URL for image uploads.
export const getUploadUrl = api<GetUploadUrlRequest, GetUploadUrlResponse>(
  { auth: true, expose: true, method: "POST", path: "/storage/upload-url" },
  async (req) => {
    const auth = getAuthData()!;
    const objectName = `${auth.userID}/${Date.now()}-${req.filename}`;

    const { url: uploadUrl } = await imagesBucket.signedUploadUrl(objectName, {
      ttl: 3600, // 1 hour
    });

    const publicUrl = imagesBucket.publicUrl(objectName);

    return {
      uploadUrl,
      publicUrl,
    };
  }
);
