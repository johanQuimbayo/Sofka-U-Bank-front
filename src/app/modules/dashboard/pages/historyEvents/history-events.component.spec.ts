import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryEventsComponent } from './history-events.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('HistoryComponent', () => {
  let component: HistoryEventsComponent;
  let fixture: ComponentFixture<HistoryEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryEventsComponent],
      imports: [ HttpClientTestingModule, FormsModule ]
    });
    fixture = TestBed.createComponent(HistoryEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
