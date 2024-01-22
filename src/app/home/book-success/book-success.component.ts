import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from '../../_services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Select2OptionData } from 'ng-select2';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, DOCUMENT } from '@angular/common';
import { ShareService } from '../../_services/share.service';
import { Component, ElementRef, Inject, OnInit, Renderer2, SystemJsNgModuleLoader, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FlightHelperService } from '../flight-helper.service';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';
import flatpickr from 'flatpickr';
import { count } from 'console';
import * as internal from 'stream';
declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-book-success',
  templateUrl: './book-success.component.html',
  styleUrls: ['./book-success.component.css']
})
export class BookSuccessComponent implements OnInit {
  amount: any;
  totalReIssueFare: any;
  totalDateChangeFare: any;
  totalRefundCharge: any;
  loadAPI: Promise<any> | any;
  isBookClicked: boolean = false;
  urlMain = "./assets/dist/js/main.min.js";
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
  depDayNumberName: any;
  depDayNumber: any;
  depMonthName: any;
  bookingsuccessForm!: FormGroup;
  bookingsuccessModel: any;
  VBookingId: any;
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
  bookingdetail: any[] = [];
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
  cabintypes: any[] = [];
  journeytrip: any[] = [];
  trip: any[] = [];
  bookingtravelers: any[] = [];
  bookingtravelerId: any[] = [];
  RefundPnr: any;
  adult: any[] = [];
  adultnum: any;
  childList: any[] = [];
  childListFinal: any[] = [];
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
  splitPNRshow = false;
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
  RoundTripType = "3E58A4D3-FCD4-4CFA-9371-B03D46A20574";
  firstLeg: any;
  airports: any[] = [];
  agentFare: any;
  clientFare: any;
  gdsFare: any;
  splitbutton = true;
  reissueshow = false;
  datechangeoffershow = false;
  reissueofferoffershow = false;
  datechangefares: any[] = [];
  temporarycanclefares: any[] = [];

  queryString: any;

  ticketData:any=[];


