import { DatePipe, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import flatpickr from "flatpickr";
import { Select2OptionData } from 'ng-select2';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { FlightRoutes } from 'src/app/model/flight-routes.model';
import { FlightSearchSection } from 'src/app/model/flight-search-section.model';
import { PassengerInfoModel } from 'src/app/model/passenger-info-model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../_services/auth.service';
import { ShareService } from '../../_services/share.service';
import { ToastrService } from '../../_services/toastr.service';
import { FlightHelperService } from '../flight-helper.service';
import yearDropdownPlugin from '../../_services/flatpickr-yearDropdownPlugin';
declare var window: any;
declare var $: any;
declare let bKash:any;
declare let Swal:any;
@Component({
  selector: 'app-Index',
  templateUrl: './Index.component.html',
  styleUrls: ['./Index.component.css'],
})
export class IndexComponent implements OnInit {
  urlMain = "./assets/dist/js/main.min.js";
  urlDemo = "./assets/dist/js/demo.js";

  amount: any;
  adminUrl = environment.adminUrl;

  loadAPI: Promise<any> | any;

  departureDateModel: NgbDateStruct | any;
  departureDay:string=this.shareService.getDay("");
  departureMonthYear:string=this.shareService.getMonthShort(new Date().toISOString())+"'"+this.shareService.getYearShort(new Date().toISOString());
  departureDayName:string=this.shareService.getDayNameLong(new Date().toISOString());

  returnDateModel: NgbDateStruct|any;
  returnDay:string=this.shareService.getDay("");
  returnMonthYear:string=this.shareService.getMonthShort(new Date().toISOString())+"'"+this.shareService.getYearShort(new Date().toISOString());
  returnDayName:string=this.shareService.getDayNameLong(new Date().toISOString());

  cDay:number=Number(this.shareService.getDay(""));
  cMonth:number=Number(this.shareService.getMonth(""));
  cYear:number=Number(this.shareService.getYearLong(""));

  retDay:number=Number(this.shareService.getDay(""));
  retMonth:number=Number(this.shareService.getMonth(""));
  retYear:number=Number(this.shareService.getYearLong(""));

  childList:number[]=[];
  childList2:number[]=[];
  childListFinal:any[]=[];
  childSelectList:number[]=[6];
  indexAddImages:any[]=[];

  isLoad:boolean | undefined;

  childNumber:number=0;

  _selectedAirlines:any;
  selectAirlines:string="";

  @ViewChild('instance', {static: true}) instance: NgbTypeahead|any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  flightFromModel:any;
  flightToModel:any;

  modeldp!: string;
  model2: any;
  searchForm!: FormGroup;
  multicityForm!: FormGroup;
  ignoreClick = false;
  isSearchFromShow = true;
  isSearchToShow = true;
  isTravellerFromShow = true;
  isbirthDateShow = true;
  isdepartureShow = true;
  isreturnShow = true;
  isOneWayShow = true;
  isRoundTripShow = true;
  isMultiCityShow = true;
  isMultiCityDepartureShow = true;
  isMultiCitySearchFromShow = true;
  isMultiCitySearchToShow = true;
  isMultiCityOneDepartureShow = true;
  isMultiCityOneSearchFromShow = true;
  isMultiCityOneSearchToShow = true;
  isAddButtonOneShow = false;
  isMultiCityTwoDepartureShow = true;
  isMultiCityTwoSearchFromShow = true;
  isMultiCityTwoSearchToShow = true;
  isMultipleCityTwoShow = true;
  isAddButtonTwoShow = false;
  isMultiCityThreeDepartureShow = true;
  isMultiCityThreeSearchFromShow = true;
  isMultiCityThreeSearchToShow = true;
  isMultipleCityThreeShow = true;
  isAddButtonThreeShow = false;
  isMultiCityFourDepartureShow = true;
  isMultiCityFourSearchFromShow = true;
  isMultiCityFourSearchToShow = true;
  isMultipleCityFourShow = true;
  isMultiCityTravellerFromShow = true;
  isMultiCitybirthDateShow = true;
  isDepartureDateShow = true;
  isReturnDateShow = true;
  isFlightSearchSection = true;
  isMultipleCityShow = true;
  isSuggDeparture:boolean=false;
  isSuggReturn:boolean=false;

  isSuggDeparture1:boolean=false;
  isSuggReturn1:boolean=false;
  isSuggDeparture2:boolean=false;
  isSuggReturn2:boolean=false;
  isSuggDeparture3:boolean=false;
  isSuggReturn3:boolean=false;
  isSuggDeparture4:boolean=false;
  isSuggReturn4:boolean=false;

  city1:boolean=false;
  city2:boolean=false;
  city3:boolean=false;
  city4:boolean=false;

  selectedAirportFromId:string="";
  selectedAirportToId:string="";
  selectedDepartureDate:string=this.shareService.getYearLong()+"-"+
  this.shareService.padLeft(this.shareService.getMonth(),'0',2)+"-"+this.shareService.padLeft(this.shareService.getDay(),'0',2);
  selectedReturnDate:string=this.shareService.getYearLong()+"-"+
  this.shareService.padLeft(this.shareService.getMonth(),'0',2)+"-"+this.shareService.padLeft(this.shareService.getDay(),'0',2);

  selectedDepartureCity:string="";
  selectedDepartureCityCode:string="";
  selectedDepartureAirport:string="";
  selectedDepartureCountry:string="";

  selectedReturnCity:string="";
  selectedReturnCityCode:string="";
  selectedReturnAirport:string="";
  selectedReturnCountry:string="";

  airports: any[]=[];
  airlines: any[]=[];

  tempAirportsDeparture: any=[];
  tempAirportsArrival: any=[];
  tempAirportsDeparture1: any=[];
  tempAirportsArrival1: any=[];
  tempAirportsDeparture2: any=[];
  tempAirportsArrival2: any=[];
  tempAirportsDeparture3: any=[];
  tempAirportsArrival3: any=[];
  tempAirportsDeparture4: any=[];
  tempAirportsArrival4: any=[];

  recentFlightSearch: any[]=[];
  recentBookingFlight: any[]=[];
  bookingNotice: any=[];
  pageimages!: Array<Select2OptionData>;
  keyword = 'cityname';
  @ViewChild('tripFrom') tripFrom : any;
  @ViewChild('tripTo') tripTo : any;
  @ViewChild('multiFrom') multiFrom : any;
  @ViewChild('multiTo') multiTo : any;
  @ViewChild('multioneFrom') multioneFrom : any;
  @ViewChild('multioneTo') multioneTo : any;
  @ViewChild('multitwoFrom') multitwoFrom : any;
  @ViewChild('multitwoTo') multitwoTo : any;
  @ViewChild('multithreeFrom') multithreeFrom : any;
  @ViewChild('multithreeTo') multithreeTo : any;
  @ViewChild('multifourFrom') multifourFrom : any;
  @ViewChild('multifourTo') multifourTo : any;
  @ViewChild('oneWayButton') oneWayButton : ElementRef | any;
  @ViewChild('roundTripButton') roundTripButton : ElementRef | any;
  @ViewChild('departure') departure : ElementRef | any;
  @ViewChild('return') return : ElementRef | any;
  @ViewChild('travellers') travellers : ElementRef | any;
  @ViewChild('roundtripfrom') roundtripfrom : ElementRef | any;
  @ViewChild('roundtripto') roundtripto : ElementRef | any;
  @ViewChild('multicityfrom') multicityfrom : ElementRef | any;
  @ViewChild('multicityto') multicityto : ElementRef | any;
  @ViewChild('multideparture') multideparture : ElementRef | any;
  @ViewChild('multionedeparture') multionedeparture : ElementRef | any;
  @ViewChild('multitwodeparture') multitwodeparture : ElementRef | any;
  @ViewChild('multithreedeparture') multithreedeparture : ElementRef | any;
  @ViewChild('multifourdeparture') multifourdeparture : ElementRef | any;
  @ViewChild('multicitytravellers') multicitytravellers : ElementRef | any;
  @ViewChild('ddates') ddates : ElementRef | any;
  @ViewChild('modelrn') modelrn : ElementRef | any;

  @ViewChild('returnDatePick') returnDatePick:ElementRef | any;
  @ViewChild('selectAirlinesId') selectAirlinesId:ElementRef | any;
  @ViewChild('typeahead-template') typeaheadRoundTrip:ElementRef|any;
  @ViewChild('suggDeparture') suggDeparture:ElementRef|any;
  @ViewChild('suggReturn') suggReturn:ElementRef|any;
  @ViewChild('suggDeparture1') suggDeparture1:ElementRef|any;
  @ViewChild('suggReturn1') suggReturn1:ElementRef|any;
  @ViewChild('suggDeparture2') suggDeparture2:ElementRef|any;
  @ViewChild('suggReturn2') suggReturn2:ElementRef|any;
  @ViewChild('suggDeparture3') suggDeparture3:ElementRef|any;
  @ViewChild('suggReturn3') suggReturn3:ElementRef|any;
  @ViewChild('suggDeparture4') suggDeparture4:ElementRef|any;
  @ViewChild('suggReturn4') suggReturn4:ElementRef|any;
  @ViewChild('recentFlight', {read: DragScrollComponent}) recentFlight: DragScrollComponent | any;

  fmgSearchHistory:FormGroup|any;
  fmgSearchHistoryInfo:FormGroup|any;
  fmgSearchHistoryDetails:FormGroup|any;

  last1 = 7;
  last2 = 0;
  last3 = 4;
  num1 = 1;
  num2 = 0;
  num3 = 0;
  last4 = 9;
  last5 = 0;
  last6 = 6;
  num4 = 1;
  num5 = 0;
  num6 = 0;

  last7 = 0;
  last8 = 3;
  num7 = 0;
  name7 = 0;
  from7 = 0;

  values: any = [];
  valuethrees: any = [];
  valuefours: any = [];
  showBox = true;
  multicityshowBox = true;

  date: Date = new Date();
  isOneway:boolean=false;
  isMulticity:boolean=false;
  isRoundtrip:boolean=false;
  isPartnersQue:boolean=false;

  departureDate:string='';
  isDepartureDate:boolean=false;
  dDepartureDate:string='';

  noticeText:string="";
  sn1:string="";sn2:string="";sn3:string="";sn4:string="";
  in1:string="";in2:string="";in3:string="";in4:string="";
  fc1:string="";fc2:string="";fc3:string="";fc4:string="";
  tc1:string="";tc2:string="";tc3:string="";tc4:string="";
  id1:string="";id2:string="";id3:string="";id4:string="";
  ac1:string="";ac2:string="";ac3:string="";ac4:string="";

  flightSearchSection:Array<FlightSearchSection>=[];
  selectedFlightDeparture:FlightRoutes[]=[];
  selectedFlightArrival:FlightRoutes[]=[];

  formatterFlightSearch= (x: {code: string}) => x.code;
  keywords:string = 'all';

  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter,private authService: AuthService,
  private router: Router, private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,public flightHelper:FlightHelperService,private storage:LocalStorageService)
  {
    this.returnDateModel=calendar.getToday();
  }
  ngOnInit() {
    this.renderer.removeClass(this.document.body, 'flight_search_details');
      this._initBoringTools();
      this._initSearchHistoryForm();
      this.init();
    $("#travellersBox").css("display", "none");
    localStorage.setItem('loaderData', JSON.stringify(''));
  }
  public clicked: boolean = false;
    public loadScript() {
      let node4 = document.createElement("script");
      node4.src = this.urlMain;
      node4.type = "text/javascript";
      node4.async = true;
      node4.charset = "utf-8";
      document.getElementsByTagName("head")[0].appendChild(node4);
    }
    public init():void{

      this.isLoad=false;
      this.isRoundtrip=true;
      // this.refresh();
      this.getIndexAddImages();
      this.setPassengerInformation();
      this.getFlightList();
      this.getAirlineList();
      this.getRecentFlightSearch();
      this.getRecentBookingFlight();
      this.getB2BNotice();
      this.loadAPI = new Promise(resolve => {
        // console.log("resolving promise...");
        this.loadScript();
      });
      this.searchForm = this.fb.group({
        Name: ['', Validators.required],
      });
      this.multicityForm = this.fb.group({
        Name: ['', Validators.required],
      });
      $("#maxConnection").val(2);
      // $("#fareType").val(2);
      this.getAgencyPermission();
    }
    initFlightDepartureArrival()
    {
      this.selectedFlightDeparture=[];
      this.selectedFlightArrival=[];
      let i=4;
      while(i!=0)
      {
        this.selectedFlightDeparture.push({
          Id:this.selectedAirportFromId,
          CityCode:"",
          CityName:"Select City",
          CountryCode: "",
          CountryName:"",
          AirportCode:"",
          AirportName:"",
          Date:this.selectedDepartureDate
        });
        this.selectedFlightArrival.push({
          Id:this.selectedAirportFromId,
          CityCode:"",
          CityName:"Select City",
          CountryCode: "",
          CountryName:"",
          AirportCode:"",
          AirportName:"",
          Date:""
        });
        i-=1;
      }

      this.selectedFlightDeparture[0].Id=this.selectedAirportToId;
      this.selectedFlightDeparture[0].CityCode=this.selectedReturnCityCode;
      this.selectedFlightDeparture[0].CityName=this.selectedReturnCity;
      this.selectedFlightDeparture[0].CountryName=this.selectedReturnCountry;
      this.selectedFlightDeparture[0].AirportName=this.selectedReturnAirport;

      // console.log("Selected lfight section");
      // console.log(this.selectedFlightDeparture);
      // console.log(this.selectedFlightArrival);
    }
  getAgencyPermission()
  {
    var userId=this.shareService.getUserId();
    try{
      this.authService.getAgencyPermit(userId).subscribe(data => {
        if(data.data)
        {
          // console.log("Continuee..");
        }else{
          const ulhid = localStorage.getItem('ulhid');
          this.authService.logout(ulhid).subscribe(() => {
            localStorage.clear();
          }, (error) => {
            localStorage.clear();
            this.router.navigate(['../../login']);
          }, () => {
            localStorage.clear();
            this.router.navigate(['/login']);
          });
        }

        }, err => {
        console.log(err);
      });
    }catch(exp){

    }
  }
    _initSearchHistoryForm()
    {
      this.fmgSearchHistory=this.fb.group({
        FlightSearchHistory:new FormData(),
        FlightSearchDetailsHistory:new FormArray([]),
      });
      this.fmgSearchHistoryDetails=this.fb.group({
        VFlightSearchHistoryId:['',Validators.nullValidator],
        IChildAge:['',Validators.nullValidator]
      });
      this.fmgSearchHistoryInfo=this.fb.group({
        Id:['',Validators.nullValidator],
        DSearchDate:['',Validators.nullValidator],
        VAirportIdfrom:['',Validators.nullValidator],
        VAirportIdto:['',Validators.nullValidator],
        DDepartureDate:['',Validators.nullValidator],
        DReturnDate:['',Validators.nullValidator],
        VFlightTypeId:['',Validators.nullValidator],
        VCabinTypeId:['',Validators.nullValidator],
        INumberAdult:['',Validators.nullValidator],
        INumberChild:['',Validators.nullValidator],
        INumberInfant:['',Validators.nullValidator],
        VAirlinesId:['',Validators.nullValidator],
        VFlightStopId:['',Validators.nullValidator],
        VFareTypeId:['',Validators.nullValidator]
      });
    }
    // =========Date=========
    _initBoringTools()
    {
      // $('.select2').select2();
      flatpickr(".flat-datepick-from", {
        plugins: [
           yearDropdownPlugin({
            date: new Date(),
            yearStart: 0,
            yearEnd: 2
          })
        ],
        enableTime: false,
        dateFormat: "d-m-Y",
        allowInput:true,
        minDate:"today"
      });
      setTimeout(()=>{
        flatpickr(".flat-datepick-to", {
          plugins: [
            yearDropdownPlugin({
             date: new Date(),
             yearStart: 0,
             yearEnd: 2
           })
         ],
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:"today"
        });
      });
    }
    trueFalseCity()
    {
      this.city1=false;
      this.city2=false;
      this.city3=false;
      this.city4=false;
    }
    addRemoveFlightSection(i:number,b:boolean)
    {
      try{
        switch(i)
        {
          case 0:
            if(b)
            {
              this.city2=b;
              setTimeout(()=>{
                let formattedDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
                if(isNaN(formattedDate.getTime())){
                  formattedDate = new Date();
                }
                flatpickr(".flat-datepick-from1", {
                  plugins: [
                    yearDropdownPlugin({
                     date: formattedDate,
                     yearStart: 0,
                     yearEnd: 2
                   })
                 ],
                  enableTime: false,
                  dateFormat: "d-m-Y",
                  allowInput:true,
                  minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                  this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                  this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
                });
                formattedDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
                if(isNaN(formattedDate.getTime())){
                  formattedDate = new Date();
                }
                flatpickr(".flat-datepick-from2", {
                  plugins: [
                    yearDropdownPlugin({
                     date: formattedDate,
                     yearStart: 0,
                     yearEnd: 2
                   })
                 ],
                  enableTime: false,
                  dateFormat: "d-m-Y",
                  allowInput:true,
                  minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                  this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                  this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
                });
                formattedDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
                if(isNaN(formattedDate.getTime())){
                  formattedDate = new Date();
                }
                flatpickr(".flat-datepick-from3", {
                  plugins: [
                    yearDropdownPlugin({
                     date: formattedDate,
                     yearStart: 0,
                     yearEnd: 2
                   })
                 ],
                  enableTime: false,
                  dateFormat: "d-m-Y",
                  allowInput:true,
                  minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                  this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                  this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
                });
              });
            }else{
              this.city1=b;
            }
            break;
          case 1:
            if(b)
            {
              this.city3=b;
              setTimeout(()=>{
                let formattedDate = new Date(this.selectedFlightDeparture[1].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
                if(isNaN(formattedDate.getTime())){
                  formattedDate = new Date();
                }
                flatpickr(".flat-datepick-from2", {
                  plugins: [
                    yearDropdownPlugin({
                     date: formattedDate,
                     yearStart: 0,
                     yearEnd: 2
                   })
                 ],
                  enableTime: false,
                  dateFormat: "d-m-Y",
                  allowInput:true,
                  minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[1].Date),'0',2)+"."+
                  this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[1].Date),'0',2)+"."+
                  this.shareService.getYearLong(this.selectedFlightDeparture[1].Date)
                });
                formattedDate = new Date(this.selectedFlightDeparture[1].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
                if(isNaN(formattedDate.getTime())){
                  formattedDate = new Date();
                }
                flatpickr(".flat-datepick-from3", {
                  plugins: [
                    yearDropdownPlugin({
                     date: formattedDate,
                     yearStart: 0,
                     yearEnd: 2
                   })
                 ],
                  enableTime: false,
                  dateFormat: "d-m-Y",
                  allowInput:true,
                  minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[1].Date),'0',2)+"."+
                  this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[1].Date),'0',2)+"."+
                  this.shareService.getYearLong(this.selectedFlightDeparture[1].Date)
                });
              });
            }else{
              this.city2=b;
            }
            break;
          case 2:
            if(b)
            {
              this.city4=b;
              setTimeout(()=>{
                let formattedDate = new Date(this.selectedFlightDeparture[2].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
                if(isNaN(formattedDate.getTime())){
                  formattedDate = new Date();
                }
                flatpickr(".flat-datepick-from3", {
                  plugins: [
                    yearDropdownPlugin({
                     date: formattedDate,
                     yearStart: 0,
                     yearEnd: 2
                   })
                 ],
                  enableTime: false,
                  dateFormat: "d-m-Y",
                  allowInput:true,
                  minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[2].Date),'0',2)+"."+
                  this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[2].Date),'0',2)+"."+
                  this.shareService.getYearLong(this.selectedFlightDeparture[2].Date)
                });
              });
            }else{
              this.city3=b;
            }
            break;
          case 3:
            if(b==false)
            {
              this.city4=b;
            }
            break;
        }
      }catch(exp){}
    }
    changeDepartureReturnDate(evt:any,type:any,i:number)
    {
      try{
        let val=evt.srcElement.value;
        if(type=="departure")
        {
          if(i>-1)
          {
            this.selectedFlightDeparture[i].Date=this.shareService.getBdToDb(val);
            this.selectedFlightDeparture[i+1].Date=this.shareService.getBdToDb(val);
            let formattedDate = new Date(this.selectedFlightDeparture[i].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
            if(isNaN(formattedDate.getTime())){
              formattedDate = new Date();
            }
            flatpickr(".flat-datepick-from"+(i+1), {
              plugins: [
                yearDropdownPlugin({
                 date: formattedDate,
                 yearStart: 0,
                 yearEnd: 2
               })
             ],
              enableTime: false,
              dateFormat: "d-m-Y",
              allowInput:true,
              minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[i].Date),'0',2)+"."+
              this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[i].Date),'0',2)+"."+
              this.shareService.getYearLong(this.selectedFlightDeparture[i].Date)
            });
            if(Date.parse(this.selectedFlightDeparture[i].Date)>Date.parse(this.selectedFlightArrival[i].Date))
            {
              let d=this.selectedFlightDeparture[i].Date;
              this.selectedFlightArrival[i].Date=this.shareService.getYearLong(d)+"-"+
              this.shareService.padLeft(this.shareService.getMonth(d),'0',2)+"-"+
              this.shareService.padLeft(this.shareService.getDay(d),'0',2);
            }
          }else
          {
            this.selectedDepartureDate=this.shareService.getBdToDb(val);
            this.selectedFlightDeparture[0].Date=this.selectedDepartureDate;
            let formattedDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
            if(isNaN(formattedDate.getTime())){
              formattedDate = new Date();
            }
            flatpickr(".flat-datepick-from0", {
              plugins: [
                yearDropdownPlugin({
                 date: formattedDate,
                 yearStart: 0,
                 yearEnd: 2
               })
             ],
              enableTime: false,
              dateFormat: "d-m-Y",
              allowInput:true,
              minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
            });
            formattedDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
            if(isNaN(formattedDate.getTime())){
              formattedDate = new Date();
            }
            flatpickr(".flat-datepick-from1", {
              plugins: [
                yearDropdownPlugin({
                 date: formattedDate,
                 yearStart: 0,
                 yearEnd: 2
               })
             ],
              enableTime: false,
              dateFormat: "d-m-Y",
              allowInput:true,
              minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
            });
            formattedDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
            if(isNaN(formattedDate.getTime())){
              formattedDate = new Date();
            }
            flatpickr(".flat-datepick-from2", {
              plugins: [
                yearDropdownPlugin({
                 date: formattedDate,
                 yearStart: 0,
                 yearEnd: 2
               })
             ],
              enableTime: false,
              dateFormat: "d-m-Y",
              allowInput:true,
              minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
            });
            formattedDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
            if(isNaN(formattedDate.getTime())){
              formattedDate = new Date();
            }
            flatpickr(".flat-datepick-from3", {
              plugins: [
                yearDropdownPlugin({
                 date: formattedDate,
                 yearStart: 0,
                 yearEnd: 2
               })
             ],
              enableTime: false,
              dateFormat: "d-m-Y",
              allowInput:true,
              minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
            });
            let formattedReturnDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
            if(isNaN(formattedReturnDate.getTime())){
              formattedReturnDate = new Date();
            }
            flatpickr(".flat-datepick-to", {
              plugins: [
                yearDropdownPlugin({
                 date: formattedReturnDate,
                 yearStart: 0,
                 yearEnd: 2
               })
             ],
              enableTime: false,
              dateFormat: "d-m-Y",
              allowInput:true,
              minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
              this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
            });
            if(Date.parse(this.selectedDepartureDate)>Date.parse(this.selectedReturnDate))
            {
              this.selectedReturnDate=this.shareService.getYearLong(this.selectedDepartureDate)+"-"+
              this.shareService.padLeft(this.shareService.getMonth(this.selectedDepartureDate),'0',2)+"-"+
              this.shareService.padLeft(this.shareService.getDay(this.selectedDepartureDate),'0',2);
            }
          }
        }
        if(type=="return")
        {
          if(i>-1)
          {
            this.selectedFlightArrival[i].Date=this.shareService.getBdToDb(val);
          }else{
            this.selectedReturnDate=this.shareService.getBdToDb(val);
          }
          if(!this.isMulticity)
          {
            this.roundTripButton.nativeElement.click();
          }
        }

      }catch(exp){}
    }
    search: OperatorFunction<string, readonly {text:string, id:string}[]> = (text$: Observable<string>) => {

      return text$.pipe(
        debounceTime(200),
        map(term => term === '' ? []
          : this.getFindedValue(term))
      );
    }
    refresh(): void {
      window.location.reload();
    }
    getFindedValue(term:string):any
    {
      let data:any[];
      if(this.airports.find(x=>x.code.toLowerCase().indexOf(term.toLowerCase()) > -1))
      {
        data=this.airports.filter(v => (v.code).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
      }else if(this.airports.find(x=>x.text.toLowerCase().indexOf(term.toLowerCase()) > -1))
      {
        data=this.airports.filter(v => (v.text).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
      }else if(this.airports.find(x=>x.cityname.toLowerCase().indexOf(term.toLowerCase()) > -1))
      {
        data=this.airports.filter(v => (v.cityname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
      }else if(this.airports.find(x=>x.countryname.toLowerCase().indexOf(term.toLowerCase()) > -1))
      {
        data=this.airports.filter(v => (v.countryname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
      }
      else{
        data=this.airports.filter(v => (v.countryname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
      }
      return data;
    }
    // =========Date=========
    trueFalseSearchType():void
    {
      this.isOneway=false;
      this.isMulticity=false;
      this.isRoundtrip=false;
      this.isPartnersQue=false;
      this.isFlightSearchSection = false;
    }
    tripTypeAction(type:number)
    {
      try {
        if (type == 4) {
          $("#prefered_airlines").hide();
        } else {
          $("#prefered_airlines").show();
        }
        this.flightSearchSection=[];
        switch(type)
        {
          case 1:
            this.trueFalseSearchType();
            this.city1=false;
            this.city2=false;
            this.city3=false;
            this.city4=false;
            this.isOneway=true;
            this.isFlightSearchSection = true;
            this.selectedReturnDate="";
            let formattedReturnDate = new Date(this.selectedDepartureDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
              if(isNaN(formattedReturnDate.getTime())){
                formattedReturnDate = new Date();
              }
            setTimeout(()=>{
              flatpickr(".flat-datepick-to", {
                plugins: [
                  yearDropdownPlugin({
                   date: formattedReturnDate,
                   yearStart: 0,
                   yearEnd: 2
                 })
               ],
                enableTime: false,
                dateFormat: "d-m-Y",
                allowInput:true,
                minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedDepartureDate),'0',2)+"."+
                this.shareService.padLeft(this.shareService.getMonth(this.selectedDepartureDate),'0',2)+"."+
                this.shareService.getYearLong(this.selectedDepartureDate)
              });
            });
            break;
          case 2:
            this.trueFalseSearchType();
            this.city1=false;
            this.city2=false;
            this.city3=false;
            this.city4=false;
            this.isRoundtrip=true;
            this.isFlightSearchSection = true;
            if(this.selectedReturnDate=="" || this.selectedReturnDate==undefined)
            {
              this.selectedReturnDate=this.shareService.getYearLong(this.selectedDepartureDate)+"-"+this.shareService.padLeft(this.shareService.getMonth(this.selectedDepartureDate),'0',2)+"-"+
              this.shareService.padLeft(this.shareService.getDay(this.selectedDepartureDate),'0',2);
            }
            setTimeout(()=>{
              let formattedReturnDate = new Date(this.selectedDepartureDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
              if(isNaN(formattedReturnDate.getTime())){
                formattedReturnDate = new Date();
              }
              flatpickr(".flat-datepick-to", {
                plugins: [
                  yearDropdownPlugin({
                   date: formattedReturnDate,
                   yearStart: 0,
                   yearEnd: 2
                 })
               ],
                enableTime: false,
                dateFormat: "d-m-Y",
                allowInput:true,
                minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedDepartureDate),'0',2)+"."+
                this.shareService.padLeft(this.shareService.getMonth(this.selectedDepartureDate),'0',2)+"."+
                this.shareService.getYearLong(this.selectedDepartureDate)
              });
            });
            break;
          case 3:
            this.trueFalseSearchType();
            this.city1=false;
            this.city2=false;
            this.city3=false;
            this.city4=false;
            this.isFlightSearchSection = true;
            if(this.selectedReturnDate=="" || this.selectedReturnDate==undefined)
            {
              this.selectedReturnDate=this.shareService.getYearLong()+"-"+this.shareService.padLeft(this.shareService.getMonth(),'0',2)+"-"+
              this.shareService.padLeft(this.shareService.getDay(),'0',2);
            }
            this.isMulticity=true;
            this.city1=true;
            this.selectedFlightDeparture[0].Date=this.selectedDepartureDate;
            setTimeout(()=>{
              let formattedDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
              if(isNaN(formattedDate.getTime())){
                formattedDate = new Date();
              }
              flatpickr(".flat-datepick-from0", {
                plugins: [
                  yearDropdownPlugin({
                   date: formattedDate,
                   yearStart: 0,
                   yearEnd: 2
                 })
               ],
                enableTime: false,
                dateFormat: "d-m-Y",
                allowInput:true,
                minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
              });
            });
            break;
          case 4:
            this.trueFalseSearchType();
            this.isPartnersQue=true;
            break;
        }
      }catch(exp){}
    }
    tripType(e:any)
    {
      var type = parseInt(e.target.value);
      try {
        if (type == 4) {
          $("#prefered_airlines").hide();
        } else {
          $("#prefered_airlines").show();
        }
        this.flightSearchSection=[];
        switch(type)
        {
          case 1:
            this.trueFalseSearchType();
            this.city1=false;
            this.city2=false;
            this.city3=false;
            this.city4=false;
            this.isOneway=true;
            this.isFlightSearchSection = true;
            this.selectedReturnDate="";
            setTimeout(()=>{
              flatpickr(".flat-datepick-to", {
                plugins: [
                  yearDropdownPlugin({
                   date: new Date(),
                   yearStart: 0,
                   yearEnd: 2
                 })
               ],
                enableTime: false,
                dateFormat: "d-m-Y",
                allowInput:true,
                minDate:"today"
              });
            });
            break;
          case 2:
            this.trueFalseSearchType();
            this.city1=false;
            this.city2=false;
            this.city3=false;
            this.city4=false;
            this.isRoundtrip=true;
            this.isFlightSearchSection = true;
            if(this.selectedReturnDate=="" || this.selectedReturnDate==undefined)
            {
              this.selectedReturnDate=this.shareService.getYearLong()+"-"+this.shareService.padLeft(this.shareService.getMonth(),'0',2)+"-"+
              this.shareService.padLeft(this.shareService.getDay(),'0',2);
            }
            setTimeout(()=>{
              let formattedReturnDate = new Date(this.selectedDepartureDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
              if(isNaN(formattedReturnDate.getTime())){
                formattedReturnDate = new Date();
              }
              flatpickr(".flat-datepick-to", {
                plugins: [
                  yearDropdownPlugin({
                   date: formattedReturnDate,
                   yearStart: 0,
                   yearEnd: 2
                 })
               ],
                enableTime: false,
                dateFormat: "d-m-Y",
                allowInput:true,
                minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedDepartureDate),'0',2)+"."+
                this.shareService.padLeft(this.shareService.getMonth(this.selectedDepartureDate),'0',2)+"."+
                this.shareService.getYearLong(this.selectedDepartureDate)
              });
            });
            break;
          case 3:
            this.trueFalseSearchType();
            this.city1=false;
            this.city2=false;
            this.city3=false;
            this.city4=false;
            this.isFlightSearchSection = true;
            if(this.selectedReturnDate=="" || this.selectedReturnDate==undefined)
            {
              this.selectedReturnDate=this.shareService.getYearLong()+"-"+this.shareService.padLeft(this.shareService.getMonth(),'0',2)+"-"+
              this.shareService.padLeft(this.shareService.getDay(),'0',2);
            }
            this.isMulticity=true;
            this.city1=true;
            this.selectedFlightDeparture[0].Date=this.selectedDepartureDate;
            setTimeout(()=>{
              let formattedReturnDate = new Date(this.selectedFlightDeparture[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
              if(isNaN(formattedReturnDate.getTime())){
                formattedReturnDate = new Date();
              }
              flatpickr(".flat-datepick-from0", {
                plugins: [
                  yearDropdownPlugin({
                   date: formattedReturnDate,
                   yearStart: 0,
                   yearEnd: 2
                 })
               ],
                enableTime: false,
                dateFormat: "d-m-Y",
                allowInput:true,
                minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[0].Date),'0',2)+"."+
                this.shareService.getYearLong(this.selectedFlightDeparture[0].Date)
              });
            });
            break;
          case 4:
            this.trueFalseSearchType();
            this.isPartnersQue=true;
            break;
        }
      }catch(exp){}
    }
    flightDefault()
    {
      this.roundTripButton.nativeElement.click();
      this.tripTypeAction(2);

    }
    crossClick(){

      this.oneWayButton.nativeElement.click();
      this.selectedReturnDate='';

    }
    calenderClick(){
      this.roundTripButton.nativeElement.click();
    }

    departureToReturn(){
      this.return.focus();
    }
    getTripTypeId():string
    {
      let ret:string="";
      try{
        if(this.isOneway)
        {
          ret=this.flightHelper.getTripTypeId(1);
        }else if(this.isRoundtrip)
        {
          ret=this.flightHelper.getTripTypeId(2);
        }else if(this.isMulticity)
        {
          ret=this.flightHelper.getTripTypeId(3);
        }

      }catch(exp){}
      return ret;
    }
    flightSearchDataSet(isSave:boolean=false)
    {
      try{
        // console.log("Work");
        this.save(true);
        var fareType =$("#fareType").val();
        var maxConnection=$("#maxConnection").val();
        var inboardClassType=$("input[name=InboardTravellers_Class]:checked").val();
        var outboardClassType=$("input[name=OutboardTravellers_Class]:checked").val();
        var trip2ClassType=$("input[name=trip2Travellers_Class]:checked").val();
        var trip3ClassType=$("input[name=trip3Travellers_Class]:checked").val();
        var trip4ClassType=$("input[name=trip4Travellers_Class]:checked").val();
        var classType = [];
        classType.push(inboardClassType);
        if(outboardClassType){
          classType.push(outboardClassType);
        }
        if(trip2ClassType){
          classType.push(trip2ClassType);
        }
        if(trip3ClassType){
          classType.push(trip3ClassType);
        }
        if(trip4ClassType){
          classType.push(trip4ClassType);
        }
        var selectedAirline=$("#selectAirlinesId").val();
        let loaderData={};
        let fromFlightCode=this.getFlightInfoById(this.selectedAirportFromId,'citycode');
        let fromAirportName=this.getFlightInfoById(this.selectedAirportFromId,'airport');
        let fromFlightName=this.getFlightInfoById(this.selectedAirportFromId,'city');

        let toFlightCode=this.getFlightInfoById(this.selectedAirportToId,'citycode');
        let toAirportName=this.getFlightInfoById(this.selectedAirportToId,'airport');
        let toFlightName=this.getFlightInfoById(this.selectedAirportToId,'city');

        let fromCountryName=this.getFlightInfoById(this.selectedAirportFromId,'country');
        let toCountryName=this.getFlightInfoById(this.selectedAirportToId,'country');
        let fromCountryCode=this.getFlightInfoById(this.selectedAirportFromId,'countrycode');
        let toCountryCode=this.getFlightInfoById(this.selectedAirportToId,'countrycode');

        this.selectedReturnDate=!this.isOneway?this.selectedReturnDate:"";

        if(selectedAirline==undefined || selectedAirline==""  || selectedAirline=="0")
        {
          // console.log(this.airlines);
          // selectedAirline=this.airlines.find(x=>x.masterId==this.flightHelper.allAirlinesId).text;
          selectedAirline="";
        }
        let tripTypeId=this.isOneway?1:this.isRoundtrip?2:3;
        let multiDeparture:any[]=[];
        let multiArrival:any[]=[];
        multiDeparture.push({
          Id:this.selectedAirportFromId,
          CityCode:fromFlightCode,
          CityName:fromFlightName,
          CountryCode:fromCountryCode,
          CountryName:fromCountryName,
          AirportName:fromAirportName,
          Date:this.selectedDepartureDate
        });
        multiArrival.push({
          Id:this.selectedAirportToId,
          CityCode:toFlightCode,
          CityName:toFlightName,
          CountryCode:toCountryCode,
          CountryName:toCountryName,
          AirportName:toAirportName,
          Date:this.selectedReturnDate
        });
        if(this.isMulticity)
        {
          for(let i=0;i<this.selectedFlightArrival.length;i++)
          {
            if(!this.shareService.isNullOrEmpty(this.selectedFlightArrival[i].CityCode))
            {
              multiDeparture.push({
                Id:this.selectedFlightDeparture[i].Id,
                CityCode:this.selectedFlightDeparture[i].CityCode,
                CityName:this.selectedFlightDeparture[i].CityName,
                CountryCode:this.selectedFlightDeparture[i].CountryCode,
                CountryName:this.selectedFlightDeparture[i].CountryName,
                AirportName:this.selectedFlightDeparture[i].AirportName,
                Date:this.selectedFlightDeparture[i].Date
              });
              multiArrival.push({
                Id:this.selectedFlightArrival[i].Id,
                CityCode:this.selectedFlightArrival[i].CityCode,
                CityName:this.selectedFlightArrival[i].CityName,
                CountryCode:this.selectedFlightArrival[i].CountryCode,
                CountryName:this.selectedFlightArrival[i].CountryName,
                AirportName:this.selectedFlightArrival[i].AirportName
              });
            }
          }
        }
        loaderData={
          Departure:multiDeparture,
          Arrival:multiArrival,
          adult:this.num1,
          amount:this.amount,
          childList:this.getOnlyAge(this.childListFinal),infant:this.num3,classType:classType,airlines:selectedAirline,stop:maxConnection,
          //cabinTypeId:this.flightHelper.getCabinTypeId(classType),
          tripTypeId:this.flightHelper.getTripTypeId(tripTypeId),childList1:this.childList,childList2:this.childList2,
          isOneWay:this.isOneway,isRoundTrip:this.isRoundtrip,isMultiCity:this.isMulticity,fareType:fareType,isReissue:false
        };
        // console.log("Loader Data::");
        // console.log(loaderData);
        this.setStoreFlightData(loaderData,isSave);
      }catch(exp){
        console.log(exp);
      }
    }
    getOnlyAge(data:any[]):any[]
    {
      let ret:any[]=[];
      try{
        for(let item of data) ret.push(item.age);
      }catch(exp){
      }
      return ret;
    }
    checkDate(start:any, end:any):boolean
    {
      let ret:boolean=false;
      try{
        if(Date.parse(start)<=Date.parse(end))
        {
          ret=true;
        }
      }catch(exp){}
      return ret;
     }
    getFlightInfoById(id:any,type:any):string
    {
      let ret:string="";
      try{
        var data=this.airports.find(x=>x.id.toString().toLowerCase()==id.toString().toLowerCase());
        switch(type.toString().toLowerCase())
        {
          case 'country':ret=data.countryname;break;
          case 'countrycode':ret=data.countrycode;break;
          case 'city':ret=data.cityname;break;
          case 'airport':ret=data.text;break;
          case 'citycode':ret=data.code;break;
          default:break;
        }
      }catch(exp){}
      return ret;
    }

    saveFlightSearchHistory(data:any,isDomestic:boolean)
    {
      try{
        let loadData:any=JSON.parse(JSON.stringify(data));
        var fareTypeId=$("#fareType").val();
        let airlinesId=this.airlines.find(x=>x.id==data.airlines);
        if(airlinesId==undefined || airlinesId=="" || airlinesId=="0")
        {
          airlinesId=this.flightHelper.allAirlinesId;
        }else{
          airlinesId=airlinesId.masterId;
        }
        this.fmgSearchHistoryDetails=this.fmgSearchHistory.get('FlightSearchDetailsHistory') as FormArray;
        for(var item of data.childList)
        {
          this.fmgSearchHistoryDetails.push(this.fb.group({
            VFlightSearchHistoryId:'',
            IChildAge:item
          }));
        }
        let toId="";
        let toReturnDate="";
        if(this.isMulticity)
        {
          toId=loadData.Arrival[loadData.Arrival.length-1].Id;
        }else{
          toId=this.selectedAirportToId;
          toReturnDate=this.selectedReturnDate;
        }

        this.fmgSearchHistoryInfo=this.fmgSearchHistory.get('FlightSearchHistory') as FormData;
        this.fmgSearchHistoryInfo.patchValue({
          Id:this.shareService.getUserId(),
          DSearchDate:new Date(),
          VAirportIdfrom:this.selectedAirportFromId,
          VAirportIdto:toId,
          DDepartureDate:this.selectedDepartureDate,
          DReturnDate:toReturnDate,
          VFlightTypeId:data.tripTypeId,
          VCabinTypeId:data.cabinTypeId,
          INumberAdult:data.adult,
          INumberChild:data.childList.length,
          INumberInfant:data.infant,
          VAirlinesId:airlinesId,
          VFlightStopId:this.flightHelper.getFlightStopId(data.stop),
          VFareTypeId:fareTypeId
        });
        // console.log("Flight Search History::");
        // console.log(this.fmgSearchHistory.value);
        this.authService.saveFlightSearchHistory(Object.assign({},this.fmgSearchHistory.value)).subscribe( subData=>{

          if(subData.success)
          {
              this.navigationWork(isDomestic);
          }
        },err=>{
        });
      }catch(exp)
      {
        console.log(exp);
      }
    }


    setChildSet()
    {
      this.childListFinal=[];
      for(let i=0;i<this.childList.length;i++)
      {
        //this.childListFinal.push({id:this.childList[i],age:parseInt($("#childX"+i).val())});
        this.childListFinal.push({id:this.childList[i],age:parseInt('6')});
      }
      for(let i=0;i<this.childList2.length;i++)
      {
        //this.childListFinal.push({id:this.childList2[i],age:parseInt($("#childY"+i).val())});
        this.childListFinal.push({id:this.childList2[i],age:parseInt('6')});
      }
    }
    setStoreFlightData(data:any,isSave:boolean)
    {
      let isDomestic=true;
      let showPassportDiv = true;
      if("loaderData" in localStorage)
      {
        localStorage.removeItem("loaderData");
      }
      localStorage.setItem('loaderData',JSON.stringify(data));
      let loadData:any=JSON.parse(JSON.stringify(data));
      for(let i=0;i<loadData.Departure.length;i++)
      {
        if(this.getCountryCode(loadData.Departure[i].CityCode)!= this.getCountryCode(loadData.Arrival[i].CityCode))
        {
          isDomestic=false;
          break;
        }
      }
      for(let i=0;i<loadData.Departure.length;i++){
        if(loadData.Departure[i].CountryCode == loadData.Arrival[i].CountryCode)
        {
          var code = loadData.Departure[i].CountryCode
          if(code=='BD'){
            showPassportDiv = false;
            break;
          }
        }
      }
      localStorage.setItem('showPassportDiv',showPassportDiv.toString());
      if(isSave)
      {
        this.saveFlightSearchHistory(data,isDomestic);
      }else{
        this.navigationWork(isDomestic);
      }
    }
    navigationWork(isDomestic:boolean):void
    {
      if(isDomestic)
      {
        localStorage.setItem('isDomestic',"True");
        if(this.isOneway)
        {
          this.router.navigate(['/home/common-flight-search']);
        }else if(this.isRoundtrip)
        {
          this.router.navigate(['/home/common-flight-search']);
        }else if(this.isMulticity)
        {
          this.router.navigate(['/home/common-flight-search']);
        }
      }else{
        localStorage.setItem('isDomestic',"False");
        if(this.isOneway)
        {
          this.router.navigate(['/home/common-flight-search']);
        }else if(this.isRoundtrip)
        {
          this.router.navigate(['/home/common-flight-search']);
        }else if(this.isMulticity)
        {
          this.router.navigate(['/home/common-flight-search']);
        }
      }
    }
    recentBookingFlightAll()
    {
      this.router.navigate(['/home/recent-booking-flight']);
    }
    getCountryCode(id:string):string
    {
      let ret:string="";
      try{
        var data=this.airports.find(x=>x.code.toString().toLowerCase()==id.trim().toLowerCase());
        if(data!="" && data!=undefined)
        {
          ret=data.countrycode;
        }
      }catch(exp){}
      return ret;
    }
    getCountryName(id:string):string
    {
      let ret:string="";
      try{
        var data=this.airports.find(x=>x.code.toString().toLowerCase()==id.trim().toLowerCase());
        if(data!="" && data!=undefined)
        {
          ret=data.countryname;
        }
      }catch(exp){}
      return ret;
    }
    funDepartureDate()
    {
      this.departureDate=this.shareService.getDbToBd(this.dDepartureDate);
    }



    trueFalseDeparture()
    {
      this.isSuggDeparture=false;
      this.isSuggDeparture1=false;
      this.isSuggDeparture2=false;
      this.isSuggDeparture3=false;
      this.isSuggDeparture4=false;
    }
    trueFalseArrival()
    {
      this.isSuggReturn=false;
      this.isSuggReturn1=false;
      this.isSuggReturn2=false;
      this.isSuggReturn3=false;
      this.isSuggReturn4=false;
    }
    // =========Round Trip=============
    departurePanelFrom(ind:any) {

      try{
        this.trueFalseDeparture();
        if(ind==-1)
        {
          this.isSuggDeparture = true;
          $("#departureCityText").css("display","none");
          $("#departureDetailsText").css("display","none");
          $("#fromFlightHead").css("margin-bottom","5px");
          setTimeout(()=>{
            this.suggDeparture.focus();
          });
        }else if(ind==0)
        {
          this.isSuggDeparture1 = true;
          $("#departureCityText0").css("display","none");
          $("#departureDetailsText0").css("display","none");
          $("#fromFlightHead0").css("margin-bottom","5px");
          setTimeout(()=>{
            this.suggDeparture1.focus();
          });
        }else if(ind==1)
        {
          this.isSuggDeparture2 = true;
          $("#departureCityText1").css("display","none");
          $("#departureDetailsText1").css("display","none");
          $("#fromFlightHead1").css("margin-bottom","5px");
          setTimeout(()=>{
            this.suggDeparture2.focus();
          });
        }else if(ind==2)
        {
          this.isSuggDeparture3 = true;
          $("#departureCityText2").css("display","none");
          $("#departureDetailsText2").css("display","none");
          $("#fromFlightHead2").css("margin-bottom","5px");
          setTimeout(()=>{
            this.suggDeparture3.focus();
          });
        }
      }catch(exp){}
    }
    fromFlightSearch(e:any)
    {
      $("#fromFlightSearch").hide();
      $("#fromFlightCityName").show();
      $("#fromFlightCityDetails").show();

      if(e!=undefined && e.item!=undefined)
      {
        $("#fromFlightCityName").text(e.item.cityname);
        $("#fromFlightCityDetails").text(e.item.code+', '+e.item.text);
      }

    }

    departurePanelTo(ind:any) {
      try {
        this.trueFalseArrival();
        if(ind==-1)
        {
          $("#returnCityText").css("display","none");
          $("#returnDetailsText").css("display","none");
          $("#toFlightHead").css("margin-bottom","5px");
          this.isSuggReturn=true;
          setTimeout(()=>{
            this.suggReturn.focus();
          });
        }else if(ind==0)
        {
          this.isSuggReturn1=true;
          $("#returnCityText0").css("display","none");
          $("#returnDetailsText0").css("display","none");
          $("#toFlightHead0").css("margin-bottom","5px");
          setTimeout(()=>{
            this.suggReturn1.focus();
          });
        }else if(ind==1)
        {
          this.isSuggReturn2=true;
          $("#returnCityText1").css("display","none");
          $("#returnDetailsText1").css("display","none");
          $("#toFlightHead1").css("margin-bottom","5px");
          setTimeout(()=>{
            this.suggReturn2.focus();
          });
        }else if(ind==2)
        {
          this.isSuggReturn3=true;
          $("#returnCityText2").css("display","none");
          $("#returnDetailsText2").css("display","none");
          $("#toFlightHead2").css("margin-bottom","5px");
          setTimeout(()=>{
            this.suggReturn3.focus();
          });
        }
      }catch(exp){}

    }
    toFlightSearch(e:any)
    {
      $("#toFlightSearch").hide();
      $("#toFlightCityName").show();
      $("#toFlightCityDetails").show();
      if(e!=undefined && e.item!=undefined)
      {
        $("#toFlightCityName").text(e.item.cityname);
        $("#toFlightCityDetails").text(e.item.code+', '+e.item.text);
      }
    }
    changeClassLabel()
    {
      try{
        var classValue=$("input[name='Travellers_Class']:checked").val();
        var val=this.flightHelper.getCabinTypeName(classValue);
        $("#classLabel").text(val);
      }catch(exp){}
    }
    selectroundtripTo(e: any)
    {
      this.isSearchToShow = true;
      this.isdepartureShow = false;
      this.isreturnShow = true;
      this.isTravellerFromShow = true;
      this.departure.toggle();
      // window.document.getElementById("curserhoverTo").style.backgroundColor="#ffffff";
      // window.document.getElementById("curserhoverdeparturedate").style.backgroundColor="#c0d8fa";
    }
    travellerBox(isMul:boolean=false)
    {

      if(isMul)
      {
        if($("#travellerBoxMul").css("display")=="block")
        {
          $("#travellerBoxMul").hide();
        }
      }else{

      }
    }
    travellerFrom(isMul:boolean=false){
      if(isMul)
      {
        if($("#travellerBoxMul").css("display")=="none")
        {
          $("#travellerBoxMul").show();
        }
      }else{
        setTimeout(()=>{
          this.isTravellerFromShow = false;
        });
      }
      // this.isSearchFromShow = true;
      // this.isSearchToShow = true;
      // this.isdepartureShow = true;
      // this.isreturnShow = true;
      // console.log("Traveller clicked::");
    }

    selectbirthdate(e: any){
      this.isTravellerFromShow = false;
      this.showBox = true;
    }

    save(isMul:boolean=false){
      this.setChildSet();
      if(isMul)
      {
        if($("#travellerBoxMul").css("display")=="block")
        {
          setTimeout(()=>{
            $("#travellerBoxMul").hide();
          });
        }
      }else{
        setTimeout(()=>{
          this.isTravellerFromShow = true;
        });
      }
    }

    onSelect() {
      this.ignoreClick = true;
      requestAnimationFrame(() => this.ignoreClick = false);
    }

    onClick(departure: any) {
      !this.ignoreClick && departure.toggle();
    }

    plus(type:string) {
      if((this.num1+this.num2+this.num3)<9)
      {
        switch(type)
        {
          case "adult":
            if(this.num1<9 && this.num2<9)
            {
              this.num1++;
            }
            switch(this.num1){
              case 1:
                if(this.num2>8)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
              case 2:
                if(this.num2>7)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
              case 3:
                while(6<this.num2)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
              case 4:
                while(5<this.num2)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
              case 5:
                while(4<this.num2)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
              case 6:
                while(3<this.num2)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
              case 7:
                while(2<this.num2)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
              case 8:
                while(1<this.num2)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
              case 9:
                while(0<this.num2)
                {
                  this.childList=this.shareService.removeList(this.num2,this.childList);
                  this.num2--;
                }
                break;
            }
            break;
          case "child":
            if(this.num2<6)
            {
              switch(this.num1){
                case 1: case 0:
                  this.num2++;
                  if(9-this.num1>=this.num2)
                  {
                    this.childList.push(6);
                  }else{
                    this.num2--;
                  }
                  break;
                case 2:
                  this.num2++;
                  if(9-this.num1>=this.num2)
                  {
                    this.childList.push(6);
                  }else{
                    this.num2--;
                  }
                  break;
                case 3:
                  this.num2++;
                  if(9-this.num1>=this.num2)
                  {
                    this.childList.push(6);
                  }else{
                    this.num2--;
                  }
                  break;
                case 4:
                  this.num2++;
                  if(9-this.num1>=this.num2)
                  {
                    this.childList.push(6);
                  }else{
                    this.num2--;
                  }
                  break;
                case 5:
                  this.num2++;
                  if(9-this.num1>=this.num2)
                  {
                    this.childList.push(6);
                  }else{
                    this.num2--;
                  }
                  break;
                case 6:
                  this.num2++;
                  if(this.num1-(this.num1-1)==this.num2)
                  {
                    this.childList.push(6);
                  }else{
                    this.num2--;
                  }
                  break;
              }
            }else if(this.num2>=6 && this.num2<9)
            {
              this.num2++;
              this.childList2.push(6);
            }
            break;
          case "infant":
            if(this.num3<7 && this.num3<this.num1)
            {
              this.num3++;
            }
            break;
        }
      }
      if(this.childList.length>0)
      {
        $("#childListSection1").css("display","inline-flex");
        $("#childListSection2").css("display","inline-flex");
      }else{
        $("#childListSection1").css("display","none");
        $("#childListSection2").css("display","none");
      }
    }
    minus(type:string) {
      switch(type)
      {
        case "adult":
          if(this.num1>0)
          {
            this.num1--;
          }
          if(this.num1<this.num3)
          {
            this.num3--;
          }
          break;
        case "child":
          if(this.num2>0)
          {
            if(this.num2<7)
            {
              //this.childList=this.shareService.removeList(this.num2,this.childList);
              this.childList.pop();
              this.num2--;
            }else{
              //this.childList2=this.shareService.removeList(this.num2,this.childList2);
              this.childList2.pop();
              this.num2--;
            }
          }
          break;
        case "infant":
          if(this.num3>0)
          {
            this.num3--;
          }
          break;
      }
      if(this.childList.length>0)
      {
        $("#childListSection1").css("display","inline-flex");
        $("#childListSection2").css("display","inline-flex");
      }else{
        $("#childListSection1").css("display","none");
        $("#childListSection2").css("display","none");
      }

    }
    exchangeDepartureArrivalMul(i:number)
    {
      if(!this.shareService.isNullOrEmpty(this.selectedFlightDeparture[i].CityCode)
      && !this.shareService.isNullOrEmpty(this.selectedFlightArrival[i].CityCode))
      {
        let temp:FlightRoutes=this.selectedFlightDeparture[i];
        let tempDeptDate=this.selectedFlightDeparture[i].Date;
        let tempRetDate=this.selectedFlightArrival[i].Date;
        this.selectedFlightDeparture[i]=this.selectedFlightArrival[i];
        this.selectedFlightArrival[i]=temp;
        this.selectedFlightDeparture[i].Date=tempDeptDate;
        this.selectedFlightArrival[i].Date=tempRetDate;
      }
    }
    exchangeDepartureArrival() {
      let fromAirportId=this.selectedAirportFromId;
      let fromCityName=this.selectedDepartureCity;
      let fromCityCode=this.selectedDepartureCityCode;
      let fromCountryName=this.selectedDepartureCountry;
      let fromAirportName=this.selectedDepartureAirport;
      if(fromAirportId!="")
      {
        this.selectedAirportFromId=this.selectedAirportToId;
        this.selectedAirportToId=fromAirportId;
      }
      if(fromCityName!="")
      {
        this.selectedDepartureCity=this.selectedReturnCity;
        this.selectedReturnCity=fromCityName;
      }
      if(fromCountryName!="")
      {
        this.selectedDepartureCountry=this.selectedReturnCountry;
        this.selectedReturnCountry=fromCountryName;
      }
      if(fromCityCode!="")
      {
        this.selectedDepartureCityCode=this.selectedReturnCityCode;
        this.selectedReturnCityCode=fromCityCode;
      }
      if(fromAirportName!="")
      {
        this.selectedDepartureAirport=this.selectedReturnAirport;
        this.selectedReturnAirport=fromAirportName;
      }
    }

    onClickedOutside(ind:any) {
      try{
        this.isSearchFromShow = true;
        this.isSearchToShow = true;
        this.isTravellerFromShow = true;
        this.showBox = true;
        this.isdepartureShow = true;
        this.isreturnShow = true;
        // window.document.getElementById("curserhoverFrom").style.backgroundColor="#ffffff";
        // window.document.getElementById("curserhoverFrom").style.backgroundColor="#ffffff";
        // window.document.getElementById("curserhoverTravellers").style.backgroundColor="#ffffff";

        if(ind==-1)
        {
          this.isSuggDeparture=false;
          this.isSuggReturn=false;
          $("#departureCityText").css("display","block");
          $("#departureDetailsText").css("display","block");
          $("#returnCityText").css("display","block");
          $("#returnDetailsText").css("display","block");
          $("#fromFlightHead").css("margin-bottom","5px");
          $("#toFlightHead").css("margin-bottom","5px");
        }else if(ind==0)
        {
          this.isSuggDeparture1=false;
          this.isSuggReturn1=false;
          $("#departureCityText0").css("display","block");
          $("#departureDetailsText0").css("display","block");
          $("#returnCityText0").css("display","block");
          $("#returnDetailsText0").css("display","block");
          $("#fromFlightHead0").css("margin-bottom","5px");
          $("#toFlightHead0").css("margin-bottom","5px");
        }else if(ind==1)
        {
          this.isSuggDeparture2=false;
          this.isSuggReturn2=false;
          $("#departureCityText1").css("display","block");
          $("#departureDetailsText1").css("display","block");
          $("#returnCityText1").css("display","block");
          $("#returnDetailsText1").css("display","block");
          $("#fromFlightHead1").css("margin-bottom","5px");
          $("#toFlightHead1").css("margin-bottom","5px");
        }else if(ind==2)
        {
          this.isSuggDeparture3=false;
          this.isSuggReturn3=false;
          $("#departureCityText2").css("display","block");
          $("#departureDetailsText2").css("display","block");
          $("#returnCityText2").css("display","block");
          $("#returnDetailsText2").css("display","block");
          $("#fromFlightHead2").css("margin-bottom","5px");
          $("#toFlightHead2").css("margin-bottom","5px");
        }
      }catch(exp){}
    }

    selectEvent(item:any,type:string,i:number) {
      if(type=="from")
      {
        if(i>-1)
        {
          this.selectedFlightDeparture[i].Id=item.id;
          this.selectedFlightDeparture[i].CityCode=item.code;
          this.selectedFlightDeparture[i].CityName=item.cityname;
          this.selectedFlightDeparture[i].CountryName=item.countryname;
          this.selectedFlightDeparture[i].AirportName=item.text;
        }else{
          this.selectedAirportFromId=item.id;
          this.selectedDepartureCity=item.cityname;
          this.selectedDepartureCityCode=item.code;
          this.selectedDepartureCountry=item.countryname;
          this.selectedDepartureAirport=item.text;
        }
        // console.log("Selected ::");
        // console.log(this.selectedFlightDeparture[i]);
      }
      if(type=="to")
      {
        if(i>-1)
        {
          this.selectedFlightArrival[i].Id=item.id;
          this.selectedFlightArrival[i].CityCode=item.code;
          this.selectedFlightArrival[i].CityName=item.cityname;
          this.selectedFlightArrival[i].CountryName=item.countryname;
          this.selectedFlightArrival[i].AirportName=item.text;

          this.selectedFlightDeparture[i+1].Id=item.id;
          this.selectedFlightDeparture[i+1].CityCode=item.code;
          this.selectedFlightDeparture[i+1].CityName=item.cityname;
          this.selectedFlightDeparture[i+1].CountryName=item.countryname;
          this.selectedFlightDeparture[i+1].AirportName=item.text;
        }else{
          this.selectedAirportToId=item.id;
          this.selectedReturnCity=item.cityname;
          this.selectedReturnCityCode=item.code;
          this.selectedReturnCountry=item.countryname;
          this.selectedReturnAirport=item.text;
          if(this.isMulticity)
          {
            this.selectedFlightDeparture[0].Id=item.id;
            this.selectedFlightDeparture[0].CityCode=item.code;
            this.selectedFlightDeparture[0].CityName=item.cityname;
            this.selectedFlightDeparture[0].CountryName=item.countryname;
            this.selectedFlightDeparture[0].AirportName=item.text;
          }
        }
      }
    }

  onChangeSearch(val: string,type:any,ind:number) {
    val=val.toLowerCase();
    if (/^[a-zA-Z ]+$/.test(val)) {
      try{
        if(type=='from')
        {
          this.tempAirportsDeparture=[];
          this.tempAirportsDeparture1=[];
          this.tempAirportsDeparture2=[];
          this.tempAirportsDeparture3=[];
          this.tempAirportsDeparture4=[];

          if(ind==-1)
          {
            if(val.length==3){
              this.tempAirportsDeparture=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture.length>15)
              {
                this.tempAirportsDeparture=this.tempAirportsDeparture.slice(0,15);
              }
              if(this.tempAirportsDeparture.length==0){
                this.tempAirportsDeparture=this.shareService.distinctList(this.airports.filter(x=>
                  (x.code).toString().toLowerCase().startsWith(val)
                  || (x.cityname).toString().toLowerCase().startsWith(val)
                  || (x.countryname).toString().toLowerCase().startsWith(val)
                  || (x.text).toString().toLowerCase().startsWith(val)
                  ));
                if(this.tempAirportsDeparture.length>15)
                {
                  this.tempAirportsDeparture=this.tempAirportsDeparture.slice(0,15);
                }
              }
            }else{
              this.tempAirportsDeparture=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture.length>15)
              {
                this.tempAirportsDeparture=this.tempAirportsDeparture.slice(0,15);
              }
            }
          }else if(ind==0)
          {
            if(val.length==3){
              this.tempAirportsDeparture1=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture1.length>15)
              {
                this.tempAirportsDeparture1=this.tempAirportsDeparture1.slice(0,15);
              }
              if(this.tempAirportsDeparture1.length==0){
                this.tempAirportsDeparture1=this.shareService.distinctList(this.airports.filter(x=>
                  (x.code).toString().toLowerCase().startsWith(val)
                  || (x.cityname).toString().toLowerCase().startsWith(val)
                  || (x.countryname).toString().toLowerCase().startsWith(val)
                  || (x.text).toString().toLowerCase().startsWith(val)
                  ));
                if(this.tempAirportsDeparture1.length>15)
                {
                  this.tempAirportsDeparture1=this.tempAirportsDeparture1.slice(0,15);
                }
              }
            }else{
              this.tempAirportsDeparture1=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture1.length>15)
              {
                this.tempAirportsDeparture1=this.tempAirportsDeparture1.slice(0,15);
              }
            }
          }else if(ind==1)
          {
            if(val.length==3){
              this.tempAirportsDeparture2=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture2.length>15)
              {
                this.tempAirportsDeparture2=this.tempAirportsDeparture2.slice(0,15);
              }
              if(this.tempAirportsDeparture2.length==0){
                this.tempAirportsDeparture2=this.shareService.distinctList(this.airports.filter(x=>
                  (x.code).toString().toLowerCase().startsWith(val)
                  || (x.cityname).toString().toLowerCase().startsWith(val)
                  || (x.countryname).toString().toLowerCase().startsWith(val)
                  || (x.text).toString().toLowerCase().startsWith(val)
                  ));
                if(this.tempAirportsDeparture2.length>15)
                {
                  this.tempAirportsDeparture2=this.tempAirportsDeparture2.slice(0,15);
                }
              }
            }else{
              this.tempAirportsDeparture2=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture2.length>15)
              {
                this.tempAirportsDeparture2=this.tempAirportsDeparture2.slice(0,15);
              }
            }
          }else if(ind==2)
          {
            if(val.length==3){
              this.tempAirportsDeparture3=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture3.length>15)
              {
                this.tempAirportsDeparture3=this.tempAirportsDeparture3.slice(0,15);
              }
              if(this.tempAirportsDeparture3.length==0){
                this.tempAirportsDeparture3=this.shareService.distinctList(this.airports.filter(x=>
                  (x.code).toString().toLowerCase().startsWith(val)
                  || (x.cityname).toString().toLowerCase().startsWith(val)
                  || (x.countryname).toString().toLowerCase().startsWith(val)
                  || (x.text).toString().toLowerCase().startsWith(val)
                  ));
                if(this.tempAirportsDeparture3.length>15)
                {
                  this.tempAirportsDeparture3=this.tempAirportsDeparture3.slice(0,15);
                }
              }
            }else{
              this.tempAirportsDeparture3=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture3.length>15)
              {
                this.tempAirportsDeparture3=this.tempAirportsDeparture3.slice(0,15);
              }
            }
          }else if(ind==3)
          {
            if(val.length==3){
              this.tempAirportsDeparture4=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture4.length>15)
              {
                this.tempAirportsDeparture4=this.tempAirportsDeparture4.slice(0,15);
              }
              if(this.tempAirportsDeparture4.length==0){
                this.tempAirportsDeparture4=this.shareService.distinctList(this.airports.filter(x=>
                  (x.code).toString().toLowerCase().startsWith(val)
                  || (x.cityname).toString().toLowerCase().startsWith(val)
                  || (x.countryname).toString().toLowerCase().startsWith(val)
                  || (x.text).toString().toLowerCase().startsWith(val)
                  ));
                if(this.tempAirportsDeparture4.length>15)
                {
                  this.tempAirportsDeparture4=this.tempAirportsDeparture4.slice(0,15);
                }
              }
            }else{
              this.tempAirportsDeparture4=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
              if(this.tempAirportsDeparture4.length>15)
              {
                this.tempAirportsDeparture4=this.tempAirportsDeparture4.slice(0,15);
              }
            }
          }
        }
        if(type=='to')
        {
          this.tempAirportsArrival=[];
          this.tempAirportsArrival1=[];
          this.tempAirportsArrival2=[];
          this.tempAirportsArrival3=[];
          this.tempAirportsArrival4=[];

          if(ind==-1)
          {
            if(val.length==3){
              this.tempAirportsArrival=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival.length>15)
                {
                  this.tempAirportsArrival=this.tempAirportsArrival.slice(0,15);
                }
                if(this.tempAirportsArrival.length==0){
                  this.tempAirportsArrival=this.shareService.distinctList(this.airports.filter(x=>
                    (x.code).toString().toLowerCase().startsWith(val)
                    || (x.cityname).toString().toLowerCase().startsWith(val)
                    || (x.countryname).toString().toLowerCase().startsWith(val)
                    || (x.text).toString().toLowerCase().startsWith(val)
                    ));
                    if(this.tempAirportsArrival.length>15)
                    {
                      this.tempAirportsArrival=this.tempAirportsArrival.slice(0,15);
                    }
                }
            }else{
              this.tempAirportsArrival=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival.length>15)
                {
                  this.tempAirportsArrival=this.tempAirportsArrival.slice(0,15);
                }
            }
            
          }else if(ind==0)
          {
            if(val.length==3){
              this.tempAirportsArrival1=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival1.length>15)
                {
                  this.tempAirportsArrival1=this.tempAirportsArrival1.slice(0,15);
                }
                if(this.tempAirportsArrival1.length==0){
                  this.tempAirportsArrival1=this.shareService.distinctList(this.airports.filter(x=>
                    (x.code).toString().toLowerCase().startsWith(val)
                    || (x.cityname).toString().toLowerCase().startsWith(val)
                    || (x.countryname).toString().toLowerCase().startsWith(val)
                    || (x.text).toString().toLowerCase().startsWith(val)
                    ));
                    if(this.tempAirportsArrival1.length>15)
                    {
                      this.tempAirportsArrival1=this.tempAirportsArrival1.slice(0,15);
                    }
                }
            }else{
              this.tempAirportsArrival1=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival1.length>15)
                {
                  this.tempAirportsArrival1=this.tempAirportsArrival1.slice(0,15);
                }
            }
          }else if(ind==1)
          {
            if(val.length==3){
              this.tempAirportsArrival2=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival2.length>15)
                {
                  this.tempAirportsArrival2=this.tempAirportsArrival2.slice(0,15);
                }
                if(this.tempAirportsArrival2.length==0){
                  this.tempAirportsArrival2=this.shareService.distinctList(this.airports.filter(x=>
                    (x.code).toString().toLowerCase().startsWith(val)
                    || (x.cityname).toString().toLowerCase().startsWith(val)
                    || (x.countryname).toString().toLowerCase().startsWith(val)
                    || (x.text).toString().toLowerCase().startsWith(val)
                    ));
                    if(this.tempAirportsArrival2.length>15)
                    {
                      this.tempAirportsArrival2=this.tempAirportsArrival2.slice(0,15);
                    }
                }
            }else{
              this.tempAirportsArrival2=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival2.length>15)
                {
                  this.tempAirportsArrival2=this.tempAirportsArrival2.slice(0,15);
                }
            }
          }else if(ind==2)
          {
            if(val.length==3){
              this.tempAirportsArrival3=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival3.length>15)
                {
                  this.tempAirportsArrival3=this.tempAirportsArrival3.slice(0,15);
                }
                if(this.tempAirportsArrival3.length==0){
                  this.tempAirportsArrival3=this.shareService.distinctList(this.airports.filter(x=>
                    (x.code).toString().toLowerCase().startsWith(val)
                    || (x.cityname).toString().toLowerCase().startsWith(val)
                    || (x.countryname).toString().toLowerCase().startsWith(val)
                    || (x.text).toString().toLowerCase().startsWith(val)
                    ));
                    if(this.tempAirportsArrival3.length>15)
                    {
                      this.tempAirportsArrival3=this.tempAirportsArrival3.slice(0,15);
                    }
                }
            }else{
              this.tempAirportsArrival3=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival3.length>15)
                {
                  this.tempAirportsArrival3=this.tempAirportsArrival3.slice(0,15);
                }
            }
          }else if(ind==3)
          {
            if(val.length==3){
              this.tempAirportsArrival4=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival4.length>15)
                {
                  this.tempAirportsArrival4=this.tempAirportsArrival4.slice(0,15);
                }
                if(this.tempAirportsArrival4.length==0){
                  this.tempAirportsArrival4=this.shareService.distinctList(this.airports.filter(x=>
                    (x.code).toString().toLowerCase().startsWith(val)
                    || (x.cityname).toString().toLowerCase().startsWith(val)
                    || (x.countryname).toString().toLowerCase().startsWith(val)
                    || (x.text).toString().toLowerCase().startsWith(val)
                    ));
                    if(this.tempAirportsArrival4.length>15)
                    {
                      this.tempAirportsArrival4=this.tempAirportsArrival4.slice(0,15);
                    }
                }
            }else{
              this.tempAirportsArrival4=this.shareService.distinctList(this.airports.filter(x=>
                (x.code).toString().toLowerCase().startsWith(val)
                || (x.cityname).toString().toLowerCase().startsWith(val)
                || (x.countryname).toString().toLowerCase().startsWith(val)
                || (x.text).toString().toLowerCase().startsWith(val)
                ).sort((a, b) => (a.code).localeCompare(b.code)));
                if(this.tempAirportsArrival4.length>15)
                {
                  this.tempAirportsArrival4=this.tempAirportsArrival4.slice(0,15);
                }
            }
          }
        }
      }catch(exp){}
    } else {
      const inputElement = this.elementRef.nativeElement.querySelector('input'); // Assuming it's an input field
      this.renderer.setProperty(inputElement, 'value', ''); // Clear the input value
    }
  }

  onFocused(e: any,ind:number) {
    let knownAirportCodesfromFlight = new Set();
    let knownAirportCodestoFlight = new Set();
    if(this.recentFlightSearch.length>0){
      this.recentFlightSearch.forEach(element => {
        knownAirportCodesfromFlight.add(element.fromFlight);
        knownAirportCodestoFlight.add(element.toFlight);
      });;
    }else{
      knownAirportCodesfromFlight = new Set(["DAC", "CGP", "ZYL", "CXB", "CCU", "KUL", "JFK", "MCI", "SIN", "SYD", "MEL"]);
      knownAirportCodestoFlight = new Set(["DAC", "CGP", "ZYL", "CXB", "CCU", "KUL", "JFK", "MCI", "SIN", "SYD", "MEL"]);
    }
    

    const matchingAirportsfromFlight = this.airports.filter((airport) => knownAirportCodesfromFlight.has(airport.code));
    const matchingAirportstoFlight = this.airports.filter((airport) => knownAirportCodestoFlight.has(airport.code));

      if(ind==-1)
      {
        this.tempAirportsDeparture=this.shareService.distinctList(matchingAirportsfromFlight).slice(0,15);
        this.tempAirportsArrival=this.shareService.distinctList(matchingAirportstoFlight).slice(0,15);
      }else if(ind==0)
      {
        this.tempAirportsDeparture1=this.shareService.distinctList(matchingAirportsfromFlight).slice(0,15);
        this.tempAirportsArrival1=this.shareService.distinctList(matchingAirportstoFlight).slice(0,15);
      }else if(ind==1)
      {
        this.tempAirportsDeparture2=this.shareService.distinctList(matchingAirportsfromFlight).slice(0,15);
        this.tempAirportsArrival2=this.shareService.distinctList(matchingAirportstoFlight).slice(0,15);
      }else if(ind==2)
      {
        this.tempAirportsDeparture3=this.shareService.distinctList(matchingAirportsfromFlight).slice(0,15);
        this.tempAirportsArrival3=this.shareService.distinctList(matchingAirportstoFlight).slice(0,15);
      }else if(ind==3)
      {
        this.tempAirportsDeparture4=this.shareService.distinctList(matchingAirportsfromFlight).slice(0,15);
        this.tempAirportsArrival4=this.shareService.distinctList(matchingAirportstoFlight).slice(0,15);
      }
  }
    getRecentBookingFlight()
    {
      let userId=this.shareService.getUserId();
      this.recentBookingFlight=[];
      try{
        var curDate=this.shareService.getYearLong()+"-"+
        this.shareService.getMonth()+"-"+this.shareService.getDay()+" "+
        this.shareService.padLeft(this.shareService.getHour(),'0',2)+":"+this.shareService.padLeft(this.shareService.getMinute(),'0',2);
        this.authService.getRecentBookingFlight(curDate,userId).subscribe(data=>{
          let ind=0;
          for(let item of data.data)
          {
            if(ind<7)
            {
              item.nvSurName=item.nvSurName.toString().length>9?item.nvSurName.toString().substring(0,6)+"..":item.nvSurName;
              this.recentBookingFlight.push({
                nvGivenName:item.nvGivenName,
                nvSurName:item.nvSurName,
                vItineraryNumber:item.vItineraryNumber,
                vFromCode:item.vFromCode,
                vToCode:item.vToCode,
                nvIataDesignator:item.nvIataDesignator,
                nvAirlinesCode:item.nvAirlinesCode
              });
            }
            switch(ind)
            {
              case 1:
                this.sn1=item.nvSurName;
                this.in1=item.vItineraryNumber;
                this.fc1=item.vFromCode;
                this.tc1=item.vToCode;
                this.id1=item.nvIataDesignator;
                this.ac1=item.nvAirlinesCode;
                break;
              case 2:
                this.sn2=item.nvSurName;
                this.in2=item.vItineraryNumber;
                this.fc2=item.vFromCode;
                this.tc2=item.vToCode;
                this.id2=item.nvIataDesignator;
                this.ac2=item.nvAirlinesCode;
                break;
              case 3:
                this.sn3=item.nvSurName;
                this.in3=item.vItineraryNumber;
                this.fc3=item.vFromCode;
                this.tc3=item.vToCode;
                this.id3=item.nvIataDesignator;
                this.ac3=item.nvAirlinesCode;
                break;
              case 4:
                this.sn4=item.nvSurName;
                this.in4=item.vItineraryNumber;
                this.fc4=item.vFromCode;
                this.tc4=item.vToCode;
                this.id4=item.nvIataDesignator;
                this.ac4=item.nvAirlinesCode;
                break;

            }
            ind+=1;
          }
        });

      }catch(exp){}
    }
    getB2BNotice()
    {
      this.bookingNotice=[];
      try{
        this.noticeText="";
        var curDate=this.shareService.getYearLong()+"-"+
        this.shareService.getMonth()+"-"+this.shareService.getDay()+" "+
        this.shareService.padLeft(this.shareService.getHour(),'0',2)+":"+this.shareService.padLeft(this.shareService.getMinute(),'0',2);
        this.authService.getB2BNotice(curDate).subscribe(data=>{
          let ind=0;
          for(let item of data.data)
          {
            this.bookingNotice.push({
              vNoticeID:item.vNoticeID,
              nvNoticeName:item.nvNoticeName,
              nvNoticeContent:item.nvNoticeContent
            });
            // console.log("notice id:"+item.vNoticeID);
            this.noticeText+="<a href='home/notice?id="+item.vNoticeID+"' class='marquee-notice-content'  style='color:#000'><i class='fa fa-paper-plane marquee-notice-icon' aria-hidden='true'></i>"+item.nvNoticeName+"     </a>";

            ind+=1;
          }


        });

      }catch(exp){}
    }
    getRecentFlightSearch() {
      let userId=this.shareService.getUserId();
      this.authService.getRecentFlightSearch(userId).subscribe(data => {
        // console.log("Recent Flight Search:::");
        // console.log(data);
        try{
          this.recentFlightSearch = [];
          for(let item of data.data)
          {
            this.recentFlightSearch.push({
              fromFlightId:item.fromFlightId,
              toFlightId:item.toFlightId,
              fromFlight:item.fromFlight,
              toFlight:item.toFlight,
              departureDate:item.departureDate,
              returnDate:item.returnDate,
              adult:item.adult,
              child:item.child,
              infant:item.infant,
              fromCountry:item.fromCountry,
              fromCity:item.fromCity,
              fromAirport:item.fromAirport,
              toCountry:item.toCountry,
              toCity:item.toCity,
              toAirport:item.toAirport,
              childAge:item.childAge
            });
          }
          localStorage.setItem('recentFlightSearch',JSON.stringify(this.recentFlightSearch));
          var item=this.recentFlightSearch[0];
          this.selectedDepartureCity=item.fromCity;
          this.selectedDepartureCityCode=item.fromFlight;
          this.selectedDepartureAirport=item.fromAirport;
          this.selectedDepartureCountry=item.fromCountry;
          this.selectedAirportFromId=item.fromFlightId;

          this.selectedReturnCity=item.toCity;
          this.selectedReturnCityCode=item.toFlight;
          this.selectedReturnAirport=item.toAirport;
          this.selectedReturnCountry=item.toCountry;
          this.selectedAirportToId=item.toFlightId;
          this.initFlightDepartureArrival();
        }catch(exp){
          console.log(exp);
        }
        }, err => {
        console.log(err);
      });
    }

    getFlightList() {
      this.airports = [];
      this.airports = this.flightHelper.getAirportData();

      this.tempAirportsDeparture = [];
      this.tempAirportsArrival = [];
      this.tempAirportsDeparture1 = [];
      this.tempAirportsArrival1 = [];
      this.tempAirportsDeparture2 = [];
      this.tempAirportsArrival2 = [];
      this.tempAirportsDeparture3 = [];
      this.tempAirportsArrival3 = [];
      this.tempAirportsDeparture4 = [];
      this.tempAirportsArrival4 = [];

      setTimeout(()=>{
        let data=this.shareService.distinctList(this.airports).slice(0,15);
        this.tempAirportsDeparture=data;
        this.tempAirportsArrival=data;
        this.tempAirportsDeparture1=data;
        this.tempAirportsArrival1=data;
        this.tempAirportsDeparture2=data;
        this.tempAirportsArrival2=data;
        this.tempAirportsDeparture3=data;
        this.tempAirportsArrival3=data;
        this.tempAirportsDeparture4=data;
        this.tempAirportsArrival4=data;
      });
      
    }
    getIndexAddImages() {
      this.indexAddImages=[];
      this.authService.getIndexAddImages().subscribe(data => {
          for(let item of data.items)
          {
            if(this.indexAddImages.findIndex(x=>x.id==item.vImageId)<0)
            {
              this.indexAddImages.push({id:item.vImageId,image:item.nvImage,type:item.vType});
            }
          }
        }, err => {
        console.log(err);
      });
    }
    setPassengerInformation()
    {
      let adult:PassengerInfoModel[]=[],child:PassengerInfoModel[]=[],infant:PassengerInfoModel[]=[];
      try{
        let userId=this.shareService.getUserId();
        this.authService.getPassengerInformation(userId).subscribe(data=>{
          for(let item of data.passengerlist)
          {
            if(this.shareService.Equals(item.vPassengerTypeId,this.flightHelper.AdultID))
              adult.push({InfoID:item.vPassengerInformationId,TypeID:item.vPassengerTypeId,
                TitleID:item.vGenderTitleId.toString().trim(),
                TitleName:item.nvGenderTitleName.toString().trim(),
                FirstName:item.nvFirstName.toString().trim(),
                LastName:item.nvLastName.toString().trim(),
                DateOfBirth:item.dBirthDate,
                PassportNumber:item.nvPassportNumber.toString().trim(),
                PassportExpiryDate:item.dExpiryDate});
            if(this.shareService.Equals(item.vPassengerTypeId,this.flightHelper.ChildID))
              child.push({InfoID:item.vPassengerInformationId,TypeID:item.vPassengerTypeId,
                TitleID:item.vGenderTitleId.toString().trim(),
                TitleName:item.nvGenderTitleName.toString().trim(),
                FirstName:item.nvFirstName.toString().trim(),
                LastName:item.nvLastName.toString().trim(),
                DateOfBirth:item.dBirthDate,
                PassportNumber:item.nvPassportNumber.toString().trim(),
                PassportExpiryDate:item.dExpiryDate});
            if(this.shareService.Equals(item.vPassengerTypeId,this.flightHelper.InfantID))
              infant.push({InfoID:item.vPassengerInformationId,TypeID:item.vPassengerTypeId,
                TitleID:item.vGenderTitleId.toString().trim(),
                TitleName:item.nvGenderTitleName.toString().trim(),
                FirstName:item.nvFirstName.toString().trim(),
                LastName:item.nvLastName.toString().trim(),
                DateOfBirth:item.dBirthDate,
                PassportNumber:item.nvPassportNumber.toString().trim(),
                PassportExpiryDate:item.dExpiryDate});
          }
          this.storage.setItem("adultList",adult);
          this.storage.setItem("childList",child);
          this.storage.setItem("infantList",infant);
        },(err)=>{

        });
      }catch(exp){}
    }
    getIndexesImage(type:any):number
    {
      let ret:number=-1;
      try{
        let findedInd=this.indexAddImages.findIndex(x=>x.type.indexOf(type)>-1);
        if(findedInd!=-1)
        {
          ret=findedInd;
        }
      }catch(exp){}
      return ret;
    }
    setAiportInfoInStorage(data:any)
    {
      try{
        if("airportInfo" in localStorage)
        {
          localStorage.removeItem("airportInfo");
        }
        localStorage.setItem('airportInfo',JSON.stringify(data));
      }catch(exp){}
    }
    getExtraRecentSearch():any {
      let ret:any=[];
      try{
        let ind=0;
        for(let item of this.recentFlightSearch)
        {
          if(ind>2 && ind<8)
          {
            ret.push(item);
          }
          ind=ind+1;
        }
      }catch(exp){}
      return ret;
    }
    changeDepRetPanel(ind:any=0)
    {
      this.childList=[];
      this.childList2=[];
      this.childListFinal=[];
      try{
        let data=this.recentFlightSearch[ind];
        if(ind==3)
        {
          var selVal=$("#selectExtraRecent").val();
          data=this.recentFlightSearch[selVal];
        }
        this.num1=parseInt(data.adult);
        this.num2=parseInt(data.child);
        this.num3=parseInt(data.infant);
        if(data.childAge.toString().indexOf(',')>-1)
        {
          let i=0;
          for(let item of data.childAge.split(','))
          {
            this.childListFinal.push({id:i+1,age:parseInt(item)});
            i+=1;
          }
        }else{
          // console.log(data.childAge);
          if(data.childAge!=undefined && data.childAge!='' && data.childAge!='0')
          {
            this.childListFinal.push({id:1,age:parseInt(data.childAge)});
          }
        }
        for(let i=0;i<data.child;i++)
        {
          if(i<6)
          {
            this.childList.push(i+1);
          }else{
            this.childList2.push(i+1);
          }
        }

        let fromItem=this.airports.find(x=>x.code.toString().trim().toLowerCase()==data.fromFlight.toString().trim().toLowerCase());
        let toItem=this.airports.find(x=>x.code.toString().trim().toLowerCase()==data.toFlight.toString().trim().toLowerCase());
        this.selectedDepartureCity=fromItem.cityname;
        this.selectedDepartureCityCode=fromItem.code;
        this.selectedDepartureAirport=fromItem.text;
        this.selectedDepartureCountry=fromItem.countryname;
        this.selectedAirportFromId=fromItem.id;

        this.selectedReturnCity=toItem.cityname;
        this.selectedReturnCityCode=toItem.code;
        this.selectedReturnAirport=toItem.text;
        this.selectedReturnCountry=toItem.countryname;
        this.selectedAirportToId=toItem.id;

        this.selectedDepartureDate=data.departureDate;
        this.departureDayName=this.shareService.getDayNameLong(this.selectedDepartureDate);
        this.departureDay=this.shareService.padLeft(this.selectedDepartureDate.split('-')[2],'0',2);
        this.departureMonthYear=this.shareService.getMonthShort(this.selectedDepartureDate)+"'"+this.shareService.getYearShort(this.selectedDepartureDate);

        this.retDay=Number(this.shareService.getDay(this.selectedDepartureDate));
        this.retMonth=Number(this.shareService.getMonth(this.selectedDepartureDate));
        this.retYear=Number(this.shareService.getYearLong(this.selectedDepartureDate));

        if(data.returnDate!='' && data.returnDate!=undefined)
        {
          this.selectedReturnDate=data.returnDate;
          this.returnDayName=this.shareService.getDayNameLong(this.selectedReturnDate);
          this.returnDay=this.shareService.padLeft(this.selectedReturnDate.split('-')[2],'0',2);
          this.returnMonthYear=this.shareService.getMonthShort(this.selectedReturnDate)+"'"+this.shareService.getYearShort(this.selectedReturnDate);
        }else{
          this.trueFalseSearchType();
          this.isOneway=true;
          this.selectedReturnDate="";
        }
        this.flightSearchDataSet();

      }catch(exp){
        console.log(exp);
      }
    }

    getAirlineList() {
      this.authService.getAirlineList().subscribe(data => {
        this.airlines = [];

          data.airlinelist.forEach((airline: { nvIataDesignator: any;vAirlinesId:any; nvAirlinesName: any; }) => {
            this.airlines.push({
              id: airline.nvIataDesignator,
              masterId: airline.vAirlinesId,
              text: airline.nvAirlinesName,
            });
          });
          //console.log("Airline list:"+JSON.stringify(data));
        }, err => {
        console.log(err);
      });
    }
}
