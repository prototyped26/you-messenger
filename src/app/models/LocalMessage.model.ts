import {User} from './User.model';
import {MessageInfo} from './MessageInfo.interface';

export class LocalMessageModel {
    public user: User = null;
    public messages: Array<MessageInfo> = [];
    constructor() {}
}
