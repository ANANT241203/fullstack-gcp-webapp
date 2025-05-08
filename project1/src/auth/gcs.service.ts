import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GcsService {
  private storage: Storage;
  private bucketName: string = 'YOUR_GCS_BUCKET_NAME'; // TODO: Replace with your bucket name

  constructor() {
    this.storage = new Storage(); // Uses GOOGLE_APPLICATION_CREDENTIALS env var
  }

  async uploadFile(localFilePath: string, destination?: string): Promise<string> {
    const dest = destination || path.basename(localFilePath);
    await this.storage.bucket(this.bucketName).upload(localFilePath, {
      destination: dest,
    });
    // Optionally, make the file public and return the public URL
    // await this.storage.bucket(this.bucketName).file(dest).makePublic();
    // return `https://storage.googleapis.com/${this.bucketName}/${dest}`;
    return dest;
  }
}
