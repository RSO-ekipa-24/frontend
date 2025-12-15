import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Tag} from '../models/tag.model';
import {environment} from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = `${environment.apiUrl}/tags`;

  constructor() {
  }

  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.baseUrl);
  }

  create(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.baseUrl, tag);
  }

  update(tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(this.baseUrl, tag);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
