import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  constructor() {
  }

  public getCurrentUser() {
    return this.http.get(`${this.baseUrl}/me`);
  }
}
