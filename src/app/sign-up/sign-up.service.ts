import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleEnum } from '../users/user-list/models/user';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor() {}

  registerUser(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    role: RoleEnum,
    phone?: number
  ): Observable<any> {
    return of({});
  }
}
