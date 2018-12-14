import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Langue} from '../models/Langue.model';
import {DataApi} from '../models/DataApi.model';
import {Router} from '@angular/router';
import {ApiMethodService} from './api-method.service';

@Injectable({
  providedIn: 'root'
})
export class LanguesService {

    public apiInfo: DataApi = new DataApi();
    private langues: Array<Langue> = [];
    private langue: Langue;
    public languesSubject = new Subject<Array<Langue>>();
    public langueSubject = new Subject<Langue>();
    constructor(private router: Router,
                private apiMethod: ApiMethodService) { }
    emitLangues() {
        this.languesSubject.next(this.langues);
    }
    emitLangue() {
        this.langueSubject.next(this.langue);
    }
    getLangues() {
        return new Promise((resolve) => {
            this.apiMethod.GET('' + this.apiInfo.endPoint + 'langues', false)
                .then((res: any) => {
                    this.langues = res;
                    this.emitLangues();
                    resolve(true);
                })
                .catch(err => {
                    console.log(err);
                    // this.errorService.insertError('' + err.error.message);
                    resolve(false);
                });
        });
    }
    getLangueUser(id: string) {
        return new Promise((resolve) => {
            this.apiMethod.GET('' + this.apiInfo.endPoint + 'langues/' + id, false)
                .then((res: any) => {
                    this.langue = res;
                    this.emitLangue();
                    resolve(true);
                })
                .catch(err => {
                    console.log(err);
                    // this.errorService.insertError('' + err.error.message);
                    resolve(false);
                });
        });
    }
    storeLangue(langue: Langue) {
        return new Promise((resolve) => {
            this.apiMethod.POST('' + this.apiInfo.endPoint + 'langues', langue, false)
                .then((res: any) => {
                    this.langue = res;
                    this.emitLangue();
                    // this.errorService.insertSuccess('Langue created with success !');
                    resolve(true);
                })
                .catch(err => {
                    console.log(err);
                    // this.errorService.insertError('' + err.error.message);
                    resolve(false);
                });
        });
    }
    updateLangue(langue: Langue) {
        return new Promise((resolve) => {
            this.apiMethod.PUT('' + this.apiInfo.endPoint + 'langues/' + langue.id, langue, false)
                .then((res: any) => {
                    this.langue = res;
                    this.emitLangue();
                    // this.errorService.insertSuccess('Langue ' + this.langue.label + ' is update ! ');
                    resolve(true);
                })
                .catch(err => {
                    console.log(err);
                    // this.errorService.insertError('' + err.error.message);
                    resolve(false);
                });
        });
    }
    removeLangue(langue: Langue) {
        return new Promise((resolve) => {
            this.apiMethod.DELETE('' + this.apiInfo.endPoint + 'langues/' + langue.id, false)
                .then((res: any) => {
                    // this.errorService.insertSuccess('Langue ' + this.langue.label + ' is deleted !');
                    resolve(true);
                })
                .catch(err => {
                    console.log(err);
                    // this.errorService.insertError('' + err.error.message);
                    resolve(false);
                });
        });
    }
}
