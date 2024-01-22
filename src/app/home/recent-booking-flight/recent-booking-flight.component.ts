import { Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from '../../_services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Select2OptionData } from 'ng-select2';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
import { DatePipe, DOCUMENT } from '@angular/common';
import { ShareService } from '../../_services/share.service';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FlightHelperService } from '../flight-helper.service';
import flatpickr from "flatpickr";
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';
import * as moment from 'moment';

import { RouteWiseMarkupDiscountDetails } from 'src/app/model/route-wise-markup-discount-details.model';
import { IssueTicketSabre } from 'src/app/model/IssueTicketSabre.model';

declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-recent-booking-flight',
  templateUrl: './recent-booking-flight.component.html',
  styleUrls: ['./recent-booking-flight.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecentBookingFlightComponent implements OnInit {
  isDataGridShow = true;
  isDataShow = false;
  isProcessing = true;
  length = 10;
  searchedValue = '';
  searchValue = '';
  pageNo = 1;
  pageList: any;
  start = 0;
  end = 0;
  recordsTotal = 0;
  recordsFiltered = 0;
  filteredRecordsShow = false;
  tableData: any;
  amount: any;
  totalReIssueFare: any;
  totalDateChangeFare: any;
  totalRefundCharge: any;
  @ViewChild('btnClose', { static: true })
  btnClose!: ElementRef;
  @ViewChild('btnModalOpen', { static: true })
  btnModalOpen!: ElementRef;
  supplierwithprovider = ["31BB44C5-3FEE-4ACD-8B8A-F984F6CCD27D"];
  urlMain = "./assets/dist/js/main.min.js";
  urlDemo = "./assets/dist/js/demo.js";

  loadAPI: Promise<any> | any;
  recentBookingFlight: any[] = [];
  isBookClicked: boolean = false;
  item: any;
  public selectedReturnDate: any = "";
  public selectedAirportFromId: any = "";
  public selectedAirportToId: any = "";
  public selectedDepartureCity: any = "";
  public selectedDepartureCountry: any = "";
  public selectedDepartureCountryCode: any = "";
  public selectedReturnCity: any = "";
  public selectedReturnCountry: any = ""
  public selectedReturnCountryCode: any = ""
  public selectedClassTypeId: any = "";
  public selectedClassTypeCode: any = "";
  public selectedClassTypeName: any = "";
  public selectedClassTypeNameMobile: any = "";
  num1 = 0;
  num2 = 0;
  num3 = 0;
  passengerDetails: any;
  bookingConfirmation: any;
  isDomestic: boolean = false;
  isInternational: boolean = false;
  depDayNumberName: any;
  depDayNumber: any;
  depMonthName: any;
  bookingsuccessForm!: FormGroup;
  bookingsuccessModel: any;
  VBookingId: any;
  passengerwithticket: any;
  VBookingManualId: any;
  Id: any;
  VAirlineRouteEnableMasterId: any;
  DStartDate: any;
  DEndDate: any;
  BIsTicketed: any;
  VFlightTypeId: any;
  VCabinTypeId: any;
  Cabin!: string;
  isOneway: boolean = false;
  isMulticity: boolean = false;
  isRoundtrip: boolean = false;
  isDomMulticity: boolean = false;
  isIntMulticity: boolean = false;
  BillAmount: any;
  Paid: any;
  Due: any;
  NvCreationUserSine: any;
  DCreationDateTime: any;
  VPrimeHostId: any;
  VTicketProcessStatusId: any;
  VPlatformId: any;
  BStatus: any;
  NMinimumAmountTobePay: any;
  DPartialPaymentOfferExpiredAt: any;
  DRemainingAmountTobePayAt: any;
  DPartialPaymentOfferAcceptedAt: any;
  NRefundServiceCharge: any;
  NRefundCharge: any;
  DRefundExpiredAt: any;
  DRefundAcceptedAt: any;
  NvTicketRequestStatusName: any;
  NvTicketStatusName: any;
  DTimeLimitFsl: any;
  VItineraryNumber: any;
  ModifyBooking: any;
  BillStatus: any;
  Print: any;
  SplitPnr: any;
  DataChange: any;
  PartialPnr: any;
  checkAgeValidation: any;
  flightWrapText: string = "";
  ssrList: any[] = [];
  bookingTicketList: any = [];
  bookingLog: any[] = [];
  bookings: any[] = [];
  ticketprocess: any[] = [];
  bookingticketlists: any = [];
  accept = ["A48898D8-050B-4C2C-8163-93BB80F71BFE"];
  reject = ["5EA08B86-2C10-4107-A5AD-1682C8141876"];
  cancel = ["A078AAF7-D120-4400-A57F-62263AF697CE"];
  firstLegData: any = [];
  secondLegData: any = [];
  firstLegFareData: any = [];
  secondLegFareData: any = [];
  partialpayment = ["28D18AB1-9749-4B87-BA85-49CF90D1C693"];
  partialpaymentreject = ["5EA08B86-2C10-4107-A5AD-1682C8141876"];
  partialpaymentaccept = ["A48898D8-050B-4C2C-8163-93BB80F71BFE"];
  voidrequest = ["DEAA59D8-95F0-4958-A95E-88A09A994945"];
  voidcancel = ["0624D519-1C24-4FC9-BC0D-89FF0EEB0515"];
  refundrequest = ["E3F85DD5-ACC8-441D-939C-6645F7EEA196"];
  refundaccept = ["324DCF66-EF5D-43E1-9751-18BE00B21C0B"];
  refundreject = ["509FA446-364A-4D5E-B3DF-1B6A17667515"];
  temporarycancel = ["A7712A7B-CC8C-4FF0-B4DA-2B665E7B5632"];
  datechange = ["584FCA2C-C68E-428C-A6A8-ADFE7043735F"];
  datechangecancel = ["DE24A31B-EEDB-4C96-A7F2-DE0DAFB488A4"];
  datechangeoffercancel = ["D0A40954-7867-4B7C-8AC8-C0700CF1E925"];
  datechangeofferaccept = ["2E698D0D-F4AD-4D70-9803-F2A59529A2BE"];
  reissueofferaccept= ["A79316B4-9AE9-4DA9-BB1B-B8111EC586F7"];
  reissueofferreject= ["93377D81-CB52-463D-90DD-67F823BDA75C"];
  datechangeoffer = ["8EAB0637-679D-4C13-8CF9-41EE6ADE7D45"];
  reissue = ["23EA9515-098D-4C5F-B251-7D055E388468"];
  airlineroutes: any[] = [];
  bookingjourneys: any[] = [];
  datechangefees: any[] = [];
  datechangefares: any[] = [];
  temporarycanclefares: any[] = [];
  cabintypes: any[] = [];
  journeytrip: any[] = [];
  trip: any[] = [];
  bookingtravelers: any[] = [];
  bookingtravelerId: any[] = [];
  RefundPnr: any;
  adult: any[] = [];
  adultnum: any;
  childList: number[]=[];
  childListFinal: number[]=[];
  childnum: any;
  infant: any[] = [];
  infantnum: any;
  VBookingJourneyId: any;
  INumberOfFlights!: number;
  AirportFrom: any;
  AirportTo: any;
  AirportFromId: any;
  AirportToId: any;
  VAirlinesRouteEnableId: any;
  BB2bdateChange: any;
  datechangeshow = false;
  reissueshow = false;
  datechangeoffershow = false;
  reissueofferoffershow = false;
  splitPNRshow = false;
  splitbutton = true;
  BB2brefundStatus: any;
  BB2btemporaryCancelStatus: any;
  BB2bvoidStatus: any;
  splitForm!: FormGroup;
  splitModel: any;
  FlightNum: any;
  AirlinesCode: any;
  cabin: any;
  startDate: any;
  endDate: any;
  AfCode: any;
  AtCode: any;
  CityFrom: any;
  CountryFrom: any;
  CountryFromCode: any;
  CityTo: any;
  CountryTo: any;
  CountryToCode: any;
  DepartureDateTime: any;
  ArrivalDateTime: any;
  Departure: any;
  startDepartureDate: any[] = [];
  parts: any;
  tripTypeNumber!: string;
  OneWayType = "32AFE94B-4C4F-421D-AA91-11E0BD5E125C";
  RoundTripType = "3E58A4D3-FCD4-4CFA-9371-B03D46A20574";
  MultiCityType = "CF748349-6049-4F33-AA7D-A1EB7440C33B";
  firstLeg: any;
  airports: any[] = [];
  airport: any;
  flightName!: string;
  agentFare: any;
  clientFare: any;
  gdsFare: any;
  reservationPNR: any;
  referenceNo: any;
  airlinePNR: any;
  ItineraryNumber: any;
  BookingManualId: any;

  queryString: any;
  DateChangeFee: any;

  bookingData: any[] = [];
  bookingdetailsData: any[] = [];
  bookingtravelerData: any = [];
  bookingjourneyData: any[] = [];
  bookingfareData: any[] = [];
  bookinglogData: any[] = [];
  bookingstatusData: any[] = [];
  ticketlistData: any[] = [];
  bookingamountData: any[] = [];
  ssrlistData: any[] = [];
  missingtrip: any[] = [];
  changetrip: any[] = [];
  missingTripDate: any[] = [];
  extendDay = 1;
  @ViewChild('btnViewShow', { static: true })
  btnViewShow!: ElementRef;

  ticketData:any=[];
  ticketdetail: any[] = [];

  public selectedDepartureDate: any = this.shareService.getYearLong() + "-" +
    this.shareService.padLeft(this.shareService.getMonth(), '0', 2) + "-" + this.shareService.padLeft(this.shareService.getDay(), '0', 2);
  ticketData1: any;

  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2, private appComponent: AppComponent,
    private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
    private router: Router, private httpClient: HttpClient, private toastrService: ToastrService, private elementRef: ElementRef, public flightHelper: FlightHelperService,
    public shareService: ShareService, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.renderer.removeClass(this.document.body, 'mat-typography');
    this.renderer.addClass(this.document.body, 'flight_search_details');
    this.loadAPI = new Promise(resolve => {
      this.loadScript();
    });
    this.init();
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'flight_search_details');
  }
  private init() {
    this.getServerSideBookingList();
    this.CreateBookingSuccessForm();
    this.CreateSplitPNRForm();

    let index = this.router.url;
    
    if(index.indexOf("id") == -1){
      // this.getServerSideBookingList();

      var splitted = index.split("/");

      if(splitted.length>2){
        this.edit(splitted[3]);
      }
    }
  }
  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
    this.queryString = window.location.pathname;
  }

  getServerSideBookingList() {
    this.isProcessing = true;
    let userId = this.shareService.getUserId();
    this.authService.getServerSideBookingList(userId, this.pageNo, this.length, this.searchedValue).subscribe(data => {
      this.recordsTotal = data.recordsTotal;
      this.recordsFiltered = data.recordsFiltered;
      this.filteredRecordsShow = (this.searchedValue != "") ? true : false;
      this.start = (this.recordsFiltered == 0) ? 0 : (((this.pageNo - 1) * this.length) + 1);
      this.end = (this.recordsFiltered == 0) ? 0 : (this.pageNo * this.length);
      this.end = (this.end < this.recordsFiltered) ? this.end : this.recordsFiltered;
      this.end = (this.end < this.recordsTotal) ? this.end : this.recordsTotal;
      this.amount = parseInt(data.amount);
      data.bookinglist.forEach((value: any, index: any) => {
        value.index = this.start + index;
        if (value.vBookingManualId != null) {
          value.creationDateTime = this.datepipe.transform(value.dCreationDateTime, 'dd-MM-yy, h:mm a');
          value.tripDeparture = this.datepipe.transform(value.tripDeparture, 'dd-MM-yy');
          // value.gdstimeLimit = this.datepipe.transform(value.gdstimeLimit, 'dd-MM-yy, h:mm a');
          value.travelionTimeLimit = this.datepipe.transform(value.travelionTimeLimit, 'dd-MM-yy, h:mm a');
          value.totalclient = this.shareService.amountShowWithCommas(value.clientFare);
          value.totalAgency = this.shareService.amountShowWithCommas(value.agencyFare);
          value.profit = this.shareService.amountShowWithCommas(value.profit);
          if (value.ticket1 == null) {
            value.ticket1 = '';
          }
          if (value.flightTicket1 != null) {
            value.ticket1 = null;
          }
          var id = localStorage.getItem('uid');

          if (id != value.userId) {
            $("#editBtn").hide();
          } else {
            $("#editBtn").show();
          }
          if(value.totalProvider == 1){
            value.ticket2 = null;
            value.flightTicket2 = null;
          }
        }
      });
      this.createPageList();
      this.tableData = data.bookinglist;
    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;
    });
  }

  ViewShow() {
    this.isDataGridShow = false;
  }

  CreateBookingSuccessForm() {
    this.bookingsuccessForm = this.fb.group({
      VBookingId: ['', Validators.nullValidator],
      VBookingManualId: ['', Validators.nullValidator],
      VAirlineRouteEnableMasterId: ['', Validators.nullValidator],
      Id: ['', Validators.nullValidator],
      DStartDate: ['', Validators.nullValidator],
      DEndDate: ['', Validators.nullValidator],
      BIsTicketed: ['', Validators.nullValidator],
      VCabinTypeId: ['', Validators.nullValidator],
      VFlightTypeId: ['', Validators.nullValidator],
      NvCreationUserSine: ['', Validators.nullValidator],
      DCreationDateTime: ['', Validators.nullValidator],
      VPrimeHostId: ['', Validators.nullValidator],
      VTicketProcessStatusId: ['', Validators.nullValidator],
      VPlatformId: ['', Validators.nullValidator],
      BStatus: ['', Validators.nullValidator],
      NMinimumAmountTobePay: ['', Validators.nullValidator],
      DPartialPaymentOfferExpiredAt: ['', Validators.nullValidator],
      DRemainingAmountTobePayAt: ['', Validators.nullValidator],
      DPartialPaymentOfferAcceptedAt: ['', Validators.nullValidator],
      NRefundCharge: ['', Validators.nullValidator],
      NRefundServiceCharge: ['', Validators.nullValidator],
      DRefundExpiredAt: ['', Validators.nullValidator],
      DRefundAcceptedAt: ['', Validators.nullValidator]
    });
  }
  add30Minutes(creationDateTime:any) {
    const originalDate = new Date(creationDateTime);
    const newDate = new Date(originalDate.getTime() + (30 * 60000));
    return newDate;
  }
  nameSplitWithoutTitle(givenName:any){
    const nameParts = givenName.split(' ');
    let formattedName = nameParts;
    if (nameParts.length > 0) {
      if(nameParts[1].trim()==='MR' || nameParts[1].trim()==='MS' || nameParts[1].trim()==='MRS'|| nameParts[1].trim()==='MSTR'|| nameParts[1].trim()==='MISS'){
        formattedName = `${nameParts[0]}`;
      }else{
        formattedName = `${nameParts[0]} ${nameParts[1]}`;
      }
    } 
    return formattedName;
  }
  nameSplitWithTitle(givenName:any){
    const nameParts = givenName.split(' ');
    let formattedName = nameParts;
    if (nameParts.length > 0) {
      if(nameParts[1].trim()==='MR' || nameParts[1].trim()==='MS' || nameParts[1].trim()==='MRS'|| nameParts[1].trim()==='MSTR'|| nameParts[1].trim()==='MISS'){
        formattedName = ` ${nameParts[1]} ${nameParts[0]}`;
      }else{
        formattedName = `${nameParts[0]} ${nameParts[1]}`;
      }
    } 
    return formattedName;
  }
  getOnlyTitle(givenName:any){
    const nameParts = givenName.split(' ');
    let formattedName = '';
    if (nameParts.length > 0) {
      if(nameParts[1].trim()==='MR' || nameParts[1].trim()==='MS' || nameParts[1].trim()==='MRS'|| nameParts[1].trim()==='MSTR'|| nameParts[1].trim()==='MISS'){
        formattedName = `${nameParts[1]}`;
      }
    } 
    return formattedName;
  }
  formatBirthDate(dBirthDate: string) {
    const dateObj = new Date(dBirthDate);
    const formattedDate = this.datePipe.transform(dateObj, 'dd-MM-yyyy');
    return formattedDate;
  }
  RouteWiseMarkUpDiscountDetailsID:any;
  TicketIssueType:any;
  TicketIssueTypeCommission:any;
  edit(vBookingId: any) {
    //console.log(vBookingId);
    $("#showbut").show();
    this.authService.getViewBookingById(vBookingId).subscribe((data: { passengerwithticket:any, booking: any[], ticketdetails: any, temporarycancelfare: any, datechangefare: any, bookingjourney: any, datechangefee: any, airlineroute: any, cabintype: any, bookingdetails: any, bookingtraveler: any, bookingfare: any, bookingamount: any, ticketlist: any, bookinglog: any, bookingticketlist: any[], ssrlist: any; }) => {
      setTimeout(() => {
        flatpickr(".date", {
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput: true,
          minDate: "today"
        });
        flatpickr(".date-to", {
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput: true,
          minDate: this.shareService.padLeft(this.shareService.getDay(this.startDate), '0', 2) + "." +
            this.shareService.padLeft(this.shareService.getMonth(this.startDate), '0', 2) + "." +
            this.shareService.getYearLong(this.startDate)
        });
      });
      this.bookingData = [];
      this.bookingData = Array.of(data.booking[0]);
      this.passengerwithticket = data.passengerwithticket;
      data.booking.forEach((value: any, index: any) => {
        this.VBookingId = value.vBookingId;
        this.VBookingManualId = value.vBookingManualId;
        this.Id = value.id;
        this.VAirlineRouteEnableMasterId = value.vAirlineRouteEnableMasterId;
        this.DStartDate = value.dStartDate;
        this.DEndDate = value.dEndDate;
        this.BIsTicketed = value.bIsTicketed;
        this.VFlightTypeId = value.vFlightTypeId;
        this.FlightNum = value.iIdentifiedBy;
        this.VCabinTypeId = value.vCabinTypeId;
        this.NvCreationUserSine = value.nvCreationUserSine;
        this.DCreationDateTime = value.dCreationDateTime;
        this.VPrimeHostId = value.vPrimeHostId;
        this.VTicketProcessStatusId = value.vTicketProcessStatusId;
        this.VPlatformId = value.vPlatformId;
        this.BStatus = value.bStatus;
        this.NMinimumAmountTobePay = value.nMinimumAmountTobePay;
        this.DPartialPaymentOfferExpiredAt = value.dPartialPaymentOfferExpiredAt;
        this.DRemainingAmountTobePayAt = value.dRemainingAmountTobePayAt;
        this.DPartialPaymentOfferAcceptedAt = value.dPartialPaymentOfferAcceptedAt;
        this.NRefundServiceCharge = value.nRefundServiceCharge;
        this.NRefundCharge = value.nRefundCharge;
        this.DRefundExpiredAt = value.dRefundExpiredAt;
        this.DRefundAcceptedAt = value.dRefundAcceptedAt;
        this.NvTicketRequestStatusName = value.nvTicketRequestStatusName;
        this.totalRefundCharge = this.NRefundCharge + this.NRefundServiceCharge;
        if (value.vFlightTypeId == this.OneWayType) {
          this.firstLegData = Array.of(data.booking[0].bookingJourney[0]);
          this.secondLegData = '';
          this.airport = this.firstLegData[0].airport;
          this.flightName = value.nvFlightName;
          if (this.firstLegData[0].fromCountry == this.firstLegData[0].toCountry) {
            this.isDomestic = true;
          } else {
            this.isInternational = true;
          }
        }
        if (value.vFlightTypeId == this.RoundTripType) {
          this.firstLegData = Array.of(data.booking[0].bookingJourney[0]);
          this.secondLegData = Array.of(data.booking[0].bookingJourney[1]);
          this.airport = this.firstLegData[0].airport + ',' + this.secondLegData[0].airport;
          this.flightName = value.nvFlightName;
          if (this.firstLegData[0].fromCountry == this.secondLegData[0].toCountry) {
            this.isDomestic = true;
          } else {
            this.isInternational = true;
          }
        }
        if (value.vFlightTypeId == this.MultiCityType) {
          for (let items of data.booking[0].bookingJourney) {
            this.firstLegData.push(items);
          }
          let FirstCountry = this.firstLegData[0].fromCountry;
          let SecondCountry = this.firstLegData[1].fromCountry;
          let ThirdCountry = '';
          let FourthCountry = '';
          if (this.firstLegData[2] != undefined && this.firstLegData[2] != null) {
            ThirdCountry = this.firstLegData[2].fromCountry;
          }
          if (this.firstLegData[3] != undefined && this.firstLegData[3] != null) {
            FourthCountry = this.firstLegData[3].fromCountry;
          }
          let FirstTrip = this.firstLegData[0].airport;
          let SecondTrip = this.firstLegData[1].airport;
          let ThirdTrip = '';
          let FourthTrip = '';
          if (this.firstLegData[2] != undefined && this.firstLegData[2] != null) {
            ThirdTrip = this.firstLegData[2].airport;
          }
          if (this.firstLegData[3] != undefined && this.firstLegData[3] != null) {
            FourthTrip = this.firstLegData[3].airport;
          }
          this.airport = FirstTrip + ',' + SecondTrip + ',' + ThirdTrip + ',' + FourthTrip;
          this.flightName = value.nvFlightName;
          if (FirstCountry == SecondCountry && ThirdCountry == '') {
            this.isDomestic = true;
            this.isDomMulticity = true
          }
          if (FirstCountry == SecondCountry && FirstCountry == ThirdCountry && FourthTrip == '') {
            // this.isDomestic = true;
            this.isDomMulticity = true
          }
          if (FirstCountry == SecondCountry && FirstCountry == ThirdCountry && FirstCountry == FourthTrip) {
            this.isDomestic = true;
            this.isDomMulticity = true
          }
          if (FirstCountry != FourthTrip && FourthTrip != '') {
            this.isInternational = true;
            this.isIntMulticity = true;
          }
          if (FirstCountry != ThirdCountry && FourthTrip == '') {
            this.isInternational = true;
            this.isIntMulticity = true;
          }
          if (FirstCountry != SecondCountry && ThirdCountry != '') {
            this.isInternational = true;
            this.isIntMulticity = true;
          }
          if (FirstCountry != SecondCountry && ThirdCountry == '') {
            this.isInternational = true;
            this.isIntMulticity = true;
          }
        }
      });

      this.bookingdetailsData = data.bookingdetails;
      data.bookingdetails.forEach((value: any, index: any) => {
        this.gdsFare = value.gdsFare;
        this.clientFare = value.clientFare;
        this.agentFare = value.agencyFare;
        this.AirlinesCode = value.tripFlight;
        this.adultnum = value.adultTotal;
        // this.childList = value.childTotal;
        this.infantnum = value.infantTotal;
        this.BookingManualId = value.vBookingManualId
      });
      this.bookingtravelerData = data.bookingtraveler;
      data.bookingtraveler.forEach((value: any, index: any) => {
        if (value.nvPassengerTypeName == 'Child') {
          //var dob = new Date(value.dBirthDate);
          //var month_diff = Date.now() - dob.getTime();
          //var age_dt = new Date(month_diff);
          //var year = age_dt.getUTCFullYear();
          //let age = Math.abs(year - 1970);
          this.childList.push(6);
          this.childListFinal.push(6);
        }
      });
      
      this.bookingfareData = data.bookingfare;
      this.bookinglogData = data.bookinglog;
      this.bookingstatusData = data.bookingticketlist;
      this.ticketlistData = data.ticketlist;
      this.bookingamountData = data.bookingamount;
      this.ssrlistData = data.ssrlist;
      this.bookingjourneys = data.bookingjourney;
      this.datechangefees = data.datechangefee;
      this.datechangefares = data.datechangefare;
      data.datechangefare.forEach((value: any, index: any) => {
        this.totalDateChangeFare = value.nDifferenceOfFare + value.nDifferenceOfTax + value.nFslcharge + value.nDateChangeCharge;
      });
      this.temporarycanclefares = data.temporarycancelfare;
      data.temporarycancelfare.forEach((value: any, index: any) => {
        this.totalReIssueFare = value.nDifferenceOfFare + value.nDifferenceOfTax;
        // this.totaldifferencefare = this.totaldifferencefare.toString();
      });
      this.airlineroutes = data.airlineroute;
      this.ticketdetail = data.ticketdetails;
      this.ticketData1=this.ticketdetail.find(x=>x.vBookingId===this.VBookingId);
      for (let item of this.airlineroutes) {
        if (item.vAirlineRouteEnableMasterId == this.VAirlineRouteEnableMasterId) {
          this.VAirlinesRouteEnableId = item.vAirlinesRouteEnableId;
          this.BB2bdateChange = item.bB2bdateChange;
          this.BB2brefundStatus = item.bB2brefundStatus;
          this.BB2btemporaryCancelStatus = item.bB2btemporaryCancelStatus;
          this.BB2bvoidStatus = item.bB2bvoidStatus;
        }
      }
      data.datechangefee.forEach((value: any, index: any) => {
        if (this.isDomestic == true) {
          this.DateChangeFee = value.nDateChangeFee
        }
        if (this.isInternational == true) {
          this.DateChangeFee = value.nDateChangeFee
        }
        if (this.isDomMulticity == true) {
          this.DateChangeFee = value.nDateChangeFee
        }
        if (this.isIntMulticity == true) {
          this.DateChangeFee = value.nDateChangeFee
        }
      });
      data.bookingjourney.forEach((value: any, index: any) => {
        if (value.iSerialNo == 1) {
          this.AirportFromId = value.vAirportFromId;
          this.CityFrom = value.cityFrom;
          this.CountryFrom = value.countryFrom;
          this.CountryFromCode = value.countryFromCode;
          this.CityTo = value.cityTo;
          this.CountryTo = value.countryTo;
          this.CountryToCode = value.countryToCode;
          this.AirportToId = value.vAirportToId;
          this.DepartureDateTime = value.dDepartureDateTime;
          this.ArrivalDateTime = value.dArrivalDateTime;
          this.VBookingJourneyId = value.vBookingJourneyId;
          this.INumberOfFlights = value.iNumberOfFlights;
          this.AirportFrom = value.airportFrom;
          this.AfCode = value.afcode;
          this.AirportTo = value.airportTo;
          this.AtCode = value.atcode;
          this.ItineraryNumber = value.vItineraryNumber
        }
        this.trip.push({
          AirportFromId: value.vAirportFromId,
          CityFrom: value.cityFrom,
          CountryFrom: value.countryFrom,
          CountryFromCode: value.countryFromCode,
          CityTo: value.cityTo,
          CountryTo: value.countryTo,
          CountryToCode: value.countryToCode,
          AirportToId: value.vAirportToId,
          DepartureDateTime: value.dDepartureDateTime,
          ArrivalDateTime: value.dArrivalDateTime,
          VBookingJourneyId: value.vBookingJourneyId,
          INumberOfFlights: value.iNumberOfFlights,
          ISerial: value.iSerialNo,
          AirportFrom: value.airportFrom,
          AfCode: value.afcode,
          AirportTo: value.airportTo,
          AtCode: value.atcode
        });
      });
      let dDate = new Date();
      let DepartureDate = new Date(this.DepartureDateTime)
      if (DepartureDate > dDate) {
        this.Departure = this.DepartureDateTime;
      } else {
        this.Departure = '';
      }
      this.cabintypes = data.cabintype;
      data.ticketlist.forEach((value: any, index: any) => {
        this.ModifyBooking = value.bModifyBooking;
        this.BillStatus = value.bBillStatus;
        this.Print = value.bPrint;
        this.SplitPnr = value.bSplitPnr;
        this.DataChange = value.bDataChange;
        this.PartialPnr = value.bPartialPnr;
        this.RefundPnr = value.bRefundPnr;
      });
      this.btnViewShow.nativeElement.click();
    }, err => {
      this.toastrService.error('Error', 'Data fetch problem');
      console.log(err);
    }, () => {
      this.isProcessing = false;
    });
  }

  displayBase64File(base64String: string): void {
    const fileType = this.getFileType(base64String);
    if (fileType === 'PDF') {
      this.displayPDF(base64String);
    } else if (fileType === 'JPG') {
      this.displayJPG(base64String);
    } else {
      console.error('Unsupported file type.');
    }
  }
  
  displayPDF(base64String: string): void {
    const pdfData = `data:application/pdf;base64,${base64String}`;
    const newWindow = window.open();
  
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>PDF Viewer</title>
          </head>
          <body>
            <embed src="${pdfData}" type="application/pdf" style="width: 100%; height: 100vh;">
          </body>
        </html>
      `);
    } else {
      console.error('Unable to open new window.');
    }
  }
  
  displayJPG(base64String: string): void {
    const imageData = `data:image/jpeg;base64,${base64String}`;
    const newWindow = window.open();
  
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>JPG Viewer</title>
          </head>
          <body>
            <img src="${imageData}" style="max-width: 100%; max-height: 100vh;">
          </body>
        </html>
      `);
    } else {
      console.error('Unable to open new window.');
    }
  }
  
  getFileType(base64String: string): string {
    const binaryData = atob(base64String);
    const uint8Array = new Uint8Array(binaryData.length);
  
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
  
    // Check the file signature
    if (uint8Array.length > 3 && uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
      return 'JPG';
    } else if (uint8Array.length > 3 && uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && uint8Array[2] === 0x44 && uint8Array[3] === 0x46) {
      return 'PDF';
    } else {
      return 'Unknown';
    }
  }
  
  AssignSupplierWithProviderId : any;
  save(e: any) {


    
    // var data = localStorage.getItem("flightDataIndividual");
    // this.item = JSON.parse(data!);
    
    // console.log(this.item);



    // const requestData: RouteWiseMarkupDiscountDetails = {
    //   cabinTypeId: this.item.cabinTypeId,
    //   discountTypeId:this.item.fareData.discountTypeId,
    //   discountTypePercent:parseFloat(this.item.fareData.discountTypePercent),
    //   markupTypeId:this.item.fareData.markupTypeId,
    //   markupPercent:parseFloat(this.item.fareData.markupPercent)
    // };

    // this.authService.getRouteWiseMarkUpDiscountDetails(requestData).subscribe((data) => {
    //   console.log(data);
    //   this.toastrService.success('Success', 'Booking data saved successfully.');
    // }, error => {
    //   this.toastrService.error('Error', 'Booking data saved failed.');
    //   console.log(error);
    // });







    
     console.log(this.ticketData1.dIssueDateTime);
    if(this.datechangeshow != true){
      if (this.bookingsuccessForm.valid) {
        this.bookingsuccessModel = Object.assign({}, this.bookingsuccessForm.value);
        let ticketStatus = e.target.innerHTML;
        if(ticketStatus == 'Date Change'){
          ticketStatus = 'Flight Schedule';
        }
        if(e.target.id == this.datechangeofferaccept){
          ticketStatus = 'Accept Date Change Offer';
        }

        this.authService.getBookingJourneybyBookingId(this.VBookingId).subscribe((data) => {
          this.AssignSupplierWithProviderId = data.vAssignSupplierWithProviderId;
          console.log(this.AssignSupplierWithProviderId);
        }, error => {
          console.log(error);
        });


        this.bookingsuccessModel.VBookingId = this.VBookingId;
        this.bookingsuccessModel.VBookingManualId = this.VBookingManualId;
        this.bookingsuccessModel.Id = this.Id;
        this.bookingsuccessModel.VAirlineRouteEnableMasterId = this.VAirlineRouteEnableMasterId;
        this.bookingsuccessModel.DStartDate = this.DStartDate;
        this.bookingsuccessModel.DEndDate = this.DEndDate;
        this.bookingsuccessModel.BIsTicketed = this.BIsTicketed;
        this.bookingsuccessModel.VFlightTypeId = this.VFlightTypeId;
        this.bookingsuccessModel.VCabinTypeId = this.VCabinTypeId;
        this.bookingsuccessModel.NvCreationUserSine = this.NvCreationUserSine;
        this.bookingsuccessModel.DCreationDateTime = this.DCreationDateTime;
        this.bookingsuccessModel.VPrimeHostId = this.VPrimeHostId;
        this.bookingsuccessModel.VTicketProcessStatusId = e.target.id;
        this.bookingsuccessModel.VPlatformId = this.VPlatformId;
        this.bookingsuccessModel.BStatus = this.BStatus;
        this.bookingsuccessModel.NMinimumAmountTobePay = this.NMinimumAmountTobePay;
        this.bookingsuccessModel.DPartialPaymentOfferExpiredAt = this.DPartialPaymentOfferExpiredAt;
        this.bookingsuccessModel.DRemainingAmountTobePayAt = this.DRemainingAmountTobePayAt;
        this.bookingsuccessModel.DPartialPaymentOfferAcceptedAt = this.DPartialPaymentOfferAcceptedAt;
        this.bookingsuccessModel.NRefundServiceCharge = this.NRefundServiceCharge;
        this.bookingsuccessModel.NRefundCharge = this.NRefundCharge;
        this.bookingsuccessModel.DRefundExpiredAt = this.DRefundExpiredAt;
        this.bookingsuccessModel.DRefundAcceptedAt = this.DRefundAcceptedAt;
        this.bookingsuccessModel.NvTicketRequestStatusName = this.NvTicketRequestStatusName;
        this.bookingsuccessModel.dIssueDateTime=this.ticketData1.dIssueDateTime;
        Swal.fire({
          title: 'Do you want to change the status' + '"' + ticketStatus + '" ' + '?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            this.bookingsuccessModel.VBookingId = (this.bookingsuccessModel.VBookingId === '') ? null : this.bookingsuccessModel.VBookingId;
            if (e.target.id == this.cancel) {
              this.authService.CancelBooking(this.bookingsuccessModel).subscribe(() => {
                this.authService.saveBookingStatus(this.bookingsuccessModel).subscribe(() => {
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              }, error => {
                this.toastrService.error('Error', 'Booking data saved failed.');
                console.log(error);
              });
            }
            if (e.target.id == this.partialpayment) {
              this.authService.savePartialPayment(this.bookingsuccessModel).subscribe(() => {
                this.toastrService.success('Success', 'Booking data saved successfully.');
                const url = this.router.url;
                this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                  this.router.navigate([url]);
                });
              }, error => {
                this.toastrService.error('Error', 'Booking data saved failed.');
                console.log(error);
              });
            }
            if (e.target.id == this.partialpaymentaccept) {
              if(this.amount >= this.NMinimumAmountTobePay){
                this.bookingsuccessModel.DPartialPaymentOfferAcceptedAt = new Date();
                this.authService.savePartialPayment(this.bookingsuccessModel).subscribe(() => {
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              }else{
                this.toastrService.error('Error', 'You have not enough balance');
              }
            }
            if (e.target.id == this.partialpaymentreject) {
              this.authService.savePartialPayment(this.bookingsuccessModel).subscribe(() => {
                this.toastrService.success('Success', 'Booking data saved successfully.');
                const url = this.router.url;
                this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                  this.router.navigate([url]);
                });
              }, error => {
                this.toastrService.error('Error', 'Booking data saved failed.');
                console.log(error);
              });
            }
            if (e.target.id == this.refundrequest) {
              if (this.BB2brefundStatus == true) {
                this.authService.saveRefund(this.bookingsuccessModel).subscribe(() => {
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              } else {
                this.toastrService.warning('Error', 'You cannot request a refund for this airline.');
              }
            }
            if (e.target.id == this.refundaccept) {
              if(this.amount >= this.totalRefundCharge){
                this.bookingsuccessModel.DRefundAcceptedAt = new Date();
                this.authService.saveRefund(this.bookingsuccessModel).subscribe(() => {
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              }else{
                this.toastrService.error('Error', 'You have not enough balance');
              }
            }
            if (e.target.id == this.refundreject) {
              this.authService.saveRefund(this.bookingsuccessModel).subscribe(() => {
                this.toastrService.success('Success', 'Booking data saved successfully.');
                const url = this.router.url;
                this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                  this.router.navigate([url]);
                });
              }, error => {
                this.toastrService.error('Error', 'Booking data saved failed.');
                console.log(error);
              });
            }
            if (e.target.id == this.voidrequest) {
              if (this.BB2bvoidStatus == true) {
                this.authService.saveVoid(this.bookingsuccessModel).subscribe(() => {
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              } else {
                this.toastrService.warning('Error', 'You cannot request a void for this airline.');
              }
            }
            if (e.target.id == this.voidcancel) {
              this.authService.saveVoid(this.bookingsuccessModel).subscribe(() => {
                this.toastrService.success('Success', 'Booking data saved successfully.');
                const url = this.router.url;
                this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                  this.router.navigate([url]);
                });
              }, error => {
                this.toastrService.error('Error', 'Booking data saved failed.');
                console.log(error);
              });
            }
            if (e.target.id == this.temporarycancel) {
              if (this.BB2btemporaryCancelStatus == true) {
                // this.splitbutton = false;
                this.authService.CancelBooking(this.bookingsuccessModel).subscribe(() => {
                    this.toastrService.success('Success', 'Booking data saved successfully.');
                    const url = this.router.url;
                    this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                      this.router.navigate([url]);
                    });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              } else {
                this.toastrService.warning('Error', 'You cannot request a temporary cancel for this airline.');
              }
            }
            if (e.target.id == this.reissue) {
                this.reissueshow = true;
                this.splitbutton = false;
                this.startDepartureDate = [];
                setTimeout(() => {
                  flatpickr(".date-form", {
                    enableTime: false,
                    dateFormat: "d-m-Y",
                    minDate: "today"
                  });
                  flatpickr(".date-to", {
                    enableTime: false,
                    dateFormat: "d-m-Y",
                    minDate: this.startDate
                  });
                });
            }
            if (e.target.id == this.datechange) {
              if (this.BB2bdateChange == true) {
                this.datechangeshow = true;
                this.splitbutton = false;
                this.startDepartureDate = [];
                setTimeout(() => {
                  flatpickr(".date-form", {
                    enableTime: false,
                    dateFormat: "d-m-Y",
                    minDate: "today"
                  });
                  flatpickr(".date-to", {
                    enableTime: false,
                    dateFormat: "d-m-Y",
                    minDate: this.startDate
                  });
                });
              } else {
                this.toastrService.warning('Error', 'You cannot request a date change for this airline.');
              }
            }
            if (e.target.id == this.datechangecancel) {
              this.authService.saveDateChangerequest(this.bookingsuccessModel).subscribe(() => {
                this.splitbutton = true;
                this.toastrService.success('Success', 'Booking data saved successfully.');
                const url = this.router.url;
                this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                  this.router.navigate([url]);
                });
              }, error => {
                this.toastrService.error('Error', 'Booking data saved failed.');
                console.log(error);
              });
            }
            if (e.target.id == this.datechangeoffercancel) {
              this.authService.saveDateChangerequest(this.bookingsuccessModel).subscribe(() => {
                this.splitbutton = true;
                this.toastrService.success('Success', 'Booking data saved successfully.');
                const url = this.router.url;
                this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                  this.router.navigate([url]);
                });
              }, error => {
                this.toastrService.error('Error', 'Booking data saved failed.');
                console.log(error);
              });
            }
            if (e.target.id == this.datechangeofferaccept) {
              if(this.amount >= this.totalDateChangeFare){
                this.authService.saveDateChangerequest(this.bookingsuccessModel).subscribe(() => {
                  this.splitbutton = true;
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.datechangeoffershow = false;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              }else{
                this.toastrService.error('Error', 'You have not enough balance');
              }
            }
            if (e.target.id == this.reissueofferreject) {
              this.authService.saveReIssuerequest(this.bookingsuccessModel).subscribe(() => {
                this.splitbutton = true;
                this.toastrService.success('Success', 'Booking data saved successfully.');
                const url = this.router.url;
                this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                  this.router.navigate([url]);
                });
              }, error => {
                this.toastrService.error('Error', 'Booking data saved failed.');
                console.log(error);
              });
            }
            if (e.target.id == this.reissueofferaccept) {
              if(this.amount >= this.totalReIssueFare){
                this.authService.saveReIssuerequest(this.bookingsuccessModel).subscribe(() => {
                  this.splitbutton = true;
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.reissueofferoffershow = false;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              }else{
                this.toastrService.error('Error', 'You have not enough balance');
              }
            }
            if (e.target.id != this.refundrequest && e.target.id != this.voidrequest && e.target.id != this.temporarycancel && e.target.id != this.datechange && e.target.id != this.reissue) {
              //debugger;
              if(e.target.id=='0AC26545-57D9-476A-946F-7B99EA9BC8D6'){ // this ID is for issue ticket

                if(this.amount>=this.bookingamountData[0].due){ // check balance
                  
                  //**For Live**/

                  //#region if due is 0 then not need to deduct agent fare 
                  if(this.bookingamountData[0].due=='0'){
                    if(this.bookingfareData[0].ticketIssueType=='Manual'){
                      this.authService.saveBookingStatus(this.bookingsuccessModel).subscribe(() => {
                        this.toastrService.success('Success', 'Manual ticket issued successfully.');
                        const url = this.router.url;
                        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                          this.router.navigate([url]);
                        });
                      }, error => {
                        this.toastrService.error('Error', 'Manual ticket issue failed.');
                        console.log(error);
                      });
                    }
                    if(this.bookingfareData[0].ticketIssueType=='Auto'){
                      const requestData: IssueTicketSabre[] = [{
                        PnrID: this.bookingdetailsData[0].itineraryNumber.trim(),
                          ProviderId: this.bookingdetailsData[0].providerId,
                          Commission: this.bookingfareData[0].ticketIssueTypeCommission,
                          PccNo:this.bookingdetailsData[0].pcc.trim(),
                          AssignSupplierWithProviderId:this.AssignSupplierWithProviderId.trim()
                      }];
                      
                      this.authService.postSabreIssueTicket(requestData).subscribe((data) => {
                        if(data[0].AirTicketRS.ApplicationResults.status=='Complete'){
                          this.toastrService.success('Success', 'Auto ticket issued successfully.');
                        const url = this.router.url;
                        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                          this.router.navigate([url]);
                        });
                        }
                      }, error => {
                        this.toastrService.error('Error', 'Auto ticket issue failed.');
                        console.log(error);
                      });
                    }
                  }
                  //#endregion

                  //#region if due is greater then 0 then need to deduct agent fare
                  else{
                    this.authService.deductAgentFare(this.bookingsuccessModel.VBookingId.toString().trim()).subscribe(() => { // deduct balance
                    this.bookingsuccessModel.NMinimumAmountTobePay = this.bookingamountData[0].due;
                    this.toastrService.success('Success', 'Balance Deduct successfully.');
                      if(this.bookingfareData[0].ticketIssueType=='Manual'){
                        this.authService.saveBookingStatus(this.bookingsuccessModel).subscribe(() => {
                          this.toastrService.success('Success', 'Manual ticket issued successfully.');
                          const url = this.router.url;
                          this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                            this.router.navigate([url]);
                          });
                        }, error => {
                          this.toastrService.error('Error', 'Manual ticket issue failed.');
                          console.log(error);
                        });
                      }
                      if(this.bookingfareData[0].ticketIssueType=='Auto'){
                        const requestData: IssueTicketSabre[] = [{
                          PnrID: this.bookingdetailsData[0].itineraryNumber.trim(),
                            ProviderId: this.bookingdetailsData[0].providerId,
                            Commission: this.bookingfareData[0].ticketIssueTypeCommission,
                            PccNo:this.bookingdetailsData[0].pcc.trim(),
                            AssignSupplierWithProviderId:this.AssignSupplierWithProviderId.trim()
                        }];
                        
                        this.authService.postSabreIssueTicket(requestData).subscribe((data) => {
                          if(data[0].AirTicketRS.ApplicationResults.status=='Complete'){
                            this.toastrService.success('Success', 'Auto ticket issued successfully.');
                          const url = this.router.url;
                          this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                            this.router.navigate([url]);
                          });
                          }
                        }, error => {
                          this.toastrService.error('Error', 'Auto ticket issue failed.');
                          console.log(error);
                        });
                      }
                    

                  }, error => {
                    this.toastrService.error('Error', 'Deduction failed.');
                    console.log(error);
                  });
                  }
                  //#endregion

                }else{
                  this.toastrService.error('Error', 'Insufficient Balance.');
                }
              }
              if(e.target.id=='EE518BFA-2198-4489-9C79-19575C57688E'){ // this ID is for Extended time limit
                this.authService.saveBookingStatus(this.bookingsuccessModel).subscribe(() => {
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              }
              if(e.target.id=='5C47DB60-B228-4475-A904-1C875E54AA46'){ // this ID is for Cancel Issue Request
                this.authService.saveBookingStatus(this.bookingsuccessModel).subscribe(() => {
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate([url]);
                  });
                }, error => {
                  this.toastrService.error('Error', 'Booking data saved failed.');
                  console.log(error);
                });
              }
            }
          }
        });
      } else {
        this.appComponent.validateAllFormFields(this.bookingsuccessForm);
        this.toastrService.warning('Error', 'Required field is not filled');
      }
    }else{
      this.toastrService.warning('Error', 'You already open the panel. First close it then try again.');
    }
  }
  
  CreateSplitPNRForm() {
    this.splitForm = this.fb.group({
      VBookingId: ['', Validators.nullValidator],
      AssignJourneyWithTraveler: this.fb.array([]),
    });
    this.AddAssignJourneyWithTraveler('');
  }
  get AssignJourneyWithTraveler(): FormArray {
    return this.splitForm.get('AssignJourneyWithTraveler') as FormArray;
  }
  AddAssignJourneyWithTraveler(ajwt: any) {
    this.AssignJourneyWithTraveler.push(this.fb.group({
      VAssignJourneyWithTravelerId: [ajwt.vAssignJourneyWithTravelerId, Validators.nullValidator],
      VBookingTravelerId: [ajwt.vBookingTravelerId, Validators.nullValidator],
      ISerial: [ajwt.iSerial, Validators.nullValidator]
    }));
  }
  splitvalue(e: any) {
    // console.log(e);
    for (let item of this.bookingtravelers) {
      if (item.id == e.target.value) {
        this.bookingtravelerId.push({ 'VBookingTravelerId': item.id, 'VAssignJourneyWithTravelerId': item.text, 'ISerial': item.text7 });
      }
    }
  }
  split() {
    if (this.splitForm.valid) {
      this.isBookClicked = true;
      this.splitModel = Object.assign({}, this.bookingsuccessForm.value);
      this.splitModel.VBookingId = this.VBookingId;
      this.splitModel.AssignJourneyWithTraveler = this.bookingtravelerId;
      this.authService.splitBooking(this.splitModel).subscribe(() => {
        this.toastrService.success('Success', 'Booking data saved successfully.');
        this.isBookClicked = false;
        const url = this.router.url;
        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate([url]);
        });
      }, error => {
        this.toastrService.error('Error', 'Booking data saved failed.');
        console.log(error);
        this.isBookClicked = false;
      });
    }
  }

  splitcancel() {
    this.splitPNRshow = false;
  }

  choiceCabin(e: any) {
    // console.log(e);
    this.cabin = e.target.value;
  }
  choiceStartDate(e: any) {
    let startDay = e.target.value;
    this.startDate = startDay.split('-').reverse().join('-');
    this.startDepartureDate.push({ 'id': e.target.id, 'Date': this.startDate });
  }
  choiceEndDate(e: any) {
    let endDay = e.target.value;
    this.endDate = endDay.split('-').reverse().join('-');
    // console.log(this.endDate);
  }

  flightSearchDataSet(isSave: boolean = false) {
    if (this.isDomMulticity == true) {
      var maxConnection = $("#maxConnection").val();
      let multiDeparture: any[] = [];
      let multiDeparture1: any[] = [];
      let multiArrival: any[] = [];
      let multiArrival1: any[] = [];
      this.isMulticity = this.isDomMulticity;
      for(let item of this.trip){
        let findInd=this.startDepartureDate.findIndex((x: { id: string | any[]; })=>x.id.indexOf(item.VBookingJourneyId)>-1);
        if(findInd==-1)
        {
          this.missingtrip.push(item);
          var currentDate = new Date();
          var day = currentDate.getDate();
          var month = currentDate.getMonth() + 1;
          var year = currentDate.getFullYear();
          var thedate = item.DepartureDateTime.split('T');
          let date = '';
          let Departuredate = thedate[0];
          if(month < 10){
            date = year + "-" + "0" + month + "-" + day;
          }else{
            date = year + "-" + month + "-" + day;
          }

          if(Departuredate > date){
            this.missingTripDate.push({ 'id': item.VBookingJourneyId, 'Date': Departuredate });
          }else{
            let tomorrow =  new Date();
            var day = tomorrow.getDate() + 1;
            var month = tomorrow.getMonth() + this.extendDay;
            var year = tomorrow.getFullYear();
            let date = '';
            if(month < 10){
              date = year + "-" + "0" + month + "-" + day;
            }else{
              date = year + "-" + month + "-" + day;
            }
            this.missingTripDate.push({ 'id': item.VBookingJourneyId, 'Date': date });
          }
        }
        this.extendDay += 1;
      }
      if(this.missingtrip.length>0){
        for(let mitem of this.missingtrip){
          for (let titem of this.trip) {
            for(let item of this.missingTripDate){
              if (titem.VBookingJourneyId == item.id) {
                multiDeparture.push({
                  Id: mitem.AirportFromId,
                  BookingJourneyId: mitem.VBookingJourneyId,
                  CityCode: mitem.AfCode,
                  CityName: mitem.CityFrom,
                  CountryCode: mitem.CountryFromCode,
                  CountryName: mitem.CountryFrom,
                  AirportName: mitem.AirportFrom,
                  serial: mitem.ISerial,
                  Date: item.Date,
                });
                multiArrival.push({
                  Id: mitem.AirportToId,
                  CityCode: mitem.AtCode,
                  CityName: mitem.CityTo,
                  CountryCode: mitem.CountryToCode,
                  CountryName: mitem.CountryTo,
                  AirportName: mitem.AirportTo,
                  serial: mitem.ISerial
                });
              }
            }
          }
        }
      }
      for (let i = 0; i < this.trip.length; i++) {
        for(let item of this.startDepartureDate){
          if (this.trip[i].VBookingJourneyId == item.id) {
            multiDeparture.push({
              Id: this.trip[i].AirportFromId,
              BookingJourneyId: this.trip[i].VBookingJourneyId,
              CityCode: this.trip[i].AfCode,
              CityName: this.trip[i].CityFrom,
              CountryCode: this.trip[i].CountryFromCode,
              CountryName: this.trip[i].CountryFrom,
              AirportName: this.trip[i].AirportFrom,
              serial: this.trip[i].ISerial,
              Date: item.Date,
            });
            multiArrival.push({
              Id: this.trip[i].AirportToId,
              CityCode: this.trip[i].AtCode,
              CityName: this.trip[i].CityTo,
              CountryCode: this.trip[i].CountryToCode,
              CountryName: this.trip[i].CountryTo,
              AirportName: this.trip[i].AirportTo,
              serial: this.trip[i].ISerial
            });

            this.selectedDepartureCountryCode = this.trip[i].CountryFromCode;
            this.selectedReturnCountryCode = this.trip[i].CountryToCode;
          }
        }
      }
      if(this.missingtrip.length>0){
        for(let titem of this.trip){
          for(let item of multiDeparture){
            if(titem.ISerial == item.serial){
              if(item.serial == 1){
                multiDeparture1.push({
                  Id: item.Id,
                  BookingJourneyId: item.BookingJourneyId,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName,
                  Date: item.Date,
                })
              }
              if(item.serial == 2){
                multiDeparture1.push({
                  Id: item.Id,
                  BookingJourneyId: item.BookingJourneyId,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName,
                  Date: item.Date,
                })
              }
              if(item.serial == 3){
                multiDeparture1.push({
                  Id: item.Id,
                  BookingJourneyId: item.BookingJourneyId,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName,
                  Date: item.Date,
                })
              }
              if(item.serial == 4){
                multiDeparture1.push({
                  Id: item.Id,
                  BookingJourneyId: item.BookingJourneyId,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName,
                  Date: item.Date,
                })
              }
            }
          }
          for(let item of multiArrival){
            if(titem.ISerial == item.serial){
              if(item.serial == 1){
                multiArrival1.push({
                  Id: item.Id,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName
                })
              }
              if(item.serial == 2){
                multiArrival1.push({
                  Id: item.Id,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName
                })
              }
              if(item.serial == 3){
                multiArrival1.push({
                  Id: item.Id,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName
                })
              }
              if(item.serial == 4){
                multiArrival1.push({
                  Id: item.Id,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName
                })
              }
            }
          }
        }
        multiDeparture = [];
        multiArrival = [];
        multiDeparture = multiDeparture1;
        multiArrival = multiArrival1;
      }
      let loaderData = {
        Departure: multiDeparture,
        Arrival: multiArrival,
        adult: this.adultnum,
        Journey: this.bookingData,
        missingtrip: this.missingtrip,
        infant: this.infantnum,
        classType: this.cabin,
        airlines: this.AirlinesCode,
        tripTypeId: this.VFlightTypeId,
        childList: this.childList,
        isOneWay: this.isOneway,
        stop: 2,
        ticketProcessStatus: this.VTicketProcessStatusId,
        isRoundTrip: this.isRoundtrip,
        isMultiCity: this.isDomMulticity,
        gdsTotal: this.gdsFare,
        clientTotal: this.clientFare,
        agentTotal: this.agentFare,
        ItineraryNumber: this.ItineraryNumber,
        BookingManualId: this.BookingManualId,
        pagePath: this.queryString,
        DateChangeFee: this.DateChangeFee
      };
      this._setStoreFlightData(loaderData, true);
    }
    if (this.isIntMulticity == false && this.isDomMulticity == false) {
      if (this.VFlightTypeId == this.RoundTripType) {
        if (this.startDate == null) {
          this.startDate = this.endDate;
          this.firstLeg = this.firstLegData;
        }
      }
      // if (this.startDate == null) {
      //   this.startDate = this.firstLegData.departureDate
      // }
      if (this.endDate == null) {
        this.endDate = '';
      }
      this.selectedDepartureDate = this.startDate;
      this.selectedClassTypeCode = this.cabin;
      this.selectedReturnDate = this.endDate;
      this.selectedAirportFromId = this.AirportFromId;
      this.selectedDepartureCity = this.CityFrom;
      this.selectedDepartureCountry = this.CountryFrom;
      this.selectedDepartureCountryCode = this.CountryFromCode;

      this.selectedAirportToId = this.AirportToId;
      this.selectedReturnCity = this.CityTo;
      this.selectedReturnCountry = this.CountryTo;
      this.selectedReturnCountryCode = this.CountryToCode;

      // this.childListFinal = this.childList;
      let childList = this.childList;
      let ticket = this.datechange;

      let fromFlightCode = this.AfCode;
      let toFlightCode = this.AtCode;
      let fromFlightName = this.selectedDepartureCity;
      let toFlightName = this.selectedReturnCity;
      let fromAirportName = this.AirportFrom;
      let fromCountryName = this.selectedDepartureCountry;
      let toAirportName = this.AirportTo;
      let toCountryName = this.selectedReturnCountry;
      let tripTypeId = this.VFlightTypeId;
      let airlines = this.AirlinesCode;

      if (this.selectedReturnDate != "" && this.selectedReturnDate != null) {
        this.isOneway = false;
        this.isRoundtrip = true;
      }
      if (this.selectedReturnDate == "") {
        this.isOneway = true;
        this.isRoundtrip = false;
      }
      if (this.selectedAirportFromId != this.selectedAirportToId) {
        let loaderData = {
          fromFlightId: this.selectedAirportFromId, fromFlightCode: fromFlightCode, fromFlightName: fromFlightName,
          toFlightId: this.selectedAirportToId, toFlightName: toFlightName, toFlightCode: toFlightCode,
          fromAirportName: fromAirportName, toAirportName: toAirportName, fromCountryCode: this.selectedDepartureCountryCode,
          fromCountryName: fromCountryName, toCountryCode: this.selectedReturnCountryCode, toCountryName: toCountryName,
          departureDate: this.selectedDepartureDate, returnDate: this.selectedReturnDate, adult: this.adultnum, startDate: this.firstLegData[0].dDepartureDateTime,
          childList: this.childList, ticketstatusId: ticket, firstLegData: this.firstLeg, clientFare: this.clientFare,ticketProcessStatus: this.VTicketProcessStatusId,
          infant: this.infantnum, classType: this.selectedClassTypeCode, airlines: airlines, stop: 2, tripTypeId: tripTypeId, ItineraryNumber: this.ItineraryNumber,
          BookingManualId: this.BookingManualId, isOneWay: this.isOneway, isRoundTrip: this.isRoundtrip, isMultiCity: this.isMulticity, pagePath: this.queryString,
          gdsTotal: this.gdsFare, clientTotal: this.clientFare, agentTotal: this.agentFare, DateChangeFee: this.DateChangeFee
        };
        this._setStoreFlightData(loaderData, true);
      }
    }
    if (this.isIntMulticity == true) {
      var maxConnection = $("#maxConnection").val();
      let multiDeparture: any[] = [];
      let multiArrival: any[] = [];
      let multiDeparture1: any[] = [];
      let multiArrival1: any[] = [];
      this.isMulticity = this.isIntMulticity;
      for(let item of this.trip){
        for(let citem of this.startDepartureDate){
          if(item.VBookingJourneyId == citem.id){
            this.changetrip.push(item);
          }
        }
        let findInd=this.startDepartureDate.findIndex((x: { id: string | any[]; })=>x.id.indexOf(item.VBookingJourneyId)>-1);
        if(findInd==-1)
        {
          this.missingtrip.push(item);
          var currentDate = new Date();
          var day = currentDate.getDate();
          var month = currentDate.getMonth() + 1;
          var year = currentDate.getFullYear();
          var thedate = item.DepartureDateTime.split('T');
          let date = '';
          let Departuredate = thedate[0];
          if(month < 10){
            date = year + "-" + "0" + month + "-" + day;
          }else{
            date = year + "-" + month + "-" + day;
          }

          if(Departuredate > date){
            this.missingTripDate.push({ 'id': item.VBookingJourneyId, 'Date': Departuredate });
          }else{
            let tomorrow =  new Date();
            var day = tomorrow.getDate() + this.extendDay;
            var month = tomorrow.getMonth() + 1;
            var year = tomorrow.getFullYear();
            let date = '';
            if(month < 10){
              date = year + "-" + "0" + month + "-" + day;
            }else{
              date = year + "-" + month + "-" + day;
            }
            this.missingTripDate.push({ 'id': item.VBookingJourneyId, 'Date': date });
          }
        }
        this.extendDay += 1;
      }
      if(this.missingtrip.length>0){
        for(let mitem of this.missingtrip){
          for (let titem of this.trip) {
            for(let item of this.missingTripDate){
              if (titem.VBookingJourneyId == item.id) {
                multiDeparture.push({
                  Id: mitem.AirportFromId,
                  BookingJourneyId: mitem.VBookingJourneyId,
                  CityCode: mitem.AfCode,
                  CityName: mitem.CityFrom,
                  CountryCode: mitem.CountryFromCode,
                  CountryName: mitem.CountryFrom,
                  AirportName: mitem.AirportFrom,
                  serial: mitem.ISerial,
                  Date: item.Date,
                });
                multiArrival.push({
                  Id: mitem.AirportToId,
                  CityCode: mitem.AtCode,
                  CityName: mitem.CityTo,
                  CountryCode: mitem.CountryToCode,
                  CountryName: mitem.CountryTo,
                  AirportName: mitem.AirportTo,
                  serial: mitem.ISerial
                });
              }
            }
          }
        }
      }
      for (let i = 0; i < this.trip.length; i++) {
        for(let item of this.startDepartureDate){
          if (this.trip[i].VBookingJourneyId == item.id) {
            multiDeparture.push({
              Id: this.trip[i].AirportFromId,
              BookingJourneyId: this.trip[i].VBookingJourneyId,
              CityCode: this.trip[i].AfCode,
              CityName: this.trip[i].CityFrom,
              CountryCode: this.trip[i].CountryFromCode,
              CountryName: this.trip[i].CountryFrom,
              AirportName: this.trip[i].AirportFrom,
              serial: this.trip[i].ISerial,
              Date: item.Date,
            });
            multiArrival.push({
              Id: this.trip[i].AirportToId,
              CityCode: this.trip[i].AtCode,
              CityName: this.trip[i].CityTo,
              CountryCode: this.trip[i].CountryToCode,
              CountryName: this.trip[i].CountryTo,
              AirportName: this.trip[i].AirportTo,
              serial: this.trip[i].ISerial
            });

            this.selectedDepartureCountryCode = this.trip[i].CountryFromCode;
            this.selectedReturnCountryCode = this.trip[i].CountryToCode;
          }
        }
      }
      if(this.missingtrip.length>0){
        for(let titem of this.trip){
          for(let item of multiDeparture){
            if(titem.ISerial == item.serial){
              if(item.serial == 1){
                multiDeparture1.push({
                  Id: item.Id,
                  BookingJourneyId: item.BookingJourneyId,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName,
                  Date: item.Date,
                })
              }
              if(item.serial == 2){
                multiDeparture1.push({
                  Id: item.Id,
                  BookingJourneyId: item.BookingJourneyId,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName,
                  Date: item.Date,
                })
              }
              if(item.serial == 3){
                multiDeparture1.push({
                  Id: item.Id,
                  BookingJourneyId: item.BookingJourneyId,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName,
                  Date: item.Date,
                })
              }
              if(item.serial == 4){
                multiDeparture1.push({
                  Id: item.Id,
                  BookingJourneyId: item.BookingJourneyId,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName,
                  Date: item.Date,
                })
              }
            }
          }
          for(let item of multiArrival){
            if(titem.ISerial == item.serial){
              if(item.serial == 1){
                multiArrival1.push({
                  Id: item.Id,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName
                })
              }
              if(item.serial == 2){
                multiArrival1.push({
                  Id: item.Id,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName
                })
              }
              if(item.serial == 3){
                multiArrival1.push({
                  Id: item.Id,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName
                })
              }
              if(item.serial == 4){
                multiArrival1.push({
                  Id: item.Id,
                  CityCode: item.CityCode,
                  CityName: item.CityName,
                  CountryCode: item.CountryCode,
                  CountryName: item.CountryName,
                  AirportName: item.AirportName
                })
              }
            }
          }
        }
        multiDeparture = [];
        multiArrival = [];
        multiDeparture = multiDeparture1;
        multiArrival = multiArrival1;
      }
      let loaderData = {
        Departure: multiDeparture,
        Arrival: multiArrival,
        Journey: this.bookingData,
        ChangesTrip: this.changetrip,
        MissingTrip: this.missingtrip,
        adult: this.adultnum,
        childList: this.childList,
        infant: this.infantnum,
        classType: this.cabin,
        airlines: this.AirlinesCode,
        tripTypeId: this.VFlightTypeId,
        isOneWay: this.isOneway,
        stop: '2',
        ticketProcessStatus: this.VTicketProcessStatusId,
        Date: this.startDepartureDate,
        isRoundTrip: this.isRoundtrip,
        isMultiCity: this.isIntMulticity,
        gdsTotal: this.gdsFare,
        ItineraryNumber: this.ItineraryNumber,
        BookingManualId: this.BookingManualId,
        clientTotal: this.clientFare,
        agentTotal: this.agentFare,
        pagePath: this.queryString,
        DateChangeFee: this.DateChangeFee
      };
      this._setStoreFlightData(loaderData, true);
    }
  }
  private _setStoreFlightData(loaderData: any, isSave: boolean) {
    if ("loaderData" in localStorage) {
      localStorage.removeItem("loaderData");
    }
    localStorage.setItem('loaderData', JSON.stringify(loaderData));
    if (isSave) {
      this._navigationWork();
    }
  }
  private _navigationWork(): void {
    let checkFromFlight = this.selectedDepartureCountryCode;
    let checkToFlight = this.selectedReturnCountryCode;
    if (checkFromFlight == checkToFlight) {
      if (this.isOneway) {
        this.router.navigate(['/home/date-change-domestic']);
      } else if (this.isRoundtrip) {
        this.router.navigate(['/home/date-change-domestic']);
      } else if (this.isMulticity) {
        this.router.navigate(['/home/date-change-domestic-multicity']);
      }
    } else {
      if (this.isOneway) {
        this.router.navigate(['/home/date-change-international']);
      } else if (this.isRoundtrip) {
        this.router.navigate(['/home/date-change-international']);
      } else if (this.isMulticity) {
        this.router.navigate(['/home/date-change-international-multicity']);
      }
    }

  }

  getFlightWrapText(data: any, data2: any): any {
    let ret: any = "";
    try {
      for (let item of data.flightSegmentData) {
        ret += item.departureAirportCode + "-" + item.arrivalAirportCode + ",";
      }
      for (let item of data2.flightSegmentData) {
        ret += item.departureAirportCode + "-" + item.arrivalAirportCode + ",";
      }
      ret = ret.substring(0, ret.length - 1);
    } catch (exp) { }
    if (this.isIntMulticity == true) {
      try {
        for (let item of data) {
          for (let items of item.flightSegmentData) {
            ret += items.departureAirportCode + "-" + items.arrivalAirportCode + ",";
          }
        }
        for (let item of data2.flightSegmentData) {
          ret += item.departureAirportCode + "-" + item.arrivalAirportCode + ",";
        }
        ret = ret.substring(0, ret.length - 1);
      } catch (exp) { }
    }
    if (this.isDomMulticity == true) {
      try {
        for (let item of data) {
          for (let items of item.flightSegmentData) {
            ret += items.departureAirportCode + "-" + items.arrivalAirportCode + ",";
          }
        }
        for (let item of data2.flightSegmentData) {
          ret += item.departureAirportCode + "-" + item.arrivalAirportCode + ",";
        }
        ret = ret.substring(0, ret.length - 1);
      } catch (exp) { }
    }
    return ret;
  }

  getAdjustmentDate(date: any, adj: any, adjSegement: any = undefined): any {
    let ret: any = "";
    try {
      if (adj == undefined || adj == "") {
        adj = 0;
      }
      if (adjSegement == undefined || adjSegement == "") {
        adjSegement = 0;
      }
      adj += adjSegement;
      let addedDate = moment(date).add(adj, 'days');
      ret = addedDate;
    } catch (exp) { }
    return ret;
  }

  fareShowHideAction() {
    if ($("#fareDetailsWrap").css('display') == 'block') {
      $("#fareDetailsWrap").hide('slow');
    } else {
      $("#fareDetailsWrap").show('slow');
    }
  }

  getFirstShow(ind: number): string {
    if (ind == 0) {
      return "show";
    }
    return "";
  }

  _removeValidText(id: any, val: any) {
    var item = $("#" + id).val();
    if (!this.shareService.isNullOrEmpty(item)) {
      $("#" + val).css("display", "none");
    }
  }

  dateexpired(e: any, id: any) {
    $("#" + id).val(e.target.value);
  }

  setStoreData() {
    var data = localStorage.getItem("flightDataIndividual");
    var pDetails = localStorage.getItem("passengerDetails");
    this.bookingConfirmation = JSON.parse(localStorage.getItem("bookingConfirmation")!);
    var flightDataIndividual = JSON.parse(localStorage.getItem("flightDataIndividual")!);
    // console.log("Book confirmation::");
    // console.log(this.bookingConfirmation);
    this.item = JSON.parse(data!);
    this.passengerDetails = JSON.parse(pDetails!);
    // console.log(this.item);
    this.isDomMulticity = false;
    this.isIntMulticity = false;
    this.agentFare = this.item.agentFareTotal;
    this.clientFare = this.item.clientFareTotal;
    this.gdsFare = this.item.gdsFareTotal;

    if (this.item.tripTypeId == undefined) {
      if (Array.isArray(this.item)) {
        this.tripTypeNumber = this.item[0].tripTypeId;
        this.isIntMulticity = true;
      } else {
        this.tripTypeNumber = this.item.data1.tripTypeId;
        this.isDomMulticity = true;
      }
    } else {
      this.tripTypeNumber = this.item.tripTypeId;
    }
    switch (this.flightHelper.getTripTypeNumber(this.tripTypeNumber)) {
      case 1:
        this.firstLegData = this.item;
        this.firstLegFareData = this.item.fareData;
        this._setDateFormatting(this.item);
        break;
      case 2:
        this.firstLegData = this.item.firstLegData[0];
        this.secondLegData = this.item.secondLegData[0];
        if (this.item.domestic) {
          this.firstLegFareData = this.item.firstLegData[0].fareData;
          this.secondLegFareData = this.item.secondLegData[0].fareData;
          this._setDateFormatting(this.item.firstLegData[0]);
        } else {
          this.firstLegFareData = this.item.fareData;
          this.secondLegFareData = this.item.fareData;
          this._setDateFormatting(this.item);
        }
        break;
      case 3:
        if (this.isDomMulticity) {
          if (!this.shareService.isObjectEmpty(this.item.data1)) {
            this.firstLegData.push(this.item.data1);
            this.firstLegFareData.push(this.item.data1.fareData);
          }
          if (!this.shareService.isObjectEmpty(this.item.data2)) {
            this.firstLegData.push(this.item.data2);
            this.firstLegFareData.push(this.item.data2.fareData);
          }
          if (!this.shareService.isObjectEmpty(this.item.data3)) {
            this.firstLegData.push(this.item.data3);
            this.firstLegFareData.push(this.item.data3.fareData);
          }
          if (!this.shareService.isObjectEmpty(this.item.data4)) {
            this.firstLegData.push(this.item.data4);
            this.firstLegFareData.push(this.item.data4.fareData);
          }
        } else {
          this.isIntMulticity = true;
          this.firstLegData = [];
          this.firstLegFareData = [];
          for (let items of this.item) {
            this.firstLegData.push(items);
            this.firstLegFareData.push(items.fareData);
          }
        }
        break;
    }
    if (this.isIntMulticity == true) {
      this.passengerDetails = JSON.parse(localStorage.getItem("passengerDetails")!);
      this.passengerDetails = this.passengerDetails.PassengerInfo;
      this.passengerDetails = this.passengerDetails[0];
    } else {
      this.passengerDetails = JSON.parse(localStorage.getItem("passengerDetails")!);
      this.passengerDetails = this.passengerDetails.PassengerInfo;
      this.passengerDetails = this.passengerDetails[0];
    }
    // if(this.isDomMulticity == true){
    //   this.parts = this.firstLegData[0].departureDate.split('-');
    // }
    if (this.isIntMulticity == true || this.isDomMulticity == true) {
      this.parts = this.firstLegData[0].departureDate.split('-');
    } else {
      this.parts = this.firstLegData.departureDate.split('-');
    }
    let expirydate = new Date(this.parts[0], this.parts[1] - 1, this.parts[2]);
    expirydate.setMonth(expirydate.getMonth() + 6)
    setTimeout(() => {
      flatpickr(".dateexpired", {
        enableTime: false,
        dateFormat: "d-m-Y",
        allowInput: true,
        minDate: expirydate,
        maxDate: expirydate
      });
      flatpickr(".date", {
        enableTime: false,
        dateFormat: "d-m-Y",
        allowInput: true,
        maxDate: "today"
      });
    });
  }

  _setDateFormatting(data: any) {
    this.depDayNumberName = this.shareService.getDayNameShort(data.departureDate);
    this.depDayNumber = this.shareService.getDay(data.departureDate);
    this.depMonthName = this.shareService.getMonthShort(data.departureDate);
  }

  splitPNR() {
    if (this.SplitPnr == true) {
      this.splitPNRshow = true;
    } else {
      this.toastrService.warning('Error', 'You cannot request for split PNR.');
    }
  }

  lengthChange(sl: any) {
    this.pageNo = 1;
    this.length = sl;
    this.getServerSideBookingList();
  }

  createPageList() {
    let totalPage = Math.ceil(((this.searchedValue == "") ? this.recordsTotal : this.recordsFiltered) / this.length);
    this.pageList = [];
    this.addPageInPageList("Previous", 0, "");
    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) {
        this.addPageInPageList("" + i, i, "");
      }
    }
    else {
      if (this.pageNo < 5) {
        for (let i = 1; i <= 5; i++) {
          this.addPageInPageList("" + i, i, "");
        }
        this.addPageInPageList("...", 0, "disabled");
        this.addPageInPageList("" + totalPage, totalPage, "");
      }
      else if (this.pageNo > totalPage - 4) {
        this.addPageInPageList("1", 1, "");
        this.addPageInPageList("...", 0, "disabled");
        for (let i = totalPage - 4; i <= totalPage; i++) {
          this.addPageInPageList("" + i, i, "");
        }
      }
      else {
        this.addPageInPageList("1", 1, "");
        this.addPageInPageList("...", 0, "disabled");
        for (let i = this.pageNo - 1; i <= this.pageNo + 1; i++) {
          this.addPageInPageList("" + i, i, "");
        }
        this.addPageInPageList("...", 0, "disabled");
        this.addPageInPageList("" + totalPage, totalPage, "");
      }
    }
    this.addPageInPageList("Next", 0, "");

    this.pageList[0].value = (this.pageNo <= 1) ? 0 : this.pageNo - 1;
    this.pageList[0].class = (this.pageNo <= 1) ? "disabled" : "";
    const pi = this.pageList.findIndex((x: any) => x.value == this.pageNo);
    if (pi > 0) {
      this.pageList[pi].class = "active";
    }
    const li = this.pageList.length - 1;
    this.pageList[li].value = (totalPage <= this.pageNo) ? 0 : this.pageNo + 1;
    this.pageList[li].class = (totalPage <= this.pageNo) ? "disabled" : "";
  }

  pageClick(value: any) {
    if (value != 0) {
      this.pageNo = value;
      this.getServerSideBookingList();
    }
  }

  searchClick() {
    this.searchedValue = this.searchValue;
    this.pageNo = 1;
    this.getServerSideBookingList();
  }

  EnterSubmit(event: any) {
    if (event.keyCode === 13) {
      this.searchClick();
    }
  }

  addPageInPageList(t: any, v: any, c: any) {
    this.pageList.push({
      title: t,
      value: v,
      class: c
    });
  }
  
  isFare:boolean=true;
  iscompanyInfo:boolean=true;
  istotalFareChange:boolean=false;

  isFareVisible:boolean=false;
  isAdultFareVisible:boolean=false;
  isChildFareVisible:boolean=false;
  isInfantFareVisible:boolean=false;

  adultBaseFare: any ='';
  adultTaxFare: any ='';
  adultCount : any ='';
  adultTotal : any ='';

  childBaseFare: any ='';
  childTaxFare: any ='';
  childCount: any ='';
  childTotal: any ='';

  infantBaseFare: any ='';
  infantTaxFare: any ='';
  infantCount: any ='';
  infantTotal: any ='';

  clientTotal: any ='';
  @ViewChild('fareCheckbox', { static: false }) fareCheckboxRef: ElementRef | undefined;
  @ViewChild('companyCheckbox', { static: false }) companyCheckboxRef: ElementRef | undefined;
  @ViewChild('manipulateFareCheckbox', { static: false }) manipulateFareCheckboxRef: ElementRef | undefined;

  showModifyTicketModal(ind:any)
  {
    this.farereload(ind);
    if (this.fareCheckboxRef && this.companyCheckboxRef && this.manipulateFareCheckboxRef) {
      this.fareCheckboxRef.nativeElement.checked = false;
      this.companyCheckboxRef.nativeElement.checked = false;
      this.manipulateFareCheckboxRef.nativeElement.checked = false;
    }
    this.isFareVisible = false;
    this.isAdultFareVisible = false;
    this.isChildFareVisible = false;
    this.isInfantFareVisible = false;

    this.isFare=true;
    this.iscompanyInfo=true;
    this.istotalFareChange=false;
    
    this.btnModalOpen.nativeElement.click();
  }

  farereload(vBookingId:any){
    this.ticketData = '';
    this.authService.getViewBookingById(vBookingId).subscribe((data: { passengerwithticket:any, booking: any[], ticketdetails: any, temporarycancelfare: any, datechangefare: any, bookingjourney: any, datechangefee: any, airlineroute: any, cabintype: any, bookingdetails: any, bookingtraveler: any, bookingfare: any, bookingamount: any, ticketlist: any, bookinglog: any, bookingticketlist: any[], ssrlist: any; }) => {
      this.ticketdetail = data.ticketdetails;
      this.ticketData=this.ticketdetail.find(x=>x.vBookingId===this.VBookingId);
      if(this.ticketData.adultPersonCount>0){
        this.adultBaseFare = this.ticketData.adultClientBase/this.ticketData.adultPersonCount;
        this.adultTaxFare = this.ticketData.adultClientTax/this.ticketData.adultPersonCount;
        this.adultCount= this.ticketData.adultPersonCount;
        this.adultTotal = this.ticketData.adultClientTotal;
      }
      if(this.ticketData.childPersonCount>0){
        this.childBaseFare = this.ticketData.childClientBase/this.ticketData.childPersonCount;
        this.childTaxFare = this.ticketData.childClientTax/this.ticketData.childPersonCount;
        this.childCount= this.ticketData.childPersonCount;
        this.childTotal = this.ticketData.childClientTotal;
      }
      if(this.ticketData.infantPersonCount>0){
        this.infantBaseFare = this.ticketData.infantClientBase/this.ticketData.infantPersonCount;
        this.infantTaxFare = this.ticketData.infantClientTax/this.ticketData.infantPersonCount;
        this.infantCount= this.ticketData.infantPersonCount;
        this.infantTotal = this.ticketData.infantClientTotal;
      }
      this.clientTotal = this.ticketData.totalClientFare;
    });
  }
  
  fareChange(event:any)
  {
    if(event.target.checked){
      this.isFare=false;
    }else{
      this.isFare=true;
    }
  }

  companyInfo(event:any)
  {
    if(event.target.checked){
      this.iscompanyInfo=false;
    }else{
      this.iscompanyInfo=true;
    }
  }

  totalFareChange(event:any)
  {
    this.istotalFareChange=event.target.checked;
  }
  
  
  adultBaseFareInputChange(event: any) {
    this.adultBaseFare = event.target.value;
    this.adultTotal = this.adultBaseFare*this.adultCount + this.adultTaxFare*this.adultCount;
    this.clientTotal = this.adultTotal+this.childTotal+this.infantTotal;
  }

  adultTaxFareInputChange(event: any) {
    this.adultTaxFare = event.target.value;
    this.adultTotal = this.adultBaseFare*this.adultCount + this.adultTaxFare*this.adultCount;
    this.clientTotal = this.adultTotal+this.childTotal+this.infantTotal;
  }

  childBaseFareInputChange(event: any) {
    this.childBaseFare = event.target.value;
    this.childTotal = this.childBaseFare*this.childCount + this.childTaxFare*this.childCount;
    this.clientTotal = this.adultTotal+this.childTotal+this.infantTotal;
  }

  childTaxFareInputChange(event: any) {
    this.childTaxFare = event.target.value;
    this.childTotal = this.childBaseFare*this.childCount + this.childTaxFare*this.childCount;
    this.clientTotal = this.adultTotal+this.childTotal+this.infantTotal;
  }

  infantBaseFareInputChange(event: any) {
    this.infantBaseFare = event.target.value;
    this.infantTotal = this.infantBaseFare*this.infantCount + this.infantTaxFare*this.infantCount;
    this.clientTotal = this.adultTotal+this.childTotal+this.infantTotal;
  }

  infantTaxFareInputChange(event: any) {
    this.infantTaxFare = event.target.value;
    this.infantTotal = this.infantBaseFare*this.infantCount + this.infantTaxFare*this.infantCount;
    this.clientTotal = this.adultTotal+this.childTotal+this.infantTotal;
  }

  faremanipulate(event:any,vBookingId:any){
    
    this.ticketData=this.ticketdetail.find(x=>x.vBookingId===vBookingId);
    
    if(this.ticketData.adultPersonCount>0){
      this.isAdultFareVisible=event.target.checked;
      this.adultBaseFare = this.ticketData.adultClientBase/this.ticketData.adultPersonCount;
      this.adultTaxFare = this.ticketData.adultClientTax/this.ticketData.adultPersonCount;
      this.adultCount= this.ticketData.adultPersonCount;
      this.adultTotal = this.ticketData.adultClientTotal;
    }
    if(this.ticketData.childPersonCount>0){
      this.isChildFareVisible=event.target.checked;
      this.childBaseFare = this.ticketData.childClientBase/this.ticketData.childPersonCount;
      this.childTaxFare = this.ticketData.childClientTax/this.ticketData.childPersonCount;
      this.childCount= this.ticketData.childPersonCount;
      this.childTotal = this.ticketData.childClientTotal;
    }
    if(this.ticketData.infantPersonCount>0){
      this.isInfantFareVisible=event.target.checked;
      this.infantBaseFare = this.ticketData.infantClientBase/this.ticketData.infantPersonCount;
      this.infantTaxFare = this.ticketData.infantClientTax/this.ticketData.infantPersonCount;
      this.infantCount= this.ticketData.infantPersonCount;
      this.infantTotal = this.ticketData.infantClientTotal;
    }
    this.clientTotal = this.ticketData.totalClientFare;
    this.isFareVisible = event.target.checked;
  }
  
  reload() {
    debugger;
    const modalContentElement = document.querySelector('#createPassengerModal .card-body');
    if (modalContentElement) {
      //modalContentElement.innerHTML = ''; // Clear the content
    }

    // Close the modal
    const closeButton = this.btnClose.nativeElement as HTMLButtonElement;
    closeButton.click();
  }

  showTicket(ind:any)
  {
    try{
      this.ticketData=this.ticketdetail.find(x=>x.vBookingId===ind);
       if(this.adultBaseFare!=''){
        this.ticketData.adultClientBase=this.adultBaseFare*this.adultCount;
        this.ticketData.adultClientTotal = parseFloat(this.ticketData.adultClientBase)+parseFloat(this.ticketData.adultClientTax);
       }
       if(this.adultTaxFare!=''){
        this.ticketData.adultClientTax=this.adultTaxFare*this.adultCount;
        this.ticketData.adultClientTotal = parseFloat(this.ticketData.adultClientBase)+parseFloat(this.ticketData.adultClientTax);
       }

       if(this.childBaseFare!=''){
        this.ticketData.childClientBase=this.childBaseFare*this.childCount;
        this.ticketData.childClientTotal = parseFloat(this.ticketData.childClientBase)+parseFloat(this.ticketData.childClientTax);
       }
       if(this.childTaxFare!=''){
        this.ticketData.childClientTax=this.childTaxFare*this.childCount;
        this.ticketData.childClientTotal = parseFloat(this.ticketData.childClientBase)+parseFloat(this.ticketData.childClientTax);
       }

       if(this.infantBaseFare!=''){
        this.ticketData.infantClientBase=this.infantBaseFare*this.infantCount;
        this.ticketData.infantClientTotal = parseFloat(this.ticketData.infantClientBase)+parseFloat(this.ticketData.infantClientTax);
       }
       if(this.infantTaxFare!=''){
        this.ticketData.infantClientTax=this.infantTaxFare*this.infantCount;
        this.ticketData.infantClientTotal = parseFloat(this.ticketData.infantClientBase)+parseFloat(this.ticketData.infantClientTax);
       }
       this.ticketData.totalClientFare =  parseFloat(this.ticketData.adultClientTotal)+parseFloat(this.ticketData.childClientTotal)+parseFloat(this.ticketData.infantClientTotal);
      $('#ticketModal').modal('show');
    }catch(exp){}
    this.reload();
  }


}
