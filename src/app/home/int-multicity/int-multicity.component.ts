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
import { BookModel } from 'src/app/model/book-model.model';
import { CancellationModel } from 'src/app/model/cancellation-model';
import { FilterModel } from 'src/app/model/filter-model';
import { PassengerTypeAmtModel } from 'src/app/model/passenger-type-amt-model';
import { IDCodeNameModel } from 'src/app/model/idcode-name-model';
import { DateChangeCancelModel } from 'src/app/model/date-change-cancel-model.model';
declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-int-multicity',
  templateUrl: './int-multicity.component.html',
  styleUrls: ['./int-multicity.component.css']
})
export class IntMulticityComponent implements OnInit {
  urlMain = "./assets/dist/js/main.min.js";

  flightFromModel:any;
  flightToModel:any;

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
  flightSearchSkeleton1:boolean=true;
  flightSearchSkeleton2:boolean=true;
  flightSearchSkeleton3:boolean=true;
  flightSearchSkeleton4:boolean=true;
  topFlightSearchSkeleton:boolean=true;
  isSuggReturnMobile:boolean=false;
  isMulticityTopSection:boolean=false;

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
  childListFinal:any[]=[];
  childSelectList:number[]=[2,3,4,5,6,7,8,9,10,11];

  cDay:number=Number(this.shareService.getDay(""));
  cMonth:number=Number(this.shareService.getMonth(""));
  cYear:number=Number(this.shareService.getYearLong(""));

  deptDate:string|undefined;
  retDate:string|undefined;

  loadAPI: Promise<any> | any;
  groupAirlines:any;
  ItineryWiseAirlines:any;
  airports:any=[];
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
  providerId:string="";

  public selectedDeparturePanelText:any="";
  public selectedReturnPanelText:any="";
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
  fareComponentDescs:any;
  baggageAllowanceDescs:any;

  airlines:any[]=[];
  topFlights:any[]=[];
  selectedAirFilterList:string[]=[];
  selectedDeptTimeList:any[]=[];
  selectedArrTimeList:any[]=[];
  tempFilterItinery:any[]=[];
  udMinRangeVal:number=0;
  stopCountList:any[]=[];
  departureTimeFilter:any[]=[];
  arrivalTimeFilter:any[]=[];
  refundFilterList:boolean[]=[];
  appliedFilter:FilterModel[]=[];
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
  cmbAirport:any[]=[];
  cmbAirlines:any[]=[];
  cmbAirCraft:any[]=[];
  bookInstantEnableDisable:BookModel[]=[];
  fareDetailsModalData:any=[];
  flightDetailsModalData:any=[];
  tempAirportsDeparture: any=[];
  tempAirportsArrival: any=[];
  tempDefaultDepArrFlight:any=[];
  popularFilter:any[]=[];
  makeProposalData:any=[];
  queFlightDetailsLeft:any=[];
  queFlightDetailsRight:any=[];
  queFlightData:any={};
  markupList:any[]=[];


  keywords:string = 'all';
  isFlightSearchBody:number=0;
  tempAirportsDeparture1: any=[];
  tempAirportsDeparture2: any=[];
  tempAirportsDeparture3: any=[];
  tempAirportsDeparture4: any=[];

  tempAirportsArrival1: any=[];
  tempAirportsArrival2: any=[];
  tempAirportsArrival3: any=[];
  tempAirportsArrival4: any=[];

  CancellationList:CancellationModel[]=[];

  flightSearchSkeleton:boolean=true;

  isCancellationShow:boolean=true;
  selectedFlightDeparture:FlightRoutes[]=[];
  selectedFlightDeparturePanel:FlightRoutes[]=[];
  selectedFlightDepartureMobile:FlightRoutes[]=[];
  selectedFlightArrival:FlightRoutes[]=[];
  selectedFlightArrivalPanel:FlightRoutes[]=[];
  selectedFlightArrivalMobile:FlightRoutes[]=[];
  selectedRadioFlightDetails:any[]=[];
  tempDefaultDepArrFlight1:any=[];
  tempDefaultDepArrFlight2:any=[];
  tempDefaultDepArrFlight3:any=[];
  tempDefaultDepArrFlight4:any=[];
  panelPassenger: PassengerTypeAmtModel={
    Adult:0,Child:0,Infant:0
  };
  panelCabinType: IDCodeNameModel = new IDCodeNameModel;

