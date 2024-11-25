import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:3000/auth/register';

  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<void> {
    return this.http.post<void>(this.apiUrl, user);
  }
}
