import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { FlightHelperService } from '../../flight-helper.service';
declare var window: any;
declare var $: any;
@Component({
  selector: 'app-int-multi-city',
  templateUrl: './int-multi-city.component.html',
  styleUrls: ['./int-multi-city.component.css', '../../../../assets/dist/css/custom.css']
})
export class IntMultiCityComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document,public shareService:ShareService,public flightHelper:FlightHelperService, private router: Router,
  private authService: AuthService,
  private toastrService: ToastrService) { }
  @Input() item: any = [];
  @Input() data: any = [];
  @Input() isShowFilter:any;
  @Input() i: any = "";
  @Input() isAgentFare: Boolean | undefined;

  firstFlightLength: number = 0;
  secondFlightLength: number = 0;
  thirdFlightLength: number = 0;
  fourthFlightLength: number = 0;
  first_leg_index:any='00';
  second_leg_index:any='10';
  third_leg_index:any='20';
  fouth_leg_index: any = '30';
  firstDataItem:any = 0;
  secondDataItem:any = 0;
  thirdDataItem:any = 0;
  fourthDataItem:any = 0;
  test:boolean=false;
  ngOnInit(): void {
    this.test=true;
  }

first:any;
second:any;
third:any;
fourth:any;
trips:number = 0;
first_leg_commonflight : any;
second_leg_commonflight : any;
third_leg_commonflight : any;
fourth_leg_commonflight : any;

firstLegcarrierWithFlightNumber:any;
secondLegcarrierWithFlightNumber:any;
thirdLegcarrierWithFlightNumber:any;
fourthLegcarrierWithFlightNumber:any;

firstLegBaggage:any;
secondLegBaggage:any;
thirdLegBaggage:any;
fourthLegBaggage:any;

firstLegProvider:any;
secondLegProvider:any;
thirdLegProvider:any;
fourthLegProvider:any;

firstLegCarrier:any;
secondLegCarrier:any;
thirdLegCarrier:any;
fourthLegCarrier:any;

firstLegSupplierShortName:any;
secondLegSupplierShortName:any;
thirdLegSupplierShortName:any;
fourthLegSupplierShortName:any;

firstLegDepartureCity:any;
firstarrivalCity:any;
firstdepartureDate:any;
lastLegDepartureCity:any;
lastarrivalCity:any;
lastdepartureDate:any;

fareDetails:any = [];
totalFare:any;
totalAgentFare:any;
fareNotFound = false;
bookFlightDetails: any[] = [];
@ViewChild('scrollableDiv', { static: false })
scrollableDiv!: ElementRef;


ngAfterViewInit() {
  this.test=false;
}

viewMoreGroupFlight(id:any)
{
  try {
    const scrollableDiv = this.scrollableDiv.nativeElement;
    const data=this.document.getElementById('topMultiCityGroup'+id);
    if(data?.classList.contains("scroll-height-fix")){
      setTimeout(() => {
        scrollableDiv.scrollTop = 0;
      }, 0);
      data?.classList.add("height-fix");
      data?.classList.remove("scroll-height-fix");
      $("#txt"+id).text("View More Flights");
    } else {
      data?.classList.add("scroll-height-fix");
      data?.classList.remove("height-fix");
      $("#txt"+id).text("Hide More Flights");
    }
  }catch(exp){}
}

incrementFlightLength(index: number) {
  if(this.test){
    if(index==0){
      this.firstFlightLength++;
    }
    else if(index==1){
      this.secondFlightLength++
    }
    else if(index==2){
      this.thirdFlightLength++
    }
    else if(index==3){
      this.fourthFlightLength++
    }
  }
}

selectFlightBatch (index:number, value:number){
  if(index==0){
    this.trips = 1;
    this.first_leg_index = this.getString(index,value);
    this.first = this.item.multiCityTrips[value].trips[index];
    this.first_leg_commonflight = this.first;
    this.firstLegcarrierWithFlightNumber = this.first.carrierWithFlightNumber;
    this.firstLegBaggage = this.first.flightDetails[0].passangerBaggages[0].baggageWeight;
    this.firstLegProvider = this.first.providerName;
    this.firstLegCarrier = this.first.carrier;
    this.firstLegSupplierShortName = this.first.supplierShortName;
  }
  else if(index==1){
    this.trips = 2;
    this.second_leg_index = this.getString(index,value);
    this.second = this.item.multiCityTrips[value].trips[index];
    this.second_leg_commonflight = this.second;
    this.secondLegcarrierWithFlightNumber = this.second.carrierWithFlightNumber;
    this.secondLegBaggage = this.second.flightDetails[0].passangerBaggages[0].baggageWeight;
    this.secondLegProvider = this.second.providerName;
    this.secondLegCarrier = this.second.carrier;
    this.secondLegSupplierShortName = this.second.supplierShortName;
  }
  else if(index==2){
    this.trips = 3;
    this.third_leg_index = this.getString(index,value);
    this.third = this.item.multiCityTrips[value].trips[index];
    this.third_leg_commonflight = this.third;
    this.thirdLegcarrierWithFlightNumber = this.third.carrierWithFlightNumber;
    this.thirdLegBaggage = this.third.flightDetails[0].passangerBaggages[0].baggageWeight;
    this.thirdLegProvider = this.third.providerName;
    this.thirdLegCarrier = this.third.carrier;
    this.thirdLegSupplierShortName = this.third.supplierShortName;
  }
  else if(index==3){
    this.trips = 4;
    this.fouth_leg_index = this.getString(index,value);
    this.fourth = this.item.multiCityTrips[value].trips[index];
    this.fourth_leg_commonflight = this.fourth;
    this.fourthLegcarrierWithFlightNumber = this.fourth.carrierWithFlightNumber;
    this.fourthLegBaggage = this.fourth.flightDetails[0].passangerBaggages[0].baggageWeight;
    this.fourthLegProvider = this.fourth.providerName;
    this.fourthLegCarrier = this.fourth.carrier;
    this.fourthLegSupplierShortName = this.fourth.supplierShortName;
  }
  this.farechange();
}

