import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '../../../node_modules/@angular/common/http';
import {WhoIAmService} from './who-i-am.service';
import {DataApi} from '../models/DataApi.model';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  public apiInfo: DataApi = new DataApi();
  constructor(private httpClient: HttpClient,
              private whoIam: WhoIAmService) {
  }

  uploadFileBase64(fileBase64: string, type: string, format: string) {
    return new Promise((resolve, reject ) => {
      this.httpClient.post('' + this.apiInfo.endPoint + 'files/upload',
        {file: fileBase64, format: format, type: type},
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.whoIam.userToken
          })
        }
      ).subscribe(
        (res) => {
          console.log(res);
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

}

