import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/_services/share.service';
import { LoaderService } from '../../_services/loader.service';
@Component({
  selector: 'app-flight-details-modal',
  templateUrl: './flight-details-modal.component.html',
  styleUrls: ['./flight-details-modal.component.css']
})
export class FlightDetailsModalComponent implements OnInit {
  @Input() data:any[]=[];
  IntMulticity!: "CF748349-6049-4F33-AA7D-A1EB7440C33B";
  constructor(public shareService:ShareService) {
    // console.log(this.data);
  }

  ngOnInit(): void {

  }

}
