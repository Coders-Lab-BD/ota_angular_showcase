import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from '../../_services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Select2OptionData } from 'ng-select2';
import { NgbCalendar, NgbDateParserFormatter,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
import { DatePipe, DOCUMENT } from '@angular/common';
import {ShareService} from '../../_services/share.service';
import { Component, ElementRef, Inject, OnInit,HostListener, Renderer2, SystemJsNgModuleLoader, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {Observable, Subject, merge, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import { FlightHelperService } from '../flight-helper.service';
import flatpickr from "flatpickr";
import { DragScrollComponent, DragScrollModule } from 'ngx-drag-scroll';
import Swal from 'sweetalert2';
import { MarkuDiscountModel } from 'src/app/model/marku-discount-model.model';
import { FlightRoutes } from 'src/app/model/flight-routes.model';
import { DateChangeCancelModel } from 'src/app/model/date-change-cancel-model.model';
declare var window: any;
declare var $: any;
declare var $;

@Component({
  selector: 'app-domestic-one-way-flight-search',
  templateUrl: './domestic-one-way-flight-search.component.html',
  styleUrls: ['./domestic-one-way-flight-search.component.css']
})
export class DomesticOneWayFlightSearchComponent implements OnInit {
  urlMain = "./assets/dist/js/main.min.js";

  flightFromModel:any;
  flightToModel:any;

  isInstant: any;

  @ViewChild('flightItem', {read: DragScrollComponent}) flightItem: DragScrollComponent | any;
  @ViewChild('fareItem', {read: DragScrollComponent}) fareItem: DragScrollComponent | any;

  departureDateModel: NgbDateStruct | any;
  showBox = false;
  showModalFareDetails:boolean=false;
  isOneway:boolean=false;
  isMulticity:boolean=false;
  isRoundtrip:boolean=false;
  isAgentFare:boolean=false;
  isNotFound:boolean=false;
  isTravellerFromShow:boolean=true;
  isFromToSame:boolean=false;
  fareSearchSkeleton:boolean=true;
  flightSearchSkeleton:boolean=true;
  topFlightSearchSkeleton:boolean=true;
  isSuggReturnMobile:boolean=false;

  returnDateModel: NgbDateStruct|any;
  returnDay:string="";
  returnMonth:string="";
  returnMonthYear:string="";
  returnYear:string="";
  returnDayName:string="";

  num1 = 0;
  num2 = 0;
  num3 = 0;
  childList:number[]=[];
  childList2:number[]=[];
  childListFinal:number[]=[];
  childSelectList:number[]=[2,3,4,5,6,7,8,9,10,11];

  cDay:number=Number(this.shareService.getDay(""));
  cMonth:number=Number(this.shareService.getMonth(""));
  cYear:number=Number(this.shareService.getYearLong(""));

  deptDate:string|undefined;
  retDate:string|undefined;

  loadAPI: Promise<any> | any;
  groupAirlines:any;
  airlines:any;
  ItineryWiseAirlines:any;
  airports:any;
  paramModelData:any;

  fromFlight:string="";
  toFlight:string="";
  departureDate:string="";
  returnDate:string="";
  adult:string="";
  child:string="";
  infant:string="";
  isLoad:boolean=false;
  cabinTypeId:string="";
  tripTypeId:string="";
  isSuggDeparture:boolean=false;
  isSuggReturn:boolean=false;
  isSuggDepartureMobile:boolean=false;
  providerId:string="";
  public selectedClassTypeId:any="";
  public selectedClassTypeCode:any="";
  public selectedClassTypeName:any="";
  public selectedClassTypeNameMobile:any="";
  public selectedTripTypeId:any="";
  fmgFlightSearchWay: FormGroup|any;
  fmgFlightSearch: FormGroup|any;
  fmgChild:FormArray|any;
  selectTripType:FormControl = new FormControl()
  fmgSearchHistory:FormGroup|any;
  fmgSearchHistoryInfo:FormGroup|any;
  fmgSearchHistoryDetails:FormGroup|any;

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

  selectedAirFilterList:string[]=[];
  selectedDeptTimeList:any[]=[];
  selectedArrTimeList:any[]=[];
  tempFilterItinery:any[]=[];
  udMinRangeVal:number=0;
  stopCountList:any[]=[];
  departureTimeFilter:any[]=[];
  arrivalTimeFilter:any[]=[];
  refundFilterList:boolean[]=[];
  appliedFilter:any[]=[];
  domOneWayData:any[]=[];
  domOneWayDataGroup:any[]=[];
  tempDomOneWayData:any[]=[];
  markupInfo:MarkuDiscountModel[]=[];
  markupDiscountInfo:MarkuDiscountModel[]=[];
  discountInfo:MarkuDiscountModel[]=[];
  cmbAirport:any[]=[];
  cmbAirlines:any[]=[];
  cmbAirCraft:any[]=[];
  bookInstantEnableDisable:any[]=[];
  fareDetailsModalData:any=[];
  flightDetailsModalData:any[]=[];
  makeProposalData:any=[];
  tempAirportsDeparture: any=[];
  tempAirportsArrival: any=[];
  tempDefaultDepArrFlight:any=[];
  popularFilter:any[]=[];
  markupList:any[]=[];

  keywords:string = 'all';
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
  selectedFlightDeparture:FlightRoutes[]=[];
  selectedFlightDeparturePanel:FlightRoutes[]=[];
  selectedFlightArrival:FlightRoutes[]=[];
  selectedFlightArrivalPanel:FlightRoutes[]=[];
  tempAirportsDeparture1: any=[];
  tempAirportsDeparture2: any=[];
  tempAirportsDeparture3: any=[];
  tempAirportsDeparture4: any=[];
  tempAirportsArrival1: any=[];
  tempAirportsArrival2: any=[];
  tempAirportsArrival3: any=[];
  tempAirportsArrival4: any=[];
  tempDefaultDepArrFlight1:any=[];
  tempDefaultDepArrFlight2:any=[];
  tempDefaultDepArrFlight3:any=[];
  tempDefaultDepArrFlight4:any=[];
  isSuggDeparture1:boolean=false;
  isSuggReturn1:boolean=false;
  isSuggDepartureMobile1:boolean=false;
  isSuggDeparture2:boolean=false;
  isSuggReturn2:boolean=false;
  isSuggDepartureMobile2:boolean=false;
  isSuggDeparture3:boolean=false;
  isSuggReturn3:boolean=false;
  isSuggDepartureMobile3:boolean=false;
  isSuggDeparture4:boolean=false;
  isSuggReturn4:boolean=false;
  isSuggDepartureMobile4:boolean=false;
  @ViewChild('suggDeparture1') suggDeparture1:ElementRef|any;
  @ViewChild('suggReturn1') suggReturn1:ElementRef|any;
  @ViewChild('suggDeparture2') suggDeparture2:ElementRef|any;
  @ViewChild('suggReturn2') suggReturn2:ElementRef|any;
  @ViewChild('suggDeparture3') suggDeparture3:ElementRef|any;
  @ViewChild('suggReturn3') suggReturn3:ElementRef|any;
  @ViewChild('suggDeparture4') suggDeparture4:ElementRef|any;
  @ViewChild('suggReturn4') suggReturn4:ElementRef|any;
  @ViewChild('suggDepartureMobile1') suggDepartureMobile:ElementRef|any;
  @ViewChild('suggReturnMobile1') suggReturnMobile:ElementRef|any;
   //--------------multicity/one/round end-------------///

  @ViewChild('returnDatePick') returnDatePick:ElementRef | any;
  @ViewChild('roundTripButton') roundTripButton : ElementRef | any;
  private wasInside = false;
  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
  private router: Router, private httpClient: HttpClient, public toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,public flightHelper:FlightHelperService,private datePipe: DatePipe) {


  }
  //-----------------------------------------------------------------------------------------------------Panel work Start
  initSearchPanel()
  {
    this.selectedFlightDeparture=[];
    this.selectedFlightArrival=[];
    this.selectedFlightDeparturePanel=[];
    this.selectedFlightArrivalPanel=[];
    this.num1=0,this.num2=0,this.num3=0;
    this.cmbAirport=this.flightHelper.getAirportData();
    this.tempAirportsDeparture1=this.cmbAirport.slice(0,15);
    this.tempAirportsArrival1=this.cmbAirport.slice(0,15);
    this.tempAirportsDeparture2=this.cmbAirport.slice(0,15);
    this.tempAirportsArrival2=this.cmbAirport.slice(0,15);
    this.tempAirportsDeparture3=this.cmbAirport.slice(0,15);
    this.tempAirportsArrival3=this.cmbAirport.slice(0,15);
    this.tempAirportsDeparture4=this.cmbAirport.slice(0,15);
    this.tempAirportsArrival4=this.cmbAirport.slice(0,15);

    this.tempDefaultDepArrFlight1=this.cmbAirport.slice(0,15);
    this.paramModelData=this.flightHelper.getLocalFlightSearch();
    this._setPanelSearchHeader(this.paramModelData);
    this.getFlightSearch(this.paramModelData);
    let dept:any={},ret:any={};
    for(let i=0;i<this.paramModelData.Departure.length;i++)
    {
      dept={
        Id:this.paramModelData.Departure[i].Id,
        CityCode:this.paramModelData.Departure[i].CityCode,
        CityName:this.paramModelData.Departure[i].CityName,
        CountryCode:this.paramModelData.Departure[i].CountryCode,
        CountryName:this.paramModelData.Departure[i].CountryName,
        AirportName:this.paramModelData.Departure[i].AirportName,
        AirportCode:"",Date:this.paramModelData.Departure[i].Date};
      ret={
        Id:this.paramModelData.Arrival[i].Id,
        CityCode:this.paramModelData.Arrival[i].CityCode,
        CityName:this.paramModelData.Arrival[i].CityName,
        CountryCode:this.paramModelData.Arrival[i].CountryCode,
        CountryName:this.paramModelData.Arrival[i].CountryName,
        AirportName:this.paramModelData.Arrival[i].AirportName,
        AirportCode:"",Date:this.paramModelData.Arrival[i].Date};
        this.selectedFlightDeparture.push(dept);
        this.selectedFlightDeparturePanel.push(dept);
        this.selectedFlightArrival.push(ret);
        this.selectedFlightArrivalPanel.push(ret);
    }
  }
  trueFalseDeparture()
  {
    this.isSuggDeparture1=false;
    this.isSuggDeparture2=false;
    this.isSuggDeparture3=false;
    this.isSuggDeparture4=false;
  }
  trueFalseArrival()
  {
    this.isSuggReturn1=false;
    this.isSuggReturn2=false;
    this.isSuggReturn3=false;
    this.isSuggReturn4=false;
  }
  addRemoveCity(isDel:boolean=false,delIdx:number=-1)
  {
    try{
      var trip1=$("#trip0").css("display");
      var trip2=$("#trip1").css("display");
      var trip3=$("#trip2").css("display");
      var trip4=$("#trip3").css("display");
      // console.log("Before Departure and Arrival:: isDel:"+isDel+" index:"+delIdx);
      // console.log(this.selectedFlightDeparturePanel);
      // console.log(this.selectedFlightArrivalPanel);
      if(isDel && delIdx>-1)
      {
        this.selectedFlightDeparturePanel.splice(delIdx,1);
        this.selectedFlightArrivalPanel.splice(delIdx,1);
      }else{
        this.selectedFlightDeparturePanel.push({
          Id: '',
          CityCode: '',
          CityName: '',
          CountryCode: '',
          CountryName: '',
          AirportCode: '',
          AirportName: '',
          Date: ''
        });
        this.selectedFlightArrivalPanel.push({
          Id: '',
          CityCode: '',
          CityName: '',
          CountryCode: '',
          CountryName: '',
          AirportCode: '',
          AirportName: '',
          Date: ''
        });
      }
      for(let i=0;i<4;i++) $("#tripAction"+i).css("display","none");
      if((trip1=="block" || trip1=="flex") && (trip2=="block" || trip2=="flex")
      && (trip3=="block" || trip3=="flex") && (trip4=="block" || trip4=="flex"))
      {
        if(isDel)
        {
          $("#trip3").css("display","none");
          $("#tripAction2").css("display","block");
        }else{
          $("#tripAction3").css("display","block");
        }
        setTimeout(()=>{
          flatpickr(".flat-datepick-from3", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date)
          });
        });
      }else if((trip1=="block" || trip1=="flex") && (trip2=="block" || trip2=="flex")
      && (trip3=="block" || trip3=="flex"))
      {
        if(isDel)
        {
          $("#trip2").css("display","none");
          $("#tripAction1").css("display","block");
        }else{
          $("#trip3").css("display","block");
          $("#tripAction3").css("display","block");
          this.selectedFlightDeparturePanel[3].Date=this.selectedFlightDeparturePanel[2].Date;
        }
        setTimeout(()=>{
          flatpickr(".flat-datepick-from2", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date)
          });
          flatpickr(".flat-datepick-from3", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date)
          });
        });
      }else if((trip1=="block" || trip1=="flex") && (trip2=="block" || trip2=="flex"))
      {
        if(isDel)
        {
          $("#trip1").css("display","none");
          $("#tripAction0").css("display","block");
        }else{
          $("#trip2").css("display","block");
          $("#tripAction2").css("display","block");
          this.selectedFlightDeparturePanel[2].Date=this.selectedFlightDeparturePanel[1].Date;
        }
        setTimeout(()=>{
          flatpickr(".flat-datepick-from1", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date)
          });
          flatpickr(".flat-datepick-from2", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date)
          });
        });
      }else if((trip1=="block" || trip1=="flex"))
      {
        $("#trip1").css("display","block");
        $("#tripAction1").css("display","block");
        this.selectedFlightDeparturePanel[1].Date=this.selectedFlightDeparturePanel[0].Date;
        setTimeout(()=>{
          flatpickr(".flat-datepick-from0", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
          });
          flatpickr(".flat-datepick-from1", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
          });
        });
      }else{
        $("#trip0").css("display","block");
        $("#tripAction0").css("display","block");
      }
    }catch(exp){}
  }
  getSelectedDate(i:number,type:string):string
  {
    let ret:string="";
    type=type.toLowerCase();
    try{
      let date="";
      if(type.indexOf("departure")>-1)
      {
        date=this.selectedFlightDeparturePanel[i].Date;
        ret=this.shareService.getDayNameShort(date)+", "+
        this.shareService.getDay(date)+" "+
        this.shareService.getMonthShort(date)+"'"+
        this.shareService.getYearShort(date);
      }else{
        if(!this.isOneway){
          date=this.selectedFlightArrivalPanel[i].Date;
          ret=this.shareService.getDayNameShort(date)+", "+
          this.shareService.getDay(date)+" "+
          this.shareService.getMonthShort(date)+"'"+
          this.shareService.getYearShort(date);
        }
      }
    } catch(exp)
    {}
    return ret;
  }
  changeDepartureReturnDate(evt:any,type:string,ind:number)
  {
      try{
        let val=evt.srcElement.value;
        if(!this.shareService.isNullOrEmpty(val))
        {
          if(type.indexOf("departure")>-1)
          {
            if(ind>-1)
            {
              let selectDate=this.shareService.getBdToDb(val);
              this.selectedFlightDeparturePanel[ind].Date=selectDate;
              let flatInd=ind==0?ind:ind-1;
              setTimeout(()=>{
                flatpickr(".flat-datepick-from"+ind, {
                  enableTime: false,
                  dateFormat: "d-m-Y",
                  allowInput:true,
                  minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[flatInd].Date)
                });
              });
              for(let i=ind+1;i<this.selectedFlightDeparturePanel.length;i++)
              {
                this.selectedFlightDeparturePanel[i].Date=selectDate;
                setTimeout(()=>{
                  flatpickr(".flat-datepick-from"+i, {
                    enableTime: false,
                    dateFormat: "d-m-Y",
                    allowInput:true,
                    minDate:this.shareService.getFlatPickDate(selectDate)
                  });
                });
              }
              // if(Date.parse(this.selectedFlightDeparturePanel[ind].Date)>Date.parse(this.selectedFlightArrivalPanel[ind].Date))
              // {
              //   let d=this.selectedFlightDeparturePanel[ind].Date;
              //   this.selectedFlightArrival[ind].Date=this.shareService.getYearLong(d)+"-"+
              //   this.shareService.padLeft(this.shareService.getMonth(d),'0',2)+"-"+
              //   this.shareService.padLeft(this.shareService.getDay(d),'0',2);
              // }
            }
            if(ind==0)
            {
              flatpickr(".flat-datepick-to", {
                enableTime: false,
                dateFormat: "d-m-Y",
                allowInput:true,
                minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[ind].Date)
              });
            }
          }else{
            let db=this.shareService.getBdToDb(val);
            this.selectedFlightArrivalPanel[ind].Date=
            this.shareService.getDayNameShort(db)+", "+
            this.shareService.getDay(db)+" "+
            this.shareService.getMonthShort(db)+"'"+
            this.shareService.getYearShort(db);
            this.tripTypeSet("2");
          }
        }
        // console.log("Val:"+val);
      }catch(exp){
        console.log(exp);
      }
  }
  getSelectedData(i:number,type:string):string
  {
    let ret:string="Select City";
    type=type.toLowerCase();
    try{
      if(type.indexOf("departure")>-1)
      {
        ret=this.selectedFlightDeparturePanel[i].CityName;
      }else{
        ret=this.selectedFlightArrivalPanel[i].CityName;
      }
      if(this.shareService.isNullOrEmpty(ret)) ret="Select City";
    } catch(exp)
    {}
    return ret;
  }
  flightTo(ind:number)
  {
    try{
      this.trueFalseArrival();
        if(ind==0)
        {
          this.isSuggReturn1=true;
          setTimeout(()=>{
            this.suggReturn1.focus();
          });
        }else if(ind==1)
        {
          this.isSuggReturn2=true;
          setTimeout(()=>{
            this.suggReturn2.focus();
          });
        }else if(ind==2)
        {
          this.isSuggReturn3=true;
          setTimeout(()=>{
            this.suggReturn3.focus();
          });
        }else if(ind==3)
        {
          this.isSuggReturn4=true;
          setTimeout(()=>{
            this.suggReturn4.focus();
          });
        }
    }catch(exp){}
  }
  flightFrom(ind:number)
  {
    try{
      this.trueFalseDeparture();
      if(ind==0)
      {
        this.isSuggDeparture1 = true;
        setTimeout(()=>{
          this.suggDeparture1.focus();
        });
      }else if(ind==1)
      {
        this.isSuggDeparture2 = true;
        setTimeout(()=>{
          this.suggDeparture2.focus();
        });
      }else if(ind==2)
      {
        this.isSuggDeparture3 = true;
        setTimeout(()=>{
          this.suggDeparture3.focus();
        });
      }else if(ind==3)
      {
        this.isSuggDeparture4 = true;
        setTimeout(()=>{
          this.suggDeparture4.focus();
        });
      }
    }catch(exp){}
  }
  flightToOutside(ind:number)
  {
    try{
      if(ind==0)
      {
        this.isSuggReturn1=false;
        this.tempAirportsArrival1=this.tempDefaultDepArrFlight1;
      }else if(ind==1)
      {
        this.isSuggReturn2=false;
        this.tempAirportsArrival2=this.tempDefaultDepArrFlight2;
      }else if(ind==2)
      {
        this.isSuggReturn3=false;
        this.tempAirportsArrival3=this.tempDefaultDepArrFlight3;
      }else if(ind==3)
      {
        this.isSuggReturn4=false;
        this.tempAirportsArrival4=this.tempDefaultDepArrFlight4;
      }
    }catch(exp){}
  }
  flightFromOutside(ind:number)
  {
    try{
      if(ind==0)
      {
        this.isSuggDeparture1=false;
        this.tempAirportsDeparture1=this.tempDefaultDepArrFlight1;
      }else if(ind==1)
      {
        this.isSuggDeparture2=false;
        this.tempAirportsDeparture2=this.tempDefaultDepArrFlight2;
      }else if(ind==2)
      {
        this.isSuggDeparture3=false;
        this.tempAirportsDeparture3=this.tempDefaultDepArrFlight3;
      }else if(ind==3)
      {
        this.isSuggDeparture4=false;
        this.tempAirportsDeparture4=this.tempDefaultDepArrFlight4;
      }
    }catch(exp){}
  }
  exchangeDepartureArrival(i:number)
  {
    let temp:FlightRoutes=this.selectedFlightDeparturePanel[i];
    let tempDeptDate=this.selectedFlightDeparturePanel[i].Date;
    let tempRetDate=this.selectedFlightArrivalPanel[i].Date;
    this.selectedFlightDeparturePanel[i]=this.selectedFlightArrivalPanel[i];
    this.selectedFlightArrivalPanel[i]=temp;
    this.selectedFlightDeparturePanel[i].Date=tempDeptDate;
    this.selectedFlightArrivalPanel[i].Date=tempRetDate;
  }
  returnCrossClick(){
    this.trueFalseSearchType();
    this.clearReturn();
    this.isOneway=true;
    this.tripTypeSet("1");
  }
  tripTypeSet(id:any)
  {
    this.trueFalseSearchType();
    try{
      switch(parseInt(id))
      {
        case 1:
          this.isOneway=true;
          this.selectTripType.setValue(1);
          break;
        case 2:
          this.isRoundtrip=true;
          this.selectTripType.setValue(2);
          break;
        case 3:
          this.isMulticity=true;
          this.selectTripType.setValue(2);
          break;
      }
    }catch(exp){}
  }
  trueFalseSearchType():void
  {
    this.isOneway=false;
    this.isMulticity=false;
    this.isRoundtrip=false;
  }
  clearReturn()
  {
    this.selectedFlightArrival[0].Date="";
    // this.selectedReturnPanelText="";
  }
  tripChange(event:any)
  {
    this.trueFalseSearchType();
    var type=event.target.value;
    type=Number.parseInt(type);
    this.selectedTripTypeId=this.flightHelper.getTripTypeId(type);
    setTimeout(()=>{
      $("#travellersBox").css("display","none");
    });
    switch(type)
    {
      case 1:
        this.isOneway=true;
        this.clearReturn();
        this.selectedFlightDeparture[0].Date=this.getCurrentDate();
        this.selectedFlightArrival[0].Date="";
        this.selectedFlightDeparturePanel[0].Date=this.getCurrentDate();
        this.selectedFlightArrivalPanel[0].Date="";
        $("#travellersBox").css("display","none");
        for(let i=1;i<this.selectedFlightDeparturePanel.length;i++) this.selectedFlightDeparturePanel.splice(i,1);
        for(let i=1;i<this.selectedFlightArrivalPanel.length;i++) this.selectedFlightArrivalPanel.splice(i,1);
        setTimeout(()=>{
          flatpickr(".flat-datepick-from0", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:"today"
          });
          flatpickr(".flat-datepick-to", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparture[0].Date)
          });
        });
        break;
      case 2:
        this.isRoundtrip=true;
        this.selectedFlightDeparture[0].Date=this.getCurrentDate();
        this.selectedFlightArrival[0].Date=this.getCurrentDate();
        this.selectedFlightDeparturePanel[0].Date=this.getCurrentDate();
        this.selectedFlightArrivalPanel[0].Date=this.getCurrentDate();
        for(let i=1;i<this.selectedFlightDeparturePanel.length;i++) this.selectedFlightDeparturePanel.splice(i,1);
        for(let i=1;i<this.selectedFlightArrivalPanel.length;i++) this.selectedFlightArrivalPanel.splice(i,1);
        $("#travellersBox").css("display","none");
        setTimeout(()=>{
          flatpickr(".flat-datepick-from0", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:"today"
          });
          flatpickr(".flat-datepick-to", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparture[0].Date)
          });
        });
        break;
      case 3:
        this.isMulticity=true;
        this.selectedFlightDeparture[0].Date=this.getCurrentDate();
        this.selectedFlightDeparturePanel[0].Date=this.getCurrentDate();
        $("#travellersBox").css("display","none");
        break;
      default:
        break;
    }
  }
  travellerInfoOutside()
  {
    try{
      this.showBox=false;
      // $("#travellersBox").css("display","none");
      // $("#travellersBoxMulti").css("display","none");
      // if($("#travellersBox").css("display")=="block")
      // {
      //   $("#travellersBox").css("display","none");
      // }
      // $("input[name='Travellers_Class'][value='"+this.selectedClassTypeCode+"']").prop('checked', true);
    }catch(exp){}
  }
  travellerFrom(){
    this.showBox=true;
    if($("#travellersBox").css("display")=="none")
    {
      $("#travellersBox").css("display","block");
      for(let i=0;i<=this.childListFinal.length;i++)
      {
        setTimeout(()=>{
          $("#child1"+(i+1)).val(this.childListFinal[i]);
          if(i>5) $("#child2"+(i+1)).val(this.childListFinal[i]);
        });
      }
    }else{
      $("#travellersBox").css("display","none");
    }
  }
  selectEvent(item:any,type:string,i:number) {
    type=type.toString().toLowerCase();
    if(type.indexOf("from")>-1)
    {
      this.selectedFlightDeparturePanel[i].Id=item.id;
      this.selectedFlightDeparturePanel[i].CityCode=item.code;
      this.selectedFlightDeparturePanel[i].CityName=item.cityname;
      this.selectedFlightDeparturePanel[i].CountryCode=item.countrycode;
      this.selectedFlightDeparturePanel[i].CountryName=item.countryname;
      this.selectedFlightDeparturePanel[i].AirportName=item.text;
    }else{
      this.selectedFlightArrivalPanel[i].Id=item.id;
      this.selectedFlightArrivalPanel[i].CityCode=item.code;
      this.selectedFlightArrivalPanel[i].CityName=item.cityname;
      this.selectedFlightArrivalPanel[i].CountryCode=item.countrycode;
      this.selectedFlightArrivalPanel[i].CountryName=item.countryname;
      this.selectedFlightArrivalPanel[i].AirportName=item.text;
    }
  }

  getMultiRoutes():string{
    let ret:string="";
    try{
      let s=this.selectedFlightDeparturePanel[0].CityName,
      e=this.selectedFlightArrivalPanel[this.selectedFlightArrivalPanel.length-1].CityName;
      let mid="";
      for(let i=1;i<this.selectedFlightDeparturePanel.length;i++)
      {
        if(mid.indexOf(this.selectedFlightDeparturePanel[i].CityName)==-1)
        {
          mid+=this.selectedFlightDeparturePanel[i].CityName+",";
        }
      }
      for(let i=0;i<this.selectedFlightArrivalPanel.length-1;i++)
      {
        if(mid.indexOf(this.selectedFlightArrivalPanel[i].CityName)==-1)
        {
          mid+=this.selectedFlightArrivalPanel[i].CityName+",";
        }
      }
      if(!this.shareService.isNullOrEmpty(mid))
      {
        mid=" via "+mid.substring(0,mid.length-1);
      }
      ret=s+" to "+e+mid;
    }catch(exp){}
    return ret;
  }
  onFocused(e:any){
    this.tempAirportsDeparture1=this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0,15);
    this.tempAirportsArrival1=this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0,15);
    this.tempAirportsDeparture2=this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0,15);
    this.tempAirportsArrival2=this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0,15);
    this.tempAirportsDeparture3=this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0,15);
    this.tempAirportsArrival3=this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0,15);
    this.tempAirportsDeparture4=this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0,15);
    this.tempAirportsArrival4=this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0,15);
  }
  onChangeSearch(val: string,type:string,ind:number) {
    try{
      val=val.toLowerCase();
      type=type.toLowerCase();
      let data=this.shareService.distinctList(this.cmbAirport.filter(x=>
        (x.code).toString().toLowerCase().startsWith(val)
        || (x.cityname).toString().toLowerCase().startsWith(val)
        || (x.countryname).toString().toLowerCase().startsWith(val)
        || (x.text).toString().toLowerCase().startsWith(val)
        ));
      if(type.indexOf("from")>-1)
        {
          this.tempAirportsDeparture1=[];
          this.tempAirportsDeparture2=[];
          this.tempAirportsDeparture3=[];
          this.tempAirportsDeparture4=[];
          if(ind==0)
          {
            this.tempAirportsDeparture1=data;
            if(this.tempAirportsDeparture1.length>15)
            {
              this.tempAirportsDeparture1=this.tempAirportsDeparture1.slice(0,15);
            }
          }else if(ind==1)
          {
            this.tempAirportsDeparture2=data;
            if(this.tempAirportsDeparture2.length>15)
            {
              this.tempAirportsDeparture2=this.tempAirportsDeparture2.slice(0,15);
            }
          }else if(ind==2)
          {
            this.tempAirportsDeparture3=data;
            if(this.tempAirportsDeparture3.length>15)
            {
              this.tempAirportsDeparture3=this.tempAirportsDeparture3.slice(0,15);
            }
          }else if(ind==3)
          {
            this.tempAirportsDeparture4=data;
            if(this.tempAirportsDeparture4.length>15)
            {
              this.tempAirportsDeparture4=this.tempAirportsDeparture4.slice(0,15);
            }
          }
        }else{
          this.tempAirportsArrival1=[];
          this.tempAirportsArrival2=[];
          this.tempAirportsArrival3=[];
          this.tempAirportsArrival4=[];
          if(ind==0)
          {
              this.tempAirportsArrival1=data;
              if(this.tempAirportsArrival1.length>15)
              {
                this.tempAirportsArrival1=this.tempAirportsArrival1.slice(0,15);
              }
          }else if(ind==1)
          {
            this.tempAirportsArrival2=data;
              if(this.tempAirportsArrival2.length>15)
              {
                this.tempAirportsArrival2=this.tempAirportsArrival2.slice(0,15);
              }
          }else if(ind==2)
          {
            this.tempAirportsArrival3=data;
              if(this.tempAirportsArrival3.length>15)
              {
                this.tempAirportsArrival3=this.tempAirportsArrival3.slice(0,15);
              }
          }else if(ind==3)
          {
            this.tempAirportsArrival4=data;
              if(this.tempAirportsArrival4.length>15)
              {
                this.tempAirportsArrival4=this.tempAirportsArrival4.slice(0,15);
              }
          }
        }
    }catch(exp){}
  }

  topMulticitySection()
  {
    if(this.isMulticityTopSection)
    {
      this.isMulticityTopSection=false;
    }else{
      this.isMulticityTopSection=true;
      let len=this.selectedFlightDeparture.length;
      setTimeout(()=>{
        for(let i=0;i<len;i++)
        {
          flatpickr(".flat-datepick-from"+i, {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparture[i].Date)
          });
        }
      });
      for(let i=0;i<len;i++)
      {
        setTimeout(()=>{
          $("#trip"+i).css("display","block");
          $("#tripAction"+i).css("display","none");
        });
      }
      switch(len)
      {
        case 1:
          setTimeout(()=>{
            $("#tripAction0").css("display","block");
          });
        break;
        case 2:
          setTimeout(()=>{
            $("#tripAction1").css("display","block");
          });
        break;
        case 3:
          setTimeout(()=>{
            $("#tripAction2").css("display","block");
          });
        break;
        case 4:
          setTimeout(()=>{
            $("#tripAction3").css("display","block");
          });
        break;
      }
    }
  }

  flightSearchWork():void
  {
    $("#travellersBox").css("display","none");
    let multiDeparture:any[]=[];
    let multiArrival:any[]=[];
    for(let i=0;i<this.selectedFlightDeparturePanel.length;i++)
    {
      multiDeparture.push({
        Id:this.selectedFlightDeparturePanel[i].Id,
        CityCode:this.selectedFlightDeparturePanel[i].CityCode,
        CityName:this.selectedFlightDeparturePanel[i].CityName,
        CountryCode:this.selectedFlightDeparturePanel[i].CountryCode,
        CountryName:this.selectedFlightDeparturePanel[i].CountryName,
        AirportName:this.selectedFlightDeparturePanel[i].AirportName,
        Date:this.selectedFlightDeparturePanel[i].Date
      });
    }
    for(let i=0;i<this.selectedFlightArrivalPanel.length;i++)
    {
      multiArrival.push({
        Id:this.selectedFlightArrivalPanel[i].Id,
        CityCode:this.selectedFlightArrivalPanel[i].CityCode,
        CityName:this.selectedFlightArrivalPanel[i].CityName,
        CountryCode:this.selectedFlightArrivalPanel[i].CountryCode,
        CountryName:this.selectedFlightArrivalPanel[i].CountryName,
        AirportName:this.selectedFlightArrivalPanel[i].AirportName,
        Date:this.datePipe.transform(this.selectedFlightArrivalPanel[i].Date, 'yyyy-MM-dd')
      });
    }
    let loaderData={Departure:multiDeparture,Arrival:multiArrival,adult:this.num1,
      childList:this.childListFinal,infant:this.num3,classType:this.selectedClassTypeCode,airlines:"",stop:2,
      cabinTypeId:this.selectedClassTypeId,tripTypeId:this.flightHelper.getTripTypeId(this.isOneway?1:this.isRoundtrip?2:3),
      childList1:this.childList,childList2:this.childList2,
      isOneWay:this.isOneway,isRoundTrip:this.isRoundtrip,isMultiCity:this.isMulticity
    };
    // console.log(loaderData);
    this._setStoreFlightData(loaderData,true);
  }
  private _setStoreFlightData(data:any,isSave:boolean)
  {
      let isDomestic=true;
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
      if(isSave)
      {
        this.saveFlightSearchHistory(data,isDomestic);
      }else{
        this._navigationWork(isDomestic);
      }
  }
  saveFlightSearchHistory(data:any,isDomestic:boolean)
  {
      try
      {
        let loadData:any=JSON.parse(JSON.stringify(data));
        let airlinesId=this.airlines.find((x: { id: any; })=>x.id==data.airlines);
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
            IChildAge:item.age
          }));
        }
        let toId="";
        let toReturnDate="";
        if(this.isMulticity)
        {
          toId=loadData.Arrival[loadData.Arrival.length-1].Id;
        }else{
          toId=loadData.Arrival[0].Id;
          toReturnDate=data.returnDate;
        }

        this.fmgSearchHistoryInfo=this.fmgSearchHistory.get('FlightSearchHistory') as FormData;
        this.fmgSearchHistoryInfo.patchValue({
          Id:this.shareService.getUserId(),
          DSearchDate:new Date(),
          VAirportIdfrom:this.selectedFlightDeparture[0].Id,
          VAirportIdto:toId,
          DDepartureDate:this.selectedFlightDeparture[0].Date,
          DReturnDate:toReturnDate,
          VFlightTypeId:data.tripTypeId,
          VCabinTypeId:data.cabinTypeId,
          INumberAdult:data.adult,
          INumberChild:data.childList.length,
          INumberInfant:data.infant,
          VAirlinesId:airlinesId,
          VFlightStopId:this.flightHelper.getFlightStopId(data.stop),
          VFareTypeId:this.flightHelper.getFareTypeId(1)
        });
        this.authService.saveFlightSearchHistory(Object.assign({},this.fmgSearchHistory.value)).subscribe( subData=>{

          if(subData.success)
          {
              this._navigationWork(isDomestic);
          }
        },err=>{
        });
      }catch(exp)
      {
        console.log(exp);
      }
  }
  save(){
    this.showBox=false;
    $("#travellersBox").css("display","none");
  }
  childSelect(val:any,i:number)
  {
    try{
      this.childListFinal[i]=parseInt(val);
    }catch(exp){}
  }
  changeClassLabel(code:string)
  {
    try{
      this.selectedClassTypeCode=code;
      this.selectedClassTypeId=this.flightHelper.getCabinTypeId(code);
      this.selectedClassTypeName=this.flightHelper.getCabinTypeName(code);
      let x=this._getTotalTravellers()+"Travellers,"+this.selectedClassTypeName;
      if(x.length>18)
      {
        let y=this._getTotalTravellers()+"Travellers,";
        this.selectedClassTypeName=this.selectedClassTypeName.toString().substring(0,18-y.length)+"..";
      }
    }catch(exp){}
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
                this.childListFinal.splice(this.num2-1,1);
                this.num2--;
              }
              break;
            case 2:
              if(this.num2>7)
              {
                this.childList=this.shareService.removeList(this.num2,this.childList);
                this.childListFinal.splice(this.num2-1,1);
                this.num2--;
              }
              break;
            case 3:
              while(6<this.num2)
              {
                this.childList=this.shareService.removeList(this.num2,this.childList);
                this.childListFinal.splice(this.num2-1,1);
                this.num2--;
              }
              break;
            case 4:
              while(5<this.num2)
              {
                this.childList=this.shareService.removeList(this.num2,this.childList);
                this.childListFinal.splice(this.num2-1,1);
                this.num2--;
              }
              break;
            case 5:
              while(4<this.num2)
              {
                this.childList=this.shareService.removeList(this.num2,this.childList);
                this.childListFinal.splice(this.num2-1,1);
                this.num2--;
              }
              break;
            case 6:
              while(3<this.num2)
              {
                this.childList=this.shareService.removeList(this.num2,this.childList);
                this.childListFinal.splice(this.num2-1,1);
                this.num2--;
              }
              break;
            case 7:
              while(2<this.num2)
              {
                this.childList=this.shareService.removeList(this.num2,this.childList);
                this.childListFinal.splice(this.num2-1,1);
                this.num2--;
              }
              break;
              break;
            case 8:
              while(1<this.num2)
              {
                this.childList=this.shareService.removeList(this.num2,this.childList);
                this.childListFinal.splice(this.num2-1,1);
                this.num2--;
              }
              break;
              break;
            case 9:
              while(0<this.num2)
              {
                this.childList=this.shareService.removeList(this.num2,this.childList);
                this.childListFinal.splice(this.num2-1,1);
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
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                }else{
                  this.num2--;
                }
                break;
              case 2:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                }else{
                  this.num2--;
                }
                break;
              case 3:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                }else{
                  this.num2--;
                }
                break;
              case 4:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                }else{
                  this.num2--;
                }
                break;
              case 4:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                }else{
                  this.num2--;
                }
                break;
              case 5:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                }else{
                  this.num2--;
                }
                break;
              case 6:
                this.num2++;
                if(this.num1-(this.num1-1)==this.num2)
                {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                }else{
                  this.num2--;
                }
                break;
            }
          }else if(this.num2>=6 && this.num2<9)
          {
            this.num2++;
            this.childList2.push(this.num2);
            this.childListFinal.push(2);
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
            this.childList=this.shareService.removeList(this.num2,this.childList);
            this.childListFinal.splice(this.num2-1,1);
            this.num2--;
          }else{
            this.childList2=this.shareService.removeList(this.num2,this.childList2);
            this.childListFinal.splice(this.num2-1,1);
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
  }
  private _navigationWork(isDomestic:boolean):void
  {
      if(isDomestic)
      {
        if(this.isOneway)
        {
          this.router.navigate(['/home/domestic-one-way-flight-search']);
          window.location.reload();
        }else if(this.isRoundtrip)
        {
          this.router.navigate(['/home/dom-roundtrip']);
        }else if(this.isMulticity)
        {
          this.router.navigate(['/home/dom-multicity']);
        }
      }else{
        if(this.isOneway)
        {
          this.router.navigate(['/home/international-one-way-flight-search']);
        }else if(this.isRoundtrip)
        {
          this.router.navigate(['/home/int-roundtrip']);
        }else if(this.isMulticity)
        {
          this.router.navigate(['/home/int-multicity']);
        }
      }
  }
  _getTotalTravellers():number{
    return this.num1+this.num2+this.num3;
  }
  private _setPanelSearchHeader(data:any)
  {
    try{
      this.isOneway=data.isOneWay;
      this.isRoundtrip=data.isRoundTrip;
      this.isMulticity=data.isMultiCity;
      this.childListFinal=data.childList;
      this.childList=data.childList1;
      this.childList2=data.childList2;
      this.num1=data.adult;
      this.num2=data.childList.length;
      this.num3=data.infant;
      this.selectedClassTypeId=data.cabinTypeId;
      this.selectedClassTypeCode=data.classType;
      this.selectedClassTypeName=this.flightHelper.getCabinTypeName(data.classType);
      let tripVal=this.isOneway?"1":(this.isRoundtrip?"2":"3");
      this.selectTripType.setValue(tripVal);
      this.selectedTripTypeId=this.flightHelper.getTripTypeId(parseInt(tripVal));
      $("#travellersBox").hide();
      for(let i=0;i<this.paramModelData.Departure.length;i++)
      {
        this.selectedFlightDeparture[i].CityName=data.Departure[i].CityName;
        this.selectedFlightDeparture[i].CountryCode=data.Departure[i].CountryCode;
        this.selectedFlightDeparture[i].CountryName=data.Departure[i].CountryName;
        this.selectedFlightDeparture[i].AirportName=data.Departure[i].AirportName;

        this.selectedFlightDeparturePanel[i].CityName=data.Departure[i].CityName;
        this.selectedFlightDeparturePanel[i].CountryCode=data.Departure[i].CountryCode;
        this.selectedFlightDeparturePanel[i].CountryName=data.Departure[i].CountryName;
        this.selectedFlightDeparturePanel[i].AirportName=data.Departure[i].AirportName;

        this.selectedFlightArrival[i].CityName=data.Arrival[i].CityName;
        this.selectedFlightArrival[i].CountryCode=data.Arrival[i].CountryCode;
        this.selectedFlightArrival[i].CountryName=data.Arrival[i].CountryName;
        this.selectedFlightArrival[i].AirportName=data.Arrival[i].AirportName;
        this.selectedFlightArrivalPanel[i].CityName=data.Arrival[i].CityName;
        this.selectedFlightArrivalPanel[i].CountryCode=data.Arrival[i].CountryCode;
        this.selectedFlightArrivalPanel[i].CountryName=data.Arrival[i].CountryName;
        this.selectedFlightArrivalPanel[i].AirportName=data.Arrival[i].AirportName;

        if(i==0 && this.isRoundtrip)
        {
          this.selectedFlightArrival[i].Date=data.Arrival[i].Date;
        }
      }
      setTimeout(()=>{
        flatpickr(".flat-datepick-from0", {
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
        });
      });
    }catch(exp){}
  }
  farePanelWiseSearch(data:any)
  {
    try{
      var model=JSON.parse(localStorage.getItem('loaderData')!);
      this.selectedFlightDeparture[0].Date=data.departureDate;
      model.Departure[0].Date=data.departureDate;
      if(this.isRoundtrip)
      {
        if(Date.parse(data.departureDate)>Date.parse(model.Arrival[0].Date))
        {
          let d=new Date(model.Arrival[0].Date);
          model.Arrival[0].Date=d.getFullYear()+"-"+this.shareService.padLeft(d.getMonth()+"",'0',2)+"-"+
          this.shareService.padLeft(d.getDate()+"",'0',2)
        }
        this.selectedFlightArrival[0].Date=model.Arrival[0].Date;
      }
      this.getFlightSearch(model);
    }catch(exp){
      console.log(exp);
    }
  }
  FlightSearch():FormArray
  {
    return this.fmgFlightSearch.get('FlightSearch') as FormArray;
  }
  ChildList(index:number):FormArray
  {
    return this.FlightSearch().at(index).get('childList') as FormArray;
  }
  private _setFormGroupInfo(data:any)
  {
    let tripTypeId=this.isOneway?1:this.isRoundtrip?2:3;
    for(let i=0;i<data.Departure.length;i++)
    {
      this.FlightSearch().push(this.fb.group({fromFlight:data.Departure[i].CityCode,toFlight:data.Arrival[i].CityCode,
        departureDate:data.Departure[i].Date,returnDate:"",adult:data.adult,
        infant:data.infant,classType:data.classType,airlines:data.airlines,stop:data.stop,
        userId:localStorage.getItem('uid'),
        providerId:data.providerId,
        airlinesOperating:"",
        airlinesMarketing:"",
        airlinesNumber:0,
        domestic:false,
        cabinTypeId:this.flightHelper.getCabinTypeId(data.classType),
        tripTypeId:this.flightHelper.getTripTypeId(tripTypeId),
        childList:new FormArray([])
      }));
      for(let item of data.childList) this.ChildList(i).push(new FormControl(item));
    }
  }
  //-----------------------------------------------------------------------------------------------------------------------Panel work end
  ngOnInit(): void {
    $("#travellersBox").css("display", "none");


    $(window).resize(function () {
      if (window.innerWidth >= 1200) {
      $('#searchbarEditModal').modal('hide');
        $('#mobileFilter').modal('hide');
        $('#travellersMobile').modal('hide');
      }
    });

    this.renderer.removeClass(this.document.body, 'mat-typography');
    this.renderer.addClass(this.document.body, 'flight_search_details');

    this.loadAPI = new Promise(resolve => {
      this.loadScript();
    });
    this.init();
    this.getAgencyPermission();
  }
  getMarkupTypeList()
  {
    try{
      this.authService.getMarkupList().subscribe(data => {

        for(let item of data.markuplist)
        {
          this.markupList.push(item);
        }

        }, err => {
        console.log(err);
      });
    }catch(exp)
    {

    }
  }
  getAgencyPermission()
  {
    var userId=this.shareService.getUserId();
    try{
      this.authService.getAgencyPermit(userId).subscribe(data => {
        if(data.data)
        {
          this.initSearchPanel();
          this.getMarkupTypeList();
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
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'flight_search_details');
  }
  init()
  {
    this.fmgFlightSearch=this.fb.group({
      FlightSearch:new FormArray([])
    });
    this._initSearchHistoryForm();
    this._initBoringTools();
    $("#travellersBox").css("display","none");
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
  _initBoringTools(date:string="")
  {
    // $('.select2').select2();
    flatpickr(".flat-datepick-from0", {
      enableTime: false,
      dateFormat: "d-m-Y",
      allowInput:true,
      minDate:"today"
    });
    flatpickr(".flat-datepick-to", {
      enableTime: false,
      dateFormat: "d-m-Y",
      allowInput:true,
      minDate:this.shareService.getFlatPickDate(date)
    });
    $("#travellersBox").hide();
  }
  getAdjustmentDate(date:any,adj:any,adjSegement:any=undefined):any{
    let ret:any="";
    try{
      adj=adj!=undefined && adj!="" && !isNaN(adj)?adj:0;
      adjSegement=adjSegement!=undefined && adjSegement!="" && !isNaN(adjSegement)?adjSegement:0;
      adj+=adjSegement;
      let addedDate=moment(date).add(adj, 'days');
      ret=addedDate;
    }catch(exp){}
    return ret;
  }
  getAdjustmentDateTime(date:any,adj:any,deptime:any,arrtime:any):any{
    let ret:any="";
    try{
      adj=adj!=undefined && adj!="" && !isNaN(adj)?adj:0;
      let addedDate;
      if(adj == 0){
        if(deptime < arrtime){
          addedDate=moment(date);
        }else if (deptime >= arrtime){
          if(adj == 0){
            adj = 1;
          }
          addedDate=moment(date).add(adj, 'days');
        }
      }else{
        addedDate=moment(date).add(adj, 'days');
      }
      // adjSegement=adjSegement!=undefined && adjSegement!="" && !isNaN(adjSegement)?adjSegement:0;
      // adj+=adjSegement;
      ret=addedDate;
    }catch(exp){}
    return ret;
  }
  bookAndHoldAction(ind:any)
  {
    var model=JSON.parse(localStorage.getItem('loaderData')!);
    var amount = parseInt(model.amount);
    let flightIndi=this.domOneWayData.find(x=>x.id===ind);
    if(amount >= flightIndi.agentFareTotal && this.isInstant == true){
      // console.log("Clicked Book Data:");
      // console.log(flightIndi);
      if("flightDataIndividual" in localStorage)
      {
        localStorage.removeItem("flightDataIndividual");
      }
      if("tripRegion" in localStorage)
      {
        localStorage.removeItem("tripRegion");
      }
      localStorage.setItem("flightDataIndividual",JSON.stringify(flightIndi));
      localStorage.setItem("tripRegion",this.flightHelper.domestic);
      this.router.navigate(['/home/passenger-details']);
    }else if(this.isInstant != true){
      // console.log("Clicked Book Data:");
      // console.log(flightIndi);
      if("flightDataIndividual" in localStorage)
      {
        localStorage.removeItem("flightDataIndividual");
      }
      if("tripRegion" in localStorage)
      {
        localStorage.removeItem("tripRegion");
      }
      localStorage.setItem("flightDataIndividual",JSON.stringify(flightIndi));
      localStorage.setItem("tripRegion",this.flightHelper.domestic);
      this.router.navigate(['/home/passenger-details']);
    }
    else{
      this.toastrService.warning("warning","You have not enough money to Issue this Ticket");
    }

  }
  bookAndHoldAction1(ind:any,provider:any)
  {
    var model=JSON.parse(localStorage.getItem('loaderData')!);
    var amount = parseInt(model.amount);
    let flightIndi=this.domOneWayData.find(x=>x.id===ind && x.providerName===provider);
    if(amount >= flightIndi.agentFareTotal && this.isInstant == true){
      // console.log("Clicked Book Data:");
      // console.log(flightIndi);
      if("flightDataIndividual" in localStorage)
      {
        localStorage.removeItem("flightDataIndividual");
      }
      if("tripRegion" in localStorage)
      {
        localStorage.removeItem("tripRegion");
      }
      localStorage.setItem("flightDataIndividual",JSON.stringify(flightIndi));
      localStorage.setItem("tripRegion",this.flightHelper.domestic);
      this.router.navigate(['/home/passenger-details']);
    }else if(this.isInstant != true){
      // console.log("Clicked Book Data:");
      // console.log(flightIndi);
      if("flightDataIndividual" in localStorage)
      {
        localStorage.removeItem("flightDataIndividual");
      }
      if("tripRegion" in localStorage)
      {
        localStorage.removeItem("tripRegion");
      }
      localStorage.setItem("flightDataIndividual",JSON.stringify(flightIndi));
      localStorage.setItem("tripRegion",this.flightHelper.domestic);
      this.router.navigate(['/home/passenger-details']);
    }
    else{
      this.toastrService.warning("warning","You have not enough money to Issue this Ticket");
    }

  }
  flightFromMobile()
  {
    try{
      this.isSuggDepartureMobile=true;
      setTimeout(()=>{
        this.suggDepartureMobile.focus();
      },50);
    }catch(exp){}
  }
  flightFromOutsideMobile()
  {
    try{
      this.isSuggDepartureMobile=false;
      this.tempAirportsDeparture=this.tempDefaultDepArrFlight;
    }catch(exp){}
  }
  flightToOutsideMobile()
  {
    try{
      this.isSuggReturnMobile=false;
      this.tempAirportsArrival=this.tempDefaultDepArrFlight;
    }catch(exp){}
  }
  flightToMobile()
  {
    try{
      this.isSuggReturnMobile=true;
      setTimeout(()=>{
        this.suggReturnMobile.focus();
      });
    }catch(exp){}
  }
  fareTypeChange(event:any)
  {
    this.isAgentFare=event.target.checked;

  }
  getCurrentDate():any
  {
    return this.shareService.getYearLong()+"-"+
    this.shareService.padLeft(this.shareService.getMonth(),'0',2)+"-"+this.shareService.padLeft(this.shareService.getDay(),'0',2);
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
    getCountryCode(id:string):string
    {
      let ret:string="";
      try{
        var data=this.cmbAirport.find(x=>x.code.toString().toLowerCase()==id.trim().toLowerCase());
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
        var data=this.cmbAirport.find(x=>x.code.toString().toLowerCase()==id.toString().toLowerCase());
        if(data!="" && data!=undefined)
        {
          ret=data.countryname;
        }
      }catch(exp){}
      return ret;
    }
    getCountryNameById(id:string):string
    {
      let ret:string="";
      try{
        var data=this.cmbAirport.find(x=>x.masterId.toString().toLowerCase()==id.toString().toLowerCase());
        if(data!="" && data!=undefined)
        {
          ret=data.countryname;
        }
      }catch(exp){}
      return ret;
    }
    getCityName(id:string):string
    {
      let ret:string="";
      try{
        var data=this.cmbAirport.find(x=>x.code.toString().toLowerCase()==id.toString().toLowerCase());
        if(data!="" && data!=undefined)
        {
          ret=data.cityname;
        }
      }catch(exp){}
      return ret;
    }

    getSelectedAirCode(id:string):string
    {
      let ret:string="";
      try{
        var data=this.cmbAirport.find(x=>x.masterId.toString().toLowerCase()==id.toString().toLowerCase());
        if(data!="" && data!=undefined)
        {
          ret=data.id;
        }
      }catch(exp){}
      return ret;
    }
    getAirCraftName(id:string):string
    {
      let ret:string="";
      try{
        var data=this.cmbAirCraft.find(x=>x.code.toString().toLowerCase()==id.trim().toLowerCase());
        if(data!="" && data!=undefined)
        {
          ret=data.text;
        }
      }catch(exp){}
      return ret;
    }
  fromFlightSearch(e:any)
  {
    $("#fromFlightSearch").hide();
    $("#fromFlightCityName").show();
    if(e!=undefined && e.item!=undefined)
    {
      $("#fromFlightCityName").text(e.item.cityname+', '+e.item.countryname);
      $("#fromFlightCityDetails").text(e.item.code+', '+e.item.text);
    }

  }
  toFlightSearch(e:any)
  {
    $("#toFlightSearch").hide();
    $("#toFlightCityName").show();
    if(e!=undefined && e.item!=undefined)
    {
      $("#toFlightCityName").text(e.item.cityname+', '+e.item.countryname);
      $("#toFlightCityDetails").text(e.item.code+', '+e.item.text);
    }
  }
  search: OperatorFunction<string, readonly {text:string, id:string}[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.getFindedValue(term))
    );
  }
  roundtripFrom() {
    $("#fromFlightCityName").hide();
    $("#fromFlightSearch").show();
    $("#fromFlightSearch").focus();
  }
  roundtripTo() {
    $("#toFlightCityName").hide();
    $("#toFlightSearch").show();
    $("#toFlightSearch").focus();
  }
  onClickedOutside() {

    $("#fromFlightSearch").hide();
    $("#fromFlightCityName").show();
    $("#fromFlightCityDetails").show();
    $("#toFlightSearch").hide();
    $("#toFlightCityName").show();
    $("#toFlightCityDetails").show();
    this.setPanelHeadDepartureArrival();
  }
  setPanelHeadDepartureArrival()
  {
    var fromSearch=$("#fromFlightSearch").val();
    var toSearch=$("#toFlightSearch").val();
    if(fromSearch!="" && fromSearch!=undefined)
    {
      var data=this.cmbAirport.find(x=>x.code==fromSearch);
      if(data!=undefined && data!="")
      {
        $("#fromFlightCityName").text(data.cityname+', '+data.countryname);
      }
    }else{
      $("#fromFlightCityName").text("Delhi, India");
    }
    if(toSearch!="" && toSearch!=undefined)
    {
      var data=this.cmbAirport.find(x=>x.code==toSearch);
      if(data!=undefined && data!="")
      {
        $("#toFlightCityName").text(data.cityname+', '+data.countryname);
      }
    }else{
      $("#toFlightCityName").text("Bangalore, India");
    }
  }
  travellerFromMobile(){
    $("#travellersMobile").modal('show');
  }
  applyMobile(){
    $("#travellersMobile").modal('hide');
  }
  departureDateToggle()
  {
    $("#departureDate").css("display","block");
    $("#departureDate").toggle();
  }
  getFindedValue(term:string):any
  {
    let data:any[];
    if(this.cmbAirport.find(x=>x.code.toLowerCase().indexOf(term.toLowerCase()) > -1))
    {
      data=this.cmbAirport.filter(v => (v.code).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    }else if(this.cmbAirport.find(x=>x.text.toLowerCase().indexOf(term.toLowerCase()) > -1))
    {
      data=this.cmbAirport.filter(v => (v.text).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    }else if(this.cmbAirport.find(x=>x.cityname.toLowerCase().indexOf(term.toLowerCase()) > -1))
    {
      data=this.cmbAirport.filter(v => (v.cityname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    }else if(this.cmbAirport.find(x=>x.countryname.toLowerCase().indexOf(term.toLowerCase()) > -1))
    {
      data=this.cmbAirport.filter(v => (v.countryname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    }
    else{
      data=this.cmbAirport.filter(v => (v.countryname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    }
    return data;
  }
   _getAirCraftList() {

    this.authService.getAircraftInfo().subscribe(data => {
      // console.log("Aircraft test::");
      // console.log(data);
      this.cmbAirCraft = [];
      data.aircraftlist.forEach((aircraft: {vAircraftId:any,nvAircraftCode:any,nvAircraftName:any }) => {
        this.cmbAirCraft.push({
          id: aircraft.vAircraftId,
          code: aircraft.nvAircraftCode,
          text: aircraft.nvAircraftName,
        });
      });

      }, err => {
      console.log(err);
    });
  }
   _getAirlineList() {
    this.authService.getAirlineInfo().subscribe(data => {
      this.cmbAirlines = [];

        data.airlinelist.forEach((airline: { vAirlinesId:any,nvIataDesignator: any; nvAirlinesName: any;vLogo:any; }) => {
          this.cmbAirlines.push( {
            masterId:airline.vAirlinesId,
            id: airline.nvIataDesignator,
            text: airline.nvAirlinesName,
            logo:airline.vLogo
          });
        });
      }, err => {
      console.log(err);
    });
  }
  getCountry(id:any):string
  {
    let ret:string="";
    try{
      for(let item of this.cmbAirport)
      {
        if(item.code==id)
        {
          ret=item.countryname;
        }
      }
    }catch(exp){}
    return ret;
  }
  getCity(id:any):string
  {
    let ret:string="";
    try{
      for(let item of this.cmbAirport)
      {
        if(item.code==id)
        {
          ret=item.cityname;
        }
      }
    }catch(exp){}
    return ret;
  }
  getAirportName(id:any):string
  {
    let ret:string="";
    try{
      for(let item of this.cmbAirport)
      {
        if(item.code==id)
        {
          ret=item.text;
        }
      }
    }catch(exp){}
    return ret;
  }
  getAirportNameById(id:any):string
  {
    let ret:string="";
    try{
      for(let item of this.cmbAirport)
      {
        if(item.masterId.toString().toLowerCase()==id.toString().toLowerCase())
        {
          ret=item.text;
        }
      }
    }catch(exp){}
    return ret;
  }

  getFlightSearch(modelData:any) {
    this._getAirCraftList();


    setTimeout(() => {
      this._initBoringTools(this.selectedFlightDeparture[0].Date);
      if(!this.shareService.isObjectEmpty(modelData))
      {
        var data=JSON.parse(JSON.stringify(modelData));
        this.isLoad=false;
        this._setLoaderValue(data);
        this._setFormGroupInfo(data);
        this.fareSearchSkeleton=true;
        this.topFlightSearchSkeleton=true;
        // console.log("Flight search dynamic::");
        // console.log(Object.assign({},this.fmgFlightSearch.value));
        try{
          this.authService.getFlightSearch(Object.assign({},this.fmgFlightSearch.value)).subscribe( data=>{
            this.topFlightSearchSkeleton=false;

            var data=data.data[0];

            let isNF=0;
            // console.log("Flight data::");
            // console.log(JSON.stringify(data));
            if(data!="" && data!=undefined && data!={} && data!=[])
            {
                this.providerId=data.providerId;
                if(data.fareData!="" && data.fareData!=undefined)
                {
                  this.itineraryGroups=data.fareData[0].groupedItineraryResponse.itineraryGroups;
                  this.fareSearchSkeleton=false;
                }
                if(data.flightData!="" && data.flightData!=undefined)
                {
                  if(data.flightData[0].groupedItineraryResponse!='' && data.flightData[0].groupedItineraryResponse!=undefined)
                  {
                    if(data.flightData[0].groupedItineraryResponse.statistics.itineraryCount>0)
                    {
                      isNF=1;
                      this.isNotFound=false;
                      var getData=data.flightData[0].groupedItineraryResponse;
                      this.rootData=getData;
                      var itinery=getData.itineraryGroups[0].itineraries;
                      this.itineraries=itinery;
                      this.scheduleDescs=this.rootData.scheduleDescs;
                      this.legDescs=this.rootData.legDescs;
                      this._setMarkupDiscountDetails(data);
                    }
                  }
                }
            }
            if(isNF==0)
            {
              this.isNotFound=true;
            }
            this.isLoad=false;
          },error=>{
          });
        }catch(exp){
          this.isNotFound=true;
        }
      }
    }, 1000);
  }
  private _setBookInstantEnableDisable(data:any)
  {
    for(let item of data.bookInfo[0])
    {
      let data={AirlineId:"",AirlineRouteEnableId:item.airlinesRouteEnableId,ProviderId:item.providerId,
      AirlineCode:item.airlineCode,AirlineName:item.airlineName,isBook:item.isBook,isInstant:item.isInstant};
      this.bookInstantEnableDisable.push(data);
    }
    if(this.bookInstantEnableDisable.length>0)
    {
      this._flightWork();
      this._getAirlineList();
    }else{
      this.isNotFound=true;
    }
  }
  private _setMarkupDiscountDetails(data:any)
  {
    this.markupInfo=[];
    this.markupDiscountInfo=[];
    this.discountInfo=[];
    for(let markItem of data.markupInfo)
    {
      for(let item of markItem)
      {
        let data={AirlineId:"",AirlineCode:item.airlineCode,
        AirlineName:"",Type:item.type,Percent:item.percent,CalculationType:item.calculationType,providerId:item.providerId, nvProviderName: item.nvProviderName, calculationType:item.calculationType, supplierID:item.supplierID,assignSupplierWithProviderID:item.assignSupplierWithProviderID}
        this.markupInfo.push(data);
      }
    }
    for(let markItem of data.markupDiscountInfo)
    {
      for(let item of markItem)
      {
        let data={AirlineId:"",AirlineCode:item.airlineCode,
        AirlineName:"",Type:item.type,Percent:item.percent,CalculationType:item.calculationType,providerId:item.providerId, nvProviderName: item.nvProviderName, calculationType:item.calculationType, supplierID:item.supplierID,assignSupplierWithProviderID:item.assignSupplierWithProviderID, discountType:item.discountType,discountPercent:item.discountPercent,routeWiseMarkUpDiscountDetailsID:item.routeWiseMarkUpDiscountDetailsID,ticketIssueType:item.ticketIssueType,ticketIssueTypeCommission:item.ticketIssueTypeCommission }
        this.markupDiscountInfo.push(data);
      }
    }
    for(let discountItem of data.discountInfo)
    {
      for(let item of discountItem)
      {
        let data={AirlineId:"",AirlineCode:item.airlineCode,
        AirlineName:"",Type:item.type,Percent:item.percent,CalculationType:item.calculationType,providerId:item.providerId, nvProviderName: item.nvProviderName, calculationType:item.calculationType, supplierID:item.supplierID,assignSupplierWithProviderID:item.assignSupplierWithProviderID}
        this.discountInfo.push(data);
      }
    }
    // console.log("Markup Info and Discount Info::");
    // console.log(this.markupInfo);
    // console.log(this.discountInfo);
    if(this.markupInfo.length>0 && this.discountInfo.length>0)
    {
      this._setBookInstantEnableDisable(data);
      for(let item of data.bookInfo[0]){
        this.isInstant = item.isInstant;
      }
    }else{
      this.isNotFound=true;
    }
  }
  _flightWork()
  {
    this._getAirCraftList();
    this.setAirlineList(this.scheduleDescs);
  }

  filterFlightSearch()
  {
    this.tempDomOneWayData=this.domOneWayData;
    let minRange=this._minimumRange();
    let maxRange=this.udMinRangeVal;
    let stopList: number[]=[];
    let deptTimeFilter:string[]=[];
    let arrTimeFilter:string[]=[];

    var airlineFilter=this.selectedAirFilterList;

    for(let item of this.stopCountList)
    {
      var id=$("#stopId"+item.id).is(":checked");
      if(id)
      {
        let stop=isNaN(this.shareService.getOnlyNumber(item.title))?0:this.shareService.getOnlyNumber(item.title);
        stopList.push(stop);
      }
    }
    let isRefund: boolean | undefined=undefined;
    if($("#chkRefundYes").is(":checked"))
    {
      isRefund=true;
    }
    if($("#chkRefundNo").is(":checked"))
    {
      isRefund=false;
    }
    for(let item of this.selectedDeptTimeList)
    {
      deptTimeFilter.push(item.text);
    }
    for(let item of this.selectedArrTimeList)
    {
      arrTimeFilter.push(item.text);
    }


    if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && deptTimeFilter.length>0 && arrTimeFilter.length>0
      && airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && deptTimeFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && deptTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }
    else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(stopList.length>0 && isRefund!=undefined && deptTimeFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }
    else if(stopList.length>0 && isRefund!=undefined&& deptTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(isRefund!=undefined&& deptTimeFilter.length>0 && arrTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund;
      });
    }else if(maxRange!=0 && stopList.length>0 && deptTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(maxRange!=0 && stopList.length>0 && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(maxRange!=0 && stopList.length>0 && airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(stopList.length>0 && isRefund!=undefined&& deptTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(stopList.length>0 && isRefund!=undefined&& arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(stopList.length>0 && isRefund!=undefined&& airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(isRefund!=undefined&& deptTimeFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(isRefund!=undefined&& deptTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(deptTimeFilter.length>0 && arrTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }//two
    else if(maxRange!=0 && stopList.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && stopList.indexOf(i.stop)>-1;
      });
    }else if(maxRange!=0 && isRefund!=undefined)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && i.refundable==isRefund;
      });
    }else if(maxRange!=0 && deptTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(maxRange!=0 && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(maxRange!=0 && airlineFilter.length>0 )
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <=maxRange)
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(stopList.length>0 && isRefund!=undefined)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund;
      });
    }else if(stopList.length>0 && deptTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(stopList.length>0 && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(stopList.length>0 && airlineFilter.length>0){
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(isRefund!=undefined&& deptTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(isRefund!=undefined&& arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return i.refundable==isRefund
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(isRefund!=undefined&& airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return i.refundable==isRefund
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(deptTimeFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(deptTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return deptTimeFilter.indexOf(i.departureTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(airlineFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
        return arrTimeFilter.indexOf(i.arrivalTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else {
      if(maxRange!=0)
      {
        this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <=maxRange);
        });
      }
      else if(stopList.length>0)
      {
        this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
          return stopList.indexOf(i.stop)>-1;
        });
      }else if(isRefund!=undefined)
      {
        this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
          return i.refundable==isRefund;
        });
      }else if(deptTimeFilter.length>0)
      {
        this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
          return deptTimeFilter.indexOf(i.departureTime)>-1;
        });
      }else if(arrTimeFilter.length>0)
      {
        this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
          return arrTimeFilter.indexOf(i.arrivalTime)>-1;
        });
      }else if(airlineFilter.length>0)
      {
        this.tempDomOneWayData=this.tempDomOneWayData.filter(function(i, j) {
          return airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }else{
        this.setTempFilterData();
      }
    }

  }
  _getGroupFareAmount(data:any):any
  {
    let ret:number=0;
    try{
      ret=data!=undefined && data!="" && !isNaN(data)?data:0;
    }catch(exp){}
    return ret;
  }
  _getGroupPassengerTotalFare(data:any,passenger:any):any
  {
    let ret:any="";
    try{
      for(let item of data)
      {
        if(item.passengerInfo.passengerType.indexOf(passenger)>-1)
        {
          ret=item.passengerInfo.passengerTotalFare;
        }
      }
    }catch(exp){}
    return ret;
  }
  _getGroupPassengerEquivalent(data:any,passenger:any):number
  {
    let ret:number=0;
    try{
      let dataInfo=this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data),passenger).equivalentAmount;
      if(dataInfo!=undefined && dataInfo!="")
      {
        ret=parseInt(dataInfo);
      }
    }catch(exp){}
    return ret;
  }
  _getGroupPassengerTax(data:any,passenger:any):number
  {
    let ret:number=0;
    try{
      let dataInfo=this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data),passenger).totalTaxAmount;
      if(dataInfo!=undefined && dataInfo!="")
      {
        ret=parseInt(dataInfo);
      }
    }catch(exp){}
    return ret;
  }
  _getGroupPassengerTotal(data:any,passenger:any):number
  {
    let ret:number=0;
    try{
      let dataInfo=this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data),passenger).totalFare;
      if(dataInfo!=undefined && dataInfo!="")
      {
        ret=parseInt(dataInfo);
      }
    }catch(exp){}
    return ret;
  }
  _getGroupPassengerInfoList(data:any):any
  {
    let ret:any="";
    try{
      ret=data.itineraries[0].pricingInformation[0].fare.passengerInfoList;
    }catch(exp){}
    return ret;
  }

  setFlightData()
  {
      try{
        this.flightSearchSkeleton=false;
        this.domOneWayData=[];
        this.domOneWayDataGroup=[];
        let adultMember=this.adult;
        let childListMember=this.FlightSearch().value[0].childList;
        let infantMember=this.infant;
        if(childListMember==undefined) childListMember=[];
        for(let item of this.itineraryGroups)
        {
          let adultBase=this._getGroupPassengerEquivalent(item,'ADT');
          let adultTax=this._getGroupPassengerTax(item,'ADT');
          let adultTotal=this._getGroupPassengerTotal(item,'ADT');

          let childBase=this._getGroupPassengerEquivalent(item,'C');
          let childTax=this._getGroupPassengerTax(item,'C');
          let childTotal=this._getGroupPassengerTotal(item,'C');

          let infantBase=this._getGroupPassengerEquivalent(item,'INF');
          let infantTax=this._getGroupPassengerTax(item,'INF');
          let infantTotal=this._getGroupPassengerTotal(item,'INF');
          let validatingAirCode=item.itineraries[0].pricingInformation[0].fare.validatingCarrierCode;

          let clientFareTotal=this.flightHelper._getMarkupTotalPrice(this.markupInfo,
            adultBase,adultTax,adultTotal,adultMember,validatingAirCode)+
          this.flightHelper._getMarkupTotalPrice(this.markupInfo,childBase,childTax,
            childTotal,childListMember.length,validatingAirCode)+
          this.flightHelper._getMarkupTotalPrice(this.markupInfo,infantBase,infantTax,
            infantTotal,infantMember,validatingAirCode);
          clientFareTotal = Math.round(clientFareTotal);

          this.domOneWayDataGroup.push({
            fareInfo:item.groupDescription.legDescriptions[0],
            clientFare:clientFareTotal,
          });

        }
        for(let itiItem of this.itineraries)
        {
          let ref:number=Number.parseInt(itiItem.legs[0].ref)-1;
          let depRef=this._schedules(ref)[0].ref-1;
          let arrRef=this._schedules(ref)[this._schedules(ref).length-1].ref-1;
          let airlineCode=this._airlinesCode(depRef);
          
          let itiItem1=[itiItem];

          // Merge flight data with markup & discount data
          const mergedData = itiItem1.map((f: any) => {
            const matchingDiscounts = this.markupDiscountInfo.filter(discount =>
              discount.providerId === this.providerId && discount.AirlineCode === airlineCode
            );
            return matchingDiscounts.map(discount => ({ ...f, ...discount }));
          }).flat();

          console.log(mergedData);
        for(let itiItem of mergedData)
        {
          let rootHours=0,rootMinutes=0;
          let airlineName=this._airlinesName(depRef);
          let departureTime=this._timeDeparture(depRef);
          let arrivalTime=this._timeArrival(arrRef);
          let airlineNumber=this._carrier(depRef).marketingFlightNumber;
          let airCraftCode=this._equipment(depRef).code;
          let airCraftName=this.getAirCraftName(this._equipment(depRef).code);
          let departureCityCode=this._departure(depRef).airport;
          let arrivalCityCode=this._arrival(arrRef).airport;
          let departureCity=this.getDepCityName(this._departure(depRef).airport);
          let arrivalCity=this.getArrCityName(this._arrival(arrRef).airport);
          let differenceTime=this._difference(this._timeDeparture(depRef),this._timeArrival(arrRef));

          let adultBase=this._passengerInfoTotalFareAdult(itiItem.id).equivalentAmount;
          let adultTax=this._passengerInfoTotalFareAdult(itiItem.id).totalTaxAmount;
          let adultTotal=this._passengerInfoTotalFareAdult(itiItem.id).totalFare;
          let adultmarkup = Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,adultBase,0,0,1));
          let adultDiscount=0;
          if(adultmarkup>0){
            adultDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,adultmarkup,adultTax,adultTotal,adultMember,airlineCode));
          }else{
            adultDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,adultBase,adultTax,adultTotal,adultMember,airlineCode));
          }
          let childBase=this._passengerInfoTotalFareChild(itiItem.id).equivalentAmount;
          let childTax=this._passengerInfoTotalFareChild(itiItem.id).totalTaxAmount;
          let childTotal=this._passengerInfoTotalFareChild(itiItem.id).totalFare;
          let childmarkup = Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,childBase,0,0,1));
          let childDiscount=0;
          if(childmarkup>0){
            childDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,childmarkup,adultTax,adultTotal,adultMember,airlineCode));
          }else{
            childDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,childBase,childTax,childTotal,childListMember.length,airlineCode));              
          }
          let infantBase=this._passengerInfoTotalFareInfant(itiItem.id).equivalentAmount;
          let infantTax=this._passengerInfoTotalFareInfant(itiItem.id).totalTaxAmount;
          let infantTotal=this._passengerInfoTotalFareInfant(itiItem.id).totalFare;
          let infantmarkup = Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,infantBase,0,0,1));
          let infantDiscount=0;
          if(infantmarkup>0){
            infantDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,infantmarkup,adultTax,adultTotal,adultMember,airlineCode));
          }else{
            infantDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,infantBase,infantTax,infantTotal,infantMember,airlineCode));
          }
          adultBase=adultBase!=undefined && adultBase!="" && !isNaN(adultBase)?adultBase:0;
          adultTax=adultTax!=undefined && adultTax!="" && !isNaN(adultTax)?adultTax:0;
          adultTotal=adultTotal!=undefined && adultTotal!=""  && !isNaN(adultTotal)?adultTotal:0;
          adultDiscount=adultDiscount!=undefined  && !isNaN(adultDiscount)?adultDiscount:0;

          childBase=childBase!=undefined && childBase!=""  && !isNaN(childBase)?childBase:0;
          childTax=childTax!=undefined && childTax!=""  && !isNaN(childTax)?childTax:0;
          childTotal=childTotal!=undefined && childTotal!=""  && !isNaN(childTotal)?childTotal:0;
          childDiscount=childDiscount!=undefined  && !isNaN(childDiscount)?childDiscount:0;

          infantBase=infantBase!=undefined && infantBase!=""  && !isNaN(infantBase)?infantBase:0;
          infantTax=infantTax!=undefined && infantTax!=""  && !isNaN(infantTax)?infantTax:0;
          infantTotal=infantTotal!=undefined && infantTotal!=""  && !isNaN(infantTotal)?infantTotal:0;
          infantDiscount=infantDiscount!=undefined  && !isNaN(infantDiscount)?infantDiscount:0;

          let adultClientTotal=Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,adultBase,adultTax,adultTotal,adultMember));

          let childClientTotal=Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,childBase,childTax,childTotal,childListMember.length));

          let infantClientTotal=Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,infantBase,infantTax,infantTotal,infantMember));

          let adultAgentTotal=adultClientTotal-(adultDiscount*parseFloat(adultMember));
          let childAgentTotal=childClientTotal-(childDiscount*parseFloat(childListMember.length));
          let infantAgentTotal=infantClientTotal-(infantDiscount*parseFloat(infantMember));

          this.tripTypeId=this.getTripTypeId();
          this.domOneWayData.push({
            id:itiItem.id,
            providerId:this.providerId,
            providerName:itiItem.nvProviderName,
            supplierID:itiItem.supplierID,
            routeWiseMarkUpDiscountDetailsID:itiItem.routeWiseMarkUpDiscountDetailsID,
            ticketIssueType:itiItem.ticketIssueType,
            ticketIssueTypeCommission:itiItem.ticketIssueTypeCommission,
            tripTypeId:this.tripTypeId,
            cabinTypeId:this.cabinTypeId,
            airlineLogo:this.getAirlineLogo(airlineCode),
            airlineName:airlineName,
            airlineCode:airlineCode,
            airlineId:this.getAirlineId(airlineCode),
            airlineNumber:airlineNumber,
            airCraftId:this.getAircraftId(airCraftCode),
            airCraftCode:airCraftCode,
            airCraftName:airCraftName,
            departureDate:this.selectedFlightDeparture[0].Date,
            arrivalDate:this.selectedFlightDeparture[0].Date,
            departureTime:departureTime,
            arrivalTime:arrivalTime,
            departureCityId:this.selectedFlightDeparture[0].Id,
            departureCityCode:departureCityCode,
            departureCity:departureCity,
            arrivalCityId:this.selectedFlightArrival[0].Id,
            arrivalCityCode:arrivalCityCode,
            arrivalCity:arrivalCity,
            differenceTime:differenceTime,
            adult:adultMember,
            child:childListMember,
            infant:infantMember,
            stop:0,
            stopAllCity:'',
            domestic:true,
            depadjustment:0,
            adjustment:0,
            arradjustment:0,
            flightRouteTypeId:this.flightHelper.flightRouteType[0],
            lastTicketDate:this._fare(itiItem.id).lastTicketDate,
            lastTicketTime:this._fare(itiItem.id).lastTicketTime,
            baggageAdult:this._pieceOrKgsAdult(itiItem.id),
            baggageChild:this._pieceOrKgsChild(itiItem.id),
            baggageInfant:this._pieceOrKgsInfant(itiItem.id),
            cabinAdult:this._passengerCabinAdult(itiItem.id),
            cabinChild:this._passengerCabinChild(itiItem.id),
            cabinInfant:this._passengerCabinInfant(itiItem.id),
            instantEnable:this.flightHelper.isInstant(this.bookInstantEnableDisable,airlineCode),
            airlinesRouteEnableId:this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable,airlineCode),
            btnLoad:false,
            isAgentFare:this.isAgentFare,
            refundable:this._passengerInfoList(itiItem.id)[0].passengerInfo.nonRefundable==false?true:false,
            fareBasisCode:this._fareComponentDescs(this._passengerInfoList(itiItem.id)[0].passengerInfo.fareComponents[0].ref-1).fareBasisCode,
            markupTypeList:this.markupList,
            totalPrice:this._totalFare(itiItem.id).totalPrice,
            totalDiscount:adultDiscount+childDiscount+infantDiscount,
            clientFareTotal:this.getTotalAdultChildInfant(adultClientTotal,childClientTotal,infantClientTotal),
            agentFareTotal:this.getTotalAdultChildInfant(adultAgentTotal,childAgentTotal,infantAgentTotal),
            gdsFareTotal:
            (parseInt(adultMember)==0?0:adultTotal)+(parseInt(childListMember.length)==0?0:childTotal)+(parseInt(infantMember)==0?0:infantTotal),
            flightSegmentData:[],fareData:{}
          });
          let fInd=0;
          let dadj = 0;
          let adjustAct=0;
          let index=this.domOneWayData.findIndex(x=>x.id===itiItem.id && x.providerName===itiItem.nvProviderName);
          for(let item of this._schedules(ref))
          {
            let fref=item.ref-1;
            let adj=0,depAdj=0,arrAdj=0;
            if(item.departureDateAdjustment!=undefined && item.departureDateAdjustment!='')
            {
              adj=item.departureDateAdjustment;
              // if(dadj == 1){
              //   adj = item.departureDateAdjustment;
              //   dadj = item.departureDateAdjustment + dadj;
              // }else{
              //   adj=item.departureDateAdjustment;
              //   dadj=item.departureDateAdjustment;
              // }
            }
            if(this._departure(fref).dateAdjustment!=undefined && this._departure(fref).dateAdjustment!='')
            {
              depAdj=this._departure(fref).dateAdjustment;
            }
            if(this._arrival(fref).dateAdjustment!=undefined && this._arrival(fref).dateAdjustment!='')
            {
              arrAdj=this._arrival(fref).dateAdjustment;
            }

            if(depAdj == 1 && arrAdj == 0){
              arrAdj = 1;
            }else if(depAdj == 1 && arrAdj == 1){
              arrAdj = 2;
            }
            else if((depAdj == 2 && arrAdj == 1) || (depAdj == 1 && arrAdj == 2)){
              arrAdj = 3;
            }           
            if(adj>depAdj)
            {
              depAdj = adj;
            }
            if(adj>arrAdj)
            {
              arrAdj+=adj;
            }     
            else if(adj==arrAdj)
            {
              arrAdj+=adj;
            }
            adjustAct+=adj;
            let depAirportCode=this._departure(fref).airport;
            let depAirportId=this.getAirportId(depAirportCode);
            let arrAirportCode=this._arrival(fref).airport;
            let arrAirportId=this.getAirportId(arrAirportCode);
            let airlineCode=this._airlinesCode(fref);
            let airlineId=this.getAirlineId(airlineCode);
            // let adjDate = itiItem.legs[index].departureDateAdjustment!=undefined && itiItem.legs[index].departureDateAdjustment!="" && !isNaN(itiItem.legs[index].departureDateAdjustment)?itiItem.legs[index].departureDateAdjustment:0;
            // let depDateadd:number=Number.parseInt(adjDate);

            let fDifTime=this._timeDifferenceActual1(item.ref);

            this.domOneWayData[index].flightSegmentData.push({
              airlineName:this._airlinesName(fref),
              airlineCode:airlineCode,
              airlineId:airlineId,
              domestic:true,
              providerName:this.domOneWayData[index].providerName,
              supplierID:this.domOneWayData[index].supplierID,
              routeWiseMarkUpDiscountDetailsID:this.domOneWayData[index].routeWiseMarkUpDiscountDetailsID,
              ticketIssueType:this.domOneWayData[index].ticketIssueType,
              ticketIssueTypeCommission:this.domOneWayData[index].ticketIssueTypeCommission,
              airlineLogo:this.getAirlineLogo(this._airlinesCode(fref)),
              airlineNumber:this._carrier(fref).marketingFlightNumber,
              availableSeat:this.getSeatsAvailability(itiItem.id),
              bookingCode:this._passengerInfoFareComponentsSegmentsAdult(itiItem.id).bookingCode,
              departureTime:this._timeDeparture(fref),
              arrivalTime:this._timeArrival(fref),
              departureCity:this.getDepCityName(this._departure(fref).airport),
              arrivalCity:this.getArrCityName(this._arrival(fref).airport),
              departureAirportCode:depAirportCode,
              arrivalAirportCode:arrAirportCode,
              departureAirportId:depAirportId,
              arrivalAirportId:arrAirportId,
              differenceTime:fDifTime,//this._timeDifference(fref),
              layOverDifference:"",
              terminalDeparture:this._terminalDeparture(fref),
              terminalArrival:this._terminalArrival(fref),
              stopCount:fInd,
              adjustment:adjustAct,
              departureAdjustment:depAdj,
              departureDateAdjustment:adj,
              arrivalAdjustment:arrAdj,
              departureDate:this.selectedFlightDeparture[0].Date,
              arrivalDate:this.selectedFlightDeparture[0].Date,
            });

            let fdifHour:number=0;
            let fdifMinute:number=0;
            if(fDifTime.indexOf('h')>-1 && fDifTime.indexOf('m')>-1)
            {
              let fdifData=fDifTime.split(' ');
              fdifHour=this.shareService.getOnlyNumber(fdifData[0]);
              if(fdifData.length>1)
              {
                fdifMinute=parseInt(fdifData[1].toString().substring(0,fdifData[1].length-1));
              }
            }else if(fDifTime.indexOf('h')>-1 && fDifTime.indexOf('m')<0)
            {
              fdifHour=this.shareService.getOnlyNumber(fDifTime);
            }else if(fDifTime.indexOf('m')>-1 && fDifTime.indexOf('h')<0)
            {
              fdifMinute=this.shareService.getOnlyNumber(fDifTime);
            }
            rootHours+=fdifHour;
            rootMinutes+=fdifMinute;

            fInd=fInd+1;
            this.domOneWayData[index].depadjustment=adj>depAdj?adj:depAdj;
            this.domOneWayData[index].arradjustment=adj>arrAdj?adj:depAdj>arrAdj?depAdj:arrAdj;
            this.domOneWayData[index].adjustment=adj;
            // dadj = adj;
          }
          let fData=this.domOneWayData[index].flightSegmentData;
          let lenStop=fData.length;
          let stopData="";
          if(lenStop>2)
          {
            for(let item of fData)
            {
              stopData+=item.arrivalCity+",";
            }
            stopData=stopData.substring(0,stopData.length-1);
            if(stopData.length>12)
            {
              stopData=stopData.substring(0,12)+"..";
            }
          }else{
            stopData=fData[0].arrivalCity;
          }
          this.domOneWayData[index].stop=parseInt(lenStop)>1?parseInt(lenStop)-1:0;
          this.domOneWayData[index].stopAllCity=stopData;
          let diff="";
          for(let i=0;i<this.domOneWayData[index].flightSegmentData.length;i++)
          {
            try{
              let dep=this.domOneWayData[index].flightSegmentData[i+1].departureTime;
              let arr=this.domOneWayData[index].flightSegmentData[i].arrivalTime;
              
              let Gmt=this._timeDifferenceGMT(arr,dep);
              let Utc=this._timeDifferenceUTC(arr,dep);

              diff=this._differenceActual(Gmt,Utc);

              let flayHour=0;
              let flayMinute=0;
              if(diff.indexOf('m')>-1 && diff.indexOf('h')>-1)
              {
                let fdifData=diff.split(' ');
                flayHour=this.shareService.getOnlyNumber(fdifData[0]);
                flayMinute=parseInt(fdifData[1].toString().substring(0,fdifData[1].length-1));
              }else if(diff.indexOf('m')<0 && diff.indexOf('h')>-1)
              {
                flayHour=this.shareService.getOnlyNumber(diff);
              }else if(diff.indexOf('m')>-1 && diff.indexOf('h')<0)
              {
                flayMinute=this.shareService.getOnlyNumber(diff);
              }
              rootHours+=flayHour;
              rootMinutes+=flayMinute;
            }catch(exp)
            {
              diff="";
            }
            this.domOneWayData[index].flightSegmentData[i].layOverDifference=diff;
          }
          if(rootMinutes>59)
          {
            let retH:number=rootMinutes/60;
            rootHours+=retH;
            rootMinutes=rootMinutes%60;
          }
          if(rootMinutes>0)
          {
            this.domOneWayData[index].differenceTime=parseInt(rootHours.toString())+"h "+parseInt(rootMinutes.toString())+"m";
          }else{
            this.domOneWayData[index].differenceTime=parseInt(rootHours.toString())+"h";
          }

          this.domOneWayData[index].fareData={
            markupTypeId:this.flightHelper._typeWiseIdMarkup(this.markupInfo,airlineCode),
            markupPercent:this.flightHelper._typeWiseMarkupPercent(this.markupInfo,airlineCode),
            discountTypeId:this.flightHelper._typeWiseIdDiscount(this.discountInfo,airlineCode),
            discountTypePercent:this.flightHelper._typeWiseDiscountPercent(this.discountInfo,airlineCode),
            discountType:this.flightHelper._typeOfMarkupDiscount(this.markupInfo,airlineCode),
            adultBaseGDS:parseInt(adultMember)==0?0:adultBase,
            childBaseGDS:parseInt(childListMember.length)==0?0:childBase,
            infantBaseGDS:parseInt(infantMember)==0?0:infantBase,
            adultTaxGDS:parseInt(adultMember)==0?0:adultTax,
            childTaxGDS:parseInt(childListMember.length)==0?0:childTax,
            infantTaxGDS:parseInt(infantMember)==0?0:infantTax,
            adultTotalGDS:parseInt(adultMember)==0?0:adultTotal,
            childTotalGDS:parseInt(childListMember.length)==0?0:childTotal,
            infantTotalGDS:parseInt(infantMember)==0?0:infantTotal,
            adultBaseClient:Math.round(this.flightHelper._typeWisePrice(this.markupInfo,"Base",adultBase,adultTax,adultTotal,adultMember,airlineCode)),
            adultTaxClient:Math.round(this.flightHelper._typeWisePrice(this.markupInfo,"Tax",adultBase,adultTax,adultTotal,adultMember,airlineCode)),
            adultTotalClient:adultClientTotal,
            adultDiscount:adultDiscount*parseFloat(adultMember),
            adultAgentFare:adultAgentTotal,
            childBaseClient:Math.round(this.flightHelper._typeWisePrice(this.markupInfo,"Base",childBase,childTax,childTotal,childListMember.length,airlineCode)),
            childTaxClient:Math.round(this.flightHelper._typeWisePrice(this.markupInfo,"Tax",childBase,childTax,childTotal,childListMember.length,airlineCode)),
            childTotalClient:childClientTotal,
            childDiscount:childDiscount*parseFloat(childListMember.length),
            childAgentFare:childAgentTotal,
            infantBaseClient:Math.round(this.flightHelper._typeWisePrice(this.markupInfo,"Base",infantBase,infantTax,infantTotal,infantMember,airlineCode)),
            infantTaxClient:Math.round(this.flightHelper._typeWisePrice(this.markupInfo,"Tax",infantBase,infantTax,infantTotal,infantMember,airlineCode)),
            infantTotalClient:infantClientTotal,
            infantDiscount:infantDiscount*parseFloat(infantMember),
            infantAgentFare:infantAgentTotal
          };
          index+=1;
        }
      }
        // console.log(this.domOneWayData);
        this.makeProposalData=this.domOneWayData[0];
        this.setStopCount();
        this.setTempFilterData();
      }catch(exp){
        this.isNotFound=true;
        console.log(exp);
      }
  }
  getSeatsAvailability(id:any):number
  {
    let ret:number=0;
    try{
      ret=this._passengerInfoList(id)[0].passengerInfo.fareComponents[0].segments[0].segment.seatsAvailable;
    }catch(exp){}
    return ret;
  }
  getTotalAdultChildInfant(adult:number,child:number,infant:number):number
  {
    let ret:number=0;
    try{
      ret=adult+child+infant;
    }catch(exp)
    {

    }
    return ret;
  }
  getAirlineId(code:any)
  {
    let ret:string="";
    try{
      let data=this.cmbAirlines.find(x=>x.id.toString().toLowerCase()==code.toString().toLowerCase());
      ret=data.masterId;
    }catch(exp){}
    return ret;
  }
  getAircraftId(code:any)
  {
    let ret:string="";
    try{
      let data=this.cmbAirCraft.find(x=>x.code.toString().toLowerCase()==code.toString().toLowerCase());
      ret=data.id;
    }catch(exp){}
    return ret;
  }
  getAirportId(code:any)
  {
    let ret:string="";
    try{
      let data=this.cmbAirport.find(x=>x.id.toString().toLowerCase()==code.toString().toLowerCase());
      ret=data.masterId;
    }catch(exp){}
    return ret;
  }

  setTempFilterData()
  {
    this.tempDomOneWayData=this.domOneWayData;
    this.tempDomOneWayData=this.tempDomOneWayData.slice(0,10);
    $("#viewMoreAction").css("display","block");
  }
  viewMoreAction()
  {
    let store=this.domOneWayData;
    var curLen=this.domOneWayData.length-this.tempDomOneWayData.length;
    var tempLen=this.tempDomOneWayData.length;
    var orgLen=this.domOneWayData.length;
    for(let i=tempLen,j=0;i<orgLen;i++,j++)
    {
      if(j==10)
      {
        this.tempDomOneWayData=store.slice(0,i);
      }
      if(j<10)
      {
        this.tempDomOneWayData=store.slice(0,orgLen);

      }
    }
    if(this.domOneWayData.length==this.tempDomOneWayData.length)
    {
      $("#viewMoreAction").css("display","none");
    }

  }
  viewLessAction()
  {
    this.tempDomOneWayData=this.domOneWayData;
    this.tempDomOneWayData.splice(0,10);
  }
  defaultSortHeader(type:any)
  {
    try{
      switch(type)
      {
        case 'departure':
          $("#iddDur").css("display","none");
          $("#iduDur").css("display","none");
          $("#iddArr").css("display","none");
          $("#iduArr").css("display","none");
          $("#iddPri").css("display","none");
          $("#iduPri").css("display","none");
        break;
        case 'duration':
          $("#iddDep").css("display","none");
          $("#iduDep").css("display","none");
          $("#iddArr").css("display","none");
          $("#iduArr").css("display","none");
          $("#iddPri").css("display","none");
          $("#iduPri").css("display","none");
        break;
        case 'arrival':
          $("#iddDep").css("display","none");
          $("#iduDep").css("display","none");
          $("#iddDur").css("display","none");
          $("#iduDur").css("display","none");
          $("#iddPri").css("display","none");
          $("#iduPri").css("display","none");
        break;
        case 'price':
          $("#iddDep").css("display","none");
          $("#iduDep").css("display","none");
          $("#iddDur").css("display","none");
          $("#iduDur").css("display","none");
          $("#iddArr").css("display","none");
          $("#iduArr").css("display","none");
        break;
        default:
        break;
      }
      $("#sortDeparture").text("Departure");
      $("#sortDuration").text("Duration");
      $("#sortArrival").text("Arrival");
      $("#sortPrice").text("Price");
    }catch(exp){}
  }
  sort(data:any)
  {
    switch(data)
    {
      case "departure":
        this.defaultSortHeader('departure');
        if($("#iduDep").css("display")=="none")
        {

          $("#iddDep").css("display","none");
          $("#iduDep").css("display","block");
          this.tempDomOneWayData=this.tempDomOneWayData.sort((a,b) =>  (a.departureTime > b.departureTime ? 1 : -1));
        }else{
          $("#iddDep").css("display","block");
          $("#iduDep").css("display","none");
          this.tempDomOneWayData=this.tempDomOneWayData.sort((a,b) => (a.departureTime > b.departureTime ? -1 : 1));
        }
        $("#sortDeparture").text("");
        break;
      case "duration":
        this.defaultSortHeader('duration');
        if($("#iduDur").css("display")=="none")
        {
          $("#iddDur").css("display","none");
          $("#iduDur").css("display","block");
          this.tempDomOneWayData=this.tempDomOneWayData.sort((a,b) =>  (a.differenceTime > b.differenceTime ? 1 : -1));
        }else{
          $("#iddDur").css("display","block");
          $("#iduDur").css("display","none");
          this.tempDomOneWayData=this.tempDomOneWayData.sort((a,b) => (a.differenceTime > b.differenceTime ? -1 : 1));
        }
        $("#sortDuration").text("");
        break;
      case "arrival":
        this.defaultSortHeader('arrival');
        if($("#iduArr").css("display")=="none")
        {
          $("#iddArr").css("display","none");
          $("#iduArr").css("display","block");
          this.tempDomOneWayData=this.tempDomOneWayData.sort((a,b) =>  (a.arrivalTime > b.arrivalTime ? 1 : -1));
        }else{
          $("#iddArr").css("display","block");
          $("#iduArr").css("display","none");
          this.tempDomOneWayData=this.tempDomOneWayData.sort((a,b) => (a.arrivalTime > b.arrivalTime ? -1 : 1));
        }
        $("#sortArrival").text("");
        break;
      case "price":
        this.defaultSortHeader('price');
        if($("#iduPri").css("display")=="none")
        {
          $("#iddPri").css("display","none");
          $("#iduPri").css("display","block");
          this.tempDomOneWayData=this.tempDomOneWayData.sort((a,b) =>  (a.totalPrice > b.totalPrice ? 1 : -1));
        }else{
          $("#iddPri").css("display","block");
          $("#iduPri").css("display","none");
          this.tempDomOneWayData=this.tempDomOneWayData.sort((a,b) => (a.totalPrice > b.totalPrice ? -1 : 1));
        }
        $("#sortPrice").text("");
        break;
      default:
        break;

    }

  }
  filterAirlines(id:any,event:any,isFilterTop:boolean=false)
  {
    this.selectedAirFilterList=[];
    if(!isFilterTop)
    {
      if(event.target.checked)
      {
        if(!this.isExistAppliedFilter(this.getAirlineName(id)))
        {
          this.addAppliedFilterItem("fa fa-times-circle-o","","",
          this.getAirlineName(id),this.getAirlineName(id),this.getCurrentFlightCode(id));
        }
      }else{
        this.removeAppliedFilterItem(this.getAirlineName(id));
      }
    }
    // if(isFilterTop)
    // {
    //   this.removeAppliedFilterItem(this.getAirlineName(id));
    //   for(let item of this.airlines)
    //   {
    //     if(this.isExistAppliedFilter(this.getAirlineName(item.code)))
    //     {
    //       this.removeAppliedFilterItem(this.getAirlineName(item.code));
    //     }
    //   }
    //   this.addAppliedFilterItem("fa fa-times-circle-o","","",
    //       this.getAirlineName(id),this.getAirlineName(id),this.getCurrentFlightCode(id));


    // }
    for(let i=0;i<this.airlines.length;i++)
    {
      if(!isFilterTop)
      {
        var isChecked=$("#filterId"+i).is(":checked");
        if(isChecked)
        {
          var item=$("input[id='filterId"+i+"']:checked").val();
          if(!this.selectedAirFilterList.includes(item))
          {
            this.selectedAirFilterList.push(item);
          }
        }
      }
      if(isFilterTop)
      {
        if(!this.selectedAirFilterList.includes(id))
        {
          this.selectedAirFilterList.push(id);
        }
      }
    }
    this.filterFlightSearch();
  }
  popularFilterItem(item:any,event:any)
  {
    try{
      if(event.target.checked)
      {
        switch(item.origin)
        {
          case "refundable":
            this.refundFilterList=[];
            if(!this.isExistAppliedFilter(item.id))
            {
              this.addAppliedFilterItem("fa fa-times-circle-o","","","Refundable","Refundable","0");
            }
            this.refundFilterList.push(true);
            $("#chkRefundYes").prop("checked",true);
            $("#chkRefundNo").prop("checked",false);
            this.removeAppliedFilterItem("NonRefundable");
            break;
          case "stop":
            $("#stopId"+item.id).prop("checked",true);
            if(!this.isExistAppliedFilter(item.id))
            {
              this.addAppliedFilterItem("fa fa-times-circle-o","","",item.title,item.id,item.id);
            }
            break;
          case "departure":
            $("#scheduleDept"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",true);
            let i=(item.value.replaceAll('-','')).replaceAll(' ','');
            this._scheduleWidgetSelect(i,'dept');
            if(!this.isExistAppliedFilter(item.id))
            {
              this.addAppliedFilterItem("fa fa-times-circle-o","dep_shedule","fa fa-arrow-right",item.value,item.details,"departure");
            }
            break;
          case "arrival":
            $("#scheduleArr"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",true);
            let j=(item.value.replaceAll('-','')).replaceAll(' ','');
            this._scheduleWidgetSelect(j,'arr');
            if(!this.isExistAppliedFilter(item.id))
            {
              this.addAppliedFilterItem("fa fa-times-circle-o","ret_shedule","fa fa-arrow-left",item.value,item.details,"arrival");
            }
            break;
          default:
            break;
        }
      }else{
        switch(item.origin)
        {
          case "refundable":
            this.removeAppliedFilterItem(item.id);
            $("#chkRefundYes").prop("checked",false);
            break;
          case "stop":
            this.removeAppliedFilterItem(item.id);
            $("#stopId"+item.id).prop("checked",false);
            break;
          case "departure":

            this.removeAppliedFilterItem(item.details,"dep_shedule");
            $("#scheduleDept"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",true);
            let i=(item.value.replaceAll('-','')).replaceAll(' ','');
            this._scheduleWidgetDeSelect(i,'dept');
            break;
          case "arrival":
            this.removeAppliedFilterItem(item.details,"ret_shedule");
            $("#scheduleArr"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",true);
            let j=(item.value.replaceAll('-','')).replaceAll(' ','');
            this._scheduleWidgetDeSelect(j,'arr');
            break;
          default:
            break;
        }
      }
      this.filterFlightSearch();
    }catch(exp){}
  }
  filterDepartureTime(i:any,title:any,details:any,event:any)
  {
    this.selectedDeptTimeList=[];
    try{
      if(event.target.checked)
      {
        var item=details;
        this._scheduleWidgetSelect(i,'dept');
        let fh=item.toString().split('-')[0];
        let th=item.toString().split('-')[1];
        fh = moment(fh, ["h:mm A"]).format("HH:mm");
        th = moment(th, ["h:mm A"]).format("HH:mm");
        if(!this.isExistAppliedFilter(item,"dep_shedule"))
        {
          this.addAppliedFilterItem("fa fa-times-circle-o","dep_shedule","fa fa-arrow-right",title,item,fh+"-"+th);
        }
      }else{
        this.removeAppliedFilterItem(details,'dep_shedule');
      }
      for(let item of this.departureTimeFilter)
      {
        let i=(item.title.replaceAll('-','')).replaceAll(' ','');
        var isItem=$("#scheduleDept"+i).is(":checked");
        if(isItem)
        {
          let fh=item.details.toString().split('-')[0];
          let th=item.details.toString().split('-')[1];
          fh = moment(fh, ["h:mm A"]).format("HH:mm");
          th = moment(th, ["h:mm A"]).format("HH:mm");
          for(let subItem of this.itineraries)
          {
            let time=this._scheduleDescs(subItem.legs[0].ref-1).departure.time;
            if(time.toString().split(':')[0]>=fh.toString().split(':')[0] && time.toString().split(':')[0]<=th.toString().split(':')[0])
            {
              this.selectedDeptTimeList.push({id:item,text:time.toString().split(':')[0]+":"+time.toString().split(':')[1]});

            }
          }
        }
      }
      this.filterFlightSearch();
    }catch(exp){}
  }

  filterArrivalTime(i:any,title:any,details:any,event:any)
  {
    this.selectedArrTimeList=[];
    try{
      if(event.target.checked)
      {
        var item=details;
        this._scheduleWidgetSelect(i,'arr');
        let fh=item.toString().split('-')[0];
        let th=item.toString().split('-')[1];
        fh = moment(fh, ["h:mm A"]).format("HH:mm");
        th = moment(th, ["h:mm A"]).format("HH:mm");
        if(!this.isExistAppliedFilter(item,"ret_shedule"))
        {
          this.addAppliedFilterItem("fa fa-times-circle-o","ret_shedule","fa fa-arrow-left",title,item,fh+"-"+th);
        }
      }else{
        this.removeAppliedFilterItem(details,'ret_shedule');
      }
      for(let item of this.arrivalTimeFilter)
      {
        let i=(item.title.replaceAll('-','')).replaceAll(' ','');
        var isItem=$("#scheduleArr"+i).is(":checked");
        if(isItem)
        {
          let fh=item.details.toString().split('-')[0];
          let th=item.details.toString().split('-')[1];
          fh = moment(fh, ["h:mm A"]).format("HH:mm");
          th = moment(th, ["h:mm A"]).format("HH:mm");
          for(let subItem of this.itineraries)
          {
            let time=this._scheduleDescs(subItem.legs[0].ref-1).arrival.time;
            if(time.toString().split(':')[0]>=fh.toString().split(':')[0] && time.toString().split(':')[0]<=th.toString().split(':')[0])
            {
              this.selectedArrTimeList.push({id:item,text:time.toString().split(':')[0]+":"+time.toString().split(':')[1]});

            }
          }
        }
      }
      this.filterFlightSearch();
    }catch(exp){}
  }
  _scheduleWidgetSelect(i:number,cap:string)
  {
    $('#'+cap+'ScheduleBox'+i).css("background-color", this.flightHelper.scheduleWidgetSelectColor);
    $('#'+cap+'TitleId'+i).css("color", this.flightHelper.scheduleWidgetSelectTitleColor);
    $('#'+cap+'PriceId'+i).css("color", this.flightHelper.scheduleWidgetSelectPriceColor);
  }
  _scheduleWidgetDeSelect(i:number,cap:string)
  {
    $('#'+cap+'ScheduleBox'+i).css("background-color", this.flightHelper.scheduleWidgetDeSelectColor);
    $('#'+cap+'TitleId'+i).css("color", this.flightHelper.scheduleWidgetDeSelectTitleColor);
    $('#'+cap+'PriceId'+i).css("color", this.flightHelper.scheduleWidgetDeSelectPriceColor);
  }
  addAppliedFilterItem(cancel_class:string,schedule_class:string,arrow_class:string,title:string,value:string,origin:string)
  {
    this.appliedFilter.push({cancel_class:cancel_class,schedule_class:schedule_class,arrow_class:arrow_class,title:title,value:value,origin:origin});
  }
  removeAppliedFilterItem(id:any,type:any="")
  {
    if(type==undefined || type=="")
    {
      this.appliedFilter=this.appliedFilter.filter(x=>x.value.toString().trim().toLowerCase()!=id.toString().trim().toLowerCase());
    }else{
      let findInd=this.appliedFilter.findIndex(x=>x.value.toString().trim().toLowerCase()==id.toString().trim().toLowerCase() &&
      x.schedule_class.toString().trim().toLowerCase()==type.toString().trim().toLowerCase());
      this.appliedFilter.splice(findInd,1);
    }
    //Unchecked Stop Count
    for(let item of this.stopCountList)
    {
      if(item.id===id)
      {
        $("#stopId"+item.id).prop("checked",false);
        $("#popularFilterId"+id).prop("checked",false);
      }
    }
    //Unchecked Refundable
    if(id==="Refundable")
    {
      $("#chkRefundYes").prop("checked",false);
      $("#popularFilterId"+id).prop("checked",false);
    }
    if(id==="NonRefundable")
    {
      $("#chkRefundNo").prop("checked",false);
    }
    //Deselect departure panel
    if(type.toString().trim()=="dep_shedule")
    {
      for(let item of this.departureTimeFilter)
      {
        if(item.details.toString().toLowerCase()==id.toString().toLowerCase())
        {
          // console.log("value:"+item.value+" id:"+id+" details:"+item.details);
          $("#popularFilterId"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",false);
          this._scheduleWidgetDeSelect((item.title.replaceAll('-','')).replaceAll(' ',''),'dept');
          this.selectedDeptTimeList=this.selectedDeptTimeList.filter(x=>x.id.toString().replaceAll(" ","").trim().toLowerCase()
          !=id.toString().replaceAll(" ","").trim().toLowerCase());
        }
      }
    }
    //Deselect arrival panel
    if(type.toString().trim()=="ret_shedule")
    {
      for(let item of this.arrivalTimeFilter)
      {
        let i=(item.title.replaceAll('-','')).replaceAll(' ','');
        if(item.details.toString().toLowerCase()==id.toString().toLowerCase())
        {
          this._scheduleWidgetDeSelect(i,'arr');
          this.selectedArrTimeList=this.selectedArrTimeList.filter(x=>x.id.toString().replaceAll(" ","").trim().toLowerCase()
          !=id.toString().replaceAll(" ","").trim().toLowerCase());
        }
      }
    }
    //Unchecked airline
    for(let i=0;i<this.airlines.length;i++)
    {
      let item=this.getAirlineName(this.airlines[i].code);
      if(item.toString().toLowerCase()==id.toString().toLowerCase())
      {
        $("#filterId"+this.airlines[i].code).prop("checked",false);
        this.selectedAirFilterList=this.shareService.removeList(this.airlines[i].code,this.selectedAirFilterList);
      }
    }
    this.filterFlightSearch();
  }
  chkAlterBeforeAfter(type:string):string
  {
    let ret:string=type;
    if(type.indexOf("before")>-1)
    {
      ret="12AM-06AM".toLowerCase();
    }else if(type.indexOf("after")>-1)
    {
      ret="06PM-12AM".toLowerCase();
    }
    return ret;
  }
  removeAllAppliedFilterItem()
  {
    this.setTempFilterData();
    this.appliedFilter=[];
    this.selectedDeptTimeList=[];
    this.selectedArrTimeList=[];
    $("#chkRefundYes").prop("checked",false);
    $("#chkRefundNo").prop("checked",false);
    for(let item of this.stopCountList)
    {
      $("#stopId"+item.id).prop("checked",false);
    }
    for(let item of this.airlines)
    {
      $("#filterId"+item.code).prop("checked",false);
    }1
    for(let item of this.departureTimeFilter)
    {
      let i=(item.title.replaceAll('-','')).replaceAll(' ','');
      this._scheduleWidgetDeSelect(i,'dept');
    }
    for(let item of this.arrivalTimeFilter)
    {
      let i=(item.title.replaceAll('-','')).replaceAll(' ','');
      this._scheduleWidgetDeSelect(i,'arr');
    }
    for(let item of this.popularFilter)
    {
      $("#popularFilterId"+(item.id.replaceAll('-','')).replaceAll(' ','')).prop("checked",false);
    }
    // $("#changeWayPriceID").slider("option", "values", [1, 100]);
    $("#changeWayPriceID").slider("destroy");
  }
  filterRefund(type:string,event:any)
  {
    this.refundFilterList=[];
    try{
      if(type=="Yes")
      {
        if(event.target.checked)
        {
          if(!this.isExistAppliedFilter("Refundable"))
          {
            this.addAppliedFilterItem("fa fa-times-circle-o","","","Refundable","Refundable","0");
            this.refundFilterList.push(true);
            $("#chkRefundNo").prop("checked",false);
            this.removeAppliedFilterItem("NonRefundable");
          }
        }else{
          this.removeAppliedFilterItem("Refundable");
        }
      }
      if(type=="No")
      {
        if(event.target.checked)
        {
          if(!this.isExistAppliedFilter("NonRefundable"))
          {
            this.addAppliedFilterItem("fa fa-times-circle-o","","","NonRefundable","NonRefundable","1");
            this.refundFilterList.push(false);
            $("#chkRefundYes").prop("checked",false);
            this.removeAppliedFilterItem("Refundable");
          }
        }else{
          this.removeAppliedFilterItem("NonRefundable");
        }
      }
      this.filterFlightSearch();
    }catch(exp){}
  }
  isExistAppliedFilter(id:any,type:any=""):boolean{
    let isExist:boolean=false;
    try{
      for(let item of this.appliedFilter)
      {
        if(type!="" && type!=undefined)
        {
          if(item.title==id && item.schedule_class==type)
          {
            isExist=true;
          }
        }else{
          if(item.title==id)
          {
            isExist=true;
          }
        }
      }
    }catch(exp){}
    return isExist;
  }
  changeWayPrice()
  {
    this.tempDomOneWayData=this.domOneWayData;
    let min:number,max:number,id: number,dif:number=0;
    let updatedMax:number=0;
    min=Number.parseFloat(this._minimumRange());
    max=Number.parseFloat(this._maximumRange());
    id = $("#changeWayPriceID").val();
    dif=min+(((max-min)/100)*id);
    this.udMinRangeVal=dif;
    updatedMax=this.udMinRangeVal;
    this.appliedFilter.forEach((item,index)=>{
      if(item.origin.toString()=="range") this.appliedFilter.splice(index,1);
    });
    if(min!=this.udMinRangeVal)
    {
      this.addAppliedFilterItem("fa fa-times-circle-o","","",min+"-"+this.udMinRangeVal,min+"-"+this.udMinRangeVal,
        "range");
    }
    this.filterFlightSearch();
  }
  stopWiseFilter(item:any,itemTitle:any,event:any)
  {
    if(event.target.checked)
    {
      if(!this.isExistAppliedFilter(item))
      {
        this.addAppliedFilterItem("fa fa-times-circle-o","","",itemTitle,item,item);
      }
    }else{
      this.removeAppliedFilterItem(item);
    }
    this.filterFlightSearch();
  }
  flightShowHideAction(id:any)
  {
    if($("#flightDetailsWrap"+id).css('display') == 'block')
    {
      $("#flightDetailsShowHide"+id).text("View Flight Details");
      $("#flightDetailsWrap"+id).hide('slow');
      $(".result_single_box").css("paddingBottom","0px");
    }else{
      $("#flightDetailsWrap"+id).show('slow');
      $("#flightDetailsShowHide"+id).text("Hide Flight Details");

      $("#fareDetailsShowHide"+id).text("View Fare Details");
      $("#fareDetailsWrap"+id).hide('slow');
      $(".result_single_box").css("paddingBottom","10px");
    }
  }
  fareShowHideAction(id:any)
  {
    if($("#fareDetailsWrap"+id).css('display') == 'block')
    {
      $("#fareDetailsShowHide"+id).text("View Fare Details");
      $("#fareDetailsWrap"+id).hide('slow');
      $(".result_single_box").css("paddingBottom","0px");
    }else{
      $("#fareDetailsWrap"+id).show('slow');
      $("#fareDetailsShowHide"+id).text("Hide Fare Details");

      $("#flightDetailsShowHide"+id).text("View Flight Details");
      $("#flightDetailsWrap"+id).hide('slow');
      $(".result_single_box").css("paddingBottom","10px");
    }

  }
  showFareDetailsMobile(ind:any)
  {
    this.fareDetailsModalData=[];
    try{
      this.fareDetailsModalData=this.domOneWayData.find(x=>x.id==ind);
      $('#fareDetailsModal').modal('show');
    }catch(exp){}
  }
  showFlightDetailsMobile(ind:any)
  {
    try{
      var data=this.domOneWayData.find(x=>x.id==ind);

      this.flightDetailsModalData.push({
        flightData:[],
        fromFlight:this.fromFlight,
        toFlight:this.toFlight,
        depDay:"",
        depMonthNameShort:"",
        depDayNameShort:"",
        departureDate:data.departureDate,
        baggageAdult:data.baggageAdult,
        baggageChild:data.baggageChild,
        baggageInfant:data.baggageInfant,
        cabinAdult:data.cabinAdult,
        cabinChild:data.cabinChild,
        cabinInfant:data.cabinInfant,
        oneWay:true
      });
      this.flightDetailsModalData[0].flightData.push(data.flightSegmentData);
      $('#flightDetailsModal').modal('show');
    }catch(exp)
    {

    }
  }
  showMakeProposal(ind:any)
  {
    try{
      this.makeProposalData=this.domOneWayData.find(x=>x.id===ind);
      // console.log("make proposal::");
      // console.log(this.makeProposalData);
      $("#dBaseDefault").text("0");
      $("#dTaxDefault").text("0");
      $("#dTotalDefault").text("0");
      $("#dAgentDefault").text("0");
      $("#mBaseDefault").text("0");
      $("#mTaxDefault").text("0");
      $("#mTotalDefault").text("0");
      $("#mAgentDefault").text("0");
      $("#profitAmount").val("");
      $("#discountAmount").val("");
      $('#proposalModal').modal('show');
    }catch(exp){

    }
  }


  getCurrentFlightCode(id:any):string
  {
    let ret:string=id;
    try{
      for(let i=0;i<this.rootData.scheduleDescs.length;i++)
      {
        let marketing=this.rootData.scheduleDescs[i].carrier.marketing;
        let disclosure=this.rootData.scheduleDescs[i].carrier.disclosure;
        if((disclosure!=undefined && disclosure==id) || (marketing!=undefined && marketing==id))
        {
            ret=marketing;
            break;
        }
      }
    }catch(exp){}
    return ret;
  }
  _minimumRange():string
  {
    let ret:string="";
    try{
      let updatePrice=this.domOneWayData[0].clientFareTotal;
      for(let i=1;i<this.domOneWayData.length;i++)
      {
        let price=this.domOneWayData[i].clientFareTotal;
        if(Number.parseFloat(price)<Number.parseFloat(updatePrice))
        {
          updatePrice=price;
        }
      }
      ret=updatePrice;
    }catch(exp){}
    return ret;
  }
  _maximumRange():string
  {
    let ret:string="";
    try{
      let updatePrice=this.domOneWayData[0].clientFareTotal;
      for(let i=1;i<this.domOneWayData.length;i++)
      {
        let price=this.domOneWayData[i].clientFareTotal;
        if(Number.parseFloat(price)>Number.parseFloat(updatePrice))
        {
          updatePrice=price;
        }
      }
      ret=updatePrice;
    }catch(exp){}
    return ret;
  }

  _groupedDayMonthYear(data:any):string
  {
    let ret:string="";
    try{
      ret=this.shareService.getDayNameShort(data.departureDate)+", "+
      this.shareService.getMonthShort(data.departureDate)+" "+
      this.shareService.getDay(data.departureDate)+", "+
      this.shareService.getYearLong(data.departureDate);

    }catch(exp){}
    return ret;
  }
  _isFareDate(data:any):boolean
  {
    let ret:boolean=false;
    try{;
      let fareD=this.shareService.getDay(data.departureDate);
      let selecD=this.shareService.getDay(this.selectedFlightDeparture[0].Date);
      if(parseInt(fareD)==parseInt(selecD))
      {
        ret=true;
      }
    }catch(exp){}
    return ret;
  }
  _groupedTotalFare(ind:any):any
  {
    var data="";
    try{
      data=this._groupedFare(ind).totalFare;
    }catch(exp){}
    return data;
  }
  _groupedFare(ind:any):any
  {
    var data="";
    try{
      data=this._groupedPricingInfo(ind)[0].fare;
    }catch(exp){}
    return data;
  }
  _groupedPricingInfo(ind:any):any
  {
    var data="";
    try{
      data=this._groupedItineraries(ind).pricingInformation;
    }catch(exp){}
    return data;
  }
  _groupedItineraries(ind:any):any
  {
    var data="";
    try{
      data=this.itineraryGroups[ind].itineraries[0];

    }catch(exp){}
    return data;
  }
  _groupedLegDescriptions(ind:any):any
  {
    var data="";
    try{
      data=this._groupDescription(ind).legDescriptions;
    }catch(exp){}
    return data;
  }
  _groupDescription(ind:any):any
  {
    var data="";
    try{
      data=this.itineraryGroups[ind].groupDescription;

    }catch(exp){}
    return data;
  }
  _timeArrival(ind:any):string
  {
    let ret:string="";
    try{
      let data=this._arrival(ind).time;
      data=data.toString().split(':')[0]+':'+data.toString().split(':')[1];
      if(data!=undefined && data!="")
      {
        ret=data;
      }
    }catch(exp){}
    return ret;
  }
  _timeDifferenceActual1(legs:any):string {
    var td = "", data
    try{
          data = this.rootData.scheduleDescs.find( (x: { id: number; })=>x.id==legs).elapsedTime;
         let h = Math.floor(data/60);
         let m = data%60;
         td = h.toString() + 'h ' + m.toString() + 'm'  
        return td;
    }
    catch (exp){
      return td="";
    }
  }
  _timeDifference(ind:any):string
  {
    let ret:string="";

    try{
      let arr=this._timeArrival(ind);
      let dep=this._timeDeparture(ind);
      ret=this._difference(dep,arr);
    }catch(exp){}
    return ret;
  }
  
  _differenceActual(gmt:any,utc:any):any
  {
    let ret:string="";
    try{
      let fromHour=parseInt(gmt.split(':')[0]);
      let fromMin=parseInt(gmt.split(':')[1]);
      let toHour=parseInt(utc.split(':')[0]);
      let toMin=parseInt(utc.split(':')[1]);
      let dif=this.shareService.getAddedTime(fromHour,fromMin,toHour,toMin);
      let hour=dif.toString().split(':')[0];
      let min=dif.toString().split(':')[1];

      hour=parseInt(hour.toString());
      min=parseInt(min.toString());
      if(parseInt(hour)>0 && parseInt(min)>0)
      {
        ret=hour+"h "+min+"m";
      }else if(parseInt(hour)>0 && parseInt(min)<=0)
      {
        ret=hour+"h";
      }else if(parseInt(hour)<=0 && parseInt(min)>0)
      {
        ret=min+"m";
      }
    }catch(exp){}
    return ret;
  }
  _timeDifferenceGMT(dep:any,arr:any):string
  {
    let ret:string="";
    try{
      let fromHour=parseInt(dep.split(':')[0]);
      let fromMin=parseInt(dep.split(':')[1]);
      let toHour=parseInt(arr.split(':')[0]);
      let toMin=parseInt(arr.split(':')[1]);
      ret=this.flightHelper.getFlightDifferenceGMT(fromHour,fromMin,toHour,toMin);
    }catch(exp){}
    return ret;
  }
  _timeDifferenceUTC(dep:any,arr:any):string
  {
    let ret:string="";
    try{
      let fromExpr=dep.substring(0,1);
      let toExpr=arr.substring(0,1);
      dep=dep.substring(1);
      arr=arr.substring(1);
      let fromHour=parseInt(dep.split(':')[0]);
      let fromMin=parseInt(dep.split(':')[1]);
      let toHour=parseInt(arr.split(':')[0]);
      let toMin=parseInt(arr.split(':')[1]);
      ret=this.flightHelper.getFlightDifferenceUTC(fromHour,fromMin,fromExpr,toHour,toMin,toExpr);
    }catch(exp){}
    return ret;
  }
  _difference(dep:any,arr:any):string
  {
    let ret:string="";
    try{
      let dif=this.shareService.getTimeDifference(dep,arr);
      let hour=dif.toString().split(':')[0];
      let min=dif.toString().split(':')[1];
      if(parseInt(hour)>0 && parseInt(min)>0)
      {
        ret=hour+"h "+min+"m";
      }else if(parseInt(hour)>0 && parseInt(min)<=0)
      {
        ret=hour+"h";
      }else if(parseInt(hour)<=0 && parseInt(min)>0)
      {
        ret=min+"m";
      }
    }catch(exp)
    {}
    return ret;
  }
  _terminalArrival(ind:any):string
  {
    let ret:string="";
    try{
      let data=this._arrival(ind).terminal;
      if(data!=undefined && data!="")
      {
        ret="Terminal "+data;
      }
    }catch(exp){}
    return ret;
  }
  _timeDeparture(ind:any):string
  {
    let ret:string="";
    try{
      let data=this._departure(ind).time;
      data=data.toString().split(':')[0]+':'+data.toString().split(':')[1];
      if(data!=undefined && data!="")
      {
        ret=data;
      }
    }catch(exp){}
    return ret;
  }
  _terminalDeparture(ind:any):string
  {
    let ret:string="";
    try{
      let data=this._departure(ind).terminal;
      if(data!=undefined && data!="")
      {
        ret="Terminal "+data;
      }
    }catch(exp){}
    return ret;
  }
  _departure(ind:any):any{
    var data="";
    try{
      data=this._scheduleDescs(ind).departure;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _arrival(ind:any):any{
    var data="";
    try{
      data=this._scheduleDescs(ind).arrival;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _airlinesName(ind:any):string
  {
    let ret:string="";
    try{
      let flightCode=this._carrier(ind).marketing;
      ret=this.getAirlineName(flightCode);
      if(ret=="")
      {
        ret=this.getAirlineName(this._carrier(ind).disclosure);
      }
    }catch(exp){}
    return ret;
  }
  _airlinesCode(ind:any):string
  {
    let ret:string="";
    try{
      let flightCode=this._carrier(ind).marketing;
      ret=this.getAirlineName(flightCode);
      if(ret=="")
      {
        ret=this._carrier(ind).disclosure;
      }else{
        ret=this._carrier(ind).marketing;

      }
    }catch(exp){}
    return ret;
  }
  _equipment(ind:any):any{
    var data="";
    try{
      data=this._carrier(ind).equipment;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _carrier(ind:any):any{
    var data="";
    try{
      data=this._scheduleDescs(ind).carrier;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoCabinWeight(type:any)
  {
    let data="";
    try{
      switch(type.toLowerCase())
      {
        case "c":
          data="9Kgs";
          break;
        default:
          data="7Kgs";
          break;
      }
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerCabinAdult(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoCabinWeight(this._fareComponentAdult(ind).cabinCode);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerCabinChild(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoCabinWeight(this._fareComponentChild(ind).cabinCode);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerCabinInfant(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoCabinWeight(this._fareComponentInfant(ind).cabinCode);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsSegmentsAdult(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoFareComponentsAdult(ind)[0].segments[0].segment;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsSegmentsChild(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoFareComponentsChild(ind)[0].segments[0].segment;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsSegmentsInfant(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoFareComponentsInfant(ind)[0].segments[0].segment;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fareComponentDescs(ind:any):any{
    var data="";
    try{
      data=this.rootData.fareComponentDescs[ind];
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fareComponentAdult(ind:any):any{
    var data="";
    try{
      let ref=this._passengerInfoFareComponentsAdult(ind)[this._passengerInfoAdult(ind).fareComponents.length-1].ref-1;
      data=this._fareComponentDescs(ref);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fareComponentChild(ind:any):any{
    var data="";
    try{
      let ref=this._passengerInfoFareComponentsChild(ind)[this._passengerInfoChild(ind).fareComponents.length-1].ref-1;
      data=this._fareComponentDescs(ref);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fareComponentInfant(ind:any):any{
    var data="";
    try{
      let ref=this._passengerInfoFareComponentsInfant(ind)[this._passengerInfoInfant(ind).fareComponents.length-1].ref-1;
      data=this._fareComponentDescs(ref);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _pieceOrKgsAdult(ind:any):any
  {
    var data="";
    try{
      data=this._passengerInfoBaggageAdult(ind).pieceCount;
      if(data==undefined)
      {
        data=this._passengerInfoBaggageAdult(ind).weight+" "+this._passengerInfoBaggageAdult(ind).unit;
      }else{
        data=data+" pcs";
      }
    }catch(exp){}
    return data;
  }
  _pieceOrKgsChild(ind:any):any
  {
    var data="";
    try{
      data=this._passengerInfoBaggageChild(ind).pieceCount;
      if(data==undefined)
      {
        data=this._passengerInfoBaggageChild(ind).weight+" "+this._passengerInfoBaggageChild(ind).unit;
      }else{
        data=data+" pcs";
      }
    }catch(exp){}
    return data;
  }
  _pieceOrKgsInfant(ind:any):any
  {
    var data="";
    try{
      data=this._passengerInfoBaggageInfant(ind).pieceCount;
      if(data==undefined)
      {
        data=this._passengerInfoBaggageInfant(ind).weight+" "+this._passengerInfoBaggageInfant(ind).unit;
      }else{
        data=data+" pcs";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoBaggageAdult(ind:any):any{
    var data="";
    try{
      data=this._baggageAllowanceDescs(this._passengerInfoAdult(ind).baggageInformation[0].allowance.ref);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoBaggageChild(ind:any):any{
    var data="";
    try{
      data=this._baggageAllowanceDescs(this._passengerInfoChild(ind).baggageInformation[0].allowance.ref);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoBaggageInfant(ind:any):any{
    var data="";
    try{
      data=this._baggageAllowanceDescs(this._passengerInfoInfant(ind).baggageInformation[0].allowance.ref);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _baggageAllowanceDescs(ind:any):any{
    var data="";
    try{
      data=this.rootData.baggageAllowanceDescs[ind-1];
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _passengerInfoFareComponentsAdult(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoAdult(ind).fareComponents;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsChild(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoChild(ind).fareComponents;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsInfant(ind:any):any{
    var data="";
    try{
      data=this._passengerInfoInfant(ind).fareComponents;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerTotalFare(ind:any):number
  {
    let ret=0;
    try{
      let a=this._passengerInfoTotalFareAdult(ind).totalPrice;
      let c=this._passengerInfoTotalFareChild(ind).totalPrice;
      let i=this._passengerInfoTotalFareInfant(ind).totalPrice;
      a=(a!=undefined && a!="")?a:0;
      c=(c!=undefined && c!="")?c:0;
      i=(i!=undefined && i!="")?i:0;
      ret=Number.parseInt(a)+Number.parseInt(c)+Number.parseInt(i);
    }catch(exp){}
    return ret;
  }
  _passengerInfoTotalFareAdult(ind:any):any{
    var data="0";
    try{
      data=this._passengerInfoAdult(ind).passengerTotalFare;
      if(data==undefined)
      {
        return "0";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoTotalFareChild(ind:any):any{
    var data="0";
    try{
      data=this._passengerInfoChild(ind).passengerTotalFare;
      if(data==undefined)
      {
        return "0";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoTotalFareInfant(ind:any):any{
    var data="0";
    try{
      data=this._passengerInfoInfant(ind).passengerTotalFare;
      if(data==undefined)
      {
        return "0";
      }
    }catch(exp){}
    return data;
  }

  _passengerInfoAdult(ind:any):any{
    var data="";
    try{
      data=this._passengerInfo(ind,'ADT');
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoChild(ind:any):any{
    var data="";
    try{
      data=this._passengerInfo(ind,'C');
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoInfant(ind:any):any{
    var data="";
    try{
      data=this._passengerInfo(ind,'INF');
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _passengerInfo(ind:any,type:any):any{
    var data="";
    try{
      let i=0;
      for(let item of this._passengerInfoList(ind))
      {
        if(item.passengerInfo.passengerType.toString().indexOf(type)>-1 || item.passengerInfo.passengerType.toString().indexOf("ADT")>-1)
        {
          data=item.passengerInfo;
        }else{
          if(item.passengerInfo.passengerType.toString().indexOf(type)>-1)
          {
            data=item.passengerInfo;
          }
        }
        i+=1;
      }
      if(data==undefined) return "";
    }catch(exp){}
    return data;
  }

  _totalFare(ind:any):any{
    var data="";
    try{
      data=this._fare(ind).totalFare;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoList(ind:any):any{
    var data="";
    try{
      data=this._fare(ind).passengerInfoList;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fare(ind:any):any{
    var data="";
    try{
      data=this._pricingInfo(ind)[0].fare;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _scheduleDescs(ind:any):any
  {
    var data="";
    try{
      data=this.rootData.scheduleDescs[ind];
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _schedules(ind:any):any
  {
    var data="";
    try{
      data=this._legDescs(ind).schedules;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _legDescs(ind:any):any{
    var data="";
    try{
      data=this.rootData.legDescs[ind];
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _itineryLegs(ind:any):any
  {
    var data="";
    try{
      data=this.itineraries[ind].legs;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _pricingInfo(ind:any):any{
    var data="";
    try{
      data=this.itineraries.find((x: { id: number; })=>x.id===ind).pricingInformation;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  getMinimumPriceForStopCount(count:any):any{
    let ret="";
    try{
      ret=this._totalFare(0).totalPrice;
      let ind=0;
      for(let item of this.itineraries)
      {
        if(this._scheduleDescs(item.legs[0].ref-1).stopCount==count)
        {
          if(ret>this._totalFare(ind).totalPrice)
          {
            ret=this._totalFare(ind).totalPrice;
          }
        }
        ind++;
      }
    }catch(exp){}
    return ret;
  }
  getMinimumPriceForTime(type:string,from:number,to:number,ap:any):number
  {
    let ret=0;
    let retArr:number[]=[],min:number=0;
    try{
      let index=0;
      for(let item of this.itineraries)
      {
        let time=this._scheduleDescs(item.legs[0].ref-1).departure.time;
        if(type=='arrival')
        {
          time=this._scheduleDescs(item.legs[0].ref-1).arrival.time;
        }
        let hh=time.toString().trim().split(':')[0];
        let mm=time.toString().trim().split(':')[1];
        let a_p=this.shareService.getAmPm(hh,mm);
        let hours=a_p.toString().trim().split(':')[0];
        if(a_p.toString().indexOf(ap)>-1 && ap=='AM')
        {
          if(from==1 && to==6)
          {
            if(Number.parseInt(hours.toString().trim())==12 || (Number.parseInt(hours.toString().trim())>=1 && Number.parseInt(hours.toString().trim())<6))
            {
              retArr.push(this._totalFare(index).totalPrice);
            }
          }
          if(from==6 && to==12)
          {
            if(Number.parseInt(hours.toString().trim())>=6 && Number.parseInt(hours.toString().trim())<12)
            {
              retArr.push(this._totalFare(index).totalPrice);
            }
          }
        }
        if(a_p.toString().indexOf(ap)>-1 && ap=='PM')
        {
          if(from==1 && to==6)
          {
            if(Number.parseInt(hours.toString().trim())==12 || (Number.parseInt(hours.toString().trim())>=1 && Number.parseInt(hours.toString().trim())<6))
            {
              retArr.push(this._totalFare(index).totalPrice);
            }
          }
          if(from==6 && to==12)
          {
            if(Number.parseInt(hours.toString().trim())>=6 && Number.parseInt(hours.toString().trim())<12)
            {
              retArr.push(this._totalFare(index).totalPrice);
            }
          }
        }
        index++;
      }
      min=retArr[0];
      for(let item of retArr)
      {
        if(min>item)
        {
          min=item;
        }
      }
      ret=min;
    }catch(exp){}
    return ret;
  }
  setDepartureTimeFilter(type:string,a_p:any,hours:any,time:any)
  {
    try{
      if(a_p.toString().indexOf('AM')>-1)
      {
        let before6=this.getMinimumPriceForTime(type,1,6,'AM');
        let am6=this.getMinimumPriceForTime(type,6,12,'AM');
        if(this.departureTimeFilter.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
        {
          this.departureTimeFilter.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
          if(this.popularFilter.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
          {
            this.popularFilter.push({id:"12AM-06AM",title:"Morning Departure",value:"Before 06AM",len:"",details:"12:00 AM-05:59 AM",price:before6,origin:"departure"});
          }
        }
        if(this.departureTimeFilter.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
        {
          this.departureTimeFilter.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
        }
      }
      if(a_p.toString().indexOf('PM')>-1)
      {
        let after12pm=this.getMinimumPriceForTime(type,1,6,'PM');
        let after6=this.getMinimumPriceForTime(type,6,12,'PM');
        if(this.departureTimeFilter.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
        {
          this.departureTimeFilter.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
        }
        if(this.departureTimeFilter.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
        {
          this.departureTimeFilter.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
          if(this.popularFilter.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
          {
            this.popularFilter.push({id:"06PM-12AM",title:"Late Departure",value:"After 06PM",len:"",details:"06:00 PM-11:59 PM",price:after6,origin:"departure"});
          }
        }
      }
    }catch(exp){}
  }
  setArrivalTimeFilter(type:string,a_p:any,hours:any,time:any)
  {
    try{
      if(a_p.toString().indexOf('AM')>-1)
      {
        let before6=this.getMinimumPriceForTime(type,1,6,'AM');
        let am6=this.getMinimumPriceForTime(type,6,12,'AM');
        if(this.arrivalTimeFilter.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
        {
          this.arrivalTimeFilter.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
        }
        if(this.arrivalTimeFilter.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
        {
          this.arrivalTimeFilter.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
        }
      }
      if(a_p.toString().indexOf('PM')>-1)
      {
        let after12pm=this.getMinimumPriceForTime(type,1,6,'PM');
        let after6=this.getMinimumPriceForTime(type,6,12,'PM');
        if(this.arrivalTimeFilter.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
        {
          this.arrivalTimeFilter.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
        }
        if(this.arrivalTimeFilter.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
        {
          this.arrivalTimeFilter.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
        }
      }
    }catch(exp){}
  }
  isEmpty(data:any)
  {
    let ret:boolean=true;
    if(data!="" && data!=undefined)
    {
      ret=false;
    }
    return ret;
  }
  setHeadSearchPanel(fromCountry:string,toCountry:string,
    fromAirport:string,toAirport:string,fromFlightName:string,
    toFlightName:string,fromFlightCode:string,toFlightCode:string)
  {
    try{
      $("#fromFlightCityName").text(fromFlightName+', '+fromCountry);
      $("#fromFlightCityDetails").text(fromFlightCode+', '+fromAirport);
      $("#toFlightCityName").text(toFlightName+', '+toCountry);
      $("#toFlightCityDetails").text(toFlightCode+', '+toAirport);
    }catch(exp){}
  }
  setTimeFilter(type:string)
  {
    try{
      let index=0;
      for(let item of this.itineraries)
      {
        let time=this._scheduleDescs(item.legs[0].ref-1).departure.time;
        if(type=='arrival'){
          time=this._scheduleDescs(item.legs[0].ref-1).arrival.time;
        }
        let a_p=this.shareService.getAmPm(time.toString().trim().split(':')[0],time.toString().trim().split(':')[1]);
        let hours=a_p.toString().trim().split(':')[0];
        if(type=='arrival')
        {
          this.setArrivalTimeFilter(type,a_p,hours,time);
        }else{
          this.setDepartureTimeFilter(type,a_p,hours,time);
        }
        index++;
      }
    }catch(exp){}
  }
  setStopCount()
  {
    this.stopCountList=[];
    try{
      let stopList:any[]=[];
      for(let rootItem of this.domOneWayData)
      {
        let price=rootItem.clientFareTotal;
        let len=rootItem.flightSegmentData.length;
        stopList.push({id:len,price:price});
      }
      let stopGroup=this.shareService.getMapToArray(this.shareService.groupBy(stopList,x=>x.id));
      for(let item of stopGroup)
      {
        let min=item.value[0].price;
        let title=item.key==1?"Non stop":"Stop "+(item.key-1);
        this.stopCountList.push({id:item.key,stopCount:item.value.length,title:title,
        price:0});
        for(let subItem of item.value)
        {
          if(min>subItem.price)
          {
            min=subItem.price;
          }
        }
        this.stopCountList.find(x=>x.id==item.key).price=min;
        if(item.key==2)
        {
          if(this.popularFilter.findIndex(x=>x.id.indexOf(item.key+"")>-1)<0 && this.flightHelper.isNotZero(min)==true)
          {
            this.popularFilter.push({id:item.key+"",title:title,value:title,len:"("+item.value.length+")",price:min,origin:"stop"});
          }
        }
      }
      let minPriceRef=this.getMinumumPricePopularFilterRefundable(true);
      let countRef=this.getTotalPopularFilterRefundable(true);
      if(this.popularFilter.findIndex(x=>x.id.indexOf("Refundable")>-1)<0)
      {
        this.popularFilter.push({id:"Refundable",title:"Refundable",value:"",len:"("+countRef+")",price:minPriceRef,origin:"refundable"});
      }

      this.setTimeFilter('departure');
      this.setTimeFilter('arrival');
    }catch(exp){}
  }
  getMinumumPricePopularFilterRefundable(type:boolean):any
  {
    let ret:number=0;
    try{
      let data=this.domOneWayData.filter(function(i, j) {
        return i.refundable==type;
      });
      let min=data[0].clientFareTotal;
      for(let item of data)
      {
        if(min>item.clientFareTotal)
        {
          min=item.clientFareTotal;
        }
      }
      ret=min;
    }catch(exp){}
    return ret;
  }
  getTotalPopularFilterRefundable(type:boolean):any
  {
    let ret:number=0;
    try{
      let data=this.domOneWayData.filter(function(i, j) {
        return i.refundable==type;
      });
      for(let item of data)
      {
        ret+=1;
      }
    }catch(exp){}
    return ret;
  }
  private setAirport(searchedAirport:any) {
    this.topFlightSearchSkeleton=true;
    setTimeout(()=>{
      this.airports={departure:[],arrival:[]};
        let depAirport: string[]=[],arrAirport:string[]=[];
        this.cmbAirport = this.flightHelper.getAirportData();
        for(let j=0;j<searchedAirport.length;j++)
        {
          if(!depAirport.includes(searchedAirport[j].departure.airport))
          {
            depAirport.push(searchedAirport[j].departure.airport);
          }
          if(!arrAirport.includes(searchedAirport[j].arrival.airport))
          {
            arrAirport.push(searchedAirport[j].arrival.airport);
          }
        }
        for(let i=0;i<this.cmbAirport.length;i++)
        {
          if(depAirport.includes(this.cmbAirport[i].code))
          {
            this.airports.departure.unshift({depCode:this.cmbAirport[i].code,depName:this.cmbAirport[i].text,
              depCityName:this.cmbAirport[i].cityname,depCountryName:this.cmbAirport[i].countryname});
          }
        }
        for(let i=0;i<this.cmbAirport.length;i++)
        {
          if(arrAirport.includes(this.cmbAirport[i].code))
          {
            this.airports.arrival.unshift({arrCode:this.cmbAirport[i].code,arrName:this.cmbAirport[i].text,
              arrCityName:this.cmbAirport[i].cityname,arrCountryName:this.cmbAirport[i].countryname});
          }
        }
        this.topFlightSearchSkeleton=false;
        this.setFlightData();
    },500);
  }
setAirlineList(searchedAirline:any) {
  this.authService.getAirlineInfo().subscribe(data => {
    this.airlines=[];
    var d=data.airlinelist;
    let flight:any[]=[];
    for(let j=0;j<searchedAirline.length;j++)
    {
      let disclosure=searchedAirline[j].carrier.disclosure;
      if(disclosure!=undefined && disclosure!="")
      {
        flight.push({flightCode:disclosure,flightNumber:searchedAirline[j].carrier.marketingFlightNumber});
      }else{
        flight.push({flightCode:searchedAirline[j].carrier.marketing,flightNumber:searchedAirline[j].carrier.marketingFlightNumber});
      }
    }
    for(let i=0;i<d.length;i++)
    {
      var obj=flight.find(x=>x.flightCode==d[i].nvIataDesignator);
      if(obj!="" && obj!=undefined)
      {
        this.airlines.push({code:d[i].nvIataDesignator,logo:'',number:obj.flightNumber,name:d[i].nvAirlinesName,data:[],itineryData:[]});
      }
    }
    for(let i=0;i<searchedAirline.length;i++)
    {
      for(let j=0;j<this.airlines.length;j++)
      {
        let disclosure=searchedAirline[i].carrier.disclosure;
        if(disclosure!=undefined && disclosure!="")
        {
          if(this.airlines[j].code==disclosure)
          {
            this.airlines[j].data.unshift(searchedAirline[i]);
            break;
          }
        }else{
          if(this.airlines[j].code==searchedAirline[i].carrier.marketing)
          {
            this.airlines[j].data.unshift(searchedAirline[i]);
            break;
          }
        }
      }
    }
    this.setAirport(this.scheduleDescs);
    this.setItineryWiseAirlineInfo(this.itineraries,this.airlines,d);
  }, err => {
  console.log(JSON.stringify(err));
});
}
setItineryWiseAirlineInfo(searchedAirline:any,airlines:any,data:any)
{
  for(let i=0;i<searchedAirline.length;i++)
  {
    for(let j=0;j<airlines.length;j++)
    {
      let marketing=searchedAirline[i].pricingInformation[0].fare.validatingCarrierCode;
      if(this.getCurrentFlightCode(this.airlines[j].code)==marketing)
      {
        this.airlines[j].itineryData.unshift(searchedAirline[i].pricingInformation[0].fare);
        break;
      }
    }
  }
  for(let i=0;i<this.airlines.length;i++)
  {
    for(let j=0;j<data.length;j++)
    {
      if(this.airlines[i].code.toString().toLowerCase().trim()
      ==data[j].nvIataDesignator.toString().toLowerCase().trim())
      {
        this.airlines[i].logo=data[j].vLogo;
        break;
      }
    }
  }
}
getAirlineName(obj:string):string
{
  let ret:string="";

  try{
    if(this.airlines!=undefined && this.airlines!="")
    {
      for(let item of this.airlines)
      {
        if(item.code==obj)
        {
          ret=item.name;
          break;
        }
      }
    }
  }catch(exp){console.log("Get Airlines Name:"+exp);}
  return ret;
}
getAirlineLogo(obj:string):string
{
  let ret:string="";

  try{
    if(this.airlines!=undefined && this.airlines!="")
    {
      for(let item of this.airlines)
      {
        if(item.code==obj)
        {
          ret=item.logo;
          break;
        }
      }
    }
  }catch(exp){console.log("Get Airlines Name:"+exp);}
  return ret;
}
getDepCityName(obj:string):string{
  let ret:string="";
  try{
    if(this.airports!=undefined && this.airports!="")
    {

      for(let item of this.airports.departure)
      {
        if(item.depCode.toString().toLowerCase()===obj.toString().toLowerCase())
        {
          ret=item.depCityName;
          break;
        }
      }
    }
  }catch(exp){}
  return ret;
}
getDepCountryName(obj:string):string{
  let ret:string="";
  try{
    if(this.airports!=undefined && this.airports!="")
    {
      for(let item of this.airports.departure)
      {

        if(item.depCode.toString().toLowerCase()===obj.toString().toLowerCase())
        {
          ret=item.depCountryName;
          break;
        }
      }
    }
  }catch(exp){}
  return ret;
}
getArrCityName(obj:string):string{
  let ret:string="";
  try{
    if(this.airports!="" && this.airports!=undefined)
    {
      for(let item of this.airports.arrival)
      {
        if(item.arrCode.toString().toLowerCase()===obj.toString().toLowerCase())
        {
          ret=item.arrCityName;
          break;
        }
      }
    }
  }catch(exp){}
  return ret;
}
getArrCountryName(obj:string):string{
  let ret:string="";
  try{
    if(this.airports!="" && this.airports!=undefined)
    {
      for(let item of this.airports.arrival)
      {
        if(item.arrCode.toString().toLowerCase()===obj.toString().toLowerCase())
        {
          ret=item.arrCountryName;
          break;
        }
      }
    }
  }catch(exp){}
  return ret;
}
  private _setLoaderValue(obj:any){
    try{
      this.fromFlight=obj.fromFlightName;
      this.toFlight=obj.toFlightName;
      this.departureDate=obj.departureDate;
      this.returnDate=obj.departureDate;
      this.adult=obj.adult!=undefined?obj.adult:"0";
      this.child=obj.childList.length;
      this.infant=obj.infant!=undefined?obj.infant:"0";
      this.childListFinal=obj.childList;
      this.isLoad=true;
      this.cabinTypeId=this.flightHelper.getCabinTypeId(obj.classType),
      this.tripTypeId=this.getTripTypeId()
      if(obj.childList.length==0)
      {
        this.childListFinal=[];
        this.childList=[];
        this.childList2=[];
        this.child="0";
      }
    }catch(exp){}
  }
  moveLeftFlight() {
    this.flightItem.moveLeft();
  }

  moveRightFlight() {
    this.flightItem.moveRight();
  }
  moveLeftFare() {
    this.fareItem.moveLeft();
  }

  moveRightFare() {
    this.fareItem.moveRight();
  }
  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }
  dateChangeApi(type:boolean=true,item:any)
  {
    this.isCancellationShow=true;
    try{
      let dateCancel:DateChangeCancelModel={
        providerId: item.providerId,
        providerName: item.providerName,
        supplierID: item.supplierID,
        routeWiseMarkUpDiscountDetailsID: item.routeWiseMarkUpDiscountDetailsID,
        ticketIssueType: item.ticketIssueType,
        ticketIssueTypeCommission: item.ticketIssueTypeCommission,
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
        this.setResponseText(data.res,data.amount,item.airlineCode,type);
        this.isCancellationShow=false;
      },err=>{

      });
    }catch(exp){}
  }
  setResponseText(data:any,amount:any,airlineCode:any,type:boolean)
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
          this.setDateChangesAmount(data,amount,firstCap,secondCap);
        }else{
          this.setCancellationAmount(data,amount,firstCap,secondCap);
        }
      },err=>{});
    }catch(exp){
      console.log(exp);
    }
  }
  setDateChangesAmount(data:any,amount:any,firstCap:any,lastCap:any)
  {
    this.amtDateChanges="";
    this.amtDateChangesPlus=this.shareService.amountShowWithCommas(Math.round(amount));;
    this.amtDateChangesPre="";
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
      this.amtDateChanges=amt;
      this.amtDateChangesPre=pre;
    }catch(exp){
      let fare=envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let txt=fare.toString().replace(/\s+/g, ' ').trim();
      let crop=txt.substring(txt.indexOf(firstCap)+firstCap.length,txt.indexOf(lastCap));
      this.amtDateChanges=crop.split(' ')[1];
      this.amtDateChangesPre=crop.split(' ')[0];
    }
  }
  setCancellationAmount(data:any,amount:any,firstCap:any,lastCap:any)
  {
    this.amtCancellation="";
    this.amtCancellationPre="";
    this.amtCancellationPlus=this.shareService.amountShowWithCommas(Math.round(amount));
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
      this.amtCancellation=amt;
      this.amtCancellationPre=pre;
    }catch(exp){
      let fare=envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let txt=fare.toString().replace(/\s+/g, ' ').trim();
      let crop=txt.substring(txt.indexOf(firstCap)+firstCap.length,txt.indexOf(lastCap));
      this.amtCancellation=crop.split(' ')[1];
      this.amtCancellationPre=crop.split(' ')[0];
    }
  }
  getDateChanges(refund:boolean,passenger:any):any
  {
    try{
      if(refund==false)
      {
        return "Non Refundable + "+this.amtDateChangesPlus+"";
      }else{
        if(this.shareService.isNullOrEmpty(this.amtDateChanges))
        {
          return "Airline Fee "+" + "+this.amtDateChangesPlus+"";
        }
        return this.amtDateChangesPre+" "+this.shareService.amountShowWithCommas(Math.round(parseFloat(this.amtDateChanges)*parseInt(passenger)))+" + "+this.amtDateChangesPlus+"";
      }
    }catch(exp){}
  }
  getCancellation(refund:boolean,passenger:any):any
  {
    try{
      if(refund==false)
      {
        return "Non Refundable + "+this.amtCancellationPlus+"";
      }else{
        if(this.shareService.isNullOrEmpty(this.amtCancellation))
        {
          return "Airline Fee "+" + "+this.amtCancellationPlus+"";
        }
        return this.amtCancellationPre+" "+this.shareService.amountShowWithCommas(Math.round(parseFloat(this.amtCancellation)*parseInt(passenger)))+" + "+this.amtCancellationPlus+"";
      }
    }catch(exp){}
  }

}
