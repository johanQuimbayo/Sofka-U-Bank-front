import { Component } from '@angular/core';
import {SpinnerService} from "../../service/spinner.service";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  loading = this.loadingService.loading;

  constructor(private loadingService: SpinnerService) {}
}
