import { DOCUMENT, DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { BookModel } from 'src/app/model/book-model.model';
import { CancellationModel } from 'src/app/model/cancellation-model';
import { MarkuDiscountModel } from 'src/app/model/marku-discount-model.model';
import { FlightHelperService } from '../flight-helper.service';


import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'src/app/_services/toastr.service';
import { environment } from 'src/environments/environment';
declare var window: any;
declare var $: any;
declare var $;

@Component({
  selector: 'app-common-flight-search',
  templateUrl: './common-flight-search.component.html',
  styleUrls: ['./common-flight-search.component.css', '../../../assets/dist/css/custom.css']
})
export class CommonFlightSearchComponent implements OnInit {

  ngOnInit(): void {
    this.init();
  }
  @ViewChild('btnClose', { static: true })
  btnClose!: ElementRef;
  @ViewChild('btnModalOpen', { static: true })
  btnModalOpen!: ElementRef;
  intOneWay:boolean=false;
  domOneWay:boolean=false;
  intRoundTrip:boolean=false;
  intMultiCity:boolean=false;
  domRoundTrip:boolean=false;
  domMultiCity:boolean=false;
  // isNotFound:boolean=false;
  // isLoad:boolean=false;
  data: any[] = [];
  differentDateSabreFare: any[] = [];
  displayedData: any[] = [];
  filterData:any[]=[];
  duplicateAirlinesData:any[]=[];
  duplicateRefundableData:any[]=[];
  duplicateBaggageData:any[]=[];
  duplicateDepartureData:any[]=[];
  data1:any[]=[];
  loopData:any[]=[];
  airlinesData:any[]=[];
  departureCityCode : any[]=[];
  arrivalCityCode :any[]=[];
  departureDate:any[]=[];
  arrivalDate:any;
  // adult: number = 0;
  // child: number = 0;
  // infant: number = 0;
  first_leg_index = 0;
  last_leg_index = 0;
  first_leg_commonflight : any;
  last_leg_commonflight : any;
  firstLegUnique: any[] = [];
  lastLegUnique: any[] = [];

// search
urlJquery = "./assets/dist/js/jquery.min.js";
urlBootstrap = "./assets/dist/js/bootstrap.bundle.min.js";
urlOwl = "./assets/dist/js/owl.carousel.min.js";
urlMain = "./assets/dist/js/main.min.js";
  loadAPI: Promise<any> | any;
@ViewChild('leftFlightItem', {read: DragScrollComponent}) leftFlightItem: DragScrollComponent | any;
@ViewChild('rightFlightItem', { read: DragScrollComponent }) rightFlightItem: DragScrollComponent | any;
@ViewChild('flightItem', {read: DragScrollComponent}) flightItem: DragScrollComponent | any;
@ViewChild('fareItem', {read: DragScrollComponent}) fareItem: DragScrollComponent | any;

flightFromModel:any;
flightToModel: any;


paramModelData:any;


departureDateModel: NgbDateStruct | any;
showModalFareDetails:boolean=false;
isAgentFare:boolean=false;
isNotFound:boolean=false;
isTravellerFromShow:boolean=true;
isFromToSame:boolean=false;
fareSearchSkeleton:boolean=true;
isTopTwoSingleItem:boolean=true;

returnDateModel: NgbDateStruct|any;
returnDay:string="";
returnMonth:string="";
returnMonthYear:string="";
returnYear:string="";
returnDayName:string="";


cDay:number=Number(this.shareService.getDay(""));
cMonth:number=Number(this.shareService.getMonth(""));
cYear:number=Number(this.shareService.getYearLong(""));

groupAirlines:any;
ItineryWiseAirlines:any;
airports:any;

returnDate:string="";
adult:any="";
child:any="";
infant:any="";
isLoad:boolean=false;
cabinTypeId:string="";
tripTypeId:string="";
isSuggDeparture:boolean=false;
isSuggReturn:boolean=false;
isSuggDepartureMobile:boolean=false;
isSuggReturnMobile:boolean=false;
providerId:string="";
timeType:string="gmt";

public selectedClassTypeNameMobile:any="";

fmgChild:FormArray|any;
fmgSearchHistory:FormGroup|any;
fmgSearchHistoryInfo:FormGroup|any;
fmgSearchHistoryDetails:FormGroup|any;
fmgFlightSearchWay:FormGroup|any;
fmgFlightSearch: FormGroup|any;

retDeptDay:string="";
retDayNameShort:string="";
retDeptMonth:string="";
retDeptYear:string="0";

retDay:number=0;
retMonth:number=0;
retYear:number=0;

itineraries:any;
itineraryGroups:any;
rootData:any;
scheduleDescs:any;
legDescs:any;


childSelectList:number[]=[6];
airlines:any[]=[];
topFlights:any[]=[];
baggages:any[]=[];
selectedAirFilterList:string[]=[];
selectedDeptTimeListLeft:any[]=[];
selectedDeptTimeListRight:any[]=[];
selectedArrTimeListLeft:any[]=[];
selectedArrTimeListRight:any[]=[];
tempFilterItinery:any[]=[];
udMinRangeVal:number=0;
stopCountListLeft:any[]=[];
stopCountListRight:any[]=[];
departureTimeFilterLeft:any[]=[];
departureTimeFilterRight:any[]=[];
arrivalTimeFilterLeft:any[]=[];
arrivalTimeFilterRight:any[]=[];
refundFilterListLeft:boolean[]=[];
refundFilterListRight:boolean[]=[];
appliedFilter:any[]=[];
flightData:any[]=[];
flightRootData:any[]=[];
firstLegData:any[]=[];
secondLegData:any[]=[];
flightDataGroup:any[]=[];
intOneWayGroupWise:any[]=[];
tempFlightData:any[]=[];
markupInfo:MarkuDiscountModel[]=[];
markupDiscountInfo:MarkuDiscountModel[]=[];
discountInfo:MarkuDiscountModel[]=[];
cmbAirCraft:any[]=[];
bookInstantEnableDisable:BookModel[]=[];
fareDetailsModalData:any=[];
flightDetailsModalData:any[]=[];
tempAirportsDeparture: any=[];
tempAirportsArrival: any=[];
tempDefaultDepArrFlight:any=[];
popularFilter:any[]=[];
makeProposalData:any=[];
flightDetailsData:any=[];
queFlightDetailsLeft:any=[];
queFlightDetailsRight:any=[];
queFlightData:any={};
selectedRadioFlightDetails:any[]=[];
CancellationList:CancellationModel[]=[];

isFlightSearchBody:number=0;

amtDateChangesPre:any;
amtDateChanges:any;
amtDateChangesPlus:any;
amtCancellationPre:any;
amtCancellation:any;
amtCancellationPlus:any;
isCancellationShow:boolean=true;
//--------------multicity/one/round start-------------///
isMulticityTopSection:boolean=false;
isSuggDepartureMobile1:boolean=false;
isSuggDepartureMobile2:boolean=false;
isSuggDepartureMobile3:boolean=false;
isSuggDepartureMobile4:boolean=false;
@ViewChild('suggDepartureMobile1') suggDepartureMobile:ElementRef|any;
@ViewChild('suggReturnMobile1') suggReturnMobile:ElementRef|any;
 //--------------multicity/one/round end-------------///


@ViewChild('returnDatePick') returnDatePick:ElementRef | any;
@ViewChild('roundTripButton') roundTripButton : ElementRef | any;
@ViewChild('suggDeparture') suggDeparture:ElementRef|any;
@ViewChild('suggReturn') suggReturn:ElementRef|any;

// Filter
activeSabre: Boolean = false;
activeGalileo: Boolean = false;
activeRerfundable: Boolean = false;
activeNonRerfundable: Boolean = false;
isActiveProviderName: Boolean = false;
isActiveAirlinesName: Boolean = false;
isActiveBaggageName: Boolean = false;
isActiveDepartureName: Boolean = false;
isActiveLeftAirlinesName: Boolean = false;
isActiveRightAirlinesName: Boolean = false;
isActiveRefundable: Boolean = false;
activeAirlinesName:string="";
activeAirlinesNames:any=[];
activeProviderNames:any=[];
activeRefundableNames:any=[];
activebaggageNames:any=[];
activeDepartureNames:any=[];
activeLeftAirlinesName:string="";
activeRightAirlinesName: string = "";
sabreChecked: boolean = false;
galileoChecked: boolean = false;
isShowFilter: boolean = true;
intOneWayDataGroup: any[] = [];
selectedSavenDaysIndex: number | null = 3;
selectedThreeDaysIndex: number | null = 1;
showMore: boolean = false;
sevenDays: any = [];
departureThreeDays: any = [];
returnThreeDays: any = [];

flightType:string="";
className:string="col-xl-9 col-lg-12";
providerName:any;
supplierShortName: any;
currentDate: any;
multicitySearchIndex: number = 0;
totalTrip: number = 0;
refundChecked: boolean = false;
nonRefundChecked: boolean = false;
departureTimes = [
    {
      title: '06AM - 12PM',
      logo: '../../../assets/dist/img/sun.svg',
      details: environment.Morning
    },
    {
      title: '12PM - 6PM',
      logo: '../../../assets/dist/img/sun-fog.svg',
      details: environment.Afternoon
    },
    {
      title: 'After 6PM',
      logo: '../../../assets/dist/img/moon.svg',
      details: environment.Night
    },
];
departureTimeList: any = [];
multicityTabList: any = [];

  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
  private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
    public shareService: ShareService, public flightHelper: FlightHelperService, private datePipe: DatePipe)
  {
      this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  init()
  {
    let requestModel = this.generateLoaderData();
    this.setLoaderData(requestModel);
    this.getSearchingResult(requestModel);
  }
  generateLoaderData(){
    var model = JSON.parse(localStorage.getItem('loaderData')!);
    var isDomestic = localStorage.getItem('isDomestic');
    this.providerName = localStorage.getItem('providerName');
    this.supplierShortName = localStorage.getItem('supplierShortName');

    if(model.fareType=='AAF637CB-ACDA-43DF-ABAE-88B0FCDFB8B7'){
      this.isAgentFare=false;
    }else if(model.fareType=='34BC9B43-75E7-49BF-B1B5-9D65441BAF31'){
      this.isAgentFare=true;
    }

    var TripType='';
    if(isDomestic=='True'){
      TripType="Domestic";
    }else{
      TripType="International";
    }

    this.paramModelData=this.flightHelper.getLocalFlightSearch();
    var FlightType:any;
    if(model.isOneWay){
      FlightType=FlightTypes.OneWay;
      this.departureCityCode.push(model.Departure[0].CityCode);
      this.arrivalCityCode.push(model.Arrival[0].CityCode);
      this.departureDate.push(model.Departure[0].Date);
    }else if(model.isRoundTrip){
      FlightType=FlightTypes.RoundTrip;
      this.departureCityCode.push(model.Departure[0].CityCode);
      this.arrivalCityCode.push(model.Arrival[0].CityCode);
      this.departureDate.push(model.Departure[0].Date);

      this.departureCityCode.push(model.Arrival[0].CityCode);
      this.arrivalCityCode.push(model.Departure[0].CityCode);
      this.arrivalDate =model.Arrival[0].Date;
      this.departureDate.push(model.Arrival[0].Date);
    }else if(model.isMultiCity){
      FlightType=FlightTypes.Multicity;
      for(var i=0; i< model.Arrival.length; i++){
        this.departureCityCode.push(model.Departure[i].CityCode);
        this.arrivalCityCode.push(model.Arrival[i].CityCode);
        this.departureDate.push(model.Departure[i].Date);
      }
    }

    localStorage.setItem('departureDate',JSON.stringify(this.departureDate));
    var classType = model.classType;

    var totalPassenger = parseFloat(model.adult)+parseFloat(model.childList.length)+parseFloat(model.infant);


    const passengerTypeQuantities = [];

    for (let i = 0; i < model.adult; i++) {
      passengerTypeQuantities.push({ Code: PassangerTypes.Adult, Age: 30 });
    }

    for (let i = 0; i < model.childList.length; i++) {
      passengerTypeQuantities.push({ Code: PassangerTypes.Child, Age: 6 });
    }

    for (let i = 0; i < model.infant; i++) {
      passengerTypeQuantities.push({ Code: PassangerTypes.Infant, Age: 1 });
    }
    var vendorPre = model.airlines;
    var vendor: any = [];

    if(model.isReissue){
      this.isShowFilter = false;
      this.className="col-xl-12 col-lg-12";
    }
    if (vendorPre != '') {
      vendor = [{ Code: vendorPre, PreferLevel: true }];
    } else {
      vendor = [];
    }
    var max = model.stop;
    const requestModel: CommonFlightSearchRequestModel = {
      cabinCodes: classType.map((type:any) => ({
        cabinCode: type
      })),
      passengerTypeQuantities: passengerTypeQuantities,
      totalPassenger: totalPassenger,
      VendorPref: vendor,
      departureLocationCodeList: this.departureCityCode,
      arrivalLocationCodeList: this.arrivalCityCode,
      departureDateList: this.departureDate,
      returnDate: this.arrivalDate,
      FlightType: FlightType,
      TripType: TripType,
      Stop:max
    };
    return requestModel;
  }
  getSearchingResult(requestModel:any){
    this.isLoad=true;
    this.authService.getCommonFlightSearch(requestModel).subscribe( data=>{
      if(data.intOneWayData.length>0){
        this.data = data.intOneWayData;
        this.filterData = data.intOneWayData;
        this.differentDateSabreFare = data.differentDateSabreFare;
        if(this.isShowFilter == false){
          const filteredData = this.data.filter((item) => {
            return item.providerName === this.providerName && item.supplierShortName === this.supplierShortName;
          });
          this.filterData = filteredData;
        }
        this.intOneWay = true;
        this.ViewMoreAndLessData();
        this.topFlightSearch();
        this.intRoundTrip=false;
        this.domOneWay=false;
        this.intMultiCity=false;
        this.domRoundTrip=false;
        this.domMultiCity=false;
      }
      else if(data.domOneWayData.length>0){
        this.data = data.domOneWayData;
        this.filterData = data.domOneWayData;
        this.differentDateSabreFare = data.differentDateSabreFare;
        if(this.isShowFilter == false){
          const filteredData = this.data.filter((item) => {
            return item.providerName === this.providerName && item.supplierShortName === this.supplierShortName;
          });
          this.filterData = filteredData;
        }
        this.intOneWay=false;
        this.domOneWay=true;
        this.ViewMoreAndLessData();
        this.topFlightSearch();
        this.intRoundTrip=false;
        this.intMultiCity=false;
        this.domRoundTrip=false;
        this.domMultiCity=false;
      }
      else if(data.intRoundTripData.length>0){
        this.data = data.intRoundTripData;
        this.loopData = JSON.parse(JSON.stringify(this.data));
        this.loopData.forEach((values:any)=>
          {
            let firstLegUniqueValue:any[]=[];
            this.firstLegUnique = [];
            this.lastLegUnique = [];
            
            values.value.forEach((item:any) => {
                  let a:any=null;
                  let b:any=null;
                  let baggageUnit1 = item.firstLeg.flightDetails[0].passangerBaggages[0].baggageWeight + item.firstLeg.flightDetails[0].passangerBaggages[0].baggageUnit;
                  let carrierWithFlightNumber1 = item.firstLeg.carrierWithFlightNumber;
                  let supplierShortName1 = item.firstLeg.supplierShortName;
                  if(this.firstLegUnique.indexOf(carrierWithFlightNumber1 + baggageUnit1 + supplierShortName1) === -1) {
                    this.firstLegUnique.push(carrierWithFlightNumber1 + baggageUnit1 + supplierShortName1);
                    a = item.firstLeg;
                  }

                  let baggageUnit2 = item.lastLeg.flightDetails[0].passangerBaggages[0].baggageWeight + item.lastLeg.flightDetails[0].passangerBaggages[0].baggageUnit;
                  let carrierWithFlightNumber2 = item.lastLeg.carrierWithFlightNumber;
                  let supplierShortName2 = item.lastLeg.supplierShortName;
                  if(this.lastLegUnique.indexOf(carrierWithFlightNumber2 + baggageUnit2 + supplierShortName2) === -1) {
                    this.lastLegUnique.push(carrierWithFlightNumber2 + baggageUnit2 + supplierShortName2);
                    b = item.lastLeg;
                  }
                  firstLegUniqueValue.push({firstLeg:a, lastLeg:b});

            });
            values.value = firstLegUniqueValue
          });
         // console.log(this.firstLegUnique);
        // this.data.forEach(element => {
        //   element.value.forEach((val: any) => {
        //     this.first_leg_selectFlightBatch(val,0);
        //     this.last_leg_selectFlightBatch(val,0);
        //   });
        // });
        this.filterData = this.loopData;
        if(this.isShowFilter == false){
          const filteredData = this.data.filter((item) => {
            return item.providerName === this.providerName && item.supplierShortName === this.supplierShortName;
          });
          this.filterData = filteredData;
        }
        this.intRoundTrip = true;
        this.ViewMoreAndLessData();
        this.topFlightSearch();
        this.intOneWay=false;
        this.domOneWay=false;
        this.intMultiCity=false;
        this.domRoundTrip=false;
        this.domMultiCity=false;
      }
      else if(data.intMultiCityPostData.length>0){
        this.data = data.intMultiCityPostData.slice();
        this.filterData = data.intMultiCityPostData.slice();
        this.intMultiCity=true;
        if(this.isShowFilter == false){
          const filteredData = this.filterData.filter((item:any) => {
            return item.providerName === this.providerName && item.multiCityTrips[0].trips[0].supplierShortName === this.supplierShortName;
          });
          this.filterData = filteredData;
        }
        this.ViewMoreAndLessData();
        this.topFlightSearch();
        this.data1 = data.intMultiCityPreData;
        this.intOneWay=false;
        this.domOneWay=false;
        this.intRoundTrip=false;
        this.domRoundTrip=false;
        this.domMultiCity=false;
      }
      else if(data.domRoundTripData.length>0 && data.domRoundTripData.length<=2){
        this.data = data.domRoundTripData.slice();
        this.filterData = this.data.slice();
        if (this.isShowFilter === false) {
          const separatedData = this.filterData.map((innerArray) => {
            return innerArray.filter((item:any) => {
              return (
                item.providerName === this.providerName &&
                item.supplierShortName === this.supplierShortName
              );
            });
          });
          this.filterData = separatedData;
        }
        this.intOneWay=false;
        this.domOneWay=false;
        this.intRoundTrip=false;
        this.intMultiCity=false;
        this.domRoundTrip = true;
        this.domMultiCity=false;
        this.ViewMoreAndLessData();
        this.topFlightSearch();
      }
      else if(data.domRoundTripData.length>2){
        this.data = data.domRoundTripData.slice();
        this.filterData = this.data.slice();
        if(this.isShowFilter == false){
          const filteredData = this.filterData.filter((item:any) => {
            item.forEach((element:any) => {
              return element.providerName === this.providerName && element.supplierShortName === this.supplierShortName;
            });
          });
          this.filterData = filteredData;
        }
        this.intOneWay=false;
        this.domOneWay=false;
        this.intRoundTrip=false;
        this.intMultiCity=false;
        this.domRoundTrip=false;
        this.domMultiCity = true;
        // set multicity tab list
        this.multicityTabList = [];
        for (let data of this.data)
        {
          this.multicityTabList.push([{...data[0]}]);
        }
        this.ViewMoreAndLessData();
        this.topFlightSearch();
      }
      if(this.data.length==0){
        this.isNotFound=true;
        this.isLoad=false;
      }else{
        this.isLoad=false;
        this.isNotFound=false;
      }
      if (this.domRoundTrip || this.intRoundTrip) {
        this.getDepartureThreeDays();
        this.getReturnThreeDays();
      }
      else {
        if (this.isShowFilter == true) {
          if (!this.intMultiCity) {
            this.getSevenDays(0);
          }
        }
      }
      this.setDepartureList();
      this.setBaggageList();
    },error=>{
      this.isNotFound=true;
      this.isLoad=false;
    });
  }
  getFare(departureDate:any):string
  {
    let ret:string="";
    this.differentDateSabreFare.forEach(element => {
      if(element.departureDate[0]==departureDate){
         ret = this.shareService.amountShowWithCommasNoFrac(element.totalFare) + ' ('+element.carrier+')';
      }
    });
    return ret;
  }
  setDepartureList() {
    
    if (this.intOneWay || this.domOneWay || this.intMultiCity) {
      this.departureTimeList.push(this.paramModelData.Departure[0]);
    }
    else if (this.intRoundTrip || this.domRoundTrip)
    {
      this.departureTimeList.push(this.paramModelData.Departure[0]);
      this.departureTimeList.push(this.paramModelData.Arrival[0]);
    }
    else if (this.domMultiCity)
    {
      for (let deparparture of this.paramModelData.Departure)
      {
        this.departureTimeList.push(deparparture);
      }
    }
  }
  searchAction(departureDate: any, returnDate: any) {
    var model = JSON.parse(localStorage.getItem('loaderData')!);
    if (departureDate != '' && departureDate != undefined && departureDate != null) {
      if (this.domMultiCity) {
        model.Departure[this.multicitySearchIndex].Date = departureDate;
      }
      else {
        model.Departure[0].Date = departureDate;
      }
    }
    if (returnDate != '' && returnDate != undefined && returnDate != null) {
      model.Arrival[0].Date = returnDate;
    }
    localStorage.setItem('loaderData', JSON.stringify(model));
    location.reload();
  }
  getSevenDays(index:number) {
    this.sevenDays = [];
    this.multicitySearchIndex = index;
    this.totalTrip = this.departureDate.length
    let givenDate:any;
    if (this.domMultiCity) {
      givenDate = new Date(`${this.departureDate[index]}`);
    }
    else {
      givenDate = new Date(`${this.departureDate}`);
    }
    for (let i = 3; i >= 1; i--) {
      const previousDate = new Date(givenDate.getTime() - (i * 24 * 60 * 60 * 1000));
      const formattedPreviousDate = previousDate.toISOString().split('T')[0];
      if (this.domMultiCity) {
        if (index == 0) {
          if (this.departureDate[0] >= formattedPreviousDate) {
            this.sevenDays.push(formattedPreviousDate);
          }
          else {
            this.sevenDays.push(null);
          }
        }
        else {
          if (this.departureDate[index-1] <= formattedPreviousDate) {
            this.sevenDays.push(formattedPreviousDate);
          }
          else {
            this.sevenDays.push(null);
          }
        }

      }
      else {
        if (this.currentDate <= formattedPreviousDate) {
          this.sevenDays.push(formattedPreviousDate);
        }
        else {
          this.sevenDays.push(null);
        }
      }
    }
    this.sevenDays.push(this.departureDate[index])
    for (let i = 1; i <= 3; i++) {
      const afterDate = new Date(givenDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const formattedAfterDate = afterDate.toISOString().split('T')[0];
      if (this.domMultiCity) {
        if (this.departureDate[index+1] >= formattedAfterDate || this.totalTrip-1 == index) {
          this.sevenDays.push(formattedAfterDate);
        }
        else {
          this.sevenDays.push(null);
        }
      }
      else {
        this.sevenDays.push(formattedAfterDate);
      }
    }
  }
  getDepartureThreeDays() {
    this.departureThreeDays = [];
    const givenDate = new Date(`${this.departureDate[0]}`);
    if (this.currentDate == this.departureDate[0]) {
      this.departureThreeDays.push(null);
    }
    else {
      const previousDate = new Date(givenDate.getTime() - (1 * 24 * 60 * 60 * 1000));
      const formattedPreviousDate = previousDate.toISOString().split('T')[0];
      this.departureThreeDays.push(formattedPreviousDate);
    }
    this.departureThreeDays.push(this.departureDate[0]);
    if (this.departureDate[0] == this.departureDate[1]) {
      this.departureThreeDays.push(null);
    }
    else {
      const afterDate = new Date(givenDate.getTime() + (1 * 24 * 60 * 60 * 1000));
      const formattedAfterDate = afterDate.toISOString().split('T')[0];
      this.departureThreeDays.push(formattedAfterDate);
    }
  }
  getReturnThreeDays() {
    this.returnThreeDays = [];
    const givenDate = new Date(`${this.departureDate[1]}`);
    if (this.departureDate[0] == this.departureDate[1]) {
      this.returnThreeDays.push(null);
    }
    else {
      const previousDate = new Date(givenDate.getTime() - (1 * 24 * 60 * 60 * 1000));
      const formattedPreviousDate = previousDate.toISOString().split('T')[0];
      this.returnThreeDays.push(formattedPreviousDate);
    }
    this.returnThreeDays.push(this.departureDate[1]);
    const afterDate = new Date(givenDate.getTime() + (1 * 24 * 60 * 60 * 1000));
    const formattedAfterDate = afterDate.toISOString().split('T')[0];
    this.returnThreeDays.push(formattedAfterDate);
  }
  setDate(departureDate: any, returnDate: any, index: number) {
    if (this.domRoundTrip || this.intRoundTrip) {
      if (this.selectedThreeDaysIndex === index || departureDate == null || returnDate == null) {
        // this.selectedSavenDaysIndex = index; // Toggle off if it's already active
      } else {
        // this.selectedSavenDaysIndex = 3; // Set the selected index
        this.searchAction(departureDate,returnDate);
      }
    }
    else {
      if (this.selectedSavenDaysIndex === index || departureDate == null || returnDate == null) {
        // this.selectedSavenDaysIndex = index; // Toggle off if it's already active
      } else {
        // this.selectedSavenDaysIndex = 3; // Set the selected index
        this.searchAction(departureDate,returnDate);
      }
    }

  }
  setLoaderData(requestModel:any){
    this.departureDate = requestModel.departureDateList;
    requestModel.passengerTypeQuantities.forEach((passenger: { Code: any; Age: any; }) => {
      if (passenger.Code == PassangerTypes.Adult) {
        this.adult++;
      }
      if (passenger.Code == PassangerTypes.Child) {
        this.child++;
      }
      if (passenger.Code == PassangerTypes.Infant) {
        this.infant++;
      }
    });
  }
  viewMoreGroupFlight(id:any,item:any)
  {
    try{
      const data=this.document.getElementById('topGroup'+id);
      if(!this.shareService.isNullOrEmpty(data))
      {
        if(data?.classList.contains("height-fix"))
        {
          data?.classList.remove("height-fix");
          $("#txt"+id).text("Hide More Flights");
        }else{
          data?.classList.add("height-fix");
          $("#txt"+id).text("View More Flights");
        }
      }
    }catch(exp){}
  }
  flightShowHideAction(id:any,i:any)
  {
    const card = this.document.getElementById("flightDetailsWrap"+id);
    const button = this.document.getElementById("flightDetailsShowHide"+id);
    const data=this.document.getElementById('topGroup'+i);
    if(card?.style.display === 'none'){
      if(button){
        button.textContent = "Hide Flight Details";
      }
      card.style.display = 'block';
      data?.classList.remove("height-fix");
    }else if(card?.style.display === 'block'){
      if(button){
        button.textContent = "View Flight Details";
      }
      //data?.classList.add("height-fix");
      card.style.display = 'none';
    }
  }
  fareShowHideAction(id:any,i:any)
  {
    const card = this.document.getElementById("fareDetailsWrap"+id);
    const button = this.document.getElementById("fareDetailsShowHide"+id);
    const data=this.document.getElementById('topGroup'+i);
    if(card?.style.display === 'none'){
      if(button){
        button.textContent = "Hide Fare Details";
      }
      card.style.display = 'block';
      data?.classList.remove("height-fix");
    }else if(card?.style.display === 'block'){
      if(button){
        button.textContent = "View Fare Details";
      }
      //data?.classList.add("height-fix");
      card.style.display = 'none';
    }
  }
  first_leg_selectFlightBatch(commonflight:any, id:any){
    this.first_leg_index = id;
    this.first_leg_commonflight = commonflight;
  }
  last_leg_selectFlightBatch(commonflight:any, id:any){
    this.last_leg_index = id;
    this.last_leg_commonflight = commonflight;
  }
  // getTripTypeId():string
  //   {
  //     let ret:string="";
  //     try{
  //       if(this.isOneway)
  //       {
  //         ret=this.flightHelper.getTripTypeId(1);
  //       }else if(this.isRoundtrip)
  //       {
  //         ret=this.flightHelper.getTripTypeId(2);
  //       }else if(this.isMulticity)
  //       {
  //         ret=this.flightHelper.getTripTypeId(3);
  //       }
  //     }catch(exp){}
  //     return ret;
  // }
  filterProviderName(name: any, event:any)
  {
    
    try {
      this.isActiveAirlinesName = false;
      this.activeAirlinesNames = [];
      this.activeAirlinesName = '';
      if (name === environment.Galileo) {
        if (event.target.checked) {
          this.isActiveProviderName = true
          this.activeProviderNames.push({providerName:name});
          this.activeGalileo = true
          if (this.activeSabre == true) {
            this.filterData = this.data.slice();
          }
          else {
            if (this.domRoundTrip || this.domMultiCity) {
              for (let i = 0; i < this.data.length; i++)
              {
                let data = this.data[i].filter((e: any) => e.providerName === name)
                this.filterData[i] = data;
              }
            }
            else {
              let data = this.data.filter(e => e.providerName === name)
              this.filterData = data;
            }
          }
        }
        else {
          this.uncheckProviderName(name);
        }
        this.topFlightSearch()
      }
      else if (name === environment.Sabre) {
        if (event.target.checked)
        {
          this.isActiveProviderName = true
          this.activeProviderNames.push({providerName:name});
          this.activeSabre = true;
          if (this.activeGalileo == true) {
            this.filterData = this.data.slice();
          }
          else {
            if (this.domRoundTrip || this.domMultiCity)
            {
              for (let i = 0; i < this.data.length; i++)
              {
                let data = this.data[i].filter((e: any) => e.providerName === name)
                this.filterData[i] = data;
              }
            }
            else {
              let data = this.data.filter(e => e.providerName === name)
              this.filterData = data;
            }
          }
        }
        else
        {
          this.uncheckProviderName(name);
        }
      }
      this.ViewMoreAndLessData();
      this.topFlightSearch();
    } catch (error) {
      console.log(error);
    }
  }
  uncheckProviderName(providerName: string) {
    
    try {
      this.activeAirlinesNames = [];
      this.isActiveAirlinesName = false;
      if (this.activeProviderNames.length > 0) {
        if (providerName === 'Sabre') {
          this.sabreChecked = false;
        } else if (providerName === 'Galileo') {
          this.galileoChecked = false;
        }
        this.activeProviderNames = this.activeProviderNames.filter((item: any) => item.providerName !== providerName);
        if (this.activeProviderNames.length <= 0) {
          this.isActiveProviderName = false;
        }
      }
      if (providerName == environment.Sabre) {
        if (this.activeGalileo == true) {
          if (this.domRoundTrip || this.domMultiCity)
          {
            for (let i = 0; i < this.data.length; i++)
            {
              let data = this.data[0].filter((e: any) => e.providerName === environment.Galileo)
              this.filterData[i] = data;
            }
            this.activeSabre = false;
          }
          else {
            let data = this.data.filter(e => e.providerName === environment.Galileo)
            this.filterData = data;
            this.activeSabre = false;
          }
        }
        else {
          this.filterData = this.data.slice();
          this.activeSabre = false;
        }
      }
      else if (providerName == environment.Galileo) {
        if (this.activeSabre == true) {
          if (this.domRoundTrip || this.domMultiCity) {
            for (let i = 0; i < this.data.length; i++)
            {
              let data = this.data[0].filter((e: any) => e.providerName === environment.Sabre)
              this.filterData[i] = data;
            }
            this.activeGalileo = false
          }
          else {
            let data = this.data.filter(e => e.providerName === environment.Sabre)
            this.filterData = data;
            this.activeGalileo = false
          }
        }
        else {
          this.filterData = this.data.slice();
          this.activeGalileo = false
        }
      }
      this.ViewMoreAndLessData();
      this.topFlightSearch();
    } catch (error) {
      console.log(error);
    }
  }
  moveLeftFlight() {
    this.flightItem.moveLeft();
  }
  moveRightFlight() {
    this.flightItem.moveRight();
  }
  moveLeftFlightItemLeft() {
    this.leftFlightItem.moveLeft();
  }
  moveLeftFlightItemRight() {
    this.leftFlightItem.moveRight();
  }
  moveRightFlightItemLeft() {
    this.rightFlightItem.moveLeft();
  }
  moveRightFlightItemRight() {
    this.rightFlightItem.moveRight();
  }
  topFlightSearch() {
    this.topFlights = [];
    if (this.domRoundTrip || this.domMultiCity)
    {
      for(let item of this.filterData[0])
      {
        if (this.domRoundTrip)
        {
          const existsInTopFlights = this.topFlights.some(flight => flight.carrier === item.carrier);
          if(!existsInTopFlights)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.flightDetails[0].airlinesName,
              logo:item.flightDetails[0].airlinesLogo,
            });
          }
        }
        else if (this.domMultiCity) {
          const existsInTopFlights = this.topFlights.some(flight => flight.carrier === item.carrier);
          if(!existsInTopFlights)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.flightDetails[0].airlinesName,
              logo:item.flightDetails[0].airlinesLogo,
            });
          }
        }

      }
      for(let item of this.filterData[1])
      {
        if (this.domRoundTrip) {
          const existsInTopFlights = this.topFlights.some(flight => flight.carrier === item.carrier);
          if(!existsInTopFlights)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.flightDetails[0].airlinesName,
              logo:item.flightDetails[0].airlinesLogo,
            });
          }
        }
        else if (this.domMultiCity) {
          const existsInTopFlights = this.topFlights.some(flight => flight.carrier === item.carrier);
          if(!existsInTopFlights)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.flightDetails[0].airlinesName,
              logo:item.flightDetails[0].airlinesLogo,
            });
          }
        }
      }
      if (this.domMultiCity) {
        for(let item of this.filterData[2])
        {
          const existsInTopFlights = this.topFlights.some(flight => flight.carrier === item.carrier);
          if(!existsInTopFlights)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.flightDetails[0].airlinesName,
              logo:item.flightDetails[0].airlinesLogo,
            });
          }
        }
        if (this.filterData[3] != null) {
          for(let item of this.filterData[3])
          {
            const existsInTopFlights = this.topFlights.some(flight => flight.carrier === item.carrier);
            if(!existsInTopFlights)
            {
              this.topFlights.push({
                carrier:item.carrier,
                providerName:item.providerName,
                airlinesName:item.flightDetails[0].airlinesName,
                logo:item.flightDetails[0].airlinesLogo,
              });
            }
          }
        }
      }
    }
    else {
      for(let item of this.filterData)
      {
        const existsInTopFlights = this.topFlights.some(flight => flight.carrier === item.carrier);
        if(!existsInTopFlights)
        {
          if (this.domOneWay)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.flightDetails[0].airlinesName,
              logo:item.flightDetails[0].airlinesLogo,
            });
          }
          else if (this.intRoundTrip)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.value[0].firstLeg.flightDetails[0].airlinesName,
              logo:item.value[0].firstLeg.flightDetails[0].airlinesLogo,
            });
          }
          else if (this.intOneWay)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.value[0].flightDetails[0].airlinesName,
              logo:item.value[0].flightDetails[0].airlinesLogo,
            });
          }
          else if (this.intMultiCity)
          {
            this.topFlights.push({
              carrier:item.carrier,
              providerName:item.providerName,
              airlinesName:item.multiCityTrips[0].trips[0].flightDetails[0].airlinesName,
              logo:item.multiCityTrips[0].trips[0].flightDetails[0].airlinesLogo,
            });
          }
        }
      }
    }
  }
  filterAirlines(carrier: string, providerName: string, airlinesName:string, i:number) {
    
    if (this.activeAirlinesNames.length==0) {
      this.duplicateAirlinesData = this.filterData.slice();
    }
    if (this.domRoundTrip || this.domMultiCity) {
      if ((this.activeSabre && this.activeGalileo) || (!this.activeSabre && !this.activeGalileo)) {
        // let newData0 = this.duplicateAirlinesData[0].filter((data:any) => data.carrier === carrier);
        // let newData1 = this.duplicateAirlinesData[1].filter((data:any) => data.carrier === carrier);
        if (this.activeAirlinesNames.length > 0 && !this.activeAirlinesNames.some((item: any) => item.airlinesName === airlinesName)) {
          for (let i = 0; i < this.duplicateAirlinesData.length; i++) {
            let newData = this.duplicateAirlinesData[i].filter((data: any) => data.carrier === carrier);
            this.filterData[i] = this.filterData[i].concat(newData);
          }
          // this.filterData[0] = this.filterData[0].concat(newData0);
          // this.filterData[1] = this.filterData[1].concat(newData1);
          this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
        }
        else if (this.activeAirlinesNames.length>0 && this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
          this.filterData = this.filterData;
        }
        else {
          for (let i = 0; i < this.duplicateAirlinesData.length; i++) {
            let newData = this.duplicateAirlinesData[i].filter((data: any) => data.carrier === carrier);
            this.filterData[i] = newData;
          }
          // this.filterData[0] = newData0;
          // this.filterData[1] = newData1;
          this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
        }
      }
      else {
        if (this.activeAirlinesNames.length > 0 && !this.activeAirlinesNames.some((item: any) => item.airlinesName === airlinesName)) {
          for (let i = 0; i < this.duplicateAirlinesData.length; i++) {
            let newData = this.data[i].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
            this.filterData[i].push(...newData);
          }
          // let newData0 = this.data[0].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
          // this.filterData[0].push(...newData0);
          // let newData1 = this.data[1].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
          // this.filterData[1].push(...newData1);
          this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
        }
        else if (this.activeAirlinesNames.length>0 && this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
          this.filterData = this.filterData;
        }
        else {
          for (let i = 0; i < this.duplicateAirlinesData.length; i++) {
            let newData = this.data[i].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
            this.filterData[i] = newData;
          }
          // let newData0 = this.data[0].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
          // this.filterData[0] = newData0;
          // let newData1 = this.data[1].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
          // this.filterData[1]= newData1;
          this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
        }
      }
      this.isActiveAirlinesName = true;
    }
    else {
      if ((this.activeSabre && this.activeGalileo) || (!this.activeSabre && !this.activeGalileo)) {
        if (this.domMultiCity) {
          // if (this.activeAirlinesNames.length>0 && !this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
          //   this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
          //   let newData0 = this.data[0].filter((data:any) => data.carrier === carrier);
          //   this.filterData[0].push(...newData0);
          //   let newData1 = this.data[1].filter((data:any) => data.carrier === carrier);
          //   this.filterData[1].push(...newData1);
          //   if (this.data[2] != null) {
          //     let newData2 = this.data[2].filter((data:any) => data.carrier === carrier);
          //     this.filterData[2].push(...newData2);
          //   }
          //   if (this.data[3] != null) {
          //     let newData3 = this.data[3].filter((data:any) => data.carrier === carrier);
          //     this.filterData[3].push(...newData3);
          //   }

          // }
          // else if (this.activeAirlinesNames.length>0 && this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
          //   this.filterData = this.filterData;
          // }
          // else {
          //   let newData0 = this.data[0].filter((data: any) => data.carrier === carrier);
          //   this.filterData[0] = newData0;
          //   let newData1 = this.data[1].filter((data: any) => data.carrier === carrier);
          //   this.filterData[1] = newData1;
          //   if (this.data[2] != null) {
          //     let newData2 = this.data[2].filter((data: any) => data.carrier === carrier);
          //     this.filterData[2] = newData2;
          //   }
          //   if (this.data[3] != null) {
          //     let newData3 = this.data[3].filter((data: any) => data.carrier === carrier);
          //     this.filterData[3] = newData3;
          //   }
          //   this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
          // }
        }
        else {
          if (this.activeAirlinesNames.length>0 && !this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
            let newData = this.duplicateAirlinesData.filter(data => data.carrier === carrier);
            this.filterData.push(...newData);
            this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
          }
          else if (this.activeAirlinesNames.length>0 && this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
            this.filterData = this.filterData;
          }
          else {
            let newData = this.duplicateAirlinesData.filter(data => data.carrier === carrier);
            this.filterData = newData;
            this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
          }
        }
      }
      else {
        if (this.domMultiCity) {
          // if (this.activeAirlinesNames.length > 0 && !this.activeAirlinesNames.some((item: any) => item.airlinesName === airlinesName))
          // {
          //   this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
          //   let newData0 = this.data[0].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
          //   this.filterData[0].push(...newData0);
          //   let newData1 = this.data[1].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
          //   this.filterData[1].push(...newData1);
          //   if (this.data[2] != null) {
          //     let newData2 = this.data[2].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
          //     this.filterData[2].push(...newData2);
          //   }
          //   if (this.data[3] != null) {
          //     let newData3 = this.data[3].filter((data:any) => data.carrier === carrier && data.providerName === providerName);
          //     this.filterData[3].push(...newData3);
          //   }
          // }
          // else if (this.activeAirlinesNames.length>0 && this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
          //   this.filterData = this.filterData;
          // }
          // else {
          //   let newData0 = this.data[0].filter((data: any) => data.carrier === carrier && data.providerName === providerName);
          //   this.filterData[0] = newData0;
          //   let newData1 = this.data[1].filter((data: any) => data.carrier === carrier && data.providerName === providerName);
          //   this.filterData[1] = newData1;
          //   if (this.data[2] != null) {
          //     let newData2 = this.data[2].filter((data: any) => data.carrier === carrier && data.providerName === providerName);
          //     this.filterData[2] = newData2;
          //   }
          //   if (this.data[3] != null) {
          //     let newData3 = this.data[3].filter((data: any) => data.carrier === carrier && data.providerName === providerName);
          //     this.filterData[3] = newData3;
          //   }
          //   this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
          // }
        }
        else {
          if (this.activeAirlinesNames.length>0 && !this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
            let newData = this.data.filter(data => data.carrier === carrier && data.providerName === providerName);
            this.filterData.push(...newData);
            this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
          }
          else if (this.activeAirlinesNames.length>0 && this.activeAirlinesNames.some((item:any) => item.airlinesName === airlinesName)) {
            this.filterData = this.filterData;
          }
          else {
            let newData = this.data.filter(data => data.carrier === carrier && data.providerName === providerName);
            this.filterData = newData;
            this.activeAirlinesNames.push({airlinesName:airlinesName, carrier:carrier});
          }
        }
      }
      this.isActiveAirlinesName = true;
      this.activeAirlinesName = airlinesName;
    }
    this.ViewMoreAndLessData();
  }
  removeAppliedFilterItem(i: number, carrier: string) {
    
    // Find the corresponding item in topFlights and uncheck it
    const filteredItem = this.topFlights.find(item => item.carrier === carrier);
    if (filteredItem) {
      filteredItem.checked = false;
    }
    if (this.domRoundTrip){
      // if (this.activeAirlinesNames.length > 1) {
      //   let newData0 = this.filterData[0].filter((data:any) => data.carrier !== carrier);
      //   this.filterData[0] = newData0;
      //   let newData1 = this.filterData[1].filter((data:any) => data.carrier !== carrier);
      //   this.filterData[1] = newData1;
      // }
      // else {
      //   this.isActiveAirlinesName = false;
      //   this.filterData = this.duplicateAirlinesData.slice();
      // }
      // if (this.activeAirlinesNames.length>0) {
      //   this.activeAirlinesNames = this.activeAirlinesNames.filter((item:any) => item.carrier !== carrier);
      // }
    }
    else {
      if (this.activeAirlinesNames.length > 1) {
        if (this.domMultiCity || this.domRoundTrip) {
          for (let i = 0; i < this.filterData.length; i++) {
            let newData = this.filterData[i].filter((data:any) => data.carrier !== carrier);
            this.filterData[i] = newData;
          }
          // let newData0 = this.filterData[0].filter((data:any) => data.carrier !== carrier);
          // this.filterData[0] = newData0;
          // let newData1 = this.filterData[1].filter((data:any) => data.carrier !== carrier);
          // this.filterData[1] = newData1;
          // if (this.filterData[2] != null) {
          //   let newData2 = this.filterData[2].filter((data:any) => data.carrier !== carrier);
          //   this.filterData[2] = newData2;
          // }
          // if (this.filterData[3] != null) {
          //   let newData3 = this.filterData[3].filter((data:any) => data.carrier !== carrier);
          //   this.filterData[3] = newData3;
          // }
        }
        else {
          let newData = this.filterData.filter(data => data.carrier !== carrier);
          this.filterData = newData;
        }
      }
      else {
        this.isActiveAirlinesName = false;
        this.activeAirlinesName = '';
        this.filterData = this.duplicateAirlinesData.slice();
      }
      if (this.activeAirlinesNames.length>0) {
        this.activeAirlinesNames = this.activeAirlinesNames.filter((item:any) => item.carrier !== carrier);
      }
    }
    this.ViewMoreAndLessData();
  }
  filterAirlinesName(event: any, carrier: string, providerName: string, airlinesName:string) {
    
    try {
      if (event.target.checked) {
        this.filterAirlines(carrier,providerName,airlinesName,0)
      }
      else {
        this.removeAppliedFilterItem(0, carrier);
      }
    } catch (error) {
      console.log(error);
    }
  }
  _groupedDayMonthYear(departureDate:any):string
  {
    let ret:string="";
    try{
      ret=this.shareService.getDayNameShort(departureDate)+", "+
      this.shareService.getMonthShort(departureDate)+" "+
      this.shareService.getDay(departureDate)+", "+
      this.shareService.getYearLong(departureDate);

    }catch(exp){}
    return ret;
  }
  removeAllAppliedFilterItem() {
    
    this.isActiveProviderName = false;
    if (this.isActiveAirlinesName) {
      this.filterData = this.data.slice();
      this.isActiveAirlinesName = false;
      this.activeAirlinesNames = [];
      for (const item of this.topFlights) {
        item.checked = false;
      }
    }
    if (this.isActiveRefundable) {
      if (this.intRoundTrip) {
        this.filterData = this.loopData.slice();
      }
      else {
        this.filterData = this.data.slice();
      }
      this.isActiveRefundable = false;
      this.activeRefundableNames = [];
      this.activeRerfundable = false;
      this.activeNonRerfundable = false;
    }
    if (this.isActiveBaggageName) {
      this.filterData = this.data.slice();
      this.isActiveBaggageName = false;
      this.activebaggageNames = [];
      for (const item of this.baggages) {
        item.checked = false;
      }
    }
    if (this.isActiveDepartureName) {
      this.filterData = this.data.slice();
      this.isActiveDepartureName = false;
      for (const item of this.activeDepartureNames) {
        const checkbox = document.getElementById('scheduleDept' + item.index+''+item.depIndex) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = !checkbox.checked; // Toggle the checkbox state
        }
        this._scheduleWidgetReSelect(item.index+''+item.depIndex, 'dept');
      }
      this.activeDepartureNames = [];
    }
    this.activeProviderNames = [];
    if (this.activeGalileo == true) {
      this.uncheckProviderName(environment.Galileo);
    }
    if (this.activeSabre == true) {
      this.uncheckProviderName(environment.Sabre);
    }
    this.sabreChecked = false;
    this.galileoChecked = false;
    this.ViewMoreAndLessData();
    this.topFlightSearch();
  }
  get showMoreText(): string {
    return this.showMore ? 'View Less' : 'View More';
  }
  toggleViewMoreLess() {
    
    this.sortByAscending();
    if (this.showMore) {
      // Show only the first 10 items
      if (this.intOneWay || this.domOneWay || this.intRoundTrip || this.intMultiCity) {
        this.displayedData = this.filterData.slice(0, 10);
      }
      else if (this.domRoundTrip) {
        this.displayedData[0] = this.filterData[0].slice(0, 10);
        this.displayedData[1] = this.filterData[1].slice(0, 10);
      }
      else if (this.domMultiCity) {
        this.displayedData[0] = this.filterData[0].slice(0, 10);
        this.displayedData[1] = this.filterData[1].slice(0, 10);
        if (this.filterData[2]) {
          this.displayedData[2] = this.filterData[2].slice(0, 10);
        }
        if (this.filterData[3]) {
          this.displayedData[3] = this.filterData[3].slice(0, 10);
        }
      }
    } else {
      // Show all items
      this.displayedData = this.filterData.slice();
    }

    this.showMore = !this.showMore;
  }
  ViewMoreAndLessData() {
    // Initialize displayedData with the first 10 items
    this.sortByAscending();
    if (this.domOneWay || this.intOneWay || this.intRoundTrip || this.intMultiCity) {
      this.displayedData = this.filterData.slice(0, 10);
    }
    else if (this.domRoundTrip) {
      this.displayedData[0] = this.filterData[0].slice(0, 10);
      this.displayedData[1] = this.filterData[1].slice(0, 10);
    }
    else if (this.domMultiCity) {
      this.displayedData[0] = this.filterData[0].slice(0, 10);
      this.displayedData[1] = this.filterData[1].slice(0, 10);
      if (this.filterData[2]) {
        this.displayedData[2] = this.filterData[2].slice(0, 10);
      }
      if (this.filterData[3]) {
        this.displayedData[3] = this.filterData[3].slice(0, 10);
      }
    }
    this.showMore = false;
  }
  fareTypeChange(event:any) {
    this.isAgentFare=event.target.checked;
  }
  sortByAscending() {
    if (this.domOneWay) {
      this.filterData.sort((a, b) => a?.totalFare - b?.totalFare);
    }
    else if (this.intOneWay) {
      for (let i = 0; i < this.filterData.length; i++) {
        this.filterData.sort((a:any, b:any) => a.value[0]?.totalFare - b.value[0]?.totalFare);
      }
    }
    else if (this.intRoundTrip) {
      for (let i = 0; i < this.filterData.length; i++) {
        this.filterData.sort((a:any, b:any) => a.value[0]?.firstLeg?.totalFare - b.value[0]?.firstLeg?.totalFare);
      }
    }
    else if (this.intMultiCity) {
      for (let i = 0; i < this.filterData.length; i++) {
        this.filterData.sort((a:any, b:any) => a.multiCityTrips[0]?.trips[0]?.totalFare - b.multiCityTrips[0]?.trips[0]?.totalFare);
      }
    }
    else {
      for (let i = 0; i < this.filterData.length; i++) {
        this.filterData[i].sort((a:any, b:any) => a?.totalFare - b?.totalFare);
      }
    }
  }
  FilterRefundablity(name: string, event: any) {
    if (this.activeRefundableNames.length==0) {
      this.duplicateRefundableData = this.filterData.slice();
    }
    if (event.target.checked) {
      if (this.activeRefundableNames.length > 0) {
        this.filterData = this.duplicateRefundableData.slice();
      }
      else {
        this.refundNameWiseSubfilter(name);
      }
      this.isActiveRefundable = true;
      if (name === environment.Refundable) {
        this.activeRerfundable = true;
      } else if (name === environment.NonRefundable) {
        this.activeNonRerfundable = true;
      }
      this.activeRefundableNames.push({ refundName: name });

    }
    else {
      this.uncheckRefundablity(name);
    }
    this.ViewMoreAndLessData();
    this.topFlightSearch();
  }
  uncheckRefundablity(name: string) {
    if (this.activeRefundableNames.length > 0) {
      if (name.toLowerCase() === environment.Refundable.toLowerCase()) {
        this.activeRerfundable = false;
      } else if (name.toLowerCase() === environment.NonRefundable.toLowerCase()) {
        this.activeNonRerfundable = false;
      }
    }
    if (this.activeRefundableNames.length>1) {
      if (this.activeRerfundable) {
        this.refundNameWiseSubfilter(environment.Refundable);
      }
      else {
        this.refundNameWiseSubfilter(environment.NonRefundable);
      }
    }
    else {
      this.filterData = this.duplicateRefundableData;
    }
    this.activeRefundableNames = this.activeRefundableNames.filter((item: any) => item.refundName !== name);
    if (this.activeRefundableNames.length <= 0) {
      this.isActiveRefundable = false;
    }
    this.ViewMoreAndLessData();
    this.topFlightSearch();
  }
  refundNameWiseSubfilter(name:string) {
    if (this.domOneWay) {
      let data = this.duplicateRefundableData.filter(e => e.refundability.toLowerCase() === name.toLowerCase());
      this.filterData = data.slice();
    }
    else if (this.domRoundTrip || this.domMultiCity) {
      for (let i = 0; i < this.duplicateRefundableData.length; i++) {
        let data = this.duplicateRefundableData[i].filter((e:any) => e.refundability.toLowerCase() === name.toLowerCase());
        this.filterData[i] = data.slice();
      }
    }
    else if (this.intOneWay) {
      let filteredData = [];
      for (let i = 0; i < this.duplicateRefundableData.length; i++) {
        let data = this.duplicateRefundableData[i].value.filter((e: any) => e.refundability.toLowerCase() === name.toLowerCase());

        if (data.length > 0) {
          // Add data to the filteredData array only if data.length is not 0
          filteredData.push({
            airlinesLogo:this.duplicateRefundableData[i].airlinesLogo,
            airlinesName:this.duplicateRefundableData[i].airlinesName,
            carrier:this.duplicateRefundableData[i].carrier,
            providerName:this.duplicateRefundableData[i].providerName,
            supplierShortName:this.duplicateRefundableData[i].supplierShortName,
            value: data
          });
        }
      }
      this.filterData = filteredData;
    }
    else if (this.intRoundTrip) {
      let filteredData = [];
      for (let i = 0; i < this.duplicateRefundableData.length; i++) {
        let legData: any[] = [];
        for (let j = 0; j < this.duplicateRefundableData[i].value.length; j++) {
          let isfirstLeg = false;
          let len = legData.length;
          if (this.duplicateRefundableData[i].value[j]?.firstLeg?.refundability.toLowerCase() === name.toLowerCase()) {
            if (!legData[len]) {
              legData[len] = {};
            }
            legData[len].firstLeg = this.duplicateRefundableData[i].value[j].firstLeg;
            legData[len].lastLeg = null;
            isfirstLeg = true;
          }
          if (this.duplicateRefundableData[i].value[j]?.lastLeg?.refundability.toLowerCase() === name.toLowerCase()) {
            if (!legData[len]) {
              legData[len] = {};
            }
            legData[len].firstLeg = isfirstLeg != true? null:this.duplicateRefundableData[i].value[j].firstLeg;
            legData[len].lastLeg = this.duplicateRefundableData[i].value[j].lastLeg;
          }
        }
        if (legData.length > 0) {
          filteredData.push({
            carrier:this.duplicateRefundableData[i].carrier,
            providerName:this.duplicateRefundableData[i].providerName,
            supplierShortName:this.duplicateRefundableData[i].supplierShortName,
            value: legData
          });
        }
      }
      this.filterData = filteredData.slice();
    }
    else if (this.intMultiCity) {
      // 
      // let filteredData = [];
      // for (let i = 0; i < this.duplicateRefundableData.length; i++) {
      //   for (let j = 0; j < this.duplicateRefundableData[i].multiCityTrips.length; j++) {
      //     for (let k = 0; k < this.duplicateRefundableData[i].multiCityTrips[j].trips.length; k++) {
      //       let data = this.duplicateRefundableData[i].multiCityTrips[j].trips.filter((e: any) => e.refundability.toLowerCase() === name.toLowerCase());

      //     }

      //   }
      //   if (legData.length > 0) {

      //   }
      // }
      // this.filterData = filteredData.slice();
    }
  }
  setBaggageList() {
    this.baggages = [];
    if (this.intOneWay) {
      for (let item of this.filterData) {
        for (let data of item.value) {
          this.setSubBaggage(data);
        }
      }
    }
    else if (this.intRoundTrip) {
      for (let item of this.filterData) {
        for (let data of item.value) {
          if (data.firstLeg!= null) {
            this.setSubBaggage(data.firstLeg);
          }
          if (data.lastLeg!= null) {
            this.setSubBaggage(data.lastLeg);
          }
        }
      }
    }
    else if (this.intMultiCity) {
      for (let item of this.filterData) {
        for (let data of item.multiCityTrips) {
          for (let trip of data.trips) {
            if (trip!= null) {
              this.setSubBaggage(trip);
            }
          }
        }
      }
    }
    else if (this.domOneWay) {
      for (let item of this.filterData) {
        if (item!= null) {
          this.setSubBaggage(item);
        }
      }
    }
    else if (this.domRoundTrip || this.domMultiCity) {
      for (let item of this.filterData) {
        for (let data of item) {
          if (data!= null) {
            this.setSubBaggage(data);
          }
        }
      }
    }
    this.baggages.sort((a, b) => parseInt(a.bagWeight) - parseInt(b.bagWeight));
  }
  setSubBaggage(data:any) {
    let bagWeight = data.flightDetails[0]?.passangerBaggages[0]?.baggageWeight
    const existsInBaggage = this.baggages.some(baggage => baggage?.bagWeight === bagWeight);
    if (!existsInBaggage) {
      this.baggages.push({
        bagWeight:bagWeight,
        unit:data.flightDetails[0].passangerBaggages[0].baggageUnit,
      });
    }
  }
  Filterbaggage(bagWeight: string, unit: string, event: any) {
    
    if (this.activebaggageNames.length==0) {
      this.duplicateBaggageData = this.filterData.slice();
    }
    if (event.target.checked) {
      if (this.activebaggageNames.length>0 && this.activebaggageNames.some((item:any) => item.bagWeight === bagWeight && item.unit === unit)) {
        this.filterData = this.filterData;
      }
      else {
        this.activebaggageNames.push({ bagWeight: bagWeight, unit:unit });
        let newData = this.BaggageSubFilter();
        if (newData.length) {
          this.filterData = newData;
        }
      }
      this.isActiveBaggageName = true;
    }
    else {

      this.uncheckBaggage(bagWeight, unit);
    }
    this.ViewMoreAndLessData();
    this.topFlightSearch();
  }
  uncheckBaggage(bagWeight: string, unit: string) {
    
    const filteredItem = this.baggages.find(item => item.bagWeight === bagWeight && item.unit === unit);
    if (filteredItem) {
      filteredItem.checked = false;
    }
    if (this.activebaggageNames.length > 1) {
      this.activebaggageNames = this.activebaggageNames.filter((item: any) => item.bagWeight != bagWeight && item.baggageUnit != unit);
      let newData = this.BaggageSubFilter();
      if (newData.length) {
        this.filterData = newData;
      }
    }
    else {
      this.activebaggageNames = this.activebaggageNames.filter((item: any) => item.bagWeight != bagWeight && item.baggageUnit != unit);
      this.isActiveBaggageName = false;
      this.filterData = this.duplicateBaggageData;
    }
    this.ViewMoreAndLessData();
    this.topFlightSearch();
  }
  BaggageSubFilter() {
    
    let filteredData = [];
    let data;
    if (this.domOneWay) {
      data = this.BaggageNameWiseFiltering(this.duplicateBaggageData);
      if (data.length > 0) {
        filteredData = data;
      }
    }
    else {
      for (let baggageData of this.duplicateBaggageData) {

        if (this.intOneWay) {
          data = this.BaggageNameWiseFiltering(baggageData.value);
          if (data.length > 0) {
          // Add data to the filteredData array only if data.length is not 0
            filteredData.push({
              airlinesLogo:baggageData.airlinesLogo,
              airlinesName:baggageData.airlinesName,
              carrier:baggageData.carrier,
              providerName:baggageData.providerName,
              supplierShortName:baggageData.supplierShortName,
              value: data
            });
          }
        }
        else if (this.intRoundTrip) {
          data = this.BaggageNameWiseFiltering(baggageData.value);
          if (data.length > 0) {
            // Add data to the filteredData array only if data.length is not 0
            filteredData.push({
              carrier:baggageData.carrier,
              providerName:baggageData.providerName,
              supplierShortName:baggageData.supplierShortName,
              value: data
            });
          }
        }
        else if (this.intMultiCity) {
          let newTripsData = [];
          for (let tripsData of baggageData.multiCityTrips) {
            data = this.BaggageNameWiseFiltering(tripsData.trips);
            if (data.length > 0) {
              newTripsData.push({
                trips:data
              })
            }
          }
          if (newTripsData.length > 0) {
              // Add data to the filteredData array only if data.length is not 0
              filteredData.push({
                carrier:baggageData.carrier,
                providerName:baggageData.providerName,
                multiCityTrips: newTripsData
              });
            }
        }
        else if (this.domRoundTrip || this.domMultiCity) {
          data = this.BaggageNameWiseFiltering(baggageData);
          if (data.length > 0) {
            // Add data to the filteredData array only if data.length is not 0
            filteredData.push([...data]);
          }
        }
      }
    }

    return filteredData;
  }
  BaggageNameWiseFiltering(data: any) { // Send array of item
    
    if (this.intRoundTrip) {
      let legData: any[] = [];

      for (let j = 0; j < data.length; j++) {
        const firstLegBaggageWeight = data[j]?.firstLeg?.flightDetails[0]?.passangerBaggages[0]?.baggageWeight.toLowerCase();
        const firstLegBaggageUnit = data[j]?.firstLeg?.flightDetails[0]?.passangerBaggages[0]?.baggageUnit.toLowerCase();
        const lastLegBaggageWeight = data[j]?.lastLeg?.flightDetails[0]?.passangerBaggages[0]?.baggageWeight.toLowerCase();
        const lastLegBaggageUnit = data[j]?.lastLeg?.flightDetails[0]?.passangerBaggages[0]?.baggageUnit.toLowerCase();

        // Check if the combination of baggageWeight and baggageUnit matches any combination in baggagename for firstLeg
        const matchedFirstLegBaggage = this.activebaggageNames.some((bag:any) => {
          return bag.bagWeight.toLowerCase() === firstLegBaggageWeight && bag.unit.toLowerCase() === firstLegBaggageUnit;
        });

        // Check if the combination of baggageWeight and baggageUnit matches any combination in baggagename for lastLeg
        const matchedLastLegBaggage = this.activebaggageNames.some((bag:any) => {
          return bag.bagWeight.toLowerCase() === lastLegBaggageWeight && bag.unit.toLowerCase() === lastLegBaggageUnit;
        });

        if (matchedFirstLegBaggage || matchedLastLegBaggage) {
          let isfirstLeg = false;
          let len = legData.length;
          if (!legData[len]) {
            legData[len] = {};
          }

          // Check if it's the first leg
          if (data[j]?.firstLeg) {
            isfirstLeg = true;
            legData[len].firstLeg = data[j].firstLeg;
            legData[len].lastLeg = null;
          }

          // Check if it's the last leg
          if (data[j]?.lastLeg) {
            legData[len].firstLeg = isfirstLeg != true? null:data[j].firstLeg;
            legData[len].lastLeg = data[j].lastLeg;
          }
        }
      }
      return legData;
    }
    else {
      let item = data.filter((e: any) => {
        const baggageWeight = e?.flightDetails[0]?.passangerBaggages[0]?.baggageWeight.toLowerCase();
        const baggageUnit = e?.flightDetails[0]?.passangerBaggages[0]?.baggageUnit.toLowerCase();

        // Check if baggageWeight and baggageUnit match any combination in baggagename
        return this.activebaggageNames.some((bag:any) => {
          return bag.bagWeight.toLowerCase() === baggageWeight && bag.unit.toLowerCase() === baggageUnit;
        });
      });

      return item;
    }

  }
  _scheduleWidgetSelect(i:string,cap:string)
  {
    
    $('#'+cap+'ScheduleBox'+i).css("background-color", this.flightHelper.scheduleWidgetSelectColor);
    $('#'+cap+'TitleId'+i).css("color", this.flightHelper.scheduleWidgetSelectTitleColor);
  }
  _scheduleWidgetReSelect(i:string, cap: string) {
    $('#'+cap+'ScheduleBox'+i).css("background-color", ""); // Reset background color
    $('#'+cap+'TitleId'+i).css("color", ""); // Reset text color
  }
  // checkboxStates: boolean[] = new Array(this.departureTimes.length).fill(false);
  departureTimeClicked(i: number,details:string,title:string,cityCode:string,id:any, event: Event, depIndex:number)
  {
    
    const checkbox = document.getElementById(id) as HTMLInputElement;

    if (checkbox) {
      checkbox.checked = !checkbox.checked; // Toggle the checkbox state
      // Now you can use checkbox.checked in your logic
    }
    if (this.activeDepartureNames.length==0) {
      this.duplicateDepartureData = this.filterData.slice();
    }
    try {
      // this.checkboxStates[i] = !this.checkboxStates[i];
      event.stopPropagation();
      if (!(event.target instanceof HTMLInputElement)) { // Check if the target is not an input
        if (checkbox.checked) {
          this._scheduleWidgetSelect(i+''+depIndex, 'dept');
          if (!this.activeDepartureNames.some((item:any) => item.index === i && item.depIndex === depIndex)) {
            this.activeDepartureNames.push({ cityCode: cityCode, title: title, details:details,index:i,depIndex:depIndex })
          }
          let newData = this.subFilterDepartureTime(depIndex);
          if (newData) {
            this.filterData = newData;
          }
          this.isActiveDepartureName = true;
        }
        else {
          this.uncheckDepartureDate(i, depIndex);
        }
        this.ViewMoreAndLessData();
        this.topFlightSearch();
        this.setBaggageList();
      }

    } catch (error) {

    }
  }
  subFilterDepartureTime(depIndex:number)
  {
    
    let filteredData:any[] = [];
    let data:any;
    if (this.domOneWay) {
      data = this.depDateWiseFiltering(this.duplicateDepartureData,depIndex);
      if (data.length > 0) {
        filteredData = data;
      }
    }
    else if (this.domRoundTrip || this.domMultiCity) {
      for (let DepartureData of this.filterData)
      {
        filteredData.push([...DepartureData]);
      }
      let tripArrayData = this.duplicateDepartureData[depIndex];
      data = this.depDateWiseFiltering(tripArrayData,depIndex);
      if (data) {
        filteredData[depIndex] = data;
      }
    }
    else {
      for (let departureData of this.duplicateDepartureData) {
        if (this.intOneWay) {
          data = this.depDateWiseFiltering(departureData.value,depIndex);
          if (data.length > 0) {
            // Add data to the filteredData array only if data.length is not 0
            filteredData.push({
              airlinesLogo:departureData.airlinesLogo,
              airlinesName:departureData.airlinesName,
              carrier:departureData.carrier,
              providerName:departureData.providerName,
              supplierShortName:departureData.supplierShortName,
              value: data
            });
          }
        }
        else if (this.intRoundTrip) {
          data = this.depDateWiseFiltering(departureData.value,depIndex);
          if (data.length > 0) {
            // Add data to the filteredData array only if data.length is not 0
            filteredData.push({
              carrier:departureData.carrier,
              providerName:departureData.providerName,
              supplierShortName:departureData.supplierShortName,
              value: data
            });
          }
        }
        else if (this.intMultiCity) {
          let newTripsData = [];
          for (let tripsData of departureData.multiCityTrips) {
            let isAllAccess=true;
            let tripArrayData = [tripsData.trips[0]];
            for (let trips of tripsData.trips) {
              if (trips==null) {
                isAllAccess = false;
              }
            }
            data = this.depDateWiseFiltering(tripArrayData,depIndex);
            if (isAllAccess && data.length > 0 || tripArrayData==null ) {
              newTripsData.push({
                trips:tripsData.trips
              })
            }
          }
          if (newTripsData.length > 0) {
              // Add data to the filteredData array only if data.length is not 0
              filteredData.push({
                carrier:departureData.carrier,
                providerName:departureData.providerName,
                multiCityTrips: newTripsData
              });
            }
        }
      }
    }
    return filteredData;
  }
  depDateWiseFiltering(data:any,depIndex:number)
  {
    
    let DepartureFilterNames: any[];
    DepartureFilterNames = this.activeDepartureNames.filter((e:any) => e.depIndex == depIndex);
    if (this.intRoundTrip) {
      let legData: any[] = [];

    let firstLegDepFilterNames: any[];
    let lastLegDepFilterNames: any[];
    firstLegDepFilterNames = this.activeDepartureNames.filter((e:any) => e.depIndex == 0);
    lastLegDepFilterNames = this.activeDepartureNames.filter((e:any) => e.depIndex == 1);
      for (let j = 0; j < data.length; j++) {
        const firstLegDepartureTime = data[j]?.firstLeg?.departureTime;
        let matchedFirstLegDepTime = firstLegDepFilterNames.some((dep:any) => {
          let isTrue;
          if (dep.details == environment.Morning) {
            isTrue= "12:00" >= firstLegDepartureTime;
          }
          else if (dep.details == environment.Afternoon) {
            isTrue= "12:00" < firstLegDepartureTime && firstLegDepartureTime <= "18:00";
          }
          else if (dep.details == environment.Night) {
            isTrue= "18:00" < firstLegDepartureTime ;
          }
          return isTrue;
        });
        const lastLegDepartureTime = data[j]?.lastLeg?.departureTime;
        let matchedLasttLegDepTime = lastLegDepFilterNames.some((dep:any) => {
          let isTrue;
          if (dep.details == environment.Morning) {
            isTrue= "12:00" >= lastLegDepartureTime;
          }
          else if (dep.details == environment.Afternoon) {
            isTrue= "12:00" < lastLegDepartureTime && lastLegDepartureTime <= "18:00";
          }
          else if (dep.details == environment.Night) {
            isTrue= "18:00" < lastLegDepartureTime ;
          }
          return isTrue;
        });
        if (firstLegDepFilterNames.length==0) {
          matchedFirstLegDepTime = true;
        }
        if (lastLegDepFilterNames.length==0) {
          matchedLasttLegDepTime = true;
        }
        if (depIndex==0) {
          // Check if it's the first leg
          let len = legData.length;
          if (matchedFirstLegDepTime) {
            if (!legData[len]) {
              legData[len] = {};
            }
            legData[len].firstLeg = data[j].firstLeg;
            if (matchedLasttLegDepTime) {
              legData[len].lastLeg = data[j].lastLeg;
            }
            else {
              legData[len].lastLeg = null;
            }
          }
          else {
            if (matchedLasttLegDepTime) {
              if (!legData[len]) {
                legData[len] = {};
              }
              legData[len].firstLeg = null;
              legData[len].lastLeg = data[j].lastLeg;
            }
          }
        }
        else {
          // Check if it's the last leg
          let len = legData.length;
          if (matchedLasttLegDepTime) {
            if (!legData[len]) {
              legData[len] = {};
            }
            if (matchedFirstLegDepTime) {
              legData[len].firstLeg = data[j].firstLeg;
            }
            else {
              legData[len].firstLeg = null;
            }
            legData[len].lastLeg = data[j].lastLeg;
          }
          else {
            if (matchedFirstLegDepTime) {
              if (!legData[len]) {
                legData[len] = {};
              }
              legData[len].firstLeg = data[j].firstLeg;
              legData[len].lastLeg = null;
            }
          }
        }
      }

      if (legData.length > 0) {
        if (legData[0]?.firstLeg==null) {
          let firstIndex: number | null = null;
          for (let i = 0; i < legData?.length; i++) {
              if (legData[i]?.firstLeg !== null) {
                firstIndex = i;
                  break;
              }
          }
          if (firstIndex !== null) {
            const temp = legData[0].firstLeg;
            legData[0].firstLeg = legData[firstIndex].firstLeg;
            legData[firstIndex].firstLeg = temp;
          }
        }
        if (legData[0].lastLeg == null) {
        let lastIndex: number | null = null;
        for (let i = 0; i < legData.length; i++) {
            if (legData[i].lastLeg !== null) {
              lastIndex = i;
                break;
            }
        }
        if (lastIndex !== null) {
          const temp = legData[0].lastLeg;
          legData[0].lastLeg = legData[lastIndex].lastLeg;
          legData[lastIndex].lastLeg = temp;
        }
      }
        let islastLeg = false;
        let isfirstLeg = false;
        if (depIndex == 0) {
          islastLeg = legData.some((item:any) => item.lastLeg !== null )
          isfirstLeg = legData.some((item:any) => item.firstLeg !== null )
        }
        if (depIndex == 1) {
          islastLeg = legData.some((item:any) => item.lastLeg !== null )
          isfirstLeg = legData.some((item:any) => item.firstLeg !== null )
        }
        if ((islastLeg && !isfirstLeg) || (!islastLeg && isfirstLeg)) {
          legData = [];
        }
      }
      return legData;
    }
    else {
      let item;
      item = data.filter((e: any) => {
        const departureTime = e?.departureTime;
        return DepartureFilterNames.some((dep: any) => {
          let isTrue;
          if (dep.details == environment.Morning) {
            isTrue=  "12:00" >= departureTime;
          }
          else if (dep.details == environment.Afternoon) {
            isTrue= "12:00" < departureTime && departureTime <= "18:00";
          }
          else if (dep.details == environment.Night) {
            isTrue= "18:00" < departureTime ;
          }
          return isTrue;
        });
      });
      return item;
    }
  }
  uncheckDepartureDate(index:number,depIndex:number)
  {
    
    if (this.activeDepartureNames.length > 1) {
      this.activeDepartureNames = this.activeDepartureNames.filter((item: any) => item.index !== index || item.depIndex !== depIndex);
      if (this.activeDepartureNames.filter((item: any) => item.depIndex === depIndex).length>0) {
        let newData = this.subFilterDepartureTime(depIndex);
        if (newData.length) {
          this.filterData = newData;
        }
      }
      else {
        if (this.domRoundTrip || this.domMultiCity) {
          this.filterData[depIndex] = this.duplicateDepartureData[depIndex];
        }
        else if (this.intRoundTrip) {
          let newData = this.subFilterDepartureTime(depIndex);
          if (newData.length) {
            this.filterData = newData;
          }
        }
      }
    }
    else {
      this.activeDepartureNames = this.activeDepartureNames.filter((item: any) => item.index !== index || item.depIndex !== depIndex);
      this.filterData = this.duplicateDepartureData;
    }
    if (this.activeDepartureNames.length<1) {
      this.isActiveDepartureName = false;
    }
    this._scheduleWidgetReSelect(index+''+depIndex, 'dept');
    this.ViewMoreAndLessData();
    this.topFlightSearch();
    this.setBaggageList();
  }
  penalties:any;
  getPenalties(item:any){
    this.penalties= item;
    this.btnModalOpen.nativeElement.click();
  }
}

enum FlightTypes {
  OneWay,
  RoundTrip,
  Multicity
}


enum PassangerTypes {
  Adult,
  Child,
  Infant
}

interface CabinCode {
  cabinCode: string;
}

interface SearchRequestPassenger {
  Code: PassangerTypes;
  Age: number;
}

interface VendorPreference {
  Code: string;
  PreferLevel: boolean;
}

interface CommonFlightSearchRequestModel {
  cabinCodes: CabinCode[];
  passengerTypeQuantities: SearchRequestPassenger[];
  totalPassenger: number;
  VendorPref: VendorPreference[];
  departureLocationCodeList: string[];
  arrivalLocationCodeList: string[];
  departureDateList: string[];
  returnDate: string;
  FlightType: FlightTypes;
  TripType: string;
  Stop:string;
}


