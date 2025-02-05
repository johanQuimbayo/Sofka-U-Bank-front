import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountDetailComponent } from './account-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DepositModalComponent } from '../../components/modals/deposit-modal/deposit-modal.component';
import { WithdrawalModalComponent } from '../../components/modals/withdrawal-modal/withdrawal-modal.component';

describe('AccountDetailComponent', () => {
  let component: AccountDetailComponent;
  let fixture: ComponentFixture<AccountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDetailComponent, DepositModalComponent, WithdrawalModalComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(AccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
