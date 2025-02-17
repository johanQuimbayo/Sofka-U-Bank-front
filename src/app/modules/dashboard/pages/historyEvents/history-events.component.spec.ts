import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryEventsComponent } from './history-events.component';

describe('HistoryComponent', () => {
  let component: HistoryEventsComponent;
  let fixture: ComponentFixture<HistoryEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryEventsComponent]
    });
    fixture = TestBed.createComponent(HistoryEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
