import { DOCUMENT, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import flatpickr from 'flatpickr';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { CancellationModel } from 'src/app/model/cancellation-model';
import { DateChangeCancelModel } from 'src/app/model/date-change-cancel-model.model';
import { FareAmount } from 'src/app/model/fare-amount';
import { GenderTitleModel } from 'src/app/model/gender-title-model';
import { GetBookModel } from 'src/app/model/get-book-model';
import { PassengerInfoModel } from 'src/app/model/passenger-info-model';
import { PassengerTypeAmtModel } from 'src/app/model/passenger-type-amt-model';
import { RouteWiseMarkupDiscountDetails } from 'src/app/model/route-wise-markup-discount-details.model';
import { TrafficModel } from 'src/app/model/traffic-model';
import { AuthService } from '../../_services/auth.service';
import { ShareService } from '../../_services/share.service';
import { ToastrService } from '../../_services/toastr.service';
import { FlightHelperService } from '../flight-helper.service';
declare var window: any;
declare var $: any;
@Component({
  selector: 'app-passenger-details',
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.css']
})
export class PassengerDetailsComponent implements OnInit {
  loadAPI: Promise<any> | any;
  urlMain = "./assets/dist/js/main.min.js";

  passengerDetails: any[]=[];

  fmgPassenger:FormGroup|any;
  fmgFlightSegment:FormGroup|any;
  fmgSSR:FormGroup|any;

  fmgBooking:FormGroup|any;
  fmgBookingJourney:FormGroup|any;
  fmgBookingFlight:FormGroup|any;
  fmgBookingTraveller:FormGroup|any;
  fmgBookingFare:FormGroup|any;
  fmgBookedPassenger:FormGroup|any;
  fmgGetBooking:FormGroup|any;
  fmgAssignProviderWithBooking:FormGroup|any;
  fmgAssignJourneyWithTraveler:FormGroup|any;
  fmgFlightSearchOneWay: FormGroup|any;
  fmgRevalidateFlightSegment: FormGroup | any;
  fmgRevalidateFlight: FormGroup | any;
  fmgRevalidate:FormGroup|any;
  fmgChild:FormArray|any;

  item:any;

  loadedGenderTitleList:any[]=[];
  genderTitleListAdult:GenderTitleModel[]=[];
  genderTitleListChild:GenderTitleModel[]=[];
  genderTitleListInfant:GenderTitleModel[]=[];
  genderList:GenderTitleModel[]=[];
  passengerTypeList:any[]=[];
  passengerInfoListAdult:PassengerInfoModel[]=[];
  passengerInfoListChild:PassengerInfoModel[]=[];
  passengerInfoListInfant:PassengerInfoModel[]=[];
  ssrList:any[]=[];
  onlyChildInfant:any[]=['1BECFC19-114F-405B-8C5A-078ADD34CC85','451AA67B-BC10-444F-AEC0-53BACA61AA1B'];
  maleGenderTitle:any[]=['1BECFC19-114F-405B-8C5A-078ADD34CC85','BAE4AE9C-6003-4721-841E-9ABE5E371C2E'];

  depDayNumberName:any;
  depDayNumber:any;
  depMonthName:any;
  isBookClicked:boolean=false;

  countrylists:any=[];

  selectedDateA: any;
  selectedDateC: any;
  selectedDateI: any;

  expiredDate: any
  pushdaterange:any[]=[];
  datechange: any;

  checkAgeValidation: any;
  firstLegData:any[]=[];
  secondLegData:any[]=[];
  firstLegFareData:any[]=[];
  secondLegFareData:any[]=[];

  amtDateChangesPre:any;
  amtDateChanges:any;
  amtDateChangesPlus:any;
  amtCancellationPre:any;
  amtCancellation:any;
  amtCancellationPlus:any;
  isDomMulticity:boolean=false;
  isIntMulticity:boolean=false;

  amtDateChangesPre1:any;
  amtDateChanges1:any;
  amtDateChangesPlus1:any;
  amtCancellationPre1:any;
  amtCancellation1:any;
  amtCancellationPlus1:any;

  amtDateChangesPre2:any;
  amtDateChanges2:any;
  amtDateChangesPlus2:any;
  amtCancellationPre2:any;
  amtCancellation2:any;
  amtCancellationPlus2:any;

  amtDateChangesPre3:any;
  amtDateChanges3:any;
  amtDateChangesPlus3:any;
  amtCancellationPre3:any;
  amtCancellation3:any;
  amtCancellationPlus3:any;

  amtDateChangesPre4:any;
  amtDateChanges4:any;
  amtDateChangesPlus4:any;
  amtCancellationPre4:any;
  amtCancellation4:any;
  amtCancellationPlus4:any;

  isCancellationShow1:boolean=true;
  isCancellationShow2:boolean=true;
  isCancellationShow3:boolean=true;
  isCancellationShow4:boolean=true;
  isBookCount:number=0;
  isBookFailCount:number=0;
  isIssueCount:number=0;
  trafficList:TrafficModel[]=[];
  CancellationList:CancellationModel[]=[];
  UserID: any;
  readonly iAdultBDateAge:number=12;
  public selectedDepartureDate:any=this.shareService.getYearLong()+"-"+
  this.shareService.padLeft(this.shareService.getMonth(),'0',2)+"-"+this.shareService.padLeft(this.shareService.getDay(),'0',2);
  adultPass:any;
  adultVisa:any;
  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
  private router: Router, private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,public flightHelper:FlightHelperService,
  public tosterService:ToastrService,private storage:LocalStorageService ) {

  }

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'flight_search_details');
    this.loadAPI = new Promise(resolve => {
      this.loadScript();
    });
    this.init();
    this.UserID=this.shareService.getUserId();
    this.authService.getAgency(this.UserID).subscribe(data => {
      this.passengerDetails = data.data;
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'flight_search_details');
  }
  init()
  {
    setTimeout(()=>{
      flatpickr(".date",{
        enableTime: false,
        dateFormat: "d-m-Y",
        allowInput:true,
        maxDate:"today"
      });
    });
    this.initFormGroup();
    this.initFormBooking();
    this.initRevalidateFlight();
    this._genderTitleLoad();
    this._genderLoad();
    this._passengerTypeLoad();
    this._passengerInfoLoad();
    this._specialServiceLoad();
    this._getCountryList();
    this.setStoreData();
    this.isBookCount=0;
    this.isBookFailCount=0;
    this.isIssueCount=0;
  }
  dateexpired(e: any,id:any){
    this.expiredDate = e.target.value;
    $("#"+id).val(e.target.value);
  }
  getFirstShow(ind:number):string
  {

    if(ind==0)
    {
      return "show";
    }
    return "";
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
  initFormBooking()
  {
    this.fmgGetBooking=this.fb.group({
      PnrProvider:new FormArray([])
    });
    this.initBookedPassenger();
  }
  initBookedPassenger()
  {
    this.fmgBookedPassenger=this.fb.group({
      Booking:new FormArray([]),
      BookingJourney:new FormArray([]),
      BookingFlight:new FormArray([]),
      BookingTraveler:new FormArray([]),
      BookingFare:new FormArray([]),
      AssignProviderWithBooking:new FormArray([]),
      AssignJourneyWithTraveler:new FormArray([]),
    });
  }
  initFormGroup()
  {
    this.fmgPassenger=this.fb.group({
      PassengerInfo:new FormArray([]),
    });
  }
  initRevalidateFlight()
  {
    this.fmgRevalidate=this.fb.group({
      RevalidateFlight:new FormArray([]),
    });
  }
  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }
  setStoreData()
  {
    try{
      var data=localStorage.getItem("flightDataIndividual");
      this.item=JSON.parse(data!);
      // console.log("flight data::");
      // console.log(this.item);
      this.isDomMulticity=false;
      this.isIntMulticity=false;
      this.firstLegData=[];
      this.secondLegData=[];
      this.firstLegFareData=[];
      this.secondLegFareData=[];
      let tripTypeNumber="";
      let date="";
      if(this.item.tripTypeId==undefined)
      {
        if(Array.isArray(this.item))
        {
          tripTypeNumber=this.item[0].tripTypeId;
          this.isIntMulticity=true;
        }else{
          tripTypeNumber=this.item.data1.tripTypeId;
          this.isDomMulticity=true;
        }
      }else{
        tripTypeNumber=this.item.tripTypeId;
      }
      switch(this.flightHelper.getTripTypeNumber(tripTypeNumber))
      {
        case 1:
          this.firstLegData.push(this.item);
          date=this.firstLegData[0].departureDate;
          this.firstLegFareData.push(this.item.fareData);
          $('#resultBoxId').removeClass('roundtrip_summarybar modal_tripsummary').addClass('result_single_box');
          break;
        case 2:
          this.firstLegData.push(this.item.firstLegData[0]);
          this.firstLegFareData.push(this.item.firstLegData[0].fareData);
          if(this.item.secondLegData.length>0)
          {
            for(let item of this.item.secondLegData)
            {
              this.firstLegData.push(item);
              date=this.firstLegData[1].departureDate;
              this.firstLegFareData.push(item.fareData);
            }
          }
          $('#resultBoxId').removeClass('result_single_box').addClass('roundtrip_summarybar modal_tripsummary');
          break;
        case 3:
          if(this.isDomMulticity)
          {
            if(!this.shareService.isObjectEmpty(this.item.data1))
            {
              this.firstLegData.push(this.item.data1);
              this.firstLegFareData.push(this.item.data1.fareData);
            }
            if(!this.shareService.isObjectEmpty(this.item.data2))
            {
              this.firstLegData.push(this.item.data2);
              this.firstLegFareData.push(this.item.data2.fareData);
            }
            if(!this.shareService.isObjectEmpty(this.item.data3))
            {
              this.firstLegData.push(this.item.data3);
              this.firstLegFareData.push(this.item.data3.fareData);
            }
            if(!this.shareService.isObjectEmpty(this.item.data4))
            {
              this.firstLegData.push(this.item.data4);
              this.firstLegFareData.push(this.item.data4.fareData);
            }
          }else{
            this.isIntMulticity=true;
            this.firstLegData=[];
            this.firstLegFareData=[];
            for(let item of this.item)
            {
              this.firstLegData.push(item);
              date=item.departureDate;
              this.firstLegFareData.push(item.fareData);
            }
          }
          break;
      }
      // date=this.firstLegData[0].departureDate;
      //console.log(date);
      let adultMaxDate=this.shareService.setDate(-this.iAdultBDateAge,0,-1,date);
      let infantMinDate=this.shareService.setDate(-2,0,+4,date);
      //console.log("infantMinDate");
      //console.log(infantMinDate);
      for(let i=0;i<this.firstLegData[0].child.length;i++)
      {
        //let childMinDate=this.shareService.setDate(-(this.firstLegData[0].child[i]+1),0,+1,this.firstLegData[0].departureDate);
        //let childMaxDate=this.shareService.setDate(-this.firstLegData[0].child[i],0,+364,this.firstLegData[0].departureDate);
        let childMinDate=this.shareService.setDate(-11,0,0,date);
        console.log(infantMinDate);
        //console.log(childMaxDate);
        setTimeout(()=>{
          flatpickr(".child-bdate"+i,{
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDateFromDate(childMinDate),
            //maxDate:this.shareService.getFlatPickDateFromDate(childMaxDate),
            maxDate:this.shareService.getFlatPickDate(date),
          });
        });
      }
      setTimeout(()=>{
        flatpickr(".expire-date",{
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:this.shareService.getFlatPickDate(date)
        });
        flatpickr(".adult-bdate",{
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          maxDate:this.shareService.getFlatPickDateFromDate(adultMaxDate)
        });
        flatpickr(".infant-bdate",{
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:this.shareService.getFlatPickDateFromDate(infantMinDate),
          maxDate:this.shareService.getFlatPickDate(date)
        });
      });
    }catch(exp)
    {
      console.log(exp);
    }
  }
  getSelectedFlightToIssueBottomAmount():any
  {
    let ret:any=0;
    try{
      let sum:number=0;
      if(!this.shareService.isObjectEmpty(this.item.data1))
      {
        sum+=parseFloat(this.item.data1.clientFareTotal);
      }
      if(!this.shareService.isObjectEmpty(this.item.data2))
      {
        sum+=parseFloat(this.item.data2.clientFareTotal);
      }
      if(!this.shareService.isObjectEmpty(this.item.data3))
      {
        sum+=parseFloat(this.item.data3.clientFareTotal);
      }
      if(!this.shareService.isObjectEmpty(this.item.data4))
      {
        sum+=parseFloat(this.item.data4.clientFareTotal);
      }
      ret=sum;
    }catch(exp){}
    return ret;
  }
  checkValidation(adult:any,child:any,infant:any):boolean
  {
    $("#reqPhone").css('display','none');
    $("#reqEmail").css('display','none');
    $("#valEmail").css('display','none');
    $("#valTitleAdult0").css('display','block');
    let valAdult=0,valChild=0,valInfant=0,valEmail=0,valPhone=0;
    let isAdult=false,isChild=false,isInfant=false;
    let isDomestic:boolean=this.firstLegData[0].domestic;
    for(let i=0;i<this.flightHelper._count(adult).length;i++)
    {

      $("#valTitleAdult"+i).css('display','none');
      $("#valFirstNameAdult"+i).css('display','none');
      $("#valLastNameAdult"+i).css('display','none');
      $("#valDOBAdult"+i).css('display','none');
      $("#valNationalityAdult"+i).css('display','none');
      $("#valPassportAdult"+i).css('display','none');
      $("#valPassportExpiryAdult"+i).css('display','none');
      var adCheck=$("#adultSave"+i).is(':checked');
      var gTitleId=$("#adultGenderTitleId"+i).val();
      var fName=$("#adultFirstName"+i).val();
      var lName=$("#adultLastName"+i).val();
      var iDob=$("#adultDOB"+i).val();
      var iNationality=$("#adultNationality"+i).val();
      var iPassport=$("#adultPassport"+i).val();
      var iPassportExpiry=$("#adultPassportExpiry"+i).val();
      if(this.shareService.isNullOrEmpty(gTitleId))
      {
        $("#valTitleAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(fName))
      {
        $("#valFirstNameAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(lName))
      {
        $("#valLastNameAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iDob) && !isDomestic)
      {
        $("#valDOBAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality) && !isDomestic)
      {
        $("#valNationalityAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassport) && !isDomestic)
      {
        $("#valPassportAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassportExpiry) && !isDomestic)
      {
        $("#valPassportExpiryAdult"+i).css('display','block');
      }
      if(this.firstLegData[0].domestic)
      {
        if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
        && !this.shareService.isNullOrEmpty(lName))
        {
          valAdult+=1;
        }
      }else{
        if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
        && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
        && !this.shareService.isNullOrEmpty(iNationality) && !this.shareService.isNullOrEmpty(iPassport)
        && !this.shareService.isNullOrEmpty(iPassportExpiry))
        {
          valAdult+=1;
        }
      }
      isAdult=true;
    }
    for(let i=0;i<child.length;i++)
    {
      $("#valTitleChild"+i).css('display','none');
      $("#valFirstNameChild"+i).css('display','none');
      $("#valLastNameChild"+i).css('display','none');
      $("#valDOBChild"+i).css('display','none');
      $("#valNationalityChild"+i).css('display','none');
      $("#valPassportChild"+i).css('display','none');
      $("#valPassportExpiryChild"+i).css('display','none');
      var adCheck=$("#childSave"+i).is(':checked');
      var gTitleId=$("#childGenderTitleId"+i).val();
      var fName=$("#childFirstName"+i).val();
      var lName=$("#childLastName"+i).val();
      var iDob=$("#childDOB"+i).val();
      var iNationality=$("#childNationality"+i).val();
      var iPassport=$("#childPassport"+i).val();
      var iPassportExpiry=$("#childPassportExpiry"+i).val();
      if(this.shareService.isNullOrEmpty(gTitleId))
      {
        $("#valTitleChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(fName))
      {
        $("#valFirstNameChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(lName))
      {
        $("#valLastNameChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iDob) && !isDomestic)
      {
        $("#valDOBChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality) && !isDomestic)
      {
        $("#valNationalityChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassport) && !isDomestic)
      {
        $("#valPassportChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassportExpiry) && !isDomestic)
      {
        $("#valPassportExpiryChild"+i).css('display','block');
      }
      if(this.firstLegData[0].domestic)
      {
        if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName) && !this.shareService.isNullOrEmpty(lName))
        {
          valChild+=1;
        }
      }else{
        if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
        && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
        && !this.shareService.isNullOrEmpty(iNationality) && !this.shareService.isNullOrEmpty(iPassport)
        && !this.shareService.isNullOrEmpty(iPassportExpiry))
        {
          valChild+=1;
        }
      }
      isChild=true;
    }
    for(let i=0;i<this.flightHelper._count(infant).length;i++)
    {
      $("#valTitleInfant"+i).css('display','none');
      $("#valFirstNameInfant"+i).css('display','none');
      $("#valLastNameInfant"+i).css('display','none');
      $("#valDOBInfant"+i).css('display','none');
      $("#valNationalityInfant"+i).css('display','none');
      $("#valPassportInfant"+i).css('display','none');
      $("#valPassportExpiryInfant"+i).css('display','none');
      var adCheck=$("#infantSave"+i).is(':checked');
      var gTitleId=$("#infantGenderTitleId"+i).val();
      var fName=$("#infantFirstName"+i).val();
      var lName=$("#infantLastName"+i).val();
      var iDob=$("#infantDOB"+i).val();
      var iNationality=$("#infantNationality"+i).val();
      var iPassport=$("#infantPassport"+i).val();
      var iPassportExpiry=$("#infantExpiryDate"+i).val();
      if(this.shareService.isNullOrEmpty(gTitleId))
      {
        $("#valTitleInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(fName))
      {
        $("#valFirstNameInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(lName))
      {
        $("#valLastNameInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iDob) && !isDomestic)
      {
        $("#valDOBInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality) && !isDomestic)
      {
        $("#valNationalityInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassport) && !isDomestic)
      {
        $("#valPassportInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassportExpiry) && !isDomestic)
      {
        $("#valPassportExpiryInfant"+i).css('display','block');
      }
      if(this.firstLegData[0].domestic)
      {
        if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName) && !this.shareService.isNullOrEmpty(lName))
        {
          valInfant+=1;
        }
      }else{
        if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
        && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
        && !this.shareService.isNullOrEmpty(iNationality) && !this.shareService.isNullOrEmpty(iPassport)
        && !this.shareService.isNullOrEmpty(iPassportExpiry))
        {
          valInfant+=1;
        }
      }
      isInfant=true;
    }

    if($("#phoneNo").val()=="")
    {
      $("#reqPhone").css('display','block');
    }
    if($("#phoneNo").val()!="")
    {
      valPhone=1;
    }
    if($("#email").val()=="")
    {
      $("#reqEmail").css('display','block');
    }
    if($("#email").val()!="")
    {
      $("#reqEmail").css('display','none');
      let isEmail=this.shareService.validateEmail($("#email").val());
      if(!isEmail)
      {
        $("#valEmail").css('display','block');
      }else{
        valEmail=1;
      }
    }
    if(((isAdult && valAdult==adult)|| !isAdult) && ((isChild && valChild==child.length)|| !isChild) && ((isInfant && valInfant==infant)|| !isInfant)
    &&  (valEmail==1 && valPhone==1))
    {
      return true;
    }
    return false;
  }

  bookHoldWork(adult:any,child:any,infant:any)
  {
    // console.log("First leg data afte rbook click::");
    // console.log(this.firstLegData);
    if(this.checkAgeValidation == null){
      this.initRevalidateFlight();
      console.log(this.checkValidation(adult,child,infant));
      if(this.checkValidation(adult,child,infant))
      {
        // console.log("Data:::");
        // console.log(this.firstLegData);
        this.isBookClicked=true;
        let i=0;
        for(let item of this.firstLegData)
        {
          this.RevalidateFlight().push(this.fb.group({
            DepartureDateTime:item.departureDate+"T"+item.departureTime+":00",
            ArrivalDateTime:this.flightHelper.getAdjustmentDate(item.departureDate,item.adjustment)
            .format('YYYY-MM-DD')+"T"+item.arrivalTime+":00",
            DepartureCode:item.departureCityCode,
            ArrivalCode:item.arrivalCityCode,
            ProviderId:item.providerId,
            Adult:item.adult,Infant:item.infant,
            Child:new FormArray([]),
            RevalidateFlightSegment:new FormArray([])
          }));
          if(!this.shareService.isObjectEmpty(item.childList))
          {
            for(let childItem of item.childList)
            {
              this.Child(0).push(this.fb.group({
                id: childItem.id,
                age: childItem.age
              }));
            }
          }

          for(let flightItem of item.flightSegmentData)
          {
            this.RevalidateFlightSegment(i).push(this.fb.group({
              Number:flightItem.airlineNumber,
              DepartureDateTime:this.flightHelper.getAdjustmentDate(this.firstLegData[0].departureDate,flightItem.adjustment,flightItem.departureAdjustment)
              .format('YYYY-MM-DD')+"T"+flightItem.departureTime+":00",
              ArrivalDateTime:this.flightHelper.getAdjustmentDate(this.firstLegData[0].departureDate,flightItem.adjustment,flightItem.arrivalAdjustment)
              .format('YYYY-MM-DD')+"T"+flightItem.arrivalTime+":00",
              Type:"A",
              ClassOfService:"O",
              DepartureCode:flightItem.departureAirportCode,
              ArrivalCode:flightItem.arrivalAirportCode,
              AirlineOperating:flightItem.airlineCode,
              AirlineMarketing:flightItem.airlineCode,
              BookingDateTime:this.flightHelper.getAdjustmentDate(item.departureDate,item.adjustment)
              .format('YYYY-MM-DD')+"T"+item.arrivalTime+":00"
            }));
          }
          i+=1;
        }
        if(!this.shareService.isObjectEmpty(this.secondLegData[0]))
        {
          for(let flightItem of this.secondLegData[0].flightSegmentData)
          {
            this.RevalidateFlightSegment(0).push(this.fb.group({
              Number:flightItem.airlineNumber,
              DepartureDateTime:this.flightHelper.getAdjustmentDate(this.firstLegData[0].departureDate,flightItem.adjustment,flightItem.departureAdjustment)
              .format('YYYY-MM-DD')+"T"+flightItem.departureTime+":00",
              ArrivalDateTime:this.flightHelper.getAdjustmentDate(this.firstLegData[0].departureDate,flightItem.adjustment,flightItem.arrivalAdjustment)
              .format('YYYY-MM-DD')+"T"+flightItem.arrivalTime+":00",
              Type:"A",
              ClassOfService:"O",
              DepartureCode:flightItem.departureAirportCode,
              ArrivalCode:flightItem.arrivalAirportCode,
              AirlineOperating:flightItem.airlineCode,
              AirlineMarketing:flightItem.airlineCode,
              BookingDateTime:this.flightHelper.getAdjustmentDate(this.secondLegData[0].departureDate,this.secondLegData[0].adjustment)
              .format('YYYY-MM-DD')+"T"+this.secondLegData[0].arrivalTime+":00"
            }));
          }
        }
        // console.log("Flight Revalidate::");
        // console.log(this.fmgRevalidate.value);
        //Every route revalidate
        this.authService.getRevalidateItinery(Object.assign({},this.fmgRevalidate.value)).subscribe(data=>{
          let i=0;
          // console.log("Revalidate::");
          // console.log(JSON.stringify(data.res));
          let isChanges=false;
          let typeButtonClick="BOOK & HOLD";
          if(this.firstLegData[i].instantEnable)
            typeButtonClick="ISSUE NOW";
          // for(let item of data.res)
          // {
          //   try
          //   {
          //     let itinery=item.groupedItineraryResponse.statistics.itineraryCount;
          //     if(itinery>0)
          //     {
          //       let rootData=item.groupedItineraryResponse.itineraryGroups[0].itineraries[0].pricingInformation[0];
          //       let oldPrice=this.firstLegData[i].gdsFareTotal;
          //       let newPrice=item.groupedItineraryResponse.itineraryGroups[0].itineraries[0].pricingInformation[0].fare.totalFare.totalPrice;
          //       console.log("Old Price:"+oldPrice+" New Price:"+newPrice);
          //       if(Number(oldPrice)!=Number(newPrice))
          //         isChanges=true;
          //       //Price change for every route with priceChangeWork function
          //       this._priceChangeWork(i,rootData);
          //     }
          //   }catch(exp){}
          //   i++;
          // }
          // //all data price changes are ok then go to Pnr create through all data(booking Work function)
          // if(isChanges)
          // {
          //   Swal.fire({
          //     title: 'Price Changed!',
          //     text: "Please review the new price and click on "+typeButtonClick+" once again",
          //     icon: 'warning',
          //     showCancelButton: false,
          //     confirmButtonColor: '#3085d6',
          //     cancelButtonColor: '#d33',
          //     confirmButtonText: 'Ok'
          //   }).then((result) => {
          //     if (result.isConfirmed) {
          //       this.bookingWork(adult,child,infant);
          //     }
          //   })
          // }else{
          //   this.bookingWork(adult,child,infant);
          // }
          this.bookingWork(adult,child,infant);
        },error=>{
          let typeButtonClick="BOOK & HOLD";
          if(this.firstLegData[i].instantEnable)
            typeButtonClick="ISSUE NOW";
            this.bookingWork(adult,child,infant);
        });
      }
    }else{
      window.document.getElementById("demo").innerHTML = "*Date of Birth not valid";
    }

  }
  _priceChangeWork(i:number,rootData:any)
  {
    // console.log("Before price change::");
    // console.log(this.firstLegData);
    try{
      let adultGDS:FareAmount={
        AmtAgentTotal: 0,
        AmtBaseGDS: 0,
        AmtBaseClient: 0,
        AmtTaxGDS: 0,
        AmtTaxClient: 0,
        AmtTotalGDS: 0,
        AmtTotalClient: 0,
        AmtDiscount: 0
      };
      let childGDS:FareAmount={
        AmtAgentTotal: 0,
        AmtBaseGDS: 0,
        AmtBaseClient: 0,
        AmtTaxGDS: 0,
        AmtTaxClient: 0,
        AmtTotalGDS: 0,
        AmtTotalClient: 0,
        AmtDiscount: 0
      };
      let infantGDS:FareAmount={
        AmtAgentTotal: 0,
        AmtBaseGDS: 0,
        AmtBaseClient: 0,
        AmtTaxGDS: 0,
        AmtTaxClient: 0,
        AmtTotalGDS: 0,
        AmtTotalClient: 0,
        AmtDiscount: 0
      };
      let clientTotal:PassengerTypeAmtModel={
        Adult:0,Child:0,Infant:0
      };
      let agentTotal:PassengerTypeAmtModel={
        Adult:0,Child:0,Infant:0
      };
      let passengerInfoListData=rootData.fare.passengerInfoList;
      let adultMember=this.firstLegData[i].adult;
      let childListMember=this.firstLegData[i].child;
      let infantMember=this.firstLegData[i].infant;

      adultGDS.AmtBaseGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"adult","base");
      adultGDS.AmtTaxGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"adult","tax");
      adultGDS.AmtTotalGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"adult","total");
      adultGDS.AmtDiscount=this.flightHelper._getDisountTotalPrice(this.firstLegData[i].discountInfo,
      adultGDS.AmtBaseGDS,adultGDS.AmtTaxGDS,adultGDS.AmtTotalGDS,
      this.firstLegData[i].adult,this.firstLegData[i].airlineCode);

      childGDS.AmtBaseGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"child","base");
      childGDS.AmtTaxGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"child","tax");
      childGDS.AmtTotalGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"child","total");
      childGDS.AmtDiscount=this.flightHelper._getDisountTotalPrice(this.firstLegData[i].discountInfo,
      childGDS.AmtBaseGDS,childGDS.AmtTaxGDS,childGDS.AmtTotalGDS,
      this.firstLegData[i].child.length,this.firstLegData[i].airlineCode);

      infantGDS.AmtBaseGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"infant","base");
      infantGDS.AmtTaxGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"infant","tax");
      infantGDS.AmtTotalGDS=this.flightHelper._getRevalidatePrice(passengerInfoListData,"infant","total");
      infantGDS.AmtDiscount=this.flightHelper._getDisountTotalPrice(this.firstLegData[i].discountInfo,
      infantGDS.AmtBaseGDS,infantGDS.AmtTaxGDS,infantGDS.AmtTotalGDS,
      this.firstLegData[i].infant,this.firstLegData[i].airlineCode);

      clientTotal.Adult=parseFloat(this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Base",
      adultGDS.AmtBaseGDS,adultGDS.AmtTaxGDS,adultGDS.AmtTotalGDS,adultMember,this.firstLegData[i].airlineCode))
      +parseFloat(this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Tax",
      adultGDS.AmtBaseGDS,adultGDS.AmtTaxGDS,adultGDS.AmtTotalGDS,adultMember,this.firstLegData[i].airlineCode));

      clientTotal.Child=parseFloat(this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Base",
      childGDS.AmtBaseGDS,childGDS.AmtTaxGDS,childGDS.AmtTotalGDS,childListMember.length,this.firstLegData[i].airlineCode))+
      parseFloat(this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Tax",
      childGDS.AmtBaseGDS,childGDS.AmtTaxGDS,childGDS.AmtTotalGDS,childListMember.length,this.firstLegData[i].airlineCode));

      clientTotal.Infant=parseFloat(this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Base",
      infantGDS.AmtBaseGDS,infantGDS.AmtTaxGDS,infantGDS.AmtTotalGDS,infantMember,this.firstLegData[i].airlineCode))+
      parseFloat(this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Tax",
      infantGDS.AmtBaseGDS,infantGDS.AmtTaxGDS,infantGDS.AmtTotalGDS,infantMember,this.firstLegData[i].airlineCode));

      agentTotal.Adult=clientTotal.Adult-(adultGDS.AmtDiscount*parseFloat(adultMember));
      agentTotal.Child=clientTotal.Child-(childGDS.AmtDiscount*parseFloat(childListMember.length));
      agentTotal.Infant=clientTotal.Infant-(infantGDS.AmtDiscount*parseFloat(infantMember));

      this.firstLegData[i].totalPrice=rootData.fare.totalFare.totalPrice;

      this.firstLegData[i].totalDiscount=this.shareService.addMore([adultGDS.AmtDiscount,childGDS.AmtDiscount,infantGDS.AmtDiscount]);
      this.firstLegData[i].clientFareTotal=this.shareService.addMore([clientTotal.Adult,clientTotal.Child,clientTotal.Infant]);
      this.firstLegData[i].agentFareTotal=this.shareService.addMore([agentTotal.Adult,agentTotal.Child,agentTotal.Infant]);
      this.firstLegData[i].gdsFareTotal=this.shareService.addMore([adultGDS.AmtTotalGDS,childGDS.AmtTotalGDS,infantGDS.AmtTotalGDS]);


      this.firstLegData[i].fareData.adultBaseGDS=adultGDS.AmtBaseGDS,
      this.firstLegData[i].fareData.childBaseGDS=childGDS.AmtBaseGDS,
      this.firstLegData[i].fareData.infantBaseGDS=infantGDS.AmtBaseGDS,
      this.firstLegData[i].fareData.adultTaxGDS=adultGDS.AmtTaxGDS,
      this.firstLegData[i].fareData.childTaxGDS=childGDS.AmtTaxGDS,
      this.firstLegData[i].fareData.infantTaxGDS=infantGDS.AmtTaxGDS,
      this.firstLegData[i].fareData.adultTotalGDS=adultGDS.AmtTotalGDS,
      this.firstLegData[i].fareData.childTotalGDS=childGDS.AmtTotalGDS,
      this.firstLegData[i].fareData.infantTotalGDS=infantGDS.AmtTotalGDS,
      this.firstLegData[i].fareData.adultBaseClient=this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Base",
      adultGDS.AmtBaseGDS,adultGDS.AmtTaxGDS,adultGDS.AmtTotalGDS,adultMember,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.adultTaxClient=this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Tax",
      adultGDS.AmtBaseGDS,adultGDS.AmtTaxGDS,adultGDS.AmtTotalGDS,adultMember,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.adultTotalClient=this.flightHelper._getMarkupTotalPrice(this.firstLegData[i].markupInfo,
      adultGDS.AmtBaseGDS,adultGDS.AmtTaxGDS,adultGDS.AmtTotalGDS,adultMember,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.adultDiscount=adultGDS.AmtDiscount*parseFloat(adultMember),
      this.firstLegData[i].fareData.adultAgentFare=this.flightHelper._agentPrice(this.firstLegData[i].markupInfo,
      this.firstLegData[i].discountInfo,adultMember,adultGDS.AmtBaseGDS,adultGDS.AmtTaxGDS,adultGDS.AmtTotalGDS,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.childBaseClient=this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Base",
      childGDS.AmtBaseGDS,childGDS.AmtTaxGDS,childGDS.AmtTotalGDS,childListMember.length,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.childTaxClient=this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Tax",
      childGDS.AmtBaseGDS,childGDS.AmtTaxGDS,childGDS.AmtTotalGDS,childListMember.length,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.childTotalClient=this.flightHelper._getMarkupTotalPrice(this.firstLegData[i].markupInfo,
      childGDS.AmtBaseGDS,childGDS.AmtTaxGDS,childGDS.AmtTotalGDS,childListMember.length,this.firstLegData[i].airlineCode), //toFixed aummit
      this.firstLegData[i].fareData.childDiscount=childGDS.AmtDiscount*parseFloat(childListMember.length),
      this.firstLegData[i].fareData.childAgentFare=this.flightHelper._agentPrice(this.firstLegData[i].markupInfo,
      this.firstLegData[i].discountInfo,childListMember.length,childGDS.AmtBaseGDS,childGDS.AmtTaxGDS,childGDS.AmtTotalGDS,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.infantBaseClient=this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Base",
      infantGDS.AmtBaseGDS,infantGDS.AmtTaxGDS,infantGDS.AmtTotalGDS,infantMember,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.infantTaxClient=this.flightHelper._typeWisePrice(this.firstLegData[i].markupInfo,"Tax",
      infantGDS.AmtBaseGDS,infantGDS.AmtTaxGDS,infantGDS.AmtTotalGDS,infantMember,this.firstLegData[i].airlineCode),
      this.firstLegData[i].fareData.infantTotalClient=this.flightHelper._getMarkupTotalPrice(this.firstLegData[i].markupInfo,
      infantGDS.AmtBaseGDS,infantGDS.AmtTaxGDS,infantGDS.AmtTotalGDS,infantMember,this.firstLegData[i].airlineCode), //toFixed aummit
      this.firstLegData[i].fareData.infantDiscount=infantGDS.AmtDiscount*parseFloat(infantMember),
      this.firstLegData[i].fareData.infantAgentFare=this.flightHelper._agentPrice(this.firstLegData[i].markupInfo,this.firstLegData[i].discountInfo,
      infantMember,infantGDS.AmtBaseGDS,infantGDS.AmtTaxGDS,infantGDS.AmtTotalGDS,this.firstLegData[i].airlineCode);
    }catch(exp){}
  }
  getInvoiceAdult():FareAmount
  {
    let ret:FareAmount={
      AmtAgentTotal: 0,
      AmtBaseGDS: 0,
      AmtBaseClient: 0,
      AmtTaxGDS: 0,
      AmtTaxClient: 0,
      AmtTotalGDS: 0,
      AmtTotalClient: 0,
      AmtDiscount: 0
    };
    try{
      for(let item of this.firstLegData)
      {
        ret.AmtBaseClient+=Number(item.fareData.adultBaseClient);
        ret.AmtTaxClient+=Number(item.fareData.adultTaxClient);
        ret.AmtTotalClient+=Number(item.fareData.adultTotalClient);
        ret.AmtDiscount+=Number(item.fareData.adultDiscount);
      }
    }catch(exp){
      console.log(exp);
    }
    return ret;
  }
  getInvoiceChild():FareAmount
  {
    let ret:FareAmount={
      AmtAgentTotal: 0,
      AmtBaseGDS: 0,
      AmtBaseClient: 0,
      AmtTaxGDS: 0,
      AmtTaxClient: 0,
      AmtTotalGDS: 0,
      AmtTotalClient: 0,
      AmtDiscount: 0
    };
    try{
      for(let item of this.firstLegData)
      {
        ret.AmtBaseClient+=Number(item.fareData.childBaseClient);
        ret.AmtTaxClient+=Number(item.fareData.childTaxClient);
        ret.AmtTotalClient+=Number(item.fareData.childTotalClient);
        ret.AmtDiscount+=Number(item.fareData.childDiscount);
      }
    }catch(exp){}
    return ret;
  }
  getInvoiceInfant():FareAmount
  {
    let ret:FareAmount={
      AmtAgentTotal: 0,
      AmtBaseGDS: 0,
      AmtBaseClient: 0,
      AmtTaxGDS: 0,
      AmtTaxClient: 0,
      AmtTotalGDS: 0,
      AmtTotalClient: 0,
      AmtDiscount: 0
    };
    try{
      for(let item of this.firstLegData)
      {
        ret.AmtBaseClient+=Number(item.fareData.infantBaseClient);
        ret.AmtTaxClient+=Number(item.fareData.infantTaxClient);
        ret.AmtTotalClient+=Number(item.fareData.infantTotalClient);
        ret.AmtDiscount+=Number(item.fareData.infantDiscount);
      }
    }catch(exp){}
    return ret;
  }

  bookingWork(adult:any,child:any,infant:any)
  {
    this._setFormGroupInfo(adult,child,infant);
  }
VAssignSupplierWithProviderId: any;
  _bookedYourPassenger(passengerData:FormGroup,data:any, formData: any)
  {
    try{

      let getBooking:GetBookModel[]=[];
      let isBookSuccess:boolean=false;
      // console.log("Passenger Info::");
      // console.log(data);
      //All of PNR Response list
      for(let item of data)
      {
        var status=item.pnrData.CreatePassengerNameRecordRS.ApplicationResults.status;
        if(status=="Complete" && status!=undefined)
        {
          let SupplierId = '2526c355-768d-4bfd-b4b7-0ef4b1eaa4f0';
          if(this.item.supplierID){
            SupplierId = this.item.supplierID;
          }

        const requestData: RouteWiseMarkupDiscountDetails = {
          ProviderId: item.providerId,
          SupplierId:SupplierId
        };

        this.authService.getAssignSupplierWithProviderBySupplierAndProviderId(requestData).subscribe((data) => {
          console.log(data);
          this.VAssignSupplierWithProviderId=data.vAssignSupplierWithProviderId;
          console.log(this.VAssignSupplierWithProviderId);
        }, error => {
          this.toastrService.error('Error', 'Booking data saved failed.');
          console.log(error);
        });

          var pnrId=item.pnrData.CreatePassengerNameRecordRS.ItineraryRef.ID;
          this.PnrProvider().push(this.fb.group({
            PnrID:pnrId,
            ProviderId:item.providerId,
            SupplierId:SupplierId
          }));
          getBooking.push({
            Response:"",AirlineCode:item.airlineCode,ProviderID:item.providerId,PnrID:pnrId
          });
          isBookSuccess=true;
        }else{
          isBookSuccess=false;
        }
      }
      if(!isBookSuccess)
          this._bookFail(passengerData);
      else{
        const isBooked=this.httpClient.post<any>(this.authService.flightUrl + 'getBooking',Object.assign({},this.fmgGetBooking.value)).toPromise();
        isBooked.then((bookResponse)=>{
          // console.log("Get Booking");
          // console.log(JSON.stringify(bookResponse));
          // console.log(getBooking);
          // all getBooking response append to the getBooking list
          if(Array.isArray(bookResponse.res))
          {

            for(let item of bookResponse.res)
            {
              for(let flightItem of item.flights)
              {
                let isFind=false;
                for(let bookItem of getBooking)
                {
                  if(bookItem.AirlineCode.indexOf(flightItem.airlineCode)>-1)
                  {
                    bookItem.Response=item;
                    isFind=true;
                    break;
                  }
                }
                if(isFind) break;
              }
            }
          }
          if(getBooking.length>0)
          {
            let  msg = this.getMessageByCode(bookResponse,'ADTK');
            console.log("ADTK");
            console.log(msg);
            this._setBookingFormData(getBooking,this.fmgGetBooking,formData,msg);
          }
        }).catch((err)=>{
          console.log(err+" while get booking..");
        });
      }

    }catch(exp)
    {
      console.log(exp);
    }
  }

  getMessageByCode(data: any, code: string): string | null {
    const specialServices = data.res[0].specialServices;
    const adtkService = specialServices.find((service: any) => service.code === code);

    if (adtkService) {
      return adtkService.message;
    }

    return "Not Found Yet";
  }

  _setStoreBookResponse(data:any,pnr:any)
  {
    let item:any={};
    try{
      item={response:data,pnr:pnr};
      if("bookResponse" in localStorage)
      {
        localStorage.removeItem("bookResponse");
      }
      localStorage.setItem("bookResponse",JSON.stringify(item));
    }catch(exp)
    {

    }
  }
  _bookSuccess(data:any):any[]
  {
    let ret:any=[];
    try{
      // console.log("_bookSuccess");

    }catch(exp){
      console.log(exp);
    }
    return ret;
  }
  _issue(bookingConfirmation:any,fmgGetBook:FormGroup):any
  {
    // console.log("Issues::");
    // console.log(fmgGetBook.value);
    try{
      setTimeout(()=>{
        this.authService.getIssues(Object.assign({},fmgGetBook.value)).subscribe( data=>{

          // console.log("Get Issues");
          // console.log(JSON.stringify(data));

          if(!this.shareService.isObjectEmpty(data.res))
          {
            if("bookingConfirmation" in localStorage)
            {
              localStorage.removeItem("bookingConfirmation");
            }
            localStorage.setItem("bookingConfirmation",JSON.stringify(bookingConfirmation));

            this.toastrService.success("Success","Flight Booking and Issued Successfully");
            this.isBookClicked=false;
            this.router.navigate(['/home/book-success']);
          }else{
            this.toastrService.error("Error!","Something wen't wrong,try again!");
          }
        },error=>{
        });
      },500);
    }catch(exp)
    {

    }
  }
  _bookFail(passengerData:FormGroup)
  {
    try{
      // console.log("Passenger Data::");
      // console.log(passengerData);
      setTimeout(()=>{
        this.authService.saveBookFail(Object.assign({},passengerData.value)).subscribe( data=>{
          // console.log("Book Fail::");
          // console.log(JSON.stringify(data));
          if(data.success)
          {
            this.toastrService.info("info","This flight not booking yet!");
            this.isBookClicked=false;
          }

        },error=>{
        });
      },500);
    }catch(exp)
    {

    }
  }
  RevalidateFlight():FormArray
  {
    return this.fmgRevalidate.get('RevalidateFlight') as FormArray;
  }
  PassengerInfo():FormArray
  {
    return this.fmgPassenger.get('PassengerInfo') as FormArray;
  }
  Booking():FormArray
  {
    return this.fmgBookedPassenger.get('Booking') as FormArray;
  }
  AssignProviderWithBooking():FormArray
  {
    return this.fmgBookedPassenger.get('AssignProviderWithBooking') as FormArray;
  }
  BookingJourney():FormArray
  {
    return this.fmgBookedPassenger.get('BookingJourney') as FormArray;
  }
  BookingFlight():FormArray
  {
    return this.fmgBookedPassenger.get('BookingFlight') as FormArray;
  }
  BookingTraveler():FormArray
  {
    return this.fmgBookedPassenger.get('BookingTraveler') as FormArray;
  }
  AssignJourneyWithTraveler():FormArray
  {
    return this.fmgBookedPassenger.get('AssignJourneyWithTraveler') as FormArray;
  }
  BookingFare():FormArray
  {
    return this.fmgBookedPassenger.get('BookingFare') as FormArray;
  }
  PnrProvider():FormArray
  {
    return this.fmgGetBooking.get('PnrProvider') as FormArray;
  }
  Child(index:number):FormArray
  {
    return this.RevalidateFlight().at(index).get('Child') as FormArray;
  }
  PasAdult(index:number):FormArray
  {
    return this.PassengerInfo().at(index).get('Adult') as FormArray;
  }
  PasAdultSSR(index:number):FormArray
  {
    return this.PassengerInfo().at(index).get('AdultSSR') as FormArray;
  }
  PasChild(index:number):FormArray
  {
    return this.PassengerInfo().at(index).get('Child') as FormArray;
  }
  PasChildSSR(index:number):FormArray
  {
    return this.PassengerInfo().at(index).get('ChildSSR') as FormArray;
  }
  PasInfant(index:number):FormArray
  {
    return this.PassengerInfo().at(index).get('Infant') as FormArray;
  }
  PasFlightSegment(index:number):FormArray
  {
    return this.PassengerInfo().at(index).get('FlightSegment') as FormArray;
  }
  PasInfantSSR(index:number):FormArray
  {
    return this.PassengerInfo().at(index).get('InfantSSR') as FormArray;
  }
  RevalidateFlightSegment(index:number):FormArray
  {
    return this.RevalidateFlight().at(index).get('RevalidateFlightSegment') as FormArray;
  }
  _setBookingFormData(getBookingData:GetBookModel[],fmgGetBook:FormGroup, formData:any, msg:any)
  {
    this.initBookedPassenger();
    try{
      // console.log("_setBookingFormData()");
      // console.log(getBookingData);
      // Follow the text for data store procedure for booking.
      // for provider 1 for passenger(adult) 1 and passenger total fare 1 and passenger type count 1 and trip 3 and flight segment 2
      // Booking	--1 per book static
      // BookingJourney --3 trip
      // BookingFlight --2*3 flight segment * trip
      // BookingTraveler --1(All Trip) passenger
      // BookingFare --1*3 passenger type count * trip
      // AssignProviderWithBooking -- 1*3 passenger total fare * trip
      // AssignJourneyWithTraveler -- 1*3 passenger * trip
      let flCount=0;
      let itinery="";
      for(let bookItem of getBookingData)
      {
        itinery+=bookItem.PnrID+",";
      }



      let gdsTotal:number=0,clientTotal:number=0,agentTotal:number=0;
      let adultFare:FareAmount={
        AmtAgentTotal:0,
        AmtBaseGDS:0,
        AmtBaseClient:0,
        AmtTaxGDS:0,
        AmtTaxClient:0,
        AmtTotalGDS:0,
        AmtTotalClient:0,
        AmtDiscount:0
      };
      let childFare:FareAmount={
        AmtAgentTotal:0,
        AmtBaseGDS:0,
        AmtBaseClient:0,
        AmtTaxGDS:0,
        AmtTaxClient:0,
        AmtTotalGDS:0,
        AmtTotalClient:0,
        AmtDiscount:0
      };
      let infantFare:FareAmount={
        AmtAgentTotal:0,
        AmtBaseGDS:0,
        AmtBaseClient:0,
        AmtTaxGDS:0,
        AmtTaxClient:0,
        AmtTotalGDS:0,
        AmtTotalClient:0,
        AmtDiscount:0
      };
      for(let flightData of this.firstLegData)
      {
         //console.log("this.firstLegData::");
         //console.log(flightData);
         //console.log(this.flightHelper.getAdjustmentDate(flightData.departureDate,flightData.flightSegmentData[1].adjustment,flightData.flightSegmentData[1].arrivalAdjustment).format('DD'));
        let bookItem=getBookingData.find(x=>x.AirlineCode.toString().indexOf(flightData.airlineCode)>-1
        && x.ProviderID==flightData.providerId
        );

        // console.log(bookItem);
        let data=bookItem?.Response;
        let creationDetails=data.creationDetails;
        let cDate=creationDetails.creationDate;
        let cTime=creationDetails.creationTime;
        let dDate=flightData.departureDate;
        let dTime=flightData.departureTime;
        let rDate=flightData.arrivalDate;
        let rTime=flightData.arrivalTime;
        if(this.shareService.isNullOrEmpty(rDate))
        {
          rDate=this.flightHelper.staticDate;
        }
        if(flCount==0)
        {
          this.Booking().push(this.fb.group({
            VBookingManualId:'',
            Id:this.shareService.getUserId(),
            DStartDate:data.startDate,
            DEndDate:data.endDate,
            BIsTicketed:data.isTicketed,
            VFlightTypeId:flightData.tripTypeId,
            VCabinTypeId:flightData.cabinTypeId,
            NvCreationUserSine:creationDetails.creationUserSine,
            DCreationDateTime:this.flightHelper._changeToDateTime(cDate,cTime),
            VPrimeHostId:creationDetails.primeHostId,
            VBookingSupplierWithProviderId:'',
            VItineraryNumber:itinery,
            VAssignSupplierWithProviderId:this.VAssignSupplierWithProviderId,
            VTicketProcessStatusId:'',
            VPlatformId:'',
            BStatus:false,
            NMinimumAmountTobePay:0,
            DPartialPaymentOfferExpiredAt:new Date(),
            DRemainingAmountTobePayAt:new Date(),
            DPartialPaymentOfferAcceptedAt:new Date(),
            NRefundServiceCharge:0,
            NRefundCharge:0,
            DRefundExpiredAt:new Date(),
            DRefundAcceptedAt:new Date(),
            VAirlineRouteEnableMasterId:flightData.airlinesRouteEnableId
          }));
          for(let item of data.flights)
          {
            this.BookingFlight().push(this.fb.group({
              VBookingJourneyId:'',
              VItemId:item.itemId,
              VAirlinesConfirmationId:item.confirmationId,
              NvSourceType:item.sourceType,
              IFlightNumber:item.flightNumber,
              VAirlinesId:item.airlineCode,
              IOperatingFlightNumber:item.operatingFlightNumber,
              VOperatingAirlinesId:item.airlineCode,
              VFromAirportId:item.fromAirportCode,
              VToAirportId:item.toAirportCode,
              DDepartureDateTime:item.departureDate+" "+item.departureTime,
              NvDepartureTerminalName :item.departureTerminalName==undefined || isNaN(item.departureTerminalName)?"":item.departureTerminalName,
              IDepartureGate :item.departureGate==undefined || isNaN(item.departureGare)?0:item.departureGate,
              DArrivalDateTime :item.arrivalDate+" "+item.arrivalTime,
              VCabinTypeId:flightData.cabinTypeId,
              VAircraftId:flightData.airCraftId,
              NvBookingClass:item.cabinTypeCode,
              NvFlightStatusCode:item.flightStatusCode,
              NvFlightStatusName:item.flightStatusName,
              IDurationInMinutes:item.durationInMinutes,
              IDistanceInMiles:item.distanceInMiles,
              NAdultCheckIn:this.shareService.getOnlyNumber(flightData.baggageAdult),
              NAdultCabin:this.shareService.getOnlyNumber(flightData.cabinAdult),
              NChildCheckIn:this.shareService.getOnlyNumber(flightData.baggageChild),
              NChildCabin:this.shareService.getOnlyNumber(flightData.cabinChild),
              NInfantCheckIn:this.shareService.getOnlyNumber(flightData.baggageInfant),
              NInfantCabin:this.shareService.getOnlyNumber(flightData.cabinInfant)
            }));
          }
          for(let trafficItem of this.trafficList)
          {
            this.BookingTraveler().push(this.fb.group({
              VBookingId:'',
              NvGivenName:trafficItem.NvGivenName+" "+trafficItem.VTitle,
              NvSurName:trafficItem.NvSurName,
              VPassengerTypeId:trafficItem.VPassengerTypeId,
              NvDocumentNumber:trafficItem.VPassportNo,
              NvDocumentGivenName:trafficItem.NvGivenName,
              NvDocumentSurName:trafficItem.NvSurName,
              NvDocumentType:'',
              DExpiryDate:trafficItem.VPassportExpiryDate,
              NvIssuingCountryCode:trafficItem.VPassportNationality,
              DBirthDate :trafficItem.VDOB,
              VGenderId :trafficItem.VGenderId,
              NvPassportAttachment :'',
              NvVisaAttachment:'',
              VBookingTravelerReferenceId:''
            }));
          }
        }
        if(flightData.domestic)
        {
          if(flightData.adult>0)
          {
              adultFare.AmtBaseGDS+=Math.round(parseFloat(flightData.fareData.adultBaseGDS));
              adultFare.AmtBaseClient+=Math.round(parseFloat(flightData.fareData.adultBaseClient));
              adultFare.AmtTaxGDS+=Math.round(parseFloat(flightData.fareData.adultTaxGDS));
              adultFare.AmtTaxClient+=Math.round(parseFloat(flightData.fareData.adultTaxClient));
              adultFare.AmtTotalGDS+=Math.round(parseFloat(flightData.fareData.adultTotalGDS));
              adultFare.AmtTotalClient+=Math.round(parseFloat(flightData.fareData.adultTotalClient));
              adultFare.AmtAgentTotal+=Math.round(parseFloat(flightData.fareData.adultAgentFare));
              gdsTotal+=Math.round(parseFloat(flightData.fareData.adultTotalGDS));
              clientTotal+=Math.round(parseFloat(flightData.fareData.adultTotalClient));
              agentTotal+=Math.round(parseFloat(flightData.fareData.adultAgentFare));
          }
          if(flightData.child.length>0)
          {
              childFare.AmtBaseGDS+=Math.round(parseFloat(flightData.fareData.childBaseGDS));
              childFare.AmtBaseClient+=Math.round(parseFloat(flightData.fareData.childBaseClient));
              childFare.AmtTaxGDS+=Math.round(parseFloat(flightData.fareData.childTaxGDS));
              childFare.AmtTaxClient+=Math.round(parseFloat(flightData.fareData.childTaxClient));
              childFare.AmtTotalGDS+=Math.round(parseFloat(flightData.fareData.childTotalGDS));
              childFare.AmtTotalClient+=Math.round(parseFloat(flightData.fareData.childTotalClient));
              childFare.AmtAgentTotal+=Math.round(parseFloat(flightData.fareData.childAgentFare));
              gdsTotal+=Math.round(parseFloat(flightData.fareData.childTotalGDS));
              clientTotal+=Math.round(parseFloat(flightData.fareData.childTotalClient));
              agentTotal+=Math.round(parseFloat(flightData.fareData.childAgentFare));
          }
          if(flightData.infant>0)
          {
              infantFare.AmtBaseGDS+=Math.round(parseFloat(flightData.fareData.infantBaseGDS));
              infantFare.AmtBaseClient+=Math.round(parseFloat(flightData.fareData.infantBaseClient));
              infantFare.AmtTaxGDS+=Math.round(parseFloat(flightData.fareData.infantTaxGDS));
              infantFare.AmtTaxClient+=Math.round(parseFloat(flightData.fareData.infantTaxClient));
              infantFare.AmtTotalGDS+=Math.round(parseFloat(flightData.fareData.infantTotalGDS));
              infantFare.AmtTotalClient+=Math.round(parseFloat(flightData.fareData.infantTotalClient));
              infantFare.AmtAgentTotal+=Math.round(parseFloat(flightData.fareData.infantAgentFare));
              gdsTotal+=Math.round(parseFloat(flightData.fareData.infantTotalGDS));
              clientTotal+=Math.round(parseFloat(flightData.fareData.infantTotalClient));
              agentTotal+=Math.round(parseFloat(flightData.fareData.infantAgentFare));
          }
        }else{
          if(flCount==0)
          {
            if(flightData.adult>0)
            {
                adultFare.AmtBaseGDS+=Math.round(parseFloat(flightData.fareData.adultBaseGDS));
                adultFare.AmtBaseClient+=Math.round(parseFloat(flightData.fareData.adultBaseClient));
                adultFare.AmtTaxGDS+=Math.round(parseFloat(flightData.fareData.adultTaxGDS));
                adultFare.AmtTaxClient+=Math.round(parseFloat(flightData.fareData.adultTaxClient));
                adultFare.AmtTotalGDS+=Math.round(parseFloat(flightData.fareData.adultTotalGDS));
                adultFare.AmtTotalClient+=Math.round(parseFloat(flightData.fareData.adultTotalClient));
                adultFare.AmtAgentTotal+=Math.round(parseFloat(flightData.fareData.adultAgentFare));
                gdsTotal+=Math.round(parseFloat(flightData.fareData.adultTotalGDS));
                clientTotal+=Math.round(parseFloat(flightData.fareData.adultTotalClient));
                agentTotal+=Math.round(parseFloat(flightData.fareData.adultAgentFare));
            }
            if(flightData.child.length>0)
            {
                childFare.AmtBaseGDS+=Math.round(parseFloat(flightData.fareData.childBaseGDS));
                childFare.AmtBaseClient+=Math.round(parseFloat(flightData.fareData.childBaseClient));
                childFare.AmtTaxGDS+=Math.round(parseFloat(flightData.fareData.childTaxGDS));
                childFare.AmtTaxClient+=Math.round(parseFloat(flightData.fareData.childTaxClient));
                childFare.AmtTotalGDS+=Math.round(parseFloat(flightData.fareData.childTotalGDS));
                childFare.AmtTotalClient+=Math.round(parseFloat(flightData.fareData.childTotalClient));
                childFare.AmtAgentTotal+=Math.round(parseFloat(flightData.fareData.childAgentFare));
                gdsTotal+=Math.round(parseFloat(flightData.fareData.childTotalGDS));
                clientTotal+=Math.round(parseFloat(flightData.fareData.childTotalClient));
                agentTotal+=Math.round(parseFloat(flightData.fareData.childAgentFare));
            }
            if(flightData.infant>0)
            {
                infantFare.AmtBaseGDS+=Math.round(parseFloat(flightData.fareData.infantBaseGDS));
                infantFare.AmtBaseClient+=Math.round(parseFloat(flightData.fareData.infantBaseClient));
                infantFare.AmtTaxGDS+=Math.round(parseFloat(flightData.fareData.infantTaxGDS));
                infantFare.AmtTaxClient+=Math.round(parseFloat(flightData.fareData.infantTaxClient));
                infantFare.AmtTotalGDS+=Math.round(parseFloat(flightData.fareData.infantTotalGDS));
                infantFare.AmtTotalClient+=Math.round(parseFloat(flightData.fareData.infantTotalClient));
                infantFare.AmtAgentTotal+=Math.round(parseFloat(flightData.fareData.infantAgentFare));
                gdsTotal+=Math.round(parseFloat(flightData.fareData.infantTotalGDS));
                clientTotal+=Math.round(parseFloat(flightData.fareData.infantTotalClient));
                agentTotal+=Math.round(parseFloat(flightData.fareData.infantAgentFare));
            }
          }
        }
        let arrDate=null;
        console.log(flightData.flightSegmentData);
        if(flightData.flightSegmentData[1]){
          arrDate=this.flightHelper.getAdjustmentDate(flightData.departureDate,flightData.flightSegmentData[1].adjustment,flightData.flightSegmentData[1].arrivalAdjustment).format('YYYY-MM-DD');
        }

        if(arrDate!=null){
          arrDate=this.flightHelper.getAdjustmentDate(flightData.departureDate,flightData.flightSegmentData[1].adjustment,flightData.flightSegmentData[1].arrivalAdjustment).format('YYYY-MM-DD')+" "+flightData.arrivalTime;
        }else{
          arrDate = this.flightHelper.getAdjustmentDate(flightData.arrivalDate,
            flightData.flightSegmentData[flightData.flightSegmentData.length-1].arrivalAdjustment).format('YYYY-MM-DD')+" "+flightData.arrivalTime
        }
        console.log(arrDate);
        this.BookingJourney().push(this.fb.group({
          VBookingId:'',
          VAirportFromId:flightData.departureCityCode,
          VAirportToId:flightData.arrivalCityCode,
          DDepartureDateTime:this.flightHelper.getAdjustmentDate(flightData.departureDate,
            flightData.flightSegmentData[flightData.flightSegmentData.length-1].departureAdjustment).format('YYYY-MM-DD')+" "+flightData.departureTime,
          DArrivalDateTime:arrDate,
          VBookingSupplierWithProviderID:'',
          VItineraryNumber:bookItem?.PnrID,
          VAssignSupplierWithProviderID:this.VAssignSupplierWithProviderId,
          BIsTicketed:data.isTicketed,
          ISerialNo:0,
          iNumberOfFlights:0,
          DTimeLimitGds:flightData.departureDate+" "+flightData.departureTime,
          DTimeLimitFsl:new Date(),
          FlightTimeLimit:msg
        }));

        //fmgAssignJourneyWithTraveler is not used but keep here.
        this.AssignJourneyWithTraveler().push(this.fb.group({
          VAssignJourneyWithTravelerID:'',
          VBookingJourneyID:'',
          VBookingTravelerID:'',
          NvFlightTicketNumber:''
        }));
        flCount++;
      }
      if(this.firstLegData[0].adult>0)
      {
        this.BookingFare().push(this.fb.group({
          VBookingId:'',
          VPassengerTypeId:this.passengerTypeList.find(x=>x.text.toString().trim()=='ADT').id,
          VMarkUpTypeId:this.firstLegFareData[0].markupTypeId,
          NMarkUpPercent:this.firstLegFareData[0].markupPercent,
          VDiscountTypeId:this.firstLegFareData[0].discountTypeId,
          NDiscountPercent:this.firstLegFareData[0].discountTypePercent,
          NGdsbase:adultFare.AmtBaseGDS,
          NGdstax:adultFare.AmtTaxGDS,
          NGdstotal:adultFare.AmtTotalGDS,
          NClientBase:adultFare.AmtBaseClient,
          NClientTax:adultFare.AmtTaxClient,
          NClientTotal:adultFare.AmtTotalClient,
          NAgencyTotal :adultFare.AmtAgentTotal,
          RouteWiseMarkUpDiscountDetailsID: this.item.routeWiseMarkUpDiscountDetailsID,
          TicketIssueType:this.item.ticketIssueType,
          TicketIssueTypeCommission:this.item.ticketIssueTypeCommission
          }));
      }
      if(this.firstLegData[0].child.length>0)
      {
        this.BookingFare().push(this.fb.group({
          VBookingId:'',
          VPassengerTypeId:this.passengerTypeList.find(x=>x.text.toString().trim()=='C').id,
          VMarkUpTypeId:this.firstLegFareData[0].markupTypeId,
          NMarkUpPercent:this.firstLegFareData[0].markupPercent,
          VDiscountTypeId:this.firstLegFareData[0].discountTypeId,
          NDiscountPercent:this.firstLegFareData[0].discountTypePercent,
          NGdsbase:childFare.AmtBaseGDS,
          NGdstax:childFare.AmtTaxGDS,
          NGdstotal:childFare.AmtTotalGDS,
          NClientBase:childFare.AmtBaseClient,
          NClientTax:childFare.AmtTaxClient,
          NClientTotal:childFare.AmtTotalClient,
          NAgencyTotal :childFare.AmtAgentTotal,
          RouteWiseMarkUpDiscountDetailsID: this.item.routeWiseMarkUpDiscountDetailsID,
          TicketIssueType:this.item.ticketIssueType,
          TicketIssueTypeCommission:this.item.ticketIssueTypeCommission
          }));
      }
      if(this.firstLegData[0].infant>0)
      {
        this.BookingFare().push(this.fb.group({
          VBookingId:'',
          VPassengerTypeId:this.passengerTypeList.find(x=>x.text.toString().trim()=='INF').id,
          VMarkUpTypeId:this.firstLegFareData[0].markupTypeId,
          NMarkUpPercent:this.firstLegFareData[0].markupPercent,
          VDiscountTypeId:this.firstLegFareData[0].discountTypeId,
          NDiscountPercent:this.firstLegFareData[0].discountTypePercent,
          NGdsbase:infantFare.AmtBaseGDS,
          NGdstax:infantFare.AmtTaxGDS,
          NGdstotal:infantFare.AmtTotalGDS,
          NClientBase:infantFare.AmtBaseClient,
          NClientTax:infantFare.AmtTaxClient,
          NClientTotal:infantFare.AmtTotalClient,
          NAgencyTotal :infantFare.AmtAgentTotal,
          RouteWiseMarkUpDiscountDetailsID: this.item.routeWiseMarkUpDiscountDetailsID,
          TicketIssueType:this.item.ticketIssueType,
          TicketIssueTypeCommission:this.item.ticketIssueTypeCommission
          }));
      }
      this.AssignProviderWithBooking().push(this.fb.group({
        VAssignProviderWithBookingID:'',
        VAssignSupplierWithProviderId:this.VAssignSupplierWithProviderId,
        VBookingID:'',
        NGDSFare:gdsTotal,
        NClientFare:clientTotal,
        NAgencyFare:agentTotal
      }));
      formData.append('objData',JSON.stringify(this.fmgBookedPassenger.value));
      // console.log("Booked Passenger Value is::");
       console.log(Object.assign({},this.fmgBookedPassenger.value));
      this.authService.saveBookSuccess(formData).subscribe(data=>{
        if(data.success)
        {
          let bookConfirmList:any[]=[];
          for(let bookItem of getBookingData)
          {
            let bItem=bookItem.Response;
            let bookingConfirmation={AirlineCode:bookItem.AirlineCode,ProviderId:bookItem.ProviderID,
              lastTicketDate:bItem.lastTicketDate,lastTicketTime:bItem.lastTicketTime,
              bookDate:bItem.creationDetails.creationDate,bookTime:bItem.creationDetails.creationTime,
              referenceNo:data.data,reservationPNR:bookItem.PnrID,airlinePNR:bItem.flights[0].confirmationId};
              bookConfirmList.push(bookingConfirmation);
          }
          if(this.firstLegData[0].instantEnable)
          {
            this._issue(bookConfirmList,fmgGetBook);
          }else{
              if("bookingConfirmation" in localStorage)
              {
                localStorage.removeItem("bookingConfirmation");
              }
              localStorage.setItem("bookingConfirmation",JSON.stringify(bookConfirmList));
              this.toastrService.success("Success","Flight Booking Successfully");
              this.isBookClicked=false;
              this.router.navigate(['/home/book-success']);
          }
        }
      },err=>{

      });
    }catch(exp){
      console.log(exp);
    }
  }
  _setFormGroupInfo(adult:any,child:any,infant:any)
  {
    var phone=$("#phoneNo").val();
    var email=$("#email").val();
    this.trafficList=[];
    let partyMember=Number.parseInt(adult)+Number.parseInt(child.length);
    this.trafficList=[];
    let index=0;
    if(this.shareService.isObjectEmpty(child))
      child=[];
    for(let item of this.firstLegData)
    {
      this.PassengerInfo().push(this.fb.group({
        PhoneNo:phone,Email:email,UserId:this.UserID,ProviderId:item.providerId,
        LastTicketDate:item.lastTicketDate,LastTicketTime:item.lastTicketTime,
        DepartureDate:item.departureDate,ArrivalDate:item.arrivalDate,
        DepartureTime:item.departureTime,ArrivalTime:item.arrivalTime,
        CabinTypeId:item.cabinTypeId,TripTypeId:item.tripTypeId,AirlineCode:item.airlineCode,
        AgentFare:item.agentFareTotal,ClientFare:item.clientFareTotal,
        AirportCodeFrom:item.departureCityCode,AirportCodeTo:item.arrivalCityCode,
        AirportIdFrom:item.departureCityId, AirportIdTo:item.arrivalCityId,
        AirlineId:item.airlineId,Domestic:item.domestic,
        Adult:new FormArray([]),AdultSSR:new FormArray([]),Child:new FormArray([]),
        ChildSSR:new FormArray([]),Infant:new FormArray([]),InfantSSR:new FormArray([]),
        FlightSegment:new FormArray([])
      }));
      for(let i=0;i<parseInt(adult);i++)
        {
          var adCheck=$("#adultSave"+i).is(':checked');
          var gTitleId=$("#adultGenderTitleId"+i).val();
          // var gId=$("#adultGenderId"+i).val();
          var fName=$("#adultFirstName"+i).val().trim();
          var lName=$("#adultLastName"+i).val().trim();
          var dob=$("#adultDOB"+i).val();
          var ssrCat=$("#adultSSRCat"+i).val();
          var ssrText=$("#adultSSRText"+i).val();
          var ssrRemarks=$("#adultRemarks"+i).val();
          var ssrMillage=$("#adultMillage"+i).val();
          var nationality=$("#adultNationality"+i).val();
          var passport=$("#adultPassport"+i).val();
          var passportExpiry=$("#adultPassportExpiry"+i).val();
          dob=!this.shareService.isNullOrEmpty(dob)?this.shareService.getBdToDb(dob):"";
          nationality=!this.shareService.isNullOrEmpty(nationality)?nationality:"";
          passport=!this.shareService.isNullOrEmpty(passport)?passport:"";
          passportExpiry=!this.shareService.isNullOrEmpty(passportExpiry)?this.shareService.getBdToDb(passportExpiry):"";
          console.log(this.adultPass);
          console.log(this.adultVisa);
          this.PasAdult(index).push(this.fb.group({
            PassengerTypeId:this.passengerTypeList.find(x=>x.text.toString().trim()=='ADT').id,
            PassengerType:'ADT',
            TitleId:gTitleId,
            Title:this.genderTitleListAdult.find(x=>x.ID==gTitleId)?.Name,
            Gender:this.flightHelper._getGenderName(gTitleId,this.maleGenderTitle),
            FirstName:fName,
            LastName:lName,
            DateOfBirth:dob,
            Age:'',
            PassportNationality:nationality,
            PassportNo:passport,
            PassportExpiryDate :passportExpiry,
            PassportAttachment :'',
            VisaAttachment :'',
            SpecialServiceRequestCategory:ssrCat,
            SpecialServiceRequestText:ssrText,
            Remarks:ssrRemarks,
            Millage:ssrMillage,
            isSave:adCheck
          }));
          let trafficData:TrafficModel={
            VTitle:this.genderTitleListAdult.find(x=>x.ID==gTitleId)?.Name,NvGivenName: fName, NvSurName: lName, VGenderId: gTitleId,
            VPassengerTypeId: this.passengerTypeList.find(x => x.text.toString().trim() == 'ADT').id,
            VDOB: dob, VPassportExpiryDate: passportExpiry, VPassportNo: passport, VPassportNationality: nationality,
            VPassportAttachment: '',VVisaAttachment: '',
            VSSRCategory: ssrCat,VSSRText: ssrText,
            VRemarks: ssrRemarks,VMillage: ssrMillage
          };
          if(index==0)
            this.trafficList.push(trafficData);
          if(ssrCat!="" && ssrCat!=undefined  && ssrCat!="0")
          {
            this.PasAdultSSR(i).push(this.fb.group({
              SSR_Code:this.flightHelper._getSSRCode(ssrCat,this.ssrList),
              Text:this.flightHelper._getSSRName(ssrCat,this.ssrList),
              SegmentNumber:"1"
            }));
          }
          if(ssrText!="" && ssrText!=undefined)
          {
            this.PasAdultSSR(i).push(this.fb.group({
              SSR_Code:"",
              Text:ssrText,
              SegmentNumber:"1"
            }));
          }
        }
        for(let i=0;i<child.length;i++)
        {
          var adCheck=$("#childSave"+i).is(':checked');
          var gTitleId=$("#childGenderTitleId"+i).val();
          // var gId=$("#childGenderId"+i).val();
          var fName=$("#childFirstName"+i).val().trim();
          var lName=$("#childLastName"+i).val().trim();
          var dob=$("#childDOB"+i).val();
          var age=$("#childAge"+i).val();
          var ssrCat=$("#childSSRCat"+i).val();
          var ssrText=$("#childSSRText"+i).val();
          var ssrRemarks=$("#childRemarks"+i).val();
          var ssrMillage=$("#childMillage"+i).val();
          var nationality=$("#childNationality"+i).val();
          var passport=$("#childPassport"+i).val();
          var passportExpiry=$("#childPassportExpiry"+i).val();
          dob=!this.shareService.isNullOrEmpty(dob)?this.shareService.getBdToDb(dob):"";
          nationality=!this.shareService.isNullOrEmpty(nationality)?nationality:"";
          passport=!this.shareService.isNullOrEmpty(passport)?passport:"";
          passportExpiry=!this.shareService.isNullOrEmpty(passportExpiry)?this.shareService.getBdToDb(passportExpiry):"";
          this.PasChild(index).push(this.fb.group({
            PassengerTypeId:this.passengerTypeList.find(x=>x.text.toString().trim()=='C').id,
            PassengerType:'C',
            TitleId:gTitleId,
            Title:this.genderTitleListChild.find(x=>x.ID==gTitleId)?.Name,
            Gender:this.flightHelper._getGenderName(gTitleId,this.maleGenderTitle),
            FirstName:fName,
            LastName:lName,
            DateOfBirth:dob,
            Age:age,
            PassportNationality:nationality,
            PassportNo:passport,
            PassportExpiryDate :passportExpiry,
            PassportAttachment :'',
            VisaAttachment :'',
            SpecialServiceRequestCategory:ssrCat,
            SpecialServiceRequestText:ssrText,
            Remarks:ssrRemarks,
            Millage:ssrMillage,
            isSave:adCheck
          }));
          let trafficData:TrafficModel={
            VTitle:this.genderTitleListChild.find(x=>x.ID==gTitleId)?.Name,NvGivenName: fName, NvSurName: lName, VGenderId: gTitleId,
            VPassengerTypeId: this.passengerTypeList.find(x => x.text.toString().trim() == 'C').id,
            VDOB: dob, VPassportExpiryDate: passportExpiry, VPassportNo: passport, VPassportNationality: nationality,
            VPassportAttachment: '',VVisaAttachment: '',
            VSSRCategory: ssrCat,VSSRText: ssrText,
            VRemarks: ssrRemarks,VMillage: ssrMillage
          };
          if(index==0)
            this.trafficList.push(trafficData);
          if(ssrCat!="" && ssrCat!=undefined && ssrCat!="0")
          {
            this.PasChildSSR(index).push(this.fb.group({
              SSR_Code:this.flightHelper._getSSRCode(ssrCat,this.ssrList),
              Text:this.flightHelper._getSSRName(ssrCat,this.ssrList),
              SegmentNumber:""
            }));
          }
          if(ssrText!="" && ssrText!=undefined)
          {
            this.PasChildSSR(index).push(this.fb.group({
              SSR_Code:"",
              Text:ssrText,
              SegmentNumber:""
            }));
          }
        }
        for(let i=0;i<parseInt(infant);i++)
        {
          var adCheck=$("#infantSave"+i).is(':checked');
          var gTitleId=$("#infantGenderTitleId"+i).val();
          // var gId=$("#infantGenderId"+i).val();
          var fName=$("#infantFirstName"+i).val().trim();
          var lName=$("#infantLastName"+i).val().trim();
          var dob=$("#infantDOB"+i).val();
          var ssrCat=$("#infantSSRCat"+i).val();
          var ssrText=$("#infantSSRText"+i).val();
          var ssrRemarks=$("#infantRemarks"+i).val();
          var ssrMillage=$("#infantMillage"+i).val();
          var nationality=$("#infantNationality"+i).val();
          var passport=$("#infantPassport"+i).val();
          var passportExpiry=$("#infantExpiryDate"+i).val();
          dob=!this.shareService.isNullOrEmpty(dob)?this.shareService.getBdToDb(dob):"";
          nationality=!this.shareService.isNullOrEmpty(nationality)?nationality:"";
          passport=!this.shareService.isNullOrEmpty(passport)?passport:"";
          passportExpiry=!this.shareService.isNullOrEmpty(passportExpiry)?this.shareService.getBdToDb(passportExpiry):"";
          this.PasInfant(index).push(this.fb.group({
            PassengerTypeId:this.passengerTypeList.find(x=>x.text.toString().trim()=='INF').id,
            PassengerType:'INF',
            TitleId:gTitleId,
            Title:this.genderTitleListChild.find(x=>x.ID==gTitleId)?.Name,
            Gender:this.flightHelper._getGenderName(gTitleId,this.maleGenderTitle),
            FirstName:fName,
            LastName:lName,
            DateOfBirth:dob,
            Age:'',
            PassportNationality:nationality,
            PassportNo:passport,
            PassportExpiryDate :passportExpiry,
            PassportAttachment :'',
            VisaAttachment :'',
            SpecialServiceRequestCategory:ssrCat,
            SpecialServiceRequestText:ssrText,
            Remarks:ssrRemarks,
            Millage:ssrMillage,
            isSave:adCheck
          }));
          let trafficData:TrafficModel={
            VTitle:this.genderTitleListChild.find(x=>x.ID==gTitleId)?.Name,NvGivenName: fName, NvSurName: lName, VGenderId: gTitleId,
            VPassengerTypeId: this.passengerTypeList.find(x => x.text.toString().trim() == 'INF').id,
            VDOB: dob, VPassportExpiryDate: passportExpiry, VPassportNo: passport, VPassportNationality: nationality,
            VPassportAttachment: '',VVisaAttachment: '',
            VSSRCategory: ssrCat,VSSRText: ssrText,
            VRemarks: ssrRemarks,VMillage: ssrMillage
          };
          if(index==0)
            this.trafficList.push(trafficData);
          if(ssrCat!="" && ssrCat!=undefined && ssrCat!="0")
          {
            this.PasInfantSSR(index).push(this.fb.group({
              SSR_Code:this.flightHelper._getSSRCode(ssrCat,this.ssrList),
              Text:this.flightHelper._getSSRName(ssrCat,this.ssrList),
              SegmentNumber:""
            }));
          }
          if(ssrText!="" && ssrText!=undefined)
          {
            this.PasInfantSSR(index).push(this.fb.group({
              SSR_Code:"",
              Text:ssrText,
              SegmentNumber:""
            }));
          }
        }
      for(let flightItem of item.flightSegmentData)
      {
        let flightDeptDate=this.flightHelper.getAdjustmentDate(item.departureDate,
          flightItem.adjustment,flightItem.departureAdjustment).format(this.flightHelper.formatYYYYMMDD);
        let flightRetDate=this.flightHelper.getAdjustmentDate(item.departureDate,
          flightItem.adjustment,flightItem.arrivalAdjustment).format(this.flightHelper.formatYYYYMMDD);
        this.PasFlightSegment(index).push(
          this.fb.group({
            DepartureDateTime:flightDeptDate+"T"+flightItem.departureTime,
            ArrivalDateTime:flightRetDate+"T"+flightItem.arrivalTime,
            FlightNumber:flightItem.airlineNumber.toString(),
            NumberInParty:partyMember.toString(),
            ResBookDesigCode:flightItem.bookingCode,
            Status:"NN",
            OriginLocation:flightItem.departureAirportCode,
            DestinationLocation:flightItem.arrivalAirportCode,
            MarketingAirlineCode :flightItem.airlineCode,
            MarketingAirlineFlightNumber :flightItem.airlineNumber.toString(),
            AirportIdFrom:item.departureCityId, AirportIdTo:item.arrivalCityId,
            AirlineId:flightItem.airlineId
          })
        );
      }
      index++;
    }
    //list of data domestic one,round,multi,international one,round,multicity for pnr creation
      const formData = new FormData();

      if (this.adultPassSelectedFile.length > 0) {
        this.adultPassSelectedFile.forEach((file, index) => {
          formData.append('adultPassfile', file, file.name);
        });
      }
      if (this.adultVisaSelectedFile.length > 0) {
        this.adultVisaSelectedFile.forEach((file, index) => {
          formData.append('adultVisafile', file, file.name);
        });
      }

      if (this.childPassSelectedFile.length > 0) {
        this.childPassSelectedFile.forEach((file, index) => {
          formData.append('childPassfile', file, file.name);
        });
      }
      if (this.childVisaSelectedFile.length > 0) {
        this.childVisaSelectedFile.forEach((file, index) => {
          formData.append('childVisafile', file, file.name);
        });
      }

      if (this.infantPassSelectedFile.length > 0) {
        this.infantPassSelectedFile.forEach((file, index) => {
          formData.append('infantPassfile', file, file.name);
        });
      }
      if (this.infantVisaSelectedFile.length > 0) {
        this.infantVisaSelectedFile.forEach((file, index) => {
          formData.append('infantVisafile', file, file.name);
        });
      }

      formData.append('PassengerInfo', JSON.stringify(this.fmgPassenger.value));

      //console.log("this.fmgPassenger.value) ::");
      //console.log(Object.assign({},this.fmgPassenger.value.PassengerInfo));
      //console.log(Object.assign({},this.fmgPassenger.value));

      let SupplierId = '2526c355-768d-4bfd-b4b7-0ef4b1eaa4f0';
      if(this.item.supplierID){
        SupplierId = this.item.supplierID;
      }
      console.log(SupplierId);
      formData.append('SupplierId', SupplierId);
      this.authService.getPNRCreation(formData).subscribe( data=>{
          this.setStorePassenger(this.fmgPassenger);
          // console.log(JSON.stringify(data));
          //If created pnr then--->
          var objData=data.res;
          if(!this.shareService.isObjectEmpty(objData))
          {
            for(let item of objData)
            {
              if(item.status=='EnhancedAirBookRQ: DUPLICATE SEGMENT - NOT ALLOWED'){
                this.isBookClicked=false;
                this.toastrService.error('Error', "DUPLICATE SEGMENT, Please flight search again.");
                this.sleep(3000, () => {
                  this.routeToSearchPage();
                });
              }
              else if(item.status=='UC'){
                this.isBookClicked=false;
                this.toastrService.error('Error', "Fare has been changed, Please flight search again.");
                this.sleep(3000, () => {
                  this.routeToSearchPage();
                });
              }
              else{
                formData.delete('PassengerInfo');
                this._bookedYourPassenger(this.fmgPassenger,objData,formData);
              }
            }
          }
          else{
            this.isBookClicked=false;
          }
        },error=>{
     });
  }
  sleep(ms: number, callback: () => void) {
    setTimeout(callback, ms);
  }
  airports: any[]=[];

  routeToSearchPage(){
    debugger;
    let isDomestic=true;
    this.airports = [];
    var loaderData = JSON.parse(localStorage.getItem('loaderData')!);

    let isOneWayValue = "";
    let isRoundtripValue = "";
    let isMulticityValue = "";
    if (loaderData.isOneWay !== undefined) {
        isOneWayValue = loaderData.isOneWay.toString();
    }
    if (loaderData.isRoundTrip !== undefined) {
      isRoundtripValue = loaderData.isRoundTrip.toString();
    }
    if (loaderData.isMultiCity !== undefined) {
      isMulticityValue = loaderData.isMultiCity.toString();
    }

    this.airports = JSON.parse(localStorage.getItem('airportInfo')!);
    let loadData:any=JSON.parse(JSON.stringify(loaderData));
    for(let i=0;i<loadData.Departure.length;i++)
    {
      if(this.getCountryCode(loadData.Departure[i].CityCode)!= this.getCountryCode(loadData.Arrival[i].CityCode))
      {
        isDomestic=false;
        break;
      }
    }
    if(isDomestic)
      {
        if(isOneWayValue=="true")
        {
          this.router.navigate(['/home/domestic-one-way-flight-search']);
        }else if(isRoundtripValue=='true')
        {
          this.router.navigate(['/home/dom-roundtrip']);
        }else if(isMulticityValue=='true')
        {
          this.router.navigate(['/home/dom-multicity']);
        }
      }else{
        if(isOneWayValue=='true')
        {
          this.router.navigate(['/home/international-one-way-flight-search']);
        }else if(isRoundtripValue=='true')
        {
          this.router.navigate(['/home/int-roundtrip']);
        }else if(isMulticityValue=='true')
        {
          this.router.navigate(['/home/int-multicity']);
        }
      }

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

  encodeFileToBase64(file: File): string {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const base64String = reader.result as string;
    const encodedString = base64String ? base64String.split(',')[1] : ''; // Check if base64String is null or undefined
    return encodedString;
  }



  setStorePassenger(data:FormGroup)
  {
    if("passengerDetails" in localStorage)
    {
      localStorage.removeItem("passengerDetails");
    }
    localStorage.setItem("passengerDetails",JSON.stringify(data.value));
  }
  _genderTitleLoad()
  {
    this.genderTitleListAdult=[];
    this.genderTitleListChild=[];
    this.loadedGenderTitleList=[];
    try{
      this.authService.getGenderTitleList().subscribe(data=>{
        for(let item of data.gendertitlelist)
        {
          if(this.onlyChildInfant.includes(item.vGenderTitleId))
          {
            this.genderTitleListChild.push(new GenderTitleModel(item.vGenderTitleId,item.nvGenderTitleName));
          }else{
            this.genderTitleListAdult.push(new GenderTitleModel(item.vGenderTitleId,item.nvGenderTitleName));
          }
          this.loadedGenderTitleList.push(new GenderTitleModel(item.vGenderTitleId,item.nvGenderTitleName));
        }
      });

    }catch(exp)
    {

    }
  }
  passengerInfoChange(id:string,type:string,titleID:string,firstNameID:string,lastNameID:string,birthDateID:string,passportNo:string, passportExpiry:string)
  {

    var val=$("#"+id).val();
    console.log(val);
    type=type.toString().toLowerCase();
    $("#"+titleID).val('');
    $("#"+firstNameID).val('');
    $("#"+lastNameID).val('');
    $("#"+birthDateID).val('');
    $("#"+passportNo).val('');
    $("#"+passportExpiry).val('');

    let objData;
    if(!this.shareService.isNullOrEmpty(val))
    {
      switch(type.toString().toLowerCase())
      {
        case "adult":
          objData=this.passengerInfoListAdult.find(x=>x.InfoID.toString()==val.toString());
          break;
        case "child":
          objData=this.passengerInfoListChild.find(x=>x.InfoID.toString()==val.toString());
          break;
        case "infant":
          objData=this.passengerInfoListInfant.find(x=>x.InfoID.toString()==val.toString());
          break;
      }
      if(objData!=undefined)
      {
        console.log(objData);
        $("#"+titleID).val(objData.TitleID);
        $("#"+firstNameID).val(objData.FirstName);
        $("#"+lastNameID).val(objData.LastName);
        let d=new Date(objData.DateOfBirth);
        $("#"+birthDateID).val(this.shareService.padLeft(d.getDate().toString(),'0',2) + "-" + this.shareService.padLeft((d.getMonth()+1).toString(),'0',2) + "-" + d.getFullYear());
        $("#"+passportNo).val(objData.PassportNumber);
        let ped=new Date(objData.PassportExpiryDate);
        $("#"+passportExpiry).val(this.shareService.padLeft(d.getDate().toString(),'0',2) + "-" + this.shareService.padLeft((ped.getMonth()+1).toString(),'0',2) + "-" + ped.getFullYear());

      }
    }
  }
  _genderLoad()
  {
    this.genderList=[];
    try{
      this.authService.getGenderList().subscribe(data=>{
        // console.log(data);
        for(let item of data.genderlist)
        {
          this.genderList.push(new GenderTitleModel(item.vGenderId,item.nvGenderName));
        }
      });
    }catch(exp){}

  }
  _passengerTypeLoad()
  {
    this.passengerTypeList=[];
    try{
      this.authService.getPassengerType().subscribe(data=>{
        // console.log("Passenger Type list::");
        // console.log(data);
        for(let item of data.passengertypelist)
        {
          this.passengerTypeList.push({'id':item.vPassengerTypeId,'text':item.nvPassengerTypeCode});
        }
      });
    }catch(exp){}

  }

  _passengerInfoLoad()
  {
    this.passengerInfoListAdult=[];
    this.passengerInfoListChild=[];
    this.passengerInfoListInfant=[];
    try{
      for(let aditem of this.storage.getItem("adultList"))
        this.passengerInfoListAdult.push(aditem);
      for(let chitem of this.storage.getItem("childList"))
        this.passengerInfoListChild.push(chitem);
      for(let initem of this.storage.getItem("infantList"))
        this.passengerInfoListInfant.push(initem);

       //console.log("Adult:");
       //console.log(this.storage.getItem("adultList"));
       //console.log(this.storage.getItem("childList"));
       //console.log(this.storage.getItem("infantList"));
    }catch(exp){
      console.log(exp);
    }
  }
  selectedCountry: string | undefined;
  _getCountryList(){
    try{
      this.authService.getCountryList().subscribe(data => {
        // console.log(data);
          this.countrylists = [];
          this.countrylists = data.countrylist;

          this.selectedCountry = this.countrylists.find((item: { nvCountryName: string; }) => item.nvCountryName === 'Bangladesh')?.vCountryId;
      }, err => {
        console.log(err);
      }, () => {
      });
    }catch(exp){}
  }

  _specialServiceLoad()
  {
    this.ssrList=[];
    try{
      this.authService.getSpecialService().subscribe(data=>{
        console.log(data);
        for(let item of data.ssrlist)
        {
          this.ssrList.push({'id':item.vSpecialServiceRequestId,'text':item.nvSpecialServiceRequestCode+'-'+item.nvSpecialServiceRequestName});
        }
      });
    }catch(exp){}
  }
  dateChangeApi(type:boolean=true)
  {
    // console.log("Date changes action1::");
    this.CancellationList=[];
    try{
      let n=0;
      for(let item of this.firstLegData)
      {
        let dateCancel:DateChangeCancelModel={
          providerId: item.providerId,
          departureDate: item.departureDate,
          departureCityCode: item.departureCityCode,
          arrivalCityCode: item.arrivalCityCode,
          airlineCode: item.airlineCode,
          fareBasisCode: item.fareBasisCode,
          flightRouteTypeId: item.flightRouteTypeId,
          tripTypeId: item.tripTypeId
        };
        this.authService.getDateChanges(dateCancel).subscribe(data=>{
          // console.log(JSON.stringify(data));
          // console.log(item);
          this.setResponseText(data.res,data.amount,item.airlineCode,type,item.tripTitle);
      },err=>{

      });
        n+=1;
      }
    }catch(exp){
      console.log(exp);
    }
  }
  dateChangeApiMulti(type:boolean=true)
  {
    // console.log("Date changes action2::");
    try{
      if(!this.shareService.isObjectEmpty(this.item.data1))
      {
        let dateCancel1:DateChangeCancelModel={
          providerId: this.item.data1.providerId,
          departureDate: this.item.data1.departureDate,
          departureCityCode: this.item.data1.departureCityCode,
          arrivalCityCode: this.item.data1.arrivalCityCode,
          airlineCode: this.item.data1.airlineCode,
          fareBasisCode: this.item.data1.fareBasisCode,
          flightRouteTypeId: this.item.data1.flightRouteTypeId,
          tripTypeId: this.item.data1.tripTypeId
        };
        this.authService.getDateChanges(dateCancel1).subscribe(data=>{

          // console.log(JSON.stringify(data));
          this.setResponseText(data.res,data.amount,dateCancel1.airlineCode,type,0);
        },err=>{

        });
      }
      if(!this.shareService.isObjectEmpty(this.item.data2))
      {
        let dateCancel2:DateChangeCancelModel={
          providerId: this.item.data2.providerId,
          departureDate: this.item.data2.departureDate,
          departureCityCode: this.item.data2.departureCityCode,
          arrivalCityCode: this.item.data2.arrivalCityCode,
          airlineCode: this.item.data2.airlineCode,
          fareBasisCode: this.item.data2.fareBasisCode,
          flightRouteTypeId: this.item.data2.flightRouteTypeId,
          tripTypeId: this.item.data2.tripTypeId
        };
        this.authService.getDateChanges(dateCancel2).subscribe(data=>{

          // console.log(JSON.stringify(data));
          this.setResponseText(data.res,data.amount,dateCancel2.airlineCode,type,1);
        },err=>{

        });
      }
      if(!this.shareService.isObjectEmpty(this.item.data3))
      {
        let dateCancel3:DateChangeCancelModel={
          providerId: this.item.data3.providerId,
          departureDate: this.item.data3.departureDate,
          departureCityCode: this.item.data3.departureCityCode,
          arrivalCityCode: this.item.data3.arrivalCityCode,
          airlineCode: this.item.data3.airlineCode,
          fareBasisCode: this.item.data3.fareBasisCode,
          flightRouteTypeId: this.item.data3.flightRouteTypeId,
          tripTypeId: this.item.data3.tripTypeId
        };
        this.authService.getDateChanges(dateCancel3).subscribe(data=>{

          // console.log(JSON.stringify(data));
          this.setResponseText(data.res,data.amount,dateCancel3.airlineCode,type,2);
        },err=>{

        });
      }
      if(!this.shareService.isObjectEmpty(this.item.data4))
      {
        let dateCancel4:DateChangeCancelModel={
          providerId: this.item.data4.providerId,
          departureDate: this.item.data4.departureDate,
          departureCityCode: this.item.data4.departureCityCode,
          arrivalCityCode: this.item.data4.arrivalCityCode,
          airlineCode: this.item.data4.airlineCode,
          fareBasisCode: this.item.data4.fareBasisCode,
          flightRouteTypeId: this.item.data4.flightRouteTypeId,
          tripTypeId: this.item.data4.tripTypeId
        };
        this.authService.getDateChanges(dateCancel4).subscribe(data=>{

          // console.log(JSON.stringify(data));
          this.setResponseText(data.res,data.amount,dateCancel4.airlineCode,type,3);
        },err=>{

        });
      }
    }catch(exp){
      console.log(exp);
    }
  }
  setResponseText(data:any,amount:any,airlineCode:any,type:boolean,way:number=-1)
  {
    try{
      this.authService.getResponseSearchText(airlineCode,type==true?"Date Change":"Cancel").subscribe(subData=>{
        // var d=console.log(data);
        var firstCap="",secondCap="";
        try{
          firstCap=subData.data[0].nvFirstSentence;
          secondCap=subData.data[0].nvLastSentence;
        }catch(exp){}
        if(type==true)
        {
          this.setDateChangesAmount(data,amount,firstCap,secondCap,way);
        }else{
          this.setCancellationAmount(data,amount,firstCap,secondCap,way);
        }
      },err=>{});
    }catch(exp){
      console.log(exp);
    }
  }
  setDateChangesAmount(data:any,amount:any,firstCap:any,lastCap:any,way:number=-1)
  {
    let txtAmt="";
    let txtPost=this.shareService.amountShowWithCommas(Math.round(amount));
    let txtPre="";
    let envData=data["soap-env:Envelope"];
    let envBody=envData["soap-env:Body"];
    try{
      let fareParaList=envBody.OTA_AirRulesRS.FareRuleInfo.Rules.Paragraph;
      let amt="",pre="";

      for(let item of fareParaList)
      {
        if(item.Title.indexOf('PENALTIES')>-1)
        {
          let txt=item.Text.toString().replace(/\s+/g, ' ').trim();
          let crop=txt.substring(txt.indexOf(firstCap)+firstCap.length,txt.indexOf(lastCap));
          crop=crop.toString().trim();
          amt=crop.split(' ')[1];
          pre=crop.split(' ')[0];
        }
      }
      txtAmt=amt;
      txtPre=pre;
    }catch(exp){
      try{
        let fare=envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
        let txt=fare.toString().replace(/\s+/g, ' ').trim();
        let crop=txt.substring(txt.indexOf(firstCap)+firstCap.length,txt.indexOf(lastCap));
        txtAmt=crop.split(' ')[1];
        txtPre=crop.split(' ')[0];
      }catch(exp){}
    }
    this.CancellationList.push({
      Type:"Date",Trip:way,TextAmount:txtAmt,TextPre:txtPre,TextPost:txtPost,Load:false
    });
    // console.log("Date Change test::");
    // console.log(this.CancellationList);
  }
  setCancellationAmount(data:any,amount:any,firstCap:any,lastCap:any,way:number=-1)
  {
    let txtAmt="";
    let txtPost=this.shareService.amountShowWithCommas(Math.round(amount));
    let txtPre="";
    let envData=data["soap-env:Envelope"];
    let envBody=envData["soap-env:Body"];
    try{
      let fareParaList=envBody.OTA_AirRulesRS.FareRuleInfo.Rules.Paragraph;
      let amt="",pre="";

        for(let item of fareParaList)
        {
          if(item.Title.indexOf('PENALTIES')>-1)
          {
           let txt=item.Text.toString().replace(/\s+/g, ' ').trim();
           let crop=txt.substring(txt.indexOf(firstCap)+firstCap.length,txt.indexOf(lastCap));
           crop=crop.toString().trim();
           amt=crop.split(' ')[1];
           pre=crop.split(' ')[0];
          }
        }
        txtAmt=amt;
        txtPre=pre;
    }catch(exp){
      try{
        let fare=envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
        let txt=fare.toString().replace(/\s+/g, ' ').trim();
        let crop=txt.substring(txt.indexOf(firstCap)+firstCap.length,txt.indexOf(lastCap));
        txtAmt=crop.split(' ')[1];
        txtPre=crop.split(' ')[0];
      }catch(exp){}
    }
    this.CancellationList.push({
      Type:"Cancel",Trip:way,TextAmount:txtAmt,TextPre:txtPre,TextPost:txtPost,Load:false
    });
  }
  getDateChanges(refund:boolean,passenger:any,way:number=-1):any
  {
    try{
      let data:CancellationModel={TextAmount:"",TextPost:"",TextPre:"",Trip:-1,Type:"",Load:false};
      for(let item of this.CancellationList)
      {
        if(item.Trip==way && item.Type.indexOf("Date")>-1)
        {
          data.TextAmount=item.TextAmount;
          data.TextPost=item.TextPost;
          data.TextPre=item.TextPre;
          data.Trip=item.Trip;
          data.Type=item.Type;
          break;
        }
      }
      if(refund==false)
      {
        return "Non Refundable + "+data.TextPost+"";
      }else{
        if(this.shareService.isNullOrEmpty(data.TextAmount))
        {
          return "Airline Fee "+" + "+data.TextPost+"";
        }
        return data.TextPre+" "+this.shareService.amountShowWithCommas(Math.round(parseInt(data.TextAmount)*parseInt(passenger)))
        +" + "+data.TextPost+"";
      }
    }catch(exp){}
  }
  getCancellation(refund:boolean,passenger:any,way:number=-1):any
  {
    try{
      let data:CancellationModel={TextAmount:"",TextPost:"",TextPre:"",Trip:-1,Type:"",Load:true};
      for(let item of this.CancellationList)
      {
        if(item.Trip==way && item.Type.indexOf("Cancel")>-1)
        {
          data.TextAmount=item.TextAmount;
          data.TextPost=item.TextPost;
          data.TextPre=item.TextPre;
          data.Trip=item.Trip;
          data.Type=item.Type;
          data.Load=false;
          break;
        }
      }
      if(refund==false)
      {
        return "Non Refundable + "+data.TextPost+"";
      }else{
        if(this.shareService.isNullOrEmpty(data.TextAmount))
        {
          return "Airline Fee "+" + "+data.TextPost+"";
        }
        return data.TextPre+" "+this.shareService.amountShowWithCommas(Math.round(
          parseFloat(data.TextAmount)*parseInt(passenger)))+" + "+data.TextPost+"";
      }
    }catch(exp){}
  }
  getIsLoad(type:string,trip:number):boolean
  {
    let isLoad:boolean=true;
    for(let item of this.CancellationList)
    {
      if(item.Trip==trip && item.Type.indexOf(type)>-1)
      {
        isLoad=item.Load;
        break;
      }
    }
    console.log();
    return isLoad;
  }

  adultPassSelectedFile: File[] = [];

  adultPassOnChangeFile(files: any, adult: any) {
    console.log('adultPass: '+adult);
    const selectedFile = files.target.files[0];
    const renamedFile = new File([selectedFile], 'adultPass'+adult, { type: selectedFile.type });
    this.adultPassSelectedFile.push(renamedFile);
  }


  adultVisaSelectedFile: File[] = [];

  adultVisaOnChangeFile(files: any, adult: any) {
    console.log('adultVisa: '+adult);
    const selectedFile = files.target.files[0];
    const renamedFile = new File([selectedFile], 'adultVisa'+adult, { type: selectedFile.type });
    this.adultVisaSelectedFile.push(renamedFile);
  }

  childPassSelectedFile: File[] = [];

  childPassOnChangeFile(files: any, child: any) {
    console.log('childPass: '+child);
    const selectedFile = files.target.files[0];
    const renamedFile = new File([selectedFile], 'childPass'+child, { type: selectedFile.type });
    this.childPassSelectedFile.push(renamedFile);
  }


  childVisaSelectedFile: File[] = [];

  childVisaOnChangeFile(files: any, child: any) {
    console.log('childVisa: '+child);
    const selectedFile = files.target.files[0];
    const renamedFile = new File([selectedFile], 'childVisa'+child, { type: selectedFile.type });
    this.childVisaSelectedFile.push(renamedFile);
  }

  infantPassSelectedFile: File[] = [];

  infantPassOnChangeFile(files: any, infant: any) {
    console.log('infantPass: '+infant);
    const selectedFile = files.target.files[0];
    const renamedFile = new File([selectedFile], 'infantPass'+infant, { type: selectedFile.type });
    this.infantPassSelectedFile.push(renamedFile);
  }


  infantVisaSelectedFile: File[] = [];

  infantVisaOnChangeFile(files: any, infant: any) {
    console.log('infantVisa: '+infant);
    const selectedFile = files.target.files[0];
    const renamedFile = new File([selectedFile], 'infantVisa'+infant, { type: selectedFile.type });
    this.infantVisaSelectedFile.push(renamedFile);
  }
}
