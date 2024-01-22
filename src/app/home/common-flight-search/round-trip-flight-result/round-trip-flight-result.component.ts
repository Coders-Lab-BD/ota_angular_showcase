import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
declare var window: any;
declare var $: any;
@Component({
  selector: 'app-round-trip-flight-result',
  templateUrl: './round-trip-flight-result.component.html',
  styleUrls: ['./round-trip-flight-result.component.css', '../../../../assets/dist/css/custom.css']
})
export class RoundTripFlightResultComponent implements OnInit {
  @Input() item: any = [];
  @Input() data: any = [];
  @Input() isShowFilter:any;
  @Input() i: any = "";
  @Input() isAgentFare: Boolean | undefined;
  public stateAnimateFlightDetails: boolean;
  public stateAnimateFareDetails: boolean;
  first_leg_index = 0;
  last_leg_index = 0;
  first_leg_commonflight : any;
  last_leg_commonflight : any;
  constructor(@Inject(DOCUMENT) private document: Document, public shareService: ShareService,private router: Router,
  private authService: AuthService,
  private toastrService: ToastrService) {
    this.stateAnimateFlightDetails = false;
    this.stateAnimateFareDetails = false;
  }

  firstLegcarrierWithFlightNumber:any;
  lastLegcarrierWithFlightNumber:any;
  firstLegBaggage:any;
  lastLegBaggage:any;
  firstLegProvider:any;
  providerShortName:any;
  lastLegProvider:any;
  firstLegCarrier:any;
  lastLegCarrier:any;
  firstLegDepartureCity:any;
  firstarrivalCity:any;
  firstdepartureDate:any;
  lastLegDepartureCity:any;
  lastarrivalCity:any;
  lastdepartureDate:any;
  totalFare:number=0;
  totalAgentFare:number=0;
  fareDetails: any = [];
  @ViewChild('scrollableDiv', { static: false })
  scrollableDiv!: ElementRef;
  bookFlightDetails:any[]=[];
  fareNotFound = true;
  fareFound = false;
  processing = true;
  bookAndHold: BookAndHold | any;
  adultDetailsArray: PassDetails[] = [];

  ngOnInit(): void {
    this.item.value[0].firstLeg.fareDetails.forEach((element: any) => {
      this.totalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
      this.totalAgentFare += parseFloat(element.totalAgentFare)*parseFloat(element.passengerNumber);
    });
    this.first_leg_commonflight = this.item.value[0];
    this.firstLegcarrierWithFlightNumber = this.item.value[0].firstLeg.carrierWithFlightNumber;
    this.firstLegBaggage = this.item.value[0].firstLeg.flightDetails[0].passangerBaggages[0].baggageWeight;
    this.firstLegProvider = this.item.value[0].firstLeg.providerName;
    this.firstLegCarrier = this.item.value[0].firstLeg.carrier;
    this.providerShortName = this.item.value[0].firstLeg.supplierShortName;

    this.last_leg_commonflight = this.item.value[0];
    this.lastLegcarrierWithFlightNumber = this.item.value[0].lastLeg.carrierWithFlightNumber;
    this.lastLegBaggage = this.item.value[0].lastLeg.flightDetails[0].passangerBaggages[0].baggageWeight;
    this.lastLegProvider = this.item.value[0].lastLeg.providerName;
    this.lastLegCarrier = this.item.value[0].lastLeg.carrier;
  }

