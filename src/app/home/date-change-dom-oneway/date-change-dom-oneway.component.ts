import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from '../../_services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Select2OptionData } from 'ng-select2';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
import { DatePipe, DOCUMENT } from '@angular/common';
import { ShareService } from '../../_services/share.service';
import { Component, ElementRef, Inject, OnInit, HostListener, Renderer2, SystemJsNgModuleLoader, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FlightHelperService } from '../flight-helper.service';
import flatpickr from "flatpickr";
import { DragScrollComponent, DragScrollModule } from 'ngx-drag-scroll';
import Swal from 'sweetalert2';
import { MarkuDiscountModel } from 'src/app/model/marku-discount-model.model';
import { BookModel } from 'src/app/model/book-model.model';
import { DateChangeCancelModel } from 'src/app/model/date-change-cancel-model.model';
declare var window: any;
declare var $: any;
declare var $;

@Component({
  selector: 'app-date-change-dom-oneway',
  templateUrl: './date-change-dom-oneway.component.html',
  styleUrls: ['./date-change-dom-oneway.component.css']
})
export class DateChangeDomOnewayComponent implements OnInit {
  urlJquery = "./assets/dist/js/jquery.min.js";
  urlBootstrap = "./assets/dist/js/bootstrap.bundle.min.js";
  urlOwl = "./assets/dist/js/owl.carousel.min.js";
  urlMain = "./assets/dist/js/main.min.js";
  loadAPI: Promise<any> | any;

  @ViewChild('leftFlightItem', { read: DragScrollComponent }) leftFlightItem: DragScrollComponent | any;
  @ViewChild('rightFlightItem', { read: DragScrollComponent }) rightFlightItem: DragScrollComponent | any;


  @ViewChild('flightItem', { read: DragScrollComponent }) flightItem: DragScrollComponent | any;
  @ViewChild('fareItem', { read: DragScrollComponent }) fareItem: DragScrollComponent | any;

  flightFromModel: any;
  flightToModel: any;


  departureDateModel: NgbDateStruct | any;
  showBox = false;
  showModalFareDetails: boolean = false;
  isOneway: boolean = false;
  isMulticity: boolean = false;
  isRoundtrip: boolean = false;
  isAgentFare: boolean = false;
  isNotFound: boolean = false;
  isTravellerFromShow: boolean = true;
  isFromToSame: boolean = false;
  fareSearchSkeleton: boolean = true;
  flightSearchSkeletonLeft: boolean = true;
  topFlightSearchSkeleton: boolean = true;
  topFlightSearchSkeletonLeft: boolean = true;
  flightSearchSkeletonRight: boolean = true;
  topFlightSearchSkeletonRight: boolean = true;
  isTopTwoSingleItem: boolean = true;

  returnDateModel: NgbDateStruct | any;
  returnDay: string = "";
  returnMonth: string = "";
  returnMonthYear: string = "";
  returnYear: string = "";
  returnDayName: string = "";

  num1 = 0;
  num2 = 0;
  num3 = 0;

  cDay: number = Number(this.shareService.getDay(""));
  cMonth: number = Number(this.shareService.getMonth(""));
  cYear: number = Number(this.shareService.getYearLong(""));

  groupAirlines: any;
  ItineryWiseAirlines: any;
  airports: any;
  airportsTwo: any;
  paramModelData: any;

  isOneWayShow = false;
  isRoundTripShow = false;
  fromFlight: string = "";
  toFlight: string = "";
  departureDate: string = "";
  returnDate: string = "";
  adult: string = "";
  child: string = "";
  infant: string = "";
  isLoad: boolean = false;
  cabinTypeId: string = "";
  tripTypeId: string = "";
  isSuggDeparture: boolean = false;
  isSuggReturn: boolean = false;
  isSuggDepartureMobile: boolean = false;
  isSuggReturnMobile: boolean = false;
  providerId: string = "";
  providerIdTwo: string = "";
  timeType: string = "gmt";

  public selectedAirportFromId: any = "";
  public selectedAirportToId: any = "";

  public selectedPanelAirportFromId: any = "";
  public selectedPanelAirportToId: any = "";

  public selectedDepartureDate: any = this.shareService.getYearLong() + "-" +
    this.shareService.padLeft(this.shareService.getMonth(), '0', 2) + "-" + this.shareService.padLeft(this.shareService.getDay(), '0', 2);
  public selectedReturnDate: any = this.shareService.getYearLong() + "-" +
    this.shareService.padLeft(this.shareService.getMonth(), '0', 2) + "-" + this.shareService.padLeft(this.shareService.getDay(), '0', 2);
  public selectedDepartureCity: any = "";
  public selectedDepartureCountry: any = "";
  public selectedDepartureCountryCode: any = "";
  public selectedReturnCity: any = "";
  public selectedReturnCountry: any = ""
  public selectedReturnCountryCode: any = ""

  public selectedPanelDepartureCity: any = "";
  public selectedPanelDepartureCountry: any = "";
  public selectedPanelDepartureCountryCode: any = "";
  public selectedPanelReturnCity: any = "";
  public selectedPanelReturnCountry: any = ""
  public selectedPanelReturnCountryCode: any = ""

  public selectedDeparturePanel: any = "";
  public selectedReturnPanel: any = "";
  public selectedClassTypeId: any = "";
  public selectedClassTypeCode: any = "";
  public selectedClassTypeName: any = "";
  public selectedClassTypeNameMobile: any = "";
  public selectedTripTypeId: any = "";
  public selectedAirportFromCode: string = "";
  public selectedAirportToCode: string = "";
  public selectedAirportFromName: string = "";
  public selectedAirportToName: string = "";

  public selectedPanelDepartureCityMobile: any = "";
  public selectedPanelDepartureCountryMobile: any = "";
  public selectedPanelReturnCityMobile: any = "";
  public selectedPanelReturnCountryMobile: any = ""
  fmgChild: FormArray | any;
  selectTripType: FormControl = new FormControl()
  fmgSearchHistory: FormGroup | any;
  fmgSearchHistoryInfo: FormGroup | any;
  fmgSearchHistoryDetails: FormGroup | any;

  fmgFlightSearchWay: FormGroup | any;
  fmgFlightSearch: FormGroup | any;
  retDeptDay: string = "";
  retDayNameShort: string = "";
  retDeptMonth: string = "";
  retDeptYear: string = "0";

  retDay: number = 0;
  retMonth: number = 0;
  retYear: number = 0;

  itineraries: any;
  itineraryGroups: any;
  itineraryGroupsTwo: any;
  rootData: any;
  scheduleDescs: any;
  legDescs: any;

  rootDataTwo: any;
  scheduleDescsTwo: any;
  legDescsTwo: any;


  childList: number[] = [];
  childList2: number[] = [];
  childListFinal: any[] = [];
  childSelectList: number[] = [2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  selectedairlines: any;
  airlines: any[] = [];
  airlinesTwo: any[] = [];
  tempDomOneWayData: any[] = [];
  domOneWayData: any[] = [];
  domOneWayDataGroup: any[] = [];
  markupList: any[] = [];
  topFlights: any[] = [];
  topFlightsTwo: any[] = [];
  selectedAirFilterList: string[] = [];
  selectedDeptTimeList: any[] = [];
  selectedArrTimeList: any[] = [];
  tempFilterItinery: any[] = [];
  udMinRangeVal: number = 0;
  stopCountList: any[] = [];
  stopCountListTwo: any[] = [];
  departureTimeFilter: any[] = [];
  arrivalTimeFilter: any[] = [];

  departureTimeFilterTwo: any[] = [];
  arrivalTimeFilterTwo: any[] = [];

  refundFilterList: boolean[] = [];
  appliedFilter: any[] = [];
  flightDataFirstLeg: any[] = [];
  flightDataSecondLeg: any[] = [];
  flightDataFirstLegGroup: any[] = [];
  intOneWayGroupWise: any[] = [];
  tempFlightDataFirstLeg: any[] = [];
  tempFlightDataSecondLeg: any[] = [];
  markupInfo: MarkuDiscountModel[] = [];
  discountInfo: MarkuDiscountModel[] = [];
  summaryBarLegData: any = [];
  cmbAirlines: any[] = [];
  cmbAirport: any[] = [];
  cmbAirCraft: any[] = [];
  cmbAirportTwo: any[] = [];
  cmbAirCraftTwo: any[] = [];
  bookInstantEnableDisable: BookModel[] = [];
  fareDetailsModalData: any = [];
  flightDetailsModalData: any[] = [];
  tempAirportsDeparture: any = [];
  tempAirportsArrival: any = [];
  tempDefaultDepArrFlight: any = [];
  popularFilter: any[] = [];
  makeProposalData: any = [];

  keywords: string = 'all';
  isFlightSearchBody: number = 0;

  amtDateChangesPre: any;
  amtDateChanges: any;
  amtDateChangesPlus: any;
  amtCancellationPre: any;
  amtCancellation: any;
  amtCancellationPlus: any;
  isCancellationShow: boolean = true;

  flightSearchSkeleton: boolean = true;
  intOneWayDataGroup: any[] = [];
  fmgFlightSearchWayOneWay: FormGroup | any;

  adultnum: any;
  childnumlist: any;
  infantnum: any;
  airlinecode: any;
  cabincode: any;
  startDate: any;
  endDate: any;
  airportFrom: any;
  ticketstatus!: string;
  airportTo: any;
  bookingConfirmation: any;
  reservation: any;
  referenceNum: any;
  user: any;
  flightInd: any;
  fmgDateChange: FormGroup | any;
  fmgDateChangeModel: any;
  fmgDateChangeRound: FormGroup | any;
  fmgBookingJourneyReference: FormGroup | any;
  fmgBookingFlightReference: FormGroup | any;
  Id: number = 1;

  Path: any;
  departureClick: boolean = true;
  firstLeg: any;
  airlineName: any;
  logo: any;
  clientFare: any;
  aircraft: any;
  airline: any;
  agentFare: any;
  clientTotal: any;
  gdsFare: any;
  clientFareTotal: any;
  DateChangeFee: any;
  TotalPerson: any;
  nAdultCabin: any;
  nChildCabin: any;
  nInfantCabin: any;
  nAdultCheckIn: any;
  nChildCheckIn: any;
  nInfantCheckIn: any;

  @ViewChild('returnDatePick') returnDatePick: ElementRef | any;
  @ViewChild('roundTripButton') roundTripButton: ElementRef | any;
  @ViewChild('suggDeparture') suggDeparture: ElementRef | any;
  @ViewChild('suggReturn') suggReturn: ElementRef | any;
  @ViewChild('suggDeparture') suggDepartureMobile: ElementRef | any;
  @ViewChild('suggReturn') suggReturnMobile: ElementRef | any;

  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
    private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
    private router: Router, private httpClient: HttpClient, private toastrService: ToastrService, private elementRef: ElementRef,
    public shareService: ShareService, public flightHelper: FlightHelperService) { }

