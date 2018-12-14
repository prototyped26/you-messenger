import {User} from './User.model';

export class Message {
    public id: null;
    public label: string = null;
    public user_id: number = null;
    public user_id1: number = null;
    public membre_id: number = null;
    public is_valid: boolean = null;
    public administrateur_id: number = null;
    public created_at: string;
    public user: User = null;
    public administrateur;
    public membre;
    public piece_jointes;
    public rejets;
    constructor() {}
}
