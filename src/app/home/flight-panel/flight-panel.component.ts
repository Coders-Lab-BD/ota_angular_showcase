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
import { Component, ElementRef, Inject, OnInit,HostListener, Renderer2, SystemJsNgModuleLoader, ViewChild, Input } from '@angular/core';
import * as moment from 'moment';
import {Observable, Subject, merge, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, first, map} from 'rxjs/operators';
import { FlightHelperService } from '../flight-helper.service';
import flatpickr from "flatpickr";
import { DragScrollComponent, DragScrollModule } from 'ngx-drag-scroll';
import { BookModel } from 'src/app/model/book-model.model';
import { MarkuDiscountModel } from 'src/app/model/marku-discount-model.model';
import { CancellationModel } from 'src/app/model/cancellation-model';
import { FlightRoutes } from 'src/app/model/flight-routes.model';
import { PassengerTypeAmtModel } from 'src/app/model/passenger-type-amt-model';
import { TripModel } from 'src/app/model/trip-model';
import { SuggestTrueFalse } from 'src/app/model/suggest-true-false';
import { AirportsAnyModel } from 'src/app/model/airports-any-model';
import { IDCodeNameModel } from 'src/app/model/idcode-name-model';
declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-flight-panel',
  templateUrl: './flight-panel.component.html',
  styleUrls: ['./flight-panel.component.css']
})
export class FlightPanelComponent implements OnInit {
  fmgSearchHistory:FormGroup|any;
  fmgSearchHistoryInfo:FormGroup|any;
  fmgSearchHistoryDetails:FormGroup|any;
  selectedFlightDeparturePanel:FlightRoutes[]=[];
  selectedFlightDeparture:FlightRoutes[]=[];
  selectedFlightArrivalPanel:FlightRoutes[]=[];
  selectedFlightArrival:FlightRoutes[]=[];
  childList:number[]=[];
  childList2:number[]=[];
  childListFinal:any[]=[];
  childSelectList:number[]=[2,3,4,5,6,7,8,9,10,11];
  SugBoolDept:SuggestTrueFalse[]=[];
  SugBoolArr:SuggestTrueFalse[]=[];
  TempAirports:AirportsAnyModel[]=[];
  TempAirportsDefault:AirportsAnyModel[]=[];
  isSuggDeparture:boolean=false;
  tempAirportsDeparture:any;
  keywords:string = 'all';
  @ViewChild('suggDeparture1') suggDeparture1:ElementRef|any;
  @ViewChild('suggReturn1') suggReturn1:ElementRef|any;
  @ViewChild('suggDeparture2') suggDeparture2:ElementRef|any;
  @ViewChild('suggReturn2') suggReturn2:ElementRef|any;
  @ViewChild('suggDeparture3') suggDeparture3:ElementRef|any;
  @ViewChild('suggReturn3') suggReturn3:ElementRef|any;
  @ViewChild('suggDeparture4') suggDeparture4:ElementRef|any;
  @ViewChild('suggReturn4') suggReturn4:ElementRef|any;
  @Input() TripNumber: number=0;
  @Input() AirlineList:any[]=[];
  @Input() panelCabinType:IDCodeNameModel=new IDCodeNameModel;
  @Input() panelPassenger:PassengerTypeAmtModel=new PassengerTypeAmtModel;
  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
  private router: Router, private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,public flightHelper:FlightHelperService) { }

  ngOnInit(): void {
    this.init();
  }
  init()
  {
    let i:number=4;
    while(i!=0)
    {
      let tempAirports=this.flightHelper.cmbAirport.slice(0,15);
      this.SugBoolDept.push({
        SugDeparture:false,SugReturn:false
      });
      this.SugBoolArr.push({
        SugDeparture:false,SugReturn:false
      });
      this.TempAirports.push({
        DepartureList:tempAirports,ArrivalList:tempAirports
      });
      i-=1;
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
  onChangeSearch(val: string,type:string,ind:number) {
    try{
      val=val.toLowerCase();
      type=type.toLowerCase();
      let data=this.shareService.distinctList(this.flightHelper.cmbAirport.filter(x=>
        (x.code).toString().toLowerCase().startsWith(val)
        || (x.cityname).toString().toLowerCase().startsWith(val)
        || (x.countryname).toString().toLowerCase().startsWith(val)
        || (x.text).toString().toLowerCase().startsWith(val)
        ));
      if(type.indexOf("from")>-1)
      {
        if(data.length>15)
        {
          this.TempAirports[ind].DepartureList=data.slice(0,15);
        }else{
          this.TempAirports[ind].DepartureList=data;
        }
      }else{
        if(data.length>15)
        {
          this.TempAirports[ind].ArrivalList=data.slice(0,15);
        }else{
          this.TempAirports[ind].ArrivalList=data;
        }
      }
    }catch(exp){}
  }
  onFocused(e:any){
    let i:number=0;
    while(i<4)
    {
      this.TempAirports[i].DepartureList=this.flightHelper.getDistinctAirport(this.flightHelper.cmbAirport).slice(0,15);
      this.TempAirports[i].ArrivalList=this.flightHelper.getDistinctAirport(this.flightHelper.cmbAirport).slice(0,15);
    }
  }
  getSelectedDate(i:number,type:string):string
  {
    let ret:string="";
    type=type.toLowerCase();
    try{
      let date;
      if(type.indexOf("departure")>-1)
      {
        date=this.selectedFlightDeparturePanel[i].Date;
      }else{
        date=this.selectedFlightArrivalPanel[i].Date;
      }
      ret=this.shareService.getDayNameShort(date)+", "+
      this.shareService.getDay(date)+" "+
      this.shareService.getMonthShort(date)+"'"+
      this.shareService.getYearShort(date);
    } catch(exp)
    {}
    return ret;
  }
  returnCrossClick(ind:number=0){
    this.selectedFlightArrivalPanel[ind].Date="";
    this.TripNumber=1;
  }
  changeDepartureReturnDate(evt:any,type:any,ind:number)
  {
      try{
        let val=evt.srcElement.value;
        if(!this.shareService.isNullOrEmpty(val))
        {
          if(type=="departure")
          {
            flatpickr(".flat-datepick-to", {
              enableTime: false,
              dateFormat: "d-m-Y",
              allowInput:true,
              minDate:this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparturePanel[ind].Date),'0',2)+"."+
              this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparturePanel[ind].Date),'0',2)+"."+
              this.shareService.getYearLong(this.selectedFlightDeparturePanel[ind].Date)
            });
          }
          if(type=="return")
          {
            // this.selectedReturnPanel=
            // this.shareService.getDayNameShort(this.selectedFlightArrivalPanel[ind].Date)+", "+
            // this.shareService.getDay(this.selectedFlightArrivalPanel[ind].Date)+" "+
            // this.shareService.getMonthShort(this.selectedFlightArrivalPanel[ind].Date)+"'"+
            // this.shareService.getYearShort(this.selectedFlightArrivalPanel[ind].Date);

            // this.tripTypeSet("2");
          }
        }

      }catch(exp){}
  }
  flightSearchWork():void
  {
    $("#travellersBox").css("display","none");
    let multiDeparture:any[]=[];
    let multiArrival:any[]=[];
    for(let i=0;i<this.selectedFlightDeparturePanel.length;i++)
    {
      this.selectedFlightDeparture[i].Id=this.selectedFlightDeparturePanel[i].Id;
      this.selectedFlightDeparture[i].CityName=this.selectedFlightDeparturePanel[i].CityName;
      this.selectedFlightDeparture[i].CountryCode=this.selectedFlightDeparturePanel[i].CountryCode;
      this.selectedFlightDeparture[i].CountryName=this.selectedFlightDeparturePanel[i].CountryName;

      this.selectedFlightArrival[i].Id=this.selectedFlightArrivalPanel[i].Id;
      this.selectedFlightArrival[i].CityName=this.selectedFlightArrivalPanel[i].CityName;
      this.selectedFlightArrival[i].CountryCode=this.selectedFlightArrivalPanel[i].CountryCode;
      this.selectedFlightArrival[i].CountryName=this.selectedFlightArrivalPanel[i].CountryName;

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

    let loaderData={Departure:multiDeparture,Arrival:multiArrival,adult:this.panelPassenger.Adult,
      childList:this.childListFinal,infant:this.panelPassenger.Infant,classType:this.panelCabinType.Code,airlines:"",stop:2,
      cabinTypeId:this.panelCabinType.ID,tripTypeId:this.flightHelper.getTripTypeId(this.TripNumber),
      isOneWay:this.TripNumber==1?true:false,isRoundTrip:this.TripNumber==3?true:false,isMultiCity:this.TripNumber==3?true:false
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
      if(this.TripNumber==3)
      {
        let loadData:any=JSON.parse(JSON.stringify(data));
        for(let i=0;i<loadData.Departure.length;i++)
        {
          if(this.flightHelper.getCountryCode(loadData.Departure[i].CityCode,this.flightHelper.cmbAirport)!=
          this.flightHelper.getCountryCode(loadData.Arrival[i].CityCode,this.flightHelper.cmbAirport))
          {
            isDomestic=false;
            break;
          }
        }
      }else{
        let checkFromFlight=this.flightHelper.getCountryCode(data.fromFlightCode,this.flightHelper.cmbAirport);
        let checkToFlight=this.flightHelper.getCountryCode(data.toFlightCode,this.flightHelper.cmbAirport);
        if(checkFromFlight!=checkToFlight)
        {
          isDomestic=false;
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
        let airlinesId=this.AirlineList.find(x=>x.id==data.airlines);
        if(this.shareService.isObjectEmpty(airlinesId))
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
        if(this.TripNumber==3)
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
  travellerFrom()
  {
    if($("#travellersBox").css("display")=="none")
    {
      $("#travellersBox").css("display","block");
    }else{
      $("#travellersBox").css("display","none");
    }
  }
  travellerInfoOutside()
  {
    try
    {
    }catch(exp){}
  }
  save()
  {
    $("#travellersBox").css("display","none");
    this._setChildSet();
  }
  private _setChildSet()
  {
    this.childListFinal=[];
    for(let i=0;i<this.childList.length;i++) this.childListFinal.push({id:this.childList[i],age:parseInt($("#childX"+i).val())});
    for(let i=0;i<this.childList2.length;i++) this.childListFinal.push({id:this.childList2[i],age:parseInt($("#childY"+i).val())});
  }
  private _navigationWork(isDomestic:boolean):void
  {
      if(isDomestic)
      {
        if(this.TripNumber==1)
        {
          this.router.navigate(['/home/domestic-one-way-flight-search']);
        }else if(this.TripNumber==2)
        {
          this.router.navigate(['/home/dom-roundtrip']);
        }else if(this.TripNumber==3)
        {
          this.router.navigate(['/home/dom-multicity']);
        }
      }else{
        if(this.TripNumber==1)
        {
          this.router.navigate(['/home/international-one-way-flight-search']);
        }else if(this.TripNumber==2)
        {
          this.router.navigate(['/home/int-roundtrip']);
        }else if(this.TripNumber==3)
        {
          this.router.navigate(['/home/int-multicity']);
        }
      }
  }
  plus(type:string) {
    if((this._getTotalTravellers())<9)
    {
      switch(type)
      {
        case "adult":
          if(this.panelPassenger.Adult<7 && this.panelPassenger.Child<7)
          {
            this.panelPassenger.Adult++;
          }
          switch(this.panelPassenger.Adult){
            case 2:
              if(this.panelPassenger.Child>5)
              {
                this.childList=this.shareService.removeList(this.panelPassenger.Child,this.childList);
                this.panelPassenger.Child--;
              }
              break;
            case 3:
              while(4<this.panelPassenger.Child)
              {
                this.childList=this.shareService.removeList(this.panelPassenger.Child,this.childList);
                this.panelPassenger.Child--;
              }
              break;
            case 4:
              while(3<this.panelPassenger.Child)
              {
                this.childList=this.shareService.removeList(this.panelPassenger.Child,this.childList);
                this.panelPassenger.Child--;
              }
              break;
            case 5:
              while(2<this.panelPassenger.Child)
              {
                this.childList=this.shareService.removeList(this.panelPassenger.Child,this.childList);
                this.panelPassenger.Child--;
              }
              break;
            case 6:
              while(1<this.panelPassenger.Child)
              {
                this.childList=this.shareService.removeList(this.panelPassenger.Child,this.childList);
                this.panelPassenger.Child--;
              }
              break;
            case 7:
              while(0<this.panelPassenger.Child)
              {
                this.childList=this.shareService.removeList(this.panelPassenger.Child,this.childList);
                this.panelPassenger.Child--;
              }
              break;
          }
          break;
        case "child":
          if(this.panelPassenger.Child<6)
          {
            switch(this.panelPassenger.Adult){
              case 1: case 0:
                this.panelPassenger.Child++;
                if(7-this.panelPassenger.Adult>=this.panelPassenger.Child)
                {
                  this.childList.push(this.panelPassenger.Child);
                }else{
                  this.panelPassenger.Child--;
                }
                break;
              case 2:
                this.panelPassenger.Child++;
                if(7-this.panelPassenger.Adult>=this.panelPassenger.Child)
                {
                  this.childList.push(this.panelPassenger.Child);
                }else{
                  this.panelPassenger.Child--;
                }
                break;
              case 3:
                this.panelPassenger.Child++;
                if(7-this.panelPassenger.Adult>=this.panelPassenger.Child)
                {
                  this.childList.push(this.panelPassenger.Child);
                }else{
                  this.panelPassenger.Child--;
                }
                break;
              case 4:
                this.panelPassenger.Child++;
                if(7-this.panelPassenger.Adult>=this.panelPassenger.Child)
                {
                  this.childList.push(this.panelPassenger.Child);
                }else{
                  this.panelPassenger.Child--;
                }
                break;
              case 4:
                this.panelPassenger.Child++;
                if(7-this.panelPassenger.Adult>=this.panelPassenger.Child)
                {
                  this.childList.push(this.panelPassenger.Child);
                }else{
                  this.panelPassenger.Child--;
                }
                break;
              case 5:
                this.panelPassenger.Child++;
                if(7-this.panelPassenger.Adult>=this.panelPassenger.Child)
                {
                  this.childList.push(this.panelPassenger.Child);
                }else{
                  this.panelPassenger.Child--;
                }
                break;
              case 6:
                this.panelPassenger.Child++;
                if(this.panelPassenger.Adult-(this.panelPassenger.Adult-1)==this.panelPassenger.Child)
                {
                  this.childList.push(this.panelPassenger.Child);
                }else{
                  this.panelPassenger.Child--;
                }
                break;
            }
          }else if(this.panelPassenger.Child>=6 && this.panelPassenger.Child<9)
          {
            this.panelPassenger.Child++;
            this.childList2.push(this.panelPassenger.Child);
          }
          break;
        case "infant":
          if(this.panelPassenger.Infant<7 && this.panelPassenger.Infant<this.panelPassenger.Adult)
          {
            this.panelPassenger.Infant++;
          }
          break;
      }
    }
  }
  minus(type:string) {
    switch(type)
    {
      case "adult":
        if(this.panelPassenger.Adult>0)
        {
          this.panelPassenger.Adult--;
        }
        if(this.panelPassenger.Adult<this.panelPassenger.Infant)
        {
          this.panelPassenger.Infant--;
        }
        break;
      case "child":
        if(this.panelPassenger.Child>0)
        {
          if(this.panelPassenger.Child<7)
          {
            this.childList=this.shareService.removeList(this.panelPassenger.Child,this.childList);
            this.panelPassenger.Child--;
          }else{
            this.childList2=this.shareService.removeList(this.panelPassenger.Child,this.childList2);
            this.panelPassenger.Child--;
          }
        }
        break;
      case "infant":
        if(this.panelPassenger.Infant>0)
        {
          this.panelPassenger.Infant--;
        }
        break;
    }
  }
  _getTotalTravellers():number{
    return this.panelPassenger.Adult+this.panelPassenger.Child+this.panelPassenger.Infant;
  }
  exchangeDepartureArrival(i:number)
  {
    let temp:FlightRoutes=this.selectedFlightDeparturePanel[i];
    this.selectedFlightDeparturePanel[i]=this.selectedFlightArrivalPanel[i];
    this.selectedFlightArrivalPanel[i]=temp;
  }
  flightFromOutside(ind:number)
  {
    try{
      this.TempAirports[ind].DepartureList=this.flightHelper.cmbAirport.slice(0,15);
      this.SugBoolDept[ind].SugDeparture=false;
      this.isSuggDeparture=false;
      this.tempAirportsDeparture=this.flightHelper.cmbAirport.slice(0,15);
      // console.log("Departure Check");
      // console.log(this.tempAirportsDeparture);
      // console.log(this.TempAirports[ind].DepartureList);

    }catch(exp){}
  }
  flightToOutside(ind:number)
  {
    try{
      this.TempAirports[ind].ArrivalList=this.flightHelper.cmbAirport.slice(0,15);
      this.SugBoolDept[ind].SugReturn=false;
    }catch(exp){}
  }
  flightFrom(ind:number)
  {
    try{
      this.trueFalseDeparture();
      this.SugBoolDept[ind].SugDeparture=true;
      if(ind==0)
      {
        setTimeout(()=>{
          this.isSuggDeparture=true;
          this.suggDeparture1.focus();
        });
      }else if(ind==1)
      {
        setTimeout(()=>{
          this.suggDeparture2.focus();
        });
      }else if(ind==2)
      {
        setTimeout(()=>{
          this.suggDeparture3.focus();
        });
      }else if(ind==3)
      {
        setTimeout(()=>{
          this.suggDeparture4.focus();
        });
      }
    }catch(exp){}
  }
  flightTo(ind:number)
  {
    try{
      this.trueFalseArrival();
      this.SugBoolArr[ind].SugReturn=true;
        if(ind==0)
        {
          setTimeout(()=>{
            this.suggReturn1.focus();
          });
        }else if(ind==1)
        {
          setTimeout(()=>{
            this.suggReturn2.focus();
          });
        }else if(ind==2)
        {
          setTimeout(()=>{
            this.suggReturn3.focus();
          });
        }else if(ind==3)
        {
          setTimeout(()=>{
            this.suggReturn4.focus();
          });
        }
    }catch(exp){}
  }
  getSelectedData(i:number,type:string):string
  {
    let ret:string="Select City";
    type=type.toLowerCase();
    try{
      if(type.indexOf("departure"))
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
  trueFalseDeparture()
  {
    for(let item of this.SugBoolDept)
    {
      item.SugDeparture=false;
      item.SugReturn=false;
    }
  }
  trueFalseArrival()
  {
    for(let item of this.SugBoolArr)
    {
      item.SugDeparture=false;
      item.SugReturn=false;
    }
  }
  changeClassLabel(code:string)
  {
    try{
      this.panelCabinType.Code=code;
      this.panelCabinType.ID=this.flightHelper.getCabinTypeId(code);
      this.panelCabinType.Name=this.flightHelper.getCabinTypeName(code);
      let x=this._getTotalTravellers()+"Travellers,"+this.panelCabinType.Name;
      if(x.length>18)
      {
        let y=this._getTotalTravellers()+"Travellers,";
        this.panelCabinType.Name=this.panelCabinType.Name.toString().substring(0,18-y.length)+"..";
      }
    }catch(exp){}
  }
  tripChange(event:any)
  {
    var type=event.target.value;
    this.TripNumber=Number.parseInt(type);
    if(this.TripNumber==1)
    {
      this.selectedFlightArrival[0].Date="";
    }else if(this.TripNumber==2)
    {
      this.selectedFlightArrival[0].Date=this.getCurrentDate();
    }
  }
  getCurrentDate():any
  {
    return this.shareService.getYearLong()+"-"+
    this.shareService.padLeft(this.shareService.getMonth(),'0',2)+"-"+this.shareService.padLeft(this.shareService.getDay(),'0',2);
  }
}
