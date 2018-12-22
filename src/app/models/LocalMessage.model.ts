import {User} from './User.model';
import {MessageInfo} from './MessageInfo.interface';

export class LocalMessageModel {
    public user: User = null;
    public isTyping = false;
    public messages: Array<MessageInfo> = [];
    public lastMessage: Date = null;
    constructor() {}
}
