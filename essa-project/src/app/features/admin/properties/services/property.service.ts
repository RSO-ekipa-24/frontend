import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Property} from '../models/property.model';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = `${environment.apiUrl}/properties`;

  constructor() {
  }

  getAll(): Observable<Property[]> {
    return this.http.get<Property[]>(this.baseUrl);
  }

  getPersonal(): Observable<Property[]> {
    return this.http.get<Property[]>(`${environment.apiUrl}/users/properties`);
  }

  create(property: Property): Observable<Property> {
    const payload = {
      ...property,
      tags: property.tags?.map(tag => tag.id) ?? []
    };
    return this.http.post<Property>(this.baseUrl, payload);
  }

  update(property: Property): Observable<Property> {
    const payload = {
      ...property,
      tags: property.tags?.map(tag => tag.id) ?? []
    };
    return this.http.put<Property>(this.baseUrl, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
