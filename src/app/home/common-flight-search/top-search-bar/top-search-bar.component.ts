import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { ShareService } from 'src/app/_services/share.service';
import { FlightRoutes } from 'src/app/model/flight-routes.model';
import { FlightHelperService } from '../../flight-helper.service';
import { AuthService } from 'src/app/_services/auth.service';
import yearDropdownPlugin from 'src/app/_services/flatpickr-yearDropdownPlugin';
import { format } from 'path';

@Component({
  selector: 'app-top-search-bar',
  templateUrl: './top-search-bar.component.html',
  styleUrls: ['./top-search-bar.component.css','../../../../assets/dist/css/custom.css']
})
export class TopSearchBarComponent implements OnInit {

  cmbAirportfromFlight:any[]=[];
  cmbAirporttoFlight:any[]=[];
  showBox = false;

  keywords: string = 'all';

  num1 = 0;
  num2 = 0;
  num3 = 0;
  public selectedClassTypeName: any = "";
  public selectedClassTypeCode:any="";
  public selectedClassTypeId: any = "";

  childList: number[] = [];
  childList2: number[] = [];
  childSelectList:number[]=[2,3,4,5,6,7,8,9,10,11];
  selectedFlightArrival: FlightRoutes[] = [];
  selectedFlightDeparture:FlightRoutes[]=[];
  selectedFlightDeparturePanel:FlightRoutes[]=[];
  selectedFlightArrivalPanel:FlightRoutes[]=[];
  isSuggDeparture1:boolean=false;
  isSuggDeparture2:boolean=false;
  isSuggDeparture3:boolean=false;
  isSuggDeparture4:boolean=false;
  tempDefaultDepArrFlight1:any=[];
  tempDefaultDepArrFlight2:any=[];
  tempDefaultDepArrFlight3:any=[];
  tempDefaultDepArrFlight4:any=[];
  tempAirportsDeparture1: any=[];
  tempAirportsDeparture2: any=[];
  tempAirportsDeparture3: any=[];
  tempAirportsDeparture4: any = [];
  tempAirportsArrival1: any=[];
  tempAirportsArrival2: any=[];
  tempAirportsArrival3: any=[];
  tempAirportsArrival4: any = [];
  childListFinal:any[]=[];

  isSuggReturn1:boolean=false;
  isSuggReturn2:boolean=false;
  isSuggReturn3:boolean=false;
  isSuggReturn4:boolean=false;

  @ViewChild('suggDeparture1') suggDeparture1:ElementRef|any;
  @ViewChild('suggReturn1') suggReturn1:ElementRef|any;
  @ViewChild('suggDeparture2') suggDeparture2:ElementRef|any;
  @ViewChild('suggReturn2') suggReturn2:ElementRef|any;
  @ViewChild('suggDeparture3') suggDeparture3:ElementRef|any;
  @ViewChild('suggReturn3') suggReturn3:ElementRef|any;
  @ViewChild('suggDeparture4') suggDeparture4:ElementRef|any;
  @ViewChild('suggReturn4') suggReturn4:ElementRef|any;

  selectTripType: FormControl = new FormControl()
  isOneway:boolean=false;
  isMulticity:boolean=false;
  isRoundtrip: boolean = false;
  public selectedTripTypeId: any = "";
  paramModelData: any;

  isMulticityTopSection: boolean = false;

  isAgentFare: boolean = false;
  classType: string[] = [];


  constructor(public flightHelper: FlightHelperService, public shareService: ShareService,
    private datePipe: DatePipe, private router: Router,private authService: AuthService) { }

