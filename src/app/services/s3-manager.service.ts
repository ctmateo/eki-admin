import { Injectable } from '@angular/core';
import { Storage } from 'aws-amplify';

export enum ACL {
  PRIVATE = "private",
  PUBLIC_READ = "public-read",
  PUBLIC_READ_WRITE = "public-read-write",
  AUTHENTICATED_READ = "authenticated-read",
  AWS_EXEC_READ = "aws-exec-read",
  BUCKET_OWNER_READ = "bucket-owner-read",
  BUCKET_OWNER_FULL_CONTROL = "bucket-owner-full-control",
}
@Injectable({
  providedIn: 'root'
})
export class S3ManagerService {

  constructor() { }


  async uploadFile(file: File, key: string): Promise<string> {
    try {
      const result = await Storage.put(key, file, {
        contentType: file.type
      });

      return result.key;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }



  getUrlFile(url) {
    return Storage.get(url, {
      level: "public", // defaults to `public`
      download: false, // defaults to false
      expires: 1800,
      contentType: "image/jpg" // set return content type, eg "text/html"
    });
  }


}
