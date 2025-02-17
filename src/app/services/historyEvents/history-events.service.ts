import { Injectable } from '@angular/core';
import {HistoryEventsResponse} from "../../models/history/response/history.response.interface";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class HistoryEventsService {

  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient,) { }


  getHistoryEventsByType(type: string, page: number = 0, size: number = 10): Observable<HistoryEventsResponse[]> {
    return this.http.get<HistoryEventsResponse[]>(`${this.apiUrl}/messages/byRecurso/${type}?page=${page}&size=${size}`);
  }


}
