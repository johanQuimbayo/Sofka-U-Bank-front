import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalModalComponent } from './withdrawal-modal.component';

describe('WithdrawalModalComponent', () => {
  let component: WithdrawalModalComponent;
  let fixture: ComponentFixture<WithdrawalModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawalModalComponent]
    });
    fixture = TestBed.createComponent(WithdrawalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
