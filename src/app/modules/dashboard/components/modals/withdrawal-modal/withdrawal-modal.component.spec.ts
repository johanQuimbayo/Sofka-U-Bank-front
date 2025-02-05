import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalModalComponent } from './withdrawal-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('WithdrawalModalComponent', () => {
  let component: WithdrawalModalComponent;
  let fixture: ComponentFixture<WithdrawalModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawalModalComponent],
      imports: [FormsModule, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(WithdrawalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