getString(dataitem:number,j:number){
  return dataitem.toString()+j.toString();
}

flightShowHideAction(id:any, fareDetailsWrap:any, flightDetailsWrap:any)
{
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
  }
}

fareShowHideAction(id:any,fareDetailsWrap:any, flightDetailsWrap:any)
{
  this.farechange();
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

farechange() {
  let found = false;

  this.data.some((item: { multiCityTrips: any; value: any[] }) => {
    for (const element of item.multiCityTrips) {
      if (
        element.trips[0]?.providerName === this.firstLegProvider &&
        element.trips[1]?.providerName === this.secondLegProvider &&
        element.trips[2]?.providerName === this.thirdLegProvider &&
        element.trips[3]?.providerName === this.fourthLegProvider &&

        element.trips[0]?.carrier === this.firstLegCarrier &&
        element.trips[1]?.carrier === this.secondLegCarrier &&
        element.trips[2]?.carrier === this.thirdLegCarrier &&
        element.trips[3]?.carrier === this.fourthLegCarrier &&

        element.trips[0]?.carrierWithFlightNumber === this.firstLegcarrierWithFlightNumber &&
        element.trips[1]?.carrierWithFlightNumber === this.secondLegcarrierWithFlightNumber &&
        element.trips[2]?.carrierWithFlightNumber === this.thirdLegcarrierWithFlightNumber &&
        element.trips[3]?.carrierWithFlightNumber === this.fourthLegcarrierWithFlightNumber &&

        element.trips[0]?.supplierShortName === this.firstLegSupplierShortName &&
        element.trips[1]?.supplierShortName === this.secondLegSupplierShortName &&
        element.trips[2]?.supplierShortName === this.thirdLegSupplierShortName &&
        element.trips[3]?.supplierShortName === this.fourthLegSupplierShortName &&

        element.trips[0]?.flightDetails[0].passangerBaggages[0].baggageWeight === this.firstLegBaggage &&
        element.trips[1]?.flightDetails[0].passangerBaggages[0].baggageWeight === this.secondLegBaggage &&
        element.trips[2]?.flightDetails[0].passangerBaggages[0].baggageWeight === this.thirdLegBaggage &&
        element.trips[3]?.flightDetails[0].passangerBaggages[0].baggageWeight === this.fourthLegBaggage

      ) {
        this.totalFare = element.trips[0].totalFare;
        this.totalAgentFare = element.trips[0].totalAgentFare;
        this.fareDetails = element.trips[0].fareDetails;
        found = true;
        this.fareNotFound = false;
        break; // Break out of the for loop
      }
      else{
        this.fareNotFound = true;
      }
    }

    return found; // If found is true, break out of the some loop
  });
  if (!found) {
    this.fareDetails = null; // Set this.fareDetails to null when not found
  }
}

bookAndHoldAction(){
  this.bookFlightDetails = [];
  if(this.first){
    let firstLeg = this.first;
    firstLeg.fareDetails = this.fareDetails;
    this.bookFlightDetails.push(firstLeg);
  }
  if(this.second){
    let secondLeg = this.second;
    secondLeg.fareDetails = this.fareDetails;
    this.bookFlightDetails.push(secondLeg);
  }
  if(this.third){
    let thirdLeg = this.third;
    thirdLeg.fareDetails = this.fareDetails;
    this.bookFlightDetails.push(thirdLeg);
  }
  if(this.fourth){
    let fourthLeg = this.fourth;
    fourthLeg.fareDetails = this.fareDetails;
    this.bookFlightDetails.push(fourthLeg);
  }
  const navigationExtras: NavigationExtras = {
    state: {
      selectedCommonFlight: this.bookFlightDetails
    }
  };
  this.router.navigate(['/home/book-and-hold'], navigationExtras);
}

requestAction(){
  if(this.first){
    this.bookFlightDetails.push(this.first);
  }
  if(this.second){
    this.bookFlightDetails.push(this.second);
  }
  if(this.third){
    this.bookFlightDetails.push(this.third);
  }
  if(this.fourth){
    this.bookFlightDetails.push(this.fourth);
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
      if(this.first){
        let firstLeg = this.first;
        firstLeg.fareDetails = this.fareDetails;
        bookFlightDetails.push(firstLeg);
      }
      if(this.second){
        let secondLeg = this.second;
        secondLeg.fareDetails = this.fareDetails;
        bookFlightDetails.push(secondLeg);
      }
      if(this.third){
        let thirdLeg = this.third;
        thirdLeg.fareDetails = this.fareDetails;
        bookFlightDetails.push(thirdLeg);
      }
      if(this.fourth){
        let fourthLeg = this.fourth;
        fourthLeg.fareDetails = this.fareDetails;
        bookFlightDetails.push(fourthLeg);
      }
      console.log("Data::");
      console.log(bookFlightDetails);
      localStorage.setItem('flightType','Multi');
      localStorage.setItem('proposalData',JSON.stringify(bookFlightDetails));
      const customEvent = new Event('proposalModalShown');
      document.dispatchEvent(customEvent);
      $('#proposalModal').modal('show');
    }catch(exp){

    }
}
}
