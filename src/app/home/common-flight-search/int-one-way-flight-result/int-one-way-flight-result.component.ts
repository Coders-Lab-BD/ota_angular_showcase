import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { FlightHelperService } from '../../flight-helper.service';
declare var window: any;
declare var $: any;
@Component({
  selector: 'app-int-one-way-flight-result',
  templateUrl: './int-one-way-flight-result.component.html',
  styleUrls: ['./int-one-way-flight-result.component.css', '../../../../assets/dist/css/custom.css']
})
export class IntOneWayFlightResultComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document,public shareService:ShareService,
  private router: Router,public flightHelper:FlightHelperService, private authService: AuthService,
  private toastrService: ToastrService) { }
  @Input() item: any = [];
  @Input() isShowFilter:any;
  @Input() i: any = "";
  @Input() isAgentFare: Boolean | undefined;
  @Output() childEvent = new EventEmitter();
  index = 0;
  bookFlightDetails: any[] = [];
  @ViewChild('scrollableDiv', { static: false })
  scrollableDiv!: ElementRef;

  ngOnInit(): void {
  }
  viewMoreGroupFlight(id:any)
  {
    try{
      const scrollableDiv = this.scrollableDiv.nativeElement;
      const data=this.document.getElementById('topGroup'+id);
      if(!this.shareService.isNullOrEmpty(data))
      {
        if(data?.classList.contains("scroll-height-fix"))
        {
          scrollableDiv.scrollTop = 0;
          data?.classList.add("height-fix");
          data?.classList.remove("scroll-height-fix");
          $("#txt"+id).text("View More Flights");
        } else {
          data?.classList.add("scroll-height-fix");
          data?.classList.remove("height-fix");
          $("#txt"+id).text("Hide More Flights");
        }
      }
    }catch(exp){}
  }
  flightShowHideAction(id:any,i:any, fareDetailsWrap:any, flightDetailsWrap:any)
  {
    const card = this.document.getElementById("flightDetailsWrap"+id);
    const button = this.document.getElementById("flightDetailsShowHide"+id);
    const data = this.document.getElementById('topGroup' + i);

    const FlightButton = this.document.getElementById("flightDetailsShowHide"+id);
    const fareButton = this.document.getElementById("fareDetailsShowHide"+id);
    if ($(flightDetailsWrap + id).css('display') == 'block') {
      $(flightDetailsWrap+id).hide('slow');
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
    }
    else {
      $(flightDetailsWrap + id).show('slow');
      $(fareDetailsWrap + id).hide('slow');
      if(fareButton){
        fareButton.textContent = "View Fare Details";
      }
      if(FlightButton){
        FlightButton.textContent = "Hide Flight Details";
      }
      data?.classList.remove("height-fix");
    }
  }

  fareShowHideAction(id:any,i:any, fareDetailsWrap:any, flightDetailsWrap:any)
  {
    const data = this.document.getElementById('topGroup' + i);
    const FlightButton = this.document.getElementById("flightDetailsShowHide"+id);
    const fareButton = this.document.getElementById("fareDetailsShowHide" + id);

    if ($(fareDetailsWrap + id).css('display') == 'block') {
      $(fareDetailsWrap + id).hide('slow');
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
  selectFlightBatch(i: any) {
    this.index = i;
  }


  bookAndHoldAction(){
    if(this.item.value[this.index]){
      this.bookFlightDetails.push(this.item.value[this.index]);
    }
    const navigationExtras: NavigationExtras = {
      state: {
        selectedCommonFlight: this.bookFlightDetails
      }
    };
    this.router.navigate(['/home/book-and-hold'], navigationExtras);
  }
  requestAction(){
    if(this.item.value[this.index]){
      this.bookFlightDetails.push(this.item.value[this.index]);
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
  makeProposalDataSet(commonFlight:any)
  {
    try{
      console.log("Data::");
      console.log(commonFlight);
      localStorage.setItem('flightType','OneWay');
      localStorage.setItem('proposalData',JSON.stringify(commonFlight));
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
