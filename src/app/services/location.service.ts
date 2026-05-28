import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CountryResponse {
  error: boolean;
  msg: string;
  data: { iso2: string; iso3: string; country: string; cities: string[] }[];
}

export interface StateResponse {
  error: boolean;
  msg: string;
  data: { name: string; states: { name: string; state_code: string }[] };
}

export interface CityResponse {
  error: boolean;
  msg: string;
  data: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);
  private baseUrl = 'https://countriesnow.space/api/v0.1/countries';

  getCountries(): Observable<string[]> {
    return this.http.get<CountryResponse>(this.baseUrl).pipe(
      map(res => res.data.map(item => item.country).sort())
    );
  }

  getStates(country: string): Observable<string[]> {
    return this.http.post<StateResponse>(`${this.baseUrl}/states`, { country }).pipe(
      map(res => res.data.states.map(state => state.name).sort())
    );
  }

  getCities(country: string, state: string): Observable<string[]> {
    return this.http.post<CityResponse>(`${this.baseUrl}/state/cities`, { country, state }).pipe(
      map(res => res.data.sort())
    );
  }
}
