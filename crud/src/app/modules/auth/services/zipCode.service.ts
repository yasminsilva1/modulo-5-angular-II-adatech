import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZipCodeService {
  private apiUrl = `https://viacep.com.br/ws`;

  constructor(private http: HttpClient) {}

  getAddressByZipCode(zipCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${zipCode}/json`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
