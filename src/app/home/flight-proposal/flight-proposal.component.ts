import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { LoaderService } from '../../_services/loader.service';
import { FlightHelperService } from '../flight-helper.service';
import { Priceinfo } from '../priceinfo';
declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-flight-proposal',
  templateUrl: './flight-proposal.component.html',
  styleUrls: ['./flight-proposal.component.css']
})
export class FlightProposalComponent implements OnInit {

  @Input() data:any=[];
  constructor(public flightHelper:FlightHelperService,
    public shareService:ShareService,public authService:AuthService,
    private fb: FormBuilder,private router: Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
    // console.log("Proposal:"+this.data);
  }

}
