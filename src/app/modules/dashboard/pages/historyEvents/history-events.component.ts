import { Component, OnInit } from '@angular/core';
import { HistoryEventsResponse } from '../../../../models/history/response/history.response.interface';
import { HistoryEventsService } from '../../../../services/historyEvents/history-events.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-historyEvents',
  templateUrl: './history-events.component.html',
  styleUrls: ['./history-events.component.css']
})
export class HistoryEventsComponent implements OnInit {

  historyEvents: HistoryEventsResponse[] = [];
  selectedFilter: string = 'transacion'; // Valor por defecto

  constructor(private historyEventsService: HistoryEventsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadHistoryEvents();
  }

  loadHistoryEvents(): void {
    this.historyEventsService.getHistoryEventsByType(this.selectedFilter).subscribe(data => {
      this.historyEvents = data;
    });
  }

  getUserName(): string | null {
    return this.authService.getUserName();
  }

  getUserDocumentNumber(): string | null {
    return this.authService.getDocumentNumber();
  }
}
