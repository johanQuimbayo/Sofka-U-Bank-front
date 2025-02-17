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


  getHistoryEvents():  Observable<HistoryEventsResponse[]> {
    return this.http.get<HistoryEventsResponse[]>(`${this.apiUrl}/audit`);
  }


}
