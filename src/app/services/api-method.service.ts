import { Injectable } from '@angular/core';
import {DataApi} from '../models/DataApi.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {WhoIAmService} from './who-i-am.service';

@Injectable({
  providedIn: 'root'
})
export class ApiMethodService {
    public apiData: DataApi = new DataApi();
    constructor(private httpClient: HttpClient, private whoIAmService: WhoIAmService) { }

    GET<T>(url: string, haveToken ?: boolean) {
        // console.log(this.whoIAmService.userToken);
        let headers = new HttpHeaders();
        if (haveToken === true) {
            headers = new HttpHeaders({'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.whoIAmService.userToken
            });
        } else {
            headers = new HttpHeaders({'Accept' : 'application/json',
                'Content-Type': 'application/json'
            });
        }

        return new Promise((resolve, reject) => {
            this.httpClient.get(
                '' + url,
                { headers: headers }
            ).subscribe(
                (res: any) => {
                    resolve(res);
                },
                error1 => {
                    reject(error1);
                });
        });
    }

    POST<T>(url: string, data: any, haveToken ?: boolean) {
        let headers = new HttpHeaders();
        if (haveToken === true) {
            headers = new HttpHeaders({'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.whoIAmService.userToken
            });
        } else {
            headers = new HttpHeaders({'Accept' : 'application/json', 'Content-Type': 'application/json'});
        }

        return new Promise((resolve, reject) => {
            this.httpClient.post(
                '' + url,
                data,
                { headers: headers }
            ).subscribe(
                (res: any) => {
                    resolve(res);
                },
                error1 => {
                    reject(error1);
                });
        });
    }

    PUT<T>(url: string, data: any, haveToken ?: boolean) {
        let headers = new HttpHeaders();
        if (haveToken === true) {
            headers = new HttpHeaders({'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.whoIAmService.userToken
            });
        } else {
            headers = new HttpHeaders({'Accept' : 'application/json', 'Content-Type': 'application/json'});
        }

        return new Promise((resolve, reject) => {
            this.httpClient.put(
                '' + url,
                data,
                { headers: headers }
            ).subscribe(
                (res: any) => {
                    resolve(res);
                },
                error1 => {
                    reject(error1);
                });
        });
    }

    DELETE<T>(url: string, haveToken ?: boolean) {
        let headers = new HttpHeaders();
        if (haveToken === true) {
            headers = new HttpHeaders({'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.whoIAmService.userToken
            });
        } else {
            headers = new HttpHeaders({'Accept' : 'application/json', 'Content-Type': 'application/json'});
        }

        return new Promise((resolve, reject) => {
            this.httpClient.delete(
                '' + url,
                { headers: headers }
            ).subscribe(
                (res: any) => {
                    resolve(res);
                },
                error1 => {
                    reject(error1);
                });
        });
    }
}
