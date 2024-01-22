import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ShareService } from 'src/app/_services/share.service';
// import { FlightHelperService } from '../flight-helper.service';
import { NavigationExtras, Router } from '@angular/router';
import { FlightHelperService } from '../../flight-helper.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ToastrService } from 'src/app/_services/toastr.service';
declare var window: any;
declare var $: any;
@Component({
  selector: 'app-dom-one-way-flight-result',
  templateUrl: './dom-one-way-flight-result.component.html',
  styleUrls: ['./dom-one-way-flight-result.component.css', '../../../../assets/dist/css/custom.css']
})
export class DomOneWayFlightResultComponent implements OnInit {
  @Input() item: any = [];
  @Input() isShowFilter:any;
  @Input() i: any = "";
  @Input() isAgentFare: Boolean | undefined;
  @Output() childEvent = new EventEmitter();
  constructor(@Inject(DOCUMENT) private document: Document,
  public shareService:ShareService,public flightHelper:FlightHelperService,
  private router: Router, private authService: AuthService,
  private toastrService: ToastrService) { }
  ngOnInit(): void {
  }
  flightShowHideAction(id:any, fareDetailsWrap:any, flightDetailsWrap:any)
  {
    const data = this.document.getElementById('topGroup' + id);

    const FlightButton = this.document.getElementById("flightDetailsShowHide"+id);
    const fareButton = this.document.getElementById("fareDetailsShowHide"+id);
    if ($(flightDetailsWrap + id).css('display') == 'block') {
      $(flightDetailsWrap+id).hide('slow');
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
    }
    else {
      $(fareDetailsWrap + id).hide('slow');
      $(flightDetailsWrap + id).show('slow');
      if(fareButton){
        fareButton.textContent = "View Fare Details";
      }
      if(FlightButton){
        FlightButton.textContent = "Hide Flight Details";
      }
      data?.classList.remove("height-fix");
    }
  }

  fareShowHideAction(id:any,fareDetailsWrap:any, flightDetailsWrap:any)
  {
    const FlightButton = this.document.getElementById("flightDetailsShowHide"+id);
    const fareButton = this.document.getElementById("fareDetailsShowHide" + id);
    const data = this.document.getElementById('topGroup' + id);
    if ($(fareDetailsWrap + id).css('display') == 'block') {
      $(fareDetailsWrap+id).hide('slow');
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
      if(fareButton){
        fareButton.textContent = "View Fare Details";
      }
    }
    else {
      $(fareDetailsWrap + id).show('slow');
      $(flightDetailsWrap + id).hide('slow');
      if(fareButton){
        fareButton.textContent = "Hide Fare Details";
      }
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
      data?.classList.remove("height-fix");
    }
  }
  bookFlightDetails:any[]=[];
  bookAndHoldAction(item:any){
    if(item){
      this.bookFlightDetails.push(item);
    }
    const navigationExtras: NavigationExtras = {
      state: {
        selectedCommonFlight: this.bookFlightDetails
      }
    };
    this.router.navigate(['/home/book-and-hold'], navigationExtras);
  }
  requestAction(item:any){
    if(item){
      this.bookFlightDetails.push(item);
    }
    console.log(this.bookFlightDetails);
    var bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')!);
    bookingDetails.fligtDetails = this.bookFlightDetails;
    console.log(bookingDetails);
    this.authService.reIssueRequestedByAgency(bookingDetails).subscribe( data=>{
      console.log(data.data);
      if(data.data.statusCode == 200 ){
        this.toastrService.success("Success",data.data.message);
        const navigationExtras: NavigationExtras = {
          state: {
            bookingId: data.data.data
          }
        };
        this.router.navigate(['/home/book-and-hold-details'], navigationExtras);
      }
    },error=>{
      this.toastrService.error('Error', 'Request failed');
    });
  }

  makeProposalDataSet(item:any)
  {
    try{
        let bookFlightDetails=[];
        
        if(item){
          bookFlightDetails.push(item);
        }
        console.log("Data::");
        console.log(bookFlightDetails);
        localStorage.setItem('flightType','OneWay');
        localStorage.setItem('proposalData',JSON.stringify(bookFlightDetails));
        const customEvent = new Event('proposalModalShown');
        document.dispatchEvent(customEvent);
        $('#proposalModal').modal('show');
      }catch(exp){

      }
  }
  penalties:any;
  dateChangeApi(item:any){
    this.penalties = '';
    this.authService.GetPenalties(item).subscribe( data=>{
      console.log(data.data);
      this.penalties = data.data;
    },error=>{
      this.toastrService.error('Error', 'Request failed');
    });
  }
  getPenalties() {
    this.childEvent.emit(this.penalties);
  }
}