  ngOnInit(): void {
    $("#travellersBox").css("display", "none");
    this.initSearchPanel();
  }
  initSearchPanel()
  {
    this.recentFlightSearch = JSON.parse(localStorage.getItem('recentFlightSearch')!);
    this.selectedFlightDeparture=[];
    this.selectedFlightArrival=[];
    this.selectedFlightDeparturePanel=[];
    this.selectedFlightArrivalPanel=[];
    this.num1=0,this.num2=0,this.num3=0;


    let knownAirportCodesfromFlight = new Set();
    let knownAirportCodestoFlight = new Set();
    this.recentFlightSearch.forEach(element => {
      knownAirportCodesfromFlight.add(element.fromFlight);
      knownAirportCodestoFlight.add(element.toFlight);
    });;

    const matchingAirportsfromFlight = this.flightHelper.getAirportData().filter((airport) => knownAirportCodesfromFlight.has(airport.code));
    const matchingAirportstoFlight = this.flightHelper.getAirportData().filter((airport) => knownAirportCodestoFlight.has(airport.code));

    this.cmbAirportfromFlight= matchingAirportsfromFlight;
    this.cmbAirporttoFlight= matchingAirportstoFlight;
    this.tempAirportsDeparture1=this.cmbAirportfromFlight.slice(0,15);
    this.tempAirportsArrival1=this.cmbAirporttoFlight.slice(0,15);
    this.tempAirportsDeparture2=this.cmbAirportfromFlight.slice(0,15);
    this.tempAirportsArrival2=this.cmbAirporttoFlight.slice(0,15);
    this.tempAirportsDeparture3=this.cmbAirportfromFlight.slice(0,15);
    this.tempAirportsArrival3=this.cmbAirporttoFlight.slice(0,15);
    this.tempAirportsDeparture4=this.cmbAirportfromFlight.slice(0,15);
    this.tempAirportsArrival4=this.cmbAirporttoFlight.slice(0,15);

    this.tempDefaultDepArrFlight1=this.cmbAirportfromFlight.slice(0,15);
    this.paramModelData=this.flightHelper.getLocalFlightSearch();
    this.isOneway=this.paramModelData.isOneWay;
    this.isRoundtrip=this.paramModelData.isRoundTrip;
    this.isMulticity=this.paramModelData.isMultiCity;
    this.childListFinal=this.paramModelData.childList;
    this.childList=this.paramModelData.childList1;
    this.childList2=this.paramModelData.childList2;
    this.num1=this.paramModelData.adult;
    this.num2=this.paramModelData.childList.length;
    this.num3=this.paramModelData.infant;
    this.selectedClassTypeId=this.paramModelData.cabinTypeId;
    this.selectedClassTypeCode=this.paramModelData.classType;
    this.selectedClassTypeName=this.flightHelper.getCabinTypeName(this.paramModelData.classType[0]);
    let tripVal=this.isOneway?"1":(this.isRoundtrip?"2":"3");
    this.selectTripType.setValue(tripVal);
    this.selectedTripTypeId=this.flightHelper.getTripTypeId(parseInt(tripVal));
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
        AirportCode:"",
        Date:this.paramModelData.Departure[i].Date
      };
      ret={
        Id:this.paramModelData.Arrival[i].Id,
        CityCode:this.paramModelData.Arrival[i].CityCode,
        CityName:this.paramModelData.Arrival[i].CityName,
        CountryCode:this.paramModelData.Arrival[i].CountryCode,
        CountryName:this.paramModelData.Arrival[i].CountryName,
        AirportName:this.paramModelData.Arrival[i].AirportName,
        AirportCode:"",
        Date:this.paramModelData.Arrival[i].Date
      };
      var x = this.paramModelData.Arrival[i].Date;
        this.selectedFlightDeparture.push(dept);
        this.selectedFlightDeparturePanel.push(dept);
        this.selectedFlightArrival.push(ret);
        this.selectedFlightArrivalPanel.push(ret);
    }
    var model = JSON.parse(localStorage.getItem('loaderData')!);
    this.classType = model.classType;
    console.log(this.classType);
    
    if(!model.isMultiCity){
      let selectDepartureDate = model.Departure[0].Date
      let selectReturnDate = model.Arrival[0].Date
      setTimeout(()=>{
        const formattedDate = new Date(selectDepartureDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
          minDate: "today",
          defaultDate: this.shareService.getFlatPickDate(selectDepartureDate)
        });
        let formattedReturnDate = new Date(selectReturnDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
        if(isNaN(formattedReturnDate.getTime())){
          formattedReturnDate = new Date(this.selectedFlightDeparture[0].Date.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
          minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparture[0].Date),
          defaultDate: this.shareService.getFlatPickDate(selectReturnDate)
        });
      });
    }
    if(model.fareType=='AAF637CB-ACDA-43DF-ABAE-88B0FCDFB8B7'){
      this.isAgentFare=false;
    }else if(model.fareType=='34BC9B43-75E7-49BF-B1B5-9D65441BAF31'){
      this.isAgentFare=true;
    }
  }
  recentFlightSearch: any[]=[];

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
    this.selectedTripTypeId = this.flightHelper.getTripTypeId(type);

    var model = JSON.parse(localStorage.getItem('loaderData')!);
    let selectDepartureDate = model.Departure[0].Date
    let selectReturnDate = model.Arrival[0].Date

    setTimeout(()=>{
      $("#travellersBox").css("display","none");
    });
    switch(type)
    {
      case 1:
        this.classType=[];
        this.classType.push("Y");
        this.selectedClassTypeName=this.flightHelper.getCabinTypeName(this.classType[0]);
        this.isOneway=true;
        this.clearReturn();
        // this.selectedFlightDeparturePanel[0].Date=this.getCurrentDate();
        this.selectedFlightDeparturePanel[0].Date=this.paramModelData.Departure[0].Date;
        this.selectedFlightArrivalPanel[0].Date="";
        $("#travellersBox").css("display","none");
        for(let i=1;i<this.selectedFlightDeparturePanel.length;i++) this.selectedFlightDeparturePanel.splice(i,1);
        for(let i=1;i<this.selectedFlightArrivalPanel.length;i++) this.selectedFlightArrivalPanel.splice(i,1);
        setTimeout(()=>{
          const formattedDate = new Date(selectDepartureDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
            minDate:"today",
            defaultDate: this.shareService.getFlatPickDate(selectDepartureDate)
          });
          let formattedReturnDate = new Date(selectReturnDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
          if(isNaN(formattedReturnDate.getTime())){
            formattedReturnDate = new Date(this.selectedFlightDeparture[0].Date.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparture[0].Date),
            defaultDate: this.shareService.getFlatPickDate(selectReturnDate)
          });
        });
        break;
      case 2:
        this.classType=[];
        this.classType.push("Y");
        this.classType.push("Y");
        this.selectedClassTypeName=this.flightHelper.getCabinTypeName(this.classType[0]);
        this.isRoundtrip=true;
        // this.selectedFlightDeparturePanel[0].Date=this.getCurrentDate();
        // this.selectedFlightArrivalPanel[0].Date=this.getCurrentDate();
        this.selectedFlightDeparturePanel[0].Date=this.paramModelData.Departure[0].Date;
        this.selectedFlightArrivalPanel[0].Date=this.paramModelData.Arrival[0].Date;
        for(let i=1;i<this.selectedFlightDeparturePanel.length;i++) this.selectedFlightDeparturePanel.splice(i,1);
        for(let i=1;i<this.selectedFlightArrivalPanel.length;i++) this.selectedFlightArrivalPanel.splice(i,1);
        $("#travellersBox").css("display","none");
        setTimeout(()=>{
          const formattedDate = new Date(selectDepartureDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
            minDate:"today",
            defaultDate: this.shareService.getFlatPickDate(selectDepartureDate)
          });
          let formattedReturnDate = new Date(selectReturnDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
          if(isNaN(formattedReturnDate.getTime())){
            formattedReturnDate = new Date(this.selectedFlightDeparture[0].Date.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparture[0].Date),
            defaultDate: this.shareService.getFlatPickDate(selectReturnDate)
          });
        });
        break;
      case 3:
        this.classType=[];
        this.classType.push("Y");
        this.selectedClassTypeName=this.flightHelper.getCabinTypeName(this.classType[0]);
        this.isMulticity=true;
        // this.selectedFlightDeparturePanel[0].Date=this.getCurrentDate();
        this.selectedFlightDeparturePanel[0].Date=this.paramModelData.Departure[0].Date;
        $("#travellersBox").css("display", "none");
        setTimeout(()=>{
          const formattedDate = new Date(selectDepartureDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
            minDate:"today",
            defaultDate: this.shareService.getFlatPickDate(selectDepartureDate)
          });
        });
        break;
      default:
        break;
    }
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
  trueFalseDeparture()
  {
    this.isSuggDeparture1=false;
    this.isSuggDeparture2=false;
    this.isSuggDeparture3=false;
    this.isSuggDeparture4=false;
  }
  flightFrom(ind:number)
  {
    debugger;
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
      let data;
        if(val.length==3){
          data=this.shareService.distinctList(this.flightHelper.getAirportData().filter(x=>
            (x.code).toString().toLowerCase().startsWith(val)));
          if(data.length==0){
            data=this.shareService.distinctList(this.flightHelper.getAirportData().filter(x=>
              (x.code).toString().toLowerCase().startsWith(val)
              || (x.cityname).toString().toLowerCase().startsWith(val)
              || (x.countryname).toString().toLowerCase().startsWith(val)
              || (x.text).toString().toLowerCase().startsWith(val)
              ));
          }
        }
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
  onFocused(e:any){
    this.tempAirportsDeparture1=this.flightHelper.getDistinctAirport(this.cmbAirportfromFlight).slice(0,15);
    this.tempAirportsArrival1=this.flightHelper.getDistinctAirport(this.cmbAirporttoFlight).slice(0,15);
    this.tempAirportsDeparture2=this.flightHelper.getDistinctAirport(this.cmbAirportfromFlight).slice(0,15);
    this.tempAirportsArrival2=this.flightHelper.getDistinctAirport(this.cmbAirporttoFlight).slice(0,15);
    this.tempAirportsDeparture3=this.flightHelper.getDistinctAirport(this.cmbAirportfromFlight).slice(0,15);
    this.tempAirportsArrival3=this.flightHelper.getDistinctAirport(this.cmbAirporttoFlight).slice(0,15);
    this.tempAirportsDeparture4=this.flightHelper.getDistinctAirport(this.cmbAirportfromFlight).slice(0,15);
    this.tempAirportsArrival4=this.flightHelper.getDistinctAirport(this.cmbAirporttoFlight).slice(0,15);
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
  trueFalseArrival()
  {
    this.isSuggReturn1=false;
    this.isSuggReturn2=false;
    this.isSuggReturn3=false;
    this.isSuggReturn4=false;
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
  tripTypeSet(id:any)
  {
    this.trueFalseSearchType();
    try{
      switch(parseInt(id))
      {
        case 1:
          this.isOneway=true;
          this.selectTripType.setValue(1);
          this.classType=[];
          this.classType.push("Y");
          break;
        case 2:
          this.isRoundtrip=true;
          this.selectTripType.setValue(2);
          this.classType=[];
          this.classType.push("Y");
          this.classType.push("Y");
          break;
        case 3:
          this.isMulticity=true;
          this.selectTripType.setValue(2);
          break;
      }
    }catch(exp){}
  }
  changeDepartureReturnDate(evt:any,type:string,ind:number)
  {
    debugger;
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
                const formattedDate = new Date(selectDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
                flatpickr(".flat-datepick-from"+ind, {
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
                  minDate:this.shareService.getFlatPickDate(new Date().toISOString()),
                  defaultDate: this.shareService.getFlatPickDate(selectDate)
                });
              });
              for(let i=ind+1;i<this.selectedFlightDeparturePanel.length;i++)
              {
                this.selectedFlightDeparturePanel[i].Date=selectDate;
                setTimeout(()=>{
                  const formattedDate = new Date(selectDate?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
                  flatpickr(".flat-datepick-from"+i, {
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
                    minDate:this.shareService.getFlatPickDate(new Date().toISOString()),
                    defaultDate:this.shareService.getFlatPickDate(selectDate)
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
              let formattedDate = new Date(this.selectedFlightDeparturePanel[ind].Date.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
              if(isNaN(formattedDate.getTime())){                
                formattedDate = new Date();
              }
              flatpickr(".flat-datepick-to", {
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
  returnCrossClick(){
    this.trueFalseSearchType();
    this.clearReturn();
    this.isOneway=true;
    this.tripTypeSet("1");
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
  travellerInfoOutside()
  {
    try{
      this.showBox=false;
    }catch(exp){}
  }
  _getTotalTravellers():number{
    return this.num1+this.num2+this.num3;
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
        debugger;
        if(this.num2>0)
        {
          if(this.num2<7)
          {
            //this.childList=this.shareService.removeList(this.num2,this.childList);
            this.childList.pop();
            this.childListFinal.splice(this.num2-1,1);
            this.num2--;
          }else{
            //this.childList2=this.shareService.removeList(this.num2,this.childList2);
            this.childList2.pop();
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
                  this.childList.push(6);
                  this.childListFinal.push(6);
                }else{
                  this.num2--;
                }
                break;
              case 2:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(6);
                  this.childListFinal.push(6);
                }else{
                  this.num2--;
                }
                break;
              case 3:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(6);
                  this.childListFinal.push(6);
                }else{
                  this.num2--;
                }
                break;
              case 4:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(6);
                  this.childListFinal.push(6);
                }else{
                  this.num2--;
                }
                break;
              case 4:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(6);
                  this.childListFinal.push(6);
                }else{
                  this.num2--;
                }
                break;
              case 5:
                this.num2++;
                if(9-this.num1>=this.num2)
                {
                  this.childList.push(6);
                  this.childListFinal.push(6);
                }else{
                  this.num2--;
                }
                break;
              case 6:
                this.num2++;
                if(this.num1-(this.num1-1)==this.num2)
                {
                  this.childList.push(6);
                  this.childListFinal.push(6);
                }else{
                  this.num2--;
                }
                break;
            }
          }else if(this.num2>=6 && this.num2<9)
          {
            this.num2++;
            this.childList2.push(6);
            this.childListFinal.push(6);
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
  setChildSet()
  {
    this.childListFinal=[];
    for(let i=0;i<this.childList.length;i++)
    {
      //this.childListFinal.push({id:this.childList[i],age:parseInt($("#child1"+i).val())});
      this.childListFinal.push({id:this.childList[i],age:parseInt('6')});
    }
    for(let i=0;i<this.childList2.length;i++)
    {
      //this.childListFinal.push({id:this.childList2[i],age:parseInt($("#child2"+i).val())});
      this.childListFinal.push({id:this.childList2[i],age:parseInt('6')});
    }
  }
  save(){
    this.setChildSet();
    this.showBox=false;
    $("#travellersBox").css("display","none");
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
  flightSearchWork():void
  {
    this.save();
    var fareType =$("#fareType").val();
    $("#travellersBox").css("display","none");
    var inboardClassType=$("input[name=Travellers_Class0]:checked").val();
    var outboardClassType=$("input[name=Travellers_Class1]:checked").val();
    var trip2ClassType=$("input[name=Travellers_Class2]:checked").val();
    var trip3ClassType=$("input[name=Travellers_Class3]:checked").val();
    var trip4ClassType=$("input[name=Travellers_Class4]:checked").val();
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
    let loaderData={
      Departure:multiDeparture,
      Arrival:multiArrival,
      adult:this.num1,
      amount:'',
      childList:this.getOnlyAge(this.childListFinal),infant:this.num3,classType:classType,airlines:'',stop:'2',
      //cabinTypeId:this.flightHelper.getCabinTypeId(classType),
      tripTypeId:this.flightHelper.getTripTypeId(0),childList1:this.childList,childList2:this.childList2,
      isOneWay:this.isOneway,isRoundTrip:this.isRoundtrip,isMultiCity:this.isMulticity,fareType:fareType
    };
    console.log(loaderData);
    this._setStoreFlightData(loaderData,false);
  }
  private _setStoreFlightData(data:any,isSave:boolean)
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
      if(loadData.Departure[i].CountryCode != loadData.Arrival[i].CountryCode)
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
      // this.saveFlightSearchHistory(data,isDomestic);
    }else{
      this._navigationWork(isDomestic);
    }
  }
  // getCountryCode(id:string):string
  // {
  //     let ret:string="";
  //     try{
  //       var data=this.cmbAirport.find(x=>x.code.toString().toLowerCase()==id.toString().toLowerCase());
  //       if(data!="" && data!=undefined)
  //       {
  //         ret=data.countrycode;
  //       }
  //     }catch(exp){}
  //     return ret;
  // }
  private _navigationWork(isDomestic:boolean):void
  {
    location.reload();
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
    } else {
      localStorage.setItem('isDomestic',"False");
      if(this.isOneway)
      {
        this.router.navigate(['/home/common-flight-search']);
      }else if(this.isRoundtrip)
      {
        this.router.navigate(['/home/common-flight-search']);
        window.location.reload();
      }else if(this.isMulticity)
      {
        this.router.navigate(['/home/common-flight-search']);
      }
    }
  }
  topMulticitySection()
  {
    debugger;
    if(this.isMulticityTopSection)
    {
      this.isMulticityTopSection=false;
    }else{
      this.isMulticityTopSection = true;
      var model = JSON.parse(localStorage.getItem('loaderData')!);
      let len = model.Departure.length;
      setTimeout(async ()=>{
        for(let i=0;i<len;i++)
        {
          let minDate;
          if (i==0) {
            minDate = await this.shareService.getFlatPickDate(this.selectedFlightDeparture[i].Date);
          }
          else {
            minDate = await this.shareService.getFlatPickDate(this.selectedFlightDeparture[i-1].Date);
          }
          const formattedDate = new Date(this.selectedFlightDeparture[i].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
          flatpickr(".flat-datepick-from"+i, {
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
            minDate: minDate,
            defaultDate: this.shareService.getFlatPickDate(this.selectedFlightDeparture[i].Date)
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
  getMultiRoutes(): string
  {
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
  childSelect(val:any,i:number)
  {
    try{
      this.childListFinal[i]=parseInt(val);
    }catch(exp){}
  }
  addRemoveCity(isDel:boolean=false,delIdx:number=-1)
  {
    try{
      var trip1=$("#trip0").css("display");
      var trip2=$("#trip1").css("display");
      var trip3=$("#trip2").css("display");
      var trip4=$("#trip3").css("display");
      if(isDel && delIdx>-1)
      {
        this.selectedFlightDeparturePanel.splice(delIdx,1);
        this.selectedFlightArrivalPanel.splice(delIdx,1);
        this.classType.splice(delIdx,1);
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
          const formattedDate = new Date(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
          this.classType=[];
          this.classType.push("Y");
          this.classType.push("Y");
          this.classType.push("Y");
          this.classType.push("Y");
          this.selectedClassTypeName=this.flightHelper.getCabinTypeName(this.classType[0]);
        }
        setTimeout(()=>{
          const formattedDate = new Date(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date)
          });
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
          this.classType=[];
          this.classType.push("Y");
          this.classType.push("Y");
          this.classType.push("Y");
          this.selectedClassTypeName=this.flightHelper.getCabinTypeName(this.classType[0]);
        }
        setTimeout(()=>{
          const formattedDate = new Date(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date)
          });
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length-1].Date)
          });
        });
      }else if((trip1=="block" || trip1=="flex"))
      {
        $("#trip1").css("display","block");
        $("#tripAction1").css("display","block");
        this.selectedFlightDeparturePanel[1].Date=this.selectedFlightDeparturePanel[0].Date;
        this.classType=[];
        this.classType.push("Y");
        this.classType.push("Y");
        this.selectedClassTypeName=this.flightHelper.getCabinTypeName(this.classType[0]);
        setTimeout(()=>{
          const formattedDate = new Date(this.selectedFlightDeparturePanel[0].Date?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
          });
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
          });
        });
      }else{
        $("#trip0").css("display","block");
        $("#tripAction0").css("display","block");
      }
    }catch(exp){}
  }

}