  initSearchPanel() {
    this.num1 = 0, this.num2 = 0, this.num3 = 0;
    this.cmbAirport = this.flightHelper.getAirportData();
    this.tempAirportsDeparture = this.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsArrival = this.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempDefaultDepArrFlight = this.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.paramModelData = this.flightHelper.getLocalFlightSearch();
    this._setPanelSearchHeader(this.paramModelData);
    this.getFlightSearch(this.paramModelData);
    this.isOneway = this.paramModelData.isOneWay;
    this.selectedairlines = this.paramModelData.airlines;
    if (this.isOneway) {
      this.isOneWayShow = true;
      this.isRoundTripShow = false;
    } else {
      this.isOneWayShow = false;
      this.isRoundTripShow = true;
    }
    if(this.paramModelData.firstLegData != null){
      this.firstLeg = this.paramModelData.firstLegData;
      this.nAdultCabin = this.paramModelData.firstLegData[0].bookingFlight[0].nAdultCabin;
      this.nChildCabin = this.paramModelData.firstLegData[0].bookingFlight[0].nChildCabin;
      this.nInfantCabin = this.paramModelData.firstLegData[0].bookingFlight[0].nInfantCabin;
      this.nAdultCheckIn = this.paramModelData.firstLegData[0].bookingFlight[0].nAdultCheckIn;
      this.nChildCheckIn = this.paramModelData.firstLegData[0].bookingFlight[0].nChildCheckIn;
      this.nInfantCheckIn = this.paramModelData.firstLegData[0].bookingFlight[0].nInfantCheckIn;
      this.logo = this.paramModelData.firstLegData[0].bookingFlight[0].vLogo;
      this.airlineName = this.paramModelData.firstLegData[0].bookingFlight[0].nvAirlinesName;
      this.clientFare = this.paramModelData.clientFare;
      this.aircraft = this.paramModelData.firstLegData[0].bookingFlight[0].aircraft;
      var airlineIataDesignator = this.paramModelData.firstLegData[0].bookingFlight[0].nvIataDesignator;
      var airlineNumber = this.paramModelData.firstLegData[0].bookingFlight[0].iFlightNumber;
      this.airline = airlineIataDesignator + '' + airlineNumber;
      this.departureClick = false;
    }
    this.Path = this.paramModelData.pagePath;
    this.agentFare = this.paramModelData.agentTotal;
    this.clientTotal = this.paramModelData.clientTotal;
    this.gdsFare = this.paramModelData.gdsTotal;
    this.DateChangeFee = this.paramModelData.DateChangeFee;
    this.TotalPerson = this.paramModelData.adult + this.paramModelData.childList + this.paramModelData.infant;
    //I really don't want to add 4 lines below. cz don't add data below 4 variables.
    this.selectedDepartureCity = this.paramModelData.fromFlightName;
    this.selectedReturnCity = this.paramModelData.toFlightName;
    this.selectedDepartureCountry = this.paramModelData.fromCountryName;
    this.selectedDepartureCountryCode = this.paramModelData.fromCountryCode;
    this.selectedReturnCountry = this.paramModelData.toCountryName;
    this.selectedReturnCountryCode = this.paramModelData.toCountryCode;

    this.selectedPanelDepartureCity = this.paramModelData.fromFlightName;
    this.selectedPanelReturnCity = this.paramModelData.toFlightName;
    this.selectedPanelDepartureCountry = this.paramModelData.fromCountryName;
    this.selectedPanelDepartureCountryCode = this.paramModelData.fromCountryCode;
    this.selectedPanelReturnCountry = this.paramModelData.toCountryName;
    this.selectedPanelReturnCountryCode = this.paramModelData.toCountryCode;

    this.selectedPanelDepartureCityMobile = this.paramModelData.fromFlightName;
    this.selectedPanelReturnCityMobile = this.paramModelData.toFlightName;
    this.selectedPanelDepartureCountryMobile = this.paramModelData.fromCountryName;
    this.selectedPanelReturnCountryMobile = this.paramModelData.toCountryName;

    let lenDep = this.selectedPanelDepartureCity + "" + this.selectedPanelDepartureCountry;
    if (lenDep.length > 12) {
      this.selectedPanelDepartureCountry = this.selectedPanelDepartureCountry.substring(0,
        12 - this.selectedPanelDepartureCity.length) + "..";
    }
    let lenArr = this.selectedPanelReturnCity + "" + this.selectedPanelReturnCountry;
    if (lenArr.length > 12) {
      this.selectedPanelReturnCountry = this.selectedPanelReturnCountry.substring(0,
        12 - this.selectedPanelReturnCity.length) + "..";
    }
  }

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
  getAgencyPermission() {
    var userId = this.shareService.getUserId();
    try {
      this.authService.getAgencyPermit(userId).subscribe(data => {
        if (data.data) {
          this.initSearchPanel();
          // console.log("Continuee..");
        } else {
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
    } catch (exp) {

    }
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'flight_search_details');
  }
  init() {
    this.fmgFlightSearch = this.fb.group({
      FlightSearch: new FormArray([])
    });
    this.fmgDateChangeRound = this.fb.group({
      User: ['', Validators.nullValidator],
      ProviderId: ['', Validators.nullValidator],
      TicketStatusId: ['', Validators.nullValidator],
      Airlinecode: ['', Validators.nullValidator],
      Cabincode: ['', Validators.nullValidator],
      StartDate: ['', Validators.nullValidator],
      EndDate: ['', Validators.nullValidator],
      AirportFrom: ['', Validators.nullValidator],
      AirportTo: ['', Validators.nullValidator],
      ReferenceNum: ['', Validators.nullValidator],
      Reservation: ['', Validators.nullValidator],
      BookingJourneyOneWayRoundTripData: new FormArray([]),
      BookingFlightRoundTripData: new FormArray([])
    });
    this.fmgBookingJourneyReference = this.fb.group({
      AdultBaseGDS: ['', Validators.nullValidator],
      AdultTaxGDS: ['', Validators.nullValidator],
      AdultTotalGDS: ['', Validators.nullValidator],
      AdultBaseClient: ['', Validators.nullValidator],
      AdultTaxClient: ['', Validators.nullValidator],
      AdultTotalClient: ['', Validators.nullValidator],
      AdultAgentFare: ['', Validators.nullValidator],
      ChildBaseGDS: ['', Validators.nullValidator],
      ChildTaxGDS: ['', Validators.nullValidator],
      ChildTotalGDS: ['', Validators.nullValidator],
      ChildBaseClient: ['', Validators.nullValidator],
      ChildTaxClient: ['', Validators.nullValidator],
      ChildTotalClient: ['', Validators.nullValidator],
      ChildAgentFare: ['', Validators.nullValidator],
      InfantBaseGDS: ['', Validators.nullValidator],
      InfantTaxGDS: ['', Validators.nullValidator],
      InfantTotalGDS: ['', Validators.nullValidator],
      InfantBaseClient: ['', Validators.nullValidator],
      InfantTaxClient: ['', Validators.nullValidator],
      InfantTotalClient: ['', Validators.nullValidator],
      InfantAgentFare: ['', Validators.nullValidator],
      DiscountTypePercent: ['', Validators.nullValidator],
      MarkupPercent: ['', Validators.nullValidator],
      DepartureDateTime: ['', Validators.required],
      AirCraftId: ['', Validators.required],
      DDepartureDateTime: ['', Validators.required],
      DArrivalDateTime: ['', Validators.required],
      VAirportFromId: ['', Validators.required],
      VAirportToId: ['', Validators.required],
      DTimeLimitGds: ['', Validators.required],
      AgentFareTotal: ['', Validators.required],
      ClientFareTotal: ['', Validators.required],
      GdsFareTotal: ['', Validators.required],
      FlightTypeId: ['', Validators.required],
      Id: ['', Validators.required]
    });

    this.fmgDateChange = this.fb.group({
      User: ['', Validators.nullValidator],
      ProviderId: ['', Validators.nullValidator],
      TicketStatusId: ['', Validators.nullValidator],
      Airlinecode: ['', Validators.nullValidator],
      Cabincode: ['', Validators.nullValidator],
      StartDate: ['', Validators.nullValidator],
      EndDate: ['', Validators.nullValidator],
      AirportFrom: ['', Validators.nullValidator],
      AirportTo: ['', Validators.nullValidator],
      ReferenceNum: ['', Validators.nullValidator],
      Reservation: ['', Validators.nullValidator],
      AdultBaseGDS: ['', Validators.nullValidator],
      AdultTaxGDS: ['', Validators.nullValidator],
      AdultTotalGDS: ['', Validators.nullValidator],
      AdultBaseClient: ['', Validators.nullValidator],
      AdultTaxClient: ['', Validators.nullValidator],
      AdultTotalClient: ['', Validators.nullValidator],
      AdultAgentFare: ['', Validators.nullValidator],
      ChildBaseGDS: ['', Validators.nullValidator],
      ChildTaxGDS: ['', Validators.nullValidator],
      ChildTotalGDS: ['', Validators.nullValidator],
      ChildBaseClient: ['', Validators.nullValidator],
      ChildTaxClient: ['', Validators.nullValidator],
      ChildTotalClient: ['', Validators.nullValidator],
      ChildAgentFare: ['', Validators.nullValidator],
      InfantBaseGDS: ['', Validators.nullValidator],
      InfantTaxGDS: ['', Validators.nullValidator],
      InfantTotalGDS: ['', Validators.nullValidator],
      InfantBaseClient: ['', Validators.nullValidator],
      InfantTaxClient: ['', Validators.nullValidator],
      InfantTotalClient: ['', Validators.nullValidator],
      InfantAgentFare: ['', Validators.nullValidator],
      DiscountTypePercent: ['', Validators.nullValidator],
      MarkupPercent: ['', Validators.nullValidator],
      AirCraftId: ['', Validators.nullValidator],
      FlightTypeId: ['', Validators.nullValidator],
      DepartureDateTime: ['', Validators.nullValidator],
      ArrivalDateTime: ['', Validators.nullValidator],
      FromAirport: ['', Validators.nullValidator],
      ToAirport: ['', Validators.nullValidator],
      AgentFareTotal: ['', Validators.nullValidator],
      ClientFareTotal: ['', Validators.nullValidator],
      GdsFareTotal: ['', Validators.nullValidator],
      BookingFlightReferenceData: new FormArray([])
    });

    this.fmgBookingFlightReference = this.fb.group({
      VBookingJourneyReferenceId: ['', Validators.nullValidator],
      IFlightNumber: ['', Validators.nullValidator],
      VAirlinesId: ['', Validators.nullValidator],
      IOperatingFlightNumber: ['', Validators.nullValidator],
      VOperatingAirlinesId: ['', Validators.nullValidator],
      VFromAirportId: ['', Validators.nullValidator],
      VToAirportId: ['', Validators.nullValidator],
      DDepartureDateTime: ['', Validators.nullValidator],
      DArrivalDateTime: ['', Validators.nullValidator],
      NvBookingClass: ['', Validators.nullValidator],
      DepartureAdjustment: ['', Validators.nullValidator],
      ArrivalAdjustment: ['', Validators.nullValidator],
      Serial: ['', Validators.nullValidator]
    });
    this._initSearchHistoryForm();
    this._initBoringTools();
    this.summaryBarLegData = {
      firstLegData: [],
      secondLegData: [],
      domestic: true,
      tripTypeId: this.flightHelper.getTripTypeId(2)
    };
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


  _initSearchHistoryForm() {
    this.fmgSearchHistory = this.fb.group({
      FlightSearchHistory: new FormData(),
      FlightSearchDetailsHistory: new FormArray([]),
    });
    this.fmgSearchHistoryDetails = this.fb.group({
      VFlightSearchHistoryId: ['', Validators.nullValidator],
      IChildAge: ['', Validators.nullValidator]
    });
    this.fmgSearchHistoryInfo = this.fb.group({
      Id: ['', Validators.nullValidator],
      DSearchDate: ['', Validators.nullValidator],
      VAirportIdfrom: ['', Validators.nullValidator],
      VAirportIdto: ['', Validators.nullValidator],
      DDepartureDate: ['', Validators.nullValidator],
      DReturnDate: ['', Validators.nullValidator],
      VFlightTypeId: ['', Validators.nullValidator],
      VCabinTypeId: ['', Validators.nullValidator],
      INumberAdult: ['', Validators.nullValidator],
      INumberChild: ['', Validators.nullValidator],
      INumberInfant: ['', Validators.nullValidator],
      VAirlinesId: ['', Validators.nullValidator],
      VFlightStopId: ['', Validators.nullValidator],
      VFareTypeId: ['', Validators.nullValidator]
    });
  }
  _initBoringTools() {
    // $('.select2').select2();
    flatpickr(".flat-datepick-from", {
      enableTime: false,
      dateFormat: "d-m-Y",
      allowInput: true,
      minDate: "today"
    });
    flatpickr(".flat-datepick-to", {
      enableTime: false,
      dateFormat: "d-m-Y",
      allowInput: true,
      minDate: this.shareService.padLeft(this.shareService.getDay(this.selectedDepartureDate), '0', 2) + "." +
        this.shareService.padLeft(this.shareService.getMonth(this.selectedDepartureDate), '0', 2) + "." +
        this.shareService.getYearLong(this.selectedDepartureDate)
    });
  }
  bookAndHoldAction(ind: any) {
    let flightIndi = "";
    if (this.isOneway) {
      flightIndi = this.domOneWayData.find(x => x.id === ind);
      localStorage.setItem("tripRegion", this.flightHelper.domestic);
    } else {
      flightIndi = this.summaryBarLegData;
      var data = JSON.parse(JSON.stringify(this.paramModelData));
    }
    if ("flightDataIndividual" in localStorage) {
      localStorage.removeItem("flightDataIndividual");
    }
    if ("tripRegion" in localStorage) {
      localStorage.removeItem("tripRegion");
    }
    localStorage.setItem("flightDataIndividual", JSON.stringify(flightIndi));
    // console.log(flightIndi);
    this.bookingConfirmation = this.flightHelper.getLocalFlightSearchDateChange();
    this._setPanelSearchHeader(this.bookingConfirmation);
    this.getFlightSearch(this.bookingConfirmation);
    if(this.bookingConfirmation != null || this.bookingConfirmation != undefined){
      this.referenceNum = this.bookingConfirmation.referenceNo;
      this.reservation = this.bookingConfirmation.reservationPNR;
    }
    this.paramModelData = this.flightHelper.getLocalFlightSearch();
    this.getFlightSearch(this.paramModelData);
    if(this.paramModelData.BookingManualId != null || this.paramModelData.BookingManualId != undefined || this.paramModelData.ItineraryNumber != null || this.paramModelData.ItineraryNumber != undefined ){
      this.referenceNum = this.paramModelData.BookingManualId;
      this.reservation = this.paramModelData.ItineraryNumber;
    }
    this.user = localStorage.getItem('uid');
    this.flightInd = flightIndi;
    this.adultnum = this.paramModelData.adult;
    this.childnumlist = this.paramModelData.childList.length;
    this.infantnum = this.paramModelData.infant;
    this.airlinecode = this.paramModelData.airlines;
    this.cabincode = this.paramModelData.classType;
    this.startDate = this.paramModelData.departureDate;
    this.endDate = this.paramModelData.returnDate;
    this.airportFrom = this.paramModelData.fromFlightId;
    this.airportTo = this.paramModelData.toFlightId;
    this.ticketstatus = this.paramModelData.ticketstatusId[0];
    if (this.paramModelData.isOneWay) {
      this.fmgDateChange.patchValue({
        User: this.user,
        ProviderId: this.providerId,
        TicketStatusId: this.ticketstatus,
        AdultBaseGDS: this.flightInd.fareData.adultBaseGDS,
        AdultTaxGDS: this.flightInd.fareData.adultTaxGDS,
        AdultTotalGDS: this.flightInd.fareData.adultTotalGDS,
        AdultBaseClient: this.flightInd.fareData.adultBaseClient,
        AdultTaxClient: this.flightInd.fareData.adultTaxClient,
        AdultTotalClient: this.flightInd.fareData.adultTotalClient,
        AdultAgentFare: this.flightInd.fareData.adultAgentFare,
        ChildBaseGDS: this.flightInd.fareData.childBaseGDS,
        ChildTaxGDS: this.flightInd.fareData.childTaxGDS,
        ChildTotalGDS: this.flightInd.fareData.childTotalGDS,
        ChildBaseClient: this.flightInd.fareData.childBaseClient,
        ChildTaxClient: this.flightInd.fareData.childTaxClient,
        ChildTotalClient: this.flightInd.fareData.childTotalClient,
        ChildAgentFare: this.flightInd.fareData.childAgentFare,
        InfantBaseGDS: this.flightInd.fareData.infantBaseGDS,
        InfantTaxGDS: this.flightInd.fareData.infantTaxGDS,
        InfantTotalGDS: this.flightInd.fareData.infantTotalGDS,
        InfantBaseClient: this.flightInd.fareData.infantBaseClient,
        InfantTaxClient: this.flightInd.fareData.infantTaxClient,
        InfantTotalClient: this.flightInd.fareData.infantTotalClient,
        InfantAgentFare: this.flightInd.fareData.infantAgentFare,
        DiscountTypePercent: this.flightInd.fareData.discountTypePercent,
        MarkupPercent: this.flightInd.fareData.markupPercent,
        Airlinecode: this.airlinecode,
        Cabincode: this.cabincode,
        StartDate: this.startDate,
        EndDate: this.endDate,
        AirportFrom: this.airportFrom,
        AirportTo: this.airportTo,
        ReferenceNum: this.referenceNum,
        Reservation: this.reservation,
        AirCraftId: this.flightInd.airCraftId,
        AgentFareTotal: this.flightInd.agentFareTotal,
        ClientFareTotal: this.flightInd.clientFareTotal,
        GdsFareTotal: this.flightInd.gdsFareTotal,
        FlightTypeId: this.flightInd.tripTypeId,
        DepartureDateTime: this.flightInd.departureDate + "T" + this.flightInd.departureTime + ":00",
        ArrivalDateTime: this.getAdjustmentDate(this.flightInd.departureDate, this.flightInd.adjustment)
          .format('YYYY-MM-DD') + "T" + this.flightInd.arrivalTime + ":00",
        FromAirport: this.flightInd.departureCityId,
        ToAirport: this.flightInd.arrivalCityId
      });
      this.fmgBookingFlightReference = this.fmgDateChange.get('BookingFlightReferenceData') as FormArray;
      for (let item of this.flightInd.flightSegmentData) {
        this.fmgBookingFlightReference.push(this.fb.group({
          IFlightNumber: item.airlineNumber,
          IOperatingFlightNumber: item.airlineNumber,
          DDepartureDateTime: this.getAdjustmentDate(this.flightInd.departureDate, item.adjustment, item.departureAdjustment)
            .format('YYYY-MM-DD') + "T" + item.departureTime + ":00",
          DArrivalDateTime: this.getAdjustmentDate(this.flightInd.departureDate, item.adjustment, item.arrivalAdjustment)
            .format('YYYY-MM-DD') + "T" + item.arrivalTime + ":00",
          NvBookingClass: item.bookingCode,
          VFromAirportId: item.departureAirportCode,
          VToAirportId: item.arrivalAirportCode,
          VOperatingAirlinesId: item.airlineCode,
          VAirlinesId: item.airlineCode
        }));
      }
    } else {
      if(this.firstLeg != null && this.firstLeg != ''){
        this.flightInd.firstLegData = this.flightInd.secondLegData;
        this.fmgDateChangeRound.patchValue({
          User: this.user,
          ProviderId: this.providerId,
          TicketStatusId: this.ticketstatus,
          Airlinecode: this.airlinecode,
          Cabincode: this.cabincode,
          StartDate: this.startDate,
          EndDate: this.endDate,
          AirportFrom: this.airportFrom,
          AirportTo: this.airportTo,
          ReferenceNum: this.referenceNum,
          Reservation: this.reservation
        });
        this.fmgBookingJourneyReference = this.fmgDateChangeRound.get('BookingJourneyOneWayRoundTripData') as FormArray;
        this.fmgBookingFlightReference = this.fmgDateChangeRound.get('BookingFlightRoundTripData') as FormArray;
        for (let item of this.flightInd.firstLegData) {
          this.fmgBookingJourneyReference.push(this.fb.group({
            AdultBaseGDS: Math.floor(item.fareData.adultBaseGDS),
            AdultTaxGDS: Math.floor(item.fareData.adultTaxGDS),
            AdultTotalGDS: Math.floor(item.fareData.adultTotalGDS),
            AdultBaseClient: Math.floor(item.fareData.adultBaseClient),
            AdultTaxClient: Math.floor(item.fareData.adultTaxClient),
            AdultTotalClient: Math.floor(item.fareData.adultTotalClient),
            AdultAgentFare: Math.floor(item.fareData.adultAgentFare),
            ChildBaseGDS: Math.floor(item.fareData.childBaseGDS),
            ChildTaxGDS: Math.floor(item.fareData.childTaxGDS),
            ChildTotalGDS: Math.floor(item.fareData.childTotalGDS),
            ChildBaseClient: Math.floor(item.fareData.childBaseClient),
            ChildTaxClient: Math.floor(item.fareData.childTaxClient),
            ChildTotalClient: Math.floor(item.fareData.childTotalClient),
            ChildAgentFare: Math.floor(item.fareData.childAgentFare),
            InfantBaseGDS: Math.floor(item.fareData.infantBaseGDS),
            InfantTaxGDS: Math.floor(item.fareData.infantTaxGDS),
            InfantTotalGDS: Math.floor(item.fareData.infantTotalGDS),
            InfantBaseClient: Math.floor(item.fareData.infantBaseClient),
            InfantTaxClient: Math.floor(item.fareData.infantTaxClient),
            InfantTotalClient: Math.floor(item.fareData.infantTotalClient),
            InfantAgentFare: Math.floor(item.fareData.infantAgentFare),
            DiscountTypePercent: Math.floor(item.fareData.discountTypePercent),
            MarkupPercent: Math.floor(item.fareData.markupPercent),
            AirCraftId: item.airCraftId,
            DDepartureDateTime: item.departureDate + "T" + item.departureTime + ":00",
            DArrivalDateTime: item.arrivalDate + "T" + item.arrivalTime + ":00",
            VAirportFromId: item.departureCityId,
            VAirportToId: item.arrivalCityId,
            DTimeLimitGds: item.lastTicketDate + "T" + item.lastTicketTime + ":00",
            AgentFareTotal: item.agentFareTotal,
            ClientFareTotal: item.clientFareTotal,
            GdsFareTotal: item.gdsFareTotal,
            FlightTypeId: item.tripTypeId,
            Id: this.Id
          }));
          for (let itemfs of item.flightSegmentData) {
            this.fmgBookingFlightReference.push(this.fb.group({
              IFlightNumber: itemfs.airlineNumber,
              IOperatingFlightNumber: itemfs.airlineNumber,
              DDepartureDateTime: item.departureDate + "T" + itemfs.departureTime + ":00",
              DepartureAdjustment: itemfs.departureAdjustment,
              DArrivalDateTime: item.departureDate + "T" + itemfs.arrivalTime + ":00",
              ArrivalAdjustment: itemfs.arrivalAdjustment,
              NvBookingClass: itemfs.bookingCode,
              VFromAirportId: itemfs.departureAirportCode,
              VToAirportId: itemfs.arrivalAirportCode,
              VOperatingAirlinesId: itemfs.airlineCode,
              VAirlinesId: itemfs.airlineCode,
              Serial: this.Id,
            }));
          }
          this.Id += 1;
        }
      }else{
        this.fmgDateChangeRound.patchValue({
          User: this.user,
          ProviderId: this.providerId,
          TicketStatusId: this.ticketstatus,
          Airlinecode: this.airlinecode,
          Cabincode: this.cabincode,
          StartDate: this.startDate,
          EndDate: this.endDate,
          AirportFrom: this.airportFrom,
          AirportTo: this.airportTo,
          ReferenceNum: this.referenceNum,
          Reservation: this.reservation
        });
        this.fmgBookingJourneyReference = this.fmgDateChangeRound.get('BookingJourneyOneWayRoundTripData') as FormArray;
        this.fmgBookingFlightReference = this.fmgDateChangeRound.get('BookingFlightRoundTripData') as FormArray;
        for (let item of this.flightInd.firstLegData) {
          this.fmgBookingJourneyReference.push(this.fb.group({
            AdultBaseGDS: Math.floor(item.fareData.adultBaseGDS),
            AdultTaxGDS: Math.floor(item.fareData.adultTaxGDS),
            AdultTotalGDS: Math.floor(item.fareData.adultTotalGDS),
            AdultBaseClient: Math.floor(item.fareData.adultBaseClient),
            AdultTaxClient: Math.floor(item.fareData.adultTaxClient),
            AdultTotalClient: Math.floor(item.fareData.adultTotalClient),
            AdultAgentFare: Math.floor(item.fareData.adultAgentFare),
            ChildBaseGDS: Math.floor(item.fareData.childBaseGDS),
            ChildTaxGDS: Math.floor(item.fareData.childTaxGDS),
            ChildTotalGDS: Math.floor(item.fareData.childTotalGDS),
            ChildBaseClient: Math.floor(item.fareData.childBaseClient),
            ChildTaxClient: Math.floor(item.fareData.childTaxClient),
            ChildTotalClient: Math.floor(item.fareData.childTotalClient),
            ChildAgentFare: Math.floor(item.fareData.childAgentFare),
            InfantBaseGDS: Math.floor(item.fareData.infantBaseGDS),
            InfantTaxGDS: Math.floor(item.fareData.infantTaxGDS),
            InfantTotalGDS: Math.floor(item.fareData.infantTotalGDS),
            InfantBaseClient: Math.floor(item.fareData.infantBaseClient),
            InfantTaxClient: Math.floor(item.fareData.infantTaxClient),
            InfantTotalClient: Math.floor(item.fareData.infantTotalClient),
            InfantAgentFare: Math.floor(item.fareData.infantAgentFare),
            DiscountTypePercent: Math.floor(item.fareData.discountTypePercent),
            MarkupPercent: Math.floor(item.fareData.markupPercent),
            AirCraftId: item.airCraftId,
            DDepartureDateTime: item.departureDate + "T" + item.departureTime + ":00",
            DArrivalDateTime: item.arrivalDate + "T" + item.arrivalTime + ":00",
            VAirportFromId: item.departureCityId,
            VAirportToId: item.arrivalCityId,
            DTimeLimitGds: item.lastTicketDate + "T" + item.lastTicketTime + ":00",
            AgentFareTotal: item.agentFareTotal,
            ClientFareTotal: item.clientFareTotal,
            GdsFareTotal: item.gdsFareTotal,
            FlightTypeId: item.tripTypeId,
            Id: this.Id
          }));
          for (let itemfs of item.flightSegmentData) {
            this.fmgBookingFlightReference.push(this.fb.group({
              IFlightNumber: itemfs.airlineNumber,
              IOperatingFlightNumber: itemfs.airlineNumber,
              DDepartureDateTime: item.departureDate + "T" + itemfs.departureTime + ":00",
              DepartureAdjustment: itemfs.departureAdjustment,
              DArrivalDateTime: item.departureDate + "T" + itemfs.arrivalTime + ":00",
              ArrivalAdjustment: itemfs.arrivalAdjustment,
              NvBookingClass: itemfs.bookingCode,
              VFromAirportId: itemfs.departureAirportCode,
              VToAirportId: itemfs.arrivalAirportCode,
              VOperatingAirlinesId: itemfs.airlineCode,
              VAirlinesId: itemfs.airlineCode,
              Serial: this.Id,
            }));
          }
          this.Id += 1;
        }
        for (let item of this.flightInd.secondLegData) {
          this.fmgBookingJourneyReference.push(this.fb.group({
            AdultBaseGDS: Math.floor(item.fareData.adultBaseGDS),
            AdultTaxGDS: Math.floor(item.fareData.adultTaxGDS),
            AdultTotalGDS: Math.floor(item.fareData.adultTotalGDS),
            AdultBaseClient: Math.floor(item.fareData.adultBaseClient),
            AdultTaxClient: Math.floor(item.fareData.adultTaxClient),
            AdultTotalClient: Math.floor(item.fareData.adultTotalClient),
            AdultAgentFare: Math.floor(item.fareData.adultAgentFare),
            ChildBaseGDS: Math.floor(item.fareData.childBaseGDS),
            ChildTaxGDS: Math.floor(item.fareData.childTaxGDS),
            ChildTotalGDS: Math.floor(item.fareData.childTotalGDS),
            ChildBaseClient: Math.floor(item.fareData.childBaseClient),
            ChildTaxClient: Math.floor(item.fareData.childTaxClient),
            ChildTotalClient: Math.floor(item.fareData.childTotalClient),
            ChildAgentFare: Math.floor(item.fareData.childAgentFare),
            InfantBaseGDS: Math.floor(item.fareData.infantBaseGDS),
            InfantTaxGDS: Math.floor(item.fareData.infantTaxGDS),
            InfantTotalGDS: Math.floor(item.fareData.infantTotalGDS),
            InfantBaseClient: Math.floor(item.fareData.infantBaseClient),
            InfantTaxClient: Math.floor(item.fareData.infantTaxClient),
            InfantTotalClient: Math.floor(item.fareData.infantTotalClient),
            InfantAgentFare: Math.floor(item.fareData.infantAgentFare),
            DiscountTypePercent: Math.floor(item.fareData.discountTypePercent),
            MarkupPercent: Math.floor(item.fareData.markupPercent),
            AirCraftId: item.airCraftId,
            DDepartureDateTime: item.departureDate + "T" + item.departureTime + ":00",
            DArrivalDateTime: item.arrivalDate + "T" + item.arrivalTime + ":00",
            VAirportFromId: item.departureCityId,
            VAirportToId: item.arrivalCityId,
            DTimeLimitGds: item.lastTicketDate + "T" + item.lastTicketTime + ":00",
            AgentFareTotal: item.agentFareTotal,
            ClientFareTotal: item.clientFareTotal,
            GdsFareTotal: item.gdsFareTotal,
            FlightTypeId: item.tripTypeId,
            Id: this.Id
          }));
          for (let itemfs of item.flightSegmentData) {
            this.fmgBookingFlightReference.push(this.fb.group({
              IFlightNumber: itemfs.airlineNumber,
              IOperatingFlightNumber: itemfs.airlineNumber,
              DDepartureDateTime: item.departureDate + "T" + itemfs.departureTime + ":00",
              DepartureAdjustment: itemfs.departureAdjustment,
              DArrivalDateTime: item.departureDate + "T" + itemfs.arrivalTime + ":00",
              ArrivalAdjustment: itemfs.arrivalAdjustment,
              NvBookingClass: itemfs.bookingCode,
              VFromAirportId: itemfs.departureAirportCode,
              VToAirportId: itemfs.arrivalAirportCode,
              VOperatingAirlinesId: itemfs.airlineCode,
              VAirlinesId: itemfs.airlineCode,
              Serial: this.Id,
            }));
          }
          this.Id += 1;
        }
      }
    }
    if (this.paramModelData.isOneWay) {
      this.authService.saveFlightSearch(Object.assign({}, this.fmgDateChange.value)).subscribe(data => {
        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate([this.Path]);
        });
      }, error => {
        console.log(error);
      });
    } else {
      this.authService.saveFlightSearchOneWayRoundTrip(Object.assign({}, this.fmgDateChangeRound.value)).subscribe(data => {
        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate([this.Path]);
        });
      }, error => {
        console.log(error);
      });
    }
  }
  exchangeDepartureArrival() {
    let fromAirportId = this.selectedPanelAirportFromId;
    let fromCityName = this.selectedPanelDepartureCity;
    let fromCountryName = this.selectedPanelDepartureCountry;
    let fromCityNameMobile = this.selectedPanelDepartureCityMobile;
    let fromCountryNameMobile = this.selectedPanelDepartureCountryMobile;
    if (fromAirportId != "") {
      this.selectedPanelAirportFromId = this.selectedPanelAirportToId;
      this.selectedPanelAirportToId = fromAirportId;
    }
    if (fromCityName != "") {
      this.selectedPanelDepartureCity = this.selectedPanelReturnCity;
      this.selectedPanelReturnCity = fromCityName;
      this.selectedPanelDepartureCityMobile = this.selectedPanelReturnCityMobile;
      this.selectedPanelReturnCityMobile = fromCityNameMobile;
    }
    if (fromCountryName != "") {
      this.selectedPanelDepartureCountry = this.selectedPanelReturnCountry;
      this.selectedPanelReturnCountry = fromCountryName;
      this.selectedPanelDepartureCountryMobile = this.selectedPanelReturnCountryMobile;
      this.selectedPanelReturnCountryMobile = fromCountryNameMobile;
    }
  }
  selectEvent(item: any, type: string) {
    if (type == "from") {
      this.selectedAirportFromId = item.id;
      this.selectedAirportFromCode = item.code;
      this.selectedDepartureCity = item.cityname;
      this.selectedDepartureCountry = item.countryname;
      this.selectedDepartureCountryCode = item.countrycode;
      this.selectedAirportFromName = item.text;

      this.selectedPanelDepartureCity = item.cityname;
      this.selectedPanelDepartureCountry = item.countryname;
      this.selectedPanelDepartureCountryCode = item.countrycode;
      this.selectedPanelAirportFromId = item.id;

      this.selectedPanelDepartureCityMobile = item.cityname;
      this.selectedPanelDepartureCountryMobile = item.countryname;


      let lenDep = this.selectedPanelDepartureCity + "" + this.selectedPanelDepartureCountry;
      if (lenDep.length > 12) {
        this.selectedPanelDepartureCountry = this.selectedPanelDepartureCountry.substring(0,
          12 - this.selectedPanelDepartureCity.length) + "..";
      }
    }
    if (type == "to") {
      this.selectedAirportToId = item.id;
      this.selectedAirportToCode = item.code;
      this.selectedReturnCity = item.cityname;
      this.selectedReturnCountry = item.countryname;
      this.selectedReturnCountryCode = item.countrycode;
      this.selectedAirportToName = item.text;

      this.selectedPanelReturnCity = item.cityname;
      this.selectedPanelReturnCountry = item.countryname;
      this.selectedPanelReturnCountryCode = item.countrycode;
      this.selectedPanelAirportToId = item.id;

      this.selectedPanelReturnCityMobile = item.cityname;
      this.selectedPanelReturnCountryMobile = item.countryname;

      let lenDArr = this.selectedPanelReturnCity + "" + this.selectedPanelReturnCountry;
      if (lenDArr.length > 12) {
        this.selectedPanelReturnCountry = this.selectedPanelReturnCountry.substring(0,
          12 - this.selectedPanelReturnCity.length) + "..";
      }
    }
  }

  onChangeSearch(val: string, type: any) {
    try {
      val = val.toLowerCase();
      if (type == 'from') {
        this.tempAirportsDeparture = [];
        this.tempAirportsDeparture = this.shareService.distinctList(this.cmbAirport.filter(x =>
          (x.code).toString().toLowerCase().startsWith(val)
          || (x.cityname).toString().toLowerCase().startsWith(val)
          || (x.countryname).toString().toLowerCase().startsWith(val)
          || (x.text).toString().toLowerCase().startsWith(val)
        ));
        if (this.tempAirportsDeparture.length > 15) {
          this.tempAirportsDeparture = this.tempAirportsDeparture.slice(0, 15);
        }
      }
      if (type == 'to') {
        this.tempAirportsArrival = [];
        this.tempAirportsArrival = this.shareService.distinctList(this.cmbAirport.filter(x =>
          (x.code).toString().toLowerCase().startsWith(val)
          || (x.cityname).toString().toLowerCase().startsWith(val)
          || (x.countryname).toString().toLowerCase().startsWith(val)
          || (x.text).toString().toLowerCase().startsWith(val)
        ));
        if (this.tempAirportsArrival.length > 15) {
          this.tempAirportsArrival = this.tempAirportsArrival.slice(0, 15);
        }
      }
    } catch (exp) { }
  }

  onFocused(e: any) {
    this.tempAirportsDeparture = this.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsArrival = this.getDistinctAirport(this.cmbAirport).slice(0, 15);
  }
  flightFrom() {
    try {
      this.isSuggDeparture = true;
      setTimeout(() => {
        this.suggDeparture.focus();
      }, 50);
    } catch (exp) { }
  }
  flightFromOutside() {
    try {
      this.isSuggDeparture = false;
      this.tempAirportsDeparture = this.tempDefaultDepArrFlight;
    } catch (exp) { }
  }
  flightFromMobile() {
    try {
      this.isSuggDepartureMobile = true;
      setTimeout(() => {
        this.suggDepartureMobile.focus();
      }, 50);
    } catch (exp) { }
  }
  flightFromOutsideMobile() {
    try {
      this.isSuggDepartureMobile = false;
      this.tempAirportsDeparture = this.tempDefaultDepArrFlight;
    } catch (exp) { }
  }
  flightToOutside() {
    try {
      this.isSuggReturn = false;
      this.tempAirportsArrival = this.tempDefaultDepArrFlight;
    } catch (exp) { }
  }
  flightTo() {
    try {
      this.isSuggReturn = true;
      setTimeout(() => {
        this.suggReturn.focus();
      });
    } catch (exp) { }
  }
  flightToOutsideMobile() {
    try {
      this.isSuggReturnMobile = false;
      this.tempAirportsArrival = this.tempDefaultDepArrFlight;
    } catch (exp) { }
  }
  flightToMobile() {
    try {
      this.isSuggReturnMobile = true;
      setTimeout(() => {
        this.suggReturnMobile.focus();
      });
    } catch (exp) { }
  }
  changeDepartureReturnDate(evt: any, type: any) {
    try {
      let val = evt.srcElement.value;
      if (val != "" && val != undefined) {
        if (type == "departure") {
          this.selectedDepartureDate = this.shareService.getBdToDb(val);
          this.selectedDeparturePanel =
            this.shareService.getDayNameShort(this.selectedDepartureDate) + ", " +
            this.shareService.getDay(this.selectedDepartureDate) + " " +
            this.shareService.getMonthShort(this.selectedDepartureDate) + "'" +
            this.shareService.getYearShort(this.selectedDepartureDate);
          flatpickr(".flat-datepick-to", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.padLeft(this.shareService.getDay(this.selectedDepartureDate), '0', 2) + "." +
              this.shareService.padLeft(this.shareService.getMonth(this.selectedDepartureDate), '0', 2) + "." +
              this.shareService.getYearLong(this.selectedDepartureDate)
          });
        }
        if (type == "return") {
          this.selectedReturnDate = this.shareService.getBdToDb(val);
          this.selectedReturnPanel =
            this.shareService.getDayNameShort(this.selectedReturnDate) + ", " +
            this.shareService.getDay(this.selectedReturnDate) + " " +
            this.shareService.getMonthShort(this.selectedReturnDate) + "'" +
            this.shareService.getYearShort(this.selectedReturnDate);

          this.tripTypeSet("2");
        }
      }

    } catch (exp) { }
  }
  tripTypeSet(id: any) {
    this.trueFalseSearchType();
    try {
      switch (parseInt(id)) {
        case 1:
          this.isOneway = true;
          this.selectTripType.setValue(1);
          break;
        case 2:
          this.isRoundtrip = true;
          this.selectTripType.setValue(2);
          break;
        case 3:
          this.isMulticity = true;
          this.selectTripType.setValue(2);
          break;
      }
    } catch (exp) { }
  }
  changeClassLabel(code: string) {
    try {
      this.selectedClassTypeCode = code;
      this.selectedClassTypeId = this.flightHelper.getCabinTypeId(code);
      this.selectedClassTypeName = this.flightHelper.getCabinTypeName(code);
      this.selectedClassTypeNameMobile = this.flightHelper.getCabinTypeName(code);
      let x = this._getTotalTravellers() + "Travellers," + this.selectedClassTypeName;
      if (x.length > 18) {
        let y = this._getTotalTravellers() + "Travellers,";
        this.selectedClassTypeName = this.selectedClassTypeName.toString().substring(0, 18 - y.length) + "..";
      }
    } catch (exp) { }
  }
  travellerInfoOutside() {
    try {
      this.showBox = false;
      // $("input[name='Travellers_Class'][value='"+this.selectedClassTypeCode+"']").prop('checked', true);
      this._setChildSet();
    } catch (exp) { }
  }

  fareTypeChange(event: any) {
    this.isAgentFare = event.target.checked;

  }
  tripChange(event: any) {
    this.trueFalseSearchType();
    var type = event.target.value;
    type = Number.parseInt(type);
    this.selectedTripTypeId = this.flightHelper.getTripTypeId(type);
    switch (type) {
      case 1:
        this.isOneway = true;
        this.clearReturn();
        break;
      case 2:
        this.isRoundtrip = true;
        this.selectedReturnDate = this.getCurrentDate();
        this.setReturnPanel(this.selectedReturnDate);
        break;
      case 3:
        this.isMulticity = true;
        break;
      default:
        break;
    }
  }
  getCurrentDate(): any {
    return this.shareService.getYearLong() + "-" +
      this.shareService.padLeft(this.shareService.getMonth(), '0', 2) + "-" + this.shareService.padLeft(this.shareService.getDay(), '0', 2);
  }
  getTripTypeId(): string {
    let ret: string = "";
    try {
      if (this.isOneway) {
        ret = this.flightHelper.getTripTypeId(1);
      } else if (this.isRoundtrip) {
        ret = this.flightHelper.getTripTypeId(2);
      } else if (this.isMulticity) {
        ret = this.flightHelper.getTripTypeId(3);
      }
    } catch (exp) { }
    return ret;
  }
  trueFalseSearchType(): void {
    this.isOneway = false;
    this.isMulticity = false;
    this.isRoundtrip = false;
  }
  flightSearchWork(): void {
    $("#travellersBox").css("display", "none");

    this.selectedAirportFromId = this.selectedPanelAirportFromId;
    this.selectedDepartureCity = this.selectedPanelDepartureCity;
    this.selectedDepartureCountry = this.selectedPanelDepartureCountry;
    this.selectedDepartureCountryCode = this.selectedPanelDepartureCountryCode;

    this.selectedAirportToId = this.selectedPanelAirportToId;
    this.selectedReturnCity = this.selectedPanelReturnCity;
    this.selectedReturnCountry = this.selectedPanelReturnCountry;
    this.selectedReturnCountryCode = this.selectedPanelReturnCountryCode;

    let fromFlightCode = this.selectedAirportFromCode;
    let toFlightCode = this.selectedAirportToCode;
    let fromFlightName = this.selectedDepartureCity;
    let toFlightName = this.selectedReturnCity;
    let fromAirportName = this.selectedAirportFromName;
    let fromCountryName = this.selectedDepartureCountry;
    let toAirportName = this.selectedAirportToName;
    let toCountryName = this.selectedReturnCountry;
    let tripTypeId = this.selectedTripTypeId;

    if (this.selectedAirportFromId != this.selectedAirportToId) {
      let loaderData = {
        fromFlightId: this.selectedAirportFromId, fromFlightCode: fromFlightCode, fromFlightName: fromFlightName,
        toFlightId: this.selectedAirportToId, toFlightName: toFlightName, toFlightCode: toFlightCode,
        fromAirportName: fromAirportName, toAirportName: toAirportName, fromCountryCode: this.selectedDepartureCountryCode,
        fromCountryName: fromCountryName, toCountryCode: this.selectedReturnCountryCode, toCountryName: toCountryName,
        departureDate: this.selectedDepartureDate, returnDate: this.selectedReturnDate, adult: this.num1,
        childList: this.childListFinal, infant: this.num3, classType: this.selectedClassTypeCode, airlines: "", stop: 2,
        cabinTypeId: this.selectedClassTypeId, tripTypeId: tripTypeId, childList1: this.childList, childList2: this.childList2,
        isOneWay: this.isOneway, isRoundTrip: this.isRoundtrip, isMultiCity: this.isMulticity
      };
      this._setStoreFlightDataFirstLeg(loaderData, true);
    }
  }
  saveFlightSearchHistory(data: any) {
    try {
      this.fmgSearchHistoryDetails = this.fmgSearchHistory.get('FlightSearchDetailsHistory') as FormArray;
      let childNumber: number = 0;
      for (var item of data.childList) {
        this.fmgSearchHistoryDetails.push(this.fb.group({
          VFlightSearchHistoryId: '',
          IChildAge: item.age
        }));
        childNumber += 1;
      }
      this.fmgSearchHistoryInfo = this.fmgSearchHistory.get('FlightSearchHistory') as FormData;
      this.fmgSearchHistoryInfo.patchValue({
        Id: this.shareService.getUserId(),
        DSearchDate: new Date(),
        VAirportIdfrom: this.selectedAirportFromId,
        VAirportIdto: this.selectedAirportToId,
        DDepartureDate: this.selectedDepartureDate,
        DReturnDate: this.selectedDepartureDate,
        VFlightTypeId: this.selectedTripTypeId,
        VCabinTypeId: this.selectedClassTypeId,
        INumberAdult: data.adult,
        INumberChild: childNumber,
        INumberInfant: data.infant,
        VAirlinesId: data.airlines,
        VFlightStopId: this.flightHelper.getFlightStopId(data.stop),
        VFareTypeId: this.flightHelper.getFareTypeId(1)
      });
      this.authService.saveFlightSearchHistory(Object.assign({}, this.fmgSearchHistory.value)).subscribe(subData => {

        if (subData.success) {
          this.getFlightSearch(data);
          this._navigationWork();
        }
      }, err => {
      });
      this._navigationWork();
    } catch (exp) {
      console.log(exp);
    }
  }
  private _setChildSet() {
    this.childListFinal = [];
    if (this.childList.length > 0) {
      let age = "";
      for (let i = 0; i < this.childList.length; i++) {
        age = $("#child1" + i).val();
        this.childListFinal.push({ id: this.childList[i], age: parseInt(age) });
      }
      if (this.childList2.length > 0) {
        for (let i = 0; i < this.childList2.length; i++) {
          age = $("#child2" + i).val();
          this.childListFinal.push({ id: this.childList2[i], age: parseInt(age) });
        }
      }
    }
  }
  private _setStoreFlightDataFirstLeg(loaderData: any, isSave: boolean) {
    if ("loaderData" in localStorage) {
      localStorage.removeItem("loaderData");
    }
    localStorage.setItem('loaderData', JSON.stringify(loaderData));
    if (isSave) {
      this.saveFlightSearchHistory(loaderData);
    }
  }
  private _navigationWork(): void {
    let checkFromFlight = this.selectedDepartureCountryCode;
    let checkToFlight = this.selectedReturnCountryCode;
    if (checkFromFlight === checkToFlight) {
      if (this.isOneway) {
        this.router.navigate(['/home/domestic-one-way-flight-search']);
      } else if (this.isRoundtrip) {
        this.router.navigate(['/home/dom-roundtrip']);
      } else if (this.isMulticity) {
        //do step...
      }
    } else {
      if (this.isOneway) {
        this.router.navigate(['/home/international-one-way-flight-search']);
        window.location.reload();
      } else if (this.isRoundtrip) {
        this.router.navigate(['/home/int-roundtrip']);
      } else if (this.isMulticity) {
        //do step...
      }
    }
  }
  getCountryCode(id: string): string {
    let ret: string = "";
    try {
      var data = this.cmbAirport.find(x => x.code.toString().toLowerCase() == id.toString().toLowerCase());
      if (data != "" && data != undefined) {
        ret = data.countrycode;
      }
    } catch (exp) { }
    return ret;
  }
  getCountryName(id: string): string {
    let ret: string = "";
    try {
      var data = this.cmbAirport.find(x => x.code.toString().toLowerCase() == id.toString().toLowerCase());
      if (data != "" && data != undefined) {
        ret = data.countryname;
      }
    } catch (exp) { }
    return ret;
  }
  getCountryNameById(id: string): string {
    let ret: string = "";
    try {
      var data = this.cmbAirport.find(x => x.masterId.toString().toLowerCase() == id.toString().toLowerCase());
      if (data != "" && data != undefined) {
        ret = data.countryname;
      }
    } catch (exp) { }
    return ret;
  }
  getCityName(id: string): string {
    let ret: string = "";
    try {
      var data = this.cmbAirport.find(x => x.code.toString().toLowerCase() == id.toString().toLowerCase());
      if (data != "" && data != undefined) {
        ret = data.cityname;
      }
    } catch (exp) { }
    return ret;
  }

  getSelectedAirCode(id: string): string {
    let ret: string = "";
    try {
      var data = this.cmbAirport.find(x => x.masterId.toString().toLowerCase() == id.toString().toLowerCase());
      if (data != "" && data != undefined) {
        ret = data.id;
      }
    } catch (exp) { }
    return ret;
  }
  getAirCraftName(id: string): string {
    let ret: string = "";
    try {
      var data = this.cmbAirCraft.find(x => x.code.toString().toLowerCase() == id.trim().toLowerCase());
      if (data != "" && data != undefined) {
        ret = data.text;
      }
    } catch (exp) { }
    return ret;
  }

  getAirCraftNameTwo(id: string): string {
    let ret: string = "";
    try {
      var data = this.cmbAirCraftTwo.find(x => x.code.toString().toLowerCase() == id.trim().toLowerCase());
      if (data != "" && data != undefined) {
        ret = data.text;
      }
    } catch (exp) { }
    return ret;
  }


  fromFlightSearch(e: any) {
    $("#fromFlightSearch").hide();
    $("#fromFlightCityName").show();
    if (e != undefined && e.item != undefined) {
      $("#fromFlightCityName").text(e.item.cityname + ', ' + e.item.countryname);
      $("#fromFlightCityDetails").text(e.item.code + ', ' + e.item.text);
    }

  }
  toFlightSearch(e: any) {
    $("#toFlightSearch").hide();
    $("#toFlightCityName").show();
    if (e != undefined && e.item != undefined) {
      $("#toFlightCityName").text(e.item.cityname + ', ' + e.item.countryname);
      $("#toFlightCityDetails").text(e.item.code + ', ' + e.item.text);
    }
  }
  search: OperatorFunction<string, readonly { text: string, id: string }[]> = (text$: Observable<string>) => {
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
  setPanelHeadDepartureArrival() {
    var fromSearch = $("#fromFlightSearch").val();
    var toSearch = $("#toFlightSearch").val();
    if (fromSearch != "" && fromSearch != undefined) {
      var data = this.cmbAirport.find(x => x.code == fromSearch);
      if (data != undefined && data != "") {
        $("#fromFlightCityName").text(data.cityname + ', ' + data.countryname);
      }
    } else {
      $("#fromFlightCityName").text("Delhi, India");
    }
    if (toSearch != "" && toSearch != undefined) {
      var data = this.cmbAirport.find(x => x.code == toSearch);
      if (data != undefined && data != "") {
        $("#toFlightCityName").text(data.cityname + ', ' + data.countryname);
      }
    } else {
      $("#toFlightCityName").text("Bangalore, India");
    }
  }
  getDistinctAirport(data: any): any[] {
    let ret: any = [];
    try {
      var flags = [], l = data.length, i;
      for (i = 0; i < l; i++) {
        if (flags[data[i].code]) continue;
        flags[data[i].code] = true;
        ret.push(data[i]);
      }
    } catch (exp) { }
    return ret;
  }
  clearReturn() {
    this.selectedReturnDate = "";
    this.selectedReturnPanel = "";
  }
  returnCrossClick() {
    this.trueFalseSearchType();
    this.clearReturn();
    this.isOneway = true;
    this.tripTypeSet("1");
  }
  plus(type: string) {
    if ((this.num1 + this.num2 + this.num3) < 9) {
      switch (type) {
        case "adult":
          if (this.num1 < 7 && this.num2 < 7) {
            this.num1++;
          }
          switch (this.num1) {
            case 2:
              if (this.num2 > 5) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.num2--;
              }
              break;
            case 3:
              while (4 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.num2--;
              }
              break;
            case 4:
              while (3 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.num2--;
              }
              break;
            case 5:
              while (2 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.num2--;
              }
              break;
            case 6:
              while (1 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.num2--;
              }
              break;
            case 7:
              while (0 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.num2--;
              }
              break;
          }
          break;
        case "child":
          if (this.num2 < 6) {
            switch (this.num1) {
              case 1: case 0:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                } else {
                  this.num2--;
                }
                break;
              case 2:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                } else {
                  this.num2--;
                }
                break;
              case 3:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                } else {
                  this.num2--;
                }
                break;
              case 4:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                } else {
                  this.num2--;
                }
                break;
              case 4:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                } else {
                  this.num2--;
                }
                break;
              case 5:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                } else {
                  this.num2--;
                }
                break;
              case 6:
                this.num2++;
                if (this.num1 - (this.num1 - 1) == this.num2) {
                  this.childList.push(this.num2);
                } else {
                  this.num2--;
                }
                break;
            }
          } else if (this.num2 >= 6 && this.num2 < 9) {
            this.num2++;
            this.childList2.push(this.num2);

          }
          break;
        case "infant":
          if (this.num3 < 7 && this.num3 < this.num1) {
            this.num3++;
          }
          break;
      }
    }
  }
  travellerFrom() {
    this.showBox = true;
    if ($("#travellersBox").css("display") == "none") {
      $("#travellersBox").css("display", "block");
    } else {
      $("#travellersBox").css("display", "none");
    }
  }
  travellerFromMobile() {
    $("#travellersMobile").modal('show');
  }
  save() {
    this.showBox = false;
    $("#travellersBox").css("display", "none");
    this._setChildSet();
  }
  applyMobile() {
    this._setChildSet();
    $("#travellersMobile").modal('hide');
  }
  minus(type: string) {
    switch (type) {
      case "adult":
        if (this.num1 > 0) {
          this.num1--;
        }
        if (this.num1 < this.num3) {
          this.num3--;
        }
        break;
      case "child":
        if (this.num2 > 0) {
          if (this.num2 < 7) {
            this.childList = this.shareService.removeList(this.num2, this.childList);
            this.num2--;
          } else {
            this.childList2 = this.shareService.removeList(this.num2, this.childList2);
            this.num2--;
          }
        }
        break;
      case "infant":
        if (this.num3 > 0) {
          this.num3--;
        }
        break;
    }
  }
  departureDateToggle() {
    $("#departureDate").css("display", "block");
    $("#departureDate").toggle();
  }
  getFindedValue(term: string): any {
    let data: any[];
    if (this.cmbAirport.find(x => x.code.toLowerCase().indexOf(term.toLowerCase()) > -1)) {
      data = this.cmbAirport.filter(v => (v.code).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    } else if (this.cmbAirport.find(x => x.text.toLowerCase().indexOf(term.toLowerCase()) > -1)) {
      data = this.cmbAirport.filter(v => (v.text).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    } else if (this.cmbAirport.find(x => x.cityname.toLowerCase().indexOf(term.toLowerCase()) > -1)) {
      data = this.cmbAirport.filter(v => (v.cityname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    } else if (this.cmbAirport.find(x => x.countryname.toLowerCase().indexOf(term.toLowerCase()) > -1)) {
      data = this.cmbAirport.filter(v => (v.countryname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    }
    else {
      data = this.cmbAirport.filter(v => (v.countryname).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    }
    return data;
  }
  _getAirCraftList() {
    this.authService.getAircraftInfo().subscribe(data => {
      this.cmbAirCraft = [];
      this.cmbAirCraftTwo = [];
      // console.log("data");
      // console.log(data);
      data.aircraftlist.forEach((aircraft: { vAircraftId: any, nvAircraftCode: any, nvAircraftName: any }) => {
        this.cmbAirCraft.push({
          id: aircraft.vAircraftId,
          code: aircraft.nvAircraftCode,
          text: aircraft.nvAircraftName,
        });
      });


      data.aircraftlist.forEach((aircraft: { vAircraftId: any, nvAircraftCode: any, nvAircraftName: any }) => {
        this.cmbAirCraftTwo.push({
          id: aircraft.vAircraftId,
          code: aircraft.nvAircraftCode,
          text: aircraft.nvAircraftName,
        });
      });
      this.setAirlineList(this.scheduleDescs);
    }, err => {
      console.log(err);
    });
  }
  getCountry(id: any): string {
    let ret: string = "";
    try {
      for (let item of this.cmbAirport) {
        if (item.code == id) {
          ret = item.countryname;
        }
      }
    } catch (exp) { }
    return ret;
  }
  getCity(id: any): string {
    let ret: string = "";
    try {
      for (let item of this.cmbAirport) {
        if (item.code == id) {
          ret = item.cityname;
        }
      }
    } catch (exp) { }
    return ret;
  }
  getAirportName(id: any): string {
    let ret: string = "";
    try {
      for (let item of this.cmbAirport) {
        if (item.code == id) {
          ret = item.text;
        }
      }
    } catch (exp) { }
    return ret;
  }
  getAirportNameById(id: any): string {
    let ret: string = "";
    try {
      for (let item of this.cmbAirport) {
        if (item.masterId.toString().toLowerCase() == id.toString().toLowerCase()) {
          ret = item.text;
        }
      }
    } catch (exp) { }
    return ret;
  }

  getFlightSearch(modelData: any) {
    if (this.isOneway) {
      this._getAirCraftList();
      setTimeout(() => {
        if (modelData != undefined && modelData != "") {
          var data = JSON.parse(JSON.stringify(modelData));
          this.isLoad = false;
          this._setLoaderValue(data);
          this._setFormGroupInfo(data);
          this.fareSearchSkeleton = true;
          this.topFlightSearchSkeleton = true;
          // console.log("Flight search dynamic::");
          // console.log(Object.assign({}, this.fmgFlightSearch.value));
          try {
            this.authService.getFlightSearch(Object.assign({}, this.fmgFlightSearch.value)).subscribe(data => {
              this.topFlightSearchSkeleton = false;

              var data = data.data[0];

              let isNF = 0;
              // console.log("Flight data::");
              // console.log(JSON.stringify(data));
              if (data != "" && data != undefined && data != {} && data != []) {
                this.providerId = data.providerId;
                if (data.fareData != "" && data.fareData != undefined) {
                  this.itineraryGroups = data.fareData[0].groupedItineraryResponse.itineraryGroups;
                  this.fareSearchSkeleton = false;
                }
                if (data.flightData != "" && data.flightData != undefined) {
                  if (data.flightData[0].groupedItineraryResponse != '' && data.flightData[0].groupedItineraryResponse != undefined) {
                    if (data.flightData[0].groupedItineraryResponse.statistics.itineraryCount > 0) {
                      isNF = 1;
                      this.isNotFound = false;
                      var getData = data.flightData[0].groupedItineraryResponse;
                      this.rootData = getData;
                      var itinery = getData.itineraryGroups[0].itineraries;
                      this.itineraries = itinery;
                      this.scheduleDescs = this.rootData.scheduleDescs;
                      this.legDescs = this.rootData.legDescs;
                      this._setMarkupDiscountDetails(data);
                    }
                  }
                }
              }
              if (isNF == 0) {
                this.isNotFound = true;
              }
              this.isLoad = false;
            }, error => {
            });
          } catch (exp) {
            this.isNotFound = true;
          }
        }
      }, 1000);
    } else {
      setTimeout(() => {
        if (modelData != undefined && modelData != "") {
          var data = JSON.parse(JSON.stringify(modelData));
          this.isLoad = false;
          this._setLoaderValue(data);
          this._setFormGroupInfo(data);
          this.fareSearchSkeleton = true;
          this.topFlightSearchSkeletonLeft = true;
          this.topFlightSearchSkeletonRight = true;
          try {
            this.authService.getFlightSearch(Object.assign({}, this.fmgFlightSearch.value)).subscribe(data => {
              // console.log("Flight data::");
              // console.log(JSON.stringify(data.data[0]));
              var data = data.data[0];
              let isNF = 0;
              if (data != "" && data != undefined && data != {} && data != []) {
                this.providerId = data.providerId;
                if (data.flightData != "" && data.flightData != undefined) {

                  if (data.flightData[0].groupedItineraryResponse != ''
                    && data.flightData[0].groupedItineraryResponse != undefined) {

                    if (data.flightData[0].groupedItineraryResponse.statistics.itineraryCount > 0) {
                      isNF = 1;
                      this.rootData = data.flightData[0].groupedItineraryResponse;
                      this.scheduleDescs = this.rootData.scheduleDescs;
                      this.legDescs = this.rootData.legDescs;
                      this._setMarkupDiscountDetails(data);
                      this.fareSearchSkeleton = false;
                      this.topFlightSearchSkeletonLeft = false;
                      this.topFlightSearchSkeletonRight = false;
                    }
                  }
                }
              }

              if (data != "" && data != undefined && data != {} && data != []) {
                this.providerIdTwo = data.providerId;
                if (data.flightDataTwo != "" && data.flightDataTwo != undefined) {
                  if (data.flightDataTwo[0].groupedItineraryResponse != ''
                    && data.flightDataTwo[0].groupedItineraryResponse != undefined) {
                    if (data.flightDataTwo[0].groupedItineraryResponse.statistics.itineraryCount > 0) {
                      isNF = 1;
                      this.rootDataTwo = data.flightDataTwo[0].groupedItineraryResponse;
                      this.scheduleDescsTwo = this.rootDataTwo.scheduleDescs;
                      this.legDescsTwo = this.rootDataTwo.legDescs;

                      this.fareSearchSkeleton = false;
                      this.topFlightSearchSkeletonLeft = false;
                      this.topFlightSearchSkeletonRight = false;

                    }
                  }
                }
              }
              if (isNF == 0) {
                this.isNotFound = true;
              }
              this.isLoad = false;
            }, error => {
            });
          } catch (exp) {
            console.log(exp);
            this.isNotFound = true;
          }
        }
      }, 1000);
    }
  }
  farePanelWiseSearch(data: any) {
    try {
      var model = JSON.parse(localStorage.getItem('loaderData')!);
      this.selectedDepartureDate = data.departureDate;
      this.selectedReturnDate = "";
      this.selectedDeparturePanel =
        this.shareService.getDayNameShort(this.selectedDepartureDate) + ", " +
        this.shareService.getDay(this.selectedDepartureDate) + " " +
        this.shareService.getMonthShort(this.selectedDepartureDate) + "'" +
        this.shareService.getYearShort(this.selectedDepartureDate);
      this.flightSearch(this.selectedDepartureDate, model.returnDate, model.fromFlightId, model.fromFlightCode,
        model.fromFlightName, model.toFlightId, model.toFlightCode, model.toFlightName,
        model.fromAirportName, model.toAirportName, model.fromCountryName, model.toCountryName, model.airlines, model.stop, model.classType,
        model.cabinTypeId, model.tripTypeId, model.childList, model.childList1, model.childList2, model.adult, model.infant, model.isOneWay,
        model.isRoundTrip, model.isMultiCity
      );
    } catch (exp) { }
  }
  flightSearch(departureDate: any, returnDate: any, fromFlightId: any, fromFlightCode: any, fromFlightName: any, toFlightId: any,
    toFlightCode: any, toFlightName: any, fromAirportName: any, toAirportName: any, fromCountryName: any, toCountryName: any,
    airlines: any, stop: any, classType: any, cabinTypeId: any, tripTypeId: any, childList: any, childList1: any,
    childList2: any, adult: any, infant: any, isOneWay: any, isRoundtrip: any, isMultiCity: any) {
    let loaderData = {};
    loaderData = {
      fromFlightId: fromFlightId, fromFlightCode: fromFlightCode, fromFlightName: fromFlightName,
      toFlightId: toFlightId, toFlightName: toFlightName, toFlightCode: toFlightCode,
      fromAirportName: fromAirportName, toAirportName: toAirportName, fromCountryName: fromCountryName, toCountryName: toCountryName,
      departureDate: departureDate, returnDate: returnDate, adult: adult, childList: childList, infant: infant,
      classType: classType, airlines: airlines, stop: stop, cabinTypeId: cabinTypeId, tripTypeId: tripTypeId,
      childList1: childList1, childList2: childList2, isOneWay: isOneWay, isRoundTrip: isRoundtrip, isMultiCity: isMultiCity
    };
    this.getFlightSearch(loaderData);
  }
  selectedItemSet(depDate: any, airFromId: any, airToId: any, depCity: any, depCountry: any, arrCity: any, arrCountry: any, retDate: any = "") {
    this.selectedDepartureDate = depDate;
    this.selectedAirportFromId = airFromId;
    this.selectedAirportToId = airToId;
    this.selectedDepartureCity = depCity;
    this.selectedReturnCity = arrCity;
    this.selectedDepartureCountry = depCountry;
    this.selectedReturnCountry = arrCountry;
    this.selectedDeparturePanel =
      this.shareService.getDayNameShort(this.selectedDepartureDate) + ", " +
      this.shareService.getDay(this.selectedDepartureDate) + " " +
      this.shareService.getMonthShort(this.selectedDepartureDate) + "'" +
      this.shareService.getYearShort(this.selectedDepartureDate);

    if (retDate != undefined && retDate != '') {
      this.selectedReturnDate = retDate;
      this.selectedReturnPanel =
        this.shareService.getDayNameShort(this.selectedReturnDate) + ", " +
        this.shareService.getDay(this.selectedReturnDate) + " " +
        this.shareService.getMonthShort(this.selectedReturnDate) + "'" +
        this.shareService.getYearShort(this.selectedReturnDate);
    }
  }
  private _setBookInstantEnableDisable(data: any) {
    for (let item of data.bookInfo[0]) {
      let data = {
        AirlineId: "", AirlineRouteEnableId: item.airlinesRouteEnableId, ProviderId: item.providerId,
        AirlineCode: item.airlineCode, AirlineName: item.airlineName, isBook: item.isBook, isInstant: item.isInstant
      };
      this.bookInstantEnableDisable.push(data);
    }
    if (this.bookInstantEnableDisable.length > 0) {
      this._flightWork();
    } else {
      this.isNotFound = true;
    }
  }
  private _setMarkupDiscountDetails(data: any) {
    this.markupInfo = [];
    this.discountInfo = [];
    for (let markItem of data.markupInfo) {
      for (let item of markItem) {
        let data = {
          AirlineId: "", AirlineCode: item.airlineCode,
          AirlineName: "", Type: item.type, Percent: item.percent,providerId:item.providerId, nvProviderName: item.nvProviderName, calculationType:item.calculationType, supplierID:item.supplierID,assignSupplierWithProviderID:item.assignSupplierWithProviderID
        }
        this.markupInfo.push(data);
      }
    }
    for (let discountItem of data.discountInfo) {
      for (let item of discountItem) {
        let data = {
          AirlineId: "", AirlineCode: item.airlineCode,
          AirlineName: "", Type: item.type, Percent: item.percent,providerId:item.providerId, nvProviderName: item.nvProviderName, calculationType:item.calculationType, supplierID:item.supplierID,assignSupplierWithProviderID:item.assignSupplierWithProviderID
        }
        this.discountInfo.push(data);
      }
    }
    if (this.markupInfo.length > 0 && this.discountInfo.length > 0) {
      this._setBookInstantEnableDisable(data);
    } else {
      this.isNotFound = true;
    }
  }
  private _setFormGroupInfo(data: any) {
    this.fmgFlightSearchWay = this.fmgFlightSearch.get('FlightSearch') as FormArray;
    this.fmgFlightSearchWay.push(this.fb.group({
      fromFlight: data.fromFlightCode, toFlight: data.toFlightCode,
      departureDate: data.departureDate, returnDate: data.returnDate, adult: data.adult,
      infant: data.infant, classType: data.classType, airlines: data.airlines, stop: data.stop,
      userId: localStorage.getItem('uid'),
      providerId: this.providerId,
      domestic: true,
      airlinesOperating: "",
      airlinesMarketing: "",
      airlinesNumber: 0,
      cabinTypeId: this.flightHelper.getCabinTypeId(data.classType),
      tripTypeId: this.getTripTypeId(),
      childList: new FormArray([])
    }));
    // this.fmgChild = this.fmgFlightSearchWay.get('childList') as FormArray;
    // if (data.childList != undefined) {
    //   for (let item of data.childList) {
    //     this.fmgChild.push(this.fb.group({
    //       id: item.id,
    //       age: item.age
    //     }));
    //   }
    // }
  }
  _flightWork() {
    this._getAirCraftList();
  }

  filterFlightSearch() {
    if (this.isOneway) {
      this.tempDomOneWayData = this.domOneWayData;
    } else {
      this.tempFlightDataFirstLeg = this.flightDataFirstLeg;
    }
    let minRange = this._minimumRange();
    let maxRange = this.udMinRangeVal;
    let stopList: number[] = [];
    let deptTimeFilter: string[] = [];
    let arrTimeFilter: string[] = [];

    var airlineFilter = this.selectedAirFilterList;

    for (let item of this.stopCountList) {
      var id = $("#stopId" + item.id).is(":checked");
      if (id) {
        let stop = isNaN(this.shareService.getOnlyNumber(item.title)) ? 0 : this.shareService.getOnlyNumber(item.title);
        stopList.push(stop);
      }
    }
    let isRefund: boolean | undefined = undefined;
    if ($("#chkRefundYes").is(":checked")) {
      isRefund = true;
    }
    if ($("#chkRefundNo").is(":checked")) {
      isRefund = false;
    }
    for (let item of this.selectedDeptTimeList) {
      deptTimeFilter.push(item.text);
    }
    for (let item of this.selectedArrTimeList) {
      arrTimeFilter.push(item.text);
    }

    if (this.isOneway) {
      if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && deptTimeFilter.length > 0 && arrTimeFilter.length > 0
        && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && deptTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      }
      else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      }
      else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund;
        });
      } else if (maxRange != 0 && stopList.length > 0 && deptTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (stopList.length > 0 && isRefund != undefined && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (stopList.length > 0 && isRefund != undefined && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (isRefund != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }//two
      else if (maxRange != 0 && stopList.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && stopList.indexOf(i.stop) > -1;
        });
      } else if (maxRange != 0 && isRefund != undefined) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && i.refundable == isRefund;
        });
      } else if (maxRange != 0 && deptTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (maxRange != 0 && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (maxRange != 0 && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (stopList.length > 0 && isRefund != undefined) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund;
        });
      } else if (stopList.length > 0 && deptTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (stopList.length > 0 && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (stopList.length > 0 && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (isRefund != undefined && deptTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (isRefund != undefined && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return i.refundable == isRefund
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (isRefund != undefined && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return i.refundable == isRefund
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (deptTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return deptTimeFilter.indexOf(i.departureTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (airlineFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
          return arrTimeFilter.indexOf(i.arrivalTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else {
        if (maxRange != 0) {
          this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange);
          });
        }
        else if (stopList.length > 0) {
          this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1;
          });
        } else if (isRefund != undefined) {
          this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
            return i.refundable == isRefund;
          });
        } else if (deptTimeFilter.length > 0) {
          this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (arrTimeFilter.length > 0) {
          this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
            return arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (airlineFilter.length > 0) {
          this.tempDomOneWayData = this.tempDomOneWayData.filter(function (i, j) {
            return airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else {
          this.setTempFilterData();
        }
      }
    } else {
      if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && deptTimeFilter.length > 0 && arrTimeFilter.length > 0
        && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && deptTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      }
      else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
        && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      }
      else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund;
        });
      } else if (maxRange != 0 && stopList.length > 0 && deptTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (maxRange != 0 && stopList.length > 0 && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (stopList.length > 0 && isRefund != undefined && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (stopList.length > 0 && isRefund != undefined && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (isRefund != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }//two
      else if (maxRange != 0 && stopList.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && stopList.indexOf(i.stop) > -1;
        });
      } else if (maxRange != 0 && isRefund != undefined) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && i.refundable == isRefund;
        });
      } else if (maxRange != 0 && deptTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (maxRange != 0 && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (maxRange != 0 && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange)
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (stopList.length > 0 && isRefund != undefined) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && i.refundable == isRefund;
        });
      } else if (stopList.length > 0 && deptTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (stopList.length > 0 && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (stopList.length > 0 && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else if (isRefund != undefined && deptTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return i.refundable == isRefund
            && deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (isRefund != undefined && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return i.refundable == isRefund
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (isRefund != undefined && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return i.refundable == isRefund
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return deptTimeFilter.indexOf(i.departureTime) > -1
            && arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (deptTimeFilter.length > 0 && airlineFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return deptTimeFilter.indexOf(i.departureTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else if (airlineFilter.length > 0 && arrTimeFilter.length > 0) {
        this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
          return arrTimeFilter.indexOf(i.arrivalTime) > -1
            && airlineFilter.indexOf(i.airlineCode) > -1;
        });
      }
      else {
        if (maxRange != 0) {
          this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice < maxRange);
          });
        } else if (stopList.length > 0) {
          this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1;
          });
        } else if (isRefund != undefined) {
          this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
            return i.refundable == isRefund;
          });
        } else if (deptTimeFilter.length > 0) {
          this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (arrTimeFilter.length > 0) {
          this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
            return arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (airlineFilter.length > 0) {
          this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.filter(function (i, j) {
            return airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else {
          this.setTempFilterData();
        }
      }
    }
  }

  filterFlightSearchTwo() {
    this.tempFlightDataSecondLeg = this.flightDataSecondLeg;
    let minRange = this._minimumRangeTwo();
    let maxRange = this.udMinRangeVal;
    let stopList: number[] = [];
    let deptTimeFilter: string[] = [];
    let arrTimeFilter: string[] = [];

    var airlineFilter = this.selectedAirFilterList;

    for (let item of this.stopCountListTwo) {
      var id = $("#stopIdTwo" + item.id).is(":checked");
      if (id) {
        let stop = isNaN(this.shareService.getOnlyNumber(item.title)) ? 0 : this.shareService.getOnlyNumber(item.title);
        stopList.push(stop);
      }
    }


    let isRefund: boolean | undefined = undefined;
    if ($("#chkRefundYesTwo").is(":checked")) {
      isRefund = true;
    }
    if ($("#chkRefundNoTwo").is(":checked")) {
      isRefund = false;
    }
    for (let item of this.selectedDeptTimeList) {
      deptTimeFilter.push(item.text);
    }
    for (let item of this.selectedArrTimeList) {
      arrTimeFilter.push(item.text);
    }



    if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
      && deptTimeFilter.length > 0 && arrTimeFilter.length > 0
      && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
      && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
      && deptTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1;
      });
    }
    else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
      && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
      && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    }
    else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if (isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund;
      });
    } else if (maxRange != 0 && stopList.length > 0 && deptTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && deptTimeFilter.indexOf(i.departureTime) > -1;
      });
    } else if (maxRange != 0 && stopList.length > 0 && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (maxRange != 0 && stopList.length > 0 && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    } else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1;
      });
    } else if (stopList.length > 0 && isRefund != undefined && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (stopList.length > 0 && isRefund != undefined && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    } else if (isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (isRefund != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return deptTimeFilter.indexOf(i.departureTime) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }//two
    else if (maxRange != 0 && stopList.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && stopList.indexOf(i.stop) > -1;
      });
    } else if (maxRange != 0 && isRefund != undefined) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && i.refundable == isRefund;
      });
    } else if (maxRange != 0 && deptTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && deptTimeFilter.indexOf(i.departureTime) > -1;
      });
    } else if (maxRange != 0 && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (maxRange != 0 && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return (i.totalPrice >= minRange && i.totalPrice < maxRange)
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    } else if (stopList.length > 0 && isRefund != undefined) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && i.refundable == isRefund;
      });
    } else if (stopList.length > 0 && deptTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && deptTimeFilter.indexOf(i.departureTime) > -1;
      });
    } else if (stopList.length > 0 && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (stopList.length > 0 && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return stopList.indexOf(i.stop) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else if (isRefund != undefined && deptTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return i.refundable == isRefund
          && deptTimeFilter.indexOf(i.departureTime) > -1;
      });
    } else if (isRefund != undefined && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return i.refundable == isRefund
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (isRefund != undefined && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return i.refundable == isRefund
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    } else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return deptTimeFilter.indexOf(i.departureTime) > -1
          && arrTimeFilter.indexOf(i.arrivalTime) > -1;
      });
    } else if (deptTimeFilter.length > 0 && airlineFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return deptTimeFilter.indexOf(i.departureTime) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    } else if (airlineFilter.length > 0 && arrTimeFilter.length > 0) {
      this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
        return arrTimeFilter.indexOf(i.arrivalTime) > -1
          && airlineFilter.indexOf(i.airlineCode) > -1;
      });
    }
    else {
      if (maxRange != 0) {
        this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
          return (i.totalPrice >= minRange && i.totalPrice < maxRange);
        });
      } else if (stopList.length > 0) {
        this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
          return stopList.indexOf(i.stop) > -1;
        });
      } else if (isRefund != undefined) {
        this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
          return i.refundable == isRefund;
        });
      } else if (deptTimeFilter.length > 0) {
        this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
          return deptTimeFilter.indexOf(i.departureTime) > -1;
        });
      } else if (arrTimeFilter.length > 0) {
        this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
          return arrTimeFilter.indexOf(i.arrivalTime) > -1;
        });
      } else if (airlineFilter.length > 0) {
        this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.filter(function (i, j) {
          return airlineFilter.indexOf(i.airlineCode) > -1;
        });
      } else {
        this.setTempFilterDataTwo();
      }
    }
  }





  private _agentPrice(traffic: any, baseFare: any, tax: any, total: any, airlineCode: any): any {
    let ret:any="0";
    try{
      let markupPrice=this.flightHelper._getMarkupTotalPrice(this.markupInfo,baseFare,tax,total,traffic,airlineCode);
      let discountPrice=this.flightHelper._getDisountTotalPrice(this.discountInfo,baseFare,tax,total,traffic,airlineCode);
      ret=(markupPrice*parseInt(traffic))-discountPrice;
    }catch(exp){}
    return ret;
  }
  _getGroupFareAmount(data: any): any {
    let ret: number = 0;
    try {
      ret = data != undefined && data != "" && !isNaN(data) ? data : 0;
    } catch (exp) { }
    return ret;
  }
  _getGroupPassengerTotalFare(data: any, passenger: any): any {
    let ret: any = "";
    try {
      for (let item of data) {
        if (item.passengerInfo.passengerType.indexOf(passenger) > -1) {
          ret = item.passengerInfo.passengerTotalFare;
        }
      }
    } catch (exp) { }
    return ret;
  }
  _getGroupPassengerEquivalent(data: any, passenger: any): number {
    let ret: number = 0;
    try {
      let dataInfo = this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data), passenger).equivalentAmount;
      if (dataInfo != undefined && dataInfo != "") {
        ret = parseInt(dataInfo);
      }
    } catch (exp) { }
    return ret;
  }
  _getGroupPassengerTax(data: any, passenger: any): number {
    let ret: number = 0;
    try {
      let dataInfo = this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data), passenger).totalTaxAmount;
      if (dataInfo != undefined && dataInfo != "") {
        ret = parseInt(dataInfo);
      }
    } catch (exp) { }
    return ret;
  }
  _getGroupPassengerTotal(data: any, passenger: any): number {
    let ret: number = 0;
    try {
      let dataInfo = this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data), passenger).totalFare;
      if (dataInfo != undefined && dataInfo != "") {
        ret = parseInt(dataInfo);
      }
    } catch (exp) { }
    return ret;
  }
  getMarkupTypeList() {
    try {
      this.authService.getMarkupList().subscribe(data => {

        for (let item of data.markuplist) {
          this.markupList.push(item);
        }

      }, err => {
        console.log(err);
      });
    } catch (exp) {
    }
  }
  _getGroupPassengerInfoList(data: any): any {
    let ret: any = "";
    try {
      ret = data.itineraries[0].pricingInformation[0].fare.passengerInfoList;
    } catch (exp) { }
    return ret;
  }
  setFlightData() {
    // console.log("set flight data");

    if (this.isOneway) {
      try {
        this.flightSearchSkeleton = false;
        this.domOneWayData = [];
        this.domOneWayDataGroup = [];
        let adultMember = this.adult;
        let childListMember = this.fmgFlightSearchWay.value.childList;
        let infantMember = this.infant;
        if (childListMember == undefined) {
          childListMember = [];
        }
        for (let item of this.itineraryGroups) {
          let adultBase = this._getGroupPassengerEquivalent(item, 'ADT');
          let adultTax = this._getGroupPassengerTax(item, 'ADT');
          let adultTotal = this._getGroupPassengerTotal(item, 'ADT');

          let childBase = this._getGroupPassengerEquivalent(item, 'C');
          let childTax = this._getGroupPassengerTax(item, 'C');
          let childTotal = this._getGroupPassengerTotal(item, 'C');

          let infantBase = this._getGroupPassengerEquivalent(item, 'INF');
          let infantTax = this._getGroupPassengerTax(item, 'INF');
          let infantTotal = this._getGroupPassengerTotal(item, 'INF');
          let validatingAirCode = item.itineraries[0].pricingInformation[0].fare.validatingCarrierCode;

          let clientFareTotal = Number.parseFloat(this.flightHelper._getMarkupTotalPrice(this.markupInfo,
            adultBase, adultTax, adultTotal, adultMember, validatingAirCode).toFixed(0)) +
            Number.parseFloat(this.flightHelper._getMarkupTotalPrice(this.markupInfo, childBase, childTax,
              childTotal, childListMember.length, validatingAirCode).toFixed(0)) +
            Number.parseFloat(this.flightHelper._getMarkupTotalPrice(this.markupInfo, infantBase, infantTax,
              infantTotal, infantMember, validatingAirCode).toFixed(0));

          this.domOneWayDataGroup.push({
            fareInfo: item.groupDescription.legDescriptions[0],
            clientFare: clientFareTotal,
          });

        }
        for (let itiItem of this.itineraries) {
          let ref: number = Number.parseInt(itiItem.legs[0].ref) - 1;
          let depRef = this._schedules(ref)[0].ref - 1;
          let arrRef = this._schedules(ref)[this._schedules(ref).length - 1].ref - 1;
          let airlineCode = this._airlinesCode(depRef);
          let airlineName = this._airlinesName(depRef);
          let departureTime = this._timeDeparture(depRef);
          let arrivalTime = this._timeArrival(arrRef);
          let airlineNumber = this._carrier(depRef).marketingFlightNumber;
          let airCraftCode = this._equipment(depRef).code;
          let airCraftName = this.getAirCraftName(this._equipment(depRef).code);
          let departureCityCode = this._departure(depRef).airport;
          let arrivalCityCode = this._arrival(arrRef).airport;
          let departureCity = this.getDepCityName(this._departure(depRef).airport);
          let arrivalCity = this.getArrCityName(this._arrival(arrRef).airport);
          let differenceTime = this._difference(this._timeDeparture(depRef), this._timeArrival(arrRef));

          let adultBase = this._passengerInfoTotalFareAdult(itiItem.id).equivalentAmount;
          let adultTax = this._passengerInfoTotalFareAdult(itiItem.id).totalTaxAmount;
          let adultTotal = this._passengerInfoTotalFareAdult(itiItem.id).totalFare;
          let adultDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, adultBase, adultTax, adultTotal, adultMember, airlineCode);

          let childBase = this._passengerInfoTotalFareChild(itiItem.id).equivalentAmount;
          let childTax = this._passengerInfoTotalFareChild(itiItem.id).totalTaxAmount;
          let childTotal = this._passengerInfoTotalFareChild(itiItem.id).totalFare;
          let childDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, childBase, childTax, childTotal, childListMember.length, airlineCode);

          let infantBase = this._passengerInfoTotalFareInfant(itiItem.id).equivalentAmount;
          let infantTax = this._passengerInfoTotalFareInfant(itiItem.id).totalTaxAmount;
          let infantTotal = this._passengerInfoTotalFareInfant(itiItem.id).totalFare;
          let infantDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, infantBase, infantTax, infantTotal, infantMember, airlineCode);

          adultBase = adultBase != undefined && adultBase != "" && !isNaN(adultBase) ? adultBase : 0;
          adultTax = adultTax != undefined && adultTax != "" && !isNaN(adultTax) ? adultTax : 0;
          adultTotal = adultTotal != undefined && adultTotal != "" && !isNaN(adultTotal) ? adultTotal : 0;
          adultDiscount = adultDiscount != undefined && !isNaN(adultDiscount) ? adultDiscount : 0;

          childBase = childBase != undefined && childBase != "" && !isNaN(childBase) ? childBase : 0;
          childTax = childTax != undefined && childTax != "" && !isNaN(childTax) ? childTax : 0;
          childTotal = childTotal != undefined && childTotal != "" && !isNaN(childTotal) ? childTotal : 0;
          childDiscount = childDiscount != undefined && !isNaN(childDiscount) ? childDiscount : 0;

          infantBase = infantBase != undefined && infantBase != "" && !isNaN(infantBase) ? infantBase : 0;
          infantTax = infantTax != undefined && infantTax != "" && !isNaN(infantTax) ? infantTax : 0;
          infantTotal = infantTotal != undefined && infantTotal != "" && !isNaN(infantTotal) ? infantTotal : 0;
          infantDiscount = infantDiscount != undefined && !isNaN(infantDiscount) ? infantDiscount : 0;

          let adultClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0))
            + parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0));

          let childClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0)) +
            parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0));

          let infantClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0)) +
            parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0));

          let adultAgentTotal = adultClientTotal - (parseFloat(adultDiscount.toFixed(0)) * parseFloat(adultMember));
          let childAgentTotal = childClientTotal - (parseFloat(childDiscount.toFixed(0)) * parseFloat(childListMember.length));
          let infantAgentTotal = infantClientTotal - (parseFloat(infantDiscount.toFixed(0)) * parseFloat(infantMember));

          this.tripTypeId = this.getTripTypeId();
          this.domOneWayData.push({
            id: itiItem.id,
            providerId: this.providerId,
            tripTypeId: this.tripTypeId,
            cabinTypeId: this.cabinTypeId,
            airlineLogo: this.getAirlineLogo(airlineCode),
            airlineName: airlineName,
            airlineCode: airlineCode,
            airlineId: this.getAirlineId(airlineCode),
            airlineNumber: airlineNumber,
            airCraftId: this.getAircraftId(airCraftCode),
            airCraftCode: airCraftCode,
            airCraftName: airCraftName,
            departureDate: this.departureDate,
            arrivalDate: this.returnDate,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            departureCityId: this.selectedAirportFromId,
            departureCityCode: departureCityCode,
            departureCity: departureCity,
            arrivalCityId: this.selectedAirportToId,
            arrivalCityCode: arrivalCityCode,
            arrivalCity: arrivalCity,
            differenceTime: differenceTime,
            adult: adultMember,
            child: childListMember,
            infant: infantMember,
            stop: 0,
            stopAllCity: '',
            domestic: true,
            adjustment: 0,
            flightRouteTypeId: this.flightHelper.flightRouteType[0],
            lastTicketDate: this._fare(itiItem.id).lastTicketDate,
            lastTicketTime: this._fare(itiItem.id).lastTicketTime,
            baggageAdult: this._pieceOrKgsAdult(itiItem.id),
            baggageChild: this._pieceOrKgsChild(itiItem.id),
            baggageInfant: this._pieceOrKgsInfant(itiItem.id),
            cabinAdult: this._passengerCabinAdult(itiItem.id),
            cabinChild: this._passengerCabinChild(itiItem.id),
            cabinInfant: this._passengerCabinInfant(itiItem.id),
            instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, airlineCode),
            airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, airlineCode),
            btnLoad: false,
            isAgentFare: this.isAgentFare,
            refundable: this._passengerInfoList(itiItem.id)[0].passengerInfo.nonRefundable == false ? true : false,
            fareBasisCode: this._fareComponentDescs(this._passengerInfoList(itiItem.id)[0].passengerInfo.fareComponents[0].ref - 1).fareBasisCode,
            markupTypeList: this.markupList,
            totalPrice: this._totalFare(itiItem.id).totalPrice,
            totalDiscount: Number.parseFloat(adultDiscount.toFixed(0)) + Number.parseFloat(childDiscount.toFixed(0)) + Number.parseFloat(infantDiscount.toFixed(0)),
            clientFareTotal: this.getTotalAdultChildInfant(adultClientTotal, childClientTotal, infantClientTotal),
            agentFareTotal: this.getTotalAdultChildInfant(adultAgentTotal, childAgentTotal, infantAgentTotal),
            gdsFareTotal:
              (parseInt(adultMember) == 0 ? 0 : adultTotal) + (parseInt(childListMember.length) == 0 ? 0 : childTotal) + (parseInt(infantMember) == 0 ? 0 : infantTotal),
            flightSegmentData: [], fareData: {}
          });
          let fInd = 0;
          let adjustAct = 0;
          let index = this.domOneWayData.findIndex(x => x.id === itiItem.id);
          for (let item of this._schedules(ref)) {
            let fref = item.ref - 1;
            let adj = 0, depAdj = 0, arrAdj = 0;
            if (item.departureDateAdjustment != undefined && item.departureDateAdjustment != '') {
              adj = item.departureDateAdjustment;
            }
            if (this._departure(fref).dateAdjustment != undefined && this._departure(fref).dateAdjustment != '') {
              depAdj = this._departure(fref).dateAdjustment;
            }
            if (this._arrival(fref).dateAdjustment != undefined && this._arrival(fref).dateAdjustment != '') {
              arrAdj = this._arrival(fref).dateAdjustment;
            }
            let depAirportCode = this._departure(fref).airport;
            let depAirportId = this.getAirportId(depAirportCode);
            let arrAirportCode = this._arrival(fref).airport;
            let arrAirportId = this.getAirportId(arrAirportCode);
            let airlineCode = this._airlinesCode(fref);
            let airlineId = this.getAirlineId(airlineCode);

            this.domOneWayData[index].flightSegmentData.push({
              airlineName: this._airlinesName(fref),
              airlineCode: airlineCode,
              airlineId: airlineId,
              domestic: true,
              airlineLogo: this.getAirlineLogo(this._airlinesCode(fref)),
              airlineNumber: this._carrier(fref).marketingFlightNumber,
              availableSeat: this.getSeatsAvailability(itiItem.id),
              bookingCode: this._passengerInfoFareComponentsSegmentsAdult(itiItem.id).bookingCode,
              departureTime: this._timeDeparture(fref),
              arrivalTime: this._timeArrival(fref),
              departureCity: this.getDepCityName(this._departure(fref).airport),
              arrivalCity: this.getArrCityName(this._arrival(fref).airport),
              departureAirportCode: depAirportCode,
              arrivalAirportCode: arrAirportCode,
              departureAirportId: depAirportId,
              arrivalAirportId: arrAirportId,
              differenceTime: this._timeDifference(fref),
              layOverDifference: "",
              terminalDeparture: this._terminalDeparture(fref),
              terminalArrival: this._terminalArrival(fref),
              stopCount: fInd,
              adjustment: adjustAct,
              departureAdjustment: depAdj,
              arrivalAdjustment: arrAdj
            });
            fInd = fInd + 1;
            this.domOneWayData[index].adjustment += adj;
          }
          let fData = this.domOneWayData[index].flightSegmentData;
          let lenStop = fData.length;
          let stopData = "";
          if (lenStop > 2) {
            for (let item of fData) {
              stopData += item.arrivalCity + ",";
            }
            stopData = stopData.substring(0, stopData.length - 1);
            if (stopData.length > 12) {
              stopData = stopData.substring(0, 12) + "..";
            }
          } else {
            stopData = fData[0].arrivalCity;
          }
          this.domOneWayData[index].stop = parseInt(lenStop) > 1 ? parseInt(lenStop) - 1 : 0;
          this.domOneWayData[index].stopAllCity = stopData;
          let diff = "";
          for (let i = 0; i < this.domOneWayData[index].flightSegmentData.length; i++) {
            try {
              let dep = this.domOneWayData[index].flightSegmentData[i + 1].departureTime;
              let arr = this.domOneWayData[index].flightSegmentData[i].arrivalTime;
              diff = this._difference(arr, dep);
            } catch (exp) {
              diff = "";
            }
            this.domOneWayData[index].flightSegmentData[i].layOverDifference = diff;
          }

          this.domOneWayData[index].fareData = {
            markupTypeId: this.flightHelper._typeWiseIdMarkup(this.markupInfo, airlineCode),
            markupPercent:this.flightHelper._typeWiseMarkupPercent(this.markupInfo,airlineCode),
            discountTypeId: this.flightHelper._typeWiseIdDiscount(this.discountInfo, airlineCode),
            discountTypePercent:this.flightHelper._typeWiseDiscountPercent(this.discountInfo,airlineCode),
            discountType: this.flightHelper._typeOfMarkupDiscount(this.markupInfo, airlineCode),
            adultBaseGDS: parseInt(adultMember) == 0 ? 0 : adultBase,
            childBaseGDS: parseInt(childListMember.length) == 0 ? 0 : childBase,
            infantBaseGDS: parseInt(infantMember) == 0 ? 0 : infantBase,
            adultTaxGDS: parseInt(adultMember) == 0 ? 0 : adultTax,
            childTaxGDS: parseInt(childListMember.length) == 0 ? 0 : childTax,
            infantTaxGDS: parseInt(infantMember) == 0 ? 0 : infantTax,
            adultTotalGDS: parseInt(adultMember) == 0 ? 0 : adultTotal,
            childTotalGDS: parseInt(childListMember.length) == 0 ? 0 : childTotal,
            infantTotalGDS: parseInt(infantMember) == 0 ? 0 : infantTotal,
            adultBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0),
            adultTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0),
            adultTotalClient: adultClientTotal,
            adultDiscount: parseFloat(adultDiscount.toFixed(0)) * parseFloat(adultMember),
            adultAgentFare: adultAgentTotal,
            childBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0),
            childTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0),
            childTotalClient: childClientTotal,
            childDiscount: parseFloat(childDiscount.toFixed(0)) * parseFloat(childListMember.length),
            childAgentFare: childAgentTotal,
            infantBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0),
            infantTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0),
            infantTotalClient: infantClientTotal,
            infantDiscount: parseFloat(infantDiscount.toFixed(0)) * parseFloat(infantMember),
            infantAgentFare: infantAgentTotal
          };
          index += 1;
        }
        // console.log(this.domOneWayData);
        this.makeProposalData = this.domOneWayData[0];
        this.setStopCount();
        this.setTempFilterData();
      } catch (exp) {
        this.isNotFound = true;
        console.log(exp);
      }
    } else {
      try {
        this.flightSearchSkeleton = false;
        this.flightDataFirstLeg = [];
        // this.intOneWayDataGroup=[];
        this.topFlights = [];
        let adultMember = this.adult;
        let childListMember = this.fmgFlightSearchWay.value.childList;
        let infantMember = this.infant;
        let ind = 0;
        if (childListMember == undefined) {
          childListMember = [];
        }
        for (let rootItem of this.rootData.itineraryGroups) {
          if (rootItem.groupDescription.legDescriptions[0].arrivalLocation == this.selectedAirportToCode) {
            for (let itiItem of rootItem.itineraries) {
              let rootHours = 0, rootMinutes = 0;
              let ref: number = Number.parseInt(itiItem.legs[0].ref) - 1;
              let depRef = this._schedules(ref)[0].ref - 1;
              let arrRef = this._schedules(ref)[this._schedules(ref).length - 1].ref - 1;
              let airlineCode = this._airlinesCode(depRef);
              let airlineName = this._airlinesName(depRef);
              let departureTime = this._timeDeparture(depRef);
              let arrivalTime = this._timeArrival(arrRef);
              let airlineNumber = this._carrier(depRef).marketingFlightNumber;
              let airCraftCode = this._equipment(depRef).code;
              let airCraftName = this.getAirCraftName(this._equipment(depRef).code);
              let departureCityCode = this._departure(depRef).airport;
              let arrivalCityCode = this._arrival(arrRef).airport;
              let departureCity = this.getDepCityName(this._departure(depRef).airport);
              let arrivalCity = this.getArrCityName(this._arrival(arrRef).airport);

              let adultBase = this._passengerInfoTotalFareAdult(itiItem.id).equivalentAmount;
              let adultTax = this._passengerInfoTotalFareAdult(itiItem.id).totalTaxAmount;
              let adultTotal = this._passengerInfoTotalFareAdult(itiItem.id).totalFare;
              let adultDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, adultBase, adultTax, adultTotal, adultMember, airlineCode);

              let childBase = this._passengerInfoTotalFareChild(itiItem.id).equivalentAmount;
              let childTax = this._passengerInfoTotalFareChild(itiItem.id).totalTaxAmount;
              let childTotal = this._passengerInfoTotalFareChild(itiItem.id).totalFare;
              let childDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, childBase, childTax, childTotal, childListMember.length, airlineCode);

              let infantBase = this._passengerInfoTotalFareInfant(itiItem.id).equivalentAmount;
              let infantTax = this._passengerInfoTotalFareInfant(itiItem.id).totalTaxAmount;
              let infantTotal = this._passengerInfoTotalFareInfant(itiItem.id).totalFare;
              let infantDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, infantBase, infantTax, infantTotal, infantMember, airlineCode);

              adultBase = adultBase != undefined && adultBase != "" && !isNaN(adultBase) ? adultBase : 0;
              adultTax = adultTax != undefined && adultTax != "" && !isNaN(adultTax) ? adultTax : 0;
              adultTotal = adultTotal != undefined && adultTotal != "" && !isNaN(adultTotal) ? adultTotal : 0;
              adultDiscount = adultDiscount != undefined && !isNaN(adultDiscount) ? adultDiscount : 0;

              childBase = childBase != undefined && childBase != "" && !isNaN(childBase) ? childBase : 0;
              childTax = childTax != undefined && childTax != "" && !isNaN(childTax) ? childTax : 0;
              childTotal = childTotal != undefined && childTotal != "" && !isNaN(childTotal) ? childTotal : 0;
              childDiscount = childDiscount != undefined && !isNaN(childDiscount) ? childDiscount : 0;

              infantBase = infantBase != undefined && infantBase != "" && !isNaN(infantBase) ? infantBase : 0;
              infantTax = infantTax != undefined && infantTax != "" && !isNaN(infantTax) ? infantTax : 0;
              infantTotal = infantTotal != undefined && infantTotal != "" && !isNaN(infantTotal) ? infantTotal : 0;
              infantDiscount = infantDiscount != undefined && !isNaN(infantDiscount) ? infantDiscount : 0;

              let adultClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0))
                + parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0));

              let childClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0)) +
                parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0));

              let infantClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0)) +
                parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0));

              let adultAgentTotal = adultClientTotal - (parseFloat(adultDiscount.toFixed(0)) * parseFloat(adultMember));
              let childAgentTotal = childClientTotal - (parseFloat(childDiscount.toFixed(0)) * parseFloat(childListMember.length));
              let infantAgentTotal = infantClientTotal - (parseFloat(infantDiscount.toFixed(0)) * parseFloat(infantMember));

              this.tripTypeId = this.getTripTypeId();
              this.flightDataFirstLeg.push({
                id: itiItem.id,
                providerId: this.providerId,
                providerName: "",
                tripTypeId: this.tripTypeId,
                cabinTypeId: this.cabinTypeId,
                groupAirlineCode: '',
                airlineLogo: this.getAirlineLogo(airlineCode),
                airlineName: airlineName,
                airlineCode: airlineCode,
                airlineId: this.getAirlineId(airlineCode),
                airlineNumber: airlineNumber,
                airCraftId: this.getAircraftId(airCraftCode),
                airCraftCode: airCraftCode,
                airCraftName: airCraftName,
                departureDate: this.departureDate,
                arrivalDate: this.returnDate,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                departureCityId: this.selectedAirportFromId,
                departureCityCode: departureCityCode,
                departureCity: departureCity,
                arrivalCityId: this.selectedAirportToId,
                arrivalCityCode: arrivalCityCode,
                arrivalCity: arrivalCity,
                differenceTime: "",
                adult: adultMember,
                child: childListMember,
                infant: infantMember,
                stop: 0,
                stopAllCity: '',
                tooltipData: '',
                adjustment: 0,
                domestic: true,
                flightRouteTypeId: this.flightHelper.flightRouteType[0],
                lastTicketDate: this._fare(itiItem.id).lastTicketDate,
                lastTicketTime: this._fare(itiItem.id).lastTicketTime,
                baggageAdult: this._pieceOrKgsAdult(itiItem.id),
                baggageChild: this._pieceOrKgsChild(itiItem.id),
                baggageInfant: this._pieceOrKgsInfant(itiItem.id),
                cabinAdult: this._passengerCabinAdult(itiItem.id),
                cabinChild: this._passengerCabinChild(itiItem.id),
                cabinInfant: this._passengerCabinInfant(itiItem.id),
                instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, airlineCode),
                airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, airlineCode),
                btnLoad: false,
                isAgentFare: this.isAgentFare,
                refundable: this._passengerInfoList(itiItem.id)[0].passengerInfo.nonRefundable == false ? true : false,
                fareBasisCode: this._fareComponentDescs(this._passengerInfoList(itiItem.id)[0].passengerInfo.fareComponents[0].ref - 1).fareBasisCode,
                totalPrice: this._totalFare(itiItem.id).totalPrice,
                totalDiscount: Number.parseFloat(adultDiscount.toFixed(0)) + Number.parseFloat(childDiscount.toFixed(0)) + Number.parseFloat(infantDiscount.toFixed(0)),
                markupInfo: this.markupInfo,
                discountInfo: this.discountInfo,
                clientFareTotal: this.getTotalAdultChildInfant(adultClientTotal, childClientTotal, infantClientTotal),
                agentFareTotal: this.getTotalAdultChildInfant(adultAgentTotal, childAgentTotal, infantAgentTotal),
                gdsFareTotal:
                  (parseInt(adultMember) == 0 ? 0 : adultTotal) + (parseInt(childListMember.length) == 0 ? 0 : childTotal) + (parseInt(infantMember) == 0 ? 0 : infantTotal),
                flightSegmentData: [], fareData: {}
              });

              let airlineInd = this.airlines.findIndex(x => x.code == airlineCode);
              if (airlineInd != -1) {
                this.airlines[airlineInd].len += 1;
              }
              let fInd = 0;
              let index = this.flightDataFirstLeg.findIndex(x => x.id === itiItem.id);
              let adjustAct = 0;
              for (let item of this._schedules(ref)) {
                let fref = item.ref - 1;
                let adj = 0, depAdj = 0, arrAdj = 0;
                if (item.departureDateAdjustment != undefined && item.departureDateAdjustment != '') {
                  adj = item.departureDateAdjustment;
                }
                if (this._departure(fref).dateAdjustment != undefined && this._departure(fref).dateAdjustment != '') {
                  depAdj = this._departure(fref).dateAdjustment;
                }
                if (this._arrival(fref).dateAdjustment != undefined && this._arrival(fref).dateAdjustment != '') {
                  arrAdj = this._arrival(fref).dateAdjustment;
                }
                adjustAct += adj;
                let depAirportCode = this._departure(fref).airport;
                let depAirportId = this.getAirportId(depAirportCode);
                let arrAirportCode = this._arrival(fref).airport;
                let arrAirportId = this.getAirportId(arrAirportCode);
                let airlineCode = this._airlinesCode(fref);
                let airlineId = this.getAirlineId(airlineCode);
                let fDifTime = this._timeDifferenceActual(fref, fref);
                if (this.flightDataFirstLeg[index].groupAirlineCode.indexOf(airlineCode) == -1) {
                  this.flightDataFirstLeg[index].groupAirlineCode += airlineCode + ",";
                }


                this.flightDataFirstLeg[index].flightSegmentData.push({
                  airlineName: this._airlinesName(fref),
                  airlineCode: airlineCode,
                  airlineId: airlineId,
                  airlineLogo: this.getAirlineLogo(this._airlinesCode(fref)),
                  airlineNumber: this._carrier(fref).marketingFlightNumber,
                  availableSeat: this.getSeatsAvailability(itiItem.id),
                  bookingCode: this._passengerInfoFareComponentsSegmentsAdult(itiItem.id).bookingCode,
                  departureTime: this._timeDeparture(fref),
                  arrivalTime: this._timeArrival(fref),
                  departureCity: this.getDepCityName(this._departure(fref).airport),
                  arrivalCity: this.getArrCityName(this._arrival(fref).airport),
                  departureAirportCode: depAirportCode,
                  arrivalAirportCode: arrAirportCode,
                  departureAirportId: depAirportId,
                  arrivalAirportId: arrAirportId,
                  differenceTime: fDifTime,
                  layOverDifference: "",
                  terminalDeparture: this._terminalDeparture(fref),
                  terminalArrival: this._terminalArrival(fref),
                  stopCount: fInd,
                  adjustment: adjustAct,
                  departureAdjustment: depAdj,
                  arrivalAdjustment: arrAdj
                });

                let fdifHour = 0;
                let fdifMinute = 0;
                if (fDifTime.indexOf('h') > -1 && fDifTime.indexOf('m') > -1) {
                  let fdifData = fDifTime.split(' ');
                  fdifHour = this.shareService.getOnlyNumber(fdifData[0]);
                  if (fdifData.length > 1) {
                    fdifMinute = parseInt(fdifData[1].toString().substring(0, fdifData[1].length - 1));
                  }
                } else if (fDifTime.indexOf('h') > -1 && fDifTime.indexOf('m') < 0) {
                  fdifHour = this.shareService.getOnlyNumber(fDifTime);
                } else if (fDifTime.indexOf('m') > -1 && fDifTime.indexOf('h') < 0) {
                  fdifMinute = this.shareService.getOnlyNumber(fDifTime);
                }
                rootHours += fdifHour;
                rootMinutes += fdifMinute;
                fInd = fInd + 1;

                this.flightDataFirstLeg[index].adjustment += adj;
              }
              // this.flightDataFirstLeg[index].adjustment=this.flightDataFirstLeg[index].flightData[this.flightDataFirstLeg[index].flightData.length-1].arrivalAdjustment;
              if (this.flightDataFirstLeg[index].groupAirlineCode.length > 0) {
                this.flightDataFirstLeg[index].groupAirlineCode = this.flightDataFirstLeg[index].groupAirlineCode.substring(0, this.flightDataFirstLeg[index].groupAirlineCode.length - 1);
              }
              let fData = this.flightDataFirstLeg[index].flightSegmentData;
              let lenStop = fData.length;
              let stopData = "";
              if (lenStop > 2) {
                for (let item of fData) {
                  stopData += item.arrivalCity + ",";
                }
                stopData = stopData.substring(0, stopData.length - 1);
                if (stopData.length > 12) {
                  stopData = stopData.substring(0, 12) + "..";
                }
              } else {
                stopData = fData[0].arrivalCity;
              }
              this.flightDataFirstLeg[index].stop = parseInt(lenStop) > 1 ? parseInt(lenStop) - 1 : 0;
              this.flightDataFirstLeg[index].stopAllCity = stopData;
              let diff = "";
              for (let i = 0; i < this.flightDataFirstLeg[index].flightSegmentData.length; i++) {
                try {
                  let dep = this.flightDataFirstLeg[index].flightSegmentData[i + 1].departureTime;
                  let arr = this.flightDataFirstLeg[index].flightSegmentData[i].arrivalTime;

                  let Gmt = this._timeDifferenceGMT(arr, dep);
                  let Utc = this._timeDifferenceUTC(arr, dep);

                  diff = this._differenceActual(Gmt, Utc);

                  let flayHour = this.shareService.getOnlyNumber(diff);
                  let flayMinute = 0;
                  if (diff.indexOf('m') > -1 && diff.indexOf('h') > -1) {
                    let fdifData = diff.split(' ');
                    flayHour = this.shareService.getOnlyNumber(fdifData[0]);
                    flayMinute = parseInt(fdifData[1].toString().substring(0, fdifData[1].length - 1));
                  } else if (diff.indexOf('m') < 0 && diff.indexOf('h') > -1) {
                    flayHour = this.shareService.getOnlyNumber(diff);
                  } else if (diff.indexOf('m') > -1 && diff.indexOf('h') < 0) {
                    flayMinute = this.shareService.getOnlyNumber(diff);
                  }
                  rootHours += flayHour;
                  rootMinutes += flayMinute;
                } catch (exp) {
                  diff = "";
                }
                this.flightDataFirstLeg[index].flightSegmentData[i].layOverDifference = diff;
              }
              if (rootMinutes > 59) {
                let retH = rootMinutes / 60;
                rootHours += retH;
                rootMinutes = rootMinutes % 60;
              }
              if (rootMinutes > 0) {
                this.flightDataFirstLeg[index].differenceTime = parseInt(rootHours.toString()) + "h " + parseInt(rootMinutes.toString()) + "m";
              } else {
                this.flightDataFirstLeg[index].differenceTime = parseInt(rootHours.toString()) + "h";
              }

              this.flightDataFirstLeg[index].fareData = {
                markupTypeId: this.flightHelper._typeWiseIdMarkup(this.markupInfo, airlineCode),
                markupPercent:this.flightHelper._typeWiseMarkupPercent(this.markupInfo,airlineCode),
                discountTypeId: this.flightHelper._typeWiseIdDiscount(this.discountInfo, airlineCode),
                discountTypePercent:this.flightHelper._typeWiseDiscountPercent(this.discountInfo,airlineCode),
                discountType: this.flightHelper._typeOfMarkupDiscount(this.markupInfo, airlineCode),
                adultBaseGDS: parseInt(adultMember) == 0 ? 0 : adultBase,
                childBaseGDS: parseInt(childListMember.length) == 0 ? 0 : childBase,
                infantBaseGDS: parseInt(infantMember) == 0 ? 0 : infantBase,
                adultTaxGDS: parseInt(adultMember) == 0 ? 0 : adultTax,
                childTaxGDS: parseInt(childListMember.length) == 0 ? 0 : childTax,
                infantTaxGDS: parseInt(infantMember) == 0 ? 0 : infantTax,

                adultTotalGDS: parseInt(adultMember) == 0 ? 0 : adultTotal,
                childTotalGDS: parseInt(childListMember.length) == 0 ? 0 : childTotal,
                infantTotalGDS: parseInt(infantMember) == 0 ? 0 : infantTotal,

                adultBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0),
                adultTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0),
                adultTotalClient: adultClientTotal,
                adultDiscount: parseFloat(adultDiscount.toFixed(0)) * parseFloat(adultMember),
                adultAgentFare: adultAgentTotal,
                childBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0),
                childTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0),
                childTotalClient: childClientTotal,
                childDiscount: parseFloat(childDiscount.toFixed(0)) * parseFloat(childListMember.length),
                childAgentFare: childAgentTotal,
                infantBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0),
                infantTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0),
                infantTotalClient: infantClientTotal,
                infantDiscount: parseFloat(infantDiscount.toFixed(0)) * parseFloat(infantMember),
                infantAgentFare: infantAgentTotal
              };
            }
          }
        }
        for (let item of this.airlines) {
          if (item.len != 0) {
            this.topFlights.push({
              code: item.code,
              logo: item.logo,
              name: item.name
            });
          }
        }
        // console.log("First leg data::");
        // console.log(this.flightDataFirstLeg);
        this.setTempFilterData();
        this.setStopCount();
      } catch (exp) {
        console.log(exp);
        this.isNotFound = true;
      }
    }
  }

  // Two

  setFlightDataTwo() {
    // console.log("set flight data Two");
    if (this.isOneway == false) {
      try {
        this.flightSearchSkeleton = false;
        this.flightDataSecondLeg = [];
        // this.intOneWayDataGroup=[];
        this.topFlightsTwo = [];
        let adultMember = this.adult;
        let childListMember = this.fmgFlightSearchWay.value.childList;
        let infantMember = this.infant;
        let ind = 0;
        if (childListMember == undefined) {
          childListMember = [];
        }
        for (let rootItem of this.rootDataTwo.itineraryGroups) {

          //yoa
          if (rootItem.groupDescription.legDescriptions[0].arrivalLocation == this.selectedAirportFromCode) {
            // for second leg date change api have to check if its departure date or arrival date : below comments are for reference
            // departureDate:this.departureDate,
            // arrivalDate:this.returnDate,

            for (let itiItem of rootItem.itineraries) {

              let rootHours = 0, rootMinutes = 0;
              let ref: number = Number.parseInt(itiItem.legs[0].ref) - 1;
              let depRef = this._schedulesTwo(ref)[0].ref - 1;
              let arrRef = this._schedulesTwo(ref)[this._schedulesTwo(ref).length - 1].ref - 1;
              let airlineCode = this._airlinesCodeTwo(depRef);
              let airlineName = this._airlinesNameTwo(depRef);
              let departureTime = this._timeDepartureTwo(depRef);
              let arrivalTime = this._timeArrivalTwo(arrRef);
              let airlineNumber = this._carrierTwo(depRef).marketingFlightNumber;
              let airCraftCode = this._equipmentTwo(depRef).code;
              let airCraftName = this.getAirCraftNameTwo(this._equipmentTwo(depRef).code);
              let departureCityCode = this._departureTwo(depRef).airport;
              let arrivalCityCode = this._arrivalTwo(arrRef).airport;
              let departureCity = this.getDepCityNameTwo(this._departureTwo(depRef).airport);
              let arrivalCity = this.getArrCityNameTwo(this._arrivalTwo(arrRef).airport);

              let adultBase = this._passengerInfoTotalFareAdultTwo(itiItem.id).equivalentAmount;
              let adultTax = this._passengerInfoTotalFareAdultTwo(itiItem.id).totalTaxAmount;
              let adultTotal = this._passengerInfoTotalFareAdultTwo(itiItem.id).totalFare;
              let adultDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, adultBase, adultTax, adultTotal, adultMember, airlineCode);

              let childBase = this._passengerInfoTotalFareChildTwo(itiItem.id).equivalentAmount;
              let childTax = this._passengerInfoTotalFareChildTwo(itiItem.id).totalTaxAmount;
              let childTotal = this._passengerInfoTotalFareChildTwo(itiItem.id).totalFare;
              let childDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, childBase, childTax, childTotal, childListMember.length, airlineCode);

              let infantBase = this._passengerInfoTotalFareInfantTwo(itiItem.id).equivalentAmount;
              let infantTax = this._passengerInfoTotalFareInfantTwo(itiItem.id).totalTaxAmount;
              let infantTotal = this._passengerInfoTotalFareInfantTwo(itiItem.id).totalFare;
              let infantDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, infantBase, infantTax, infantTotal, infantMember, airlineCode);

              adultBase = adultBase != undefined && adultBase != "" && !isNaN(adultBase) ? adultBase : 0;
              adultTax = adultTax != undefined && adultTax != "" && !isNaN(adultTax) ? adultTax : 0;
              adultTotal = adultTotal != undefined && adultTotal != "" && !isNaN(adultTotal) ? adultTotal : 0;
              adultDiscount = adultDiscount != undefined && !isNaN(adultDiscount) ? adultDiscount : 0;

              childBase = childBase != undefined && childBase != "" && !isNaN(childBase) ? childBase : 0;
              childTax = childTax != undefined && childTax != "" && !isNaN(childTax) ? childTax : 0;
              childTotal = childTotal != undefined && childTotal != "" && !isNaN(childTotal) ? childTotal : 0;
              childDiscount = childDiscount != undefined && !isNaN(childDiscount) ? childDiscount : 0;

              infantBase = infantBase != undefined && infantBase != "" && !isNaN(infantBase) ? infantBase : 0;
              infantTax = infantTax != undefined && infantTax != "" && !isNaN(infantTax) ? infantTax : 0;
              infantTotal = infantTotal != undefined && infantTotal != "" && !isNaN(infantTotal) ? infantTotal : 0;
              infantDiscount = infantDiscount != undefined && !isNaN(infantDiscount) ? infantDiscount : 0;

              let adultClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0))
                + parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0));

              let childClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0)) +
                parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0));

              let infantClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0)) +
                parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0));

              let adultAgentTotal = adultClientTotal - (parseFloat(adultDiscount.toFixed(0)) * parseFloat(adultMember));
              let childAgentTotal = childClientTotal - (parseFloat(childDiscount.toFixed(0)) * parseFloat(childListMember.length));
              let infantAgentTotal = infantClientTotal - (parseFloat(infantDiscount.toFixed(0)) * parseFloat(infantMember));



              this.tripTypeId = this.getTripTypeId();
              this.flightDataSecondLeg.push({
                id: itiItem.id,
                providerId: this.providerId,
                providerName: "",
                tripTypeId: this.tripTypeId,
                cabinTypeId: this.cabinTypeId,
                groupAirlineCode: '',
                airlineLogo: this.getAirlineLogoTwo(airlineCode),
                airlineName: airlineName,
                airlineCode: airlineCode,
                airlineId: this.getAirlineIdTwo(airlineCode),
                airlineNumber: airlineNumber,
                airCraftId: this.getAircraftIdTwo(airCraftCode),
                airCraftCode: airCraftCode,
                airCraftName: airCraftName,
                departureDate: this.departureDate,
                arrivalDate: this.returnDate,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                departureCityId: this.selectedAirportToId,
                departureCityCode: departureCityCode,
                departureCity: departureCity,
                arrivalCityId: this.selectedAirportFromId,
                arrivalCityCode: arrivalCityCode,
                arrivalCity: arrivalCity,
                differenceTime: "",
                adult: adultMember,
                child: childListMember,
                infant: infantMember,
                stop: 0,
                stopAllCity: '',
                tooltipData: '',
                adjustment: 0,
                domestic: true,
                flightRouteTypeId: this.flightHelper.flightRouteType[0],
                lastTicketDate: this._fareTwo(itiItem.id).lastTicketDate,
                lastTicketTime: this._fareTwo(itiItem.id).lastTicketTime,
                baggageAdult: this._pieceOrKgsAdultTwo(itiItem.id),
                baggageChild: this._pieceOrKgsChildTwo(itiItem.id),
                baggageInfant: this._pieceOrKgsInfantTwo(itiItem.id),
                cabinAdult: this._passengerCabinAdultTwo(itiItem.id),
                cabinChild: this._passengerCabinChildTwo(itiItem.id),
                cabinInfant: this._passengerCabinInfantTwo(itiItem.id),
                instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, airlineCode),
                airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, airlineCode),
                btnLoad: false,
                isAgentFare: this.isAgentFare,
                refundable: this._passengerInfoListTwo(itiItem.id)[0].passengerInfo.nonRefundable == false ? true : false,
                fareBasisCode: this._fareComponentDescsTwo(this._passengerInfoListTwo(itiItem.id)[0].passengerInfo.fareComponents[0].ref - 1).fareBasisCode,
                totalPrice: this._totalFareTwo(itiItem.id).totalPrice,
                totalDiscount: Number.parseFloat(adultDiscount.toFixed(0)) + Number.parseFloat(childDiscount.toFixed(0)) + Number.parseFloat(infantDiscount.toFixed(0)),
                markupInfo: this.markupInfo,
                discountInfo: this.discountInfo,
                clientFareTotal: this.getTotalAdultChildInfant(adultClientTotal, childClientTotal, infantClientTotal),
                agentFareTotal: this.getTotalAdultChildInfant(adultAgentTotal, childAgentTotal, infantAgentTotal),
                gdsFareTotal:
                  (parseInt(adultMember) == 0 ? 0 : adultTotal) + (parseInt(childListMember.length) == 0 ? 0 : childTotal) + (parseInt(infantMember) == 0 ? 0 : infantTotal),
                flightSegmentData: [], fareData: {}
              });

              let airlineInd = this.airlinesTwo.findIndex(x => x.code == airlineCode);
              if (airlineInd != -1) {
                this.airlinesTwo[airlineInd].len += 1;
              }
              let fInd = 0;
              let index = this.flightDataSecondLeg.findIndex(x => x.id === itiItem.id);
              let adjustAct = 0;
              for (let item of this._schedulesTwo(ref)) {
                let fref = item.ref - 1;
                let adj = 0, depAdj = 0, arrAdj = 0;
                if (item.departureDateAdjustment != undefined && item.departureDateAdjustment != '') {
                  adj = item.departureDateAdjustment;
                }
                if (this._departureTwo(fref).dateAdjustment != undefined && this._departureTwo(fref).dateAdjustment != '') {
                  depAdj = this._departureTwo(fref).dateAdjustment;
                }
                if (this._arrivalTwo(fref).dateAdjustment != undefined && this._arrivalTwo(fref).dateAdjustment != '') {
                  arrAdj = this._arrivalTwo(fref).dateAdjustment;
                }
                adjustAct += adj;
                let depAirportCode = this._departureTwo(fref).airport;
                let depAirportId = this.getAirportIdTwo(depAirportCode);
                let arrAirportCode = this._arrivalTwo(fref).airport;
                let arrAirportId = this.getAirportIdTwo(arrAirportCode);
                let airlineCode = this._airlinesCodeTwo(fref);
                let airlineId = this.getAirlineIdTwo(airlineCode);
                let fDifTime = this._timeDifferenceActualTwo(fref, fref);
                if (this.flightDataSecondLeg[index].groupAirlineCode.indexOf(airlineCode) == -1) {
                  this.flightDataSecondLeg[index].groupAirlineCode += airlineCode + ",";
                }
                this.flightDataSecondLeg[index].flightSegmentData.push({
                  airlineName: this._airlinesNameTwo(fref),
                  airlineCode: airlineCode,
                  airlineId: airlineId,
                  airlineLogo: this.getAirlineLogoTwo(this._airlinesCodeTwo(fref)),
                  airlineNumber: this._carrierTwo(fref).marketingFlightNumber,
                  availableSeat: this.getSeatsAvailabilityTwo(itiItem.id),
                  bookingCode: this._passengerInfoFareComponentsSegmentsAdultTwo(itiItem.id).bookingCode,
                  departureTime: this._timeDepartureTwo(fref),
                  arrivalTime: this._timeArrivalTwo(fref),
                  departureCity: this.getDepCityNameTwo(this._departureTwo(fref).airport),
                  arrivalCity: this.getArrCityNameTwo(this._arrivalTwo(fref).airport),
                  departureAirportCode: depAirportCode,
                  arrivalAirportCode: arrAirportCode,
                  departureAirportId: depAirportId,
                  arrivalAirportId: arrAirportId,
                  differenceTime: fDifTime,
                  layOverDifference: "",
                  terminalDeparture: this._terminalDepartureTwo(fref),
                  terminalArrival: this._terminalArrivalTwo(fref),
                  stopCount: fInd,
                  adjustment: adjustAct,
                  departureAdjustment: depAdj,
                  arrivalAdjustment: arrAdj
                });

                let fdifHour = 0;
                let fdifMinute = 0;
                if (fDifTime.indexOf('h') > -1 && fDifTime.indexOf('m') > -1) {
                  let fdifData = fDifTime.split(' ');
                  fdifHour = this.shareService.getOnlyNumber(fdifData[0]);
                  if (fdifData.length > 1) {
                    fdifMinute = parseInt(fdifData[1].toString().substring(0, fdifData[1].length - 1));
                  }
                } else if (fDifTime.indexOf('h') > -1 && fDifTime.indexOf('m') < 0) {
                  fdifHour = this.shareService.getOnlyNumber(fDifTime);
                } else if (fDifTime.indexOf('m') > -1 && fDifTime.indexOf('h') < 0) {
                  fdifMinute = this.shareService.getOnlyNumber(fDifTime);
                }
                rootHours += fdifHour;
                rootMinutes += fdifMinute;
                fInd = fInd + 1;

                this.flightDataSecondLeg[index].adjustment += adj;
              }

              if (this.flightDataSecondLeg[index].groupAirlineCode.length > 0) {
                this.flightDataSecondLeg[index].groupAirlineCode = this.flightDataSecondLeg[index].groupAirlineCode.substring(0, this.flightDataSecondLeg[index].groupAirlineCode.length - 1);
              }
              let fData = this.flightDataSecondLeg[index].flightSegmentData;
              let lenStop = fData.length;
              let stopData = "";
              if (lenStop > 2) {
                for (let item of fData) {
                  stopData += item.arrivalCity + ",";
                }
                stopData = stopData.substring(0, stopData.length - 1);
                if (stopData.length > 12) {
                  stopData = stopData.substring(0, 12) + "..";
                }
              } else {
                stopData = fData[0].arrivalCity;
              }
              this.flightDataSecondLeg[index].stop = parseInt(lenStop) > 1 ? parseInt(lenStop) - 1 : 0;
              this.flightDataSecondLeg[index].stopAllCity = stopData;
              let diff = "";
              for (let i = 0; i < this.flightDataSecondLeg[index].flightSegmentData.length; i++) {
                try {
                  let dep = this.flightDataSecondLeg[index].flightSegmentData[i + 1].departureTime;
                  let arr = this.flightDataSecondLeg[index].flightSegmentData[i].arrivalTime;

                  let Gmt = this._timeDifferenceGMT(arr, dep);
                  let Utc = this._timeDifferenceUTC(arr, dep);

                  diff = this._differenceActual(Gmt, Utc);

                  let flayHour = this.shareService.getOnlyNumber(diff);
                  let flayMinute = 0;
                  if (diff.indexOf('m') > -1 && diff.indexOf('h') > -1) {
                    let fdifData = diff.split(' ');
                    flayHour = this.shareService.getOnlyNumber(fdifData[0]);
                    flayMinute = parseInt(fdifData[1].toString().substring(0, fdifData[1].length - 1));
                  } else if (diff.indexOf('m') < 0 && diff.indexOf('h') > -1) {
                    flayHour = this.shareService.getOnlyNumber(diff);
                  } else if (diff.indexOf('m') > -1 && diff.indexOf('h') < 0) {
                    flayMinute = this.shareService.getOnlyNumber(diff);
                  }
                  rootHours += flayHour;
                  rootMinutes += flayMinute;
                } catch (exp) {
                  diff = "";
                }
                this.flightDataSecondLeg[index].flightSegmentData[i].layOverDifference = diff;
              }
              if (rootMinutes > 59) {
                let retH = rootMinutes / 60;
                rootHours += retH;
                rootMinutes = rootMinutes % 60;
              }
              if (rootMinutes > 0) {
                this.flightDataSecondLeg[index].differenceTime = parseInt(rootHours.toString()) + "h " + parseInt(rootMinutes.toString()) + "m";
              } else {
                this.flightDataSecondLeg[index].differenceTime = parseInt(rootHours.toString()) + "h";
              }

              this.flightDataSecondLeg[index].fareData = {
                markupTypeId: this.flightHelper._typeWiseIdMarkup(this.markupInfo, airlineCode),
                markupPercent:this.flightHelper._typeWiseMarkupPercent(this.markupInfo,airlineCode),
                discountTypeId: this.flightHelper._typeWiseIdDiscount(this.discountInfo, airlineCode),
                discountTypePercent:this.flightHelper._typeWiseDiscountPercent(this.discountInfo,airlineCode),
                discountType: this.flightHelper._typeOfMarkupDiscount(this.markupInfo, airlineCode),
                adultBaseGDS: parseInt(adultMember) == 0 ? 0 : adultBase,
                childBaseGDS: parseInt(childListMember.length) == 0 ? 0 : childBase,
                infantBaseGDS: parseInt(infantMember) == 0 ? 0 : infantBase,
                adultTaxGDS: parseInt(adultMember) == 0 ? 0 : adultTax,
                childTaxGDS: parseInt(childListMember.length) == 0 ? 0 : childTax,
                infantTaxGDS: parseInt(infantMember) == 0 ? 0 : infantTax,

                adultTotalGDS: parseInt(adultMember) == 0 ? 0 : adultTotal,
                childTotalGDS: parseInt(childListMember.length) == 0 ? 0 : childTotal,
                infantTotalGDS: parseInt(infantMember) == 0 ? 0 : infantTotal,

                adultBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0),
                adultTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode).toFixed(0),
                adultTotalClient: adultClientTotal,
                adultDiscount: parseFloat(adultDiscount.toFixed(0)) * parseFloat(adultMember),
                adultAgentFare: adultAgentTotal,
                childBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0),
                childTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode).toFixed(0),
                childTotalClient: childClientTotal,
                childDiscount: parseFloat(childDiscount.toFixed(0)) * parseFloat(childListMember.length),
                childAgentFare: childAgentTotal,
                infantBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0),
                infantTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode).toFixed(0),
                infantTotalClient: infantClientTotal,
                infantDiscount: parseFloat(infantDiscount.toFixed(0)) * parseFloat(infantMember),
                infantAgentFare: infantAgentTotal
              };
            }
          }
        }
        for (let item of this.airlinesTwo) {
          if (item.len != 0) {
            this.topFlightsTwo.push({
              code: item.code,
              logo: item.logo,
              name: item.name
            });
          }
        }
        // console.log("Second leg data");
        // console.log(this.flightDataSecondLeg);
        this.setTempFilterDataTwo();
        this.setStopCountTwo();
      } catch (exp) {
        this.isNotFound = true;
      }
    }
  }

  getSeatsAvailability(id: any): number {
    let ret: number = 0;
    try {
      let adult = this._passengerInfo(id, 'ADT');
      let child = this._passengerInfo(id, 'C');
      let infant = this._passengerInfo(id, 'INF');
      if (adult != undefined && adult != "") {
        adult = adult.fareComponents[0].segments[0].segment.seatsAvailable;
      } else {
        adult = 0;
      }
      if (child != undefined && child != "") {
        child = child.fareComponents[0].segments[0].segment.seatsAvailable;
      } else {
        child = 0;
      }
      if (infant != undefined && infant != "") {
        infant = infant.fareComponents[0].segments[0].segment.seatsAvailable;
      } else {
        infant = 0;
      }
      ret = parseInt(adult) + parseInt(child) + parseInt(infant);
    } catch (exp) { }
    return ret;
  }


  getSeatsAvailabilityTwo(id: any): number {
    let ret: number = 0;
    try {
      let adult = this._passengerInfoTwo(id, 'ADT');
      let child = this._passengerInfoTwo(id, 'C');
      let infant = this._passengerInfoTwo(id, 'INF');
      if (adult != undefined && adult != "") {
        adult = adult.fareComponents[0].segments[0].segment.seatsAvailable;
      } else {
        adult = 0;
      }
      if (child != undefined && child != "") {
        child = child.fareComponents[0].segments[0].segment.seatsAvailable;
      } else {
        child = 0;
      }
      if (infant != undefined && infant != "") {
        infant = infant.fareComponents[0].segments[0].segment.seatsAvailable;
      } else {
        infant = 0;
      }
      ret = parseInt(adult) + parseInt(child) + parseInt(infant);
    } catch (exp) { }
    return ret;
  }


  getTotalAdultChildInfant(adult: number, child: number, infant: number): number {
    let ret: number = 0;
    try {
      ret = adult + child + infant;
    } catch (exp) {

    }
    return ret;
  }
  getGroupByItinery(): any {
    let getMap = new Map(Object.entries(this.shareService.groupBy(this.tempFlightDataFirstLeg, x => x.groupAirlineCode)));
    return [...getMap.keys()];
  }
  getFilterItineryByGroup(groupCode: any): any {
    let getMap = new Map(Object.entries(this.shareService.groupBy(this.tempFlightDataFirstLeg, x => x.groupAirlineCode)));
    return getMap.get(groupCode);
  }
  viewMoreGroupFlight(id: any) {
    try {
      // resultSingleAllId
      if ($("#resultSingleTopTwo" + id).css("display") == "block") {
        $("#resultSingleTopTwo" + id).css("display", "none");
        $("#resultSingleAll" + id).css("display", "block");
        $("#moreFlight" + id).text("Hide More Flight");
      } else {
        $("#resultSingleAll" + id).css("display", "none");
        $("#resultSingleTopTwo" + id).css("display", "block");
        $("#moreFlight" + id).text("View More Flight");
      }
    } catch (exp) { }
  }
  getAirlineId(code: any) {
    let ret: string = "";
    try {
      let data = this.airlines.find(x => x.code.toString().toLowerCase() == code.toString().toLowerCase());
      ret = data.id;
    } catch (exp) { }

    return ret;
  }

  getAirlineIdTwo(code: any) {
    let ret: string = "";
    try {
      let data = this.airlinesTwo.find(x => x.code.toString().toLowerCase() == code.toString().toLowerCase());
      ret = data.id;
    } catch (exp) { }

    return ret;
  }

  getAircraftId(code: any) {
    let ret: string = "";
    try {
      let data = this.cmbAirCraft.find(x => x.code.toString().toLowerCase() == code.toString().toLowerCase());
      ret = data.id;
    } catch (exp) { }
    return ret;
  }

  getAircraftIdTwo(code: any) {
    let ret: string = "";
    try {
      let data = this.cmbAirCraftTwo.find(x => x.code.toString().toLowerCase() == code.toString().toLowerCase());
      ret = data.id;
    } catch (exp) { }
    return ret;
  }


  getAirportId(code: any) {
    let ret: string = "";
    try {
      let data = this.cmbAirport.find(x => x.id.toString().toLowerCase() == code.toString().toLowerCase());
      ret = data.masterId;
    } catch (exp) { }
    return ret;
  }

  getAirportIdTwo(code: any) {
    let ret: string = "";
    try {
      let data = this.cmbAirportTwo.find(x => x.id.toString().toLowerCase() == code.toString().toLowerCase());
      ret = data.masterId;
    } catch (exp) { }
    return ret;
  }


  setTempFilterData() {
    if (this.isOneway) {
      this.tempDomOneWayData = this.domOneWayData;
      this.tempDomOneWayData = this.tempDomOneWayData.slice(0, 10);
    } else {
      this.tempFlightDataFirstLeg = [];
      this.tempFlightDataFirstLeg = this.flightDataFirstLeg;
      this.summaryBarLegData.firstLegData.push(this.flightDataFirstLeg[0]);
      this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.slice(0, 10);
    }
    $("#viewMoreAction").css("display", "block");
  }

  setTempFilterDataTwo() {
    this.tempFlightDataSecondLeg = [];
    this.tempFlightDataSecondLeg = this.flightDataSecondLeg;
    this.summaryBarLegData.secondLegData.push(this.flightDataSecondLeg[0]);
    let clientFare = this.summaryBarLegData.firstLegData[0].clientFareTotal  + this.summaryBarLegData.secondLegData[0].clientFareTotal;
    if(clientFare > this.clientTotal){
      this.clientFareTotal = (clientFare - this.clientTotal) + this.DateChangeFee;
    }else{
      this.clientFareTotal = 0 + this.DateChangeFee;
    }
    this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.slice(0, 10);

    $("#viewMoreAction").css("display", "block");
  }


  viewMoreAction() {
    if (this.isOneway) {
      let store = this.domOneWayData;
      var curLen = this.domOneWayData.length - this.tempDomOneWayData.length;
      var tempLen = this.tempDomOneWayData.length;
      var orgLen = this.domOneWayData.length;
      for (let i = tempLen, j = 0; i < orgLen; i++, j++) {
        if (j == 10) {
          this.tempDomOneWayData = store.slice(0, i);
        }
        if (j < 10) {
          this.tempDomOneWayData = store.slice(0, orgLen);

        }
      }
      if (this.domOneWayData.length == this.tempDomOneWayData.length) {
        $("#viewMoreAction").css("display", "none");
      }
    } else {
      let store = this.flightDataFirstLeg;
      var curLen = this.flightDataFirstLeg.length - this.tempFlightDataFirstLeg.length;
      var tempLen = this.tempFlightDataFirstLeg.length;
      var orgLen = this.flightDataFirstLeg.length;
      for (let i = tempLen, j = 0; i < orgLen; i++, j++) {
        if (j == 10) {
          this.tempFlightDataFirstLeg = store.slice(0, i);
        }
        if (j < 10) {
          this.tempFlightDataFirstLeg = store.slice(0, orgLen);

        }
      }

      if (this.flightDataFirstLeg.length == this.tempFlightDataFirstLeg.length) {
        $("#viewMoreAction").css("display", "none");
      }
    }
  }
  viewLessAction() {
    if (this.isOneway) {
      this.tempDomOneWayData = this.domOneWayData;
      this.tempDomOneWayData.splice(0, 10);
    } else {
      this.tempFlightDataFirstLeg = this.flightDataFirstLeg;
      this.tempFlightDataFirstLeg.splice(0, 10);
      if (this.tempFlightDataFirstLeg.length < this.flightDataFirstLeg.length) {
        $("#viewMoreAction").css("display", "block");
        $("#viewLessAction").css("display", "none");
      }
    }
  }
  defaultSortHeader(type: any) {
    try {
      switch (type) {
        case 'departure':
          $("#iddDur").css("display", "none");
          $("#iduDur").css("display", "none");
          $("#iddArr").css("display", "none");
          $("#iduArr").css("display", "none");
          $("#iddPri").css("display", "none");
          $("#iduPri").css("display", "none");
          break;
        case 'duration':
          $("#iddDep").css("display", "none");
          $("#iduDep").css("display", "none");
          $("#iddArr").css("display", "none");
          $("#iduArr").css("display", "none");
          $("#iddPri").css("display", "none");
          $("#iduPri").css("display", "none");
          break;
        case 'arrival':
          $("#iddDep").css("display", "none");
          $("#iduDep").css("display", "none");
          $("#iddDur").css("display", "none");
          $("#iduDur").css("display", "none");
          $("#iddPri").css("display", "none");
          $("#iduPri").css("display", "none");
          break;
        case 'price':
          $("#iddDep").css("display", "none");
          $("#iduDep").css("display", "none");
          $("#iddDur").css("display", "none");
          $("#iduDur").css("display", "none");
          $("#iddArr").css("display", "none");
          $("#iduArr").css("display", "none");
          break;
        default:
          break;
      }
      $("#sortDeparture").text("Departure");
      $("#sortDuration").text("Duration");
      $("#sortArrival").text("Arrival");
      $("#sortPrice").text("Price");
    } catch (exp) { }
  }
  sort(data: any) {
    if (this.isOneway) {
      switch (data) {
        case "departure":
          this.defaultSortHeader('departure');
          if ($("#iduDep").css("display") == "none") {

            $("#iddDep").css("display", "none");
            $("#iduDep").css("display", "block");
            this.tempDomOneWayData = this.tempDomOneWayData.sort((a, b) => (a.departureTime > b.departureTime ? 1 : -1));
          } else {
            $("#iddDep").css("display", "block");
            $("#iduDep").css("display", "none");
            this.tempDomOneWayData = this.tempDomOneWayData.sort((a, b) => (a.departureTime > b.departureTime ? -1 : 1));
          }
          $("#sortDeparture").text("");
          break;
        case "duration":
          this.defaultSortHeader('duration');
          if ($("#iduDur").css("display") == "none") {
            $("#iddDur").css("display", "none");
            $("#iduDur").css("display", "block");
            this.tempDomOneWayData = this.tempDomOneWayData.sort((a, b) => (a.differenceTime > b.differenceTime ? 1 : -1));
          } else {
            $("#iddDur").css("display", "block");
            $("#iduDur").css("display", "none");
            this.tempDomOneWayData = this.tempDomOneWayData.sort((a, b) => (a.differenceTime > b.differenceTime ? -1 : 1));
          }
          $("#sortDuration").text("");
          break;
        case "arrival":
          this.defaultSortHeader('arrival');
          if ($("#iduArr").css("display") == "none") {
            $("#iddArr").css("display", "none");
            $("#iduArr").css("display", "block");
            this.tempDomOneWayData = this.tempDomOneWayData.sort((a, b) => (a.arrivalTime > b.arrivalTime ? 1 : -1));
          } else {
            $("#iddArr").css("display", "block");
            $("#iduArr").css("display", "none");
            this.tempDomOneWayData = this.tempDomOneWayData.sort((a, b) => (a.arrivalTime > b.arrivalTime ? -1 : 1));
          }
          $("#sortArrival").text("");
          break;
        case "price":
          this.defaultSortHeader('price');
          if ($("#iduPri").css("display") == "none") {
            $("#iddPri").css("display", "none");
            $("#iduPri").css("display", "block");
            this.tempDomOneWayData = this.tempDomOneWayData.sort((a, b) => (a.totalPrice > b.totalPrice ? 1 : -1));
          } else {
            $("#iddPri").css("display", "block");
            $("#iduPri").css("display", "none");
            this.tempDomOneWayData = this.tempDomOneWayData.sort((a, b) => (a.totalPrice > b.totalPrice ? -1 : 1));
          }
          $("#sortPrice").text("");
          break;
        default:
          break;
      }
    } else {
      switch (data) {
        case "departure":
          this.defaultSortHeader('departure');
          if ($("#iduDep").css("display") == "none") {

            $("#iddDep").css("display", "none");
            $("#iduDep").css("display", "inline");
            this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.sort((a, b) => (a.departureTime > b.departureTime ? 1 : -1));
          } else {
            $("#iddDep").css("display", "inline");
            $("#iduDep").css("display", "none");
            this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.sort((a, b) => (a.departureTime > b.departureTime ? -1 : 1));
          }
          $("#sortDeparture").text("");
          break;
        case "duration":
          this.defaultSortHeader('duration');
          if ($("#iduDur").css("display") == "none") {
            $("#iddDur").css("display", "none");
            $("#iduDur").css("display", "inline");
            this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.sort((a, b) => (a.differenceTime > b.differenceTime ? 1 : -1));
          } else {
            $("#iddDur").css("display", "inline");
            $("#iduDur").css("display", "none");
            this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.sort((a, b) => (a.differenceTime > b.differenceTime ? -1 : 1));
          }
          $("#sortDuration").text("");
          break;
        case "arrival":
          this.defaultSortHeader('arrival');
          if ($("#iduArr").css("display") == "none") {
            $("#iddArr").css("display", "none");
            $("#iduArr").css("display", "inline");
            this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.sort((a, b) => (a.arrivalTime > b.arrivalTime ? 1 : -1));
          } else {
            $("#iddArr").css("display", "inline");
            $("#iduArr").css("display", "none");
            this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.sort((a, b) => (a.arrivalTime > b.arrivalTime ? -1 : 1));
          }
          $("#sortArrival").text("");
          break;
        case "price":
          this.defaultSortHeader('price');
          if ($("#iduPri").css("display") == "none") {
            $("#iddPri").css("display", "none");
            $("#iduPri").css("display", "inline");
            this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.sort((a, b) => (a.totalPrice > b.totalPrice ? 1 : -1));
          } else {
            $("#iddPri").css("display", "inline");
            $("#iduPri").css("display", "none");
            this.tempFlightDataFirstLeg = this.tempFlightDataFirstLeg.sort((a, b) => (a.totalPrice > b.totalPrice ? -1 : 1));
          }
          $("#sortPrice").text("");
          break;
        default:
          break;
      }
    }
  }

  defaultSortHeaderTwo(type: any) {
    try {
      switch (type) {
        case 'departure':
          $("#iddDurTwo").css("display", "none");
          $("#iduDurTwo").css("display", "none");
          $("#iddArrTwo").css("display", "none");
          $("#iduArrTwo").css("display", "none");
          $("#iddPriTwo").css("display", "none");
          $("#iduPriTwo").css("display", "none");
          break;
        case 'duration':
          $("#iddDepTwo").css("display", "none");
          $("#iduDepTwo").css("display", "none");
          $("#iddArrTwo").css("display", "none");
          $("#iduArrTwo").css("display", "none");
          $("#iddPriTwo").css("display", "none");
          $("#iduPriTwo").css("display", "none");
          break;
        case 'arrival':
          $("#iddDepTwo").css("display", "none");
          $("#iduDepTwo").css("display", "none");
          $("#iddDurTwo").css("display", "none");
          $("#iduDurTwo").css("display", "none");
          $("#iddPriTwo").css("display", "none");
          $("#iduPriTwo").css("display", "none");
          break;
        case 'price':
          $("#iddDepTwo").css("display", "none");
          $("#iduDepTwo").css("display", "none");
          $("#iddDurTwo").css("display", "none");
          $("#iduDurTwo").css("display", "none");
          $("#iddArrTwo").css("display", "none");
          $("#iduArrTwo").css("display", "none");
          break;
        default:
          break;
      }
      $("#sortDepartureTwo").text("Departure");
      $("#sortDurationTwo").text("Duration");
      $("#sortArrivalTwo").text("Arrival");
      $("#sortPriceTwo").text("Price");
    } catch (exp) { }
  }

  sortTwo(data: any) {
    switch (data) {
      case "departure":
        this.defaultSortHeaderTwo('departure');
        if ($("#iduDepTwo").css("display") == "none") {

          $("#iddDepTwo").css("display", "none");
          $("#iduDepTwo").css("display", "inline");
          this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.sort((a, b) => (a.departureTime > b.departureTime ? 1 : -1));
        } else {
          $("#iddDepTwo").css("display", "inline");
          $("#iduDepTwo").css("display", "none");
          this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.sort((a, b) => (a.departureTime > b.departureTime ? -1 : 1));
        }
        $("#sortDepartureTwo").text("");
        break;
      case "duration":
        this.defaultSortHeaderTwo('duration');
        if ($("#iduDurTwo").css("display") == "none") {
          $("#iddDurTwo").css("display", "none");
          $("#iduDurTwo").css("display", "inline");
          this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.sort((a, b) => (a.differenceTime > b.differenceTime ? 1 : -1));
        } else {
          $("#iddDurTwo").css("display", "inline");
          $("#iduDurTwo").css("display", "none");
          this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.sort((a, b) => (a.differenceTime > b.differenceTime ? -1 : 1));
        }
        $("#sortDurationTwo").text("");
        break;
      case "arrival":
        this.defaultSortHeaderTwo('arrival');
        if ($("#iduArrTwo").css("display") == "none") {
          $("#iddArrTwo").css("display", "none");
          $("#iduArrTwo").css("display", "inline");
          this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.sort((a, b) => (a.arrivalTime > b.arrivalTime ? 1 : -1));
        } else {
          $("#iddArrTwo").css("display", "inline");
          $("#iduArrTwo").css("display", "none");
          this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.sort((a, b) => (a.arrivalTime > b.arrivalTime ? -1 : 1));
        }
        $("#sortArrivalTwo").text("");
        break;
      case "price":
        this.defaultSortHeaderTwo('price');
        if ($("#iduPriTwo").css("display") == "none") {
          $("#iddPriTwo").css("display", "none");
          $("#iduPriTwo").css("display", "inline");
          this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.sort((a, b) => (a.totalPrice > b.totalPrice ? 1 : -1));
        } else {
          $("#iddPriTwo").css("display", "inline");
          $("#iduPriTwo").css("display", "none");
          this.tempFlightDataSecondLeg = this.tempFlightDataSecondLeg.sort((a, b) => (a.totalPrice > b.totalPrice ? -1 : 1));
        }
        $("#sortPriceTwo").text("");
        break;
      default:
        break;

    }

  }



  filterAirlines(id: any, event: any, isFilterTop: boolean = false) {
    if (!isFilterTop) {
      if (event.target.checked) {
        if (!this.isExistAppliedFilter(this.getAirlineName(id))) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "", "",
            this.getAirlineName(id), this.getAirlineName(id), this.getCurrentFlightCode(id));
        }
      } else {
        this.removeAppliedFilterItem(this.getAirlineName(id));
      }
    }
    for (let i = 0; i < this.airlines.length; i++) {
      if (!isFilterTop) {
        var isChecked = $("#filterId" + this.airlines[i].code).is(":checked");
        if (isChecked) {
          var item = $("input[id='filterId" + this.airlines[i].code + "']:checked").val();
          if (!this.selectedAirFilterList.includes(item)) {
            this.selectedAirFilterList.push(item);
          }
        }
      }
      if (isFilterTop) {
        if (!this.selectedAirFilterList.includes(id)) {
          this.selectedAirFilterList.push(id);
        }
        $("#filterId" + id).prop("checked", true);
        if (!this.isExistAppliedFilter(this.getAirlineName(id))) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "", "",
            this.getAirlineName(id), this.getAirlineName(id), this.getCurrentFlightCode(id));
        }
      }
    }
    this.filterFlightSearch();
  }


  filterAirlinesTwo(id: any, event: any, isFilterTop: boolean = false) {
    if (!isFilterTop) {
      if (event.target.checked) {
        if (!this.isExistAppliedFilter(this.getAirlineNameTwo(id))) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "", "",
            this.getAirlineNameTwo(id), this.getAirlineNameTwo(id), this.getCurrentFlightCodeTwo(id));
        }
      } else {
        this.removeAppliedFilterItem(this.getAirlineNameTwo(id));
      }
    }
    for (let i = 0; i < this.airlinesTwo.length; i++) {
      if (!isFilterTop) {
        var isChecked = $("#filterId" + this.airlinesTwo[i].code).is(":checked");
        if (isChecked) {
          var item = $("input[id='filterId" + this.airlinesTwo[i].code + "']:checked").val();
          if (!this.selectedAirFilterList.includes(item)) {
            this.selectedAirFilterList.push(item);
          }
        }
      }
      if (isFilterTop) {
        if (!this.selectedAirFilterList.includes(id)) {
          this.selectedAirFilterList.push(id);
        }
        $("#filterId" + id).prop("checked", true);
        if (!this.isExistAppliedFilter(this.getAirlineNameTwo(id))) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "", "",
            this.getAirlineNameTwo(id), this.getAirlineNameTwo(id), this.getCurrentFlightCodeTwo(id));
        }
      }
    }
    this.filterFlightSearchTwo();
  }



  filterDepartureTime(i: any, title: any, details: any, event: any) {
    this.selectedDeptTimeList = [];
    try {
      if (event.target.checked) {
        var item = details;
        this._scheduleWidgetSelect(i, 'dept');
        let fh = item.toString().split('-')[0];
        let th = item.toString().split('-')[1];
        fh = moment(fh, ["h:mm A"]).format("HH:mm");
        th = moment(th, ["h:mm A"]).format("HH:mm");
        if (!this.isExistAppliedFilter(item, "dep_shedule")) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", title, item, fh + "-" + th);
        }
      } else {
        this.removeAppliedFilterItem(details, 'dep_shedule');
      }
      for (let item of this.departureTimeFilter) {
        let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
        var isItem = $("#scheduleDept" + i).is(":checked");
        if (isItem) {
          let fh = item.details.toString().split('-')[0];
          let th = item.details.toString().split('-')[1];
          fh = moment(fh, ["h:mm A"]).format("HH:mm");
          th = moment(th, ["h:mm A"]).format("HH:mm");
          for (let rootItem of this.flightDataFirstLeg) {
            for (let subItem of rootItem.flightSegmentData) {
              let time = subItem.departureTime;
              if (time.toString().split(':')[0] >= fh.toString().split(':')[0]
                && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                this.selectedDeptTimeList.push({ id: subItem, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
              }
            }
          }
        }
      }
      this.filterFlightSearch();
    } catch (exp) { }
  }

  filterDepartureTimeTwo(i: any, title: any, details: any, event: any) {
    // console.log(details);
    this.selectedDeptTimeList = [];
    try {
      if (event.target.checked) {
        var item = details;
        this._scheduleWidgetSelectTwo(i, 'dept');
        let fh = item.toString().split('-')[0];
        let th = item.toString().split('-')[1];
        fh = moment(fh, ["h:mm A"]).format("HH:mm");
        th = moment(th, ["h:mm A"]).format("HH:mm");
        if (!this.isExistAppliedFilter(item, "dep_sheduleTwo")) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "dep_sheduleTwo", "fa fa-arrow-right", title, item, fh + "-" + th);
        }
      } else {
        this.removeAppliedFilterItem(details, 'dep_sheduleTwo');
      }
      for (let item of this.departureTimeFilterTwo) {
        let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
        var isItem = $("#scheduleDeptTwo" + i).is(":checked");
        if (isItem) {
          let fh = item.details.toString().split('-')[0];
          let th = item.details.toString().split('-')[1];
          fh = moment(fh, ["h:mm A"]).format("HH:mm");
          th = moment(th, ["h:mm A"]).format("HH:mm");
          for (let rootItem of this.flightDataSecondLeg) {
            for (let subItem of rootItem.flightSegmentData) {
              let time = subItem.departureTime;
              if (time.toString().split(':')[0] >= fh.toString().split(':')[0]
                && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                this.selectedDeptTimeList.push({ id: subItem, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
              }
            }
          }
        }
      }
      this.filterFlightSearchTwo();
    } catch (exp) { }
  }



  filterArrivalTime(i: any, title: any, details: any, event: any) {
    this.selectedArrTimeList = [];
    try {
      if (event.target.checked) {
        var item = details;
        this._scheduleWidgetSelect(i, 'arr');
        let fh = item.toString().split('-')[0];
        let th = item.toString().split('-')[1];
        fh = moment(fh, ["h:mm A"]).format("HH:mm");
        th = moment(th, ["h:mm A"]).format("HH:mm");
        if (!this.isExistAppliedFilter(item, "ret_shedule")) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", title, item, fh + "-" + th);
        }
      } else {
        this.removeAppliedFilterItem(details, 'ret_shedule');
      }
      for (let item of this.arrivalTimeFilter) {
        let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
        var isItem = $("#scheduleArr" + i).is(":checked");
        if (isItem) {
          let fh = item.details.toString().split('-')[0];
          let th = item.details.toString().split('-')[1];
          fh = moment(fh, ["h:mm A"]).format("HH:mm");
          th = moment(th, ["h:mm A"]).format("HH:mm");
          for (let rootItem of this.flightDataFirstLeg) {
            for (let subItem of rootItem.flightSegmentData) {
              let time = subItem.arrivalTime;
              if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                this.selectedArrTimeList.push({ id: subItem, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
              }
            }
          }
        }
      }
      this.filterFlightSearch();
    } catch (exp) { }
  }

  filterArrivalTimeTwo(i: any, title: any, details: any, event: any) {
    // console.log("details :  " + details);
    this.selectedArrTimeList = [];
    try {
      if (event.target.checked) {
        var item = details;
        this._scheduleWidgetSelectTwo(i, 'arr');
        let fh = item.toString().split('-')[0];
        let th = item.toString().split('-')[1];
        fh = moment(fh, ["h:mm A"]).format("HH:mm");
        th = moment(th, ["h:mm A"]).format("HH:mm");
        if (!this.isExistAppliedFilter(item, "ret_sheduleTwo")) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "ret_sheduleTwo", "fa fa-arrow-left", title, item, fh + "-" + th);
        }
      } else {
        this.removeAppliedFilterItem(details, 'ret_sheduleTwo');
      }
      for (let item of this.arrivalTimeFilterTwo) {
        let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
        var isItem = $("#scheduleArrTwo" + i).is(":checked");
        if (isItem) {
          let fh = item.details.toString().split('-')[0];
          let th = item.details.toString().split('-')[1];
          fh = moment(fh, ["h:mm A"]).format("HH:mm");
          th = moment(th, ["h:mm A"]).format("HH:mm");
          for (let rootItem of this.flightDataSecondLeg) {
            for (let subItem of rootItem.flightSegmentData) {
              let time = subItem.arrivalTime;
              if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                this.selectedArrTimeList.push({ id: subItem, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
              }
            }
          }
        }
      }
      this.filterFlightSearchTwo();
    } catch (exp) { }
  }


  _scheduleWidgetSelect(i: number, cap: string) {
    $('#' + cap + 'ScheduleBox' + i).css("background-color", this.flightHelper.scheduleWidgetSelectColor);
    $('#' + cap + 'TitleId' + i).css("color", this.flightHelper.scheduleWidgetSelectTitleColor);
    $('#' + cap + 'PriceId' + i).css("color", this.flightHelper.scheduleWidgetSelectPriceColor);
  }

  _scheduleWidgetSelectTwo(i: number, cap: string) {
    $('#' + cap + 'ScheduleBoxTwo' + i).css("background-color", this.flightHelper.scheduleWidgetSelectColor);
    $('#' + cap + 'TitleIdTwo' + i).css("color", this.flightHelper.scheduleWidgetSelectTitleColor);
    $('#' + cap + 'PriceIdTwo' + i).css("color", this.flightHelper.scheduleWidgetSelectPriceColor);
  }


  _scheduleWidgetDeSelect(i: number, cap: string) {
    $('#' + cap + 'ScheduleBox' + i).css("background-color", this.flightHelper.scheduleWidgetDeSelectColor);
    $('#' + cap + 'TitleId' + i).css("color", this.flightHelper.scheduleWidgetDeSelectTitleColor);
    $('#' + cap + 'PriceId' + i).css("color", this.flightHelper.scheduleWidgetDeSelectPriceColor);
  }

  _scheduleWidgetDeSelectTwo(i: number, cap: string) {
    $('#' + cap + 'ScheduleBoxTwo' + i).css("background-color", this.flightHelper.scheduleWidgetDeSelectColor);
    $('#' + cap + 'TitleIdTwo' + i).css("color", this.flightHelper.scheduleWidgetDeSelectTitleColor);
    $('#' + cap + 'PriceIdTwo' + i).css("color", this.flightHelper.scheduleWidgetDeSelectPriceColor);
  }

  addAppliedFilterItem(cancel_class: string, schedule_class: string, arrow_class: string, title: string, value: string, origin: string) {
    this.appliedFilter.push({ cancel_class: cancel_class, schedule_class: schedule_class, arrow_class: arrow_class, title: title, value: value, origin: origin });
  }
  removeAppliedFilterItem(id: any, type: any = "") {

    // console.log(this.appliedFilter);
    // console.log(this.stopCountListTwo);
    // console.log("remove applied" + id + type)

    if (type == undefined || type == "") {
      this.appliedFilter = this.appliedFilter.filter(x => x.value.toString().trim().toLowerCase() != id.toString().trim().toLowerCase());
    } else {
      let findInd = this.appliedFilter.findIndex(x => x.value.toString().trim().toLowerCase() == id.toString().trim().toLowerCase() &&
        x.schedule_class.toString().trim().toLowerCase() == type.toString().trim().toLowerCase());
      this.appliedFilter.splice(findInd, 1);
    }
    //Unchecked Stop Count
    for (let item of this.stopCountList) {
      if (item.id === id) {
        $("#stopId" + item.id).prop("checked", false);
        $("#popularFilterId" + id).prop("checked", false);
      }
    }

    //Unchecked Stop Count Two
    for (let item of this.stopCountListTwo) {
      if (item.idTwo == id) {
        $("#stopIdTwo" + item.id).prop("checked", false);
        $("#popularFilterId" + id).prop("checked", false);
      }
    }
    //

    //Unchecked Refundable
    if (id === "Refundable") {
      $("#chkRefundYes").prop("checked", false);
      $("#popularFilterId" + id).prop("checked", false);
    }
    if (id === "NonRefundable") {
      $("#chkRefundNo").prop("checked", false);
    }

    // Unchecked Refundable Two
    if (id === "RefundableTwo") {
      $("#chkRefundYesTwo").prop("checked", false);
      $("#popularFilterId" + id).prop("checked", false);
    }
    if (id === "NonRefundableTwo") {
      $("#chkRefundNoTwo").prop("checked", false);
    }


    //Deselect departure panel
    if (type.toString().trim() == "dep_shedule") {
      for (let item of this.departureTimeFilter) {
        if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
          $("#popularFilterId" + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
          this._scheduleWidgetDeSelect((item.title.replaceAll('-', '')).replaceAll(' ', ''), 'dept');
          this.selectedDeptTimeList = this.selectedDeptTimeList.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
            != id.toString().replaceAll(" ", "").trim().toLowerCase());
        }
      }
    }

    // Deselect departure panel two
    if (type.toString().trim() == "dep_sheduleTwo") {
      for (let item of this.departureTimeFilterTwo) {
        if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
          $("#popularFilterId" + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
          this._scheduleWidgetDeSelectTwo((item.title.replaceAll('-', '')).replaceAll(' ', ''), 'dept');
          this.selectedDeptTimeList = this.selectedDeptTimeList.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
            != id.toString().replaceAll(" ", "").trim().toLowerCase());
        }
      }
    }


    //Deselect arrival panel
    if (type.toString().trim() == "ret_shedule") {
      for (let item of this.arrivalTimeFilter) {
        let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
        if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
          this._scheduleWidgetDeSelect(i, 'arr');
          this.selectedArrTimeList = this.selectedArrTimeList.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
            != id.toString().replaceAll(" ", "").trim().toLowerCase());
        }
      }
    }

    //Deselect arrival panel Two
    if (type.toString().trim() == "ret_sheduleTwo") {
      for (let item of this.arrivalTimeFilterTwo) {
        let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
        if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
          this._scheduleWidgetDeSelectTwo(i, 'arr');
          this.selectedArrTimeList = this.selectedArrTimeList.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
            != id.toString().replaceAll(" ", "").trim().toLowerCase());
        }
      }
    }


    //Unchecked airline
    for (let i = 0; i < this.airlines.length; i++) {
      let item = this.getAirlineName(this.airlines[i].code);
      if (item.toString().toLowerCase() == id.toString().toLowerCase()) {
        $("#filterId" + this.airlines[i].code).prop("checked", false);
        this.selectedAirFilterList = this.shareService.removeList(this.airlines[i].code, this.selectedAirFilterList);
      }
    }
    this.filterFlightSearch();
    this.filterFlightSearchTwo();
  }
  popularFilterItem(item: any, event: any) {
    try {
      if (event.target.checked) {
        switch (item.origin) {
          case "refundable":
            this.refundFilterList = [];
            if (!this.isExistAppliedFilter(item.id)) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0");
            }
            this.refundFilterList.push(true);
            $("#chkRefundYes").prop("checked", true);
            $("#chkRefundNo").prop("checked", false);
            this.removeAppliedFilterItem("NonRefundable");
            break;
          case "stop":
            $("#stopId" + item.id).prop("checked", true);
            if (!this.isExistAppliedFilter(item.id)) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "", "", item.title, item.id, item.id);
            }
            break;
          case "departure":
            $("#scheduleDept" + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
            let i = (item.value.replaceAll('-', '')).replaceAll(' ', '');
            this._scheduleWidgetSelect(i, 'dept');
            if (!this.isExistAppliedFilter(item.id)) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", item.value, item.details, "departure");
            }
            break;
          case "arrival":
            $("#scheduleArr" + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
            let j = (item.value.replaceAll('-', '')).replaceAll(' ', '');
            this._scheduleWidgetSelect(j, 'arr');
            if (!this.isExistAppliedFilter(item.id)) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", item.value, item.details, "arrival");
            }
            break;
          default:
            break;
        }
      } else {
        switch (item.origin) {
          case "refundable":
            this.removeAppliedFilterItem(item.id);
            $("#chkRefundYes").prop("checked", false);
            break;
          case "stop":
            this.removeAppliedFilterItem(item.id);
            $("#stopId" + item.id).prop("checked", false);
            break;
          case "departure":

            this.removeAppliedFilterItem(item.details, "dep_shedule");
            $("#scheduleDept" + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
            let i = (item.value.replaceAll('-', '')).replaceAll(' ', '');
            this._scheduleWidgetDeSelect(i, 'dept');
            break;
          case "arrival":
            this.removeAppliedFilterItem(item.details, "ret_shedule");
            $("#scheduleArr" + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
            let j = (item.value.replaceAll('-', '')).replaceAll(' ', '');
            this._scheduleWidgetDeSelect(j, 'arr');
            break;
          default:
            break;
        }
      }
      this.filterFlightSearch();
    } catch (exp) { }
  }
  chkAlterBeforeAfter(type: string): string {
    let ret: string = type;
    if (type.indexOf("before") > -1) {
      ret = "12AM-06AM".toLowerCase();
    } else if (type.indexOf("after") > -1) {
      ret = "06PM-12AM".toLowerCase();
    }
    return ret;
  }
  removeAllAppliedFilterItem() {
    this.setTempFilterData();
    this.setTempFilterDataTwo();

    this.appliedFilter = [];
    this.selectedDeptTimeList = [];
    this.selectedArrTimeList = [];
    this.selectedAirFilterList = [];
    $("#chkRefundYes").prop("checked", false);
    $("#chkRefundNo").prop("checked", false);

    $("#chkRefundYesTwo").prop("checked", false);
    $("#chkRefundNoTwo").prop("checked", false);

    for (let item of this.stopCountList) {
      $("#stopId" + item.id).prop("checked", false);
    }

    for (let item of this.stopCountListTwo) {
      $("#stopIdTwo" + item.id).prop("checked", false);
    }

    for (let item of this.airlines) {
      $("#filterId" + item.code).prop("checked", false);
    }

    for (let item of this.departureTimeFilter) {
      let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
      this._scheduleWidgetDeSelect(i, 'dept');
    }
    for (let item of this.arrivalTimeFilter) {
      let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
      this._scheduleWidgetDeSelect(i, 'arr');
    }

    for (let item of this.departureTimeFilterTwo) {
      let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
      this._scheduleWidgetDeSelectTwo(i, 'dept');
    }
    for (let item of this.arrivalTimeFilterTwo) {
      let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
      this._scheduleWidgetDeSelectTwo(i, 'arr');
    }


    for (let item of this.popularFilter) {
      $("#popularFilterId" + (item.id.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
    }
  }
  filterRefund(type: string, event: any) {
    // console.log(this.arrivalTimeFilter);

    this.refundFilterList = [];
    try {
      if (type == "Yes") {
        if (event.target.checked) {
          if (!this.isExistAppliedFilter("Refundable")) {
            this.addAppliedFilterItem("fa fa-times-circle-o", "", "", `Refundable - ${this.selectedAirportFromCode} to ${this.selectedAirportToCode}`, "Refundable", "0");
            this.refundFilterList.push(true);
            $("#chkRefundNo").prop("checked", false);
            this.removeAppliedFilterItem("NonRefundable");
          }
        } else {
          this.removeAppliedFilterItem("Refundable");
        }
      }
      if (type == "No") {
        if (event.target.checked) {
          if (!this.isExistAppliedFilter("NonRefundable")) {
            this.addAppliedFilterItem("fa fa-times-circle-o", "", "", `NonRefundable - ${this.selectedAirportFromCode} to ${this.selectedAirportToCode}`, "NonRefundable", "1");
            this.refundFilterList.push(false);
            $("#chkRefundYes").prop("checked", false);
            this.removeAppliedFilterItem("Refundable");
          }
        } else {
          this.removeAppliedFilterItem("NonRefundable");
        }
      }
      this.filterFlightSearch();
    } catch (exp) { }
  }


  filterRefundTwo(type: string, event: any) {
    this.refundFilterList = [];
    try {
      if (type == "Yes") {
        if (event.target.checked) {
          if (!this.isExistAppliedFilter("RefundableTwo")) {
            this.addAppliedFilterItem("fa fa-times-circle-o", "", "", `Refundable - ${this.selectedAirportToCode} to ${this.selectedAirportFromCode}`, "RefundableTwo", "0");
            this.refundFilterList.push(true);
            $("#chkRefundNoTwo").prop("checked", false);
            this.removeAppliedFilterItem("NonRefundableTwo");
          }
        } else {
          this.removeAppliedFilterItem("RefundableTwo");
        }
      }
      if (type == "No") {
        if (event.target.checked) {
          if (!this.isExistAppliedFilter("NonRefundableTwo")) {
            this.addAppliedFilterItem("fa fa-times-circle-o", "", "", `NonRefundable - ${this.selectedAirportToCode} to ${this.selectedAirportFromCode}`, "NonRefundableTwo", "1");
            this.refundFilterList.push(false);
            $("#chkRefundYesTwo").prop("checked", false);
            this.removeAppliedFilterItem("RefundableTwo");
          }
        } else {
          this.removeAppliedFilterItem("NonRefundableTwo");
        }
      }
      this.filterFlightSearch();
    } catch (exp) { }
  }



  isExistAppliedFilter(id: any, type: any = ""): boolean {
    let isExist: boolean = false;
    try {
      for (let item of this.appliedFilter) {
        if (type != "" && type != undefined) {
          if (item.title == id && item.schedule_class == type) {
            isExist = true;
          }
        } else {
          if (item.title == id) {
            isExist = true;
          }
        }
      }
    } catch (exp) { }
    return isExist;
  }
  changeWayPrice() {
    if (this.isOneway) {
      this.tempDomOneWayData = this.domOneWayData;
    } else {
      this.tempFlightDataFirstLeg = this.flightDataFirstLeg;
    }
    let min: number, max: number, id: number, dif: number = 0;
    let updatedMax: number = 0;
    min = Number.parseFloat(this._minimumRange());
    max = Number.parseFloat(this._maximumRange());
    id = $("#changeWayPriceID").val();
    dif = min + (((max - min) / 100) * id);
    this.udMinRangeVal = Number.parseInt(dif.toFixed(0));
    updatedMax = this.udMinRangeVal;
    this.appliedFilter.forEach((item, index) => {
      if (item.origin.toString() == "range") this.appliedFilter.splice(index, 1);
    });
    if (min != this.udMinRangeVal) {
      this.addAppliedFilterItem("fa fa-times-circle-o", "", "", min + "-" + this.udMinRangeVal, min + "-" + this.udMinRangeVal,
        "range");
    }
    this.filterFlightSearch();
  }
  stopWiseFilter(item: any, itemTitle: any, event: any) {
    if (event.target.checked) {
      if (!this.isExistAppliedFilter(item)) {
        this.addAppliedFilterItem("fa fa-times-circle-o", "", "", itemTitle, item, item);
      }
    } else {
      this.removeAppliedFilterItem(item);
    }
    this.filterFlightSearch();
  }

  stopWiseFilterTwo(item: any, itemTitle: any, event: any) {
    if (event.target.checked) {
      if (!this.isExistAppliedFilter(item)) {
        this.addAppliedFilterItem("fa fa-times-circle-o", "", "", itemTitle, item, item);
      }
    } else {
      this.removeAppliedFilterItem(item);
    }
    this.filterFlightSearchTwo();
  }



  flightShowHideAction(id: any) {
    if ($("#flightDetailsWrap" + id).css('display') == 'block') {
      $("#flightDetailsShowHide" + id).text("View Flight Details");
      $("#flightDetailsWrap" + id).hide('slow');
    } else {
      $("#flightDetailsWrap" + id).show('slow');
      $("#flightDetailsShowHide" + id).text("Hide Flight Details");

      $("#fareDetailsShowHide" + id).text("View Fare Details");
      $("#fareDetailsWrap" + id).hide('slow');
    }
  }

  flightShowHideActionTwo(id: any) {
    if ($("#flightDetailsWrapTwo" + id).css('display') == 'block') {
      $("#flightDetailsShowHideTwo" + id).text("View Flight Details");
      $("#flightDetailsWrapTwo" + id).hide('slow');
    } else {
      $("#flightDetailsWrapTwo" + id).show('slow');
      $("#flightDetailsShowHideTwo" + id).text("Hide Flight Details");

      $("#fareDetailsShowHideTwo" + id).text("View Fare Details");
      $("#fareDetailsWrapTwo" + id).hide('slow');
    }
  }

  fareShowHideAction(id: any) {
    if ($("#fareDetailsWrap" + id).css('display') == 'block') {
      $("#fareDetailsShowHide" + id).text("View Fare Details");
      $("#fareDetailsWrap" + id).hide('slow');
    } else {
      $("#fareDetailsWrap" + id).show('slow');
      $("#fareDetailsShowHide" + id).text("Hide Fare Details");

      $("#flightDetailsShowHide" + id).text("View Flight Details");
      $("#flightDetailsWrap" + id).hide('slow');
    }


  }

  fareShowHideActionTwo(id: any) {
    if ($("#fareDetailsWrapTwo" + id).css('display') == 'block') {
      $("#fareDetailsShowHideTwo" + id).text("View Fare Details");
      $("#fareDetailsWrapTwo" + id).hide('slow');
    } else {
      $("#fareDetailsWrapTwo" + id).show('slow');
      $("#fareDetailsShowHideTwo" + id).text("Hide Fare Details");

      $("#flightDetailsShowHideTwo" + id).text("View Flight Details");
      $("#flightDetailsWrapTwo" + id).hide('slow');
    }


  }




  showFareDetailsMobile(ind: any) {
    this.fareDetailsModalData = [];
    try {
      if (this.isOneway) {
        this.fareDetailsModalData = this.domOneWayData.find(x => x.id == ind);
      } else {
        this.fareDetailsModalData = this.flightDataFirstLeg.find(x => x.id.toString().trim().toLowerCase() === ind.toString().trim().toLowerCase());
      }
      $('#fareDetailsModal').modal('show');
    } catch (exp) { }
  }
  showFlightDetailsMobile(ind: any) {
    this.flightDetailsModalData = [];
    try {
      if (this.isOneway) {
        var data = this.domOneWayData.find(x => x.id == ind);
        this.flightDetailsModalData.push({
          flightData: [],
          fromFlight: this.fromFlight,
          toFlight: this.toFlight,
          depDay: "",
          depMonthNameShort: "",
          depDayNameShort: "",
          departureDate: data.departureDate,
          baggageAdult: data.baggageAdult,
          baggageChild: data.baggageChild,
          baggageInfant: data.baggageInfant,
          cabinAdult: data.cabinAdult,
          cabinChild: data.cabinChild,
          cabinInfant: data.cabinInfant
        });
        this.flightDetailsModalData[0].flightData.push(data.flightSegmentData);
      } else {
        var data = this.flightDataFirstLeg.find(x => x.id.toString().trim().toLowerCase() === ind.toString().trim().toLowerCase());
        this.flightDetailsModalData.push({
          flightDataFirstLeg: [],
          fromFlight: this.fromFlight,
          toFlight: this.toFlight,
          depDay: "",
          depMonthNameShort: "",
          depDayNameShort: "",
          departureDate: data.departureDate,
          baggageAdult: data.baggageAdult,
          baggageChild: data.baggageChild,
          baggageInfant: data.baggageInfant,
          cabinAdult: data.cabinAdult,
          cabinChild: data.cabinChild,
          cabinInfant: data.cabinInfant
        });
        this.flightDetailsModalData[0].flightDataFirstLeg.push(data.flightDataFirstLeg);
      }
      $('#flightDetailsModal').modal('show');
    } catch (exp) {

    }
  }
  makeProposalDataSet(ind: any) {
    if (this.isOneway) {
      try {
        this.makeProposalData = this.domOneWayData.find(x => x.id === ind);
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
      } catch (exp) {
      }
    } else {
      try {
        this.makeProposalData = this.flightDataFirstLeg.find(x => x.id === ind);
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
      } catch (exp) {
      }
    }
  }
  getCurrentFlightCode(id: any): string {
    let ret: string = id;
    try {
      for (let i = 0; i < this.rootData.scheduleDescs.length; i++) {
        let marketing = this.rootData.scheduleDescs[i].carrier.marketing;
        let disclosure = this.rootData.scheduleDescs[i].carrier.disclosure;
        if ((disclosure != undefined && disclosure == id) || (marketing != undefined && marketing == id)) {
          ret = marketing;
          break;
        }
      }
    } catch (exp) { }
    return ret;
  }

  getCurrentFlightCodeTwo(id: any): string {
    let ret: string = id;
    try {
      for (let i = 0; i < this.rootDataTwo.scheduleDescs.length; i++) {
        let marketing = this.rootData.scheduleDescs[i].carrier.marketing;
        let disclosure = this.rootData.scheduleDescs[i].carrier.disclosure;
        if ((disclosure != undefined && disclosure == id) || (marketing != undefined && marketing == id)) {
          ret = marketing;
          break;
        }
      }
    } catch (exp) { }
    return ret;
  }

  _minimumRange(): string {
    let ret: string = "";
    if (this.isOneway) {
      try {
        let updatePrice = this.domOneWayData[0].clientFareTotal;
        for (let i = 1; i < this.domOneWayData.length; i++) {
          let price = this.domOneWayData[i].clientFareTotal;
          if (Number.parseFloat(price) < Number.parseFloat(updatePrice)) {
            updatePrice = price;
          }
        }
        ret = updatePrice;
      } catch (exp) { }
    } else {
      try {
        let updatePrice = this.flightDataFirstLeg[0].clientFareTotal;
        for (let i = 1; i < this.flightDataFirstLeg.length; i++) {
          let price = this.flightDataFirstLeg[i].clientFareTotal;
          if (Number.parseFloat(price) < Number.parseFloat(updatePrice)) {
            updatePrice = price;
          }
        }
        ret = updatePrice;
      } catch (exp) { }
    }
    return ret;
  }

  _minimumRangeTwo(): string {
    let ret: string = "";
    try {
      let updatePrice = this.flightDataSecondLeg[0].clientFareTotal;
      for (let i = 1; i < this.flightDataSecondLeg.length; i++) {
        let price = this.flightDataSecondLeg[i].clientFareTotal;
        if (Number.parseFloat(price) < Number.parseFloat(updatePrice)) {
          updatePrice = price;
        }
      }
      ret = updatePrice;
    } catch (exp) { }
    return ret;
  }

  _maximumRange(): string {
    let ret: string = "";
    if (this.isOneway) {
      try {
        let updatePrice = this.domOneWayData[0].clientFareTotal;
        for (let i = 1; i < this.domOneWayData.length; i++) {
          let price = this.domOneWayData[i].clientFareTotal;
          if (Number.parseFloat(price) > Number.parseFloat(updatePrice)) {
            updatePrice = price;
          }
        }
        ret = updatePrice;
      } catch (exp) { }
    } else {
      try {
        let updatePrice = this.flightDataFirstLeg[0].clientFareTotal;
        for (let i = 1; i < this.flightDataFirstLeg.length; i++) {
          let price = this.flightDataFirstLeg[i].clientFareTotal;
          if (Number.parseFloat(price) > Number.parseFloat(updatePrice)) {
            updatePrice = price;
          }
        }
        ret = updatePrice;
      } catch (exp) { }
    }
    return ret;
  }

  _groupedDayMonthYear(data: any): string {
    let ret: string = "";
    try {
      ret = this.shareService.getDayNameShort(data.departureDate) + ", " +
        this.shareService.getMonthShort(data.departureDate) + " " +
        this.shareService.getDay(data.departureDate) + ", " +
        this.shareService.getYearLong(data.departureDate);

    } catch (exp) { }
    return ret;
  }
  _isFareDate(data: any): boolean {
    let ret: boolean = false;
    try {
      ;
      let fareD = this.shareService.getDay(data.departureDate);
      let selecD = this.shareService.getDay(this.selectedDepartureDate);
      if (parseInt(fareD) == parseInt(selecD)) {
        ret = true;
      }
    } catch (exp) { }
    return ret;
  }
  _groupedTotalFare(ind: any): any {
    var data = "";
    try {
      data = this._groupedFare(ind).totalFare;
    } catch (exp) { }
    return data;
  }
  _groupedFare(ind: any): any {
    var data = "";
    try {
      data = this._groupedPricingInfo(ind)[0].fare;
    } catch (exp) { }
    return data;
  }
  _groupedPricingInfo(ind: any): any {
    var data = "";
    try {
      data = this._groupedItineraries(ind).pricingInformation;
    } catch (exp) { }
    return data;
  }
  _groupedItineraries(ind: any): any {
    var data = "";
    try {
      data = this.itineraryGroups[ind].itineraries[0];

    } catch (exp) { }
    return data;
  }
  _groupedLegDescriptions(ind: any): any {
    var data = "";
    try {
      data = this._groupDescription(ind).legDescriptions;
    } catch (exp) { }
    return data;
  }
  _groupDescription(ind: any): any {
    var data = "";
    try {
      data = this.itineraryGroups[ind].groupDescription;

    } catch (exp) { }
    return data;
  }
  _dateAdjustment(data: any): number {
    let ret: number = 0;
    try {
      if (data.dateAdjustment != undefined && data.dateAdjustment != "") {
        ret = parseInt(data.dateAdjustment);
      }
    } catch (exp) { }
    return ret;
  }
  _timeArrival(ind: any, type: string = ""): string {
    let ret: string = "";
    try {
      let data = this._arrival(ind).time;
      data = data.toString().split(':')[0] + ':' + data.toString().split(':')[1];
      if (data != undefined && data != "") {
        ret = data;
      }
    } catch (exp) { }
    return ret;
  }

  //
  _timeArrivalTwo(ind: any, type: string = ""): string {
    let ret: string = "";
    try {
      let data = this._arrivalTwo(ind).time;
      data = data.toString().split(':')[0] + ':' + data.toString().split(':')[1];
      if (data != undefined && data != "") {
        ret = data;
      }
    } catch (exp) { }
    return ret;
  }
  //

  _timeArrivalUTC(ind: any, type: string = ""): string {
    let ret: string = "";
    try {
      let data = this._arrival(ind).time;
      let hour = data.toString().split(':')[2].substring(2);
      let min = data.toString().split(':')[3];
      data = hour + ':' + min;
      if (data != undefined && data != "") {
        ret = data;
      }
    } catch (exp) { }
    return ret;
  }
  _timeDifference(ind: any): string {
    let ret: string = "";

    try {
      let arr = this._timeArrival(ind);
      let dep = this._timeDeparture(ind);
      ret = this._difference(dep, arr);
    } catch (exp) { }
    return ret;
  }
  _timeDifferenceActual(depInd: any, arrInd: any): string {
    let ret: string = "";

    try {
      let arrGMT = this._timeArrival(depInd);
      let depGMT = this._timeDeparture(arrInd);
      let arrUTC = this._timeArrivalUTC(arrInd);
      let depUTC = this._timeDepartureUTC(depInd);

      let gmt = this._timeDifferenceGMT(depGMT, arrGMT);
      let utc = this._timeDifferenceUTC(depUTC, arrUTC);
      ret = this._differenceActual(gmt, utc);
    } catch (exp) { }
    return ret;
  }

  _timeDifferenceActualTwo(depInd: any, arrInd: any): string {
    let ret: string = "";

    try {
      let arrGMT = this._timeArrivalTwo(depInd);
      let depGMT = this._timeDepartureTwo(arrInd);
      let arrUTC = this._timeArrivalUTC(arrInd);
      let depUTC = this._timeDepartureUTC(depInd);

      let gmt = this._timeDifferenceGMT(depGMT, arrGMT);
      let utc = this._timeDifferenceUTC(depUTC, arrUTC);
      ret = this._differenceActual(gmt, utc);
    } catch (exp) { }
    return ret;
  }




  _differenceActual(gmt: any, utc: any): any {
    let ret: string = "";
    try {
      let fromHour = parseInt(gmt.split(':')[0]);
      let fromMin = parseInt(gmt.split(':')[1]);
      let toHour = parseInt(utc.split(':')[0]);
      let toMin = parseInt(utc.split(':')[1]);
      let dif = this.shareService.getAddedTime(fromHour, fromMin, toHour, toMin);
      let hour = dif.toString().split(':')[0];
      let min = dif.toString().split(':')[1];

      hour = parseInt(hour.toString());
      min = parseInt(min.toString());
      if (parseInt(hour) > 0 && parseInt(min) > 0) {
        ret = hour + "h " + min + "m";
      } else if (parseInt(hour) > 0 && parseInt(min) <= 0) {
        ret = hour + "h";
      } else if (parseInt(hour) <= 0 && parseInt(min) > 0) {
        ret = min + "m";
      }
    } catch (exp) { }
    return ret;
  }
  _timeDifferenceGMT(dep: any, arr: any): string {
    let ret: string = "";
    try {
      let fromHour = parseInt(dep.split(':')[0]);
      let fromMin = parseInt(dep.split(':')[1]);
      let toHour = parseInt(arr.split(':')[0]);
      let toMin = parseInt(arr.split(':')[1]);
      ret = this.flightHelper.getFlightDifferenceGMT(fromHour, fromMin, toHour, toMin);
    } catch (exp) { }
    return ret;
  }
  _timeDifferenceUTC(dep: any, arr: any): string {
    let ret: string = "";
    try {
      let fromExpr = dep.substring(0, 1);
      let toExpr = arr.substring(0, 1);
      dep = dep.substring(1);
      arr = arr.substring(1);
      let fromHour = parseInt(dep.split(':')[0]);
      let fromMin = parseInt(dep.split(':')[1]);
      let toHour = parseInt(arr.split(':')[0]);
      let toMin = parseInt(arr.split(':')[1]);
      ret = this.flightHelper.getFlightDifferenceUTC(fromHour, fromMin, fromExpr, toHour, toMin, toExpr);
    } catch (exp) { }
    return ret;
  }

  _difference(dep: any, arr: any): string {
    let ret: string = "";
    try {
      let dif = this.shareService.getTimeDifference(dep, arr);
      let hour = dif.toString().split(':')[0];
      let min = dif.toString().split(':')[1];
      if (parseInt(hour) > 0 && parseInt(min) > 0) {
        ret = hour + "h " + min + "m";
      } else if (parseInt(hour) > 0 && parseInt(min) <= 0) {
        ret = hour + "h";
      } else if (parseInt(hour) <= 0 && parseInt(min) > 0) {
        ret = min + "m";
      }
    } catch (exp) { }
    return ret;
  }
  _terminalArrival(ind: any): string {
    let ret: string = "";
    try {
      let data = this._arrival(ind).terminal;
      if (data != undefined && data != "") {
        ret = "Terminal " + data;
      }
    } catch (exp) { }
    return ret;
  }

  _terminalArrivalTwo(ind: any): string {
    let ret: string = "";
    try {
      let data = this._arrivalTwo(ind).terminal;
      if (data != undefined && data != "") {
        ret = "Terminal " + data;
      }
    } catch (exp) { }
    return ret;
  }

  _timeDeparture(ind: any): string {
    let ret: string = "";
    try {
      let data = this._departure(ind).time;
      data = data.toString().split(':')[0] + ':' + data.toString().split(':')[1];
      if (data != undefined && data != "") {
        ret = data;
      }
    } catch (exp) { }
    return ret;
  }

  //
  _timeDepartureTwo(ind: any): string {
    let ret: string = "";
    try {
      let data = this._departureTwo(ind).time;
      data = data.toString().split(':')[0] + ':' + data.toString().split(':')[1];
      if (data != undefined && data != "") {
        ret = data;
      }
    } catch (exp) { }
    return ret;
  }
  //


  _timeDepartureUTC(ind: any): string {
    let ret: string = "";
    try {
      let data = this._departure(ind).time;
      let hour = data.toString().split(':')[2].substring(2);
      let min = data.toString().split(':')[3];
      data = hour + ':' + min;
      if (data != undefined && data != "") {
        ret = data;
      }
    } catch (exp) { }
    return ret;
  }
  _terminalDeparture(ind: any): string {
    let ret: string = "";
    try {
      let data = this._departure(ind).terminal;
      if (data != undefined && data != "") {
        ret = "Terminal " + data;
      }
    } catch (exp) { }
    return ret;
  }


  _terminalDepartureTwo(ind: any): string {
    let ret: string = "";
    try {
      let data = this._departureTwo(ind).terminal;
      if (data != undefined && data != "") {
        ret = "Terminal " + data;
      }
    } catch (exp) { }
    return ret;
  }

  _departure(ind: any): any {
    var data = "";
    try {
      data = this._scheduleDescs(ind).departure;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _departureTwo(ind: any): any {
    var data = "";
    try {
      data = this._scheduleDescsTwo(ind).departure;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _arrival(ind: any): any {
    var data = "";
    try {
      data = this._scheduleDescs(ind).arrival;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  //
  _arrivalTwo(ind: any): any {
    var data = "";
    try {
      data = this._scheduleDescsTwo(ind).arrival;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  //
  _airlinesName(ind: any): string {
    let ret: string = "";
    try {
      let flightCode = this._carrier(ind).marketing;
      ret = this.getAirlineName(flightCode);
      if (ret == "") {
        ret = this.getAirlineName(this._carrier(ind).disclosure);
      }
    } catch (exp) { }
    return ret;
  }

  //
  _airlinesNameTwo(ind: any): string {
    let ret: string = "";
    try {
      let flightCode = this._carrierTwo(ind).marketing;
      ret = this.getAirlineNameTwo(flightCode);
      if (ret == "") {
        ret = this.getAirlineNameTwo(this._carrierTwo(ind).disclosure);
      }
    } catch (exp) { }
    return ret;
  }
  //


  _airlinesCode(ind: any): string {
    let ret: string = "";
    try {
      let flightCode = this._carrier(ind).marketing;
      ret = this.getAirlineName(flightCode);
      if (ret == "") {
        ret = this._carrier(ind).disclosure;
      } else {
        ret = this._carrier(ind).marketing;

      }
    } catch (exp) { }
    return ret;
  }

  //
  _airlinesCodeTwo(ind: any): string {
    let ret: string = "";
    try {
      let flightCode = this._carrierTwo(ind).marketing;
      ret = this.getAirlineNameTwo(flightCode);
      if (ret == "") {
        ret = this._carrierTwo(ind).disclosure;
      } else {
        ret = this._carrierTwo(ind).marketing;

      }
    } catch (exp) { }
    return ret;
  }
  //


  _equipment(ind: any): any {
    var data = "";
    try {
      data = this._carrier(ind).equipment;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _equipmentTwo(ind: any): any {
    var data = "";
    try {
      data = this._carrierTwo(ind).equipment;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _carrier(ind: any): any {
    var data = "";
    try {
      data = this._scheduleDescs(ind).carrier;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _carrierTwo(ind: any): any {
    var data = "";
    try {
      data = this._scheduleDescsTwo(ind).carrier;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoCabinWeight(type: any) {
    let data = "";
    try {
      switch (type.toLowerCase()) {
        case "c":
          data = "9Kgs";
          break;
        default:
          data = "7Kgs";
          break;
      }
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoCabinWeightTwo(type: any) {
    let data = "";
    try {
      switch (type.toLowerCase()) {
        case "c":
          data = "9Kgs";
          break;
        default:
          data = "7Kgs";
          break;
      }
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerCabinAdult(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoCabinWeight(this._fareComponentAdult(ind).cabinCode);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerCabinAdultTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoCabinWeightTwo(this._fareComponentAdultTwo(ind).cabinCode);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerCabinChild(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoCabinWeight(this._fareComponentChild(ind).cabinCode);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerCabinChildTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoCabinWeightTwo(this._fareComponentChildTwo(ind).cabinCode);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerCabinInfant(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoCabinWeight(this._fareComponentInfant(ind).cabinCode);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerCabinInfantTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoCabinWeightTwo(this._fareComponentInfantTwo(ind).cabinCode);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerInfoFareComponentsSegmentsAdult(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoFareComponentsAdult(ind)[0].segments[0].segment;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerInfoFareComponentsSegmentsAdultTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoFareComponentsAdultTwo(ind)[0].segments[0].segment;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoFareComponentsSegmentsChild(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoFareComponentsChild(ind)[0].segments[0].segment;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  _passengerInfoFareComponentsSegmentsInfant(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoFareComponentsInfant(ind)[0].segments[0].segment;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  _fareComponentDescs(ind: any): any {
    var data = "";
    try {
      data = this.rootData.fareComponentDescs[ind];
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _fareComponentDescsTwo(ind: any): any {
    var data = "";
    try {
      data = this.rootDataTwo.fareComponentDescs[ind];
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _fareComponentAdult(ind: any): any {
    var data = "";
    try {
      let ref = this._passengerInfoFareComponentsAdult(ind)[this._passengerInfoAdult(ind).fareComponents.length - 1].ref - 1;
      data = this._fareComponentDescs(ref);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _fareComponentAdultTwo(ind: any): any {
    var data = "";
    try {
      let ref = this._passengerInfoFareComponentsAdultTwo(ind)[this._passengerInfoAdultTwo(ind).fareComponents.length - 1].ref - 1;
      data = this._fareComponentDescsTwo(ref);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _fareComponentChild(ind: any): any {
    var data = "";
    try {
      let ref = this._passengerInfoFareComponentsChild(ind)[this._passengerInfoChild(ind).fareComponents.length - 1].ref - 1;
      data = this._fareComponentDescs(ref);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _fareComponentChildTwo(ind: any): any {
    var data = "";
    try {
      let ref = this._passengerInfoFareComponentsChildTwo(ind)[this._passengerInfoChildTwo(ind).fareComponents.length - 1].ref - 1;
      data = this._fareComponentDescsTwo(ref);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }



  _fareComponentInfant(ind: any): any {
    var data = "";
    try {
      let ref = this._passengerInfoFareComponentsInfant(ind)[this._passengerInfoInfant(ind).fareComponents.length - 1].ref - 1;
      data = this._fareComponentDescs(ref);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _fareComponentInfantTwo(ind: any): any {
    var data = "";
    try {
      let ref = this._passengerInfoFareComponentsInfantTwo(ind)[this._passengerInfoInfantTwo(ind).fareComponents.length - 1].ref - 1;
      data = this._fareComponentDescsTwo(ref);
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _pieceOrKgsAdult(ind: any): string {
    var data = "";
    try {
      data = this._passengerInfoBaggageAdult(ind).pieceCount;
      if (data == undefined) {
        data = this._passengerInfoBaggageAdult(ind).weight + " " + this._passengerInfoBaggageAdult(ind).unit;
      } else {
        data = data + " pcs";
      }
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _pieceOrKgsAdultTwo(ind: any): string {
    var data = "";
    try {
      data = this._passengerInfoBaggageAdultTwo(ind).pieceCount;
      if (data == undefined) {
        data = this._passengerInfoBaggageAdultTwo(ind).weight + " " + this._passengerInfoBaggageAdultTwo(ind).unit;
      } else {
        data = data + " pcs";
      }
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }




  _pieceOrKgsChild(ind: any): string {
    var data = "";
    try {
      data = this._passengerInfoBaggageChild(ind).pieceCount;
      if (data == undefined) {
        data = this._passengerInfoBaggageChild(ind).weight + " " + this._passengerInfoBaggageChild(ind).unit;
      } else {
        data = data + " pcs";
      }
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _pieceOrKgsChildTwo(ind: any): string {
    var data = "";
    try {
      data = this._passengerInfoBaggageChildTwo(ind).pieceCount;
      if (data == undefined) {
        data = this._passengerInfoBaggageChildTwo(ind).weight + " " + this._passengerInfoBaggageChildTwo(ind).unit;
      } else {
        data = data + " pcs";
      }
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _pieceOrKgsInfant(ind: any): string {
    var data = "";
    try {
      data = this._passengerInfoBaggageInfant(ind).pieceCount;
      if (data == undefined) {
        data = this._passengerInfoBaggageInfant(ind).weight + " " + this._passengerInfoBaggageInfant(ind).unit;
      } else {
        data = data + " pcs";
      }
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _pieceOrKgsInfantTwo(ind: any): string {
    var data = "";
    try {
      data = this._passengerInfoBaggageInfantTwo(ind).pieceCount;
      if (data == undefined) {
        data = this._passengerInfoBaggageInfantTwo(ind).weight + " " + this._passengerInfoBaggageInfantTwo(ind).unit;
      } else {
        data = data + " pcs";
      }
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerInfoBaggageAdult(ind: any): any {
    var data = "";
    try {
      data = this._baggageAllowanceDescs(this._passengerInfoAdult(ind).baggageInformation[0].allowance.ref);
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoBaggageAdultTwo(ind: any): any {
    var data = "";
    try {
      data = this._baggageAllowanceDescsTwo(this._passengerInfoAdultTwo(ind).baggageInformation[0].allowance.ref);
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerInfoBaggageChild(ind: any): any {
    var data = "";
    try {
      data = this._baggageAllowanceDescs(this._passengerInfoChild(ind).baggageInformation[0].allowance.ref);
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoBaggageChildTwo(ind: any): any {
    var data = "";
    try {
      data = this._baggageAllowanceDescsTwo(this._passengerInfoChildTwo(ind).baggageInformation[0].allowance.ref);
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerInfoBaggageInfant(ind: any): any {
    var data = "";
    try {
      data = this._baggageAllowanceDescs(this._passengerInfoInfant(ind).baggageInformation[0].allowance.ref);
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoBaggageInfantTwo(ind: any): any {
    var data = "";
    try {
      data = this._baggageAllowanceDescsTwo(this._passengerInfoInfantTwo(ind).baggageInformation[0].allowance.ref);
      if (data.indexOf("undefined") > -1) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _baggageAllowanceDescs(ind: any): any {
    var data = "";
    try {
      data = this.rootData.baggageAllowanceDescs[ind - 1];
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _baggageAllowanceDescsTwo(ind: any): any {
    var data = "";
    try {
      data = this.rootDataTwo.baggageAllowanceDescs[ind - 1];
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoFareComponentsAdult(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoAdult(ind).fareComponents;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoFareComponentsAdultTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoAdultTwo(ind).fareComponents;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoFareComponentsChild(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoChild(ind).fareComponents;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoFareComponentsChildTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoChildTwo(ind).fareComponents;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoFareComponentsInfant(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoInfant(ind).fareComponents;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoFareComponentsInfantTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoInfantTwo(ind).fareComponents;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerTotalFare(ind: any): number {
    let ret = 0;
    try {
      let a = this._passengerInfoTotalFareAdult(ind).totalPrice;
      let c = this._passengerInfoTotalFareChild(ind).totalPrice;
      let i = this._passengerInfoTotalFareInfant(ind).totalPrice;
      a = (a != undefined && a != "") ? a : 0;
      c = (c != undefined && c != "") ? c : 0;
      i = (i != undefined && i != "") ? i : 0;
      ret = Number.parseInt(a) + Number.parseInt(c) + Number.parseInt(i);
    } catch (exp) { }
    return ret;
  }
  _passengerInfoTotalFareAdult(ind: any): any {
    var data = "0";
    try {
      data = this._passengerInfoAdult(ind).passengerTotalFare;
      if (data == undefined) {
        return "0";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoTotalFareAdultTwo(ind: any): any {
    var data = "0";
    try {
      data = this._passengerInfoAdultTwo(ind).passengerTotalFare;
      if (data == undefined) {
        return "0";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoTotalFareChild(ind: any): any {
    var data = "0";
    try {
      data = this._passengerInfoChild(ind).passengerTotalFare;
      if (data == undefined) {
        return "0";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoTotalFareChildTwo(ind: any): any {
    var data = "0";
    try {
      data = this._passengerInfoChildTwo(ind).passengerTotalFare;
      if (data == undefined) {
        return "0";
      }
    } catch (exp) { }
    return data;
  }


  _passengerInfoTotalFareInfant(ind: any): any {
    var data = "0";
    try {
      data = this._passengerInfoInfant(ind).passengerTotalFare;
      if (data == undefined) {
        return "0";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoTotalFareInfantTwo(ind: any): any {
    var data = "0";
    try {
      data = this._passengerInfoInfantTwo(ind).passengerTotalFare;
      if (data == undefined) {
        return "0";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoAdult(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfo(ind, 'ADT');
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoAdultTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoTwo(ind, 'ADT');
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerInfoChild(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfo(ind, 'C');
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoChildTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoTwo(ind, 'C');
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoInfant(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfo(ind, 'INF');
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoInfantTwo(ind: any): any {
    var data = "";
    try {
      data = this._passengerInfoTwo(ind, 'INF');
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _passengerInfo(ind: any, type: any): any {
    var data = "";
    try {
      let i = 0;
      for (let item of this._passengerInfoList(ind)) {
        if (item.passengerInfo.passengerType.toString().indexOf(type) > -1) {
          data = item.passengerInfo;
        }
        i += 1;
      }
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoTwo(ind: any, type: any): any {
    var data = "";
    try {
      let i = 0;
      for (let item of this._passengerInfoListTwo(ind)) {
        if (item.passengerInfo.passengerType.toString().indexOf(type) > -1) {
          data = item.passengerInfo;
        }
        i += 1;
      }
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _totalFare(ind: any): any {
    var data = "";
    try {
      data = this._fare(ind).totalFare;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _totalFareTwo(ind: any): any {
    var data = "";
    try {
      data = this._fareTwo(ind).totalFare;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoList(ind: any): any {
    var data = "";
    try {
      data = this._fare(ind).passengerInfoList;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _passengerInfoListTwo(ind: any): any {
    var data = "";
    try {
      data = this._fareTwo(ind).passengerInfoList;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _fare(ind: any): any {
    var data = "";
    try {
      data = this._pricingInfo(ind)[0].fare;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _fareTwo(ind: any): any {
    var data = "";
    try {
      data = this._pricingInfoTwo(ind)[0].fare;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  _scheduleDescs(ind: any): any {
    var data = "";
    try {
      data = this.rootData.scheduleDescs[ind];
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _scheduleDescsTwo(ind: any): any {
    var data = "";
    try {
      data = this.rootDataTwo.scheduleDescs[ind];
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  _schedules(ind: any): any {
    var data = "";
    try {
      data = this._legDescs(ind).schedules;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  _legDescs(ind: any): any {
    var data = "";
    try {
      data = this.rootData.legDescs[ind];
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  //
  _schedulesTwo(ind: any): any {
    var data = "";
    try {
      data = this._legDescsTwo(ind).schedules;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  _legDescsTwo(ind: any): any {
    var data = "";
    try {
      data = this.rootDataTwo.legDescs[ind];
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  //



  _itineryLegs(ind: any): any {
    var data = "";
    try {
      data = this.itineraries[ind].legs;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  _pricingInfo(ind: any): any {
    var data = "";
    try {
      for (let rootItem of this.rootData.itineraryGroups) {
        if (rootItem.groupDescription.legDescriptions[0].arrivalLocation == this.selectedAirportToCode) {
          for (let item of rootItem.itineraries) {
            if (item.id === ind) {
              data = item.pricingInformation;
              break;
            }
          }
        }
        if (data != undefined && data != "") {
          break;
        }
      }
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }

  _pricingInfoTwo(ind: any): any {
    var data = "";
    try {
      for (let rootItem of this.rootDataTwo.itineraryGroups) {
        if (rootItem.groupDescription.legDescriptions[0].arrivalLocation == this.selectedAirportFromCode) {
          for (let item of rootItem.itineraries) {
            if (item.id === ind) {
              data = item.pricingInformation;
              break;
            }
          }
        }
        if (data != undefined && data != "") {
          break;
        }
      }
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }


  //getMinimumPriceForTime('departure',6,12,'AM')
  getMinimumPriceForTime(type: string, from: number, to: number, ap: any): number {
    let ret: number = 0;
    let retArr: number[] = [], min: number = 0;
    try {
      for (let rootItem of this.rootData.itineraryGroups) {
        if (rootItem.groupDescription.legDescriptions[0].arrivalLocation == this.selectedAirportToCode) {
          for (let item of rootItem.itineraries) {
            for (let scheduleItem of this._schedules(item.legs[0].ref - 1)) {
              let time = "";
              if (type == 'departure') {
                time = this._scheduleDescs(scheduleItem.ref - 1).departure.time;
              }
              if (type == 'arrival') {
                time = this._scheduleDescs(scheduleItem.ref - 1).arrival.time;
              }
              let hh = time.toString().trim().split(':')[0];
              let mm = time.toString().trim().split(':')[1];
              let a_p = this.shareService.getAmPm(hh, mm);
              let hours = a_p.toString().trim().split(':')[0];
              if (a_p.toString().indexOf(ap) > -1 && ap == 'AM') {
                if (from == 1 && to == 6) {
                  if (Number.parseInt(hours.toString().trim()) == 12 || (Number.parseInt(hours.toString().trim()) >= 1 && Number.parseInt(hours.toString().trim()) < 6)) {
                    retArr.push(this.flightDataFirstLeg.find(x => x.id == item.id).clientFareTotal);
                  }
                }
                if (from == 6 && to == 12) {
                  if (Number.parseInt(hours.toString().trim()) >= 6 && Number.parseInt(hours.toString().trim()) < 12) {
                    retArr.push(this.flightDataFirstLeg.find(x => x.id == item.id).clientFareTotal);
                  }
                }
              }
              if (a_p.toString().indexOf(ap) > -1 && ap == 'PM') {
                if (from == 1 && to == 6) {
                  if (Number.parseInt(hours.toString().trim()) == 12 || (Number.parseInt(hours.toString().trim()) >= 1 && Number.parseInt(hours.toString().trim()) < 6)) {
                    retArr.push(this.flightDataFirstLeg.find(x => x.id == item.id).clientFareTotal);
                  }
                }
                if (from == 6 && to == 12) {
                  if (Number.parseInt(hours.toString().trim()) >= 6 && Number.parseInt(hours.toString().trim()) < 12) {
                    retArr.push(this.flightDataFirstLeg.find(x => x.id == item.id).clientFareTotal);
                  }
                }
              }
            }
          }
        }
      }
      ret = this.shareService.getMinimum(retArr);
    } catch (exp) { }
    return ret;
  }

  getMinimumPriceForTimeTwo(type: string, from: number, to: number, ap: any): number {
    let ret: number = 0;
    let retArr: number[] = [], min: number = 0;
    try {
      // console.log("Data::");
      // console.log(this.rootDataTwo);
      for (let rootItem of this.rootDataTwo.itineraryGroups) {
        if (rootItem.groupDescription.legDescriptions[0].arrivalLocation == this.selectedAirportFromCode) {
          for (let item of rootItem.itineraries) {
            // console.log("Item ::");
            // console.log(item);
            for (let scheduleItem of this._schedulesTwo(item.legs[0].ref - 1)) {
              let time = "";
              if (type == 'departure') {
                time = this._scheduleDescsTwo(scheduleItem.ref - 1).departure.time;
              }
              if (type == 'arrival') {
                time = this._scheduleDescsTwo(scheduleItem.ref - 1).arrival.time;
              }
              let hh = time.toString().trim().split(':')[0];
              let mm = time.toString().trim().split(':')[1];
              let a_p = this.shareService.getAmPm(hh, mm);
              let hours = a_p.toString().trim().split(':')[0];
              if (a_p.toString().indexOf(ap) > -1 && ap == 'AM') {
                if (from == 1 && to == 6) {
                  if (Number.parseInt(hours.toString().trim()) == 12 || (Number.parseInt(hours.toString().trim()) >= 1 && Number.parseInt(hours.toString().trim()) < 6)) {
                    retArr.push(this.flightDataSecondLeg.find(x => x.id == item.id).clientFareTotal);
                  }
                }
                if (from == 6 && to == 12) {
                  if (Number.parseInt(hours.toString().trim()) >= 6 && Number.parseInt(hours.toString().trim()) < 12) {
                    retArr.push(this.flightDataSecondLeg.find(x => x.id == item.id).clientFareTotal);
                  }
                }
              }
              if (a_p.toString().indexOf(ap) > -1 && ap == 'PM') {
                if (from == 1 && to == 6) {
                  if (Number.parseInt(hours.toString().trim()) == 12 || (Number.parseInt(hours.toString().trim()) >= 1 && Number.parseInt(hours.toString().trim()) < 6)) {
                    retArr.push(this.flightDataSecondLeg.find(x => x.id == item.id).clientFareTotal);
                  }
                }
                if (from == 6 && to == 12) {
                  if (Number.parseInt(hours.toString().trim()) >= 6 && Number.parseInt(hours.toString().trim()) < 12) {
                    retArr.push(this.flightDataSecondLeg.find(x => x.id == item.id).clientFareTotal);
                  }
                }
              }
            }
          }
        }
      }
      ret = this.shareService.getMinimum(retArr);
    } catch (exp) { }

    return ret;
  }





  setDepartureTimeFilter(type: string, a_p: any, hours: any, time: any) {
    try {
      if (a_p.toString().indexOf('AM') > -1) {
        let before6: number = this.getMinimumPriceForTime(type, 1, 6, 'AM');
        let am6: number = this.getMinimumPriceForTime(type, 6, 12, 'AM');

        if (this.departureTimeFilter.find(x => x.title == "Before 06AM") == undefined && before6 > 0) {
          this.departureTimeFilter.push({
            title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM",
            price: before6, logo: '../../../assets/dist/img/sun.svg'
          });

          if (this.popularFilter.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
            this.popularFilter.push({
              id: "12AM-06AM", title: "Morning Departure", value: "Before 06AM", len: "",
              details: "12:00 AM-05:59 AM", price: before6, origin: "departure"
            });
          }
        }
        if (this.departureTimeFilter.find(x => x.title == "06AM - 12PM") == undefined && am6 > 0) {
          this.departureTimeFilter.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
        }
      }
      if (a_p.toString().indexOf('PM') > -1) {
        let after12pm = this.getMinimumPriceForTime(type, 1, 6, 'PM');
        let after6 = this.getMinimumPriceForTime(type, 6, 12, 'PM');
        if (this.departureTimeFilter.find(x => x.title == "12PM - 06PM") == undefined && after12pm > 0) {
          this.departureTimeFilter.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
        }
        if (this.departureTimeFilter.find(x => x.title == "After 06PM") == undefined && after6 > 0) {
          this.departureTimeFilter.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
        }
      }

    } catch (exp) { }
  }

  setDepartureTimeFilterTwo(type: string, a_p: any, hours: any, time: any) {
    try {
      if (a_p.toString().indexOf('AM') > -1) {
        let before6: number = this.getMinimumPriceForTimeTwo(type, 1, 6, 'AM');
        let am6: number = this.getMinimumPriceForTimeTwo(type, 6, 12, 'AM');

        if (this.departureTimeFilterTwo.find(x => x.title == "Before 06AM") == undefined && before6 > 0) {
          this.departureTimeFilterTwo.push({
            title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM",
            price: before6, logo: '../../../assets/dist/img/sun.svg'
          });

          if (this.popularFilter.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
            this.popularFilter.push({
              id: "12AM-06AM", title: "Morning Departure", value: "Before 06AM", len: "",
              details: "12:00 AM-05:59 AM", price: before6, origin: "departure"
            });
          }
        }
        if (this.departureTimeFilterTwo.find(x => x.title == "06AM - 12PM") == undefined && am6 > 0) {
          this.departureTimeFilterTwo.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
        }
      }
      if (a_p.toString().indexOf('PM') > -1) {
        let after12pm = this.getMinimumPriceForTimeTwo(type, 1, 6, 'PM');
        let after6 = this.getMinimumPriceForTimeTwo(type, 6, 12, 'PM');
        if (this.departureTimeFilterTwo.find(x => x.title == "12PM - 06PM") == undefined && after12pm > 0) {
          this.departureTimeFilterTwo.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
        }
        if (this.departureTimeFilterTwo.find(x => x.title == "After 06PM") == undefined && after6 > 0) {
          this.departureTimeFilterTwo.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
        }
      }

      // console.log("dep time fitler two");
      // console.log(this.departureTimeFilterTwo);

    } catch (exp) { }
  }


  setArrivalTimeFilter(type: string, a_p: any, hours: any, time: any) {
    try {
      if (a_p.toString().indexOf('AM') > -1) {
        let before6 = this.getMinimumPriceForTime(type, 1, 6, 'AM');
        let am6 = this.getMinimumPriceForTime(type, 6, 12, 'AM');
        if (this.arrivalTimeFilter.find(x => x.title == "Before 06AM") == undefined && before6 > 0) {
          this.arrivalTimeFilter.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
        }
        if (this.arrivalTimeFilter.find(x => x.title == "06AM - 12PM") == undefined && am6 > 0) {
          this.arrivalTimeFilter.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
        }
      }
      if (a_p.toString().indexOf('PM') > -1) {
        let after12pm = this.getMinimumPriceForTime(type, 1, 6, 'PM');
        let after6 = this.getMinimumPriceForTime(type, 6, 12, 'PM');
        if (this.arrivalTimeFilter.find(x => x.title == "12PM - 06PM") == undefined && after12pm > 0) {
          this.arrivalTimeFilter.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
        }
        if (this.arrivalTimeFilter.find(x => x.title == "After 06PM") == undefined && after6 > 0) {
          this.arrivalTimeFilter.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
        }
      }
    } catch (exp) { }
  }

  setArrivalTimeFilterTwo(type: string, a_p: any, hours: any, time: any) {
    try {
      if (a_p.toString().indexOf('AM') > -1) {
        let before6 = this.getMinimumPriceForTimeTwo(type, 1, 6, 'AM');
        let am6 = this.getMinimumPriceForTimeTwo(type, 6, 12, 'AM');
        if (this.arrivalTimeFilterTwo.find(x => x.title == "Before 06AM") == undefined && before6 > 0) {
          this.arrivalTimeFilterTwo.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
        }
        if (this.arrivalTimeFilterTwo.find(x => x.title == "06AM - 12PM") == undefined && am6 > 0) {
          this.arrivalTimeFilterTwo.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
        }
      }
      if (a_p.toString().indexOf('PM') > -1) {
        let after12pm = this.getMinimumPriceForTimeTwo(type, 1, 6, 'PM');
        let after6 = this.getMinimumPriceForTimeTwo(type, 6, 12, 'PM');
        if (this.arrivalTimeFilterTwo.find(x => x.title == "12PM - 06PM") == undefined && after12pm > 0) {
          this.arrivalTimeFilterTwo.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
        }
        if (this.arrivalTimeFilterTwo.find(x => x.title == "After 06PM") == undefined && after6 > 0) {
          this.arrivalTimeFilterTwo.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
        }
      }
    } catch (exp) { }
  }


  isEmpty(data: any) {
    let ret: boolean = true;
    if (data != "" && data != undefined) {
      ret = false;
    }
    return ret;
  }
  setHeadSearchPanel(fromCountry: string, toCountry: string,
    fromAirport: string, toAirport: string, fromFlightName: string,
    toFlightName: string, fromFlightCode: string, toFlightCode: string) {
    try {
      $("#fromFlightCityName").text(fromFlightName + ', ' + fromCountry);
      $("#fromFlightCityDetails").text(fromFlightCode + ', ' + fromAirport);
      $("#toFlightCityName").text(toFlightName + ', ' + toCountry);
      $("#toFlightCityDetails").text(toFlightCode + ', ' + toAirport);
    } catch (exp) { }
  }
  setTimeFilter(type: string) {
    try {
      for (let rootItem of this.flightDataFirstLeg) {
        for (let item of rootItem.flightSegmentData) {
          let time = "";
          if (type == 'departure') {
            time = item.departureTime;
          }
          if (type == 'arrival') {
            time = item.arrivalTime;
          }
          let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
          let hours = a_p.toString().trim().split(':')[0];
          if (type == 'arrival') {
            this.setArrivalTimeFilter(type, a_p, hours, time);
          }
          if (type == 'departure') {
            this.setDepartureTimeFilter(type, a_p, hours, time);
          }
        }
      }
    } catch (exp) { }
  }

  setTimeFilterTwo(type: string) {
    try {
      for (let rootItem of this.flightDataSecondLeg) {
        for (let item of rootItem.flightSegmentData) {
          let time = "";
          if (type == 'departure') {
            time = item.departureTime;
          }
          if (type == 'arrival') {
            time = item.arrivalTime;
          }
          let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
          let hours = a_p.toString().trim().split(':')[0];
          if (type == 'arrival') {
            this.setArrivalTimeFilterTwo(type, a_p, hours, time);
          }
          if (type == 'departure') {
            this.setDepartureTimeFilterTwo(type, a_p, hours, time);
          }
        }
      }
    } catch (exp) { }
  }


  setStopCount() {
    this.stopCountList = [];
    try {
      let stopList: any[] = [];
      // console.log("first leg");
      // console.log(this.flightDataFirstLeg);
      if (this.isOneway) {
        for (let rootItem of this.domOneWayData) {
          let price = rootItem.clientFareTotal;
          let len = rootItem.flightSegmentData.length;
          stopList.push({ id: len, price: price });
        }
      } else {
        for (let rootItem of this.flightDataFirstLeg) {
          let price = rootItem.clientFareTotal;
          let len = rootItem.flightSegmentData.length;
          stopList.push({ id: len, price: price });
        }
      }

      let stopGroup = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
      for (let item of stopGroup) {
        let min = item.value[0].price;
        let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
        this.stopCountList.push({
          id: item.key, stopCount: item.value.length, title: title,
          price: 0
        });
        for (let subItem of item.value) {
          if (min > subItem.price) {
            min = subItem.price;
          }
        }
        this.stopCountList.find(x => x.id == item.key).price = min;
        if (item.key == 2) {
          if (this.popularFilter.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
            this.popularFilter.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
          }
        }
      }
      let minPriceRef = this.getMinumumPricePopularFilterRefundable(true);
      let countRef = this.getTotalPopularFilterRefundable(true);
      if (this.popularFilter.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
        this.popularFilter.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef + ")", price: minPriceRef, origin: "refundable" });
      }
      this.setTimeFilter('departure');
      this.setTimeFilter('arrival');


    } catch (exp) { }
  }


  setStopCountTwo() {
    this.stopCountListTwo = [];
    try {
      let stopList: any[] = [];


      for (let rootItem of this.flightDataSecondLeg) {
        let price = rootItem.clientFareTotal;
        let len = rootItem.flightSegmentData.length;
        stopList.push({ id: len, price: price });
      }
      let stopGroup = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
      for (let item of stopGroup) {
        let min = item.value[0].price;
        let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
        this.stopCountListTwo.push({
          id: item.key, stopCount: item.value.length, title: title,
          price: 0, idTwo: 11
        });
        for (let subItem of item.value) {
          if (min > subItem.price) {
            min = subItem.price;
          }
        }
        this.stopCountListTwo.find(x => x.id == item.key).price = min;
        if (item.key == 2) {
          if (this.popularFilter.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
            this.popularFilter.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
          }
        }
      }
      let minPriceRef = this.getMinumumPricePopularFilterRefundable(true);
      let countRef = this.getTotalPopularFilterRefundable(true);
      if (this.popularFilter.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
        this.popularFilter.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef + ")", price: minPriceRef, origin: "refundable" });
      }
      this.setTimeFilterTwo('departure');
      this.setTimeFilterTwo('arrival');


    } catch (exp) { }
  }

  getMinumumPricePopularFilterRefundable(type: boolean): any {
    let ret: number = 0;
    if (this.isOneway) {
      try {
        let data = this.domOneWayData.filter(function (i, j) {
          return i.refundable == type;
        });
        let min = data[0].clientFareTotal;
        for (let item of data) {
          if (min > item.clientFareTotal) {
            min = item.clientFareTotal;
          }
        }
        ret = min;
      } catch (exp) { }
    } else {
      try {
        let data = this.flightDataFirstLeg.filter(function (i, j) {
          return i.refundable == type;
        });
        let min = data[0].clientFareTotal;
        for (let item of data) {
          if (min > item.clientFareTotal) {
            min = item.clientFareTotal;
          }
        }
        ret = min;
      } catch (exp) { }
    }
    return ret;
  }

  getTotalPopularFilterRefundable(type: boolean): any {
    let ret: number = 0;
    if (this.isOneway) {
      try {
        let data = this.domOneWayData.filter(function (i, j) {
          return i.refundable == type;
        });
        for (let item of data) {
          ret += 1;
        }
      } catch (exp) { }
    } else {
      try {
        let data = this.flightDataFirstLeg.filter(function (i, j) {
          return i.refundable == type;
        });
        for (let item of data) {
          ret += 1;
        }
      } catch (exp) { }
    }
    return ret;
  }


  private setAirport(searchedAirport: any) {
    if (this.isOneway) {
      this.topFlightSearchSkeleton = true;
      setTimeout(() => {
        this.airports = { departure: [], arrival: [] };
        let depAirport: string[] = [], arrAirport: string[] = [];
        this.cmbAirport = this.flightHelper.getAirportData();
        for (let j = 0; j < searchedAirport.length; j++) {
          if (!depAirport.includes(searchedAirport[j].departure.airport)) {
            depAirport.push(searchedAirport[j].departure.airport);
          }
          if (!arrAirport.includes(searchedAirport[j].arrival.airport)) {
            arrAirport.push(searchedAirport[j].arrival.airport);
          }
        }
        for (let i = 0; i < this.cmbAirport.length; i++) {
          if (depAirport.includes(this.cmbAirport[i].code)) {
            this.airports.departure.unshift({
              depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
              depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
            });
          }
        }
        for (let i = 0; i < this.cmbAirport.length; i++) {
          if (arrAirport.includes(this.cmbAirport[i].code)) {
            this.airports.arrival.unshift({
              arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
              arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
            });
          }
        }
        this.topFlightSearchSkeleton = false;
        this.setFlightData();
      }, 500);
    } else {
      // console.log("searched airport")
      // console.log(searchedAirport);
      // console.log("airport");
      this.topFlightSearchSkeletonLeft = true;
      this.topFlightSearchSkeletonRight = true;
      setTimeout(() => {
        this.airports = { departure: [], arrival: [] };
        let depAirport: string[] = [], arrAirport: string[] = [];
        this.cmbAirport = this.flightHelper.getAirportData();
        for (let j = 0; j < searchedAirport.length; j++) {
          if (!depAirport.includes(searchedAirport[j].departure.airport)) {
            depAirport.push(searchedAirport[j].departure.airport);
          }
          if (!arrAirport.includes(searchedAirport[j].arrival.airport)) {
            arrAirport.push(searchedAirport[j].arrival.airport);
          }
        }
        for (let i = 0; i < this.cmbAirport.length; i++) {
          if (depAirport.includes(this.cmbAirport[i].code)) {
            this.airports.departure.unshift({
              depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
              depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
            });
          }
        }
        for (let i = 0; i < this.cmbAirport.length; i++) {
          if (arrAirport.includes(this.cmbAirport[i].code)) {
            this.airports.arrival.unshift({
              arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
              arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
            });
          }
        }
        this.topFlightSearchSkeletonLeft = false;
        this.topFlightSearchSkeletonRight = false;
        this.setFlightData();
      }, 500);
    }
  }

  // schedule desc two
  private setAirportTwo(searchedAirport: any) {
    // console.log("searched airport")
    // console.log(searchedAirport);
    // console.log("airport From Set airport Two");
    if (this.isOneway == false) {
      this.topFlightSearchSkeletonLeft = true;
      this.topFlightSearchSkeletonRight = true;
      setTimeout(() => {
        this.airportsTwo = { departure: [], arrival: [] };
        let depAirport: string[] = [], arrAirport: string[] = [];
        this.cmbAirportTwo = this.flightHelper.getAirportData();
        for (let j = 0; j < searchedAirport.length; j++) {
          if (!depAirport.includes(searchedAirport[j].departure.airport)) {
            depAirport.push(searchedAirport[j].departure.airport);
          }
          if (!arrAirport.includes(searchedAirport[j].arrival.airport)) {
            arrAirport.push(searchedAirport[j].arrival.airport);
          }
        }
        for (let i = 0; i < this.cmbAirportTwo.length; i++) {
          if (depAirport.includes(this.cmbAirportTwo[i].code)) {
            this.airportsTwo.departure.unshift({
              depCode: this.cmbAirportTwo[i].code, depName: this.cmbAirportTwo[i].text,
              depCityName: this.cmbAirportTwo[i].cityname, depCountryName: this.cmbAirportTwo[i].countryname
            });
          }
        }
        for (let i = 0; i < this.cmbAirportTwo.length; i++) {
          if (arrAirport.includes(this.cmbAirportTwo[i].code)) {
            this.airportsTwo.arrival.unshift({
              arrCode: this.cmbAirportTwo[i].code, arrName: this.cmbAirportTwo[i].text,
              arrCityName: this.cmbAirportTwo[i].cityname, arrCountryName: this.cmbAirportTwo[i].countryname
            });
          }
        }
        this.topFlightSearchSkeletonLeft = false;
        this.topFlightSearchSkeletonRight = false;
        this.setFlightDataTwo();
      }, 500);
    }
  }

  //


  setFromPanelInfo(id: any) {
    try {
      this.selectedDepartureCity = this.flightHelper.getCityNameById(id);
      this.selectedDepartureCountry = this.getCountryNameById(id);
      let lenDep = this.selectedDepartureCity + "" + this.selectedDepartureCountry;
      if (lenDep.length > 12) {
        this.selectedDepartureCountry = this.selectedDepartureCountry.substring(0,
          12 - this.selectedDepartureCity.length) + "..";
      }
    } catch (exp) { }
  }
  setToPanelInfo(id: any) {
    try {
      this.selectedReturnCity = this.flightHelper.getCityNameById(id);
      this.selectedReturnCountry = this.getCountryNameById(id);
      let lenArr = this.selectedReturnCity + "" + this.selectedReturnCountry;
      if (lenArr.length > 12) {
        this.selectedReturnCountry = this.selectedReturnCountry.substring(0,
          12 - this.selectedReturnCity.length) + "..";
      }
    } catch (exp) { }
  }
  _getAirlineList() {
    this.authService.getAirlineInfo().subscribe(data => {
      this.cmbAirlines = [];
      data.airlinelist.forEach((airline: { vAirlinesId: any, nvIataDesignator: any; nvAirlinesName: any; vLogo: any; }) => {
        this.cmbAirlines.push({
          masterId: airline.vAirlinesId,
          id: airline.nvIataDesignator,
          text: airline.nvAirlinesName,
          logo: airline.vLogo
        });
      });
    }, err => {
      console.log(err);
    });
  }
  setAirlineList(searchedAirline: any) {
    if (this.isOneway) {
      this.authService.getAirlineInfo().subscribe(data => {
        this.airlines = [];
        var d = data.airlinelist;
        let flight: any[] = [];
        for (let j = 0; j < searchedAirline.length; j++) {
          let disclosure = searchedAirline[j].carrier.disclosure;
          if (disclosure != undefined && disclosure != "") {
            flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
          } else {
            flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
          }
        }
        for (let i = 0; i < d.length; i++) {
          var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
          if (obj != "" && obj != undefined) {
            this.airlines.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
          }
        }
        for (let i = 0; i < searchedAirline.length; i++) {
          for (let j = 0; j < this.airlines.length; j++) {
            let disclosure = searchedAirline[i].carrier.disclosure;
            if (disclosure != undefined && disclosure != "") {
              if (this.airlines[j].code == disclosure) {
                this.airlines[j].data.unshift(searchedAirline[i]);
                break;
              }
            } else {
              if (this.airlines[j].code == searchedAirline[i].carrier.marketing) {
                this.airlines[j].data.unshift(searchedAirline[i]);
                break;
              }
            }
          }
        }
        this.setAirport(this.scheduleDescs);
        this.setItineryWiseAirlineInfo(this.itineraries, this.airlines, d);
      }, err => {
        console.log(JSON.stringify(err));
      });
    } else {
      this.authService.getAirlineInfo().subscribe(data => {
        this.airlines = [];
        this.airlinesTwo = [];
        var airlineData = data.airlinelist;
        // console.log("airlineData");
        // console.log(airlineData);
        // console.log("root data itinerary");
        // console.log(this.rootData.itineraryGroups)
        for (let rootItem of this.rootData.itineraryGroups) {
          if (rootItem.groupDescription.legDescriptions[0].arrivalLocation == this.selectedAirportToCode) {
            for (let subItem of airlineData) {
              let flight = this.shareService.groupBy(this.flightHelper.getApiAirlineInfo(rootItem.itineraries), x => x);
              let scheduleAriline = this.flightHelper.getApiAirlineInfo(this.scheduleDescs, "schedulesAirlines");
              for (let item of this.shareService.getMapToArray(flight)) {
                if (subItem.nvIataDesignator.toString().trim().toLowerCase() == item.key.toString().trim().toLowerCase()) {

                  this.airlines.push({
                    id: subItem.vAirlinesId,
                    code: item.key, logo: subItem.vLogo,
                    number: subItem.nvAirlinesCode,
                    name: subItem.nvAirlinesName, len: 0
                  });
                }
              }
              for (let item of scheduleAriline) {
                if (
                  this.airlines.findIndex(x => x.code.toString().toLowerCase()
                    == subItem.nvIataDesignator.toString().toLowerCase()) < 0
                  &&
                  this.airlines.findIndex(x => x.code.toString().toLowerCase()
                    == item.toString().toLowerCase()) < 0
                ) {

                  this.airlines.push({
                    id: subItem.vAirlinesId,
                    code: subItem.nvIataDesignator, logo: subItem.vLogo,
                    number: subItem.nvAirlinesCode,
                    name: subItem.nvAirlinesName, len: 0
                  });
                }
              }
            }
          }
        }
        for (let rootItem of this.rootDataTwo.itineraryGroups) {
          if (rootItem.groupDescription.legDescriptions[0].arrivalLocation == this.selectedAirportFromCode) {
            for (let subItem of airlineData) {
              let flight = this.shareService.groupBy(this.flightHelper.getApiAirlineInfo(rootItem.itineraries), x => x);
              let scheduleAriline = this.flightHelper.getApiAirlineInfo(this.scheduleDescsTwo, "schedulesAirlines");
              for (let item of this.shareService.getMapToArray(flight)) {
                if (subItem.nvIataDesignator.toString().trim().toLowerCase() == item.key.toString().trim().toLowerCase()) {

                  this.airlinesTwo.push({
                    id: subItem.vAirlinesId,
                    code: item.key, logo: subItem.vLogo,
                    number: subItem.nvAirlinesCode,
                    name: subItem.nvAirlinesName, len: 0
                  });
                }
              }
              for (let item of scheduleAriline) {
                if (
                  this.airlinesTwo.findIndex(x => x.code.toString().toLowerCase()
                    == subItem.nvIataDesignator.toString().toLowerCase()) < 0
                  &&
                  this.airlinesTwo.findIndex(x => x.code.toString().toLowerCase()
                    == item.toString().toLowerCase()) < 0
                ) {
                  this.airlinesTwo.push({
                    id: subItem.vAirlinesId,
                    code: subItem.nvIataDesignator, logo: subItem.vLogo,
                    number: subItem.nvAirlinesCode,
                    name: subItem.nvAirlinesName, len: 0
                  });
                }
              }
            }
          }
        }
        // console.log("Airlines::");
        // console.log(this.airlines);
        this.setAirport(this.scheduleDescs);
        this.setAirportTwo(this.scheduleDescsTwo);
      }, err => {
        console.log(JSON.stringify(err));
      });
    }
  }

  setItineryWiseAirlineInfo(searchedAirline: any, airlines: any, data: any) {
    for (let i = 0; i < searchedAirline.length; i++) {
      for (let j = 0; j < airlines.length; j++) {
        let marketing = searchedAirline[i].pricingInformation[0].fare.validatingCarrierCode;
        if (this.getCurrentFlightCode(this.airlines[j].code) == marketing) {
          this.airlines[j].itineryData.unshift(searchedAirline[i].pricingInformation[0].fare);
          break;
        }
      }
    }
    for (let i = 0; i < this.airlines.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (this.airlines[i].code.toString().toLowerCase().trim()
          == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
          this.airlines[i].logo = data[j].vLogo;
          break;
        }
      }
    }
  }

  getAirlineName(obj: string): string {
    let ret: string = "";

    try {
      for (let item of this.airlines) {
        if (item.code == obj) {
          ret = item.name;
          break;
        }
      }
    } catch (exp) { console.log("Get Airlines Name:" + exp); }
    return ret;
  }

  //
  getAirlineNameTwo(obj: string): string {
    let ret: string = "";

    try {
      for (let item of this.airlinesTwo) {
        if (item.code == obj) {
          ret = item.name;
          break;
        }
      }
    } catch (exp) { console.log("Get Airlines Name:" + exp); }
    return ret;
  }
  //

  getAirlineLogo(obj: string): string {
    let ret: string = "";

    try {
      for (let item of this.airlines) {
        if (item.code == obj) {
          ret = item.logo;
          break;
        }
      }
    } catch (exp) { console.log("Get Airlines Name:" + exp); }
    return ret;
  }

  getAirlineLogoTwo(obj: string): string {
    let ret: string = "";

    try {
      for (let item of this.airlinesTwo) {
        if (item.code == obj) {
          ret = item.logo;
          break;
        }
      }
    } catch (exp) { console.log("Get Airlines Name:" + exp); }
    return ret;
  }

  getDepCityName(obj: string): string {
    let ret: string = "";
    try {
      if (this.airports != undefined && this.airports != "") {

        for (let item of this.airports.departure) {
          if (item.depCode.toString().toLowerCase() === obj.toString().toLowerCase()) {
            ret = item.depCityName;
            break;
          }
        }
      }
    } catch (exp) { }
    return ret;
  }

  getDepCityNameTwo(obj: string): string {
    let ret: string = "";
    try {
      if (this.airportsTwo != undefined && this.airportsTwo != "") {

        for (let item of this.airportsTwo.departure) {
          if (item.depCode.toString().toLowerCase() === obj.toString().toLowerCase()) {
            ret = item.depCityName;
            break;
          }
        }
      }
    } catch (exp) { }
    return ret;
  }

  getDepCountryName(obj: string): string {
    let ret: string = "";
    try {
      if (this.airports != undefined && this.airports != "") {
        for (let item of this.airports.departure) {

          if (item.depCode.toString().toLowerCase() === obj.toString().toLowerCase()) {
            ret = item.depCountryName;
            break;
          }
        }
      }
    } catch (exp) { }
    return ret;
  }
  getArrCityName(obj: string): string {
    let ret: string = "";
    try {
      if (this.airports != "" && this.airports != undefined) {
        for (let item of this.airports.arrival) {
          if (item.arrCode.toString().toLowerCase() === obj.toString().toLowerCase()) {
            ret = item.arrCityName;
            break;
          }
        }
      }
    } catch (exp) { }
    return ret;
  }

  getArrCityNameTwo(obj: string): string {
    let ret: string = "";
    try {
      if (this.airportsTwo != "" && this.airportsTwo != undefined) {
        for (let item of this.airportsTwo.arrival) {
          if (item.arrCode.toString().toLowerCase() === obj.toString().toLowerCase()) {
            ret = item.arrCityName;
            break;
          }
        }
      }
    } catch (exp) { }
    return ret;
  }

  getArrCountryName(obj: string): string {
    let ret: string = "";
    try {
      if (this.airports != "" && this.airports != undefined) {
        for (let item of this.airports.arrival) {
          if (item.arrCode.toString().toLowerCase() === obj.toString().toLowerCase()) {
            ret = item.arrCountryName;
            break;
          }
        }
      }
    } catch (exp) { }
    return ret;
  }
  private _setLoaderValue(obj: any) {
    try {
      this.fromFlight = obj.fromFlightName;
      this.toFlight = obj.toFlightName;
      this.departureDate = obj.departureDate;
      this.returnDate = obj.departureDate;
      this.adult = obj.adult != undefined ? obj.adult : "0";
      this.child = obj.childList.length != undefined ? obj.childList.length : "0";
      this.infant = obj.infant != undefined ? obj.infant : "0";
      this.isLoad = true;
      this.cabinTypeId = this.flightHelper.getCabinTypeId(obj.classType),
        this.tripTypeId = this.getTripTypeId()

      if (obj.childList.length > 0) {
        if (obj.childList[0].age == "" || obj.childList[0].age == undefined) {
          this.childListFinal = [];
          this.childList = [];
          this.childList2 = [];
          this.child = "0";
        }
      }
    } catch (exp) { }
  }
  _getTotalTravellers(): number {
    return this.num1 + this.num2 + this.num3;
  }
  private _setPanelSearchHeader(data: any) {
    try {
      this.isOneway = data.isOneWay;
      this.isRoundtrip = data.isRoundTrip;
      this.isMulticity = data.isMultiCity;

      this.selectedDepartureDate = data.departureDate;
      this.selectedReturnDate = data.returnDate;
      this.childListFinal = data.childList;
      this.childList = data.childList1;
      this.childList2 = data.childList2;
      this.num1 = data.adult;
      this.num2 = data.childList.length;
      this.num3 = data.infant;
      if (data.childList.length > 0) {
        if (data.childList[0].age == "" || data.childList[0].age == undefined) {
          this.childListFinal = [];
          this.childList = [];
          this.childList2 = [];
          this.num2 = 0;
        }
      }
      this.selectedAirportFromId = data.fromFlightId;
      this.selectedAirportFromCode = data.fromFlightCode;
      this.selectedAirportToId = data.toFlightId;
      this.selectedAirportToCode = data.toFlightCode;
      this.selectedDepartureCity = data.fromFlightName;
      this.selectedReturnCity = data.toFlightName;
      this.selectedDepartureCountry = data.fromCountryName;
      this.selectedReturnCountry = data.toCountryName;
      this.selectedAirportFromName = data.fromAirportName;
      this.selectedAirportToName = data.toAirportName;
      this.selectedClassTypeId = data.cabinTypeId;
      this.selectedClassTypeCode = data.classType;
      this.selectedClassTypeName = this.flightHelper.getCabinTypeName(data.classType);
      this.selectedClassTypeNameMobile = this.flightHelper.getCabinTypeName(data.classType);
      if (this.isOneway) {
        this.selectedReturnDate = "";
        this.selectedReturnPanel = "";
      } else { this.setReturnPanel(this.selectedReturnDate); }
      let tripVal = this.isOneway ? "1" : (this.isRoundtrip ? "2" : "3");
      this.selectTripType.setValue(tripVal);
      this.selectedTripTypeId = this.flightHelper.getTripTypeId(parseInt(tripVal));
      this.setDeparturePanel(this.selectedDepartureDate);
      this.setFromPanelInfo(this.selectedAirportFromId);
      this.setToPanelInfo(this.selectedAirportToId);

      flatpickr(".flat-datepick-from", {
        enableTime: false,
        dateFormat: "d-m-Y",
        allowInput: true,
        minDate: "today"
      });
      flatpickr(".flat-datepick-to", {
        enableTime: false,
        dateFormat: "d-m-Y",
        allowInput: true,
        minDate: this.shareService.padLeft(this.shareService.getDay(this.selectedDepartureDate), '0', 2) + "." +
          this.shareService.padLeft(this.shareService.getMonth(this.selectedDepartureDate), '0', 2) + "." +
          this.shareService.getYearLong(this.selectedDepartureDate)
      });

      this.selectedPanelAirportFromId = data.fromFlightId;
      this.selectedPanelAirportToId = data.toFlightId;
    } catch (exp) { }
  }
  private setDeparturePanel(date: any) {
    this.selectedDeparturePanel =
      this.shareService.getDayNameShort(date) + ", " +
      this.shareService.getDay(date) + " " +
      this.shareService.getMonthShort(date) + "'" +
      this.shareService.getYearShort(date);
  }
  private setReturnPanel(date: any) {
    this.selectedReturnPanel =
      this.shareService.getDayNameShort(date) + ", " +
      this.shareService.getDay(date) + " " +
      this.shareService.getMonthShort(date) + "'" +
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
  dateChangeApi(type: boolean = true, item:any) {
    this.isCancellationShow = true;
    try {
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
      this.authService.getDateChanges(dateCancel).subscribe(data => {

        // console.log(JSON.stringify(data));
        this.setResponseText(data.res, data.amount, dateCancel.airlineCode, type);
        this.isCancellationShow = false;
      }, err => {

      });
    } catch (exp) { }
  }
  setResponseText(data: any, amount: any, airlineCode: any, type: boolean) {
    try {
      this.authService.getResponseSearchText(airlineCode, type == true ? "Date Change" : "Cancel").subscribe(subData => {
        // var d = console.log(data);
        var firstCap = "", secondCap = "";
        try {
          firstCap = subData.data[0].nvFirstSentence;
          secondCap = subData.data[0].nvLastSentence;
        } catch (exp) { }
        if (type == true) {
          this.setDateChangesAmount(data, amount, firstCap, secondCap);
        } else {
          this.setCancellationAmount(data, amount, firstCap, secondCap);
        }
      }, err => { });
    } catch (exp) {
      console.log(exp);
    }
  }
  setDateChangesAmount(data: any, amount: any, firstCap: any, lastCap: any) {
    this.amtDateChanges = "";
    this.amtDateChangesPlus = this.shareService.amountShowWithCommas(Math.round(amount));;
    this.amtDateChangesPre = "";
    let envData = data["soap-env:Envelope"];
    let envBody = envData["soap-env:Body"];
    try {
      let fareParaList = envBody.OTA_AirRulesRS.FareRuleInfo.Rules.Paragraph;
      let amt = "", pre = "";

      for (let item of fareParaList) {
        if (item.Title.indexOf('PENALTIES') > -1) {
          let txt = item.Text.toString().replace(/\s+/g, ' ').trim();
          let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
          crop = crop.toString().trim();
          // console.log("Cropped::" + crop);
          amt = crop.split(' ')[1];
          pre = crop.split(' ')[0];
        }
      }
      this.amtDateChanges = amt;
      this.amtDateChangesPre = pre;
    } catch (exp) {
      let fare = envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let txt = fare.toString().replace(/\s+/g, ' ').trim();
      let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
      this.amtDateChanges = crop.split(' ')[1];
      this.amtDateChangesPre = crop.split(' ')[0];
    }
  }
  setCancellationAmount(data: any, amount: any, firstCap: any, lastCap: any) {
    this.amtCancellation = "";
    this.amtCancellationPre = "";
    this.amtCancellationPlus = this.shareService.amountShowWithCommas(Math.round(amount));
    let envData = data["soap-env:Envelope"];
    let envBody = envData["soap-env:Body"];
    try {
      let fareParaList = envBody.OTA_AirRulesRS.FareRuleInfo.Rules.Paragraph;
      let amt = "", pre = "";

      for (let item of fareParaList) {
        if (item.Title.indexOf('PENALTIES') > -1) {
          let txt = item.Text.toString().replace(/\s+/g, ' ').trim();
          let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
          crop = crop.toString().trim();
          amt = crop.split(' ')[1];
          pre = crop.split(' ')[0];
        }
      }
      this.amtCancellation = amt;
      this.amtCancellationPre = pre;
    } catch (exp) {
      let fare = envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let txt = fare.toString().replace(/\s+/g, ' ').trim();
      let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
      this.amtCancellation = crop.split(' ')[1];
      this.amtCancellationPre = crop.split(' ')[0];
    }
  }

  getAdjustmentDate(date: any, adj: any, adjSegement: any = undefined): any {
    let ret: any = "";
    try {
      adj = adj != undefined && adj != "" && !isNaN(adj) ? adj : 0;
      adjSegement = adjSegement != undefined && adjSegement != "" && !isNaN(adjSegement) ? adjSegement : 0;
      adj += adjSegement;
      let addedDate = moment(date).add(adj, 'days');
      ret = addedDate;
    } catch (exp) { }
    return ret;
  }


  getDateChanges(refund: boolean, passenger: any): any {
    try {
      if (refund == false) {
        return "Non Refundable + " + this.amtDateChangesPlus + "";
      } else {
        if (this.amtDateChanges == "" || this.amtDateChanges == undefined) {
          return "Airline Fee " + " + " + this.amtDateChangesPlus + "";
        }
        return this.amtDateChangesPre + " " + this.shareService.amountShowWithCommas(Math.round(parseFloat(this.amtDateChanges) * parseInt(passenger))) + " + " + this.amtDateChangesPlus + "";
      }
    } catch (exp) { }
  }
  getDateChangeFee(refund: boolean, passenger: any): any {
    try {
      if (refund == false) {
        return "Non Refundable + " + this.amtDateChangesPlus + "";
      } else {
        if (this.amtDateChanges == "" || this.amtDateChanges == undefined) {
          return " + " + this.amtDateChangesPlus + "";
        }
        return this.amtDateChangesPre + " " + this.shareService.amountShowWithCommas(Math.round(parseFloat(this.amtDateChanges) * parseInt(passenger))) + " + " + this.amtDateChangesPlus + "";
      }
    } catch (exp) { }
  }
  getCancellation(refund: boolean, passenger: any): any {
    try {
      if (refund == false) {
        return "Non Refundable + " + this.amtCancellationPlus + "";
      } else {
        if (this.amtCancellation == "" || this.amtCancellation == undefined) {
          return "Airline Fee " + " + " + this.amtCancellationPlus + "";
        }
        return this.amtCancellationPre + " " + this.shareService.amountShowWithCommas(Math.round(parseFloat(this.amtCancellation) * parseInt(passenger))) + " + " + this.amtCancellationPlus + "";
      }
    } catch (exp) { }
  }

  toggleAngleUpDown() {
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
  }

  legDataSet(item: any, type: number) {
    if (type == 1) {
      this.summaryBarLegData.firstLegData = [];
      let d1 = this.flightDataFirstLeg.find(x => x.id == item);
      this.summaryBarLegData.firstLegData.push(d1);
    }
    if (type == 2) {
      this.summaryBarLegData.secondLegData = [];
      let d2 = this.flightDataSecondLeg.find(x => x.id == item);
      this.summaryBarLegData.secondLegData.push(d2);
    }
  }

}
