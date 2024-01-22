import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
declare var window: any;
declare var $: any;
@Component({
  selector: 'app-dom-round-trip-flight-result',
  templateUrl: './dom-round-trip-flight-result.component.html',
  styleUrls: ['./dom-round-trip-flight-result.component.css','../../../../assets/dist/css/custom.css']
})
export class DomRoundTripFlightResultComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document,public shareService:ShareService,private router: Router,
  private authService: AuthService,
  private toastrService: ToastrService) { }

  ngOnInit(): void {
  }
  @Input() data: any[] = [];
  @Input() isAgentFare: Boolean | undefined;
  @Input() isShowFilter:any;
  first_leg_index = 0;
  last_leg_index = 0;
  first_leg:any;
  last_leg:any;
  first_leg_selectFlightBatch (id:any){
    this.first_leg_index = id;
    this.first_leg = this.data[0][id];
  }
  last_leg_selectFlightBatch(id:any){
    this.last_leg_index = id;
    this.last_leg = this.data[1][id];
  }
  toggleAngleUpDown(temp:number) {
    let collapseShow = this.document.getElementById('flush-collapseOne');
    if (collapseShow?.classList.contains('iconUp')) {
      $("#angleUpDown").addClass("fa-angle-down");
      $("#angleUpDown").removeClass("fa-angle-up");
      collapseShow?.classList.remove('iconUp');
      collapseShow?.classList.add('iconDown');
    } else {
      $("#angleUpDown").removeClass("fa-angle-down");
      $("#angleUpDown").addClass("fa-angle-up");
      collapseShow?.classList.add('iconUp');
      collapseShow?.classList.remove('iconDown');
    }
    if(temp==2)
    {
      $("#summary_flight_details").removeClass("active");
      $("#summary_faredetails").addClass("active");
      $("#summary_flight_details").removeClass("show");
      $("#summary_faredetails").addClass("show");
      $("#summary_flight_details-tab").removeClass("active");
      $("#summary_faredetails-tab").addClass("active");
    }
    else
    {
      $("#summary_flight_details").addClass("active");
      $("#summary_faredetails").removeClass("active");
      $("#summary_flight_details").addClass("show");
      $("#summary_faredetails").removeClass("show");
      $("#summary_flight_details-tab").addClass("active");
      $("#summary_faredetails-tab").removeClass("active");
    }
  }
  getTotalAmount(first:any, last:any){
    return parseFloat(first.replace(/,/g, ''))+parseFloat(last.replace(/,/g, ''));
  }
  bookFlightDetails:any[]=[];
  bookAndHoldAction(){
    if(this.first_leg){
      this.bookFlightDetails.push(this.first_leg);
    }
    if(this.last_leg){
      this.bookFlightDetails.push(this.last_leg);
    }
    const navigationExtras: NavigationExtras = {
      state: {
        selectedCommonFlight: this.bookFlightDetails
      }
    };
    this.router.navigate(['/home/book-and-hold'], navigationExtras);
  }
  requestAction(){
    if(this.first_leg){
      this.bookFlightDetails.push(this.first_leg);
    }
    if(this.last_leg){
      this.bookFlightDetails.push(this.last_leg);
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
  makeProposalDataSet()
  {
    try{
        let bookFlightDetails=[];
        
        if(this.first_leg){
          bookFlightDetails.push(this.first_leg);
        }
        if(this.last_leg){
          bookFlightDetails.push(this.last_leg);
        }
        console.log("Data::");
        console.log(bookFlightDetails);
        localStorage.setItem('flightType','RoundTrip');
        localStorage.setItem('proposalData',JSON.stringify(bookFlightDetails));
        const customEvent = new Event('proposalModalShown');
        document.dispatchEvent(customEvent);
        $('#proposalModal').modal('show');
      }catch(exp){

      }
  }
}
