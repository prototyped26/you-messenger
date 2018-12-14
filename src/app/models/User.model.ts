import {Langue} from './Langue.model';

export class User {
    public id: number = null;
    public telephone: string = null;
    public nom: string = null;
    public prenom: string = null;
    public photo: string = null;
    public pseudo: string = null;
    public langue_id: number = null;
    public langue: Langue;
    constructor() {}
}