  viewMoreGroupFlight(id:any,item:any)
  {
    try {
      const scrollableDiv = this.scrollableDiv.nativeElement;
      // resultSingleAllId
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

  first_leg_selectFlightBatch(commonflight:any, id:any){
    this.first_leg_index = id;
    this.first_leg_commonflight = commonflight;
    this.firstLegcarrierWithFlightNumber = commonflight.firstLeg.carrierWithFlightNumber;
    this.firstLegBaggage = commonflight.firstLeg.flightDetails[0].passangerBaggages[0].baggageWeight;
    this.firstLegProvider = commonflight.firstLeg.providerName;
    this.firstLegCarrier = commonflight.firstLeg.carrier;
    this.providerShortName = commonflight.firstLeg.supplierShortName;
    this.farechange();
    if (this.fareDetails) {
      this.totalFare = 0;
      this.totalAgentFare = 0;
      this.fareDetails.forEach((element: any) => {
        this.totalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
        this.totalAgentFare += parseFloat(element.totalAgentFare)*parseFloat(element.passengerNumber);
      });
    }
  }

  last_leg_selectFlightBatch(commonflight:any, id:any){
    this.last_leg_index = id;
    this.last_leg_commonflight = commonflight;
    this.lastLegcarrierWithFlightNumber = commonflight.lastLeg.carrierWithFlightNumber;
    this.lastLegBaggage = commonflight.lastLeg.flightDetails[0].passangerBaggages[0].baggageWeight;
    this.lastLegProvider = commonflight.lastLeg.providerName;
    this.lastLegCarrier = commonflight.lastLeg.carrier;
    this.providerShortName = commonflight.lastLeg.supplierShortName;
    this.farechange();
    if (this.fareDetails) {
      this.totalFare = 0;
      this.totalAgentFare = 0;
      this.fareDetails.forEach((element: any) => {
        this.totalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
        this.totalAgentFare += parseFloat(element.totalAgentFare)*parseFloat(element.passengerNumber);
      });
    }
  }

  fareShowHideAction(id:any, faredet:any, flightdet:any){
    this.farechange();
    if (this.fareDetails) {
      this.totalFare = 0;
      this.totalAgentFare = 0;
      this.fareDetails.forEach((element: any) => {
        this.totalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
        this.totalAgentFare += parseFloat(element.totalAgentFare)*parseFloat(element.passengerNumber);
      });
    }
    const card = this.document.getElementById("faredet"+id);
    const FlightButton = this.document.getElementById("flightDetailsShowHide"+id);
    const fareButton = this.document.getElementById("fareDetailsShowHide"+id);
    const data = this.document.getElementById('topGroup' + id);
    if ($(faredet + id).css('display') == 'block') {
      $(faredet+id).hide('slow');
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
      if(fareButton){
        fareButton.textContent = "View Fare Details";
      }
    }
    else {
      $(flightdet + id).hide('slow');
      $(faredet + id).show('slow');
      if(fareButton){
        fareButton.textContent = "Hide Fare Details";
      }
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
    }
  }

  findFareDetails(
    providerName: string,
    providerShortName: string,
    firstLegCarrier: string,
    lastLegCarrier: string,
    firstLegCarrierWithFlightNumber: string,
    lastLegCarrierWithFlightNumber: string,
    firstLegBaggage: number,
    lastLegBaggage: number,
    condition: (element: any) => boolean
  ): any {
    let fareDetails = null;

    this.data.some((item: { value: any[] }) => {
      return item.value.some((element: { firstLeg: any; lastLeg: any }) => {
          this.firstLegDepartureCity = element.firstLeg?.departureCity;
          this.firstarrivalCity = element.firstLeg?.arrivalCity;
          this.firstdepartureDate = element.firstLeg?.departureDate;
          this.lastLegDepartureCity = element.lastLeg?.departureCity;
          this.lastarrivalCity = element.lastLeg?.arrivalCity;
          this.lastdepartureDate = element.lastLeg?.departureDate;
        if (
          element.firstLeg?.providerName === providerName &&
          element.lastLeg?.providerName === providerName &&
          this.lastLegCarrier === lastLegCarrier &&
          this.firstLegCarrier === firstLegCarrier &&
          element.firstLeg?.carrierWithFlightNumber === firstLegCarrierWithFlightNumber &&
          element.lastLeg?.carrierWithFlightNumber === lastLegCarrierWithFlightNumber &&
          element.firstLeg?.supplierShortName === providerShortName &&
          condition(element)
        ) {
          this.fareFound = false;
          this.fareNotFound = true;
          fareDetails = element.firstLeg.fareDetails;
          return true; // Break the loop
        }
        this.fareFound = true;
        this.fareNotFound = true;
        return false; // Continue searching
      });
    });

    return fareDetails;
  }

  farechange() {
    if (
      this.firstLegcarrierWithFlightNumber &&
      this.lastLegcarrierWithFlightNumber &&
      this.firstLegBaggage &&
      this.lastLegBaggage &&
      this.firstLegProvider &&
      this.lastLegProvider
    ) {
      this.fareDetails = this.findFareDetails(
        this.firstLegProvider,
        this.providerShortName,
        this.firstLegCarrier,
        this.lastLegCarrier,
        this.firstLegcarrierWithFlightNumber,
        this.lastLegcarrierWithFlightNumber,
        this.firstLegBaggage,
        this.lastLegBaggage,
        (element: any) =>
          element.firstLeg?.flightDetails[0]?.passangerBaggages[0]?.baggageWeight === this.firstLegBaggage &&
          element.lastLeg?.flightDetails[0]?.passangerBaggages[0]?.baggageWeight === this.lastLegBaggage
      );

      if (!this.fareDetails) {
        //this.lastiteration();
        this.processing = false;
        this.GetFareDetailsByFareBasisCode();
      }
    }
  }

  GetFareDetailsByFareBasisCode(){
    this.adultDetailsArray = [];
    var model = JSON.parse(localStorage.getItem('loaderData')!);
    var totalAdult = parseFloat(model.adult);
    var totalInfant = parseFloat(model.infant);
    var totalChild = parseFloat(model.childList.length);
    for (let i = 0; i < totalAdult; i++) {
    const passDetail: PassDetails = {
      passangerType : PassangerTypes.Adult
    };
    this.adultDetailsArray.push(passDetail);
    }

    for (let i = 0; i < totalChild; i++) {
      const passDetail: PassDetails = {
        passangerType : PassangerTypes.Child
      };

      this.adultDetailsArray.push(passDetail);
    }

    for (let i = 0; i < totalInfant; i++) {
      const passDetail: PassDetails = {
        passangerType : PassangerTypes.Infant
      };

      this.adultDetailsArray.push(passDetail);
    }
    var flightType;
    if(model.isOneWay){
      flightType=FlightTypes.OneWay;
    }else if(model.isRoundTrip){
      flightType=FlightTypes.RoundTrip;
    }else if(model.isMultiCity){
      flightType=FlightTypes.Multicity;
    }

    let bookFlightDetails=[];
    if(this.item.value[this.first_leg_index].firstLeg){
      let firstLeg = this.item.value[this.first_leg_index].firstLeg;
      firstLeg.fareDetails = this.fareDetails;
      bookFlightDetails.push(firstLeg);
    }
    if(this.item.value[this.last_leg_index].lastLeg){
      let lastLeg = this.item.value[this.last_leg_index].lastLeg;
      lastLeg.fareDetails = this.fareDetails;
      bookFlightDetails.push(lastLeg);
    }

    this.bookAndHold = {
      passangers: [],
      tripType: '',
      flightTypes: '',
      flightDetails: '',
      agencyPhone: '',
      agencyEmail: '',
      agencyId: '',
      IsRevalidated: false
    };

    this.bookAndHold.passangers = this.adultDetailsArray;
    this.bookAndHold.flightDetails = JSON.stringify(bookFlightDetails);
    this.bookAndHold.flightTypes = flightType;

    this.authService.GetFareDetailsByFareBasisCode(this.bookAndHold).subscribe( data=>{
      this.totalFare = 0;
      this.totalAgentFare = 0;
      this.fareFound = true;
      this.fareNotFound = true;
      this.processing = true;
      try{
        this.fareDetails = data.data[0].firstLeg.fareDetails;
        this.fareDetails.forEach((element: any) => {
          this.totalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
          this.totalAgentFare += parseFloat(element.totalAgentFare)*parseFloat(element.passengerNumber);
        });
        this.fareFound = false;
      }catch(ex){
        this.fareNotFound = false;
      }
    },error=>{
      this.fareNotFound = false;
      this.toastrService.error('Error', 'Request failed');
    });
  }

  lastiteration() {
    if (
      this.firstLegcarrierWithFlightNumber &&
      this.lastLegcarrierWithFlightNumber &&
      this.firstLegBaggage &&
      this.lastLegBaggage &&
      this.firstLegProvider &&
      this.lastLegProvider
    ) {
      this.fareDetails = this.findFareDetails(
        this.firstLegProvider,
        this.providerShortName,
        this.firstLegCarrier,
        this.lastLegCarrier,
        this.firstLegcarrierWithFlightNumber,
        this.lastLegcarrierWithFlightNumber,
        this.firstLegBaggage,
        this.lastLegBaggage,
        (element: any) =>
          element.firstLeg?.flightDetails[0]?.passangerBaggages[0]?.baggageWeight >= this.firstLegBaggage &&
          element.lastLeg?.flightDetails[0]?.passangerBaggages[0]?.baggageWeight >= this.lastLegBaggage
      );

      if (!this.fareDetails) {
        this.lastiteration2();
      }
    }
  }

  lastiteration2() {
    if (
      this.firstLegcarrierWithFlightNumber &&
      this.lastLegcarrierWithFlightNumber &&
      this.firstLegBaggage &&
      this.lastLegBaggage &&
      this.firstLegProvider &&
      this.lastLegProvider
    ) {
      this.fareDetails = this.findFareDetails(
        this.firstLegProvider,
        this.providerShortName,
        this.firstLegCarrier,
        this.lastLegCarrier,
        this.firstLegcarrierWithFlightNumber,
        this.lastLegcarrierWithFlightNumber,
        this.firstLegBaggage,
        this.lastLegBaggage,
        (element: any) =>
          element.firstLeg?.carrierWithFlightNumber === this.firstLegcarrierWithFlightNumber &&
          element.lastLeg?.carrierWithFlightNumber === this.lastLegcarrierWithFlightNumber
      );
    }
  }

  flightShowHideAction(id:any,flightdet:any,faredet: any)
  {
    const FlightButton = this.document.getElementById("flightDetailsShowHide"+id);
    const fareButton = this.document.getElementById("fareDetailsShowHide"+id);
    if ($(flightdet + id).css('display') == 'block') {
      $(flightdet+id).hide('slow');
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
    }
    else {
      $(faredet + id).hide('slow');
      $(flightdet + id).show('slow');
      if(fareButton){
        fareButton.textContent = "View Fare Details";
      }
      if(FlightButton){
        FlightButton.textContent = "Hide Flight Details";
      }
    }
  }
  
  bookAndHoldAction(){
    this.bookFlightDetails=[];
    if(this.item.value[this.first_leg_index].firstLeg){
      let firstLeg = this.item.value[this.first_leg_index].firstLeg;
      firstLeg.fareDetails = this.fareDetails;
      this.bookFlightDetails.push(firstLeg);
    }
    if(this.item.value[this.last_leg_index].lastLeg){
      let lastLeg = this.item.value[this.last_leg_index].lastLeg;
      lastLeg.fareDetails = this.fareDetails;
      this.bookFlightDetails.push(lastLeg);
    }
    const navigationExtras: NavigationExtras = {
      state: {
        selectedCommonFlight: this.bookFlightDetails
      }
    };
    this.router.navigate(['/home/book-and-hold'], navigationExtras);
  }

  requestAction(){
    if(this.item.value[this.first_leg_index].firstLeg){
      this.bookFlightDetails.push(this.item.value[this.first_leg_index].firstLeg);
    }
    if(this.item.value[this.last_leg_index].lastLeg){
      this.bookFlightDetails.push(this.item.value[this.last_leg_index].lastLeg);
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
        if(this.item.value[this.first_leg_index].firstLeg){
          let firstLeg = this.item.value[this.first_leg_index].firstLeg;
          firstLeg.fareDetails = this.fareDetails;
          bookFlightDetails.push(firstLeg);
        }
        if(this.item.value[this.last_leg_index].lastLeg){
          let lastLeg = this.item.value[this.last_leg_index].lastLeg;
          lastLeg.fareDetails = this.fareDetails;
          bookFlightDetails.push(lastLeg);
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
export interface PassDetails{
  passangerType: PassangerTypes;
}
export interface BookAndHold{
  passangers:PassDetails[];
  tripType:string;
  flightTypes:string;
  flightDetails: string;
  agencyPhone: String;
  agencyEmail: String;
  agencyId: string;
  IsRevalidated: boolean;
}
enum FlightTypes {
  OneWay,
  RoundTrip,
  Multicity
}
enum PassangerTypes{
  Adult,
  Child,
  Infant
}