import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { User } from '../users/user-list/models/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  loginUser(username: string, password: string): Observable<any> {
    return of({});
  }
}
