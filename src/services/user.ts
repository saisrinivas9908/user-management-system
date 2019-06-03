import { Injectable } from '@angular/core';
import { UserData } from 'src/models/userData';
import { Subject } from 'rxjs';

@Injectable()
export class UserService {
    startEdit = new Subject<string>();
    itemAdded = new Subject<UserData>();
    itemChanged = new Subject<UserData>();
    itemDeleted = new Subject<String>();
    allData = [];

    constructor() {}
    
    createUser(userData: UserData) {
        localStorage.setItem(userData.email, JSON.stringify(userData));
    }

    getUser(email: string) {
        return JSON.parse(localStorage.getItem(email));
    }

    getAllUsers() {
        for (var i=0; i < localStorage.length; i++) {
            var sKey = localStorage.key(i);
            this.allData.push(JSON.parse(localStorage.getItem(sKey)));
        }
        return this.allData;
    }

    updateUser(email: string, userData: UserData) {
        localStorage.setItem(email, JSON.stringify(userData));
    }

    deleteUser(email: string) {
        console.log(email);
        localStorage.removeItem(email);
    }
}