  @ViewChild('returnDatePick') returnDatePick:ElementRef | any;
  @ViewChild('roundTripButton') roundTripButton : ElementRef | any;
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
  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
  private router: Router, private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,public flightHelper:FlightHelperService,private datePipe: DatePipe) { }

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
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'flight_search_details');
  }
  init()
  {
    this.fmgFlightSearch=this.fb.group({
      FlightSearch:new FormArray([])
    });
    this.fmgFlightSearchWay=this.fb.group({
      fromFlight:['',Validators.required],
      toFlight:['',Validators.required],
      departureDate:['',Validators.required],
      returnDate:['',Validators.required],
      adult:['',Validators.required],
      childList:new FormArray([]),
      infant:['',Validators.required],
      classType:['',Validators.required],
      airlines:['',Validators.required],
      airlinesOperating:['',Validators.required],
      airlinesMarketing:['',Validators.required],
      airlinesNumber:['',Validators.required],
      stop:['',Validators.required],
      providerId:['',Validators.required],
      userId:['',Validators.required],
      cabinTypeId:['',Validators.required],
      tripTypeId:['',Validators.required],
      Domestic:['',Validators.required],
    });
    this._initSearchHistoryForm();
    this._initBoringTools();
    $("#travellersBox").css("display","none");
  }
  _initBoringTools()
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
      minDate:"today"
    });
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
  getAgencyPermission()
  {
    var userId=this.shareService.getUserId();
    try{
      this.authService.getAgencyPermit(userId).subscribe(data => {
        if(data.data)
        {
          this.initSearchPanel();
          this.getMarkupTypeList();
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
      console.log(exp);
    }
  }
  bookAndHoldAction(groupCode:string)
  {
    let flightIndi=this.selectedRadioFlightDetails.filter(x=>x.groupAirlineCode.indexOf(groupCode)>-1);
    if("flightDataIndividual" in localStorage)
    {
      localStorage.removeItem("flightDataIndividual");
    }
    var data=JSON.parse(JSON.stringify(this.paramModelData));
    localStorage.setItem("flightDataIndividual",JSON.stringify(flightIndi));
    this.router.navigate(['/home/passenger-details']);
  }
  bookAndHoldAction1(groupCode:string,providerName:any)
  {
    let flightIndi=this.selectedRadioFlightDetails.filter(x=>x.groupAirlineCode.indexOf(groupCode)>-1 && x.providerName.indexOf(providerName)>-1);
    if("flightDataIndividual" in localStorage)
    {
      localStorage.removeItem("flightDataIndividual");
    }
    var data=JSON.parse(JSON.stringify(this.paramModelData));
    localStorage.setItem("flightDataIndividual",JSON.stringify(flightIndi));
    this.router.navigate(['/home/passenger-details']);
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
  initSearchPanel()
  {
    this.selectedFlightDeparture=[];
    this.selectedFlightArrival=[];
    this.selectedFlightDeparturePanel=[];
    this.selectedFlightArrivalPanel=[];
    this.selectedFlightDepartureMobile=[];
    this.selectedFlightArrivalMobile=[];
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
        AirportCode:""};
        this.selectedFlightDeparture.push(dept);
        this.selectedFlightDeparturePanel.push(dept);
        this.selectedFlightDepartureMobile.push(dept);
        this.selectedFlightArrival.push(ret);
        this.selectedFlightArrivalPanel.push(ret);
        this.selectedFlightArrivalMobile.push(ret);
    }
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
      this.tripTypeId=this.flightHelper.getTripTypeId(3);
      if(obj.childList.length==0)
      {
        this.childListFinal=[];
        this.childList=[];
        this.childList2=[];
        this.child="0";
      }
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
  getFlightSearch(modelData:any) {
    this.isLoad=false;
    this.isNotFound=false;
    setTimeout(() => {
      if(modelData!=undefined && modelData!="")
      {
        var data=JSON.parse(JSON.stringify(modelData));
        this.isLoad=true;
        this._setLoaderValue(data);
        this._setFormGroupInfo(data);
        this.fareSearchSkeleton=true;
        this.topFlightSearchSkeleton=true;
        try{
          this.authService.getFlightSearch(Object.assign({},this.fmgFlightSearch.value)).subscribe( data=>{
            // console.log(" Flight Data:::");
            // console.log(JSON.stringify(data));
            var data=data.data[0];
            let isNF=0;
            this.isLoad=false;
            if(!this.shareService.isObjectEmpty(data))
            {
              this.providerId=data.providerId;
              if(!this.shareService.isObjectEmpty(data.flightData))
              {
                if(!this.shareService.isObjectEmpty(data.flightData[0].groupedItineraryResponse))
                {
                  if(data.flightData[0].groupedItineraryResponse.statistics.itineraryCount>0)
                  {
                    isNF=1;
                    this.rootData=data.flightData[0].groupedItineraryResponse;
                    this.itineraries=data.flightData[0].groupedItineraryResponse.itineraryGroups[0].itineraries;
                    this.scheduleDescs=this.rootData.scheduleDescs;
                    this.legDescs=this.rootData.legDescs;
                    this.fareComponentDescs=data.flightData[0].groupedItineraryResponse.fareComponentDescs;
                    this.baggageAllowanceDescs=data.flightData[0].groupedItineraryResponse.baggageAllowanceDescs;
                    this._setMarkupDiscountDetails(data);
                    this.fareSearchSkeleton=false;
                    this.topFlightSearchSkeleton=false;
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
          console.log(exp);
          this.isNotFound=true;
        }
      }
    }, 1000);
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
        
        let i=this.markupDiscountInfo.find(x=>x.assignSupplierWithProviderID.indexOf(item.assignSupplierWithProviderID)>-1);
        if(i==undefined)
        {
          let data={AirlineId:"",AirlineCode:item.airlineCode,
          AirlineName:"",Type:item.type,Percent:item.percent,CalculationType:item.calculationType,providerId:item.providerId, nvProviderName: item.nvProviderName, calculationType:item.calculationType, supplierID:item.supplierID,assignSupplierWithProviderID:item.assignSupplierWithProviderID, discountType:item.discountType,discountPercent:item.discountPercent,routeWiseMarkUpDiscountDetailsID:item.routeWiseMarkUpDiscountDetailsID,ticketIssueType:item.ticketIssueType,ticketIssueTypeCommission:item.ticketIssueTypeCommission }
          this.markupDiscountInfo.push(data);
        }
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
    if(this.markupInfo.length>0 && this.discountInfo.length>0)
    {
      this._setBookInstantEnableDisable(data);
    }
    else{
      this.isNotFound=true;
    }
  }
  private _setBookInstantEnableDisable(data:any)
  {
    for(let item of data.bookInfo)
    {
      if(!this.shareService.isObjectEmpty(item))
      {
        for(let subItem of item)
        {
          let data={AirlineId:"",AirlineRouteEnableId:subItem.airlinesRouteEnableId,ProviderId:subItem.providerId,
          AirlineCode:subItem.airlineCode,AirlineName:subItem.airlineName,isBook:subItem.isBook,isInstant:subItem.isInstant};
          this.bookInstantEnableDisable.push(data);
        }
      }
    }
    if(this.bookInstantEnableDisable.length>0)
    {
      this._flightWork();
      this._getAirlineList();
    }else{
      this.isNotFound=true;
    }
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
        this.selectedFlightDepartureMobile[i].CityName=data.Departure[i].CityName;
        this.selectedFlightDepartureMobile[i].CountryName=data.Departure[i].CountryName;

        this.selectedFlightArrival[i].CityName=data.Arrival[i].CityName;
        this.selectedFlightArrival[i].CountryCode=data.Arrival[i].CountryCode;
        this.selectedFlightArrival[i].CountryName=data.Arrival[i].CountryName;
        this.selectedFlightArrival[i].AirportName=data.Arrival[i].AirportName;
        this.selectedFlightArrivalPanel[i].CityName=data.Arrival[i].CityName;
        this.selectedFlightArrivalPanel[i].CountryCode=data.Arrival[i].CountryCode;
        this.selectedFlightArrivalPanel[i].CountryName=data.Arrival[i].CountryName;
        this.selectedFlightArrivalPanel[i].AirportName=data.Arrival[i].AirportName;
        this.selectedFlightArrivalMobile[i].CityName=data.Arrival[i].CityName;
        this.selectedFlightArrivalMobile[i].CountryName=data.Arrival[i].CountryName;

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
  _flightWork()
  {
    this._getAirCraftList();
  }
  _getAirCraftList() {
    this.authService.getAircraftInfo().subscribe(data => {
      this.cmbAirCraft = [];
      data.aircraftlist.forEach((aircraft: {vAircraftId:any,nvAircraftCode:any,nvAircraftName:any }) => {
        this.cmbAirCraft.push({
          id: aircraft.vAircraftId,
          code: aircraft.nvAircraftCode,
          text: aircraft.nvAircraftName,
        });
      });

      this.setAirlineList();
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
  setAirlineList() {
    this.authService.getAirlineInfo().subscribe(data => {
      this.airlines=[];
      var airlineData=data.airlinelist;
      for(let rootItem of this.rootData.itineraryGroups)
      {
        for(let subItem of airlineData)
        {
          let flight=this.shareService.groupBy(this.flightHelper.getApiAirlineInfo(rootItem.itineraries),x=>x);
          let scheduleAriline=this.flightHelper.getApiAirlineInfo(this.scheduleDescs,"schedulesAirlines");
          for (let item of this.shareService.getMapToArray(flight))
          {
            if(subItem.nvIataDesignator.toString().trim().toLowerCase()==item.key.toString().trim().toLowerCase())
            {
              this.airlines.push({
                id:subItem.nvAirlinesID,
                code:item.key,logo:subItem.vLogo,
                number:subItem.nvAirlinesCode,
                name:subItem.nvAirlinesName,len:0});
            }
          }
          for(let item of scheduleAriline)
          {
            if(
              this.airlines.findIndex(x=>x.code.toString().toLowerCase()
            ==subItem.nvIataDesignator.toString().toLowerCase())<0
            &&
            this.airlines.findIndex(x=>x.code.toString().toLowerCase()
            ==item.toString().toLowerCase())<0
            )
            {

              this.airlines.push({id:subItem.nvAirlinesID,
                code:subItem.nvIataDesignator,logo:subItem.vLogo,
                number:subItem.nvAirlinesCode,
                name:subItem.nvAirlinesName,len:0});
            }
          }

        }
      }
      this.setAirport(this.scheduleDescs);
    }, err => {
    console.log(JSON.stringify(err));
  });
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
  isSameDepartureArrival(data:any[]):boolean
  {
    let ret:boolean=true;
    try{
      for(let i=0;i<data.length;i++)
      {
        if(
          this.selectedFlightDeparture[i].CityCode.toLowerCase()!=data[i].departureLocation.toString().toLowerCase()
          ||
          this.selectedFlightArrival[i].CityCode.toLowerCase()!=data[i].arrivalLocation.toString().toLowerCase()
        )
        {
          ret=false;
        }
      }
    }catch(exp){}
    return ret;
  }
  getAdjustmentDate(date:any,adj:any,departureTime:any,arrivalTime:any):any{
    let ret:any="";
    try{
      if(adj==undefined || adj=="")
      {
        adj=0;
      }
      let addedDate
      if(departureTime >= arrivalTime)
      {
        addedDate=moment(date).add(adj+1, 'days');
      }else if(departureTime < arrivalTime){
        addedDate=moment(date).add(adj, 'days');
      }
      ret=addedDate;
    }catch(exp){}
    return ret;
  }
  setFlightData()
  {
      try{
      this.flightSearchSkeleton=false;
      this.flightData=[];
      this.topFlights=[];
      this.selectedRadioFlightDetails=[];
      let adultMember=this.adult;
      let childListMember=this.FlightSearch().value[0].childList;
      let infantMember=this.infant;
      let ind=0;
      if(childListMember==undefined)
      {
        childListMember=[];
      }

      for(let rootItem of this.rootData.itineraryGroups)
      {
        if(this.isSameDepartureArrival(rootItem.groupDescription.legDescriptions))
        {
          for(let itiItem of rootItem.itineraries)
          {
            let refT:number=Number.parseInt(itiItem.legs[0].ref)-1;
            let depRefT=this.flightHelper._schedules(refT,this.rootData.legDescs)[0].ref-1;
            let arrRefT=this.flightHelper._schedules(refT,this.rootData.legDescs)[this.flightHelper._schedules(refT,this.rootData.legDescs).length-1].ref-1;
            
            let airlineCode=this.flightHelper._airlinesCode(depRefT,this.rootData.scheduleDescs,this.airlines);

            let itiItem1=[itiItem];
            // Merge flight data with markup & discount data
            const mergedData = itiItem1.map((f: any) => {
              const matchingDiscounts = this.markupDiscountInfo.filter(discount =>
                discount.providerId === this.providerId && discount.AirlineCode === airlineCode
              );
              return matchingDiscounts.map(discount => ({ ...f, ...discount }));
            }).flat();

            // console.log(mergedData);
            for(let itiItem of mergedData)
            {
              let trip:number=1;
              for(let legItem of itiItem.legs)
              {
                let ref:number=Number.parseInt(legItem.ref)-1;
                let depRef=this.flightHelper._schedules(ref,this.rootData.legDescs)[0].ref-1;
                let arrRef=this.flightHelper._schedules(ref,this.rootData.legDescs)[this.flightHelper._schedules(ref,this.rootData.legDescs).length-1].ref-1;
                // console.log("Schedule Data:: arrival ref:"+arrRef);
                // console.log(this.flightHelper._schedules(legItem.ref-1,this.rootData.legDescs));

                let airlineCode=this.flightHelper._airlinesCode(depRef,this.rootData.scheduleDescs,this.airlines);
                
                  let legScheduleData=this.rootData.legDescs.find((x: { id: any; })=>x.id==legItem.ref);
                  let scheduleData=this.flightHelper._schedules(legItem.ref-1,this.rootData.legDescs);
                  let rootHours:number=0,rootMinutes:number=0;
                  let airlineName=this.flightHelper._airlinesName(depRef,this.rootData.scheduleDescs,this.airlines);
                  let departureTime=this.flightHelper._timeDeparture(depRef,this.rootData.scheduleDescs);
                  let arrivalTime=this.flightHelper._timeArrival(arrRef,this.rootData.scheduleDescs);
                  let airlineNumber=this.flightHelper._carrier(depRef,this.rootData.scheduleDescs).marketingFlightNumber;
                  let airCraftCode=this.flightHelper._equipment(depRef,this.rootData.scheduleDescs).code;
                  let airCraftName=this.getAirCraftName(this.flightHelper._equipment(depRef,this.rootData.scheduleDescs).code);
                  let differenceTime=this.flightHelper._difference(this.flightHelper._timeDeparture(depRef,this.rootData.scheduleDescs),this.flightHelper._timeArrival(arrRef,this.rootData.scheduleDescs));
                  let adultBase=this.flightHelper._passengerInfoTotalFareAdult(itiItem.id,rootItem.itineraries).equivalentAmount;
                  let adultTax=this.flightHelper._passengerInfoTotalFareAdult(itiItem.id,rootItem.itineraries).totalTaxAmount;
                  let adultTotal=this.flightHelper._passengerInfoTotalFareAdult(itiItem.id,rootItem.itineraries).totalFare;
                  let adultmarkup = Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,adultBase,0,0,1));
                  let adultDiscount=0;
                  if(adultmarkup>0){
                    adultDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,adultmarkup,adultTax,adultTotal,adultMember,airlineCode));
                  }else{
                    adultDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,adultBase,adultTax,adultTotal,adultMember,airlineCode));
                  }
                  let childBase=this.flightHelper._passengerInfoTotalFareChild(itiItem.id,rootItem.itineraries).equivalentAmount;
                  let childTax=this.flightHelper._passengerInfoTotalFareChild(itiItem.id,rootItem.itineraries).totalTaxAmount;
                  let childTotal=this.flightHelper._passengerInfoTotalFareChild(itiItem.id,rootItem.itineraries).totalFare;
                  let childmarkup = Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,childBase,0,0,1));
                  let childDiscount=0;
                  if(childmarkup>0){
                    childDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,childmarkup,adultTax,adultTotal,adultMember,airlineCode));
                  }else{
                    childDiscount=Math.round(this.flightHelper._getDisountTotalPrice1(itiItem.discountPercent,itiItem.discountType,itiItem.CalculationType,childBase,childTax,childTotal,childListMember.length,airlineCode));              
                  }
                  let infantBase=this.flightHelper._passengerInfoTotalFareInfant(itiItem.id,rootItem.itineraries).equivalentAmount;
                  let infantTax=this.flightHelper._passengerInfoTotalFareInfant(itiItem.id,rootItem.itineraries).totalTaxAmount;
                  let infantTotal=this.flightHelper._passengerInfoTotalFareInfant(itiItem.id,rootItem.itineraries).totalFare;
                  let infantmarkup = Math.round(this.flightHelper._getMarkupTotalPrice1(itiItem.Percent,itiItem.Type,itiItem.CalculationType,childBase,0,0,1));
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

                  this.flightData.push({
                    id:itiItem.id,
                    tripTitle:trip,
                    groupAirlineCode:"",
                    providerId:this.providerId,
                    providerName:itiItem.nvProviderName,
                    supplierID:itiItem.supplierID,
                    routeWiseMarkUpDiscountDetailsID:itiItem.routeWiseMarkUpDiscountDetailsID,
                    ticketIssueType:itiItem.ticketIssueType,
                    ticketIssueTypeCommission:itiItem.ticketIssueTypeCommission,
                    assignSupplierWithProviderID:itiItem.assignSupplierWithProviderID,
                    tripTypeId:this.tripTypeId,
                    cabinTypeId:this.cabinTypeId,
                    airlineLogo:this.flightHelper.getAirlineLogo(airlineCode,this.airlines),
                    airlineName:airlineName,
                    airlineCode:airlineCode,
                    airlineId:this.flightHelper.getAirlineId(airlineCode,this.cmbAirlines),
                    airlineNumber:airlineNumber,
                    airCraftId:this.flightHelper.getAircraftId(airCraftCode,this.cmbAirCraft),
                    airCraftCode:airCraftCode,
                    airCraftName:airCraftName,
                    departureDate:this.selectedFlightDeparture[trip-1].Date,
                    arrivalDate:this.selectedFlightDeparture[trip-1].Date,
                    departureTime:departureTime,
                    arrivalTime:arrivalTime,
                    departureCityId:this.selectedFlightDeparture[trip-1].Id,
                    departureCityCode:this.selectedFlightDeparture[trip-1].CityCode,
                    departureCity:this.selectedFlightDeparture[trip-1].CityName,
                    arrivalCityId:this.selectedFlightArrival[trip-1].Id,
                    arrivalCityCode:this.selectedFlightArrival[trip-1].CityCode,
                    arrivalCity:this.selectedFlightArrival[trip-1].CityName,
                    differenceTime:differenceTime,
                    adult:adultMember,
                    child:childListMember,
                    infant:infantMember,
                    stop:0,
                    stopAllCity:'',
                    domestic:false,
                    depadjustment:0,
                    adjustment:0,
                    arradjustment:0,
                    flightRouteTypeId:this.flightHelper.flightRouteType[0],
                    lastTicketDate:this.flightHelper._fare(itiItem.id,rootItem.itineraries).lastTicketDate,
                    lastTicketTime:this.flightHelper._fare(itiItem.id,rootItem.itineraries).lastTicketTime,
                    baggageAdult:this.flightHelper._pieceOrKgsAdult(itiItem.id,rootItem.itineraries,this.rootData.baggageAllowanceDescs),
                    baggageChild:this.flightHelper._pieceOrKgsChild(itiItem.id,rootItem.itineraries,this.rootData.baggageAllowanceDescs),
                    baggageInfant:this.flightHelper._pieceOrKgsInfant(itiItem.id,rootItem.itineraries,this.rootData.baggageAllowanceDescs),
                    cabinAdult:this.flightHelper._passengerCabinAdult(itiItem.id,rootItem.itineraries,this.rootData.fareComponentDescs),
                    cabinChild:this.flightHelper._passengerCabinChild(itiItem.id,rootItem.itineraries,this.rootData.fareComponentDescs),
                    cabinInfant:this.flightHelper._passengerCabinInfant(itiItem.id,rootItem.itineraries,this.rootData.fareComponentDescs),
                    instantEnable:this.flightHelper.isInstant(this.bookInstantEnableDisable,airlineCode),
                    airlinesRouteEnableId:this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable,airlineCode),
                    btnLoad:false,
                    isAgentFare:this.isAgentFare,
                    refundable:this.flightHelper._passengerInfoList(itiItem.id,rootItem.itineraries)[0].passengerInfo.nonRefundable==false?true:false,
                    fareBasisCode:this.flightHelper._fareComponentDescs(this.flightHelper._passengerInfoList(itiItem.id,
                      rootItem.itineraries)[0].passengerInfo.fareComponents[0].ref-1,this.fareComponentDescs).fareBasisCode,
                    markupTypeList:this.markupList,
                    totalPrice:this.flightHelper._totalFare(itiItem.id,rootItem.itineraries).totalPrice,
                    totalDiscount:adultDiscount+childDiscount+infantDiscount,
                    clientFareTotal:this.flightHelper.getTotalAdultChildInfant(adultClientTotal,childClientTotal,infantClientTotal),
                    agentFareTotal:this.flightHelper.getTotalAdultChildInfant(adultAgentTotal,childAgentTotal,infantAgentTotal),
                    gdsFareTotal:
                    (parseInt(adultMember)==0?0:adultTotal)+(parseInt(childListMember.length)==0?0:childTotal)+(parseInt(infantMember)==0?0:infantTotal),
                    flightSegmentData:[],fareData:{}
                  });
                  let airlineInd=this.airlines.findIndex(x=>x.code==airlineCode);
                  if(airlineInd!=-1)
                  {
                    this.airlines[airlineInd].len+=1;
                  }
                  let fInd=0;
                  let index=this.flightData.findIndex(x=>x.id===itiItem.id && x.tripTitle===trip && x.providerName===itiItem.nvProviderName);
                  let adjustAct=0;
                  for(let item of this.flightHelper._schedules(ref,this.rootData.legDescs))
                  {
                    let fref=item.ref-1;
                    let adj=0,depAdj=0,arrAdj=0;
                    if(item.departureDateAdjustment!=undefined && item.departureDateAdjustment!='')
                    {
                      adj=item.departureDateAdjustment;
                    }
                    if(this.flightHelper._departure(fref,this.rootData.scheduleDescs).dateAdjustment!=undefined
                    && this.flightHelper._departure(fref,this.rootData.scheduleDescs).dateAdjustment!='')
                    {
                      depAdj=this.flightHelper._departure(fref,this.rootData.scheduleDescs).dateAdjustment;
                    }
                    if(this.flightHelper._arrival(fref,this.rootData.scheduleDescs).dateAdjustment!=undefined
                    && this.flightHelper._arrival(fref,this.rootData.scheduleDescs).dateAdjustment!='')
                    {
                      arrAdj=this.flightHelper._arrival(fref,this.rootData.scheduleDescs).dateAdjustment;
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
                    let depAirportCode=this.flightHelper._departure(fref,this.rootData.scheduleDescs).airport;
                    let depAirportId=this.flightHelper.getAirportId(depAirportCode,this.cmbAirport);
                    let arrAirportCode=this.flightHelper._arrival(fref,this.rootData.scheduleDescs).airport;
                    let arrAirportId=this.flightHelper.getAirportId(arrAirportCode,this.cmbAirport);
                    let airlineCode=this.flightHelper._airlinesCode(fref,this.rootData.scheduleDescs,this.airlines);
                    let airlineId=this.flightHelper.getAirlineId(airlineCode,this.airlines);
                    let fDifTime = this.flightHelper._timeDifferenceActual1(item.ref,this.rootData.scheduleDescs);
                    if(this.flightData[index].groupAirlineCode.indexOf(airlineCode)==-1)
                    {
                      this.flightData[index].groupAirlineCode+=airlineCode+",";
                    }
                    this.flightData[index].flightSegmentData.push({
                      airlineName:this.flightHelper._airlinesName(fref,this.rootData.scheduleDescs,this.airlines),
                      airlineCode:airlineCode,
                      airlineId:airlineId,
                      providerName:this.flightData[index].providerName,
                      supplierID:this.flightData[index].supplierID,
                      routeWiseMarkUpDiscountDetailsID:this.flightData[index].routeWiseMarkUpDiscountDetailsID,
                      ticketIssueType:this.flightData[index].ticketIssueType,
                      ticketIssueTypeCommission:this.flightData[index].ticketIssueTypeCommission,
                      assignSupplierWithProviderID:this.flightData[index].assignSupplierWithProviderID,
                      domestic:true,
                      airlineLogo:this.flightHelper.getAirlineLogo(this.flightHelper._airlinesCode(fref,this.rootData.scheduleDescs,this.airlines),
                      this.airlines),
                      airlineNumber:this.flightHelper._carrier(fref,this.rootData.scheduleDescs).marketingFlightNumber,
                      availableSeat:this.flightHelper.getSeatsAvailability(itiItem.id,rootItem.itineraries),
                      bookingCode:this.flightHelper._passengerInfoFareComponentsSegmentsAdult(itiItem.id,rootItem.itineraries).bookingCode,
                      departureTime:this.flightHelper._timeDeparture(fref,this.rootData.scheduleDescs),
                      arrivalTime:this.flightHelper._timeArrival(fref,this.rootData.scheduleDescs),
                      departureCity:this.flightHelper.getDepCityName(this.flightHelper._departure(fref,this.rootData.scheduleDescs).airport,this.airports),
                      arrivalCity:this.flightHelper.getArrCityName(this.flightHelper._arrival(fref,this.rootData.scheduleDescs).airport,this.airports),
                      departureAirportCode:depAirportCode,
                      arrivalAirportCode:arrAirportCode,
                      departureAirportId:depAirportId,
                      arrivalAirportId:arrAirportId,
                      differenceTime:fDifTime,
                      layOverDifference:"",
                      terminalDeparture:this.flightHelper._terminalDeparture(fref,this.rootData.scheduleDescs),
                      terminalArrival:this.flightHelper._terminalArrival(fref,this.rootData.scheduleDescs),
                      stopCount:fInd,
                      adjustment:adjustAct,
                      departureAdjustment:depAdj,
                      departureDateAdjustment:adj,
                      arrivalAdjustment:arrAdj
                    });
                    
                    this.flightData[index].arradjustment=arrAdj;
                    this.flightData[index].adjustment=adjustAct;
                    
                    let fdifHour=0;
                    let fdifMinute=0;
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
                  }
                  if(this.flightData[index].groupAirlineCode.length>0)
                  {
                    this.flightData[index].groupAirlineCode=this.flightData[index].groupAirlineCode.substring(0,
                      this.flightData[index].groupAirlineCode.length-1);
                  }
                  let fData=this.flightData[index].flightSegmentData;
                  let stopData=this.flightHelper._getStopData(fData);
                  this.flightData[index].stop=parseInt(fData.length)>1?parseInt(fData.length)-1:0;
                  this.flightData[index].stopAllCity=stopData;
                  let diff="";
                  for(let i=0;i<this.flightData[index].flightSegmentData.length;i++)
                  {
                    try{
                      let dep=this.flightData[index].flightSegmentData[i+1].departureTime;
                      let arr=this.flightData[index].flightSegmentData[i].arrivalTime;

                      let Gmt=this.flightHelper._timeDifferenceGMT(arr,dep);
                      let Utc=this.flightHelper._timeDifferenceUTC(arr,dep);
                      diff=this.flightHelper._differenceActual(Gmt,Utc);
                      let flayHour=this.flightHelper._getLayTime(diff,"hour");
                      let flayMinute=this.flightHelper._getLayTime(diff,"min");

                      rootHours+=flayHour;
                      rootMinutes+=flayMinute;
                    }catch(exp)
                    {
                      diff="";
                    }
                    this.flightData[index].flightSegmentData[i].layOverDifference=diff;
                  }
                  if(rootMinutes>59)
                  {
                    let retH:number=rootMinutes/60;
                    rootHours+=retH;
                    rootMinutes=rootMinutes%60;
                  }
                  // if(rootMinutes>0 && rootHours>0)
                  // {
                  //   this.flightData[index].differenceTime=parseInt(rootHours.toString())+"h "+parseInt(rootMinutes.toString())+"m";
                  // }else if(rootHours>0){
                  //   this.flightData[index].differenceTime=parseInt(rootHours.toString())+"h";
                  // }
                  if(rootMinutes>0)
                  {
                    this.flightData[index].differenceTime=parseInt(rootHours.toString())+"h "+parseInt(rootMinutes.toString())+"m";
                  }else{
                    this.flightData[index].differenceTime=parseInt(rootHours.toString())+"h";
                  }
                  this.flightData[index].fareData={
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
                  let findIdx=this.selectedRadioFlightDetails.findIndex(x=>
                    x.groupAirlineCode.indexOf(this.flightData[index].groupAirlineCode)>-1 &&
                    x.tripTitle==trip
                    );
                  if(findIdx==-1)
                  {
                    this.selectedRadioFlightDetails.push(this.flightData[index]);
                    let groupCode=this.flightData[index].groupAirlineCode;
                    let provider=this.flightData[index].providerName;
                    setTimeout(()=>{
                      $("#flight_select"+groupCode+"10"+this.flightHelper.ReplaceParentheses(provider)).prop("checked",true);
                      $("#flight_select"+groupCode+"20"+this.flightHelper.ReplaceParentheses(provider)).prop("checked",true);
                      $("#flight_select"+groupCode+"30"+this.flightHelper.ReplaceParentheses(provider)).prop("checked",true);
                      $("#flight_select"+groupCode+"40"+this.flightHelper.ReplaceParentheses(provider)).prop("checked",true);
                    });
                  }
                  trip+=1;
                }
            }
          }
          this.setTimeFilter(<any[]>rootItem.itineraries,<any[]>this.rootData.scheduleDescs,<any[]>this.rootData.legDescs);
        }
      }

      for(let item of this.airlines)
      {
        if(item.len!=0)
        {
          this.topFlights.push({
            code:item.code,
            logo:item.logo,
            name:item.name
          });
        }
      }
      this.setTempFilterData();
      this.setStopCount();
      }catch(exp)
      {
        console.log(exp);
        this.isNotFound=true;
      }
  }
  showMakeProposal(groupCode:any)
  {
    try{
      let data=this.selectedRadioFlightDetails.filter(x=>x.groupAirlineCode.indexOf(groupCode)>-1);
      this.makeProposalData={
        firstLegData:data,
        tripTypeId:this.flightHelper.getTripTypeId(3),
        domestic:false
      };
      // console.log("Make proposald data::");
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
      $("#proposalModal").modal('show');
    }catch(exp){}
  }
  showMakeProposal1(groupCode:any,providerName:any)
  {
    try{
      let data=this.selectedRadioFlightDetails.filter(x=>x.groupAirlineCode.indexOf(groupCode)>-1 && x.providerName.indexOf(providerName)>-1);
      this.makeProposalData={
        firstLegData:data,
        tripTypeId:this.flightHelper.getTripTypeId(3),
        domestic:false
      };
      // console.log("Make proposald data::");
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
      $("#proposalModal").modal('show');
    }catch(exp){}
  }
  public getGroupHeadAmount(groupCode:string,type:string):any
  {
    let ret:any="0";
    try{
      let allData=this.getGroupHeadData(groupCode);
      let minClient=allData[0].clientFareTotal;
      let minAgent=allData[0].agentFareTotal;
      for(let item of allData)
      {
        switch(type.toString().toLowerCase())
        {
           case "clientfare":
            ret=this.shareService.amountShowWithCommas(minClient);
            if(minClient>item.clientFareTotal)
            {
              minClient=item.clientFareTotal;
              ret=this.shareService.amountShowWithCommas(minClient);
            }
            break;
           case "agentfare":
             ret=this.shareService.amountShowWithCommas(minAgent);
            if(minAgent>item.agentFareTotal)
            {
              minAgent=item.agentFareTotal;
              ret=this.shareService.amountShowWithCommas(minAgent);
            }
            break;
        }
      }
    }catch(exp)
    {}
    return ret;
  }
  public getGroupHeadAmount1(groupCode:string,type:string,providerName:any):any
  {
    let ret:any="0";
    try{
      let allData=this.getGroupHeadData1(groupCode,providerName);
      let minClient=allData[0].clientFareTotal;
      let minAgent=allData[0].agentFareTotal;
      for(let item of allData)
      {
        switch(type.toString().toLowerCase())
        {
           case "clientfare":
            ret=this.shareService.amountShowWithCommas(minClient);
            if(minClient>item.clientFareTotal)
            {
              minClient=item.clientFareTotal;
              ret=this.shareService.amountShowWithCommas(minClient);
            }
            break;
           case "agentfare":
             ret=this.shareService.amountShowWithCommas(minAgent);
            if(minAgent>item.agentFareTotal)
            {
              minAgent=item.agentFareTotal;
              ret=this.shareService.amountShowWithCommas(minAgent);
            }
            break;
        }
      }
    }catch(exp)
    {}
    return ret;
  }
  getGroupByItinery():any
  {
    debugger;
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.tempFlightData, (v: { groupAirlineCode: any; }) => v.groupAirlineCode)));
    var result = [...getMap.keys()].sort((a,b) =>  (a > b ? 1 : -1));
    return result;
  }
  getProviders(groupCode:any):any
  {
    this.tempFlightData = this.tempFlightData.sort((a, b) => a.fareData.adultTotalClient - b.fareData.adultTotalClient);
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.tempFlightData.filter(c=>c.groupAirlineCode===groupCode),x=>x.groupAirlineCode && x.providerName)));
    return [...getMap.keys()];//.sort((a,b) =>  (a > b ? 1 : -1));
  }
  getProvider(groupCode:any):any
  {
    let groupList:any[]=[];
    try{
      let data=this.getProviders(groupCode);
      for(let item of data)
      {
        groupList.push(item);
      }
    }catch(exp){}
    return groupList;
  }
  getGroupByTrip(groupCode:any):any
  {
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.tempFlightData,x=>x.groupAirlineCode)));
    let getGroupTrip=new Map(Object.entries(this.shareService.groupBy(<any[]>getMap.get(groupCode), v=> v.tripTitle)));
    return [...getGroupTrip.keys()];
  }
  getFilterItineryByGroup(groupCode:any,groupTrip:any):any
  {
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.tempFlightData,x=>x.groupAirlineCode)));
    let getGroupTrip=new Map(Object.entries(this.shareService.groupBy(<any[]>getMap.get(groupCode), v=> v.tripTitle)));
    return getGroupTrip.get(groupTrip);
  }
  getFilterItineryByGroup1(groupCode:any,groupTrip:any,providerName:any):any
  {
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.tempFlightData,x=>x.groupAirlineCode)));
    let getPMap=new Map(Object.entries(this.shareService.groupBy(<any[]>getMap.get(groupCode), v=> v.providerName)));
    let getGroupTrip=new Map(Object.entries(this.shareService.groupBy(<any[]>getPMap.get(providerName), v=> v.tripTitle)));
    return getGroupTrip.get(groupTrip);
  }
  getTripDetails(groupCode:any,groupTrip:any):any
  {
    let groupList:any[]=[];
    try{
      let data=this.getFilterItineryByGroup(groupCode,groupTrip);
      for(let item of data)
      {
        let findInd=groupList.findIndex(x=>x.tripTitle==item.tripTitle
          && x.airlineNumber==item.airlineNumber
          && x.airlineCode.indexOf(item.airlineCode)>-1
          && x.departureTime.indexOf(item.departureTime)>-1
          && x.arrivalTime.indexOf(item.arrivalTime)>-1
          && x.providerId.indexOf(item.providerId)>-1);
        if(findInd==-1)
        {
          groupList.push(item);
        }
      }
    }catch(exp){}
    console.log(groupList, this.flightHelper.getFlightNoMore(groupList[0].flightSegmentData));
    return groupList;
  }
  getTripDetails1(groupCode:any,groupTrip:any,providerName:any):any
  {
    let groupList:any[]=[];
    try{
      let data=this.getFilterItineryByGroup1(groupCode,groupTrip,providerName);
      for(let item of data)
      {
        let findInd=groupList.findIndex(x=>x.tripTitle==item.tripTitle
          && x.airlineNumber==item.airlineNumber
          && x.airlineCode.indexOf(item.airlineCode)>-1
          && x.departureTime.indexOf(item.departureTime)>-1
          && x.arrivalTime.indexOf(item.arrivalTime)>-1
          && x.providerId.indexOf(item.providerId)>-1
          && x.providerName.indexOf(item.providerName)>-1);
        if(findInd==-1)
        {
          groupList.push(item);
        }
      }
    }catch(exp){}
    console.log(groupList, this.flightHelper.getFlightNoMore(groupList[0].flightSegmentData));
    return groupList;
  }
  getGroupHeadData(groupCode:string):any
  {
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.tempFlightData,x=>x.groupAirlineCode)));
    return getMap.get(groupCode);
  }
  getGroupHeadData1(groupCode:string,providerName:any):any
  {
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.tempFlightData,x=>x.groupAirlineCode)));
    let getPMap=new Map(Object.entries(this.shareService.groupBy(<any[]>getMap.get(groupCode), v=> v.providerName)));
    return getPMap.get(providerName);
  }

  getSelectedViewFlights(groupCode:any)
  {
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.selectedRadioFlightDetails,x=>x.groupAirlineCode)));

    return getMap.get(groupCode)?.sort((a,b) =>  (a.tripTitle > b.tripTitle ? 1 : -1));
  }

  getSelectedViewFlights1(groupCode:any,providerName:any)
  {
    let getMap=new Map(Object.entries(this.shareService.groupBy(this.selectedRadioFlightDetails,x=>x.groupAirlineCode)));
    let getPMap=new Map(Object.entries(this.shareService.groupBy(<any[]>getMap.get(groupCode), v=> v.providerName)));
    return getPMap.get(providerName)?.sort((a,b) =>  (a.tripTitle > b.tripTitle ? 1 : -1));
  }

  selectRadio(groupCode:string,id:number,trip:number)
  {
    let findIdx=this.selectedRadioFlightDetails.findIndex(x=>x.groupAirlineCode.indexOf(groupCode)>-1 && x.tripTitle==trip);
    if(findIdx!=-1)
    {
      this.selectedRadioFlightDetails.splice(findIdx,1);
    }
    let fData=this.flightData.find(x=>x.id==id && x.tripTitle==trip);
    this.selectedRadioFlightDetails.push(fData);
  }
  selectRadio1(groupCode:string,id:number,trip:number,providerName:any)
  {
    let findIdx=this.selectedRadioFlightDetails.findIndex(x=>x.groupAirlineCode.indexOf(groupCode)>-1 && x.tripTitle==trip && x.providerName.indexOf(providerName)>-1);
    if(findIdx!=-1)
    {
      this.selectedRadioFlightDetails.splice(findIdx,1);
    }
    let fData=this.flightData.find(x=>x.id==id && x.tripTitle==trip && x.providerName==providerName);
    this.selectedRadioFlightDetails.push(fData);
  }
  setStopCount()
  {
    this.stopCountList=[];
    try{
      let stopList:any[]=[];
      for(let rootItem of this.flightData)
      {
        let price=rootItem.clientFareTotal;
        let len=rootItem.flightSegmentData.length;
        stopList.push({trip:rootItem.tripTitle,id:len,price:price});
      }
      let tripGroup=this.shareService.getMapToArray(this.shareService.groupBy(stopList,x=>x.trip));
      let tripIndex=0,breakIdx=0;
      for(let tripItem of tripGroup)
      {
        let stopGroup=this.shareService.getMapToArray(this.shareService.groupBy(<any[]>tripItem.value,x=>x.id));
        this.stopCountList.push({key:tripItem.key,value:[]});
        let stopIdx=0;
        for(let item of stopGroup)
        {
          let min=item.value[0].price;
          let title=item.key==1?"Non stop":"Stop "+(item.key-1);
          let getUID=this.flightHelper.getMakeId(tripIndex,"STOP",stopIdx);
          this.stopCountList[tripIndex].value.push({id:getUID,stopCount:item.value.length,title:title,
            price:0});
          for(let subItem of item.value)
          {
            if(min>subItem.price)
            {
              min=subItem.price;
            }
          }
          this.stopCountList[tripIndex].value.find((x: { id: any; })=>x.id.toString().toLowerCase()==getUID.toString().toLowerCase()).price=min;
          if(item.key==2 && breakIdx==0)
          {
            if(this.popularFilter.findIndex(x=>x.id.toString().toLowerCase()==getUID.toString().toLowerCase())<0 && this.flightHelper.isNotZero(min)==true )
            {
              this.popularFilter.push({id:getUID,title:title,value:title,len:"("+item.value.length+")",price:min,origin:"stop"});
            }
            breakIdx+=1;
          }
          stopIdx+=1;
        }
        // let minPriceRef=this.flightHelper.getMinimumPricePopularFilterRefundable(true,this.flightData);
        // let countRef=this.flightHelper.getTotalPopularFilterRefundable(true,this.flightData);
        // let getUREF=this.flightHelper.getMakeId(tripIndex,"REF");
        // if(this.popularFilter.findIndex(x=>x.id.indexOf(getUREF)>-1)<0)
        // {
        //   this.popularFilter.push({id:getUREF,title:getUREF,value:"",len:"("+countRef+")",price:minPriceRef,origin:"refundable"});
        // }
        tripIndex+=1;
      }
    }catch(exp){}
  }
  setTimeFilter(itineraries:any[],scheduleData:any[],legData:any[])
  {
    this.departureTimeFilter=[];
    this.arrivalTimeFilter=[];
    try{
      for(let item of itineraries)
      {
        let leg:number=1;
        for(let legInd of item.legs)
        {
          let legScheduleData=legData.find(x=>x.id==legInd.ref);
          for(let legItem of legScheduleData.schedules)
          {
            let legRef=legItem.ref-1;
            let Dtime=this.flightHelper._scheduleDescs(legRef,scheduleData).departure.time;
            let Atime=this.flightHelper._scheduleDescs(legRef,scheduleData).arrival.time;
            // console.log("Departure::"+legInd.ref+" and "+leg);
            let Da_p=this.shareService.getAmPm(Dtime.toString().trim().split(':')[0],Dtime.toString().trim().split(':')[1]);
            let Aa_p=this.shareService.getAmPm(Atime.toString().trim().split(':')[0],Atime.toString().trim().split(':')[1]);
            let Dbefore6=this.flightHelper.getMinimumPriceForTime('departure',1,6,'AM',item.id,legRef,scheduleData,itineraries);
            let Dam6=this.flightHelper.getMinimumPriceForTime('departure',6,12,'AM',item.id,legRef,scheduleData,itineraries);
            let Dafter12pm=this.flightHelper.getMinimumPriceForTime('departure',1,6,'PM',item.id,legRef,scheduleData,itineraries);
            let Dafter6=this.flightHelper.getMinimumPriceForTime('departure',6,12,'PM',item.id,legRef,scheduleData,itineraries);
            let Abefore6=this.flightHelper.getMinimumPriceForTime('arrival',1,6,'AM',item.id,legRef,scheduleData,itineraries);
            let Aam6=this.flightHelper.getMinimumPriceForTime('arrival',6,12,'AM',item.id,legRef,scheduleData,itineraries);
            let Aafter12pm=this.flightHelper.getMinimumPriceForTime('arrival',1,6,'PM',item.id,legRef,scheduleData,itineraries);
            let Aafter6=this.flightHelper.getMinimumPriceForTime('arrival',6,12,'PM',item.id,legRef,scheduleData,itineraries);
            this.setDepartureTimeFilter(Da_p,Dbefore6,Dam6,Dafter12pm,Dafter6,leg);
            this.setArrivalTimeFilter(Aa_p,Abefore6,Aam6,Aafter12pm,Aafter6,leg);
          }
          leg+=1;
        }
      }
    }catch(exp){
      console.log(exp);
    }
  }
  showFlightDetailsMobile(ind:any)
  {
    try{
      let data=this.selectedRadioFlightDetails.filter(x=>x.groupAirlineCode.indexOf(ind)>-1);
      if(data.length==1){
        this.flightDetailsModalData.push({
          fromFlight1:data[0].departureCityCode,
          toFlight1:data[0].arrivalCityCode,
          depDay:"",
          depMonthNameShort:"",
          depDayNameShort:"",
          departureDate1:data[0].departureDate,
          baggageAdult1:data[0].baggageAdult,
          baggageChild1:data[0].baggageChild,
          baggageInfant1:data[0].baggageInfant,
          cabinAdult1:data[0].cabinAdult,
          cabinChild1:data[0].cabinChild,
          cabinInfant1:data[0].cabinInfant,
          airlineLogo1:data[0].airlineLogo,
          airlineName1:data[0].airlineName,
          airlineCode1:data[0].airlineCode,
          airlineNumber1:data[0].airlineNumber,
          differenceTime1:data[0].differenceTime,
          departureTime1:data[0].departureTime,
          departureCity1:data[0].departureCity,
          arrivalTime1:data[0].arrivalTime,
          arrivalCity1:data[0].arrivalCity,
          arrivalAirportCode1:data[0].arrivalCityCode,
          tripTypeId:this.flightHelper.getTripTypeId(3),
          domestic:false
        });
      }
      if(data.length==2){
        this.flightDetailsModalData.push({
          fromFlight1:data[0].departureCityCode,
          toFlight1:data[0].arrivalCityCode,
          fromFlight2:data[1].departureCityCode,
          toFlight2:data[1].arrivalCityCode,
          depDay:"",
          depMonthNameShort:"",
          depDayNameShort:"",
          departureDate1:data[0].departureDate,
          baggageAdult1:data[0].baggageAdult,
          baggageChild1:data[0].baggageChild,
          baggageInfant1:data[0].baggageInfant,
          cabinAdult1:data[0].cabinAdult,
          cabinChild1:data[0].cabinChild,
          cabinInfant1:data[0].cabinInfant,
          airlineLogo1:data[0].airlineLogo,
          airlineName1:data[0].airlineName,
          airlineCode1:data[0].airlineCode,
          airlineNumber1:data[0].airlineNumber,
          differenceTime1:data[0].differenceTime,
          departureTime1:data[0].departureTime,
          departureCity1:data[0].departureCity,
          arrivalTime1:data[0].arrivalTime,
          arrivalCity1:data[0].arrivalCity,
          arrivalAirportCode1:data[0].arrivalCityCode,
          departureDate2:data[1].departureDate,
          baggageAdult2:data[1].baggageAdult,
          baggageChild2:data[1].baggageChild,
          baggageInfant2:data[1].baggageInfant,
          cabinAdult2:data[1].cabinAdult,
          cabinChild2:data[1].cabinChild,
          cabinInfant2:data[1].cabinInfant,
          airlineLogo2:data[1].airlineLogo,
          airlineName2:data[1].airlineName,
          airlineCode2:data[1].airlineCode,
          airlineNumber2:data[1].airlineNumber,
          differenceTime2:data[1].differenceTime,
          departureTime2:data[1].departureTime,
          departureCity2:data[1].departureCity,
          arrivalTime2:data[1].arrivalTime,
          arrivalCity2:data[1].arrivalCity,
          arrivalAirportCode2:data[1].arrivalCityCode,
          tripTypeId:this.flightHelper.getTripTypeId(3),
          domestic:false
        });
      }
      if(data.length==3){
        this.flightDetailsModalData.push({
          fromFlight1:data[0].departureCityCode,
          toFlight1:data[0].arrivalCityCode,
          fromFlight2:data[1].departureCityCode,
          toFlight2:data[1].arrivalCityCode,
          fromFlight3:data[2].departureCityCode,
          toFlight3:data[2].arrivalCityCode,
          depDay:"",
          depMonthNameShort:"",
          depDayNameShort:"",
          departureDate1:data[0].departureDate,
          baggageAdult1:data[0].baggageAdult,
          baggageChild1:data[0].baggageChild,
          baggageInfant1:data[0].baggageInfant,
          cabinAdult1:data[0].cabinAdult,
          cabinChild1:data[0].cabinChild,
          cabinInfant1:data[0].cabinInfant,
          airlineLogo1:data[0].airlineLogo,
          airlineName1:data[0].airlineName,
          airlineCode1:data[0].airlineCode,
          airlineNumber1:data[0].airlineNumber,
          differenceTime1:data[0].differenceTime,
          departureTime1:data[0].departureTime,
          departureCity1:data[0].departureCity,
          arrivalTime1:data[0].arrivalTime,
          arrivalCity1:data[0].arrivalCity,
          arrivalAirportCode1:data[0].arrivalCityCode,
          departureDate2:data[1].departureDate,
          baggageAdult2:data[1].baggageAdult,
          baggageChild2:data[1].baggageChild,
          baggageInfant2:data[1].baggageInfant,
          cabinAdult2:data[1].cabinAdult,
          cabinChild2:data[1].cabinChild,
          cabinInfant2:data[1].cabinInfant,
          airlineLogo2:data[1].airlineLogo,
          airlineName2:data[1].airlineName,
          airlineCode2:data[1].airlineCode,
          airlineNumber2:data[1].airlineNumber,
          differenceTime2:data[1].differenceTime,
          departureTime2:data[1].departureTime,
          departureCity2:data[1].departureCity,
          arrivalTime2:data[1].arrivalTime,
          arrivalCity2:data[1].arrivalCity,
          arrivalAirportCode2:data[1].arrivalCityCode,
          departureDate3:data[2].departureDate,
          baggageAdult3:data[2].baggageAdult,
          baggageChild3:data[2].baggageChild,
          baggageInfant3:data[2].baggageInfant,
          cabinAdult3:data[2].cabinAdult,
          cabinChild3:data[2].cabinChild,
          cabinInfant3:data[2].cabinInfant,
          airlineLogo3:data[2].airlineLogo,
          airlineName3:data[2].airlineName,
          airlineCode3:data[2].airlineCode,
          airlineNumber3:data[2].airlineNumber,
          differenceTime3:data[2].differenceTime,
          departureTime3:data[2].departureTime,
          departureCity3:data[2].departureCity,
          arrivalTime3:data[2].arrivalTime,
          arrivalCity3:data[2].arrivalCity,
          arrivalAirportCode3:data[2].arrivalCityCode,
          tripTypeId:this.flightHelper.getTripTypeId(3),
          domestic:false
        });
      }
      if(data.length==4){
        this.flightDetailsModalData.push({
          fromFlight1:data[0].departureCityCode,
          toFlight1:data[0].arrivalCityCode,
          fromFlight2:data[1].departureCityCode,
          toFlight2:data[1].arrivalCityCode,
          fromFlight3:data[2].departureCityCode,
          toFlight3:data[2].arrivalCityCode,
          fromFlight4:data[3].departureCityCode,
          toFlight4:data[3].arrivalCityCode,
          depDay:"",
          depMonthNameShort:"",
          depDayNameShort:"",
          departureDate1:data[0].departureDate,
          baggageAdult1:data[0].baggageAdult,
          baggageChild1:data[0].baggageChild,
          baggageInfant1:data[0].baggageInfant,
          cabinAdult1:data[0].cabinAdult,
          cabinChild1:data[0].cabinChild,
          cabinInfant1:data[0].cabinInfant,
          airlineLogo1:data[0].airlineLogo,
          airlineName1:data[0].airlineName,
          airlineCode1:data[0].airlineCode,
          airlineNumber1:data[0].airlineNumber,
          differenceTime1:data[0].differenceTime,
          departureTime1:data[0].departureTime,
          departureCity1:data[0].departureCity,
          arrivalTime1:data[0].arrivalTime,
          arrivalCity1:data[0].arrivalCity,
          arrivalAirportCode1:data[0].arrivalCityCode,
          departureDate2:data[1].departureDate,
          baggageAdult2:data[1].baggageAdult,
          baggageChild2:data[1].baggageChild,
          baggageInfant2:data[1].baggageInfant,
          cabinAdult2:data[1].cabinAdult,
          cabinChild2:data[1].cabinChild,
          cabinInfant2:data[1].cabinInfant,
          airlineLogo2:data[1].airlineLogo,
          airlineName2:data[1].airlineName,
          airlineCode2:data[1].airlineCode,
          airlineNumber2:data[1].airlineNumber,
          differenceTime2:data[1].differenceTime,
          departureTime2:data[1].departureTime,
          departureCity2:data[1].departureCity,
          arrivalTime2:data[1].arrivalTime,
          arrivalCity2:data[1].arrivalCity,
          arrivalAirportCode2:data[1].arrivalCityCode,
          departureDate3:data[2].departureDate,
          baggageAdult3:data[2].baggageAdult,
          baggageChild3:data[2].baggageChild,
          baggageInfant3:data[2].baggageInfant,
          cabinAdult3:data[2].cabinAdult,
          cabinChild3:data[2].cabinChild,
          cabinInfant3:data[2].cabinInfant,
          airlineLogo3:data[2].airlineLogo,
          airlineName3:data[2].airlineName,
          airlineCode3:data[2].airlineCode,
          airlineNumber3:data[2].airlineNumber,
          differenceTime3:data[2].differenceTime,
          departureTime3:data[2].departureTime,
          departureCity3:data[2].departureCity,
          arrivalTime3:data[2].arrivalTime,
          arrivalCity3:data[2].arrivalCity,
          arrivalAirportCode3:data[2].arrivalCityCode,
          departureDate4:data[3].departureDate,
          baggageAdult4:data[3].baggageAdult,
          baggageChild4:data[3].baggageChild,
          baggageInfant4:data[3].baggageInfant,
          cabinAdult4:data[3].cabinAdult,
          cabinChild4:data[3].cabinChild,
          cabinInfant4:data[3].cabinInfant,
          airlineLogo4:data[3].airlineLogo,
          airlineName4:data[3].airlineName,
          airlineCode4:data[3].airlineCode,
          airlineNumber4:data[3].airlineNumber,
          differenceTime4:data[3].differenceTime,
          departureTime4:data[3].departureTime,
          departureCity4:data[3].departureCity,
          arrivalTime4:data[3].arrivalTime,
          arrivalCity4:data[3].arrivalCity,
          arrivalAirportCode4:data[3].arrivalCityCode,
          tripTypeId:this.flightHelper.getTripTypeId(3),
          domestic:false
        });
      }
      $('#flightDetailsModal').modal('show');
    }catch(exp){}
    // try{
    //   switch(way)
    //   {
    //     case 0:
    //       var data=this.domOneWayData1.find(x=>x.id==ind);
    //       this.flightDetailsModalData.push({
    //         flightData:data.flightSegmentData,
    //         fromFlight:data.departureCityCode,
    //         toFlight:data.arrivalCityCode,
    //         depDay:"",
    //         depMonthNameShort:"",
    //         depDayNameShort:"",
    //         departureDate:data.departureDate,
    //         baggageAdult:data.baggageAdult,
    //         baggageChild:data.baggageChild,
    //         baggageInfant:data.baggageInfant,
    //         cabinAdult:data.cabinAdult,
    //         cabinChild:data.cabinChild,
    //         cabinInfant:data.cabinInfant,
    //         airlineLogo:data.airlineLogo,
    //         airlineName:data.airlineName,
    //         airlineCode:data.airlineCode,
    //         airlineNumber:data.airlineNumber,
    //         differenceTime:data.differenceTime,
    //         departureTime:data.departureTime,
    //         departureCity:data.departureCity,
    //         arrivalTime:data.arrivalTime,
    //         arrivalCity:data.arrivalCity,
    //         arrivalAirportCode:data.arrivalCityCode,
    //         multicity:true,
    //         trip:1
    //       });
    //       // this.flightDetailsModalData1[0].flightData.push(data.flightSegmentData);
    //       break;
    //     case 1:
    //       var data=this.domOneWayData2.find(x=>x.id==ind);
    //       this.flightDetailsModalData.push({
    //         flightData:data.flightSegmentData,
    //         fromFlight:data.departureCityCode,
    //         toFlight:data.arrivalCityCode,
    //         depDay:"",
    //         depMonthNameShort:"",
    //         depDayNameShort:"",
    //         departureDate:data.departureDate,
    //         baggageAdult:data.baggageAdult,
    //         baggageChild:data.baggageChild,
    //         baggageInfant:data.baggageInfant,
    //         cabinAdult:data.cabinAdult,
    //         cabinChild:data.cabinChild,
    //         cabinInfant:data.cabinInfant,
    //         airlineLogo:data.airlineLogo,
    //         airlineName:data.airlineName,
    //         airlineCode:data.airlineCode,
    //         airlineNumber:data.airlineNumber,
    //         differenceTime:data.differenceTime,
    //         departureTime:data.departureTime,
    //         departureCity:data.departureCity,
    //         arrivalTime:data.arrivalTime,
    //         arrivalCity:data.arrivalCity,
    //         arrivalAirportCode:data.arrivalCityCode,
    //         multicity:true,
    //         trip:2
    //       });
    //       // this.flightDetailsModalData2[0].flightData.push(data.flightSegmentData);
    //       break;
    //     case 2:
    //       var data=this.domOneWayData3.find(x=>x.id==ind);
    //       this.flightDetailsModalData.push({
    //         flightData:data.flightSegmentData,
    //         fromFlight:data.departureCityCode,
    //         toFlight:data.arrivalCityCode,
    //         depDay:"",
    //         depMonthNameShort:"",
    //         depDayNameShort:"",
    //         departureDate:data.departureDate,
    //         baggageAdult:data.baggageAdult,
    //         baggageChild:data.baggageChild,
    //         baggageInfant:data.baggageInfant,
    //         cabinAdult:data.cabinAdult,
    //         cabinChild:data.cabinChild,
    //         cabinInfant:data.cabinInfant,
    //         airlineLogo:data.airlineLogo,
    //         airlineName:data.airlineName,
    //         airlineCode:data.airlineCode,
    //         airlineNumber:data.airlineNumber,
    //         differenceTime:data.differenceTime,
    //         departureTime:data.departureTime,
    //         departureCity:data.departureCity,
    //         arrivalTime:data.arrivalTime,
    //         arrivalCity:data.arrivalCity,
    //         arrivalAirportCode:data.arrivalCityCode,
    //         multicity:true,
    //         trip:3
    //       });
    //       // this.flightDetailsModalData3[0].flightData.push(data.flightSegmentData);
    //       break;
    //     case 3:
    //       var data=this.domOneWayData4.find(x=>x.id==ind);
    //       this.flightDetailsModalData.push({
    //         flightData:data.flightSegmentData,
    //         fromFlight:data.departureCityCode,
    //         toFlight:data.arrivalCityCode,
    //         depDay:"",
    //         depMonthNameShort:"",
    //         depDayNameShort:"",
    //         departureDate:data.departureDate,
    //         baggageAdult:data.baggageAdult,
    //         baggageChild:data.baggageChild,
    //         baggageInfant:data.baggageInfant,
    //         cabinAdult:data.cabinAdult,
    //         cabinChild:data.cabinChild,
    //         cabinInfant:data.cabinInfant,
    //         multicity:true,
    //         trip:4
    //       });
    //       // this.flightDetailsModalData4[0].flightData.push(data.flightSegmentData);
    //       break;
    //   }
    //   $('#flightDetailsModal').modal('show');
    // }catch(exp)
    // {}
  }
  
  showFlightDetailsMobile1(ind:any,providerName:any)
  {
    try{
      let data=this.selectedRadioFlightDetails.filter(x=>x.groupAirlineCode.indexOf(ind)>-1 && x.providerName.indexOf(providerName)>-1);
      if(data.length==1){
        this.flightDetailsModalData.push({
          fromFlight1:data[0].departureCityCode,
          toFlight1:data[0].arrivalCityCode,
          depDay:"",
          depMonthNameShort:"",
          depDayNameShort:"",
          departureDate1:data[0].departureDate,
          baggageAdult1:data[0].baggageAdult,
          baggageChild1:data[0].baggageChild,
          baggageInfant1:data[0].baggageInfant,
          cabinAdult1:data[0].cabinAdult,
          cabinChild1:data[0].cabinChild,
          cabinInfant1:data[0].cabinInfant,
          airlineLogo1:data[0].airlineLogo,
          airlineName1:data[0].airlineName,
          airlineCode1:data[0].airlineCode,
          airlineNumber1:data[0].airlineNumber,
          differenceTime1:data[0].differenceTime,
          departureTime1:data[0].departureTime,
          departureCity1:data[0].departureCity,
          arrivalTime1:data[0].arrivalTime,
          arrivalCity1:data[0].arrivalCity,
          arrivalAirportCode1:data[0].arrivalCityCode,
          tripTypeId:this.flightHelper.getTripTypeId(3),
          domestic:false
        });
      }
      if(data.length==2){
        this.flightDetailsModalData.push({
          fromFlight1:data[0].departureCityCode,
          toFlight1:data[0].arrivalCityCode,
          fromFlight2:data[1].departureCityCode,
          toFlight2:data[1].arrivalCityCode,
          depDay:"",
          depMonthNameShort:"",
          depDayNameShort:"",
          departureDate1:data[0].departureDate,
          baggageAdult1:data[0].baggageAdult,
          baggageChild1:data[0].baggageChild,
          baggageInfant1:data[0].baggageInfant,
          cabinAdult1:data[0].cabinAdult,
          cabinChild1:data[0].cabinChild,
          cabinInfant1:data[0].cabinInfant,
          airlineLogo1:data[0].airlineLogo,
          airlineName1:data[0].airlineName,
          airlineCode1:data[0].airlineCode,
          airlineNumber1:data[0].airlineNumber,
          differenceTime1:data[0].differenceTime,
          departureTime1:data[0].departureTime,
          departureCity1:data[0].departureCity,
          arrivalTime1:data[0].arrivalTime,
          arrivalCity1:data[0].arrivalCity,
          arrivalAirportCode1:data[0].arrivalCityCode,
          departureDate2:data[1].departureDate,
          baggageAdult2:data[1].baggageAdult,
          baggageChild2:data[1].baggageChild,
          baggageInfant2:data[1].baggageInfant,
          cabinAdult2:data[1].cabinAdult,
          cabinChild2:data[1].cabinChild,
          cabinInfant2:data[1].cabinInfant,
          airlineLogo2:data[1].airlineLogo,
          airlineName2:data[1].airlineName,
          airlineCode2:data[1].airlineCode,
          airlineNumber2:data[1].airlineNumber,
          differenceTime2:data[1].differenceTime,
          departureTime2:data[1].departureTime,
          departureCity2:data[1].departureCity,
          arrivalTime2:data[1].arrivalTime,
          arrivalCity2:data[1].arrivalCity,
          arrivalAirportCode2:data[1].arrivalCityCode,
          tripTypeId:this.flightHelper.getTripTypeId(3),
          domestic:false
        });
      }
      if(data.length==3){
        this.flightDetailsModalData.push({
          fromFlight1:data[0].departureCityCode,
          toFlight1:data[0].arrivalCityCode,
          fromFlight2:data[1].departureCityCode,
          toFlight2:data[1].arrivalCityCode,
          fromFlight3:data[2].departureCityCode,
          toFlight3:data[2].arrivalCityCode,
          depDay:"",
          depMonthNameShort:"",
          depDayNameShort:"",
          departureDate1:data[0].departureDate,
          baggageAdult1:data[0].baggageAdult,
          baggageChild1:data[0].baggageChild,
          baggageInfant1:data[0].baggageInfant,
          cabinAdult1:data[0].cabinAdult,
          cabinChild1:data[0].cabinChild,
          cabinInfant1:data[0].cabinInfant,
          airlineLogo1:data[0].airlineLogo,
          airlineName1:data[0].airlineName,
          airlineCode1:data[0].airlineCode,
          airlineNumber1:data[0].airlineNumber,
          differenceTime1:data[0].differenceTime,
          departureTime1:data[0].departureTime,
          departureCity1:data[0].departureCity,
          arrivalTime1:data[0].arrivalTime,
          arrivalCity1:data[0].arrivalCity,
          arrivalAirportCode1:data[0].arrivalCityCode,
          departureDate2:data[1].departureDate,
          baggageAdult2:data[1].baggageAdult,
          baggageChild2:data[1].baggageChild,
          baggageInfant2:data[1].baggageInfant,
          cabinAdult2:data[1].cabinAdult,
          cabinChild2:data[1].cabinChild,
          cabinInfant2:data[1].cabinInfant,
          airlineLogo2:data[1].airlineLogo,
          airlineName2:data[1].airlineName,
          airlineCode2:data[1].airlineCode,
          airlineNumber2:data[1].airlineNumber,
          differenceTime2:data[1].differenceTime,
          departureTime2:data[1].departureTime,
          departureCity2:data[1].departureCity,
          arrivalTime2:data[1].arrivalTime,
          arrivalCity2:data[1].arrivalCity,
          arrivalAirportCode2:data[1].arrivalCityCode,
          departureDate3:data[2].departureDate,
          baggageAdult3:data[2].baggageAdult,
          baggageChild3:data[2].baggageChild,
          baggageInfant3:data[2].baggageInfant,
          cabinAdult3:data[2].cabinAdult,
          cabinChild3:data[2].cabinChild,
          cabinInfant3:data[2].cabinInfant,
          airlineLogo3:data[2].airlineLogo,
          airlineName3:data[2].airlineName,
          airlineCode3:data[2].airlineCode,
          airlineNumber3:data[2].airlineNumber,
          differenceTime3:data[2].differenceTime,
          departureTime3:data[2].departureTime,
          departureCity3:data[2].departureCity,
          arrivalTime3:data[2].arrivalTime,
          arrivalCity3:data[2].arrivalCity,
          arrivalAirportCode3:data[2].arrivalCityCode,
          tripTypeId:this.flightHelper.getTripTypeId(3),
          domestic:false
        });
      }
      if(data.length==4){
        this.flightDetailsModalData.push({
          fromFlight1:data[0].departureCityCode,
          toFlight1:data[0].arrivalCityCode,
          fromFlight2:data[1].departureCityCode,
          toFlight2:data[1].arrivalCityCode,
          fromFlight3:data[2].departureCityCode,
          toFlight3:data[2].arrivalCityCode,
          fromFlight4:data[3].departureCityCode,
          toFlight4:data[3].arrivalCityCode,
          depDay:"",
          depMonthNameShort:"",
          depDayNameShort:"",
          departureDate1:data[0].departureDate,
          baggageAdult1:data[0].baggageAdult,
          baggageChild1:data[0].baggageChild,
          baggageInfant1:data[0].baggageInfant,
          cabinAdult1:data[0].cabinAdult,
          cabinChild1:data[0].cabinChild,
          cabinInfant1:data[0].cabinInfant,
          airlineLogo1:data[0].airlineLogo,
          airlineName1:data[0].airlineName,
          airlineCode1:data[0].airlineCode,
          airlineNumber1:data[0].airlineNumber,
          differenceTime1:data[0].differenceTime,
          departureTime1:data[0].departureTime,
          departureCity1:data[0].departureCity,
          arrivalTime1:data[0].arrivalTime,
          arrivalCity1:data[0].arrivalCity,
          arrivalAirportCode1:data[0].arrivalCityCode,
          departureDate2:data[1].departureDate,
          baggageAdult2:data[1].baggageAdult,
          baggageChild2:data[1].baggageChild,
          baggageInfant2:data[1].baggageInfant,
          cabinAdult2:data[1].cabinAdult,
          cabinChild2:data[1].cabinChild,
          cabinInfant2:data[1].cabinInfant,
          airlineLogo2:data[1].airlineLogo,
          airlineName2:data[1].airlineName,
          airlineCode2:data[1].airlineCode,
          airlineNumber2:data[1].airlineNumber,
          differenceTime2:data[1].differenceTime,
          departureTime2:data[1].departureTime,
          departureCity2:data[1].departureCity,
          arrivalTime2:data[1].arrivalTime,
          arrivalCity2:data[1].arrivalCity,
          arrivalAirportCode2:data[1].arrivalCityCode,
          departureDate3:data[2].departureDate,
          baggageAdult3:data[2].baggageAdult,
          baggageChild3:data[2].baggageChild,
          baggageInfant3:data[2].baggageInfant,
          cabinAdult3:data[2].cabinAdult,
          cabinChild3:data[2].cabinChild,
          cabinInfant3:data[2].cabinInfant,
          airlineLogo3:data[2].airlineLogo,
          airlineName3:data[2].airlineName,
          airlineCode3:data[2].airlineCode,
          airlineNumber3:data[2].airlineNumber,
          differenceTime3:data[2].differenceTime,
          departureTime3:data[2].departureTime,
          departureCity3:data[2].departureCity,
          arrivalTime3:data[2].arrivalTime,
          arrivalCity3:data[2].arrivalCity,
          arrivalAirportCode3:data[2].arrivalCityCode,
          departureDate4:data[3].departureDate,
          baggageAdult4:data[3].baggageAdult,
          baggageChild4:data[3].baggageChild,
          baggageInfant4:data[3].baggageInfant,
          cabinAdult4:data[3].cabinAdult,
          cabinChild4:data[3].cabinChild,
          cabinInfant4:data[3].cabinInfant,
          airlineLogo4:data[3].airlineLogo,
          airlineName4:data[3].airlineName,
          airlineCode4:data[3].airlineCode,
          airlineNumber4:data[3].airlineNumber,
          differenceTime4:data[3].differenceTime,
          departureTime4:data[3].departureTime,
          departureCity4:data[3].departureCity,
          arrivalTime4:data[3].arrivalTime,
          arrivalCity4:data[3].arrivalCity,
          arrivalAirportCode4:data[3].arrivalCityCode,
          tripTypeId:this.flightHelper.getTripTypeId(3),
          domestic:false
        });
      }
      $('#flightDetailsModal').modal('show');
    }catch(exp){}
  }
  showFareDetailsMobile(ind:any)
  {
    this.fareDetailsModalData=[];
    try{
      let data=this.selectedRadioFlightDetails.filter(x=>x.groupAirlineCode.indexOf(ind)>-1);
      this.fareDetailsModalData=data;
      $('#fareDetailsModal').modal('show');
    }catch(exp){}
  }
  showFareDetailsMobile1(ind:any,providerName:any)
  {
    this.fareDetailsModalData=[];
    try{
      let data=this.selectedRadioFlightDetails.filter(x=>x.groupAirlineCode.indexOf(ind)>-1 && x.providerName.indexOf(providerName)>-1);
      this.fareDetailsModalData=data;
      $('#fareDetailsModal').modal('show');
    }catch(exp){}
  }
  viewMoreFlights(id:any)
  {
    const data=this.document.getElementById(id);
    if(!this.shareService.isNullOrEmpty(data))
    {
      if(data?.classList.contains("clicked"))
      {
        data?.classList.remove("clicked");
        $("#txt"+id).text("View More Flights");
      }else{
        data?.classList.add("clicked");
        $("#txt"+id).text("Hide More Flights");
      }
    }
  }
  isShowViewMore(rootItem:any,tripItem:any):boolean
  {
    let ret=this.getTripDetails(rootItem,tripItem).length;
    return ret>=2;
  }
  isShowViewMore1(rootItem:any,tripItem:any,providerName:any):boolean
  {
    let ret=this.getTripDetails1(rootItem,tripItem,providerName).length;
    return ret>=2;
  }
  setDepartureTimeFilter(a_p:any,before6:number,am6:number,after12pm:number,after6:number,leg:number)
  {
    try{
      let route="("+this.selectedFlightDeparture[leg-1].CityCode+"-"+this.selectedFlightArrival[leg-1].CityCode+")";
      if(this.departureTimeFilter.findIndex(x=>x.key===leg)==-1)
      {
        this.departureTimeFilter.push({key:leg,value:[]});
      }
      if(a_p.toString().indexOf('AM')>-1)
      {
        if(this.departureTimeFilter[leg-1].value.find((x: { id: string; })=>x.id==this.flightHelper.getMakeId(leg-1,"DEPT",0))==undefined && before6>0)
        {
          this.departureTimeFilter[leg-1].value.push({id:this.flightHelper.getMakeId(leg-1,"DEPT",0),
          title:route+"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",
          price:before6,logo:'../../../assets/dist/img/sun.svg'});

          if(this.popularFilter.findIndex(x=>x.id.indexOf(this.flightHelper.getMakeId(0,"DEPT",0))>-1)<0)
          {
            this.popularFilter.push({id:this.flightHelper.getMakeId(0,"DEPT",0),title:"Morning Departure",value:"Before 06AM",len:"",
            details:"12:00 AM-05:59 AM",price:before6,origin:"departure"});
          }
          // console.log("");
        }
        if(this.departureTimeFilter[leg-1].value.find((x: { id: string; })=>x.id==this.flightHelper.getMakeId(leg-1,"DEPT",1))==undefined && am6>0)
        {
          this.departureTimeFilter[leg-1].value.push({id:this.flightHelper.getMakeId(leg-1,"DEPT",1),
          title:route+"06AM - 12PM",details:"06:00 AM-11:59 AM",
          value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
        }
      }
      if(a_p.toString().indexOf('PM')>-1)
      {
        if(this.departureTimeFilter[leg-1].value.find((x: { id: string; })=>x.id==this.flightHelper.getMakeId(leg-1,"DEPT",2))==undefined && after12pm>0)
        {
          this.departureTimeFilter[leg-1].value.push({id:this.flightHelper.getMakeId(leg-1,"DEPT",2),title:route+"12PM - 06PM",
          details:"12:00 PM-05:59 PM",value:"12PM-06PM",
          price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
        }
        if(this.departureTimeFilter[leg-1].value.find((x: { id: string; })=>x.id==this.flightHelper.getMakeId(leg-1,"DEPT",3))==undefined && after6>0)
        {
          this.departureTimeFilter[leg-1].value.push({id:this.flightHelper.getMakeId(leg-1,"DEPT",3),title:route+"After 06PM",details:"06:00 PM-11:59 PM",
          value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
        }
      }
    }catch(exp){}
  }
  getTitle(i:number,data:string):string
  {
      let ret="("+this.selectedFlightDeparture[i].CityCode+"-"+this.selectedFlightArrival[i].CityCode+")";
      return data.replace(ret,"");
  }
  setArrivalTimeFilter(a_p:any,before6:any,am6:any,after12pm:any,after6:any,leg:number)
  {
    try{
      let route="("+this.selectedFlightDeparture[leg-1].CityCode+"-"+this.selectedFlightArrival[leg-1].CityCode+")";
      if(this.arrivalTimeFilter.findIndex(x=>x.key===leg)==-1)
      {
        this.arrivalTimeFilter.push({key:leg,value:[]});
      }
      if(a_p.toString().indexOf('AM')>-1)
      {
        if(this.arrivalTimeFilter[leg-1].value.find((x: { id: string; })=>x.id==this.flightHelper.getMakeId(leg-1,"ARR",0))==undefined && before6>0)
        {
          this.arrivalTimeFilter[leg-1].value.push({id:this.flightHelper.getMakeId(leg-1,"ARR",0),title:route+"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",
          price:before6,logo:'../../../assets/dist/img/sun.svg'});
        }
        if(this.arrivalTimeFilter[leg-1].value.find((x: { id: string; })=>x.id==this.flightHelper.getMakeId(leg-1,"ARR",1))==undefined && am6>0)
        {
          this.arrivalTimeFilter[leg-1].value.push({id:this.flightHelper.getMakeId(leg-1,"ARR",1),title:route+"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",
          price:am6,logo:'../../../assets/dist/img/sun.svg'});
        }
      }
      if(a_p.toString().indexOf('PM')>-1)
      {
        if(this.arrivalTimeFilter[leg-1].value.find((x: { id: string; })=>x.id==this.flightHelper.getMakeId(leg-1,"ARR",2))==undefined && after12pm>0)
        {
          this.arrivalTimeFilter[leg-1].value.push({id:this.flightHelper.getMakeId(leg-1,"ARR",2),title:route+"12PM - 06PM",
          details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
        }
        if(this.arrivalTimeFilter[leg-1].value.find((x: { id: string; })=>x.id==this.flightHelper.getMakeId(leg-1,"ARR",3))==undefined && after6>0)
        {
          this.arrivalTimeFilter[leg-1].value.push({id:this.flightHelper.getMakeId(leg-1,"ARR",3),title:route+"After 06PM",
          details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
        }
      }
    }catch(exp){}
  }
  filterRefund(type:string,trip:number,event:any)
  {
    this.refundFilterList=[];
    try{
      this.refundFilterList=[];
      if(type=="Yes")
      {
        let getUIDREF=this.flightHelper.getMakeId(trip,"REF");
        let getUIDNONREF=this.flightHelper.getMakeId(trip,"NONREF");
        if(event.target.checked)
        {
          if(!this.flightHelper._isExistAppliedFilter(getUIDREF,this.appliedFilter))
          {
            this.addAppliedFilterItem(getUIDREF,"fa fa-times-circle-o","","","Refundable","Refundable","0");
            this.refundFilterList.push(true);
            $("#chkRefundNo"+getUIDNONREF).prop("checked",false);
            this.removeAppliedFilterItem(getUIDNONREF,"");
          }
        }else{
          this.removeAppliedFilterItem(getUIDREF,"");
        }
      }
      if(type=="No")
      {
        let getUIDREF=this.flightHelper.getMakeId(trip,"REF");
        let getUIDNONREF=this.flightHelper.getMakeId(trip,"NONREF");
        if(event.target.checked)
        {
          if(!this.flightHelper._isExistAppliedFilter(getUIDNONREF,this.appliedFilter))
          {
            this.addAppliedFilterItem(getUIDNONREF,"fa fa-times-circle-o","","","NonRefundable","NonRefundable","1");
            this.refundFilterList.push(false);
            $("#chkRefundYes"+getUIDREF).prop("checked",false);
            this.removeAppliedFilterItem(getUIDREF,"");
          }
        }else{
          this.removeAppliedFilterItem(getUIDNONREF,"");
        }
      }
      this.filterFlightSearch();
    }catch(exp){}
  }
  addAppliedFilterItem(id:string,cancel_class:string,schedule_class:string,arrow_class:string,title:string,value:string,origin:string)
  {
    this.appliedFilter.push({Id:id,CancelClass:cancel_class,ScheduleClass:schedule_class,
      ArrowClass:arrow_class,Title:title,Value:value,Origin:origin});
  }
  removeAppliedFilterItem(Id:string,ScheduleClass:string)
  {
    if(this.shareService.isNullOrEmpty(ScheduleClass))
    {
      this.appliedFilter=this.appliedFilter.filter(x=>x.Id.toString().trim().toLowerCase()!=Id.toString().trim().toLowerCase());
    }else{
      let findInd=this.appliedFilter.findIndex(x=>x.Id.toString().trim().toLowerCase()==Id.toString().trim().toLowerCase() &&
      x.ScheduleClass.toString().trim().toLowerCase()==ScheduleClass.toString().trim().toLowerCase());
      this.appliedFilter.splice(findInd,1);
    }
    for(let tripIdx=0;tripIdx<this.selectedFlightArrival.length;tripIdx++)
    {
      //Unchecked Stop Count
      for(let stopIdx=0;stopIdx<this.stopCountList.length;stopIdx++)
      {
        if(this.stopCountList[stopIdx].id.toString().toLowerCase()==Id.toString().toLowerCase())
        {
          $("#stopId"+this.flightHelper.getMakeId(tripIdx,"STOP",stopIdx)).prop("checked",false);
          $("#popularFilterId"+this.flightHelper.getMakeId(tripIdx,"STOP",stopIdx)).prop("checked",false);
        }
      }
      //Deselect departure panel
      if(ScheduleClass.toString().trim()=="dep_shedule")
      {
        for(let deptIdx=0;deptIdx<this.departureTimeFilter[tripIdx].value.length;deptIdx++)
        {
          let getUID=this.flightHelper.getMakeId(tripIdx,"DEPT",deptIdx);
          if(getUID.toString().toLowerCase()==Id.toString().toLowerCase())
          {
            this.flightHelper._scheduleWidgetDeSelect(getUID,'dept');
            this.selectedDeptTimeList=this.selectedDeptTimeList.filter(x=>x.id.toString().toLowerCase()
            !=Id.toString().toLowerCase());
          }
        }
      }
      //Deselect arrival panel
      if(ScheduleClass.toString().trim()=="ret_shedule")
      {
        for(let arrIdx=0;arrIdx<this.arrivalTimeFilter[tripIdx].value.length;arrIdx++)
        {
          let getUID=this.flightHelper.getMakeId(tripIdx,"ARR",arrIdx);
          if(getUID.toString().toLowerCase()==Id.toString().toLowerCase())
          {
            this.flightHelper._scheduleWidgetDeSelect(getUID,'arr');
            this.selectedArrTimeList=this.selectedArrTimeList.filter(x=>x.id.toString().toLowerCase()
            !=Id.toString().toLowerCase());
          }
        }
      }
    }
    //Unchecked airline
    for(let i=0;i<this.airlines.length;i++)
    {
      let item=this.flightHelper.getAirlineName(this.airlines[i].code,this.airlines);
      if(item.toString().toLowerCase()==Id.toString().toLowerCase())
      {
        $("#filterId"+this.airlines[i].code).prop("checked",false);
        this.selectedAirFilterList=this.shareService.removeList(this.airlines[i].code,this.selectedAirFilterList);
      }
    }
    // console.log("Applied Filter Item ::");
    // console.log(this.appliedFilter);
    this.filterFlightSearch();
  }
  changeWayPrice()
  {
    this.tempFlightData=this.flightData;
    let min:number,max:number,id: number,dif:number=0;
    let updatedMax:number=0;
    min=Number.parseFloat(this.flightHelper._minimumRange(this.flightData));
    max=Number.parseFloat(this.flightHelper._maximumRange(this.flightData));
    id = $("#changeWayPriceID").val();
    dif=min+(((max-min)/100)*id);
    this.udMinRangeVal=dif;
    updatedMax=this.udMinRangeVal;
    this.appliedFilter.forEach((item,index)=>{
      if(item.Origin=="range") this.appliedFilter.splice(index,1);
    });
    if(min!=this.udMinRangeVal)
    {
      this.addAppliedFilterItem("RANGE","fa fa-times-circle-o","","",min+"-"+this.udMinRangeVal,min+"-"+this.udMinRangeVal,
        "range");
    }
    this.filterFlightSearch();
  }
  removeAllAppliedFilterItem()
  {
    this.appliedFilter=[];
    this.selectedDeptTimeList=[];
    this.selectedArrTimeList=[];
    this.selectedAirFilterList=[];
    $("#chkRefundYes").prop("checked",false);
    $("#chkRefundNo").prop("checked",false);
    for(let item of this.stopCountList)
    {
      $("#stopId"+item.id).prop("checked",false);
    }
    for(let item of this.airlines)
    {
      $("#filterId"+item.code).prop("checked",false);
    }

    for(let item of this.departureTimeFilter)
    {
      let i=(item.title.replaceAll('-','')).replaceAll(' ','');
      this.flightHelper._scheduleWidgetDeSelect(i,'dept');
    }
    for(let item of this.arrivalTimeFilter)
    {
      let i=(item.title.replaceAll('-','')).replaceAll(' ','');
      this.flightHelper._scheduleWidgetDeSelect(i,'arr');
    }
    for(let item of this.popularFilter)
    {
      $("#popularFilterId"+(item.id.replaceAll('-','')).replaceAll(' ','')).prop("checked",false);
    }
    this.setTempFilterData();
  }
  stopWiseFilter(data:any,stopIdx:any,tripIdx:any,event:any)
  {
    let getUID=this.flightHelper.getMakeId(tripIdx,"STOP",stopIdx);
    if(event.target.checked)
    {
      if(!this.flightHelper._isExistAppliedFilter(getUID,this.appliedFilter))
      {
        this.addAppliedFilterItem(getUID+"STOP","fa fa-times-circle-o","","",data.title,data.id,data.id);
      }
    }else{
      this.removeAppliedFilterItem(getUID,"");
    }
    this.filterFlightSearch();
  }
  filterAirlines(id:any,event:any,isFilterTop:boolean=false)
  {
    if(!isFilterTop)
    {
      if(event.target.checked)
      {
        if(!this.flightHelper._isExistAppliedFilter(this.flightHelper.getAirlineName(id,this.airlines),this.appliedFilter))
        {
          this.addAppliedFilterItem(this.flightHelper.getAirlineName(id,this.airlines)
          ,"fa fa-times-circle-o","","",
          this.flightHelper.getAirlineName(id,this.airlines),
          this.flightHelper.getAirlineName(id,this.airlines),
          this.flightHelper.getAirlineName(id,this.airlines));
        }
      }else{
        this.removeAppliedFilterItem(this.flightHelper.getAirlineName(id,this.airlines),"");
      }
    }
    for(let i=0;i<this.airlines.length;i++)
    {
      if(!isFilterTop)
      {
        var isChecked=$("#filterId"+this.airlines[i].code).is(":checked");
        if(isChecked)
        {
          var item=$("input[id='filterId"+this.airlines[i].code+"']:checked").val();
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
        $("#filterId"+id).prop("checked",true);
        if(!this.flightHelper._isExistAppliedFilter(this.flightHelper.getAirlineName(id,this.airlines),this.airlines))
        {
          this.addAppliedFilterItem(this.flightHelper.getAirlineName(id,this.airlines)
          ,"fa fa-times-circle-o","","",
          this.flightHelper.getAirlineName(id,this.airlines),
          this.flightHelper.getAirlineName(id,this.airlines),
          this.flightHelper.getAirlineName(id,this.airlines));
        }
      }
    }
    this.filterFlightSearch();
  }
  filterDepartureTime(data:any,deptIdx:any,tripIdx:any,event:any)
  {
    this.selectedDeptTimeList=[];
    try{
      this.selectedDeptTimeList=[];
      let getUID=this.flightHelper.getMakeId(tripIdx,"DEPT",deptIdx);
      if(event.target.checked)
      {
        var item=data.details;
        this.flightHelper._scheduleWidgetSelect(getUID,'dept');
        let fh=item.toString().split('-')[0];
        let th=item.toString().split('-')[1];
        fh = moment(fh, ["h:mm A"]).format("HH:mm");
        th = moment(th, ["h:mm A"]).format("HH:mm");
        if(!this.flightHelper._isExistAppliedFilter(getUID,this.appliedFilter,"dep_shedule"))
        {
          this.addAppliedFilterItem(getUID,"fa fa-times-circle-o","dep_shedule",
          "fa fa-arrow-right",data.title,item,fh+"-"+th);
        }
      }else{
        this.removeAppliedFilterItem(getUID,'dep_shedule');
      }
      for(let deptItem of this.departureTimeFilter)
      {
        for(let subItem of deptItem.value)
        {
          var isItem=$("#scheduleDept"+getUID).is(":checked");
          if(isItem)
          {
            let fh=subItem.details.toString().split('-')[0];
            let th=subItem.details.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            for(let itiITem of this.itineraries)
            {
              let time=this.flightHelper._scheduleDescs(itiITem.legs[0].ref-1,this.scheduleDescs).departure.time;
              if(time.toString().split(':')[0]>=fh.toString().split(':')[0] && time.toString().split(':')[0]<=th.toString().split(':')[0])
              {
                this.selectedDeptTimeList.push({id:item,text:time.toString().split(':')[0]+":"+time.toString().split(':')[1]});
              }
            }
          }
        }
      }
      this.filterFlightSearch();
    }catch(exp){
      console.log(exp);
    }
  }
  filterArrivalTime(data:any,arrIdx:any,tripIdx:any,event:any)
  {
    this.selectedArrTimeList=[];
    try{
      let getUID=this.flightHelper.getMakeId(tripIdx,"ARR",arrIdx);
      if(event.target.checked)
      {
        var item=data.details;
        this.flightHelper._scheduleWidgetSelect(getUID,'arr');
        let fh=item.toString().split('-')[0];
        let th=item.toString().split('-')[1];
        fh = moment(fh, ["h:mm A"]).format("HH:mm");
        th = moment(th, ["h:mm A"]).format("HH:mm");
        if(!this.flightHelper._isExistAppliedFilter(item,this.appliedFilter,"ret_shedule"))
        {
          this.addAppliedFilterItem(getUID,"fa fa-times-circle-o","ret_shedule","fa fa-arrow-left",data.title,item,fh+"-"+th);
        }
      }else{
        this.removeAppliedFilterItem(getUID,'ret_shedule');
      }
      for(let item of this.arrivalTimeFilter)
      {
        var isItem=$("#scheduleArr"+getUID).is(":checked");
        if(isItem)
        {
          let fh=item.details.toString().split('-')[0];
          let th=item.details.toString().split('-')[1];
          fh = moment(fh, ["h:mm A"]).format("HH:mm");
          th = moment(th, ["h:mm A"]).format("HH:mm");
          for(let rootItem of this.flightData)
          {
            for(let subItem of rootItem.flightSegmentData)
            {
              let time=subItem.arrivalTime;
              if(time.toString().split(':')[0]>=fh.toString().split(':')[0] && time.toString().split(':')[0]<=th.toString().split(':')[0])
              {
                this.selectedArrTimeList.push({id:subItem,text:time.toString().split(':')[0]+":"+time.toString().split(':')[1]});
              }
            }
          }
        }
      }
      this.filterFlightSearch();
    }catch(exp){}
  }

  filterFlightSearch()
  {
    this.flightData=this.flightData;
    let minRange=this.flightHelper._minimumRange(this.flightData);
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
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && deptTimeFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && deptTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }
    else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined
      && airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(stopList.length>0 && isRefund!=undefined && deptTimeFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }
    else if(stopList.length>0 && isRefund!=undefined&& deptTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(isRefund!=undefined&& deptTimeFilter.length>0 && arrTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(maxRange!=0 && stopList.length>0 && isRefund!=undefined)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund;
      });
    }else if(maxRange!=0 && stopList.length>0 && deptTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(maxRange!=0 && stopList.length>0 && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(maxRange!=0 && stopList.length>0 && airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(stopList.length>0 && isRefund!=undefined&& deptTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(stopList.length>0 && isRefund!=undefined&& arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(stopList.length>0 && isRefund!=undefined&& airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(isRefund!=undefined&& deptTimeFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(isRefund!=undefined&& deptTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(deptTimeFilter.length>0 && arrTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }//two
    else if(maxRange!=0 && stopList.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && stopList.indexOf(i.stop)>-1;
      });
    }else if(maxRange!=0 && isRefund!=undefined)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && i.refundable==isRefund;
      });
    }else if(maxRange!=0 && deptTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(maxRange!=0 && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(maxRange!=0 && airlineFilter.length>0 )
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return (i.totalPrice >= minRange && i.totalPrice <maxRange)
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(stopList.length>0 && isRefund!=undefined)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && i.refundable==isRefund;
      });
    }else if(stopList.length>0 && deptTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(stopList.length>0 && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(stopList.length>0 && airlineFilter.length>0){
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return stopList.indexOf(i.stop)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if(isRefund!=undefined&& deptTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return i.refundable==isRefund
        && deptTimeFilter.indexOf(i.departureTime)>-1;
      });
    }else if(isRefund!=undefined&& arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return i.refundable==isRefund
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(isRefund!=undefined&& airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return i.refundable==isRefund
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(deptTimeFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return deptTimeFilter.indexOf(i.departureTime)>-1
        && arrTimeFilter.indexOf(i.arrivalTime)>-1;
      });
    }else if(deptTimeFilter.length>0 && airlineFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return deptTimeFilter.indexOf(i.departureTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }else if(airlineFilter.length>0 && arrTimeFilter.length>0)
    {
      this.tempFlightData=this.flightData.filter(function(i, j) {
        return arrTimeFilter.indexOf(i.arrivalTime)>-1
        && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else {
      if(maxRange!=0)
      {
        this.tempFlightData=this.flightData.filter(function(i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <maxRange);
        });
      }else if(stopList.length>0)
      {
        this.tempFlightData=this.flightData.filter(function(i, j) {
          return stopList.indexOf(i.stop)>-1;
        });
      }else if(isRefund!=undefined)
      {
        this.tempFlightData=this.flightData.filter(function(i, j) {
          return i.refundable==isRefund;
        });
      }else if(deptTimeFilter.length>0)
      {
        this.tempFlightData=this.flightData.filter(function(i, j) {
          return deptTimeFilter.indexOf(i.departureTime)>-1;
        });
      }else if(arrTimeFilter.length>0)
      {
        this.tempFlightData=this.flightData.filter(function(i, j) {
          return arrTimeFilter.indexOf(i.arrivalTime)>-1;
        });
      }else if(airlineFilter.length>0)
      {
        this.tempFlightData=this.flightData.filter(function(i, j) {
          return airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }else{
        this.setTempFilterData();
      }
    }
  }
  setTempFilterData()
  {
    this.tempFlightData=[];
    this.tempFlightData=this.flightData;
    // this.tempFlightData=this.tempFlightData.slice(0,10);
    $("#viewMoreAction").css("display","block");
  }
  popularFilterItem(item:any,event:any)
  {
    try{
      // if(event.target.checked)
      // {
      //   switch(item.origin)
      //   {
      //     case "refundable":
      //       // this.refundFilterList=[];
      //       // if(!this._isExistAppliedFilter(item.id))
      //       // {
      //       //   this.addAppliedFilterItem("fa fa-times-circle-o","","","Refundable","Refundable","0");
      //       // }
      //       // this.refundFilterList.push(true);
      //       // $("#chkRefundYes").prop("checked",true);
      //       // $("#chkRefundNo").prop("checked",false);
      //       // this.removeAppliedFilterItem("NonRefundable");
      //       break;
      //     case "stop":
      //       let getUID=this.flightHelper.getMakeId(0,"STOP");
      //       $("#stopId"+getUID).prop("checked",true);
      //       if(!this.flightHelper._isExistAppliedFilter(item.id,this.appliedFilter))
      //       {
      //         this.addAppliedFilterItem("fa fa-times-circle-o","","",item.title,item.id,item.id);
      //       }
      //       break;
      //     case "departure":
      //       $("#scheduleDept"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",true);
      //       let i=(item.value.replaceAll('-','')).replaceAll(' ','');
      //       this.flightHelper._scheduleWidgetSelect(i,'dept');
      //       if(!this.flightHelper._isExistAppliedFilter(item.id,this.appliedFilter))
      //       {
      //         this.addAppliedFilterItem("fa fa-times-circle-o","dep_shedule","fa fa-arrow-right",
      //         item.value,item.details,"departure");
      //       }
      //       break;
      //     case "arrival":
      //       $("#scheduleArr"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",true);
      //       let j=(item.value.replaceAll('-','')).replaceAll(' ','');
      //       this.flightHelper._scheduleWidgetSelect(j,'arr');
      //       if(!this.flightHelper._isExistAppliedFilter(item.id,this.appliedFilter))
      //       {
      //         this.addAppliedFilterItem("fa fa-times-circle-o","ret_shedule","fa fa-arrow-left",
      //         item.value,item.details,"arrival");
      //       }
      //       break;
      //     default:
      //       break;
      //   }
      // }else{
      //   switch(item.origin)
      //   {
      //     case "refundable":
      //       this.removeAppliedFilterItem(item.id,"");
      //       $("#chkRefundYes").prop("checked",false);
      //       break;
      //     case "stop":
      //       this.removeAppliedFilterItem(item.id,"");
      //       $("#stopId"+item.id).prop("checked",false);
      //       break;
      //     case "departure":
      //       this.removeAppliedFilterItem(item.details,"dep_shedule");
      //       $("#scheduleDept"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",true);
      //       let i=(item.value.replaceAll('-','')).replaceAll(' ','');
      //       this.flightHelper._scheduleWidgetDeSelect(i,'dept');
      //       break;
      //     case "arrival":
      //       this.removeAppliedFilterItem(item.details,"ret_shedule");
      //       $("#scheduleArr"+(item.value.replaceAll('-','')).replaceAll(' ','')).prop("checked",true);
      //       let j=(item.value.replaceAll('-','')).replaceAll(' ','');
      //       this.flightHelper._scheduleWidgetDeSelect(j,'arr');
      //       break;
      //     default:
      //       break;
      //   }
      // }
      this.filterFlightSearch();
    }catch(exp){}
  }
  //-----------------------------------------------------------------------------------------------------Panel work Start
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
          });
        });
        break;
      case 2:
        this.isRoundtrip=true;
        this.selectedFlightArrival[0].Date=this.getCurrentDate();
        this.setReturnPanel(this.selectedFlightArrival[0].Date);
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
            minDate:this.shareService.getFlatPickDate(this.selectedFlightArrivalPanel[0].Date)
          });
        });
        break;
      case 3:
        this.isMulticity=true;
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
          window.location.reload();
        }
      }
  }
  //-----------------------------------------------------------------------------------------------------------------------Panel work end
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
  dateChangeApi(type:boolean=true,groupCode:string)
  {
    this.CancellationList=[];
    try{
      let data=<any[]>this.getSelectedViewFlights(groupCode);
      let n=0;
      for(let item of data)
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
          this.setResponseText(data.res,data.amount,item.airlineCode,type,item.tripTitle);
        },err=>{
        });
        n+=1;
      }
    }catch(exp){
      console.log(exp);
    }
  }
  dateChangeApi1(type:boolean=true,groupCode:string,providerName:any)
  {
    this.CancellationList=[];
    try{
      let data=<any[]>this.getSelectedViewFlights1(groupCode,providerName);
      let n=0;
      for(let item of data)
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
          this.setResponseText(data.res,data.amount,item.airlineCode,type,item.tripTitle);
        },err=>{
        });
        n+=1;
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
      let fare=envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let txt=fare.toString().replace(/\s+/g, ' ').trim();
      let crop=txt.substring(txt.indexOf(firstCap)+firstCap.length,txt.indexOf(lastCap));
      txtAmt=crop.split(' ')[1];
      txtPre=crop.split(' ')[0];
    }
    this.CancellationList.push({
      Type:"Date",Trip:way,TextAmount:txtAmt,TextPre:txtPre,TextPost:txtPost,Load:false
    });
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
      let fare=envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let txt=fare.toString().replace(/\s+/g, ' ').trim();
      let crop=txt.substring(txt.indexOf(firstCap)+firstCap.length,txt.indexOf(lastCap));
      txtAmt=crop.split(' ')[1];
      txtPre=crop.split(' ')[0];
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
    return isLoad;
  }
  _getTotalTravellers():number{
    return this.num1+this.num2+this.num3;
  }
  moveLeftFlight() {
    this.flightItem.moveLeft();
  }

  moveRightFlight() {
    this.flightItem.moveRight();
  }
  private setDeparturePanel(date:any)
  {
    this.selectedDeparturePanelText=
    this.shareService.getDayNameShort(date)+", "+
    this.shareService.getDay(date)+" "+
    this.shareService.getMonthShort(date)+"'"+
    this.shareService.getYearShort(date);
  }
  private setReturnPanel(date:any){
    this.selectedReturnPanelText=
    this.shareService.getDayNameShort(date)+", "+
    this.shareService.getDay(date)+" "+
    this.shareService.getMonthShort(date)+"'"+
    this.shareService.getYearShort(date);
  }
  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }
}