  public selectedDepartureDate: any = this.shareService.getYearLong() + "-" +
    this.shareService.padLeft(this.shareService.getMonth(), '0', 2) + "-" + this.shareService.padLeft(this.shareService.getDay(), '0', 2);
  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2, private appComponent: AppComponent,
    private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
    private router: Router, private httpClient: HttpClient, private toastrService: ToastrService, private elementRef: ElementRef,
    public shareService: ShareService, public flightHelper: FlightHelperService,
    public tosterService: ToastrService) { }

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'flight_search_details');
    this.loadAPI = new Promise(resolve => {
      this.loadScript();
    });
    this.setStoreData();
    this._specialServiceLoad();
    this.getAgencyPermission();
    this.CreateBookingSuccessForm();
    this.CreateSplitPNRForm();
    $("#maxConnection").val(2);

    this.queryString = window.location.pathname;
  }
  getAgencyPermission() {
    var userId = this.shareService.getUserId();
    try {
      this.authService.getAgencyPermit(userId).subscribe(data => {
        if (data.data) {
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
    console.log(e);
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
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'flight_search_details');
  }
  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
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
  setStoreData() {
    var data = localStorage.getItem("flightDataIndividual");
    var pDetails = localStorage.getItem("passengerDetails");
    this.bookingConfirmation = JSON.parse(localStorage.getItem("bookingConfirmation")!);
    // var pnr = this.bookingConfirmation[0].reservationPNR;
    // var Bookingvalue = "";
    // this.authService.getPnr(pnr).subscribe(book => {
    //   book.booking.forEach((value: any) => {
    //     Bookingvalue = value.vBookingId;
    //   });
    // })
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
  dateexpired(e: any, id: any) {
    $("#" + id).val(e.target.value);
  }
  _removeValidText(id: any, val: any) {
    var item = $("#" + id).val();
    if (!this.shareService.isNullOrEmpty(item)) {
      $("#" + val).css("display", "none");
    }
  }
  getFirstShow(ind: number): string {
    if (ind == 0) {
      return "show";
    }
    return "";
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
  _setDateFormatting(data: any) {
    this.depDayNumberName = this.shareService.getDayNameShort(data.departureDate);
    this.depDayNumber = this.shareService.getDay(data.departureDate);
    this.depMonthName = this.shareService.getMonthShort(data.departureDate);
  }
  _specialServiceLoad() {
    this.ssrList = [];
    try {
      this.authService.getSpecialService().subscribe(data => {
        // console.log(data);
        for (let item of data.ssrlist) {
          this.ssrList.push({ 'id': item.vSpecialServiceRequestId, 'text': item.nvSpecialServiceRequestCode + '-' + item.nvSpecialServiceRequestName });
        }
        this.bookingdetail = data.bookingdetails
        this.bookings = data.booking;
        if (this.isIntMulticity == true) {
          this.bookingConfirmation = JSON.parse(localStorage.getItem("bookingConfirmation")!);
          this.bookingConfirmation = this.bookingConfirmation[0];
        } else {
          this.bookingConfirmation = JSON.parse(localStorage.getItem("bookingConfirmation")!);
          this.bookingConfirmation = this.bookingConfirmation[0];
        }
        for (let item of this.bookings) {
          if (item.vItineraryNumber == this.bookingConfirmation.reservationPNR) {
            this.VBookingId = item.vBookingId;
            this.VBookingManualId = item.vBookingManualId;
            this.Id = item.id;
            this.VAirlineRouteEnableMasterId = item.vAirlineRouteEnableMasterId;
            this.DStartDate = item.dStartDate;
            this.DEndDate = item.dEndDate;
            this.BIsTicketed = item.bIsTicketed;
            this.VFlightTypeId = item.vFlightTypeId;
            this.FlightNum = item.iIdentifiedBy;
            this.VCabinTypeId = item.vCabinTypeId;
            this.Cabin = item.nvCabinTypeCode;
            this.NvCreationUserSine = item.nvCreationUserSine;
            this.DCreationDateTime = item.dCreationDateTime;
            this.VPrimeHostId = item.vPrimeHostId;
            this.VTicketProcessStatusId = item.vTicketProcessStatusId;
            this.VPlatformId = item.vPlatformId;
            this.BStatus = item.bStatus;
            this.NMinimumAmountTobePay = item.nMinimumAmountTobePay;
            this.DPartialPaymentOfferExpiredAt = item.dPartialPaymentOfferExpiredAt;
            this.DRemainingAmountTobePayAt = item.dRemainingAmountTobePayAt;
            this.DPartialPaymentOfferAcceptedAt = item.dPartialPaymentOfferAcceptedAt;
            this.NRefundServiceCharge = item.nRefundServiceCharge;
            this.NRefundCharge = item.nRefundCharge;
            this.DRefundExpiredAt = item.dRefundExpiredAt;
            this.DRefundAcceptedAt = item.dRefundAcceptedAt;
            this.NvTicketRequestStatusName = item.nvTicketRequestStatusName;
            this.NvTicketStatusName = item.nvTicketStatusName;
            this.DTimeLimitFsl = item.dTimeLimitFsl;
            this.AirlinesCode = item.nvIataDesignator;
          }
        }
        var pathvalue = '/home/recent-booking-flight/'+ this.VBookingId +'';
        this.router.navigate([pathvalue]);
        this.totalRefundCharge = this.NRefundCharge + this.NRefundServiceCharge;
        for (let item of data.bookingamount) {
          if (item.vBookingId == this.VBookingId) {
            this.BillAmount = item.nAgencyFare;
            this.Paid = item.nMinimumAmountTobePay;
            this.Due = item.due;
          }
        }
        this.airlineroutes = data.airlineroute
        for (let item of this.airlineroutes) {
          if (item.vAirlineRouteEnableMasterId == this.VAirlineRouteEnableMasterId) {
            this.VAirlinesRouteEnableId = item.vAirlinesRouteEnableId;
            this.BB2bdateChange = item.bB2bdateChange;
            this.BB2brefundStatus = item.bB2brefundStatus;
            this.BB2btemporaryCancelStatus = item.bB2btemporaryCancelStatus;
            this.BB2bvoidStatus = item.bB2bvoidStatus;
          }
        }
        this.bookingjourneys = data.bookingjourney
        this.journeytrip = [];
        for (let items of this.bookingjourneys) {
          if (items.vItineraryNumber == this.bookingConfirmation.reservationPNR && items.vBookingId == this.VBookingId) {
            this.VBookingJourneyId = items.vBookingJourneyId;
            this.INumberOfFlights = items.iNumberOfFlights;
            this.AirportFrom = items.airportFrom;
            this.AfCode = items.afcode;
            this.AirportTo = items.airportTo;
            this.AtCode = items.atcode;

            this.journeytrip.push({ 'fid': items.afcode, 'ftext': items.dDepartureDateTime, 'tid': items.atcode, 'ttext': items.dArrivalDateTime, 'serial': items.iSerialNo });
            if (items.iSerialNo == 1) {
              this.AirportFromId = items.vAirportFromId;
              this.CityFrom = items.cityFrom;
              this.CountryFrom = items.countryFrom;
              this.CountryFromCode = items.countryFromCode;
              this.CityTo = items.cityTo;
              this.CountryTo = items.countryTo;
              this.CountryToCode = items.countryToCode;
              this.AirportToId = items.vAirportToId;
              this.DepartureDateTime = items.dDepartureDateTime;
              this.ArrivalDateTime = items.dArrivalDateTime;
            }
            this.trip.push({
              AirportFromId: items.vAirportFromId,
              CityFrom: items.cityFrom,
              CountryFrom: items.countryFrom,
              CountryFromCode: items.countryFromCode,
              CityTo: items.cityTo,
              CountryTo: items.countryTo,
              CountryToCode: items.countryToCode,
              AirportToId: items.vAirportToId,
              DepartureDateTime: items.dDepartureDateTime,
              ArrivalDateTime: items.dArrivalDateTime,
              VBookingJourneyId: items.vBookingJourneyId,
              INumberOfFlights: items.iNumberOfFlights,
              AirportFrom: items.airportFrom,
              AfCode: items.afcode,
              AirportTo: items.airportTo,
              AtCode: items.atcode
            });
          }
        }
        let dDate = new Date();
        let DepartureDate = new Date(this.DepartureDateTime)
        if (DepartureDate > dDate) {
          this.Departure = this.DepartureDateTime;
        } else {
          this.Departure = '';
        }
        this.amount = parseInt(data.amount);
        this.datechangefares = data.datechangefare;
        data.datechangefare.forEach((value: any, index: any) => {
          this.totalDateChangeFare = value.nDifferenceOfFare + value.nDifferenceOfTax + value.nFslcharge + value.nDateChangeCharge;
        });
        this.temporarycanclefares = data.temporarycancelfare;
        data.temporarycancelfare.forEach((value: any, index: any) => {
          this.totalReIssueFare = value.nDifferenceOfFare + value.nDifferenceOfTax;
          // this.totaldifferencefare = this.totaldifferencefare.toString();
        });
        this.cabintypes = [];
        for (let item of data.cabintype) {
          this.cabintypes.push({ 'id': item.vCabinTypeId, 'textid': item.nvCabinTypeCode, 'text': item.nvCabinTypeName });
        }
        data.bookingtraveler.forEach((value: any) => {
          if (value.vBookingTravelerId != null && value.vBookingJourneyId == this.VBookingJourneyId) {
            value.birthDate = this.datepipe.transform(value.dBirthDate, 'dd-MM-yy');
            value.expiryDate = this.datepipe.transform(value.dExpiryDate, 'dd-MM-yy');
          }
        });
        this.bookingtravelers = [];

        for (let item of data.bookingtraveler) {
          if (item.vBookingJourneyId == this.VBookingJourneyId) {
            if (item.nvPassengerTypeName == 'Adult') {
              this.adult.push({ 'id': item.vBookingTravelerId });
            }
            this.adultnum = this.adult.length;
            var today = new Date();
            let age = this.shareService.getAgeFull(item.dBirthDate, today);
            if (item.nvPassengerTypeName == 'Child') {
              this.childList.push({ 'id': item.vBookingTravelerId, 'age': age });
            }
            if (item.nvPassengerTypeName == 'Infant') {
              this.infant.push({ 'id': item.vBookingTravelerId });
            }
            this.infantnum = this.infant.length;
            if (item.birthDate == null) {
              item.birthDate = '';
            }
            if (item.nvDocumentNumber == null) {
              item.nvDocumentNumber = '';
            }
            if (item.expiryDate == null) {
              item.expiryDate = '';
            }
            if (item.vBookingJourneyId == this.VBookingJourneyId) {
              this.bookingtravelers.push({
                'id': item.vBookingTravelerId, 'text': item.vAssignJourneyWithTravelerId, 'text1': item.nvPassengerTypeName, 'text2': item.nvGivenName, 'text3': item.nvGenderName,
                'text4': item.birthDate, 'text5': item.nvDocumentNumber, 'text6': item.expiryDate, 'text7': item.iSerial, 'text8': item.nvSurName
              });
            }
          }
        }
        this.ticketprocess = data.ticketlist
        for (let items of this.ticketprocess) {
          if (items.vTicketProcessStatusId == this.VTicketProcessStatusId) {
            this.ModifyBooking = items.bModifyBooking
            this.BillStatus = items.bBillStatus
            this.Print = items.bPrint
            this.SplitPnr = items.bSplitPnr
            this.DataChange = items.bDataChange
            this.PartialPnr = items.bPartialPnr
          }
        }
        for (let status of data.bookingticketlist) {
          if (status.vBookingManualId == this.bookingConfirmation.referenceNo) {
            this.bookingTicketList.push({ 'id': status.vTicketProcessStatusId, 'text': status.status });
          }
        }
        for (let item of data.bookinglog) {
          if (item.vBookingId == this.VBookingId) {
            this.bookingLog.push({ 'id': item.vBookingId, 'text1': item.nvTicketStatusName, 'text2': item.dDateTime, 'text3': item.nvTicketRequestStatusName });
          }
        }
        setTimeout(() => {
          flatpickr(".date-form", {
            enableTime: false,
            dateFormat: "d-m-Y",
            minDate: "today"
          });
          flatpickr(".date-to", {
            enableTime: false,
            dateFormat: "d-m-Y",
            minDate: this.shareService.padLeft(this.shareService.getDay(this.startDate), '0', 2) + "." +
              this.shareService.padLeft(this.shareService.getMonth(this.startDate), '0', 2) + "." +
              this.shareService.getYearLong(this.startDate)
          });
        });
        // console.log("time limit::");
        // console.log(this.DTimeLimitFsl);
      });
    } catch (exp) { }
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
  passengerdetails(e: any) {
    // console.log(e);
    for (let item of this.bookingtravelers) {
      if (item.id == e.target.value) {
        this.bookingtravelerId.push({ 'VBookingTravelerId': item.id, 'VAssignJourneyWithTravelerId': item.text, 'ISerial': item.text7 });
      }
    }
  }

  choiceCabin(e: any) {
    // console.log(e);
    this.cabin = e.target.value;
  }
  choiceStartDate(e: any) {
    let startDay = e.target.value;
    this.startDate = startDay.split('-').reverse().join('-');
    this.startDepartureDate.push({
      Date: this.startDate
    });
  }
  choiceEndDate(e: any) {
    let endDay = e.target.value;
    this.endDate = endDay.split('-').reverse().join('-');
    // console.log(this.endDate);
  }

  changeClassLabel(code: string) {
    code = this.cabin;
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

  _getTotalTravellers(): number {
    return this.num1 + this.num2 + this.num3;
  }

  flightSearchDataSet(isSave: boolean = false) {
    if (this.isDomMulticity == true) {
      var maxConnection=$("#maxConnection").val();
      let multiDeparture: any[] = [];
      let multiArrival: any[] = [];
      this.isMulticity = this.isDomMulticity;
      for (let i = 0; i < this.trip.length; i++) {
        if (
          !this.shareService.isNullOrEmpty(
            this.trip[i].AfCode
          )
        ) {
          multiDeparture.push({
            Id: this.trip[i].AirportFromId,
            CityCode: this.trip[i].AfCode,
            CityName: this.trip[i].CityFrom,
            CountryCode: this.trip[i].CountryFromCode,
            CountryName: this.trip[i].CountryFrom,
            AirportName: this.trip[i].AirportFrom,
            Date: this.startDepartureDate[i].Date,
          });
          multiArrival.push({
            Id: this.trip[i].AirportToId,
            CityCode: this.trip[i].AtCode,
            CityName: this.trip[i].CityTo,
            CountryCode: this.trip[i].CountryToCode,
            CountryName: this.trip[i].CountryTo,
            AirportName: this.trip[i].AirportTo,
          });
          this.selectedDepartureCountryCode = this.trip[i].CountryFromCode;
          this.selectedReturnCountryCode = this.trip[i].CountryToCode;
        }
      }
      let loaderData = {
        Departure: multiDeparture,
        Arrival: multiArrival,
        adult:  this.adultnum,
        childList: this.childListFinal,
        infant: this.infantnum,
        classType: this.cabin,
        airlines: this.AirlinesCode,
        tripTypeId: this.VFlightTypeId,
        childList1: this.childList,
        isOneWay: this.isOneway,
        stop:2,
        isRoundTrip: this.isRoundtrip,
        isMultiCity: this.isDomMulticity,
        gdsTotal: this.gdsFare,
        clientTotal: this.clientFare,
        agentTotal: this.agentFare,
        pagePath: this.queryString
      };
      this._setStoreFlightData(loaderData, true);
    }
    if (this.isIntMulticity == false && this.isDomMulticity == false) {
      if (this.firstLegData.tripTypeId == this.RoundTripType) {
        if (this.startDate == null) {
          this.startDate = this.endDate;
          this.AfCode = this.firstLegData.departureCityCode;
          this.AtCode = this.firstLegData.arrivalCityCode;
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

      this.childListFinal = this.childList;
      let childList = this.childList.length;
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
          departureDate: this.selectedDepartureDate, returnDate: this.selectedReturnDate, adult: this.adultnum,startDate: this.firstLegData.departureDate,
          childList1: this.childList, childList: this.childListFinal, ticketstatusId: ticket, firstLegData: this.firstLeg,
          infant: this.infantnum, classType: this.selectedClassTypeCode, airlines: airlines, stop: 2, tripTypeId: tripTypeId, pagePath: this.queryString,
          isOneWay: this.isOneway, isRoundTrip: this.isRoundtrip, isMultiCity: this.isMulticity,
          gdsTotal: this.gdsFare,
          clientTotal: this.clientFare,
          agentTotal: this.agentFare
        };
        this._setStoreFlightData(loaderData, true);
      }
    }
    if (this.isIntMulticity == true) {
      var maxConnection=$("#maxConnection").val();
      let multiDeparture: any[] = [];
      let multiArrival: any[] = [];
      this.isMulticity = this.isIntMulticity;
      for (let i = 0; i < this.trip.length; i++) {
        if (
          !this.shareService.isNullOrEmpty(
            this.trip[i].AfCode
          )
        ) {
          multiDeparture.push({
            Id: this.trip[i].AirportFromId,
            CityCode: this.trip[i].AfCode,
            CityName: this.trip[i].CityFrom,
            CountryCode: this.trip[i].CountryFromCode,
            CountryName: this.trip[i].CountryFrom,
            AirportName: this.trip[i].AirportFrom,
            Date: this.startDepartureDate[i].Date,
          });
          multiArrival.push({
            Id: this.trip[i].AirportToId,
            CityCode: this.trip[i].AtCode,
            CityName: this.trip[i].CityTo,
            CountryCode: this.trip[i].CountryToCode,
            CountryName: this.trip[i].CountryTo,
            AirportName: this.trip[i].AirportTo,
          });
          this.selectedDepartureCountryCode = this.trip[i].CountryFromCode;
          this.selectedReturnCountryCode = this.trip[i].CountryToCode;
        }
      }
      let loaderData = {
        Departure: multiDeparture,
        Arrival: multiArrival,
        adult:  this.adultnum,
        childList: this.childListFinal,
        infant: this.infantnum,
        classType: this.cabin,
        airlines: this.AirlinesCode,
        tripTypeId: this.VFlightTypeId,
        childList1: this.childList,
        isOneWay: this.isOneway,
        stop:'2',
        Date: this.startDepartureDate,
        isRoundTrip: this.isRoundtrip,
        isMultiCity: this.isIntMulticity,
        gdsTotal: this.gdsFare,
        clientTotal: this.clientFare,
        agentTotal: this.agentFare,
        pagePath: this.queryString
      };
      this._setStoreFlightData(loaderData, true);
    }
    // else {
    //   let loaderData = {
    //     fromFlightId: this.trip[0].AirportFromId,
    //     fromFlightCode: this.trip[0].AfCode,
    //     fromFlightName: this.trip[0].CityFrom,
    //     toFlightId: this.trip[0].AirportToId,
    //     toFlightName: this.trip[0].CityTo,
    //     toFlightCode: this.trip[0].AtCode,
    //     fromAirportName: this.trip[0].AirportFrom,
    //     toAirportName: this.trip[0].AirportTo,
    //     fromCountryCode: this.trip[0].CountryFromCode,
    //     fromCountryName: this.trip[0].CountryFrom,
    //     toCountryCode: this.trip[0].CountryToCode,
    //     toCountryName: this.trip[0].CountryTo,
    //     departureDate: this.selectedDepartureDate,
    //     returnDate: this.selectedReturnDate,
    //     adult:  this.adultnum,
    //     childList: this.childListFinal,
    //     infant: this.infantnum,
    //     stop:2,
    //     classType: this.cabin,
    //     airlines: this.AirlinesCode,
    //     tripTypeId: this.VFlightTypeId,
    //     childList1: this.childList,
    //     isOneWay: this.isOneway,
    //     isRoundTrip: this.isRoundtrip,
    //     isMultiCity: this.isIntMulticity,
    //   };
    //   this._setStoreFlightData(loaderData, true);
    // }
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

  splitPNR() {
    if (this.SplitPnr == true) {
      this.splitPNRshow = true;
    } else {
      this.toastrService.warning('Error', 'You cannot request for split PNR.');
    }
  }

  splitcancel() {
    this.splitPNRshow = false;
  }

  // showTicket(ind:any)
  // {
  //   try{
  //     this.ticketData=this.bookingdetail.find(x=>x.vBookingId===ind);
  //     // console.log("ticket::");
  //     // console.log(this.ticketData);
  //     $('#ticketModal').modal('show');
  //   }catch(exp){}
  // }

  save(e: any) {
    // console.log(e);
    if (this.bookingsuccessForm.valid) {
      this.bookingsuccessModel = Object.assign({}, this.bookingsuccessForm.value);
      const ticketStatus = e.target.innerHTML;
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
      this.bookingsuccessModel.NvTicketStatusName = this.NvTicketStatusName;
      Swal.fire({
        title: 'Do you want to change Booking Status' + '"' + ticketStatus + '" ' + '?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!'
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
                this.authService.CancelBooking(this.bookingsuccessModel).subscribe(() => {
                  this.toastrService.success('Success', 'Booking data saved successfully.');
                  const url = this.router.url;
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['/home/recent-booking-flight/:id']);
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
          // if (e.target.id == this.datechange) {
          //   // if (this.BB2bdateChange == true) {
          //   this.datechangeshow = true;
          //   // this.authService.saveDateChange(this.bookingsuccessModel).subscribe(() => {
          //   //   this.toastrService.success('Success', 'Booking data saved successfully.');
          //   //   const url = this.router.url;
          //   //   this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          //   //     this.router.navigate([url]);
          //   //   });
          //   // }, error => {
          //   //   this.toastrService.error('Error', 'Booking data saved failed.');
          //   //   console.log(error);
          //   // });
          //   // } else {
          //   //   this.toastrService.warning('Error', 'You cannot request a date change for this airline.');
          //   // }
          // }
          // if (e.target.id == this.datechangecancel) {
          //   this.authService.saveDateChangerequest(this.bookingsuccessModel).subscribe(() => {
          //     this.toastrService.success('Success', 'Booking data saved successfully.');
          //     const url = this.router.url;
          //     this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          //       this.router.navigate([url]);
          //     });
          //   }, error => {
          //     this.toastrService.error('Error', 'Booking data saved failed.');
          //     console.log(error);
          //   });
          // }
          // if (e.target.id == this.datechangeoffercancel) {
          //   this.authService.saveDateChangerequest(this.bookingsuccessModel).subscribe(() => {
          //     this.toastrService.success('Success', 'Booking data saved successfully.');
          //     const url = this.router.url;
          //     this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          //       this.router.navigate([url]);
          //     });
          //   }, error => {
          //     this.toastrService.error('Error', 'Booking data saved failed.');
          //     console.log(error);
          //   });
          // }
          // if (e.target.id == this.datechangeofferaccept) {
          //   this.authService.saveDateChangerequest(this.bookingsuccessModel).subscribe(() => {
          //     this.toastrService.success('Success', 'Booking data saved successfully.');
          //     const url = this.router.url;
          //     this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          //       this.router.navigate([url]);
          //     });
          //   }, error => {
          //     this.toastrService.error('Error', 'Booking data saved failed.');
          //     console.log(error);
          //   });
          // }
          // if (e.target.id != this.refundrequest && e.target.id != this.voidrequest && e.target.id != this.temporarycancel && e.target.id != this.datechange) {
          //   this.authService.saveBookingStatus(this.bookingsuccessModel).subscribe(() => {
          //     this.toastrService.success('Success', 'Booking data saved successfully.');
          //     const url = this.router.url;
          //     this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          //       this.router.navigate([url]);
          //     });
          //   }, error => {
          //     this.toastrService.error('Error', 'Booking data saved failed.');
          //     console.log(error);
          //   });
          // }
        }
      });
    } else {
      this.appComponent.validateAllFormFields(this.bookingsuccessForm);
      this.toastrService.warning('Error', 'Required field is not filled');
    }
  }

  _stopLength(ind: any): number {
    let data = 0;
    try {
      data = this._stopData(ind).length - 1;

      if (data == undefined) {
        return 0;
      }
    } catch (exp) { }
    return data;
  }
  _stopData(ind: any): any {
    let data = "";
    try {
      data = this.firstLegData.flightData;
      if (data == undefined) {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  _stopAllCity(ind: any): any {
    let data = "";
    try {
      if (this._stopLength(ind) == 1) {
        data = this._stopData(ind)[0].arrivalCity;
      }
      if (this._stopLength(ind) > 1) {
        for (let item of this._stopData(ind)) {
          data = data + "," + item.arrivalCity;
        }
      }
      if (data.length > 10) {
        data = data.substring(0, 10) + "..";
      }
      if (data == undefined || data == "") {
        return "";
      }
    } catch (exp) { }
    return data;
  }
  fareShowHideAction() {
    if ($("#fareDetailsWrap").css('display') == 'block') {
      $("#fareDetailsWrap").hide('slow');
    } else {
      $("#fareDetailsWrap").show('slow');
    }
  }
}
