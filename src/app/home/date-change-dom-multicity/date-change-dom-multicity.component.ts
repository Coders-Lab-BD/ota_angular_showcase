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
import { FlightRoutes } from 'src/app/model/flight-routes.model';
import { MarkuDiscountModel } from 'src/app/model/marku-discount-model.model';
import { BookModel } from 'src/app/model/book-model.model';
import { DateChangeCancelModel } from 'src/app/model/date-change-cancel-model.model';
declare var window: any;
declare var $: any;
declare var $;

@Component({
  selector: 'app-date-change-dom-multicity',
  templateUrl: './date-change-dom-multicity.component.html',
  styleUrls: ['./date-change-dom-multicity.component.css']
})
export class DateChangeDomMulticityComponent implements OnInit {
  urlMain = "./assets/dist/js/main.min.js";
  flightFromModel: any;
  flightToModel: any;

  @ViewChild('flightItem', { read: DragScrollComponent }) flightItem: DragScrollComponent | any;
  @ViewChild('fareItem', { read: DragScrollComponent }) fareItem: DragScrollComponent | any;

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
  flightSearchSkeleton1: boolean = true;
  flightSearchSkeleton2: boolean = true;
  flightSearchSkeleton3: boolean = true;
  flightSearchSkeleton4: boolean = true;
  topFlightSearchSkeleton: boolean = true;
  isSuggReturnMobile: boolean = false;
  isMulticityTopSection: boolean = false;

  returnDateModel: NgbDateStruct | any;
  returnDay: string = "";
  returnMonth: string = "";
  returnMonthYear: string = "";
  returnYear: string = "";
  returnDayName: string = "";

  num1 = 0;
  num2 = 0;
  num3 = 0;
  childList: number[] = [];
  childList2: number[] = [];
  childListFinal: any[] = [];
  childSelectList: number[] = [2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  cDay: number = Number(this.shareService.getDay(""));
  cMonth: number = Number(this.shareService.getMonth(""));
  cYear: number = Number(this.shareService.getYearLong(""));

  deptDate: string | undefined;
  retDate: string | undefined;

  loadAPI: Promise<any> | any;
  groupAirlines: any;
  airlines1: any;
  airlines2: any;
  airlines3: any;
  airlines4: any;
  ItineryWiseAirlines: any;
  airports1: any = [];
  airports2: any = [];
  airports3: any = [];
  airports4: any = [];
  paramModelData: any;

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
  isSuggDeparture1: boolean = false;
  isSuggReturn1: boolean = false;
  isSuggDepartureMobile1: boolean = false;
  isSuggDeparture2: boolean = false;
  isSuggReturn2: boolean = false;
  isSuggDepartureMobile2: boolean = false;
  isSuggDeparture3: boolean = false;
  isSuggReturn3: boolean = false;
  isSuggDepartureMobile3: boolean = false;
  isSuggDeparture4: boolean = false;
  isSuggReturn4: boolean = false;
  isSuggDepartureMobile4: boolean = false;
  providerId: string = "";

  public selectedDeparturePanelText: any = "";
  public selectedReturnPanelText: any = "";
  public selectedClassTypeId: any = "";
  public selectedClassTypeCode: any = "";
  public selectedClassTypeName: any = "";
  public selectedClassTypeNameMobile: any = "";
  public selectedTripTypeId: any = "";


  fmgFlightSearchWay: FormGroup | any;
  fmgFlightSearch: FormGroup | any;
  fmgChild: FormArray | any;
  selectTripType: FormControl = new FormControl()
  fmgSearchHistory: FormGroup | any;
  fmgSearchHistoryInfo: FormGroup | any;
  fmgSearchHistoryDetails: FormGroup | any;


  retDeptDay: string = "";
  retDayNameShort: string = "";
  retDeptMonth: string = "";
  retDeptYear: string = "0";

  retDay: number = 0;
  retMonth: number = 0;
  retYear: number = 0;
  selectedTab: number = 0;

  selectedAirFilterList1: string[] = [];
  selectedAirFilterList2: string[] = [];
  selectedAirFilterList3: string[] = [];
  selectedAirFilterList4: string[] = [];
  selectedDeptTimeList1: any[] = [];
  selectedDeptTimeList2: any[] = [];
  selectedDeptTimeList3: any[] = [];
  selectedDeptTimeList4: any[] = [];
  selectedArrTimeList1: any[] = [];
  selectedArrTimeList2: any[] = [];
  selectedArrTimeList3: any[] = [];
  selectedArrTimeList4: any[] = [];
  tempFilterItinery1: any[] = [];
  tempFilterItinery2: any[] = [];
  tempFilterItinery3: any[] = [];
  tempFilterItinery4: any[] = [];
  udMinRangeVal1: number = 0;
  udMinRangeVal2: number = 0;
  udMinRangeVal3: number = 0;
  udMinRangeVal4: number = 0;
  stopCountList1: any[] = [];
  stopCountList2: any[] = [];
  stopCountList3: any[] = [];
  stopCountList4: any[] = [];
  departureTimeFilter1: any[] = [];
  departureTimeFilter2: any[] = [];
  departureTimeFilter3: any[] = [];
  departureTimeFilter4: any[] = [];
  arrivalTimeFilter1: any[] = [];
  arrivalTimeFilter2: any[] = [];
  arrivalTimeFilter3: any[] = [];
  arrivalTimeFilter4: any[] = [];
  refundFilterList1: boolean[] = [];
  refundFilterList2: boolean[] = [];
  refundFilterList3: boolean[] = [];
  refundFilterList4: boolean[] = [];
  appliedFilter1: any[] = [];
  appliedFilter2: any[] = [];
  appliedFilter3: any[] = [];
  appliedFilter4: any[] = [];

  domOneWayData1: any[] = [];
  domOneWayData2: any[] = [];
  domOneWayData3: any[] = [];
  domOneWayData4: any[] = [];

  tempDomOneWayData1: any[] = [];
  tempDomOneWayData2: any[] = [];
  tempDomOneWayData3: any[] = [];
  tempDomOneWayData4: any[] = [];

  markupInfo: MarkuDiscountModel[] = [];
  discountInfo: MarkuDiscountModel[] = [];
  cmbAirport: any[] = [];
  cmbAirlines: any[] = [];
  cmbAirCraft: any[] = [];
  bookInstantEnableDisable: BookModel[] = [];

  fareDetailsModalData1: any = [];
  fareDetailsModalData2: any = [];
  fareDetailsModalData3: any = [];
  fareDetailsModalData4: any = [];

  flightDetailsModalData1: any[] = [];
  flightDetailsModalData2: any[] = [];
  flightDetailsModalData3: any[] = [];
  flightDetailsModalData4: any[] = [];

  makeProposalData1: any = [];
  makeProposalData2: any = [];
  makeProposalData3: any = [];
  makeProposalData4: any = [];

  tempAirportsDeparture1: any = [];
  tempAirportsDeparture2: any = [];
  tempAirportsDeparture3: any = [];
  tempAirportsDeparture4: any = [];
  tempAirportsArrival1: any = [];
  tempAirportsArrival2: any = [];
  tempAirportsArrival3: any = [];
  tempAirportsArrival4: any = [];
  tempDefaultDepArrFlight1: any = [];
  tempDefaultDepArrFlight2: any = [];
  tempDefaultDepArrFlight3: any = [];
  tempDefaultDepArrFlight4: any = [];
  popularFilter1: any[] = [];
  popularFilter2: any[] = [];
  popularFilter3: any[] = [];
  popularFilter4: any[] = [];
  markupList: any[] = [];

  keywords: string = 'all';
  isFlightSearchBody: number = 0;

  amtDateChangesPre: any;
  amtDateChanges: any;
  amtDateChangesPlus: any;
  amtCancellationPre: any;
  amtCancellation: any;
  amtCancellationPlus: any;

  amtDateChangesPre1: any;
  amtDateChanges1: any;
  amtDateChangesPlus1: any;
  amtCancellationPre1: any;
  amtCancellation1: any;
  amtCancellationPlus1: any;

  amtDateChangesPre2: any;
  amtDateChanges2: any;
  amtDateChangesPlus2: any;
  amtCancellationPre2: any;
  amtCancellation2: any;
  amtCancellationPlus2: any;

  amtDateChangesPre3: any;
  amtDateChanges3: any;
  amtDateChangesPlus3: any;
  amtCancellationPre3: any;
  amtCancellation3: any;
  amtCancellationPlus3: any;

  amtDateChangesPre4: any;
  amtDateChanges4: any;
  amtDateChangesPlus4: any;
  amtCancellationPre4: any;
  amtCancellation4: any;
  amtCancellationPlus4: any;

  isCancellationShow: boolean = true;
  isCancellationShow1: boolean = true;
  isCancellationShow2: boolean = true;
  isCancellationShow3: boolean = true;
  isCancellationShow4: boolean = true;

  itineraries1: any = [];
  itineraries2: any = [];
  itineraries3: any = [];
  itineraries4: any = [];

  scheduleDescs1: any = [];
  scheduleDescs2: any = [];
  scheduleDescs3: any = [];
  scheduleDescs4: any = [];

  legDescs1: any = [];
  legDescs2: any = [];
  legDescs3: any = [];
  legDescs4: any = [];

  itineraryGroups1: any = [];
  itineraryGroups2: any = [];
  itineraryGroups3: any = [];
  itineraryGroups4: any = [];

  fareComponentDescs1: any = [];
  fareComponentDescs2: any = [];
  fareComponentDescs3: any = [];
  fareComponentDescs4: any = [];

  baggageAllowanceDescs1: any = [];
  baggageAllowanceDescs2: any = [];
  baggageAllowanceDescs3: any = [];
  baggageAllowanceDescs4: any = [];
  selectedFlightData: any = {
    data1: {}, data2: {}, data3: {}, data4: {}
  };

  @ViewChild('returnDatePick') returnDatePick: ElementRef | any;
  @ViewChild('roundTripButton') roundTripButton: ElementRef | any;
  @ViewChild('suggDeparture1') suggDeparture1: ElementRef | any;
  @ViewChild('suggReturn1') suggReturn1: ElementRef | any;
  @ViewChild('suggDeparture2') suggDeparture2: ElementRef | any;
  @ViewChild('suggReturn2') suggReturn2: ElementRef | any;
  @ViewChild('suggDeparture3') suggDeparture3: ElementRef | any;
  @ViewChild('suggReturn3') suggReturn3: ElementRef | any;
  @ViewChild('suggDeparture4') suggDeparture4: ElementRef | any;
  @ViewChild('suggReturn4') suggReturn4: ElementRef | any;
  @ViewChild('suggDepartureMobile1') suggDepartureMobile: ElementRef | any;
  @ViewChild('suggReturnMobile1') suggReturnMobile: ElementRef | any;
  private wasInside = false;
  selectedFlightDeparture: FlightRoutes[] = [];
  selectedFlightDeparturePanel: FlightRoutes[] = [];
  selectedFlightDepartureMobile: FlightRoutes[] = [];
  selectedFlightArrival: FlightRoutes[] = [];
  selectedFlightArrivalPanel: FlightRoutes[] = [];
  selectedFlightArrivalMobile: FlightRoutes[] = [];

  item: any;
  firstLegData: any[] = [];
  secondLegData: any[] = [];
  firstLegFareData: any[] = [];
  isDomMulticity: boolean = false;
  isIntMulticity: boolean = false;
  loaderData: any;
  startDate: any;
  endDate: any;
  bookingConfirmation: any;
  reservation: any;
  referenceNum: any;
  user: any;
  ticketstatus!: string;
  cabincode: any;

  fmgFareData: FormGroup | any;
  fmgFlightSegment: FormGroup | any;
  fmgMulticityFlight: FormGroup | any;
  fmgBookingSearch: FormGroup | any;

  Path: any;
  agentFare: any;
  clientTotal: any;
  gdsFare: any;
  clientFareTotal: any;
  DateChangeFee: any;
  bookingJourney: any;
  trip: any[] = [];
  logo: any;
  airlineName: any;
  airlineNumber: any;
  airlineCode: any;
  aircraft: any;
  price = 1;
  missingData: any[] = [];
  fare: any;

  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
    private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
    private router: Router, private httpClient: HttpClient, private toastrService: ToastrService, private elementRef: ElementRef,
    public shareService: ShareService, public flightHelper: FlightHelperService) {


  }
  initSearchPanel() {
    this.selectedFlightDeparture = [];
    this.selectedFlightArrival = [];
    this.selectedFlightDeparturePanel = [];
    this.selectedFlightArrivalPanel = [];
    this.selectedFlightDepartureMobile = [];
    this.selectedFlightArrivalMobile = [];
    this.num1 = 0, this.num2 = 0, this.num3 = 0;
    this.cmbAirport = this.flightHelper.getAirportData();
    this.tempAirportsDeparture1 = this.cmbAirport.slice(0, 15);
    this.tempAirportsArrival1 = this.cmbAirport.slice(0, 15);
    this.tempAirportsDeparture2 = this.cmbAirport.slice(0, 15);
    this.tempAirportsArrival2 = this.cmbAirport.slice(0, 15);
    this.tempAirportsDeparture3 = this.cmbAirport.slice(0, 15);
    this.tempAirportsArrival3 = this.cmbAirport.slice(0, 15);
    this.tempAirportsDeparture4 = this.cmbAirport.slice(0, 15);
    this.tempAirportsArrival4 = this.cmbAirport.slice(0, 15);

    this.tempDefaultDepArrFlight1 = this.cmbAirport.slice(0, 15);
    this.paramModelData = this.flightHelper.getLocalFlightSearch();
    this._setPanelSearchHeader(this.paramModelData);
    this.getFlightSearch(this.paramModelData);
    this.bookingJourney = this.paramModelData.Journey[0].bookingJourney;
    this.agentFare = this.paramModelData.agentTotal;
    this.clientTotal = this.paramModelData.clientTotal;
    this.gdsFare = this.paramModelData.gdsTotal;
    this.DateChangeFee = this.paramModelData.DateChangeFee;
    this.logo = this.paramModelData.Journey[0].bookingJourney[0].bookingFlight[0].vLogo;
    this.airlineName = this.paramModelData.Journey[0].bookingJourney[0].bookingFlight[0].nvAirlinesName;
    this.airlineCode = this.paramModelData.Journey[0].bookingJourney[0].bookingFlight[0].nvIataDesignator;
    this.airlineNumber = this.paramModelData.Journey[0].bookingJourney[0].bookingFlight[0].iFlightNumber;
    this.aircraft = this.paramModelData.Journey[0].bookingJourney[0].bookingFlight[0].aircraft;

    // console.log(this.paramModelData.isMultiCity);

    let dept: any = {}, ret: any = {};
    for (let i = 0; i < this.paramModelData.Departure.length; i++) {
      dept = {
        Id: this.paramModelData.Departure[i].Id,
        CityCode: this.paramModelData.Departure[i].CityCode,
        CityName: this.paramModelData.Departure[i].CityName,
        CountryCode: this.paramModelData.Departure[i].CountryCode,
        CountryName: this.paramModelData.Departure[i].CountryName,
        AirportName: this.paramModelData.Departure[i].AirportName,
        AirportCode: "", Date: this.paramModelData.Departure[i].Date
      };
      ret = {
        Id: this.paramModelData.Arrival[i].Id,
        CityCode: this.paramModelData.Arrival[i].CityCode,
        CityName: this.paramModelData.Arrival[i].CityName,
        CountryCode: this.paramModelData.Arrival[i].CountryCode,
        CountryName: this.paramModelData.Arrival[i].CountryName,
        AirportName: this.paramModelData.Arrival[i].AirportName,
        AirportCode: "", Date: this.paramModelData.Arrival[i].Date
      };
      this.selectedFlightDeparture.push(dept);
      this.selectedFlightDeparturePanel.push(dept);
      this.selectedFlightDepartureMobile.push(dept);
      this.selectedFlightArrival.push(ret);
      this.selectedFlightArrivalPanel.push(ret);
      this.selectedFlightArrivalMobile.push(ret);
    }
    for (let item of this.bookingJourney) {
      let findInd = this.paramModelData.Departure.findIndex((x: { BookingJourneyId: string | any[]; }) => x.BookingJourneyId.indexOf(item.vBookingJourneyId) > -1);
      if (findInd == -1) {
        this.trip.push(item);
      }
    }
  }
  trueFalseDeparture() {
    this.isSuggDeparture1 = false;
    this.isSuggDeparture2 = false;
    this.isSuggDeparture3 = false;
    this.isSuggDeparture4 = false;
  }
  trueFalseArrival() {
    this.isSuggReturn1 = false;
    this.isSuggReturn2 = false;
    this.isSuggReturn3 = false;
    this.isSuggReturn4 = false;
  }
  addRemoveCity(isDel: boolean = false, delIdx: number = -1) {
    try {
      var trip1 = $("#trip0").css("display");
      var trip2 = $("#trip1").css("display");
      var trip3 = $("#trip2").css("display");
      var trip4 = $("#trip3").css("display");
      // console.log("Before Departure and Arrival:: isDel:" + isDel + " index:" + delIdx);
      // console.log(this.selectedFlightDeparturePanel);
      // console.log(this.selectedFlightArrivalPanel);
      if (isDel && delIdx > -1) {
        this.selectedFlightDeparturePanel.splice(delIdx, 1);
        this.selectedFlightArrivalPanel.splice(delIdx, 1);
      } else {
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
      for (let i = 0; i < 4; i++) $("#tripAction" + i).css("display", "none");
      if ((trip1 == "block" || trip1 == "flex") && (trip2 == "block" || trip2 == "flex")
        && (trip3 == "block" || trip3 == "flex") && (trip4 == "block" || trip4 == "flex")) {
        if (isDel) {
          $("#trip3").css("display", "none");
          $("#tripAction2").css("display", "block");
        } else {
          $("#tripAction3").css("display", "block");
        }
        setTimeout(() => {
          flatpickr(".flat-datepick-from3", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length - 1].Date)
          });
        });
      } else if ((trip1 == "block" || trip1 == "flex") && (trip2 == "block" || trip2 == "flex")
        && (trip3 == "block" || trip3 == "flex")) {
        if (isDel) {
          $("#trip2").css("display", "none");
          $("#tripAction1").css("display", "block");
        } else {
          $("#trip3").css("display", "block");
          $("#tripAction3").css("display", "block");
          this.selectedFlightDeparturePanel[3].Date = this.selectedFlightDeparturePanel[2].Date;
        }
        setTimeout(() => {
          flatpickr(".flat-datepick-from2", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length - 1].Date)
          });
          flatpickr(".flat-datepick-from3", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length - 1].Date)
          });
        });
      } else if ((trip1 == "block" || trip1 == "flex") && (trip2 == "block" || trip2 == "flex")) {
        if (isDel) {
          $("#trip1").css("display", "none");
          $("#tripAction0").css("display", "block");
        } else {
          $("#trip2").css("display", "block");
          $("#tripAction2").css("display", "block");
          this.selectedFlightDeparturePanel[2].Date = this.selectedFlightDeparturePanel[1].Date;
        }
        setTimeout(() => {
          flatpickr(".flat-datepick-from1", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length - 1].Date)
          });
          flatpickr(".flat-datepick-from2", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[this.selectedFlightDeparturePanel.length - 1].Date)
          });
        });
      } else if ((trip1 == "block" || trip1 == "flex")) {
        $("#trip1").css("display", "block");
        $("#tripAction1").css("display", "block");
        this.selectedFlightDeparturePanel[1].Date = this.selectedFlightDeparturePanel[0].Date;
        setTimeout(() => {
          flatpickr(".flat-datepick-from0", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
          });
          flatpickr(".flat-datepick-from1", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
          });
        });
      } else {
        $("#trip0").css("display", "block");
        $("#tripAction0").css("display", "block");
      }
    } catch (exp) { }
  }
  getSelectedDate(i: number, type: string): string {
    let ret: string = "";
    type = type.toLowerCase();
    try {
      let date = "";
      if (type.indexOf("departure") > -1) {
        date = this.selectedFlightDeparturePanel[i].Date;
        ret = this.shareService.getDayNameShort(date) + ", " +
          this.shareService.getDay(date) + " " +
          this.shareService.getMonthShort(date) + "'" +
          this.shareService.getYearShort(date);
      } else {
        if (!this.isOneway) {
          date = this.selectedFlightArrivalPanel[i].Date;
          ret = this.shareService.getDayNameShort(date) + ", " +
            this.shareService.getDay(date) + " " +
            this.shareService.getMonthShort(date) + "'" +
            this.shareService.getYearShort(date);
        }
      }
    } catch (exp) { }
    return ret;
  }
  changeDepartureReturnDate(evt: any, type: string, ind: number) {
    try {
      let val = evt.srcElement.value;
      if (!this.shareService.isNullOrEmpty(val)) {
        if (type.indexOf("departure") > -1) {
          if (ind > -1) {
            let selectDate = this.shareService.getBdToDb(val);
            this.selectedFlightDeparturePanel[ind].Date = selectDate;
            let flatInd = ind == 0 ? ind : ind - 1;
            setTimeout(() => {
              flatpickr(".flat-datepick-from" + ind, {
                enableTime: false,
                dateFormat: "d-m-Y",
                allowInput: true,
                minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[flatInd].Date)
              });
            });
            for (let i = ind + 1; i < this.selectedFlightDeparturePanel.length; i++) {
              this.selectedFlightDeparturePanel[i].Date = selectDate;
              setTimeout(() => {
                flatpickr(".flat-datepick-from" + i, {
                  enableTime: false,
                  dateFormat: "d-m-Y",
                  allowInput: true,
                  minDate: this.shareService.getFlatPickDate(selectDate)
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
          if (ind == 0) {
            flatpickr(".flat-datepick-to", {
              enableTime: false,
              dateFormat: "d-m-Y",
              allowInput: true,
              minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[ind].Date)
            });
          }
        } else {
          let db = this.shareService.getBdToDb(val);
          this.selectedFlightArrivalPanel[ind].Date =
            this.shareService.getDayNameShort(db) + ", " +
            this.shareService.getDay(db) + " " +
            this.shareService.getMonthShort(db) + "'" +
            this.shareService.getYearShort(db);
          this.tripTypeSet("2");
        }
      }
      // console.log("Val:" + val);
    } catch (exp) {
      console.log(exp);
    }
  }
  getSelectedData(i: number, type: string): string {
    let ret: string = "Select City";
    type = type.toLowerCase();
    try {
      if (type.indexOf("departure") > -1) {
        ret = this.selectedFlightDeparturePanel[i].CityName;
      } else {
        ret = this.selectedFlightArrivalPanel[i].CityName;
      }
      if (this.shareService.isNullOrEmpty(ret)) ret = "Select City";
    } catch (exp) { }
    return ret;
  }
  flightTo(ind: number) {
    try {
      this.trueFalseArrival();
      if (ind == 0) {
        this.isSuggReturn1 = true;
        setTimeout(() => {
          this.suggReturn1.focus();
        });
      } else if (ind == 1) {
        this.isSuggReturn2 = true;
        setTimeout(() => {
          this.suggReturn2.focus();
        });
      } else if (ind == 2) {
        this.isSuggReturn3 = true;
        setTimeout(() => {
          this.suggReturn3.focus();
        });
      } else if (ind == 3) {
        this.isSuggReturn4 = true;
        setTimeout(() => {
          this.suggReturn4.focus();
        });
      }
    } catch (exp) { }
  }
  flightFrom(ind: number) {
    try {
      this.trueFalseDeparture();
      if (ind == 0) {
        this.isSuggDeparture1 = true;
        setTimeout(() => {
          this.suggDeparture1.focus();
        });
      } else if (ind == 1) {
        this.isSuggDeparture2 = true;
        setTimeout(() => {
          this.suggDeparture2.focus();
        });
      } else if (ind == 2) {
        this.isSuggDeparture3 = true;
        setTimeout(() => {
          this.suggDeparture3.focus();
        });
      } else if (ind == 3) {
        this.isSuggDeparture4 = true;
        setTimeout(() => {
          this.suggDeparture4.focus();
        });
      }
    } catch (exp) { }
  }
  flightToOutside(ind: number) {
    try {
      if (ind == 0) {
        this.isSuggReturn1 = false;
        this.tempAirportsArrival1 = this.tempDefaultDepArrFlight1;
      } else if (ind == 1) {
        this.isSuggReturn2 = false;
        this.tempAirportsArrival2 = this.tempDefaultDepArrFlight2;
      } else if (ind == 2) {
        this.isSuggReturn3 = false;
        this.tempAirportsArrival3 = this.tempDefaultDepArrFlight3;
      } else if (ind == 3) {
        this.isSuggReturn4 = false;
        this.tempAirportsArrival4 = this.tempDefaultDepArrFlight4;
      }
    } catch (exp) { }
  }
  flightFromOutside(ind: number) {
    try {
      if (ind == 0) {
        this.isSuggDeparture1 = false;
        this.tempAirportsDeparture1 = this.tempDefaultDepArrFlight1;
      } else if (ind == 1) {
        this.isSuggDeparture2 = false;
        this.tempAirportsDeparture2 = this.tempDefaultDepArrFlight2;
      } else if (ind == 2) {
        this.isSuggDeparture3 = false;
        this.tempAirportsDeparture3 = this.tempDefaultDepArrFlight3;
      } else if (ind == 3) {
        this.isSuggDeparture4 = false;
        this.tempAirportsDeparture4 = this.tempDefaultDepArrFlight4;
      }
    } catch (exp) { }
  }
  exchangeDepartureArrival(i: number) {
    let temp: FlightRoutes = this.selectedFlightDeparturePanel[i];
    let tempDeptDate = this.selectedFlightDeparturePanel[i].Date;
    let tempRetDate = this.selectedFlightArrivalPanel[i].Date;
    this.selectedFlightDeparturePanel[i] = this.selectedFlightArrivalPanel[i];
    this.selectedFlightArrivalPanel[i] = temp;
    this.selectedFlightDeparturePanel[i].Date = tempDeptDate;
    this.selectedFlightArrivalPanel[i].Date = tempRetDate;
  }
  returnCrossClick() {
    this.trueFalseSearchType();
    this.clearReturn();
    this.isOneway = true;
    this.tripTypeSet("1");
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
  trueFalseSearchType(): void {
    this.isOneway = false;
    this.isMulticity = false;
    this.isRoundtrip = false;
  }
  clearReturn() {
    this.selectedFlightArrival[0].Date = "";
    // this.selectedReturnPanelText="";
  }
  tripChange(event: any) {
    this.trueFalseSearchType();
    var type = event.target.value;
    type = Number.parseInt(type);
    this.selectedTripTypeId = this.flightHelper.getTripTypeId(type);
    setTimeout(() => {
      $("#travellersBox").css("display", "none");
    });
    switch (type) {
      case 1:
        this.isOneway = true;
        this.clearReturn();
        this.selectedFlightDeparture[0].Date = this.getCurrentDate();
        this.selectedFlightArrival[0].Date = "";
        this.selectedFlightDeparturePanel[0].Date = this.getCurrentDate();
        this.selectedFlightArrivalPanel[0].Date = "";
        $("#travellersBox").css("display", "none");
        for (let i = 1; i < this.selectedFlightDeparturePanel.length; i++) this.selectedFlightDeparturePanel.splice(i, 1);
        for (let i = 1; i < this.selectedFlightArrivalPanel.length; i++) this.selectedFlightArrivalPanel.splice(i, 1);
        setTimeout(() => {
          flatpickr(".flat-datepick-from0", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: "today"
          });
          flatpickr(".flat-datepick-to", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparture[0].Date)
          });
        });
        break;
      case 2:
        this.isRoundtrip = true;
        this.selectedFlightDeparture[0].Date = this.getCurrentDate();
        this.selectedFlightArrival[0].Date = this.getCurrentDate();
        this.selectedFlightDeparturePanel[0].Date = this.getCurrentDate();
        this.selectedFlightArrivalPanel[0].Date = this.getCurrentDate();
        for (let i = 1; i < this.selectedFlightDeparturePanel.length; i++) this.selectedFlightDeparturePanel.splice(i, 1);
        for (let i = 1; i < this.selectedFlightArrivalPanel.length; i++) this.selectedFlightArrivalPanel.splice(i, 1);
        $("#travellersBox").css("display", "none");
        setTimeout(() => {
          flatpickr(".flat-datepick-from0", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: "today"
          });
          flatpickr(".flat-datepick-to", {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparture[0].Date)
          });
        });
        break;
      case 3:
        this.isMulticity = true;
        this.selectedFlightDeparture[0].Date = this.getCurrentDate();
        this.selectedFlightDeparturePanel[0].Date = this.getCurrentDate();
        $("#travellersBox").css("display", "none");
        break;
      default:
        break;
    }
  }
  travellerInfoOutside() {
    try {
      this.showBox = false;
      // if($("#travellersBox").css("display")=="block")
      // {
      //   $("#travellersBox").css("display","none");
      // }
      // $("input[name='Travellers_Class'][value='"+this.selectedClassTypeCode+"']").prop('checked', true);
    } catch (exp) { }
  }
  travellerFrom() {
    this.showBox = true;
    if ($("#travellersBox").css("display") == "none") {
      $("#travellersBox").css("display", "block");
    } else {
      $("#travellersBox").css("display", "none");
    }
  }
  selectEvent(item: any, type: string, i: number) {
    type = type.toString().toLowerCase();
    if (type.indexOf("from") > -1) {
      this.selectedFlightDeparturePanel[i].Id = item.id;
      this.selectedFlightDeparturePanel[i].CityCode = item.code;
      this.selectedFlightDeparturePanel[i].CityName = item.cityname;
      this.selectedFlightDeparturePanel[i].CountryCode = item.countrycode;
      this.selectedFlightDeparturePanel[i].CountryName = item.countryname;
      this.selectedFlightDeparturePanel[i].AirportName = item.text;
    } else {
      this.selectedFlightArrivalPanel[i].Id = item.id;
      this.selectedFlightArrivalPanel[i].CityCode = item.code;
      this.selectedFlightArrivalPanel[i].CityName = item.cityname;
      this.selectedFlightArrivalPanel[i].CountryCode = item.countrycode;
      this.selectedFlightArrivalPanel[i].CountryName = item.countryname;
      this.selectedFlightArrivalPanel[i].AirportName = item.text;
    }
  }
  getMultiRoutes(): string {
    let ret: string = "";
    try {
      let s = this.selectedFlightDeparturePanel[0].CityName,
        e = this.selectedFlightArrivalPanel[this.selectedFlightArrivalPanel.length - 1].CityName;
      let mid = "";
      for (let i = 1; i < this.selectedFlightDeparturePanel.length; i++) {
        if (mid.indexOf(this.selectedFlightDeparturePanel[i].CityName) == -1) {
          mid += this.selectedFlightDeparturePanel[i].CityName + ",";
        }
      }
      for (let i = 0; i < this.selectedFlightArrivalPanel.length - 1; i++) {
        if (mid.indexOf(this.selectedFlightArrivalPanel[i].CityName) == -1) {
          mid += this.selectedFlightArrivalPanel[i].CityName + ",";
        }
      }
      if (!this.shareService.isNullOrEmpty(mid)) {
        mid = " via " + mid.substring(0, mid.length - 1);
      }
      ret = s + " to " + e + mid;
    } catch (exp) { }
    return ret;
  }
  onFocused(e: any) {
    this.tempAirportsDeparture1 = this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsArrival1 = this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsDeparture2 = this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsArrival2 = this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsDeparture3 = this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsArrival3 = this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsDeparture4 = this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0, 15);
    this.tempAirportsArrival4 = this.flightHelper.getDistinctAirport(this.cmbAirport).slice(0, 15);
  }
  onChangeSearch(val: string, type: string, ind: number) {
    try {
      val = val.toLowerCase();
      type = type.toLowerCase();
      let data = this.shareService.distinctList(this.cmbAirport.filter(x =>
        (x.code).toString().toLowerCase().startsWith(val)
        || (x.cityname).toString().toLowerCase().startsWith(val)
        || (x.countryname).toString().toLowerCase().startsWith(val)
        || (x.text).toString().toLowerCase().startsWith(val)
      ));
      if (type.indexOf("from") > -1) {
        this.tempAirportsDeparture1 = [];
        this.tempAirportsDeparture2 = [];
        this.tempAirportsDeparture3 = [];
        this.tempAirportsDeparture4 = [];
        if (ind == 0) {
          this.tempAirportsDeparture1 = data;
          if (this.tempAirportsDeparture1.length > 15) {
            this.tempAirportsDeparture1 = this.tempAirportsDeparture1.slice(0, 15);
          }
        } else if (ind == 1) {
          this.tempAirportsDeparture2 = data;
          if (this.tempAirportsDeparture2.length > 15) {
            this.tempAirportsDeparture2 = this.tempAirportsDeparture2.slice(0, 15);
          }
        } else if (ind == 2) {
          this.tempAirportsDeparture3 = data;
          if (this.tempAirportsDeparture3.length > 15) {
            this.tempAirportsDeparture3 = this.tempAirportsDeparture3.slice(0, 15);
          }
        } else if (ind == 3) {
          this.tempAirportsDeparture4 = data;
          if (this.tempAirportsDeparture4.length > 15) {
            this.tempAirportsDeparture4 = this.tempAirportsDeparture4.slice(0, 15);
          }
        }
      } else {
        this.tempAirportsArrival1 = [];
        this.tempAirportsArrival2 = [];
        this.tempAirportsArrival3 = [];
        this.tempAirportsArrival4 = [];
        if (ind == 0) {
          this.tempAirportsArrival1 = data;
          if (this.tempAirportsArrival1.length > 15) {
            this.tempAirportsArrival1 = this.tempAirportsArrival1.slice(0, 15);
          }
        } else if (ind == 1) {
          this.tempAirportsArrival2 = data;
          if (this.tempAirportsArrival2.length > 15) {
            this.tempAirportsArrival2 = this.tempAirportsArrival2.slice(0, 15);
          }
        } else if (ind == 2) {
          this.tempAirportsArrival3 = data;
          if (this.tempAirportsArrival3.length > 15) {
            this.tempAirportsArrival3 = this.tempAirportsArrival3.slice(0, 15);
          }
        } else if (ind == 3) {
          this.tempAirportsArrival4 = data;
          if (this.tempAirportsArrival4.length > 15) {
            this.tempAirportsArrival4 = this.tempAirportsArrival4.slice(0, 15);
          }
        }
      }
    } catch (exp) { }
  }
  topMulticitySection() {
    if (this.isMulticityTopSection) {
      this.isMulticityTopSection = false;
    } else {
      this.isMulticityTopSection = true;
      let len = this.selectedFlightDeparture.length;
      setTimeout(() => {
        for (let i = 0; i < len; i++) {
          flatpickr(".flat-datepick-from" + i, {
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput: true,
            minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparture[i].Date)
          });
        }
      });
      for (let i = 0; i < len; i++) {
        setTimeout(() => {
          $("#trip" + i).css("display", "block");
          $("#tripAction" + i).css("display", "none");
        });
      }
      switch (len) {
        case 1:
          setTimeout(() => {
            $("#tripAction0").css("display", "block");
          });
          break;
        case 2:
          setTimeout(() => {
            $("#tripAction1").css("display", "block");
          });
          break;
        case 3:
          setTimeout(() => {
            $("#tripAction2").css("display", "block");
          });
          break;
        case 4:
          setTimeout(() => {
            $("#tripAction3").css("display", "block");
          });
          break;
      }
    }
  }
  flightSearchWork(): void {
    $("#travellersBox").css("display", "none");
    let tripTypeId = this.selectedTripTypeId;
    let multiDeparture: any[] = [];
    let multiArrival: any[] = [];
    for (let i = 0; i < this.selectedFlightDeparturePanel.length; i++) {
      multiDeparture.push({
        Id: this.selectedFlightDeparturePanel[i].Id,
        CityCode: this.selectedFlightDeparturePanel[i].CityCode,
        CityName: this.selectedFlightDeparturePanel[i].CityName,
        CountryCode: this.selectedFlightDeparturePanel[i].CountryCode,
        CountryName: this.selectedFlightDeparturePanel[i].CountryName,
        AirportName: this.selectedFlightDeparturePanel[i].AirportName,
        Date: this.selectedFlightDeparturePanel[i].Date
      });
    }
    for (let i = 0; i < this.selectedFlightArrivalPanel.length; i++) {
      multiArrival.push({
        Id: this.selectedFlightArrivalPanel[i].Id,
        CityCode: this.selectedFlightArrivalPanel[i].CityCode,
        CityName: this.selectedFlightArrivalPanel[i].CityName,
        CountryCode: this.selectedFlightArrivalPanel[i].CountryCode,
        CountryName: this.selectedFlightArrivalPanel[i].CountryName,
        AirportName: this.selectedFlightArrivalPanel[i].AirportName
      });
    }
    let loaderData = {
      Departure: multiDeparture, Arrival: multiArrival, adult: this.num1,
      childList: this.childListFinal, infant: this.num3, classType: this.selectedClassTypeCode, airlines: "", stop: 2,
      cabinTypeId: this.selectedClassTypeId, tripTypeId: tripTypeId, childList1: this.childList, childList2: this.childList2,
      isOneWay: this.isOneway, isRoundTrip: this.isRoundtrip, isMultiCity: this.isMulticity
    };
    // let loaderData = {
    //   Departure: multiDeparture, Arrival: multiArrival, adult: this.num1,
    //   childList: this.childListFinal, infant: this.num3, classType: this.selectedClassTypeCode, airlines: "", stop: 2,
    //   cabinTypeId: this.selectedClassTypeId, tripTypeId: tripTypeId, childList1: this.childList, childList2: this.childList2,
    //   isOneWay: this.isOneway, isRoundTrip: this.isRoundtrip, isMultiCity: this.isMulticity
    // };
    // console.log(loaderData);
    this._setStoreFlightData(loaderData, true);

  }
  private _setStoreFlightData(data: any, isSave: boolean) {
    let isDomestic = true;
    if ("loaderData" in localStorage) {
      localStorage.removeItem("loaderData");
    }
    localStorage.setItem('loaderData', JSON.stringify(data));
    let loadData: any = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < loadData.Departure.length; i++) {
      if (this.getCountryCode(loadData.Departure[i].CityCode) != this.getCountryCode(loadData.Arrival[i].CityCode)) {
        isDomestic = false;
        break;
      }
    }
    if (isSave) {
      this.saveFlightSearchHistory(data, isDomestic);
    } else {
      this._navigationWork(isDomestic);
    }
  }
  saveFlightSearchHistory(data: any, isDomestic: boolean) {
    try {
      let loadData: any = JSON.parse(JSON.stringify(data));
      let airlinesId = this.airlines1.find((x: { id: any; }) => x.id == data.airlines);
      if (airlinesId == undefined || airlinesId == "" || airlinesId == "0") {
        airlinesId = this.flightHelper.allAirlinesId;
      } else {
        airlinesId = airlinesId.masterId;
      }
      this.fmgSearchHistoryDetails = this.fmgSearchHistory.get('FlightSearchDetailsHistory') as FormArray;
      for (var item of data.childList) {
        this.fmgSearchHistoryDetails.push(this.fb.group({
          VFlightSearchHistoryId: '',
          IChildAge: item.age
        }));
      }
      let toId = "";
      let toReturnDate = "";
      if (this.isMulticity) {
        toId = loadData.Arrival[loadData.Arrival.length - 1].Id;
      } else {
        toId = loadData.Arrival[0].Id;
        toReturnDate = data.returnDate;
      }

      this.fmgSearchHistoryInfo = this.fmgSearchHistory.get('FlightSearchHistory') as FormData;
      this.fmgSearchHistoryInfo.patchValue({
        Id: this.shareService.getUserId(),
        DSearchDate: new Date(),
        VAirportIdfrom: this.selectedFlightDeparture[0].Id,
        VAirportIdto: toId,
        DDepartureDate: this.selectedFlightDeparture[0].Date,
        DReturnDate: toReturnDate,
        VFlightTypeId: data.tripTypeId,
        VCabinTypeId: data.cabinTypeId,
        INumberAdult: data.adult,
        INumberChild: data.childList.length,
        INumberInfant: data.infant,
        VAirlinesId: airlinesId,
        VFlightStopId: this.flightHelper.getFlightStopId(data.stop),
        VFareTypeId: this.flightHelper.getFareTypeId(1)
      });
      this.authService.saveFlightSearchHistory(Object.assign({}, this.fmgSearchHistory.value)).subscribe(subData => {

        if (subData.success) {
          this._navigationWork(isDomestic);
        }
      }, err => {
      });
    } catch (exp) {
      console.log(exp);
    }
  }
  save() {
    this.showBox = false;
    $("#travellersBox").css("display", "none");
  }
  childSelect(val: any, i: number) {
    try {
      this.childListFinal[i] = parseInt(val);
    } catch (exp) { }
  }
  changeClassLabel(code: string) {
    try {
      this.selectedClassTypeCode = code;
      this.selectedClassTypeId = this.flightHelper.getCabinTypeId(code);
      this.selectedClassTypeName = this.flightHelper.getCabinTypeName(code);
      let x = this._getTotalTravellers() + "Travellers," + this.selectedClassTypeName;
      if (x.length > 18) {
        let y = this._getTotalTravellers() + "Travellers,";
        this.selectedClassTypeName = this.selectedClassTypeName.toString().substring(0, 18 - y.length) + "..";
      }
    } catch (exp) { }
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
                this.childListFinal.splice(this.num2 - 1, 1);
                this.num2--;
              }
              break;
            case 3:
              while (4 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.childListFinal.splice(this.num2 - 1, 1);
                this.num2--;
              }
              break;
            case 4:
              while (3 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.childListFinal.splice(this.num2 - 1, 1);
                this.num2--;
              }
              break;
            case 5:
              while (2 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.childListFinal.splice(this.num2 - 1, 1);
                this.num2--;
              }
              break;
            case 6:
              while (1 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.childListFinal.splice(this.num2 - 1, 1);
                this.num2--;
              }
              break;
            case 7:
              while (0 < this.num2) {
                this.childList = this.shareService.removeList(this.num2, this.childList);
                this.childListFinal.splice(this.num2 - 1, 1);
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
                  this.childListFinal.push(2);
                } else {
                  this.num2--;
                }
                break;
              case 2:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                } else {
                  this.num2--;
                }
                break;
              case 3:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                } else {
                  this.num2--;
                }
                break;
              case 4:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                } else {
                  this.num2--;
                }
                break;
              case 4:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                } else {
                  this.num2--;
                }
                break;
              case 5:
                this.num2++;
                if (7 - this.num1 >= this.num2) {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                } else {
                  this.num2--;
                }
                break;
              case 6:
                this.num2++;
                if (this.num1 - (this.num1 - 1) == this.num2) {
                  this.childList.push(this.num2);
                  this.childListFinal.push(2);
                } else {
                  this.num2--;
                }
                break;
            }
          } else if (this.num2 >= 6 && this.num2 < 9) {
            this.num2++;
            this.childList2.push(this.num2);
            this.childListFinal.push(2);
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
            this.childListFinal.splice(this.num2 - 1, 1);
            this.num2--;
          } else {
            this.childList2 = this.shareService.removeList(this.num2, this.childList2);
            this.childListFinal.splice(this.num2 - 1, 1);
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
  private _navigationWork(isDomestic: boolean): void {
    if (isDomestic) {
      if (this.isOneway) {
        this.router.navigate(['/home/domestic-one-way-flight-search']);
      } else if (this.isRoundtrip) {
        this.router.navigate(['/home/domestic-round-trip-flight-search']);
      } else if (this.isMulticity) {
        this.router.navigate(['/home/dom-multicity']);
        window.location.reload();
      }
    } else {
      if (this.isOneway) {
        this.router.navigate(['/home/international-one-way-flight-search']);
      } else if (this.isRoundtrip) {
        this.router.navigate(['/home/international-round-trip-flight-search']);
      } else if (this.isMulticity) {
        this.router.navigate(['/home/int-multicity']);
      }
    }
  }
  _getTotalTravellers(): number {
    return this.num1 + this.num2 + this.num3;
  }
  private _setPanelSearchHeader(data: any) {
    try {
      this.isOneway = data.isOneWay;
      this.isRoundtrip = data.isRoundTrip;
      this.isMulticity = data.isMultiCity;
      this.childListFinal = data.childList;
      this.childList = data.childList1;
      this.childList2 = data.childList2;
      this.num1 = data.adult;
      this.num2 = data.childList.length;
      this.num3 = data.infant;
      this.selectedClassTypeId = data.cabinTypeId;
      this.selectedClassTypeCode = data.classType;
      this.selectedClassTypeName = this.flightHelper.getCabinTypeName(data.classType);
      let tripVal = this.isOneway ? "1" : (this.isRoundtrip ? "2" : "3");
      this.selectTripType.setValue(tripVal);
      this.selectedTripTypeId = this.flightHelper.getTripTypeId(parseInt(tripVal));
      $("#travellersBox").hide();
      for (let i = 0; i < this.paramModelData.Departure.length; i++) {
        this.selectedFlightDeparture[i].CityName = data.Departure[i].CityName;
        this.selectedFlightDeparture[i].CountryCode = data.Departure[i].CountryCode;
        this.selectedFlightDeparture[i].CountryName = data.Departure[i].CountryName;
        this.selectedFlightDeparture[i].AirportName = data.Departure[i].AirportName;

        this.selectedFlightDeparturePanel[i].CityName = data.Departure[i].CityName;
        this.selectedFlightDeparturePanel[i].CountryCode = data.Departure[i].CountryCode;
        this.selectedFlightDeparturePanel[i].CountryName = data.Departure[i].CountryName;
        this.selectedFlightDeparturePanel[i].AirportName = data.Departure[i].AirportName;

        this.selectedFlightArrival[i].CityName = data.Arrival[i].CityName;
        this.selectedFlightArrival[i].CountryCode = data.Arrival[i].CountryCode;
        this.selectedFlightArrival[i].CountryName = data.Arrival[i].CountryName;
        this.selectedFlightArrival[i].AirportName = data.Arrival[i].AirportName;
        this.selectedFlightArrivalPanel[i].CityName = data.Arrival[i].CityName;
        this.selectedFlightArrivalPanel[i].CountryCode = data.Arrival[i].CountryCode;
        this.selectedFlightArrivalPanel[i].CountryName = data.Arrival[i].CountryName;
        this.selectedFlightArrivalPanel[i].AirportName = data.Arrival[i].AirportName;

        if (i == 0 && this.isRoundtrip) {
          this.selectedFlightArrival[i].Date = data.Arrival[i].Date;
        }
      }
      setTimeout(() => {
        flatpickr(".flat-datepick-from0", {
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput: true,
          minDate: this.shareService.getFlatPickDate(this.selectedFlightDeparturePanel[0].Date)
        });
      });
    } catch (exp) { }
  }
  farePanelWiseSearch(data: any) {
    try {
      var model = JSON.parse(localStorage.getItem('loaderData')!);
      this.selectedFlightDeparture[0].Date = data.departureDate;
      model.Departure[0].Date = data.departureDate;
      if (this.isRoundtrip) {
        if (Date.parse(data.departureDate) > Date.parse(model.Arrival[0].Date)) {
          let d = new Date(model.Arrival[0].Date);
          model.Arrival[0].Date = d.getFullYear() + "-" + this.shareService.padLeft(d.getMonth() + "", '0', 2) + "-" +
            this.shareService.padLeft(d.getDate() + "", '0', 2)
        }
        this.selectedFlightArrival[0].Date = model.Arrival[0].Date;
      }
      this.getFlightSearch(model);
    } catch (exp) {
      console.log(exp);
    }
  }
  FlightSearch(): FormArray {
    return this.fmgFlightSearch.get('FlightSearch') as FormArray;
  }
  ChildList(index: number): FormArray {
    return this.FlightSearch().at(index).get('childList') as FormArray;
  }
  private _setFormGroupInfo(data: any) {
    this.fmgFlightSearchWay = this.fmgFlightSearch.get('FlightSearch') as FormArray;
    if (data.isMultiCity) {
      for (let i = 0; i < data.Departure.length; i++) {
        this.fmgFlightSearchWay.push(this.fb.group({
          fromFlight: data.Departure[i].CityCode, toFlight: data.Arrival[i].CityCode,
          departureDate: data.Departure[i].Date, returnDate: "", adult: data.adult,
          infant: data.infant, classType: data.classType, airlines: data.airlines, stop: data.stop,
          userId: localStorage.getItem('uid'),
          providerId: data.providerId,
          airlinesOperating: "",
          airlinesMarketing: "",
          airlinesNumber: 0,
          domestic: true,
          cabinTypeId: this.flightHelper.getCabinTypeId(data.classType),
          tripTypeId: this.flightHelper.getTripTypeId(3),
          childList: new FormArray([])
        }));
        Object.keys(this.fmgFlightSearchWay.controls).forEach((key) => {
          this.fmgChild = this.fmgFlightSearchWay.controls[key].get('childList') as FormArray;
          if (data.childList != undefined) {
            for (let item of data.childList) {
              this.fmgChild.push(this.fb.group({
                id: item.id,
                age: item.age
              }));
            }
          }
        });
      }
    } else {
      this.fmgFlightSearchWay.push(this.fb.group({
        fromFlight: data.fromFlightCode, toFlight: data.toFlightCode,
        departureDate: data.departureDate, returnDate: data.returnDate, adult: data.adult,
        infant: data.infant, classType: data.classType, airlines: data.airlines, stop: data.stop,
        userId: localStorage.getItem('uid'),
        providerId: data.providerId,
        airlinesOperating: "",
        airlinesMarketing: "",
        airlinesNumber: 0,
        cabinTypeId: this.flightHelper.getCabinTypeId(data.classType),
        tripTypeId: this.getTripTypeId(),
        childList: new FormArray([])
      }));
      Object.keys(this.fmgFlightSearchWay.controls).forEach((key) => {
        this.fmgChild = this.fmgFlightSearchWay.controls[key].get('childList') as FormArray;
        if (data.childList != undefined) {
          for (let item of data.childList) {
            this.fmgChild.push(this.fb.group({
              id: item.id,
              age: item.age
            }));
          }
        }
      });
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
  getMarkupTypeList() {
    try {
      this.authService.getMarkupList().subscribe(data => {
        for (let item of data.markuplist) {
          this.markupList.push(item);
        }
      }, err => {
        console.log(err);
      });
    } catch (exp) { }
  }
  getAgencyPermission() {
    var userId = this.shareService.getUserId();
    try {
      this.authService.getAgencyPermit(userId).subscribe(data => {
        if (data.data) {
          this.initSearchPanel();
          this.getMarkupTypeList();
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
    } catch (exp) { }
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'flight_search_details');
  }
  init() {
    this.fmgFlightSearch = this.fb.group({
      FlightSearch: new FormArray([])
    });
    this.fmgFlightSearchWay = this.fb.group({
      fromFlight: ['', Validators.required],
      toFlight: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      adult: ['', Validators.required],
      childList: new FormArray([]),
      infant: ['', Validators.required],
      classType: ['', Validators.required],
      airlines: ['', Validators.required],
      airlinesOperating: ['', Validators.required],
      airlinesMarketing: ['', Validators.required],
      airlinesNumber: ['', Validators.required],
      stop: ['', Validators.required],
      providerId: ['', Validators.required],
      userId: ['', Validators.required],
      cabinTypeId: ['', Validators.required],
      tripTypeId: ['', Validators.required]
    });
    this.fmgBookingSearch = this.fb.group({
      User: ['', Validators.nullValidator],
      StartDate: ['', Validators.nullValidator],
      EndDate: ['', Validators.nullValidator],
      TicketStatusId: ['', Validators.nullValidator],
      Cabincode: ['', Validators.nullValidator],
      ReferenceNum: ['', Validators.nullValidator],
      Reservation: ['', Validators.nullValidator],
      MulticityFlight: new FormArray([]),
      DateChangeFlightSegment: new FormArray([]),
      FareData: new FormArray([])
    });
    this.fmgMulticityFlight = this.fb.group({
      ProviderId: ['', Validators.nullValidator],
      Airlinecode: ['', Validators.nullValidator],
      DepartureCode: ['', Validators.nullValidator],
      ArrivalCode: ['', Validators.nullValidator],
      AirCraftId: ['', Validators.nullValidator],
      FlightTypeId: ['', Validators.nullValidator],
      DepartureDateTime: ['', Validators.nullValidator],
      ArrivalDateTime: ['', Validators.nullValidator],
      AgentFareTotal: ['', Validators.nullValidator],
      ClientFareTotal: ['', Validators.nullValidator],
      GdsFareTotal: ['', Validators.nullValidator],
      Serial: ['', Validators.nullValidator]
    });
    this.fmgFareData = this.fb.group({
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
      MarkupPercent: ['', Validators.nullValidator]
    });
    this.fmgFlightSegment = this.fb.group({
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
    $("#travellersBox").css("display", "none");
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
    flatpickr(".flat-datepick-from0", {
      enableTime: false,
      dateFormat: "d-m-Y",
      allowInput: true,
      minDate: "today"
    });
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
  bottomFlightAction() {
    var isBottom = $("#bottomFlightData").css("display");
    $("#triggerSummary").removeClass("clicked");
    $("#triggerOverlay").removeClass("clicked");
    if (isBottom == "block" || isBottom == "flex") {
      $("#bottomFlightData").hide('slow');
    } else {
      $("#bottomFlightData").show('slow');
      $("#triggerSummary").addClass("clicked");
      $("#triggerOverlay").addClass("clicked");
    }
  }
  bookAndHoldAction() {
    this.isDomMulticity = false;
    this.isIntMulticity = false;
    this.firstLegData = [];
    this.firstLegFareData = [];
    let tripTypeNumber = "";
    var paramModel = JSON.parse(JSON.stringify(this.paramModelData));
    this.Path = this.paramModelData.pagePath;
    this.cabincode = this.paramModelData.classType;
    var data = localStorage.getItem("flightDataIndividual");
    this.item = JSON.parse(data!);
    if (this.item == null) {
      this.item = this.selectedFlightData;
    }
    if (this.item.tripTypeId == undefined) {
      tripTypeNumber = this.item.data1.tripTypeId;
      this.isDomMulticity = true;
    }
    let flightIndi = this.selectedFlightData;
    // console.log(flightIndi);
    if (this.isDomMulticity == true) {
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
    }
    this.loaderData = this.flightHelper.getLocalFlightSearch();
    this._setPanelSearchHeader(this.loaderData);
    this.getFlightSearch(this.loaderData);
    this.startDate = this.loaderData.Departure[0].Date;
    this.endDate = this.loaderData.Departure[1].Date;
    if (this.loaderData.Departure.length > 2) {
      this.endDate = this.loaderData.Departure[2].Date;
    }
    if (this.loaderData.Departure.length > 3) {
      this.endDate = this.loaderData.Departure[3].Date;
    }

    this.bookHoldWork(this.startDate, this.endDate);
  }
  flightFromMobile() {
    try {
      this.isSuggDepartureMobile1 = true;
      setTimeout(() => {
        this.suggDepartureMobile.focus();
      }, 50);
    } catch (exp) { }
  }
  flightFromOutsideMobile() {
    try {
      this.isSuggDepartureMobile1 = false;
      this.tempAirportsDeparture1 = this.tempDefaultDepArrFlight1;
    } catch (exp) { }
  }
  flightToOutsideMobile() {
    try {
      this.isSuggReturnMobile = false;
      this.tempAirportsArrival1 = this.tempDefaultDepArrFlight1;
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
  getSelectedDeparture(i: number): string {
    let ret: string = "";
    try {
      ret = this.selectedFlightDeparture[i].CityName;
    } catch (exp) { }
    return ret;
  }
  getSelectedArrival(i: number): string {
    let ret: string = "";
    try {
      ret = this.selectedFlightArrival[i].CityName;
    } catch (exp) { }
    return ret;
  }
  changeDepartureDate(evt: any, i: any) {
    try {
      let val = evt.srcElement.value;
      if (i > -1) {
        this.selectedFlightDeparture[i].Date = this.shareService.getBdToDb(val);
        this.selectedFlightDeparture[i + 1].Date = this.shareService.getBdToDb(val);
        flatpickr(".flat-datepick-from" + (i + 1), {
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput: true,
          minDate: this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[i].Date), '0', 2) + "." +
            this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[i].Date), '0', 2) + "." +
            this.shareService.getYearLong(this.selectedFlightDeparture[i].Date)
        });
        if (Date.parse(this.selectedFlightDeparture[i].Date) > Date.parse(this.selectedFlightArrival[i].Date)) {
          let d = this.selectedFlightDeparture[i].Date;
          this.selectedFlightArrival[i].Date = this.shareService.getYearLong(d) + "-" +
            this.shareService.padLeft(this.shareService.getMonth(d), '0', 2) + "-" +
            this.shareService.padLeft(this.shareService.getDay(d), '0', 2);
        }
      }
    } catch (exp) { }
  }
  fareTypeChange(event: any) {
    this.isAgentFare = event.target.checked;
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
  getCountryCode(id: string): string {
    let ret: string = "";
    try {
      var data = this.cmbAirport.find(x => x.code.toString().toLowerCase() == id.trim().toLowerCase());
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
  travellerFromMobile() {
    $("#travellersMobile").modal('show');
  }
  applyMobile() {
    this._setChildSet();
    $("#travellersMobile").modal('hide');
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
      data.aircraftlist.forEach((aircraft: { vAircraftId: any, nvAircraftCode: any, nvAircraftName: any }) => {
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
    this._getAirCraftList();
    setTimeout(() => {
      if (modelData != undefined && modelData != "") {
        var data = JSON.parse(JSON.stringify(modelData));
        this.isLoad = true;
        this._setLoaderValue(data);
        this._setFormGroupInfo(data);
        this.fareSearchSkeleton = true;
        this.topFlightSearchSkeleton = true;
        // console.log(this.fmgFlightSearch.value);
        try {
          this.authService.getFlightSearch(Object.assign({}, this.fmgFlightSearch.value)).subscribe(data => {
            this.topFlightSearchSkeleton = false;
            var data = data.data[0];
            let isNF = 0;
            if (!this.shareService.isObjectEmpty(data)) {
              this.providerId = data.providerId;
              if (!this.shareService.isObjectEmpty(data.flightData)) {
                isNF = 1;
                for (let i = 0; i < data.flightData.length; i++) {
                  if (i == 0) {
                    this.itineraries1 = data.flightData[0].groupedItineraryResponse.itineraryGroups[0].itineraries;
                    this.scheduleDescs1 = data.flightData[0].groupedItineraryResponse.scheduleDescs;
                    this.legDescs1 = data.flightData[0].groupedItineraryResponse.legDescs;
                    this.fareComponentDescs1 = data.flightData[0].groupedItineraryResponse.fareComponentDescs;
                    this.baggageAllowanceDescs1 = data.flightData[0].groupedItineraryResponse.baggageAllowanceDescs;
                  }
                  if (i == 1) {
                    this.itineraries2 = data.flightData[1].groupedItineraryResponse.itineraryGroups[0].itineraries;
                    this.scheduleDescs2 = data.flightData[1].groupedItineraryResponse.scheduleDescs;
                    this.legDescs2 = data.flightData[1].groupedItineraryResponse.legDescs;
                    this.fareComponentDescs2 = data.flightData[1].groupedItineraryResponse.fareComponentDescs;
                    this.baggageAllowanceDescs2 = data.flightData[1].groupedItineraryResponse.baggageAllowanceDescs;
                  }
                  if (i == 2) {
                    this.itineraries3 = data.flightData[2].groupedItineraryResponse.itineraryGroups[0].itineraries;
                    this.scheduleDescs3 = data.flightData[2].groupedItineraryResponse.scheduleDescs;
                    this.legDescs3 = data.flightData[2].groupedItineraryResponse.legDescs;
                    this.fareComponentDescs3 = data.flightData[2].groupedItineraryResponse.fareComponentDescs;
                    this.baggageAllowanceDescs3 = data.flightData[2].groupedItineraryResponse.baggageAllowanceDescs;
                  }
                  if (i == 3) {
                    this.itineraries4 = data.flightData[3].groupedItineraryResponse.itineraryGroups[0].itineraries;
                    this.scheduleDescs4 = data.flightData[3].groupedItineraryResponse.scheduleDescs;
                    this.legDescs4 = data.flightData[3].groupedItineraryResponse.legDescs;
                    this.fareComponentDescs4 = data.flightData[3].groupedItineraryResponse.fareComponentDescs;
                    this.baggageAllowanceDescs4 = data.flightData[3].groupedItineraryResponse.baggageAllowanceDescs;
                  }
                }
                this._setMarkupDiscountDetails(data);
              }
            }
            if (isNF == 0) this.isNotFound = true;
            this.isLoad = false;
          }, error => {
          });
        } catch (exp) {
          this.isNotFound = true;
        }
      }
    }, 1000);
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
  selectedItemSet(i: any, depDate: any, airFromId: any, airToId: any, depCity: any, depCountry: any, arrCity: any, arrCountry: any, retDate: any = "") {
    this.selectedFlightDeparture[i].Date = depDate;
    this.selectedFlightDeparture[i].Id = airFromId;
    this.selectedFlightArrival[i].Id = airToId;
    this.selectedFlightDeparture[i].CityName = depCity;
    this.selectedFlightArrival[i].CityName = arrCity;
    this.selectedFlightDeparture[i].CountryName = depCountry;
    this.selectedFlightArrival[i].CountryName = arrCountry;

    // this.selectedDeparturePanelText=
    // this.shareService.getDayNameShort(this.selectedDepartureDate)+", "+
    // this.shareService.getDay(this.selectedDepartureDate)+" "+
    // this.shareService.getMonthShort(this.selectedDepartureDate)+"'"+
    // this.shareService.getYearShort(this.selectedDepartureDate);

    if (retDate != undefined && retDate != '') {
      this.selectedFlightArrival[0].Date = retDate;
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
      this._getAirlineList();
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
      // for (let item of data.bookInfo[0]) {
      //   this.isInstant = item.isInstant;
      // }
    } else {
      this.isNotFound = true;
    }
  }
  _flightWork() {
    this._getAirCraftList();
    setTimeout(() => {
      this.setAirlineList();
    });
  }
  filterFlightSearch(ind: number) {
    let stopList: number[] = [];
    let deptTimeFilter: string[] = [];
    let arrTimeFilter: string[] = [];
    switch (ind) {
      case 0:
        this.tempDomOneWayData1 = this.domOneWayData1;
        let minRange = this.flightHelper._minimumRange(this.domOneWayData1);
        let maxRange = this.udMinRangeVal1;
        var airlineFilter = this.selectedAirFilterList1;
        for (let item of this.stopCountList1) {
          var id = $("#stopId" + item.id).is(":checked");
          if (id) {
            let stop = isNaN(this.shareService.getOnlyNumber(item.title)) ? 0 : this.shareService.getOnlyNumber(item.title);
            stopList.push(stop);
          }
        }
        let isRefund: boolean | undefined = undefined;
        if ($("#chkRefundYes" + ind).is(":checked")) {
          isRefund = true;
        }
        if ($("#chkRefundNo" + ind).is(":checked")) {
          isRefund = false;
        }
        for (let item of this.selectedDeptTimeList1) {
          deptTimeFilter.push(item.text);
        }
        for (let item of this.selectedArrTimeList1) {
          arrTimeFilter.push(item.text);
        }
        if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
          && deptTimeFilter.length > 0 && arrTimeFilter.length > 0
          && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
          && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
          && deptTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        }
        else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
          && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined
          && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        }
        else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (maxRange != 0 && stopList.length > 0 && isRefund != undefined) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund;
          });
        } else if (maxRange != 0 && stopList.length > 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (maxRange != 0 && stopList.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange != 0 && stopList.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (stopList.length > 0 && isRefund != undefined && deptTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (stopList.length > 0 && isRefund != undefined && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (stopList.length > 0 && isRefund != undefined && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (isRefund != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (isRefund != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }//two
        else if (maxRange != 0 && stopList.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && stopList.indexOf(i.stop) > -1;
          });
        } else if (maxRange != 0 && isRefund != undefined) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && i.refundable == isRefund;
          });
        } else if (maxRange != 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (maxRange != 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange != 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return (i.totalPrice >= minRange && i.totalPrice <= maxRange)
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (stopList.length > 0 && isRefund != undefined) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund;
          });
        } else if (stopList.length > 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (stopList.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (stopList.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (isRefund != undefined && deptTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return i.refundable == isRefund
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (isRefund != undefined && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return i.refundable == isRefund
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (isRefund != undefined && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return i.refundable == isRefund
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (airlineFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
            return arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else {
          if (maxRange != 0) {
            this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
              return (i.totalPrice >= minRange && i.totalPrice <= maxRange);
            });
          }
          else if (stopList.length > 0) {
            this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
              return stopList.indexOf(i.stop) > -1;
            });
          } else if (isRefund != undefined) {
            this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
              return i.refundable == isRefund;
            });
          } else if (deptTimeFilter.length > 0) {
            // console.log("Before Temp FIlter ::");
            // console.log(this.domOneWayData1);
            // console.log(this.tempDomOneWayData1);
            this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
              return deptTimeFilter.indexOf(i.departureTime) > -1;
            });
            // console.log("After Temp FIlter ::");
            // console.log(this.tempDomOneWayData1);
          } else if (arrTimeFilter.length > 0) {
            this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
              return arrTimeFilter.indexOf(i.arrivalTime) > -1;
            });
          } else if (airlineFilter.length > 0) {
            this.tempDomOneWayData1 = this.domOneWayData1.filter(function (i, j) {
              return airlineFilter.indexOf(i.airlineCode) > -1;
            });
          } else {
            this.setTempFilterData(ind);
          }
        }
        break;

      case 1:
        this.tempDomOneWayData2 = this.domOneWayData2;
        let minRange2 = this.flightHelper._minimumRange(this.domOneWayData2);
        let maxRange2 = this.udMinRangeVal2;
        var airlineFilter = this.selectedAirFilterList2;
        for (let item of this.stopCountList2) {
          var id = $("#stopId" + item.id).is(":checked");
          if (id) {
            let stop = isNaN(this.shareService.getOnlyNumber(item.title)) ? 0 : this.shareService.getOnlyNumber(item.title);
            stopList.push(stop);
          }
        }
        let isRefund2: boolean | undefined = undefined;
        if ($("#chkRefundYes" + ind).is(":checked")) {
          isRefund2 = true;
        }
        if ($("#chkRefundNo" + ind).is(":checked")) {
          isRefund2 = false;
        }
        for (let item of this.selectedDeptTimeList2) {
          deptTimeFilter.push(item.text);
        }
        for (let item of this.selectedArrTimeList2) {
          arrTimeFilter.push(item.text);
        }


        if (maxRange2 != 0 && stopList.length > 0 && isRefund2 != undefined
          && deptTimeFilter.length > 0 && arrTimeFilter.length > 0
          && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (maxRange2 != 0 && stopList.length > 0 && isRefund2 != undefined
          && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange2 != 0 && stopList.length > 0 && isRefund2 != undefined
          && deptTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        }
        else if (maxRange2 != 0 && stopList.length > 0 && isRefund2 != undefined
          && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange2 != 0 && stopList.length > 0 && isRefund2 != undefined
          && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (stopList.length > 0 && isRefund2 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        }
        else if (stopList.length > 0 && isRefund2 != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (isRefund2 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (maxRange2 != 0 && stopList.length > 0 && isRefund2 != undefined) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2;
          });
        } else if (maxRange2 != 0 && stopList.length > 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (maxRange2 != 0 && stopList.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange2 != 0 && stopList.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (stopList.length > 0 && isRefund2 != undefined && deptTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (stopList.length > 0 && isRefund2 != undefined && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (stopList.length > 0 && isRefund2 != undefined && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (isRefund2 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (isRefund2 != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }//two
        else if (maxRange2 != 0 && stopList.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && stopList.indexOf(i.stop) > -1;
          });
        } else if (maxRange2 != 0 && isRefund2 != undefined) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && i.refundable == isRefund2;
          });
        } else if (maxRange2 != 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (maxRange2 != 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange2 != 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2)
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (stopList.length > 0 && isRefund2 != undefined) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund2;
          });
        } else if (stopList.length > 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (stopList.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (stopList.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (isRefund2 != undefined && deptTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return i.refundable == isRefund2
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (isRefund2 != undefined && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return i.refundable == isRefund2
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (isRefund2 != undefined && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return i.refundable == isRefund2
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (airlineFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
            return arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else {
          if (maxRange2 != 0) {
            this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
              return (i.totalPrice >= minRange2 && i.totalPrice <= maxRange2);
            });
          }
          else if (stopList.length > 0) {
            this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
              return stopList.indexOf(i.stop) > -1;
            });
          } else if (isRefund2 != undefined) {
            this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
              return i.refundable == isRefund2;
            });
          } else if (deptTimeFilter.length > 0) {
            this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
              return deptTimeFilter.indexOf(i.departureTime) > -1;
            });
          } else if (arrTimeFilter.length > 0) {
            this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
              return arrTimeFilter.indexOf(i.arrivalTime) > -1;
            });
          } else if (airlineFilter.length > 0) {
            this.tempDomOneWayData2 = this.domOneWayData2.filter(function (i, j) {
              return airlineFilter.indexOf(i.airlineCode) > -1;
            });
          } else {
            this.setTempFilterData(ind);
          }
        }
        break;

      case 2:
        this.tempDomOneWayData3 = this.domOneWayData3;
        let minRange3 = this.flightHelper._minimumRange(this.domOneWayData3);
        let maxRange3 = this.udMinRangeVal3;
        var airlineFilter = this.selectedAirFilterList3;
        for (let item of this.stopCountList3) {
          var id = $("#stopId" + ind + item.id).is(":checked");
          if (id) {
            let stop = isNaN(this.shareService.getOnlyNumber(item.title)) ? 0 : this.shareService.getOnlyNumber(item.title);
            stopList.push(stop);
          }
        }
        let isRefund3: boolean | undefined = undefined;
        if ($("#chkRefundYes" + ind).is(":checked")) {
          isRefund3 = true;
        }
        if ($("#chkRefundNo" + ind).is(":checked")) {
          isRefund3 = false;
        }
        for (let item of this.selectedDeptTimeList3) {
          deptTimeFilter.push(item.text);
        }
        for (let item of this.selectedArrTimeList3) {
          arrTimeFilter.push(item.text);
        }


        if (maxRange3 != 0 && stopList.length > 0 && isRefund3 != undefined
          && deptTimeFilter.length > 0 && arrTimeFilter.length > 0
          && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (maxRange3 != 0 && stopList.length > 0 && isRefund3 != undefined
          && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange3 != 0 && stopList.length > 0 && isRefund3 != undefined
          && deptTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        }
        else if (maxRange3 != 0 && stopList.length > 0 && isRefund3 != undefined
          && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange3 != 0 && stopList.length > 0 && isRefund3 != undefined
          && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (stopList.length > 0 && isRefund3 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        }
        else if (stopList.length > 0 && isRefund3 != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (isRefund3 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (maxRange3 != 0 && stopList.length > 0 && isRefund3 != undefined) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3;
          });
        } else if (maxRange3 != 0 && stopList.length > 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (maxRange3 != 0 && stopList.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange3 != 0 && stopList.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (stopList.length > 0 && isRefund3 != undefined && deptTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (stopList.length > 0 && isRefund3 != undefined && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (stopList.length > 0 && isRefund3 != undefined && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (isRefund3 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (isRefund3 != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }//two
        else if (maxRange3 != 0 && stopList.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && stopList.indexOf(i.stop) > -1;
          });
        } else if (maxRange3 != 0 && isRefund3 != undefined) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && i.refundable == isRefund3;
          });
        } else if (maxRange3 != 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (maxRange3 != 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange3 != 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3)
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (stopList.length > 0 && isRefund3 != undefined) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund3;
          });
        } else if (stopList.length > 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (stopList.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (stopList.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (isRefund3 != undefined && deptTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return i.refundable == isRefund3
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (isRefund3 != undefined && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return i.refundable == isRefund3
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (isRefund3 != undefined && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return i.refundable == isRefund3
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (airlineFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
            return arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else {
          if (maxRange3 != 0) {
            this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
              return (i.totalPrice >= minRange3 && i.totalPrice <= maxRange3);
            });
          }
          else if (stopList.length > 0) {
            this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
              return stopList.indexOf(i.stop) > -1;
            });
          } else if (isRefund3 != undefined) {
            this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
              return i.refundable == isRefund3;
            });
          } else if (deptTimeFilter.length > 0) {
            this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
              return deptTimeFilter.indexOf(i.departureTime) > -1;
            });
          } else if (arrTimeFilter.length > 0) {
            this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
              return arrTimeFilter.indexOf(i.arrivalTime) > -1;
            });
          } else if (airlineFilter.length > 0) {
            this.tempDomOneWayData3 = this.domOneWayData3.filter(function (i, j) {
              return airlineFilter.indexOf(i.airlineCode) > -1;
            });
          } else {
            this.setTempFilterData(ind);
          }
        }
        break;

      case 3:
        this.tempDomOneWayData4 = this.domOneWayData4;
        let minRange4 = this.flightHelper._minimumRange(this.domOneWayData4);
        let maxRange4 = this.udMinRangeVal4;
        var airlineFilter = this.selectedAirFilterList4;
        for (let item of this.stopCountList4) {
          var id = $("#stopId" + ind + item.id).is(":checked");
          if (id) {
            let stop = isNaN(this.shareService.getOnlyNumber(item.title)) ? 0 : this.shareService.getOnlyNumber(item.title);
            stopList.push(stop);
          }
        }
        let isRefund4: boolean | undefined = undefined;
        if ($("#chkRefundYes" + ind).is(":checked")) {
          isRefund4 = true;
        }
        if ($("#chkRefundNo" + ind).is(":checked")) {
          isRefund4 = false;
        }
        for (let item of this.selectedDeptTimeList4) {
          deptTimeFilter.push(item.text);
        }
        for (let item of this.selectedArrTimeList4) {
          arrTimeFilter.push(item.text);
        }


        if (maxRange4 != 0 && stopList.length > 0 && isRefund4 != undefined
          && deptTimeFilter.length > 0 && arrTimeFilter.length > 0
          && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (maxRange4 != 0 && stopList.length > 0 && isRefund4 != undefined
          && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange4 != 0 && stopList.length > 0 && isRefund4 != undefined
          && deptTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        }
        else if (maxRange4 != 0 && stopList.length > 0 && isRefund4 != undefined
          && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange4 != 0 && stopList.length > 0 && isRefund4 != undefined
          && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (stopList.length > 0 && isRefund4 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        }
        else if (stopList.length > 0 && isRefund4 != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (isRefund4 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (maxRange4 != 0 && stopList.length > 0 && isRefund4 != undefined) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4;
          });
        } else if (maxRange4 != 0 && stopList.length > 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (maxRange4 != 0 && stopList.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange4 != 0 && stopList.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (stopList.length > 0 && isRefund4 != undefined && deptTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (stopList.length > 0 && isRefund4 != undefined && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (stopList.length > 0 && isRefund4 != undefined && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (isRefund4 != undefined && deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (isRefund4 != undefined && deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }//two
        else if (maxRange4 != 0 && stopList.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && stopList.indexOf(i.stop) > -1;
          });
        } else if (maxRange4 != 0 && isRefund4 != undefined) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && i.refundable == isRefund4;
          });
        } else if (maxRange4 != 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (maxRange4 != 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (maxRange4 != 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4)
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (stopList.length > 0 && isRefund4 != undefined) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && i.refundable == isRefund4;
          });
        } else if (stopList.length > 0 && deptTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (stopList.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (stopList.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return stopList.indexOf(i.stop) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else if (isRefund4 != undefined && deptTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return i.refundable == isRefund4
              && deptTimeFilter.indexOf(i.departureTime) > -1;
          });
        } else if (isRefund4 != undefined && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return i.refundable == isRefund4
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (isRefund4 != undefined && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return i.refundable == isRefund4
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (deptTimeFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && arrTimeFilter.indexOf(i.arrivalTime) > -1;
          });
        } else if (deptTimeFilter.length > 0 && airlineFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return deptTimeFilter.indexOf(i.departureTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        } else if (airlineFilter.length > 0 && arrTimeFilter.length > 0) {
          this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
            return arrTimeFilter.indexOf(i.arrivalTime) > -1
              && airlineFilter.indexOf(i.airlineCode) > -1;
          });
        }
        else {
          if (maxRange4 != 0) {
            this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
              return (i.totalPrice >= minRange4 && i.totalPrice <= maxRange4);
            });
          }
          else if (stopList.length > 0) {
            this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
              return stopList.indexOf(i.stop) > -1;
            });
          } else if (isRefund4 != undefined) {
            this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
              return i.refundable == isRefund4;
            });
          } else if (deptTimeFilter.length > 0) {
            this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
              return deptTimeFilter.indexOf(i.departureTime) > -1;
            });
          } else if (arrTimeFilter.length > 0) {
            this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
              return arrTimeFilter.indexOf(i.arrivalTime) > -1;
            });
          } else if (airlineFilter.length > 0) {
            this.tempDomOneWayData4 = this.domOneWayData4.filter(function (i, j) {
              return airlineFilter.indexOf(i.airlineCode) > -1;
            });
          } else {
            this.setTempFilterData(ind);
          }
        }
        break;

    }
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
  _getGroupPassengerInfoList(data: any): any {
    let ret: any = "";
    try {
      ret = data.itineraries[0].pricingInformation[0].fare.passengerInfoList;
    } catch (exp) { }
    return ret;
  }
  setFlightData(ind: number) {
    try {
      let adultMember = this.adult;
      let childListMember = [];
      let infantMember = this.infant;
      childListMember = this.FlightSearch().value[0].childList;
      this.missingData = [];
      if (childListMember == undefined) {
        childListMember = [];
      }
      switch (ind) {
        case 0:
          this.flightSearchSkeleton1 = false;
          this.domOneWayData1 = [];
          for (let itiItem of this.itineraries1) {
            let ref: number = Number.parseInt(itiItem.legs[0].ref) - 1;
            let depRef = this.flightHelper._schedules(ref, this.legDescs1)[0].ref - 1;
            let arrRef = this.flightHelper._schedules(ref, this.legDescs1)[this.flightHelper._schedules(ref, this.legDescs1).length - 1].ref - 1;
            let airlineCode = this.flightHelper._airlinesCode(depRef, this.scheduleDescs1, this.airlines1);
            let airlineName = this.flightHelper._airlinesName(depRef, this.scheduleDescs1, this.airlines1);
            let departureTime = this.flightHelper._timeDeparture(depRef, this.scheduleDescs1);
            let arrivalTime = this.flightHelper._timeArrival(arrRef, this.scheduleDescs1);
            let airlineNumber = this.flightHelper._carrier(depRef, this.scheduleDescs1).marketingFlightNumber;
            let airCraftCode = this.flightHelper._equipment(depRef, this.scheduleDescs1).code;
            let airCraftName = this.getAirCraftName(this.flightHelper._equipment(depRef, this.scheduleDescs1).code);
            let departureCityCode = this.flightHelper._departure(depRef, this.scheduleDescs1).airport;
            let arrivalCityCode = this.flightHelper._arrival(arrRef, this.scheduleDescs1).airport;
            let departureCity = this.flightHelper.getDepCityName(this.flightHelper._departure(depRef, this.scheduleDescs1).airport, this.airports1);
            let arrivalCity = this.flightHelper.getArrCityName(this.flightHelper._arrival(arrRef, this.scheduleDescs1).airport, this.airports1);
            let differenceTime = this.flightHelper._difference(this.flightHelper._timeDeparture(depRef, this.scheduleDescs1), this.flightHelper._timeArrival(arrRef, this.scheduleDescs1));

            let adultBase = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries1).equivalentAmount;
            let adultTax = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries1).totalTaxAmount;
            let adultTotal = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries1).totalFare;
            let adultDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, adultBase, adultTax, adultTotal, adultMember, airlineCode);

            let childBase = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries1).equivalentAmount;
            let childTax = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries1).totalTaxAmount;
            let childTotal = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries1).totalFare;
            let childDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, childBase, childTax, childTotal, childListMember.length, airlineCode);

            let infantBase = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries1).equivalentAmount;
            let infantTax = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries1).totalTaxAmount;
            let infantTotal = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries1).totalFare;
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

            let adultClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode))
              + parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode));

            let childClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode)) +
              parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode));

            let infantClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode)) +
              parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode));

            let adultAgentTotal = adultClientTotal - (adultDiscount * parseFloat(adultMember));
            let childAgentTotal = childClientTotal - (childDiscount * parseFloat(childListMember.length));
            let infantAgentTotal = infantClientTotal - (infantDiscount * parseFloat(infantMember));

            this.domOneWayData1.push({
              id: itiItem.id,
              providerId: this.providerId,
              tripTypeId: this.tripTypeId,
              cabinTypeId: this.cabinTypeId,
              airlineLogo: this.flightHelper.getAirlineLogo(airlineCode, this.airlines1),
              airlineName: airlineName,
              airlineCode: airlineCode,
              airlineId: this.flightHelper.getAirlineId(airlineCode, this.cmbAirlines),
              airlineNumber: airlineNumber,
              airCraftId: this.flightHelper.getAircraftId(airCraftCode, this.cmbAirCraft),
              airCraftCode: airCraftCode,
              airCraftName: airCraftName,
              departureDate: this.selectedFlightDeparture[ind].Date,
              arrivalDate: this.selectedFlightDeparture[ind].Date,
              departureTime: departureTime,
              arrivalTime: arrivalTime,
              departureCityId: this.selectedFlightDeparture[0].Id,
              departureCityCode: this.selectedFlightDeparture[0].CityCode,
              departureCity: this.selectedFlightDeparture[0].CityName,
              arrivalCityId: this.selectedFlightArrival[0].Id,
              arrivalCityCode: this.selectedFlightArrival[0].CityCode,
              arrivalCity: this.selectedFlightArrival[0].CityName,
              differenceTime: differenceTime,
              adult: adultMember,
              child: childListMember,
              infant: infantMember,
              stop: 0,
              stopAllCity: '',
              domestic: true,
              adjustment: 0,
              flightRouteTypeId: this.flightHelper.flightRouteType[0],
              lastTicketDate: this.flightHelper._fare(itiItem.id, this.itineraries1).lastTicketDate,
              lastTicketTime: this.flightHelper._fare(itiItem.id, this.itineraries1).lastTicketTime,
              baggageAdult: this.flightHelper._pieceOrKgsAdult(itiItem.id, this.itineraries1, this.baggageAllowanceDescs1),
              baggageChild: this.flightHelper._pieceOrKgsChild(itiItem.id, this.itineraries1, this.baggageAllowanceDescs1),
              baggageInfant: this.flightHelper._pieceOrKgsInfant(itiItem.id, this.itineraries1, this.baggageAllowanceDescs1),
              cabinAdult: this.flightHelper._passengerCabinAdult(itiItem.id, this.itineraries1, this.fareComponentDescs1),
              cabinChild: this.flightHelper._passengerCabinChild(itiItem.id, this.itineraries1, this.fareComponentDescs1),
              cabinInfant: this.flightHelper._passengerCabinInfant(itiItem.id, this.itineraries1, this.fareComponentDescs1),
              instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, airlineCode),
              airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, airlineCode),
              btnLoad: false,
              isAgentFare: this.isAgentFare,
              refundable: this.flightHelper._passengerInfoList(itiItem.id, this.itineraries1)[0].passengerInfo.nonRefundable == false ? true : false,
              fareBasisCode: this.flightHelper._fareComponentDescs(this.flightHelper._passengerInfoList(itiItem.id,
                this.itineraries1)[0].passengerInfo.fareComponents[0].ref - 1, this.fareComponentDescs1).fareBasisCode,
              markupTypeList: this.markupList,
              totalPrice: this.flightHelper._totalFare(itiItem.id, this.itineraries1).totalPrice,
              totalDiscount: adultDiscount + childDiscount + infantDiscount,
              clientFareTotal: this.flightHelper.getTotalAdultChildInfant(adultClientTotal, childClientTotal, infantClientTotal),
              agentFareTotal: this.flightHelper.getTotalAdultChildInfant(adultAgentTotal, childAgentTotal, infantAgentTotal),
              gdsFareTotal:
                (parseInt(adultMember) == 0 ? 0 : adultTotal) + (parseInt(childListMember.length) == 0 ? 0 : childTotal) + (parseInt(infantMember) == 0 ? 0 : infantTotal),
              flightSegmentData: [], fareData: {}
            });
            let fInd = 0;
            let adjustAct = 0;
            let index = this.domOneWayData1.findIndex(x => x.id === itiItem.id);
            for (let item of this.flightHelper._schedules(ref, this.legDescs1)) {
              let fref = item.ref - 1;
              let adj = 0, depAdj = 0, arrAdj = 0;
              if (item.departureDateAdjustment != undefined && item.departureDateAdjustment != '') {
                adj = item.departureDateAdjustment;
              }
              if (this.flightHelper._departure(fref, this.scheduleDescs1).dateAdjustment != undefined && this.flightHelper._departure(fref, this.scheduleDescs1).dateAdjustment != '') {
                depAdj = this.flightHelper._departure(fref, this.scheduleDescs1).dateAdjustment;
              }
              if (this.flightHelper._arrival(fref, this.scheduleDescs1).dateAdjustment != undefined && this.flightHelper._arrival(fref, this.scheduleDescs1).dateAdjustment != '') {
                arrAdj = this.flightHelper._arrival(fref, this.scheduleDescs1).dateAdjustment;
              }
              let depAirportCode = this.flightHelper._departure(fref, this.scheduleDescs1).airport;
              let depAirportId = this.flightHelper.getAirportId(depAirportCode, this.cmbAirport);
              let arrAirportCode = this.flightHelper._arrival(fref, this.scheduleDescs1).airport;
              let arrAirportId = this.flightHelper.getAirportId(arrAirportCode, this.cmbAirport);
              let airlineCode = this.flightHelper._airlinesCode(fref, this.scheduleDescs1, this.airlines1);
              let airlineId = this.flightHelper.getAirlineId(airlineCode, this.airlines1);

              this.domOneWayData1[index].flightSegmentData.push({
                airlineName: this.flightHelper._airlinesName(fref, this.scheduleDescs1, this.airlines1),
                airlineCode: airlineCode,
                airlineId: airlineId,
                domestic: true,
                airlineLogo: this.flightHelper.getAirlineLogo(this.flightHelper._airlinesCode(fref, this.scheduleDescs1, this.airlines1), this.airlines1),
                airlineNumber: this.flightHelper._carrier(fref, this.scheduleDescs1).marketingFlightNumber,
                availableSeat: this.flightHelper.getSeatsAvailability(itiItem.id, this.itineraries1),
                bookingCode: this.flightHelper._passengerInfoFareComponentsSegmentsAdult(itiItem.id, this.itineraries1).bookingCode,
                departureTime: this.flightHelper._timeDeparture(fref, this.scheduleDescs1),
                arrivalTime: this.flightHelper._timeArrival(fref, this.scheduleDescs1),
                departureCity: this.flightHelper.getDepCityName(this.flightHelper._departure(fref, this.scheduleDescs1).airport, this.airports1),
                arrivalCity: this.flightHelper.getArrCityName(this.flightHelper._arrival(fref, this.scheduleDescs1).airport, this.airports1),
                departureAirportCode: depAirportCode,
                arrivalAirportCode: arrAirportCode,
                departureAirportId: depAirportId,
                arrivalAirportId: arrAirportId,
                differenceTime: this.flightHelper._timeDifference(fref, this.scheduleDescs1),
                layOverDifference: "",
                terminalDeparture: this.flightHelper._terminalDeparture(fref, this.scheduleDescs1),
                terminalArrival: this.flightHelper._terminalArrival(fref, this.scheduleDescs1),
                stopCount: fInd,
                adjustment: adjustAct,
                departureAdjustment: depAdj,
                arrivalAdjustment: arrAdj
              });
              fInd = fInd + 1;
              this.domOneWayData1[index].adjustment += adj;
            }
            let fData = this.domOneWayData1[index].flightSegmentData;
            let lenStop = fData.length;
            let stopData = "";
            for (let item of fData) {
              stopData += item.arrivalCity + ",";
            }
            if (stopData != "") {
              stopData = stopData.substring(0, stopData.length - 1);
              if (stopData.length > 10) {
                stopData = stopData.substring(0, 10) + "..";
              }
            }
            this.domOneWayData1[index].stop = parseInt(lenStop) > 1 ? parseInt(lenStop) - 1 : 0;
            this.domOneWayData1[index].stopAllCity = stopData;
            let diff = "";
            for (let i = 0; i < this.domOneWayData1[index].flightSegmentData.length; i++) {
              try {
                let dep = this.domOneWayData1[index].flightSegmentData[i + 1].departureTime;
                let arr = this.domOneWayData1[index].flightSegmentData[i].arrivalTime;
                diff = this.flightHelper._difference(arr, dep);
              } catch (exp) {
                diff = "";
              }
              this.domOneWayData1[index].flightSegmentData[i].layOverDifference = diff;
            }

            this.domOneWayData1[index].fareData = {
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
              adultBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode),
              adultTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode),
              adultTotalClient: adultClientTotal,
              adultDiscount: adultDiscount * parseFloat(adultMember),
              adultAgentFare: adultAgentTotal,
              childBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode),
              childTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode),
              childTotalClient: childClientTotal,
              childDiscount: childDiscount * parseFloat(childListMember.length),
              childAgentFare: childAgentTotal,
              infantBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode),
              infantTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode),
              infantTotalClient: infantClientTotal,
              infantDiscount: infantDiscount * parseFloat(infantMember),
              infantAgentFare: infantAgentTotal
            };
            this.domOneWayData1[index].arrivalTime =
              this.domOneWayData1[index].flightSegmentData[this.domOneWayData1[index].flightSegmentData.length - 1].arrivalTime;
            index += 1;
          }
          this.makeProposalData1 = this.domOneWayData1[0];
          this.selectedFlightData.data1 = this.domOneWayData1[0];
          let id1 = "flight_select_left_0" + this.domOneWayData1[0].id;
          setTimeout(() => {
            $('input:radio[name=featured_left0][id=' + id1 + ']').click();
          });
          break;
        case 1:
          this.flightSearchSkeleton2 = false;
          this.domOneWayData2 = [];
          for (let itiItem of this.itineraries2) {
            let ref: number = Number.parseInt(itiItem.legs[0].ref) - 1;
            let depRef = this.flightHelper._schedules(ref, this.legDescs2)[0].ref - 1;
            let arrRef = this.flightHelper._schedules(ref, this.legDescs2)[this.flightHelper._schedules(ref, this.legDescs2).length - 1].ref - 1;
            let airlineCode = this.flightHelper._airlinesCode(depRef, this.scheduleDescs2, this.airlines2);
            let airlineName = this.flightHelper._airlinesName(depRef, this.scheduleDescs2, this.airlines2);
            let departureTime = this.flightHelper._timeDeparture(depRef, this.scheduleDescs2);
            let arrivalTime = this.flightHelper._timeArrival(arrRef, this.scheduleDescs2);
            let airlineNumber = this.flightHelper._carrier(depRef, this.scheduleDescs2).marketingFlightNumber;
            let airCraftCode = this.flightHelper._equipment(depRef, this.scheduleDescs2).code;
            let airCraftName = this.getAirCraftName(this.flightHelper._equipment(depRef, this.scheduleDescs2).code);
            let departureCityCode = this.flightHelper._departure(depRef, this.scheduleDescs2).airport;
            let arrivalCityCode = this.flightHelper._arrival(arrRef, this.scheduleDescs2).airport;
            let departureCity = this.flightHelper.getDepCityName(this.flightHelper._departure(depRef, this.scheduleDescs2).airport, this.airports2);
            let arrivalCity = this.flightHelper.getArrCityName(this.flightHelper._arrival(arrRef, this.scheduleDescs2).airport, this.airports2);
            let differenceTime = this.flightHelper._difference(this.flightHelper._timeDeparture(depRef, this.scheduleDescs2), this.flightHelper._timeArrival(arrRef, this.scheduleDescs2));

            let adultBase = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries2).equivalentAmount;
            let adultTax = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries2).totalTaxAmount;
            let adultTotal = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries2).totalFare;
            let adultDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, adultBase, adultTax, adultTotal, adultMember, airlineCode);

            let childBase = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries2).equivalentAmount;
            let childTax = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries2).totalTaxAmount;
            let childTotal = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries2).totalFare;
            let childDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, childBase, childTax, childTotal, childListMember.length, airlineCode);

            let infantBase = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries2).equivalentAmount;
            let infantTax = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries2).totalTaxAmount;
            let infantTotal = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries2).totalFare;
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

            let adultClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode))
              + parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode));

            let childClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode)) +
              parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode));

            let infantClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode)) +
              parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode));

            let adultAgentTotal = adultClientTotal - (adultDiscount * parseFloat(adultMember));
            let childAgentTotal = childClientTotal - (childDiscount * parseFloat(childListMember.length));
            let infantAgentTotal = infantClientTotal - (infantDiscount * parseFloat(infantMember));

            this.tripTypeId = this.getTripTypeId();
            this.domOneWayData2.push({
              id: itiItem.id,
              providerId: this.providerId,
              tripTypeId: this.tripTypeId,
              cabinTypeId: this.cabinTypeId,
              airlineLogo: this.flightHelper.getAirlineLogo(airlineCode, this.airlines2),
              airlineName: airlineName,
              airlineCode: airlineCode,
              airlineId: this.flightHelper.getAirlineId(airlineCode, this.cmbAirlines),
              airlineNumber: airlineNumber,
              airCraftId: this.flightHelper.getAircraftId(airCraftCode, this.cmbAirCraft),
              airCraftCode: airCraftCode,
              airCraftName: airCraftName,
              departureDate: this.selectedFlightDeparture[ind].Date,
              arrivalDate: this.selectedFlightDeparture[ind].Date,
              departureTime: departureTime,
              arrivalTime: arrivalTime,
              departureCityId: this.selectedFlightDeparture[1].Id,
              departureCityCode: this.selectedFlightDeparture[1].CityCode,
              departureCity: this.selectedFlightDeparture[1].CityName,
              arrivalCityId: this.selectedFlightArrival[1].Id,
              arrivalCityCode: this.selectedFlightArrival[1].CityCode,
              arrivalCity: this.selectedFlightArrival[1].CityName,
              differenceTime: differenceTime,
              adult: adultMember,
              child: childListMember,
              infant: infantMember,
              stop: 0,
              stopAllCity: '',
              domestic: true,
              adjustment: 0,
              flightRouteTypeId: this.flightHelper.flightRouteType[0],
              lastTicketDate: this.flightHelper._fare(itiItem.id, this.itineraries2).lastTicketDate,
              lastTicketTime: this.flightHelper._fare(itiItem.id, this.itineraries2).lastTicketTime,
              baggageAdult: this.flightHelper._pieceOrKgsAdult(itiItem.id, this.itineraries2, this.baggageAllowanceDescs2),
              baggageChild: this.flightHelper._pieceOrKgsChild(itiItem.id, this.itineraries2, this.baggageAllowanceDescs2),
              baggageInfant: this.flightHelper._pieceOrKgsInfant(itiItem.id, this.itineraries2, this.baggageAllowanceDescs2),
              cabinAdult: this.flightHelper._passengerCabinAdult(itiItem.id, this.itineraries2, this.fareComponentDescs2),
              cabinChild: this.flightHelper._passengerCabinChild(itiItem.id, this.itineraries2, this.fareComponentDescs2),
              cabinInfant: this.flightHelper._passengerCabinInfant(itiItem.id, this.itineraries2, this.fareComponentDescs2),
              instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, airlineCode),
              airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, airlineCode),
              btnLoad: false,
              isAgentFare: this.isAgentFare,
              refundable: this.flightHelper._passengerInfoList(itiItem.id, this.itineraries2)[0].passengerInfo.nonRefundable == false ? true : false,
              fareBasisCode: this.flightHelper._fareComponentDescs(this.flightHelper._passengerInfoList(itiItem.id,
                this.itineraries2)[0].passengerInfo.fareComponents[0].ref - 1, this.fareComponentDescs2).fareBasisCode,
              markupTypeList: this.markupList,
              totalPrice: this.flightHelper._totalFare(itiItem.id, this.itineraries2).totalPrice,
              totalDiscount: adultDiscount + childDiscount + infantDiscount,
              clientFareTotal: this.flightHelper.getTotalAdultChildInfant(adultClientTotal, childClientTotal, infantClientTotal),
              agentFareTotal: this.flightHelper.getTotalAdultChildInfant(adultAgentTotal, childAgentTotal, infantAgentTotal),
              gdsFareTotal:
                (parseInt(adultMember) == 0 ? 0 : adultTotal) + (parseInt(childListMember.length) == 0 ? 0 : childTotal) + (parseInt(infantMember) == 0 ? 0 : infantTotal),
              flightSegmentData: [], fareData: {}
            });
            let fInd = 0;
            let adjustAct = 0;
            let index = this.domOneWayData2.findIndex(x => x.id === itiItem.id);
            for (let item of this.flightHelper._schedules(ref, this.legDescs2)) {
              let fref = item.ref - 1;
              let adj = 0, depAdj = 0, arrAdj = 0;
              if (item.departureDateAdjustment != undefined && item.departureDateAdjustment != '') {
                adj = item.departureDateAdjustment;
              }
              if (this.flightHelper._departure(fref, this.scheduleDescs2).dateAdjustment != undefined && this.flightHelper._departure(fref, this.scheduleDescs2).dateAdjustment != '') {
                depAdj = this.flightHelper._departure(fref, this.scheduleDescs2).dateAdjustment;
              }
              if (this.flightHelper._arrival(fref, this.scheduleDescs2).dateAdjustment != undefined && this.flightHelper._arrival(fref, this.scheduleDescs2).dateAdjustment != '') {
                arrAdj = this.flightHelper._arrival(fref, this.scheduleDescs2).dateAdjustment;
              }
              let depAirportCode = this.flightHelper._departure(fref, this.scheduleDescs2).airport;
              let depAirportId = this.flightHelper.getAirportId(depAirportCode, this.cmbAirport);
              let arrAirportCode = this.flightHelper._arrival(fref, this.scheduleDescs2).airport;
              let arrAirportId = this.flightHelper.getAirportId(arrAirportCode, this.cmbAirport);
              let airlineCode = this.flightHelper._airlinesCode(fref, this.scheduleDescs2, this.airlines2);
              let airlineId = this.flightHelper.getAirlineId(airlineCode, this.airlines2);

              this.domOneWayData2[index].flightSegmentData.push({
                airlineName: this.flightHelper._airlinesName(fref, this.scheduleDescs2, this.airlines2),
                airlineCode: airlineCode,
                airlineId: airlineId,
                domestic: true,
                airlineLogo: this.flightHelper.getAirlineLogo(this.flightHelper._airlinesCode(fref, this.scheduleDescs2, this.airlines2), this.airlines2),
                airlineNumber: this.flightHelper._carrier(fref, this.scheduleDescs2).marketingFlightNumber,
                availableSeat: this.flightHelper.getSeatsAvailability(itiItem.id, this.itineraries2),
                bookingCode: this.flightHelper._passengerInfoFareComponentsSegmentsAdult(itiItem.id, this.itineraries2).bookingCode,
                departureTime: this.flightHelper._timeDeparture(fref, this.scheduleDescs2),
                arrivalTime: this.flightHelper._timeArrival(fref, this.scheduleDescs2),
                departureCity: this.flightHelper.getDepCityName(this.flightHelper._departure(fref, this.scheduleDescs2).airport, this.airports2),
                arrivalCity: this.flightHelper.getArrCityName(this.flightHelper._arrival(fref, this.scheduleDescs2).airport, this.airports2),
                departureAirportCode: depAirportCode,
                arrivalAirportCode: arrAirportCode,
                departureAirportId: depAirportId,
                arrivalAirportId: arrAirportId,
                differenceTime: this.flightHelper._timeDifference(fref, this.scheduleDescs2),
                layOverDifference: "",
                terminalDeparture: this.flightHelper._terminalDeparture(fref, this.scheduleDescs2),
                terminalArrival: this.flightHelper._terminalArrival(fref, this.scheduleDescs2),
                stopCount: fInd,
                adjustment: adjustAct,
                departureAdjustment: depAdj,
                arrivalAdjustment: arrAdj
              });
              fInd = fInd + 1;
              this.domOneWayData2[index].adjustment += adj;
            }
            let fData = this.domOneWayData2[index].flightSegmentData;
            let lenStop = fData.length;
            let stopData = "";
            for (let item of fData) {
              stopData += item.arrivalCity + ",";
            }
            if (stopData != "") {
              stopData = stopData.substring(0, stopData.length - 1);
              if (stopData.length > 10) {
                stopData = stopData.substring(0, 10) + "..";
              }
            }
            this.domOneWayData2[index].stop = parseInt(lenStop) > 1 ? parseInt(lenStop) - 1 : 0;
            this.domOneWayData2[index].stopAllCity = stopData;
            let diff = "";
            for (let i = 0; i < this.domOneWayData2[index].flightSegmentData.length; i++) {
              try {
                let dep = this.domOneWayData2[index].flightSegmentData[i + 1].departureTime;
                let arr = this.domOneWayData2[index].flightSegmentData[i].arrivalTime;
                diff = this.flightHelper._difference(arr, dep);
              } catch (exp) {
                diff = "";
              }
              this.domOneWayData2[index].flightSegmentData[i].layOverDifference = diff;
            }

            this.domOneWayData2[index].fareData = {
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
              adultBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode),
              adultTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode),
              adultTotalClient: adultClientTotal,
              adultDiscount: adultDiscount * parseFloat(adultMember),
              adultAgentFare: adultAgentTotal,
              childBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode),
              childTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode),
              childTotalClient: childClientTotal,
              childDiscount: childDiscount * parseFloat(childListMember.length),
              childAgentFare: childAgentTotal,
              infantBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode),
              infantTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode),
              infantTotalClient: infantClientTotal,
              infantDiscount: infantDiscount * parseFloat(infantMember),
              infantAgentFare: infantAgentTotal
            };
            this.domOneWayData2[index].arrivalTime =
              this.domOneWayData2[index].flightSegmentData[this.domOneWayData2[index].flightSegmentData.length - 1].arrivalTime;
            index += 1;
          }
          this.makeProposalData2 = this.domOneWayData2[0];
          this.selectedFlightData.data2 = this.domOneWayData2[0];
          let id2 = "flight_select_left_1" + this.domOneWayData1[0].id;
          setTimeout(() => {
            $('input:radio[name=featured_left1][id=' + id2 + ']').click();
          });
          break;
        case 2:
          this.flightSearchSkeleton3 = false;
          this.domOneWayData3 = [];
          for (let itiItem of this.itineraries3) {
            let ref: number = Number.parseInt(itiItem.legs[0].ref) - 1;
            let depRef = this.flightHelper._schedules(ref, this.legDescs3)[0].ref - 1;
            let arrRef = this.flightHelper._schedules(ref, this.legDescs3)[this.flightHelper._schedules(ref, this.legDescs3).length - 1].ref - 1;
            let airlineCode = this.flightHelper._airlinesCode(depRef, this.scheduleDescs3, this.airlines3);
            let airlineName = this.flightHelper._airlinesName(depRef, this.scheduleDescs3, this.airlines3);
            let departureTime = this.flightHelper._timeDeparture(depRef, this.scheduleDescs3);
            let arrivalTime = this.flightHelper._timeArrival(arrRef, this.scheduleDescs3);
            let airlineNumber = this.flightHelper._carrier(depRef, this.scheduleDescs3).marketingFlightNumber;
            let airCraftCode = this.flightHelper._equipment(depRef, this.scheduleDescs3).code;
            let airCraftName = this.getAirCraftName(this.flightHelper._equipment(depRef, this.scheduleDescs3).code);
            let departureCityCode = this.flightHelper._departure(depRef, this.scheduleDescs3).airport;
            let arrivalCityCode = this.flightHelper._arrival(arrRef, this.scheduleDescs3).airport;
            let departureCity = this.flightHelper.getDepCityName(this.flightHelper._departure(depRef, this.scheduleDescs3).airport, this.airports2);
            let arrivalCity = this.flightHelper.getArrCityName(this.flightHelper._arrival(arrRef, this.scheduleDescs3).airport, this.airports2);
            let differenceTime = this.flightHelper._difference(this.flightHelper._timeDeparture(depRef, this.scheduleDescs3), this.flightHelper._timeArrival(arrRef, this.scheduleDescs3));

            let adultBase = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries3).equivalentAmount;
            let adultTax = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries3).totalTaxAmount;
            let adultTotal = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries3).totalFare;
            let adultDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, adultBase, adultTax, adultTotal, adultMember, airlineCode);

            let childBase = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries3).equivalentAmount;
            let childTax = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries3).totalTaxAmount;
            let childTotal = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries3).totalFare;
            let childDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, childBase, childTax, childTotal, childListMember.length, airlineCode);

            let infantBase = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries3).equivalentAmount;
            let infantTax = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries3).totalTaxAmount;
            let infantTotal = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries3).totalFare;
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

            let adultClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode))
              + parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode));

            let childClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode)) +
              parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode));

            let infantClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode)) +
              parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode));

            let adultAgentTotal = adultClientTotal - (adultDiscount * parseFloat(adultMember));
            let childAgentTotal = childClientTotal - (childDiscount * parseFloat(childListMember.length));
            let infantAgentTotal = infantClientTotal - (infantDiscount * parseFloat(infantMember));

            this.tripTypeId = this.getTripTypeId();
            this.domOneWayData3.push({
              id: itiItem.id,
              providerId: this.providerId,
              tripTypeId: this.tripTypeId,
              cabinTypeId: this.cabinTypeId,
              airlineLogo: this.flightHelper.getAirlineLogo(airlineCode, this.airlines3),
              airlineName: airlineName,
              airlineCode: airlineCode,
              airlineId: this.flightHelper.getAirlineId(airlineCode, this.cmbAirlines),
              airlineNumber: airlineNumber,
              airCraftId: this.flightHelper.getAircraftId(airCraftCode, this.cmbAirCraft),
              airCraftCode: airCraftCode,
              airCraftName: airCraftName,
              departureDate: this.selectedFlightDeparture[ind].Date,
              arrivalDate: this.selectedFlightDeparture[ind].Date,
              departureTime: departureTime,
              arrivalTime: arrivalTime,
              departureCityId: this.selectedFlightDeparture[2].Id,
              departureCityCode: this.selectedFlightDeparture[2].CityCode,
              departureCity: this.selectedFlightDeparture[2].CityName,
              arrivalCityId: this.selectedFlightArrival[2].Id,
              arrivalCityCode: this.selectedFlightArrival[2].CityCode,
              arrivalCity: this.selectedFlightArrival[2].CityName,
              differenceTime: differenceTime,
              adult: adultMember,
              child: childListMember,
              infant: infantMember,
              stop: 0,
              stopAllCity: '',
              domestic: true,
              adjustment: 0,
              flightRouteTypeId: this.flightHelper.flightRouteType[0],
              lastTicketDate: this.flightHelper._fare(itiItem.id, this.itineraries3).lastTicketDate,
              lastTicketTime: this.flightHelper._fare(itiItem.id, this.itineraries3).lastTicketTime,
              baggageAdult: this.flightHelper._pieceOrKgsAdult(itiItem.id, this.itineraries3, this.baggageAllowanceDescs3),
              baggageChild: this.flightHelper._pieceOrKgsChild(itiItem.id, this.itineraries3, this.baggageAllowanceDescs3),
              baggageInfant: this.flightHelper._pieceOrKgsInfant(itiItem.id, this.itineraries3, this.baggageAllowanceDescs3),
              cabinAdult: this.flightHelper._passengerCabinAdult(itiItem.id, this.itineraries3, this.fareComponentDescs3),
              cabinChild: this.flightHelper._passengerCabinChild(itiItem.id, this.itineraries3, this.fareComponentDescs3),
              cabinInfant: this.flightHelper._passengerCabinInfant(itiItem.id, this.itineraries3, this.fareComponentDescs3),
              instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, airlineCode),
              airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, airlineCode),
              btnLoad: false,
              isAgentFare: this.isAgentFare,
              refundable: this.flightHelper._passengerInfoList(itiItem.id, this.itineraries3)[0].passengerInfo.nonRefundable == false ? true : false,
              fareBasisCode: this.flightHelper._fareComponentDescs(this.flightHelper._passengerInfoList(itiItem.id,
                this.itineraries3)[0].passengerInfo.fareComponents[0].ref - 1, this.fareComponentDescs3).fareBasisCode,
              markupTypeList: this.markupList,
              totalPrice: this.flightHelper._totalFare(itiItem.id, this.itineraries3).totalPrice,
              totalDiscount: adultDiscount + childDiscount + infantDiscount,
              clientFareTotal: this.flightHelper.getTotalAdultChildInfant(adultClientTotal, childClientTotal, infantClientTotal),
              agentFareTotal: this.flightHelper.getTotalAdultChildInfant(adultAgentTotal, childAgentTotal, infantAgentTotal),
              gdsFareTotal:
                (parseInt(adultMember) == 0 ? 0 : adultTotal) + (parseInt(childListMember.length) == 0 ? 0 : childTotal) + (parseInt(infantMember) == 0 ? 0 : infantTotal),
              flightSegmentData: [], fareData: {}
            });
            let fInd = 0;
            let adjustAct = 0;
            let index = this.domOneWayData3.findIndex(x => x.id === itiItem.id);
            for (let item of this.flightHelper._schedules(ref, this.legDescs3)) {
              let fref = item.ref - 1;
              let adj = 0, depAdj = 0, arrAdj = 0;
              if (item.departureDateAdjustment != undefined && item.departureDateAdjustment != '') {
                adj = item.departureDateAdjustment;
              }
              if (this.flightHelper._departure(fref, this.scheduleDescs3).dateAdjustment != undefined && this.flightHelper._departure(fref, this.scheduleDescs3).dateAdjustment != '') {
                depAdj = this.flightHelper._departure(fref, this.scheduleDescs3).dateAdjustment;
              }
              if (this.flightHelper._arrival(fref, this.scheduleDescs3).dateAdjustment != undefined && this.flightHelper._arrival(fref, this.scheduleDescs3).dateAdjustment != '') {
                arrAdj = this.flightHelper._arrival(fref, this.scheduleDescs3).dateAdjustment;
              }
              let depAirportCode = this.flightHelper._departure(fref, this.scheduleDescs3).airport;
              let depAirportId = this.flightHelper.getAirportId(depAirportCode, this.cmbAirport);
              let arrAirportCode = this.flightHelper._arrival(fref, this.scheduleDescs3).airport;
              let arrAirportId = this.flightHelper.getAirportId(arrAirportCode, this.cmbAirport);
              let airlineCode = this.flightHelper._airlinesCode(fref, this.scheduleDescs3, this.airlines3);
              let airlineId = this.flightHelper.getAirlineId(airlineCode, this.airlines3);

              this.domOneWayData3[index].flightSegmentData.push({
                airlineName: this.flightHelper._airlinesName(fref, this.scheduleDescs3, this.airlines3),
                airlineCode: airlineCode,
                airlineId: airlineId,
                domestic: true,
                airlineLogo: this.flightHelper.getAirlineLogo(this.flightHelper._airlinesCode(fref, this.scheduleDescs3, this.airlines3), this.airlines3),
                airlineNumber: this.flightHelper._carrier(fref, this.scheduleDescs3).marketingFlightNumber,
                availableSeat: this.flightHelper.getSeatsAvailability(itiItem.id, this.itineraries3),
                bookingCode: this.flightHelper._passengerInfoFareComponentsSegmentsAdult(itiItem.id, this.itineraries3).bookingCode,
                departureTime: this.flightHelper._timeDeparture(fref, this.scheduleDescs3),
                arrivalTime: this.flightHelper._timeArrival(fref, this.scheduleDescs3),
                departureCity: this.flightHelper.getDepCityName(this.flightHelper._departure(fref, this.scheduleDescs3).airport, this.airports2),
                arrivalCity: this.flightHelper.getArrCityName(this.flightHelper._arrival(fref, this.scheduleDescs3).airport, this.airports2),
                departureAirportCode: depAirportCode,
                arrivalAirportCode: arrAirportCode,
                departureAirportId: depAirportId,
                arrivalAirportId: arrAirportId,
                differenceTime: this.flightHelper._timeDifference(fref, this.scheduleDescs3),
                layOverDifference: "",
                terminalDeparture: this.flightHelper._terminalDeparture(fref, this.scheduleDescs3),
                terminalArrival: this.flightHelper._terminalArrival(fref, this.scheduleDescs3),
                stopCount: fInd,
                adjustment: adjustAct,
                departureAdjustment: depAdj,
                arrivalAdjustment: arrAdj
              });
              fInd = fInd + 1;
              this.domOneWayData3[index].adjustment += adj;
            }
            let fData = this.domOneWayData3[index].flightSegmentData;
            let lenStop = fData.length;
            let stopData = "";
            for (let item of fData) {
              stopData += item.arrivalCity + ",";
            }
            if (stopData != "") {
              stopData = stopData.substring(0, stopData.length - 1);
              if (stopData.length > 10) {
                stopData = stopData.substring(0, 10) + "..";
              }
            }
            this.domOneWayData3[index].stop = parseInt(lenStop) > 1 ? parseInt(lenStop) - 1 : 0;
            this.domOneWayData3[index].stopAllCity = stopData;
            let diff = "";
            for (let i = 0; i < this.domOneWayData3[index].flightSegmentData.length; i++) {
              try {
                let dep = this.domOneWayData3[index].flightSegmentData[i + 1].departureTime;
                let arr = this.domOneWayData3[index].flightSegmentData[i].arrivalTime;
                diff = this.flightHelper._difference(arr, dep);
              } catch (exp) {
                diff = "";
              }
              this.domOneWayData3[index].flightSegmentData[i].layOverDifference = diff;
            }

            this.domOneWayData3[index].fareData = {
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
              adultBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode),
              adultTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode),
              adultTotalClient: adultClientTotal,
              adultDiscount: adultDiscount * parseFloat(adultMember),
              adultAgentFare: adultAgentTotal,
              childBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode),
              childTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode),
              childTotalClient: childClientTotal,
              childDiscount: childDiscount * parseFloat(childListMember.length),
              childAgentFare: childAgentTotal,
              infantBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode),
              infantTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode),
              infantTotalClient: infantClientTotal,
              infantDiscount: infantDiscount * parseFloat(infantMember),
              infantAgentFare: infantAgentTotal
            };
            this.domOneWayData3[index].arrivalTime =
              this.domOneWayData3[index].flightSegmentData[this.domOneWayData3[index].flightSegmentData.length - 1].arrivalTime;
            index += 1;
          }
          this.makeProposalData3 = this.domOneWayData3[0];
          this.selectedFlightData.data3 = this.domOneWayData3[0];
          let id3 = "flight_select_left_2" + this.domOneWayData1[0].id;
          setTimeout(() => {
            $('input:radio[name=featured_left2][id=' + id3 + ']').click();
          });
          break;
        case 3:
          this.flightSearchSkeleton4 = false;
          this.domOneWayData4 = [];
          for (let itiItem of this.itineraries4) {
            let ref: number = Number.parseInt(itiItem.legs[0].ref) - 1;
            let depRef = this.flightHelper._schedules(ref, this.legDescs4)[0].ref - 1;
            let arrRef = this.flightHelper._schedules(ref, this.legDescs4)[this.flightHelper._schedules(ref, this.legDescs4).length - 1].ref - 1;
            let airlineCode = this.flightHelper._airlinesCode(depRef, this.scheduleDescs4, this.airlines4);
            let airlineName = this.flightHelper._airlinesName(depRef, this.scheduleDescs4, this.airlines4);
            let departureTime = this.flightHelper._timeDeparture(depRef, this.scheduleDescs4);
            let arrivalTime = this.flightHelper._timeArrival(arrRef, this.scheduleDescs4);
            let airlineNumber = this.flightHelper._carrier(depRef, this.scheduleDescs4).marketingFlightNumber;
            let airCraftCode = this.flightHelper._equipment(depRef, this.scheduleDescs4).code;
            let airCraftName = this.getAirCraftName(this.flightHelper._equipment(depRef, this.scheduleDescs4).code);
            let departureCityCode = this.flightHelper._departure(depRef, this.scheduleDescs4).airport;
            let arrivalCityCode = this.flightHelper._arrival(arrRef, this.scheduleDescs4).airport;
            let departureCity = this.flightHelper.getDepCityName(this.flightHelper._departure(depRef, this.scheduleDescs4).airport, this.airports4);
            let arrivalCity = this.flightHelper.getArrCityName(this.flightHelper._arrival(arrRef, this.scheduleDescs4).airport, this.airports4);
            let differenceTime = this.flightHelper._difference(this.flightHelper._timeDeparture(depRef, this.scheduleDescs4),
              this.flightHelper._timeArrival(arrRef, this.scheduleDescs4));

            let adultBase = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries4).equivalentAmount;
            let adultTax = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries4).totalTaxAmount;
            let adultTotal = this.flightHelper._passengerInfoTotalFareAdult(itiItem.id, this.itineraries4).totalFare;
            let adultDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, adultBase, adultTax, adultTotal, adultMember, airlineCode);

            let childBase = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries4).equivalentAmount;
            let childTax = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries4).totalTaxAmount;
            let childTotal = this.flightHelper._passengerInfoTotalFareChild(itiItem.id, this.itineraries4).totalFare;
            let childDiscount = this.flightHelper._getDisountTotalPrice(this.discountInfo, childBase, childTax, childTotal, childListMember.length, airlineCode);

            let infantBase = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries4).equivalentAmount;
            let infantTax = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries4).totalTaxAmount;
            let infantTotal = this.flightHelper._passengerInfoTotalFareInfant(itiItem.id, this.itineraries4).totalFare;
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

            let adultClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode))
              + parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode));

            let childClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode)) +
              parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode));

            let infantClientTotal = parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode)) +
              parseFloat(this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode));

            let adultAgentTotal = adultClientTotal - (adultDiscount * parseFloat(adultMember));
            let childAgentTotal = childClientTotal - (childDiscount * parseFloat(childListMember.length));
            let infantAgentTotal = infantClientTotal - (infantDiscount * parseFloat(infantMember));

            this.tripTypeId = this.getTripTypeId();
            this.domOneWayData4.push({
              id: itiItem.id,
              providerId: this.providerId,
              tripTypeId: this.tripTypeId,
              cabinTypeId: this.cabinTypeId,
              airlineLogo: this.flightHelper.getAirlineLogo(airlineCode, this.airlines4),
              airlineName: airlineName,
              airlineCode: airlineCode,
              airlineId: this.flightHelper.getAirlineId(airlineCode, this.cmbAirlines),
              airlineNumber: airlineNumber,
              airCraftId: this.flightHelper.getAircraftId(airCraftCode, this.cmbAirCraft),
              airCraftCode: airCraftCode,
              airCraftName: airCraftName,
              departureDate: this.selectedFlightDeparture[ind].Date,
              arrivalDate: this.selectedFlightDeparture[ind].Date,
              departureTime: departureTime,
              arrivalTime: arrivalTime,
              departureCityId: this.selectedFlightDeparture[3].Id,
              departureCityCode: this.selectedFlightDeparture[3].CityCode,
              departureCity: this.selectedFlightDeparture[3].CityName,
              arrivalCityId: this.selectedFlightArrival[3].Id,
              arrivalCityCode: this.selectedFlightArrival[3].CityCode,
              arrivalCity: this.selectedFlightArrival[3].CityName,
              differenceTime: differenceTime,
              adult: adultMember,
              child: childListMember,
              infant: infantMember,
              stop: 0,
              stopAllCity: '',
              domestic: true,
              adjustment: 0,
              flightRouteTypeId: this.flightHelper.flightRouteType[0],
              lastTicketDate: this.flightHelper._fare(itiItem.id, this.itineraries4).lastTicketDate,
              lastTicketTime: this.flightHelper._fare(itiItem.id, this.itineraries4).lastTicketTime,
              baggageAdult: this.flightHelper._pieceOrKgsAdult(itiItem.id, this.itineraries4, this.baggageAllowanceDescs4),
              baggageChild: this.flightHelper._pieceOrKgsChild(itiItem.id, this.itineraries4, this.baggageAllowanceDescs4),
              baggageInfant: this.flightHelper._pieceOrKgsInfant(itiItem.id, this.itineraries4, this.baggageAllowanceDescs4),
              cabinAdult: this.flightHelper._passengerCabinAdult(itiItem.id, this.itineraries4, this.fareComponentDescs4),
              cabinChild: this.flightHelper._passengerCabinChild(itiItem.id, this.itineraries4, this.fareComponentDescs4),
              cabinInfant: this.flightHelper._passengerCabinInfant(itiItem.id, this.itineraries4, this.fareComponentDescs4),
              instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, airlineCode),
              airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, airlineCode),
              btnLoad: false,
              isAgentFare: this.isAgentFare,
              refundable: this.flightHelper._passengerInfoList(itiItem.id, this.itineraries4)[0].passengerInfo.nonRefundable == false ? true : false,
              fareBasisCode: this.flightHelper._fareComponentDescs(this.flightHelper._passengerInfoList(itiItem.id,
                this.itineraries4)[0].passengerInfo.fareComponents[0].ref - 1, this.fareComponentDescs4).fareBasisCode,
              markupTypeList: this.markupList,
              totalPrice: this.flightHelper._totalFare(itiItem.id, this.itineraries4).totalPrice,
              totalDiscount: adultDiscount + childDiscount + infantDiscount,
              clientFareTotal: this.flightHelper.getTotalAdultChildInfant(adultClientTotal, childClientTotal, infantClientTotal),
              agentFareTotal: this.flightHelper.getTotalAdultChildInfant(adultAgentTotal, childAgentTotal, infantAgentTotal),
              gdsFareTotal:
                (parseInt(adultMember) == 0 ? 0 : adultTotal) + (parseInt(childListMember.length) == 0 ? 0 : childTotal) + (parseInt(infantMember) == 0 ? 0 : infantTotal),
              flightSegmentData: [], fareData: {}
            });
            let fInd = 0;
            let adjustAct = 0;
            let index = this.domOneWayData4.findIndex(x => x.id === itiItem.id);
            for (let item of this.flightHelper._schedules(ref, this.legDescs4)) {
              let fref = item.ref - 1;
              let adj = 0, depAdj = 0, arrAdj = 0;
              if (item.departureDateAdjustment != undefined && item.departureDateAdjustment != '') {
                adj = item.departureDateAdjustment;
              }
              if (this.flightHelper._departure(fref, this.scheduleDescs4).dateAdjustment != undefined && this.flightHelper._departure(fref, this.scheduleDescs4).dateAdjustment != '') {
                depAdj = this.flightHelper._departure(fref, this.scheduleDescs4).dateAdjustment;
              }
              if (this.flightHelper._arrival(fref, this.scheduleDescs4).dateAdjustment != undefined && this.flightHelper._arrival(fref, this.scheduleDescs4).dateAdjustment != '') {
                arrAdj = this.flightHelper._arrival(fref, this.scheduleDescs4).dateAdjustment;
              }
              let depAirportCode = this.flightHelper._departure(fref, this.scheduleDescs4).airport;
              let depAirportId = this.flightHelper.getAirportId(depAirportCode, this.cmbAirport);
              let arrAirportCode = this.flightHelper._arrival(fref, this.scheduleDescs4).airport;
              let arrAirportId = this.flightHelper.getAirportId(arrAirportCode, this.cmbAirport);
              let airlineCode = this.flightHelper._airlinesCode(fref, this.scheduleDescs4, this.airlines4);
              let airlineId = this.flightHelper.getAirlineId(airlineCode, this.airlines4);

              this.domOneWayData4[index].flightSegmentData.push({
                airlineName: this.flightHelper._airlinesName(fref, this.scheduleDescs4, this.airlines4),
                airlineCode: airlineCode,
                airlineId: airlineId,
                domestic: true,
                airlineLogo: this.flightHelper.getAirlineLogo(this.flightHelper._airlinesCode(fref, this.scheduleDescs4, this.airlines4), this.airlines4),
                airlineNumber: this.flightHelper._carrier(fref, this.scheduleDescs4).marketingFlightNumber,
                availableSeat: this.flightHelper.getSeatsAvailability(itiItem.id, this.itineraries4),
                bookingCode: this.flightHelper._passengerInfoFareComponentsSegmentsAdult(itiItem.id, this.itineraries4).bookingCode,
                departureTime: this.flightHelper._timeDeparture(fref, this.scheduleDescs4),
                arrivalTime: this.flightHelper._timeArrival(fref, this.scheduleDescs4),
                departureCity: this.flightHelper.getDepCityName(this.flightHelper._departure(fref, this.scheduleDescs4).airport, this.airports4),
                arrivalCity: this.flightHelper.getArrCityName(this.flightHelper._arrival(fref, this.scheduleDescs4).airport, this.airports4),
                departureAirportCode: depAirportCode,
                arrivalAirportCode: arrAirportCode,
                departureAirportId: depAirportId,
                arrivalAirportId: arrAirportId,
                differenceTime: this.flightHelper._timeDifference(fref, this.scheduleDescs4),
                layOverDifference: "",
                terminalDeparture: this.flightHelper._terminalDeparture(fref, this.scheduleDescs4),
                terminalArrival: this.flightHelper._terminalArrival(fref, this.scheduleDescs4),
                stopCount: fInd,
                adjustment: adjustAct,
                departureAdjustment: depAdj,
                arrivalAdjustment: arrAdj
              });
              fInd = fInd + 1;
              this.domOneWayData4[index].adjustment += adj;
            }
            let fData = this.domOneWayData4[index].flightSegmentData;
            let lenStop = fData.length;
            let stopData = "";
            for (let item of fData) {
              stopData += item.arrivalCity + ",";
            }
            if (stopData != "") {
              stopData = stopData.substring(0, stopData.length - 1);
              if (stopData.length > 10) {
                stopData = stopData.substring(0, 10) + "..";
              }
            }
            this.domOneWayData4[index].stop = parseInt(lenStop) > 1 ? parseInt(lenStop) - 1 : 0;
            this.domOneWayData4[index].stopAllCity = stopData;
            let diff = "";
            for (let i = 0; i < this.domOneWayData4[index].flightSegmentData.length; i++) {
              try {
                let dep = this.domOneWayData4[index].flightSegmentData[i + 1].departureTime;
                let arr = this.domOneWayData4[index].flightSegmentData[i].arrivalTime;
                diff = this.flightHelper._difference(arr, dep);
              } catch (exp) {
                diff = "";
              }
              this.domOneWayData4[index].flightSegmentData[i].layOverDifference = diff;
            }

            this.domOneWayData4[index].fareData = {
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
              adultBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", adultBase, adultTax, adultTotal, adultMember, airlineCode),
              adultTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", adultBase, adultTax, adultTotal, adultMember, airlineCode),
              adultTotalClient: adultClientTotal,
              adultDiscount: adultDiscount * parseFloat(adultMember),
              adultAgentFare: adultAgentTotal,
              childBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", childBase, childTax, childTotal, childListMember.length, airlineCode),
              childTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", childBase, childTax, childTotal, childListMember.length, airlineCode),
              childTotalClient: childClientTotal,
              childDiscount: childDiscount * parseFloat(childListMember.length),
              childAgentFare: childAgentTotal,
              infantBaseClient: this.flightHelper._typeWisePrice(this.markupInfo, "Base", infantBase, infantTax, infantTotal, infantMember, airlineCode),
              infantTaxClient: this.flightHelper._typeWisePrice(this.markupInfo, "Tax", infantBase, infantTax, infantTotal, infantMember, airlineCode),
              infantTotalClient: infantClientTotal,
              infantDiscount: infantDiscount * parseFloat(infantMember),
              infantAgentFare: infantAgentTotal
            };
            this.domOneWayData4[index].arrivalTime =
              this.domOneWayData4[index].flightSegmentData[this.domOneWayData4[index].flightSegmentData.length - 1].arrivalTime;
            index += 1;
          }
          this.makeProposalData1 = this.domOneWayData4[0];
          this.selectedFlightData.data4 = this.domOneWayData4[0];
          let id4 = "flight_select_left_3" + this.domOneWayData1[0].id;
          setTimeout(() => {
            $('input:radio[name=featured_left3][id=' + id4 + ']').click();
          });
          break;
      }
      if (this.paramModelData.missingtrip.length > 0) {
        for (let missingtrip of this.paramModelData.missingtrip) {
          let tripId: number = 1;
          for (let journey of this.paramModelData.Journey[0].bookingJourney) {
            if (missingtrip.ISerial == 1) {
              if (missingtrip.VBookingJourneyId == journey.vBookingJourneyId) {
                var departure = journey.dDepartureDateTime.split('T');
                var arrival = journey.dArrivalDateTime.split('T');
                var departureDate = departure[0];
                var arrivalDate = arrival[0];
                let departureTime = departure[1];
                departureTime = departureTime.toString().slice(0, 5);
                let arrivalTime = arrival[1];
                arrivalTime = arrivalTime.toString().slice(0, 5);
                this.missingData.push({
                  id: tripId,
                  tripTitle: missingtrip.ISerial,
                  groupAirlineCode: journey.bookingFlight[0].nvIataDesignator,
                  providerId: this.providerId,
                  tripTypeId: this.tripTypeId,
                  cabinTypeId: this.cabinTypeId,
                  airlineLogo: this.flightHelper.getAirlineLogo(journey.bookingFlight[0].nvIataDesignator, this.airlines1),
                  airlineName: journey.bookingFlight[0].nvAirlinesName,
                  airlineCode: journey.bookingFlight[0].nvIataDesignator,
                  airlineId: this.flightHelper.getAirlineId(journey.bookingFlight[0].nvIataDesignator, this.cmbAirlines),
                  airlineNumber: journey.bookingFlight[0].iFlightNumber,
                  airCraftId: this.flightHelper.getAircraftId(journey.bookingFlight[0].nvAircraftCode, this.cmbAirCraft),
                  airCraftCode: journey.bookingFlight[0].nvAircraftCode,
                  airCraftName: journey.bookingFlight[0].aircraft,
                  departureDate: departureDate,
                  arrivalDate: arrivalDate,
                  departureTime: departureTime,
                  arrivalTime: arrivalTime,
                  departureCityId: journey.fromCityId,
                  departureCityCode: missingtrip.AfCode,
                  departureCity: journey.fromCity,
                  arrivalCityId: journey.toCityId,
                  arrivalCityCode: missingtrip.AtCode,
                  arrivalCity: journey.toCity,
                  adult: adultMember,
                  child: childListMember,
                  infant: infantMember,
                  stop: 0,
                  stopAllCity: '',
                  domestic: false,
                  adjustment: 0,
                  flightRouteTypeId: this.flightHelper.flightRouteType[0],
                  lastTicketDate: journey.dTimeLimitFsl,
                  lastTicketTime: journey.dTimeLimitFsl,
                  baggageAdult: journey.bookingFlight[0].nAdultCheckIn,
                  baggageChild: journey.bookingFlight[0].nChildCheckIn,
                  baggageInfant: journey.bookingFlight[0].nInfantCheckIn,
                  cabinAdult: journey.bookingFlight[0].nAdultCabin,
                  cabinChild: journey.bookingFlight[0].nChildCabin,
                  cabinInfant: journey.bookingFlight[0].nInfantCabin,
                  instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, journey.bookingFlight[0].nvIataDesignator),
                  airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, journey.bookingFlight[0].nvIataDesignator),
                  btnLoad: false,
                  isAgentFare: this.isAgentFare,
                  refundable: "",
                  fareBasisCode: "",
                  markupTypeList: this.markupList,
                  totalPrice: "",
                  totalDiscount: "",
                  clientFareTotal: "",
                  agentFareTotal: "",
                  gdsFareTotal: "",
                  flightSegmentData: [], fareData: {}
                });
                let index = this.missingData.findIndex(x => x.tripTitle === missingtrip.ISerial);
                for (let itrm of journey.bookingFlight) {
                  var departureDate = itrm.dDepartureDateTime.split('T');
                  var arrivalDate = itrm.dArrivalDateTime.split('T');
                  let departureTime = departureDate[1];
                  departureTime = departureTime.toString().slice(0, 5);
                  let arrivalTime = arrivalDate[1];
                  arrivalTime = arrivalTime.toString().slice(0, 5);
                  this.missingData[index].flightSegmentData.push({
                    airlineName: itrm.nvAirlinesName,
                    airlineCode: itrm.nvIataDesignator,
                    airlineId: "",
                    domestic: true,
                    airlineLogo: itrm.vLogo,
                    airlineNumber: itrm.iFlightNumber,
                    availableSeat: "",
                    bookingCode: itrm.nvBookingClass,
                    departureTime: departureTime,
                    arrivalTime: arrivalTime,
                    departureCity: itrm.fromCity,
                    arrivalCity: itrm.toCity,
                    departureAirportCode: itrm.nvAirportCode,
                    arrivalAirportCode: itrm.column1,
                    departureAirportId: "",
                    arrivalAirportId: "",
                    differenceTime: "",
                    layOverDifference: "",
                    terminalDeparture: "",
                    terminalArrival: "",
                    stopCount: 0,
                    adjustment: "",
                    departureAdjustment: "",
                    arrivalAdjustment: ""
                  });
                }
              }
            }
            if (missingtrip.ISerial == 2) {
              if (missingtrip.VBookingJourneyId == journey.vBookingJourneyId) {
                var departure = journey.dDepartureDateTime.split('T');
                var arrival = journey.dArrivalDateTime.split('T');
                var departureDate = departure[0];
                var arrivalDate = arrival[0];
                let departureTime = departure[1];
                departureTime = departureTime.toString().slice(0, 5);
                let arrivalTime = arrival[1];
                arrivalTime = arrivalTime.toString().slice(0, 5);
                this.missingData.push({
                  id: tripId,
                  tripTitle: missingtrip.ISerial,
                  groupAirlineCode: journey.bookingFlight[0].nvIataDesignator,
                  providerId: this.providerId,
                  tripTypeId: this.tripTypeId,
                  cabinTypeId: this.cabinTypeId,
                  airlineLogo: this.flightHelper.getAirlineLogo(journey.bookingFlight[0].nvIataDesignator, this.airlines1),
                  airlineName: journey.bookingFlight[0].nvAirlinesName,
                  airlineCode: journey.bookingFlight[0].nvIataDesignator,
                  airlineId: this.flightHelper.getAirlineId(journey.bookingFlight[0].nvIataDesignator, this.cmbAirlines),
                  airlineNumber: journey.bookingFlight[0].iFlightNumber,
                  airCraftId: this.flightHelper.getAircraftId(journey.bookingFlight[0].nvAircraftCode, this.cmbAirCraft),
                  airCraftCode: journey.bookingFlight[0].nvAircraftCode,
                  airCraftName: journey.bookingFlight[0].aircraft,
                  departureDate: departureDate,
                  arrivalDate: arrivalDate,
                  departureTime: departureTime,
                  arrivalTime: arrivalTime,
                  departureCityId: journey.fromCityId,
                  departureCityCode: missingtrip.AfCode,
                  departureCity: journey.fromCity,
                  arrivalCityId: journey.toCityId,
                  arrivalCityCode: missingtrip.AtCode,
                  arrivalCity: journey.toCity,
                  adult: adultMember,
                  child: childListMember,
                  infant: infantMember,
                  stop: 0,
                  stopAllCity: '',
                  domestic: false,
                  adjustment: 0,
                  flightRouteTypeId: this.flightHelper.flightRouteType[0],
                  lastTicketDate: journey.dTimeLimitFsl,
                  lastTicketTime: journey.dTimeLimitFsl,
                  baggageAdult: journey.bookingFlight[0].nAdultCheckIn,
                  baggageChild: journey.bookingFlight[0].nChildCheckIn,
                  baggageInfant: journey.bookingFlight[0].nInfantCheckIn,
                  cabinAdult: journey.bookingFlight[0].nAdultCabin,
                  cabinChild: journey.bookingFlight[0].nChildCabin,
                  cabinInfant: journey.bookingFlight[0].nInfantCabin,
                  instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, journey.bookingFlight[0].nvIataDesignator),
                  airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, journey.bookingFlight[0].nvIataDesignator),
                  btnLoad: false,
                  isAgentFare: this.isAgentFare,
                  refundable: "",
                  fareBasisCode: "",
                  markupTypeList: this.markupList,
                  totalPrice: "",
                  totalDiscount: "",
                  clientFareTotal: "",
                  agentFareTotal: "",
                  gdsFareTotal: "",
                  flightSegmentData: [], fareData: {}
                });
                let index = this.missingData.findIndex(x => x.tripTitle === missingtrip.ISerial);
                for (let itrm of journey.bookingFlight) {
                  var departureDate = itrm.dDepartureDateTime.split('T');
                  var arrivalDate = itrm.dArrivalDateTime.split('T');
                  let departureTime = departureDate[1];
                  departureTime = departureTime.toString().slice(0, 5);
                  let arrivalTime = arrivalDate[1];
                  arrivalTime = arrivalTime.toString().slice(0, 5);
                  this.missingData[index].flightSegmentData.push({
                    airlineName: itrm.nvAirlinesName,
                    airlineCode: itrm.nvIataDesignator,
                    airlineId: "",
                    domestic: true,
                    airlineLogo: itrm.vLogo,
                    airlineNumber: itrm.iFlightNumber,
                    availableSeat: "",
                    bookingCode: itrm.nvBookingClass,
                    departureTime: departureTime,
                    arrivalTime: arrivalTime,
                    departureCity: itrm.fromCity,
                    arrivalCity: itrm.toCity,
                    departureAirportCode: itrm.nvAirportCode,
                    arrivalAirportCode: itrm.column1,
                    departureAirportId: "",
                    arrivalAirportId: "",
                    differenceTime: "",
                    layOverDifference: "",
                    terminalDeparture: "",
                    terminalArrival: "",
                    stopCount: 0,
                    adjustment: "",
                    departureAdjustment: "",
                    arrivalAdjustment: ""
                  });
                }
              }
            }
            if (missingtrip.ISerial == 3) {
              if (missingtrip.VBookingJourneyId == journey.vBookingJourneyId) {
                var departure = journey.dDepartureDateTime.split('T');
                var arrival = journey.dArrivalDateTime.split('T');
                var departureDate = departure[0];
                var arrivalDate = arrival[0];
                let departureTime = departure[1];
                departureTime = departureTime.toString().slice(0, 5);
                let arrivalTime = arrival[1];
                arrivalTime = arrivalTime.toString().slice(0, 5);
                this.missingData.push({
                  id: tripId,
                  tripTitle: missingtrip.ISerial,
                  groupAirlineCode: journey.bookingFlight[0].nvIataDesignator,
                  providerId: this.providerId,
                  tripTypeId: this.tripTypeId,
                  cabinTypeId: this.cabinTypeId,
                  airlineLogo: this.flightHelper.getAirlineLogo(journey.bookingFlight[0].nvIataDesignator, this.airlines1),
                  airlineName: journey.bookingFlight[0].nvAirlinesName,
                  airlineCode: journey.bookingFlight[0].nvIataDesignator,
                  airlineId: this.flightHelper.getAirlineId(journey.bookingFlight[0].nvIataDesignator, this.cmbAirlines),
                  airlineNumber: journey.bookingFlight[0].iFlightNumber,
                  airCraftId: this.flightHelper.getAircraftId(journey.bookingFlight[0].nvAircraftCode, this.cmbAirCraft),
                  airCraftCode: journey.bookingFlight[0].nvAircraftCode,
                  airCraftName: journey.bookingFlight[0].aircraft,
                  departureDate: departureDate,
                  arrivalDate: arrivalDate,
                  departureTime: departureTime,
                  arrivalTime: arrivalTime,
                  departureCityId: journey.fromCityId,
                  departureCityCode: missingtrip.AfCode,
                  departureCity: journey.fromCity,
                  arrivalCityId: journey.toCityId,
                  arrivalCityCode: missingtrip.AtCode,
                  arrivalCity: journey.toCity,
                  adult: adultMember,
                  child: childListMember,
                  infant: infantMember,
                  stop: 0,
                  stopAllCity: '',
                  domestic: false,
                  adjustment: 0,
                  flightRouteTypeId: this.flightHelper.flightRouteType[0],
                  lastTicketDate: journey.dTimeLimitFsl,
                  lastTicketTime: journey.dTimeLimitFsl,
                  baggageAdult: journey.bookingFlight[0].nAdultCheckIn,
                  baggageChild: journey.bookingFlight[0].nChildCheckIn,
                  baggageInfant: journey.bookingFlight[0].nInfantCheckIn,
                  cabinAdult: journey.bookingFlight[0].nAdultCabin,
                  cabinChild: journey.bookingFlight[0].nChildCabin,
                  cabinInfant: journey.bookingFlight[0].nInfantCabin,
                  instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, journey.bookingFlight[0].nvIataDesignator),
                  airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, journey.bookingFlight[0].nvIataDesignator),
                  btnLoad: false,
                  isAgentFare: this.isAgentFare,
                  refundable: "",
                  fareBasisCode: "",
                  markupTypeList: this.markupList,
                  totalPrice: "",
                  totalDiscount: "",
                  clientFareTotal: "",
                  agentFareTotal: "",
                  gdsFareTotal: "",
                  flightSegmentData: [], fareData: {}
                });
                let index = this.missingData.findIndex(x => x.tripTitle === missingtrip.ISerial);
                for (let itrm of journey.bookingFlight) {
                  var departureDate = itrm.dDepartureDateTime.split('T');
                  var arrivalDate = itrm.dArrivalDateTime.split('T');
                  let departureTime = departureDate[1];
                  departureTime = departureTime.toString().slice(0, 5);
                  let arrivalTime = arrivalDate[1];
                  arrivalTime = arrivalTime.toString().slice(0, 5);
                  this.missingData[index].flightSegmentData.push({
                    airlineName: itrm.nvAirlinesName,
                    airlineCode: itrm.nvIataDesignator,
                    airlineId: "",
                    domestic: true,
                    airlineLogo: itrm.vLogo,
                    airlineNumber: itrm.iFlightNumber,
                    availableSeat: "",
                    bookingCode: itrm.nvBookingClass,
                    departureTime: departureTime,
                    arrivalTime: arrivalTime,
                    departureCity: itrm.fromCity,
                    arrivalCity: itrm.toCity,
                    departureAirportCode: itrm.nvAirportCode,
                    arrivalAirportCode: itrm.column1,
                    departureAirportId: "",
                    arrivalAirportId: "",
                    differenceTime: "",
                    layOverDifference: "",
                    terminalDeparture: "",
                    terminalArrival: "",
                    stopCount: 0,
                    adjustment: "",
                    departureAdjustment: "",
                    arrivalAdjustment: ""
                  });
                }
              }
            }
            if (missingtrip.ISerial == 4) {
              if (missingtrip.VBookingJourneyId == journey.vBookingJourneyId) {
                var departure = journey.dDepartureDateTime.split('T');
                var arrival = journey.dArrivalDateTime.split('T');
                var departureDate = departure[0];
                var arrivalDate = arrival[0];
                let departureTime = departure[1];
                departureTime = departureTime.toString().slice(0, 5);
                let arrivalTime = arrival[1];
                arrivalTime = arrivalTime.toString().slice(0, 5);
                this.missingData.push({
                  id: tripId,
                  tripTitle: missingtrip.ISerial,
                  groupAirlineCode: journey.bookingFlight[0].nvIataDesignator,
                  providerId: this.providerId,
                  tripTypeId: this.tripTypeId,
                  cabinTypeId: this.cabinTypeId,
                  airlineLogo: this.flightHelper.getAirlineLogo(journey.bookingFlight[0].nvIataDesignator, this.airlines1),
                  airlineName: journey.bookingFlight[0].nvAirlinesName,
                  airlineCode: journey.bookingFlight[0].nvIataDesignator,
                  airlineId: this.flightHelper.getAirlineId(journey.bookingFlight[0].nvIataDesignator, this.cmbAirlines),
                  airlineNumber: journey.bookingFlight[0].iFlightNumber,
                  airCraftId: this.flightHelper.getAircraftId(journey.bookingFlight[0].nvAircraftCode, this.cmbAirCraft),
                  airCraftCode: journey.bookingFlight[0].nvAircraftCode,
                  airCraftName: journey.bookingFlight[0].aircraft,
                  departureDate: departureDate,
                  arrivalDate: arrivalDate,
                  departureTime: departureTime,
                  arrivalTime: arrivalTime,
                  departureCityId: journey.fromCityId,
                  departureCityCode: missingtrip.AfCode,
                  departureCity: journey.fromCity,
                  arrivalCityId: journey.toCityId,
                  arrivalCityCode: missingtrip.AtCode,
                  arrivalCity: journey.toCity,
                  adult: adultMember,
                  child: childListMember,
                  infant: infantMember,
                  stop: 0,
                  stopAllCity: '',
                  domestic: false,
                  adjustment: 0,
                  flightRouteTypeId: this.flightHelper.flightRouteType[0],
                  lastTicketDate: journey.dTimeLimitFsl,
                  lastTicketTime: journey.dTimeLimitFsl,
                  baggageAdult: journey.bookingFlight[0].nAdultCheckIn,
                  baggageChild: journey.bookingFlight[0].nChildCheckIn,
                  baggageInfant: journey.bookingFlight[0].nInfantCheckIn,
                  cabinAdult: journey.bookingFlight[0].nAdultCabin,
                  cabinChild: journey.bookingFlight[0].nChildCabin,
                  cabinInfant: journey.bookingFlight[0].nInfantCabin,
                  instantEnable: this.flightHelper.isInstant(this.bookInstantEnableDisable, journey.bookingFlight[0].nvIataDesignator),
                  airlinesRouteEnableId: this.flightHelper.airlineRouteEnableId(this.bookInstantEnableDisable, journey.bookingFlight[0].nvIataDesignator),
                  btnLoad: false,
                  isAgentFare: this.isAgentFare,
                  refundable: "",
                  fareBasisCode: "",
                  markupTypeList: this.markupList,
                  totalPrice: "",
                  totalDiscount: "",
                  clientFareTotal: "",
                  agentFareTotal: "",
                  gdsFareTotal: "",
                  flightSegmentData: [], fareData: {}
                });
                let index = this.missingData.findIndex(x => x.tripTitle === missingtrip.ISerial);
                for (let itrm of journey.bookingFlight) {
                  var departureDate = itrm.dDepartureDateTime.split('T');
                  var arrivalDate = itrm.dArrivalDateTime.split('T');
                  let departureTime = departureDate[1];
                  departureTime = departureTime.toString().slice(0, 5);
                  let arrivalTime = arrivalDate[1];
                  arrivalTime = arrivalTime.toString().slice(0, 5);
                  this.missingData[index].flightSegmentData.push({
                    airlineName: itrm.nvAirlinesName,
                    airlineCode: itrm.nvIataDesignator,
                    airlineId: "",
                    domestic: true,
                    airlineLogo: itrm.vLogo,
                    airlineNumber: itrm.iFlightNumber,
                    availableSeat: "",
                    bookingCode: itrm.nvBookingClass,
                    departureTime: departureTime,
                    arrivalTime: arrivalTime,
                    departureCity: itrm.fromCity,
                    arrivalCity: itrm.toCity,
                    departureAirportCode: itrm.nvAirportCode,
                    arrivalAirportCode: itrm.column1,
                    departureAirportId: "",
                    arrivalAirportId: "",
                    differenceTime: "",
                    layOverDifference: "",
                    terminalDeparture: "",
                    terminalArrival: "",
                    stopCount: 0,
                    adjustment: "",
                    departureAdjustment: "",
                    arrivalAdjustment: ""
                  });
                }
              }
            }
          }
        }
      }
      for (let item of this.paramModelData.missingtrip) {
        for (let mDitem of this.missingData) {
          if (item.ISerial == 1 && mDitem.tripTitle == 1) {
            for (let fitem of this.domOneWayData1) {
              mDitem.fareData = fitem.fareData;
              mDitem.agentFareTotal = fitem.agentFareTotal;
              mDitem.clientFareTotal = fitem.clientFareTotal;
              mDitem.fareBasisCode = fitem.fareBasisCode;
              mDitem.gdsFareTotal = fitem.gdsFareTotal;
              mDitem.totalDiscount = fitem.totalDiscount;
              mDitem.totalPrice = fitem.totalPrice;
              for (let flitem of fitem.flightSegmentData) {
                for (let fliitem of mDitem.flightSegmentData) {
                  flitem.adjustment = fliitem.adjustment;
                  flitem.arrivalAdjustment = fliitem.arrivalAdjustment;
                  flitem.departureAdjustment = fliitem.departureAdjustment
                }
              }
            }
            this.domOneWayData1 = [];
            this.domOneWayData1.push(mDitem);
            this.makeProposalData1 = this.domOneWayData1[0];
            this.selectedFlightData.data1 = this.domOneWayData1[0];
            let id1 = "flight_select_left_0" + this.domOneWayData1[0].id;
            setTimeout(() => {
              $('input:radio[name=featured_left0][id=' + id1 + ']').click();
            });
          }
          if (item.ISerial == 2 && mDitem.tripTitle == 2) {
            for (let fitem of this.domOneWayData2) {
              mDitem.fareData = fitem.fareData;
              mDitem.agentFareTotal = fitem.agentFareTotal;
              mDitem.clientFareTotal = fitem.clientFareTotal;
              mDitem.fareBasisCode = fitem.fareBasisCode;
              mDitem.gdsFareTotal = fitem.gdsFareTotal;
              mDitem.totalDiscount = fitem.totalDiscount;
              mDitem.totalPrice = fitem.totalPrice;
              for (let flitem of fitem.flightSegmentData) {
                for (let fliitem of mDitem.flightSegmentData) {
                  flitem.adjustment = fliitem.adjustment;
                  flitem.arrivalAdjustment = fliitem.arrivalAdjustment;
                  flitem.departureAdjustment = fliitem.departureAdjustment
                }
              }
            }
            this.domOneWayData2 = [];
            this.domOneWayData2.push(mDitem);
            this.makeProposalData2 = this.domOneWayData2[0];
            this.selectedFlightData.data2 = this.domOneWayData2[0];
            let id2 = "flight_select_left_1" + this.domOneWayData1[0].id;
            setTimeout(() => {
              $('input:radio[name=featured_left1][id=' + id2 + ']').click();
            });
          }
          if (item.ISerial == 3 && mDitem.tripTitle == 3) {
            for (let fitem of this.domOneWayData3) {
              mDitem.fareData = fitem.fareData;
              mDitem.agentFareTotal = fitem.agentFareTotal;
              mDitem.clientFareTotal = fitem.clientFareTotal;
              mDitem.fareBasisCode = fitem.fareBasisCode;
              mDitem.gdsFareTotal = fitem.gdsFareTotal;
              mDitem.totalDiscount = fitem.totalDiscount;
              mDitem.totalPrice = fitem.totalPrice;
              for (let flitem of fitem.flightSegmentData) {
                for (let fliitem of mDitem.flightSegmentData) {
                  flitem.adjustment = fliitem.adjustment;
                  flitem.arrivalAdjustment = fliitem.arrivalAdjustment;
                  flitem.departureAdjustment = fliitem.departureAdjustment
                }
              }
            }
            this.domOneWayData3 = [];
            this.domOneWayData3.push(mDitem);
            this.makeProposalData3 = this.domOneWayData3[0];
            this.selectedFlightData.data3 = this.domOneWayData3[0];
            let id3 = "flight_select_left_2" + this.domOneWayData1[0].id;
            setTimeout(() => {
              $('input:radio[name=featured_left2][id=' + id3 + ']').click();
            });
          }
          if (item.ISerial == 4 && mDitem.tripTitle == 4) {
            for (let fitem of this.domOneWayData4) {
              mDitem.fareData = fitem.fareData;
              mDitem.agentFareTotal = fitem.agentFareTotal;
              mDitem.clientFareTotal = fitem.clientFareTotal;
              mDitem.fareBasisCode = fitem.fareBasisCode;
              mDitem.gdsFareTotal = fitem.gdsFareTotal;
              mDitem.totalDiscount = fitem.totalDiscount;
              mDitem.totalPrice = fitem.totalPrice;
              for (let flitem of fitem.flightSegmentData) {
                for (let fliitem of mDitem.flightSegmentData) {
                  flitem.adjustment = fliitem.adjustment;
                  flitem.arrivalAdjustment = fliitem.arrivalAdjustment;
                  flitem.departureAdjustment = fliitem.departureAdjustment
                }
              }
            }
            this.domOneWayData4 = [];
            this.domOneWayData4.push(mDitem);
            this.makeProposalData4 = this.domOneWayData4[0];
            this.selectedFlightData.data4 = this.domOneWayData4[0];
            let id4 = "flight_select_left_3" + this.domOneWayData1[0].id;
            setTimeout(() => {
              $('input:radio[name=featured_left3][id=' + id4 + ']').click();
            });
          }
        }
      }
      this.setStopCount(ind);
      this.setTempFilterData(ind);
    } catch (exp) {
      this.isNotFound = true;
      console.log(exp);
    }
  }
  setTempFilterData(ind: any) {
    switch (parseInt(ind)) {
      case 0:
        this.tempDomOneWayData1 = this.domOneWayData1;
        this.tempDomOneWayData1 = this.tempDomOneWayData1.slice(0, 10);
        $("#viewMoreAction" + ind).css("display", "block");
        break;
      case 1:
        this.tempDomOneWayData2 = this.domOneWayData2;
        this.tempDomOneWayData2 = this.tempDomOneWayData2.slice(0, 10);
        $("#viewMoreAction" + ind).css("display", "block");
        break;
      case 2:
        this.tempDomOneWayData3 = this.domOneWayData3;
        this.tempDomOneWayData3 = this.tempDomOneWayData3.slice(0, 10);
        $("#viewMoreAction" + ind).css("display", "block");
        break;
      case 3:
        this.tempDomOneWayData4 = this.domOneWayData4;
        this.tempDomOneWayData4 = this.tempDomOneWayData4.slice(0, 10);
        $("#viewMoreAction" + ind).css("display", "block");
        break;
    }
  }
  viewMoreAction(ind: number) {
    switch (ind) {
      case 0:
        let store = this.domOneWayData1;
        var curLen = this.domOneWayData1.length - this.tempDomOneWayData1.length;
        var tempLen = this.tempDomOneWayData1.length;
        var orgLen = this.domOneWayData1.length;
        for (let i = tempLen, j = 0; i < orgLen; i++, j++) {
          if (j == 10) {
            this.tempDomOneWayData1 = store.slice(0, i);
          }
          if (j < 10) {
            this.tempDomOneWayData1 = store.slice(0, orgLen);

          }
        }
        if (this.domOneWayData1.length == this.tempDomOneWayData1.length) {
          $("#viewMoreAction" + ind).css("display", "none");
        }
        break;
      case 1:
        store = this.domOneWayData2;
        curLen = this.domOneWayData2.length - this.tempDomOneWayData2.length;
        tempLen = this.tempDomOneWayData2.length;
        orgLen = this.domOneWayData2.length;
        for (let i = tempLen, j = 0; i < orgLen; i++, j++) {
          if (j == 10)
            this.tempDomOneWayData2 = store.slice(0, i);
          if (j < 10)
            this.tempDomOneWayData2 = store.slice(0, orgLen);
        }
        if (this.domOneWayData1.length == this.tempDomOneWayData1.length)
          $("#viewMoreAction" + ind).css("display", "none");
        break;
      case 2:
        store = this.domOneWayData3;
        curLen = this.domOneWayData3.length - this.tempDomOneWayData3.length;
        tempLen = this.tempDomOneWayData3.length;
        orgLen = this.domOneWayData3.length;
        for (let i = tempLen, j = 0; i < orgLen; i++, j++) {
          if (j == 10)
            this.tempDomOneWayData3 = store.slice(0, i);
          if (j < 10)
            this.tempDomOneWayData3 = store.slice(0, orgLen);
        }
        if (this.domOneWayData3.length == this.tempDomOneWayData3.length)
          $("#viewMoreAction" + ind).css("display", "none");
        break;
      case 3:
        store = this.domOneWayData4;
        curLen = this.domOneWayData4.length - this.tempDomOneWayData4.length;
        tempLen = this.tempDomOneWayData4.length;
        orgLen = this.domOneWayData4.length;
        for (let i = tempLen, j = 0; i < orgLen; i++, j++) {
          if (j == 10)
            this.tempDomOneWayData4 = store.slice(0, i);
          if (j < 10)
            this.tempDomOneWayData4 = store.slice(0, orgLen);
        }
        if (this.domOneWayData4.length == this.tempDomOneWayData4.length)
          $("#viewMoreAction" + ind).css("display", "none");
        break;
    }

  }
  viewLessAction() {
    this.tempDomOneWayData1 = this.domOneWayData1;
    this.tempDomOneWayData1.splice(0, 10);
  }
  defaultSortHeader(type: any, ind: number) {
    try {
      switch (type) {
        case 'departure':
          $("#iddDur" + ind).css("display", "none");
          $("#iduDur" + ind).css("display", "none");
          $("#iddArr" + ind).css("display", "none");
          $("#iduArr" + ind).css("display", "none");
          $("#iddPri" + ind).css("display", "none");
          $("#iduPri" + ind).css("display", "none");
          break;
        case 'duration':
          $("#iddDep" + ind).css("display", "none");
          $("#iduDep" + ind).css("display", "none");
          $("#iddArr" + ind).css("display", "none");
          $("#iduArr" + ind).css("display", "none");
          $("#iddPri" + ind).css("display", "none");
          $("#iduPri" + ind).css("display", "none");
          break;
        case 'arrival':
          $("#iddDep" + ind).css("display", "none");
          $("#iduDep" + ind).css("display", "none");
          $("#iddDur" + ind).css("display", "none");
          $("#iduDur" + ind).css("display", "none");
          $("#iddPri" + ind).css("display", "none");
          $("#iduPri" + ind).css("display", "none");
          break;
        case 'price':
          $("#iddDep" + ind).css("display", "none");
          $("#iduDep" + ind).css("display", "none");
          $("#iddDur" + ind).css("display", "none");
          $("#iduDur" + ind).css("display", "none");
          $("#iddArr" + ind).css("display", "none");
          $("#iduArr" + ind).css("display", "none");
          break;
        default:
          break;
      }
      $("#sortDeparture" + ind).text("Departure");
      $("#sortDuration" + ind).text("Duration");
      $("#sortArrival" + ind).text("Arrival");
      $("#sortPrice" + ind).text("Price");
    } catch (exp) { }
  }
  sort(data: any, i: number) {
    switch (data) {
      case "departure":
        this.defaultSortHeader('departure', i);
        if ($("#iduDep" + i).css("display") == "none") {
          $("#iddDep" + i).css("display", "none");
          $("#iduDep" + i).css("display", "block");
          switch (i) {
            case 0:
              this.tempDomOneWayData1 = this.tempDomOneWayData1.sort((a, b) => (a.departureTime > b.departureTime ? -1 : 1));
              break;
            case 1:
              this.tempDomOneWayData2 = this.tempDomOneWayData2.sort((a, b) => (a.departureTime > b.departureTime ? 1 : -1));
              break;
            case 2:
              this.tempDomOneWayData3 = this.tempDomOneWayData3.sort((a, b) => (a.departureTime > b.departureTime ? 1 : -1));
              break;
            case 3:
              this.tempDomOneWayData4 = this.tempDomOneWayData4.sort((a, b) => (a.departureTime > b.departureTime ? 1 : -1));
              break;
          }
        } else {
          $("#iddDep" + i).css("display", "block");
          $("#iduDep" + i).css("display", "none");
          switch (i) {
            case 0:
              this.tempDomOneWayData1 = this.tempDomOneWayData1.sort((a, b) => (a.departureTime < b.departureTime ? -1 : 1));
              break;
            case 1:
              this.tempDomOneWayData2 = this.tempDomOneWayData2.sort((a, b) => (a.departureTime < b.departureTime ? 1 : -1));
              break;
            case 2:
              this.tempDomOneWayData3 = this.tempDomOneWayData3.sort((a, b) => (a.departureTime < b.departureTime ? 1 : -1));
              break;
            case 3:
              this.tempDomOneWayData4 = this.tempDomOneWayData4.sort((a, b) => (a.departureTime < b.departureTime ? 1 : -1));
              break;
          }
        }
        $("#sortDeparture" + i).text("");
        break;
      case "duration":
        this.defaultSortHeader('duration', i);
        if ($("#iduDur" + i).css("display") == "none") {
          $("#iddDur" + i).css("display", "none");
          $("#iduDur" + i).css("display", "block");
          switch (i) {
            case 0:
              this.tempDomOneWayData1 = this.tempDomOneWayData1.sort((a, b) => (a.differenceTime > b.differenceTime ? 1 : -1));
              break;
            case 1:
              this.tempDomOneWayData2 = this.tempDomOneWayData2.sort((a, b) => (a.differenceTime > b.differenceTime ? 1 : -1));
              break;
            case 2:
              this.tempDomOneWayData3 = this.tempDomOneWayData3.sort((a, b) => (a.differenceTime > b.differenceTime ? 1 : -1));
              break;
            case 3:
              this.tempDomOneWayData4 = this.tempDomOneWayData4.sort((a, b) => (a.differenceTime > b.differenceTime ? 1 : -1));
              break;
          }
        } else {
          $("#iddDur" + i).css("display", "block");
          $("#iduDur" + i).css("display", "none");
          switch (i) {
            case 0:
              this.tempDomOneWayData1 = this.tempDomOneWayData1.sort((a, b) => (a.differenceTime < b.differenceTime ? 1 : -1));
              break;
            case 1:
              this.tempDomOneWayData2 = this.tempDomOneWayData2.sort((a, b) => (a.differenceTime < b.differenceTime ? 1 : -1));
              break;
            case 2:
              this.tempDomOneWayData3 = this.tempDomOneWayData3.sort((a, b) => (a.differenceTime < b.differenceTime ? 1 : -1));
              break;
            case 3:
              this.tempDomOneWayData4 = this.tempDomOneWayData4.sort((a, b) => (a.differenceTime < b.differenceTime ? 1 : -1));
              break;
          }
        }
        $("#sortDuration" + i).text("");
        break;
      case "arrival":
        this.defaultSortHeader('arrival', i);
        if ($("#iduArr" + i).css("display") == "none") {
          $("#iddArr" + i).css("display", "none");
          $("#iduArr" + i).css("display", "block");
          switch (i) {
            case 0:
              this.tempDomOneWayData1 = this.tempDomOneWayData1.sort((a, b) => (a.arrivalTime > b.arrivalTime ? 1 : -1));
              break;
            case 1:
              this.tempDomOneWayData2 = this.tempDomOneWayData2.sort((a, b) => (a.arrivalTime > b.arrivalTime ? 1 : -1));
              break;
            case 2:
              this.tempDomOneWayData3 = this.tempDomOneWayData3.sort((a, b) => (a.arrivalTime > b.arrivalTime ? 1 : -1));
              break;
            case 3:
              this.tempDomOneWayData4 = this.tempDomOneWayData4.sort((a, b) => (a.arrivalTime > b.arrivalTime ? 1 : -1));
              break;
          }
        } else {
          $("#iddArr" + i).css("display", "block");
          $("#iduArr" + i).css("display", "none");
          switch (i) {
            case 0:
              this.tempDomOneWayData1 = this.tempDomOneWayData1.sort((a, b) => (a.arrivalTime < b.arrivalTime ? 1 : -1));
              break;
            case 1:
              this.tempDomOneWayData2 = this.tempDomOneWayData2.sort((a, b) => (a.arrivalTime < b.arrivalTime ? 1 : -1));
              break;
            case 2:
              this.tempDomOneWayData3 = this.tempDomOneWayData3.sort((a, b) => (a.arrivalTime < b.arrivalTime ? 1 : -1));
              break;
            case 3:
              this.tempDomOneWayData4 = this.tempDomOneWayData4.sort((a, b) => (a.arrivalTime < b.arrivalTime ? 1 : -1));
              break;
          }
        }
        $("#sortArrival" + i).text("");
        break;
      case "price":
        this.defaultSortHeader('price', i);
        if ($("#iduPri" + i).css("display") == "none") {
          $("#iddPri" + i).css("display", "none");
          $("#iduPri" + i).css("display", "block");
          switch (i) {
            case 0:
              this.tempDomOneWayData1 = this.tempDomOneWayData1.sort((a, b) => (a.totalPrice > b.totalPrice ? 1 : -1));
              break;
            case 1:
              this.tempDomOneWayData2 = this.tempDomOneWayData2.sort((a, b) => (a.totalPrice > b.totalPrice ? 1 : -1));
              break;
            case 2:
              this.tempDomOneWayData3 = this.tempDomOneWayData3.sort((a, b) => (a.totalPrice > b.totalPrice ? 1 : -1));
              break;
            case 3:
              this.tempDomOneWayData4 = this.tempDomOneWayData4.sort((a, b) => (a.totalPrice > b.totalPrice ? 1 : -1));
              break;
          }
        } else {
          $("#iddPri" + i).css("display", "block");
          $("#iduPri" + i).css("display", "none");
          switch (i) {
            case 0:
              this.tempDomOneWayData1 = this.tempDomOneWayData1.sort((a, b) => (a.totalPrice < b.totalPrice ? 1 : -1));
              break;
            case 1:
              this.tempDomOneWayData2 = this.tempDomOneWayData2.sort((a, b) => (a.totalPrice < b.totalPrice ? 1 : -1));
              break;
            case 2:
              this.tempDomOneWayData3 = this.tempDomOneWayData3.sort((a, b) => (a.totalPrice < b.totalPrice ? 1 : -1));
              break;
            case 3:
              this.tempDomOneWayData4 = this.tempDomOneWayData4.sort((a, b) => (a.totalPrice < b.totalPrice ? 1 : -1));
              break;
          }
        }
        $("#sortPrice" + i).text("");
        break;
      default:
        break;

    }

  }
  filterAirlines(id: any, event: any, isFilterTop: boolean = false, ind: number) {
    switch (ind) {
      case 0:
        this.selectedAirFilterList1 = [];
        if (!isFilterTop) {
          if (event.target.checked) {
            if (!this.flightHelper.isExistAppliedFilter(this.flightHelper.getAirlineName(id, this.airlines1), this.appliedFilter1)) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "", "",
                this.flightHelper.getAirlineName(id, this.airlines1), this.flightHelper.getAirlineName(id, this.airlines1), this.flightHelper.getCurrentFlightCode(id, this.scheduleDescs1), 0);
            }
          } else {
            this.removeAppliedFilterItem(this.flightHelper.getAirlineName(id, this.airlines1), "", ind);
          }
        }
        for (let i = 0; i < this.airlines1.length; i++) {
          if (!isFilterTop) {
            var isChecked = $("#filterId" + ind + i).is(":checked");
            if (isChecked) {
              var item = $("input[id='filterId" + ind + i + "']:checked").val();
              if (!this.selectedAirFilterList1.includes(item)) {
                this.selectedAirFilterList1.push(item);
              }
            }
          }
          if (isFilterTop) {
            if (!this.selectedAirFilterList1.includes(id)) {
              this.selectedAirFilterList1.push(id);
            }
          }
        }
        break;
      case 1:
        this.selectedAirFilterList2 = [];
        if (!isFilterTop) {
          if (event.target.checked) {
            if (!this.flightHelper.isExistAppliedFilter(this.flightHelper.getAirlineName(id, this.airlines2), this.appliedFilter2)) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "", "",
                this.flightHelper.getAirlineName(id, this.airlines2),
                this.flightHelper.getAirlineName(id, this.airlines2),
                this.flightHelper.getCurrentFlightCode(id, this.scheduleDescs2), 0);
            }
          } else {
            this.removeAppliedFilterItem(this.flightHelper.getAirlineName(id, this.airlines2), "", ind);
          }
        }
        for (let i = 0; i < this.airlines2.length; i++) {
          if (!isFilterTop) {
            var isChecked = $("#filterId" + ind + i).is(":checked");
            if (isChecked) {
              var item = $("input[id='filterId" + ind + i + "']:checked").val();
              if (!this.selectedAirFilterList2.includes(item)) {
                this.selectedAirFilterList2.push(item);
              }
            }
          }
          if (isFilterTop) {
            if (!this.selectedAirFilterList2.includes(id)) {
              this.selectedAirFilterList2.push(id);
            }
          }
        }
        break;
      case 2:
        this.selectedAirFilterList3 = [];
        if (!isFilterTop) {
          if (event.target.checked) {
            if (!this.flightHelper.isExistAppliedFilter(this.flightHelper.getAirlineName(id, this.airlines3), this.appliedFilter3)) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "", "",
                this.flightHelper.getAirlineName(id, this.airlines3),
                this.flightHelper.getAirlineName(id, this.airlines3),
                this.flightHelper.getCurrentFlightCode(id, this.scheduleDescs3), 0);
            }
          } else {
            this.removeAppliedFilterItem(this.flightHelper.getAirlineName(id, this.airlines3), "", ind);
          }
        }
        for (let i = 0; i < this.airlines3.length; i++) {
          if (!isFilterTop) {
            var isChecked = $("#filterId" + ind + i).is(":checked");
            if (isChecked) {
              var item = $("input[id='filterId" + ind + i + "']:checked").val();
              if (!this.selectedAirFilterList3.includes(item)) {
                this.selectedAirFilterList3.push(item);
              }
            }
          }
          if (isFilterTop) {
            if (!this.selectedAirFilterList3.includes(id)) {
              this.selectedAirFilterList3.push(id);
            }
          }
        }
        break;
      case 3:
        this.selectedAirFilterList4 = [];
        if (!isFilterTop) {
          if (event.target.checked) {
            if (!this.flightHelper.isExistAppliedFilter(this.flightHelper.getAirlineName(id, this.airlines4), this.appliedFilter4)) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "", "",
                this.flightHelper.getAirlineName(id, this.airlines4),
                this.flightHelper.getAirlineName(id, this.airlines4),
                this.flightHelper.getCurrentFlightCode(id, this.scheduleDescs4), 0);
            }
          } else {
            this.removeAppliedFilterItem(this.flightHelper.getAirlineName(id, this.airlines4), "", ind);
          }
        }
        for (let i = 0; i < this.airlines4.length; i++) {
          if (!isFilterTop) {
            var isChecked = $("#filterId" + ind + i).is(":checked");
            if (isChecked) {
              var item = $("input[id='filterId" + ind + i + "']:checked").val();
              if (!this.selectedAirFilterList4.includes(item)) {
                this.selectedAirFilterList4.push(item);
              }
            }
          }
          if (isFilterTop) {
            if (!this.selectedAirFilterList4.includes(id)) {
              this.selectedAirFilterList4.push(id);
            }
          }
        }
        break;
    }
    this.filterFlightSearch(ind);
  }
  popularFilterItem(item: any, event: any, ind: number) {
    try {
      if (event.target.checked) {
        switch (ind) {
          case 0:
            switch (item.origin) {
              case "refundable":
                this.refundFilterList1 = [];
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter1)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0", ind);
                }
                this.refundFilterList1.push(true);
                $("#chkRefundYes" + ind).prop("checked", true);
                $("#chkRefundNo" + ind).prop("checked", false);
                this.removeAppliedFilterItem("NonRefundable", "", ind);
                break;
              case "stop":
                $("#stopId" + ind + item.id).prop("checked", true);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter1)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "", "", item.title, item.id, item.id, ind);
                }
                break;
              case "departure":
                $("#scheduleDept" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
                let i = (item.value.replaceAll('-', '')).replaceAll(' ', '');
                this.flightHelper._scheduleWidgetSelect(i, 'dept', ind);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter1)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", item.value, item.details, "departure", ind);
                }
                break;
              case "arrival":
                $("#scheduleArr" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
                let j = (item.value.replaceAll('-', '')).replaceAll(' ', '');
                this.flightHelper._scheduleWidgetSelect(j, 'arr', ind);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter1)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", item.value, item.details, "arrival", ind);
                }
                break;
              default:
                break;
            }
            break;
          case 1:
            switch (item.origin) {
              case "refundable":
                this.refundFilterList2 = [];
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter2)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0", ind);
                }
                this.refundFilterList2.push(true);
                $("#chkRefundYes" + ind).prop("checked", true);
                $("#chkRefundNo" + ind).prop("checked", false);
                this.removeAppliedFilterItem("NonRefundable", "", ind);
                break;
              case "stop":
                $("#stopId" + ind + item.id).prop("checked", true);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter2)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "", "", item.title, item.id, item.id, ind);
                }
                break;
              case "departure":
                $("#scheduleDept" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
                let i = (item.value.replaceAll('-', '')).replaceAll(' ', '');
                this.flightHelper._scheduleWidgetSelect(i, 'dept', ind);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter2)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", item.value, item.details, "departure", ind);
                }
                break;
              case "arrival":
                $("#scheduleArr" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
                let j = (item.value.replaceAll('-', '')).replaceAll(' ', '');
                this.flightHelper._scheduleWidgetSelect(j, 'arr', ind);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter2)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", item.value, item.details, "arrival", ind);
                }
                break;
              default:
                break;
            }
            break;
          case 2:
            switch (item.origin) {
              case "refundable":
                this.refundFilterList3 = [];
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter3)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0", ind);
                }
                this.refundFilterList3.push(true);
                $("#chkRefundYes" + ind).prop("checked", true);
                $("#chkRefundNo" + ind).prop("checked", false);
                this.removeAppliedFilterItem("NonRefundable", "", ind);
                break;
              case "stop":
                $("#stopId" + ind + item.id).prop("checked", true);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter3)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "", "", item.title, item.id, item.id, ind);
                }
                break;
              case "departure":
                $("#scheduleDept" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
                let i = (item.value.replaceAll('-', '')).replaceAll(' ', '');
                this.flightHelper._scheduleWidgetSelect(i, 'dept', ind);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter3)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", item.value, item.details, "departure", ind);
                }
                break;
              case "arrival":
                $("#scheduleArr" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
                let j = (item.value.replaceAll('-', '')).replaceAll(' ', '');
                this.flightHelper._scheduleWidgetSelect(j, 'arr', ind);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter3)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", item.value, item.details, "arrival", ind);
                }
                break;
              default:
                break;
            }
            break;
          case 3:
            switch (item.origin) {
              case "refundable":
                this.refundFilterList4 = [];
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter4)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0", ind);
                }
                this.refundFilterList4.push(true);
                $("#chkRefundYes" + ind).prop("checked", true);
                $("#chkRefundNo" + ind).prop("checked", false);
                this.removeAppliedFilterItem("NonRefundable", "", ind);
                break;
              case "stop":
                $("#stopId" + ind + item.id).prop("checked", true);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter4)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "", "", item.title, item.id, item.id, ind);
                }
                break;
              case "departure":
                $("#scheduleDept" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
                let i = (item.value.replaceAll('-', '')).replaceAll(' ', '');
                this.flightHelper._scheduleWidgetSelect(i, 'dept', ind);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter4)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", item.value, item.details, "departure", ind);
                }
                break;
              case "arrival":
                $("#scheduleArr" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
                let j = (item.value.replaceAll('-', '')).replaceAll(' ', '');
                this.flightHelper._scheduleWidgetSelect(j, 'arr', ind);
                if (!this.flightHelper.isExistAppliedFilter(item.id, this.appliedFilter4)) {
                  this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", item.value, item.details, "arrival", ind);
                }
                break;
              default:
                break;
            }
            break;
        }

      } else {
        switch (item.origin) {
          case "refundable":
            this.removeAppliedFilterItem(item.id, "", ind);
            $("#chkRefundYes" + ind).prop("checked", false);
            break;
          case "stop":
            this.removeAppliedFilterItem(item.id, "", ind);
            $("#stopId" + ind + item.id).prop("checked", false);
            break;
          case "departure":

            this.removeAppliedFilterItem(item.details, "dep_shedule", ind);
            $("#scheduleDept" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
            let i = (item.value.replaceAll('-', '')).replaceAll(' ', '');
            this.flightHelper._scheduleWidgetDeSelect(i, 'dept', 0);
            break;
          case "arrival":
            this.removeAppliedFilterItem(item.details, "ret_shedule", ind);
            $("#scheduleArr" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", true);
            let j = (item.value.replaceAll('-', '')).replaceAll(' ', '');
            this.flightHelper._scheduleWidgetSelect(j, 'arr', 0);
            break;
          default:
            break;
        }
      }
      this.filterFlightSearch(ind);
    } catch (exp) { }
  }
  filterDepartureTime(i: any, title: any, details: any, event: any, ind: number) {
    try {
      switch (ind) {
        case 0:
          this.selectedDeptTimeList1 = [];
          if (event.target.checked) {
            var item = details;
            this.flightHelper._scheduleWidgetSelect(i, 'dept', ind);
            let fh = item.toString().split('-')[0];
            let th = item.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter1, "dep_shedule")) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", title, item, fh + "-" + th, ind);
            }
          } else {
            this.removeAppliedFilterItem(details, 'dep_shedule', ind);
          }
          for (let item of this.departureTimeFilter1) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            var isItem = $("#scheduleDept" + ind + i).is(":checked");
            if (isItem) {
              let fh = item.details.toString().split('-')[0];
              let th = item.details.toString().split('-')[1];
              fh = moment(fh, ["h:mm A"]).format("HH:mm");
              th = moment(th, ["h:mm A"]).format("HH:mm");
              for (let subItem of this.itineraries1) {
                let time = this.flightHelper._scheduleDescs(subItem.legs[0].ref - 1, this.scheduleDescs1).departure.time;
                if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                  this.selectedDeptTimeList1.push({ id: item, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
                }
              }
            }
          }
          break;
        case 1:
          this.selectedDeptTimeList2 = [];
          if (event.target.checked) {
            var item = details;
            this.flightHelper._scheduleWidgetSelect(i, 'dept', ind);
            let fh = item.toString().split('-')[0];
            let th = item.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter1, "dep_shedule")) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", title, item, fh + "-" + th, ind);
            }
          } else {
            this.removeAppliedFilterItem(details, 'dep_shedule', ind);
          }
          for (let item of this.departureTimeFilter2) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            var isItem = $("#scheduleDept" + ind + i).is(":checked");
            if (isItem) {
              let fh = item.details.toString().split('-')[0];
              let th = item.details.toString().split('-')[1];
              fh = moment(fh, ["h:mm A"]).format("HH:mm");
              th = moment(th, ["h:mm A"]).format("HH:mm");
              for (let subItem of this.itineraries2) {
                let time = this.flightHelper._scheduleDescs(subItem.legs[0].ref - 1, this.scheduleDescs2).departure.time;
                if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                  this.selectedDeptTimeList2.push({ id: item, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });

                }
              }
            }
          }
          break;
        case 2:
          this.selectedDeptTimeList3 = [];
          if (event.target.checked) {
            var item = details;
            this.flightHelper._scheduleWidgetSelect(i, 'dept', ind);
            let fh = item.toString().split('-')[0];
            let th = item.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter1, "dep_shedule")) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", title, item, fh + "-" + th, ind);
            }
          } else {
            this.removeAppliedFilterItem(details, 'dep_shedule', ind);
          }
          for (let item of this.departureTimeFilter3) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            var isItem = $("#scheduleDept" + ind + i).is(":checked");
            if (isItem) {
              let fh = item.details.toString().split('-')[0];
              let th = item.details.toString().split('-')[1];
              fh = moment(fh, ["h:mm A"]).format("HH:mm");
              th = moment(th, ["h:mm A"]).format("HH:mm");
              for (let subItem of this.itineraries3) {
                let time = this.flightHelper._scheduleDescs(subItem.legs[0].ref - 1, this.scheduleDescs3).departure.time;
                if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                  this.selectedDeptTimeList3.push({ id: item, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });

                }
              }
            }
          }
          break;
        case 3:
          this.selectedDeptTimeList4 = [];
          if (event.target.checked) {
            var item = details;
            this.flightHelper._scheduleWidgetSelect(i, 'dept', ind);
            let fh = item.toString().split('-')[0];
            let th = item.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter1, "dep_shedule")) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "dep_shedule", "fa fa-arrow-right", title, item, fh + "-" + th, ind);
            }
          } else {
            this.removeAppliedFilterItem(details, 'dep_shedule', ind);
          }
          for (let item of this.departureTimeFilter4) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            var isItem = $("#scheduleDept" + ind + i).is(":checked");
            if (isItem) {
              let fh = item.details.toString().split('-')[0];
              let th = item.details.toString().split('-')[1];
              fh = moment(fh, ["h:mm A"]).format("HH:mm");
              th = moment(th, ["h:mm A"]).format("HH:mm");
              for (let subItem of this.itineraries4) {
                let time = this.flightHelper._scheduleDescs(subItem.legs[0].ref - 1, this.scheduleDescs4).departure.time;
                if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                  this.selectedDeptTimeList4.push({ id: item, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });

                }
              }
            }
          }
          break;
      }

      this.filterFlightSearch(ind);
    } catch (exp) { }
  }
  filterArrivalTime(i: any, title: any, details: any, event: any, ind: number) {
    try {
      switch (ind) {
        case 0:
          this.selectedArrTimeList1 = [];
          if (event.target.checked) {
            var item = details;
            this.flightHelper._scheduleWidgetSelect(i, 'arr', ind);
            let fh = item.toString().split('-')[0];
            let th = item.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter1, "ret_shedule")) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", title, item, fh + "-" + th, ind);
            }
          } else {
            this.removeAppliedFilterItem(details, 'ret_shedule', ind);
          }
          for (let item of this.arrivalTimeFilter1) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            var isItem = $("#scheduleArr" + ind + i).is(":checked");
            if (isItem) {
              let fh = item.details.toString().split('-')[0];
              let th = item.details.toString().split('-')[1];
              fh = moment(fh, ["h:mm A"]).format("HH:mm");
              th = moment(th, ["h:mm A"]).format("HH:mm");
              for (let subItem of this.itineraries1) {
                let time = this.flightHelper._scheduleDescs(subItem.legs[0].ref - 1, this.scheduleDescs1).arrival.time;
                if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                  this.selectedArrTimeList1.push({ id: item, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
                }
              }
            }
          }
          break;
        case 1:
          this.selectedArrTimeList2 = [];
          if (event.target.checked) {
            var item = details;
            this.flightHelper._scheduleWidgetSelect(i, 'arr', ind);
            let fh = item.toString().split('-')[0];
            let th = item.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter2, "ret_shedule")) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", title, item, fh + "-" + th, ind);
            }
          } else {
            this.removeAppliedFilterItem(details, 'ret_shedule', ind);
          }
          for (let item of this.arrivalTimeFilter2) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            var isItem = $("#scheduleArr" + ind + i).is(":checked");
            if (isItem) {
              let fh = item.details.toString().split('-')[0];
              let th = item.details.toString().split('-')[1];
              fh = moment(fh, ["h:mm A"]).format("HH:mm");
              th = moment(th, ["h:mm A"]).format("HH:mm");
              for (let subItem of this.itineraries2) {
                let time = this.flightHelper._scheduleDescs(subItem.legs[0].ref - 1, this.scheduleDescs2).arrival.time;
                if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                  this.selectedArrTimeList2.push({ id: item, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
                }
              }
            }
          }
          break;
        case 2:
          this.selectedArrTimeList3 = [];
          if (event.target.checked) {
            var item = details;
            this.flightHelper._scheduleWidgetSelect(i, 'arr', ind);
            let fh = item.toString().split('-')[0];
            let th = item.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter3, "ret_shedule")) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", title, item, fh + "-" + th, ind);
            }
          } else {
            this.removeAppliedFilterItem(details, 'ret_shedule', ind);
          }
          for (let item of this.arrivalTimeFilter3) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            var isItem = $("#scheduleArr" + ind + i).is(":checked");
            if (isItem) {
              let fh = item.details.toString().split('-')[0];
              let th = item.details.toString().split('-')[1];
              fh = moment(fh, ["h:mm A"]).format("HH:mm");
              th = moment(th, ["h:mm A"]).format("HH:mm");
              for (let subItem of this.itineraries3) {
                let time = this.flightHelper._scheduleDescs(subItem.legs[0].ref - 1, this.scheduleDescs3).arrival.time;
                if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                  this.selectedArrTimeList3.push({ id: item, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
                }
              }
            }
          }
          break;
        case 3:
          this.selectedArrTimeList4 = [];
          if (event.target.checked) {
            var item = details;
            this.flightHelper._scheduleWidgetSelect(i, 'arr', ind);
            let fh = item.toString().split('-')[0];
            let th = item.toString().split('-')[1];
            fh = moment(fh, ["h:mm A"]).format("HH:mm");
            th = moment(th, ["h:mm A"]).format("HH:mm");
            if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter4, "ret_shedule")) {
              this.addAppliedFilterItem("fa fa-times-circle-o", "ret_shedule", "fa fa-arrow-left", title, item, fh + "-" + th, ind);
            }
          } else {
            this.removeAppliedFilterItem(details, 'ret_shedule', ind);
          }
          for (let item of this.arrivalTimeFilter4) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            var isItem = $("#scheduleArr" + ind + i).is(":checked");
            if (isItem) {
              let fh = item.details.toString().split('-')[0];
              let th = item.details.toString().split('-')[1];
              fh = moment(fh, ["h:mm A"]).format("HH:mm");
              th = moment(th, ["h:mm A"]).format("HH:mm");
              for (let subItem of this.itineraries4) {
                let time = this.flightHelper._scheduleDescs(subItem.legs[0].ref - 1, this.scheduleDescs4).arrival.time;
                if (time.toString().split(':')[0] >= fh.toString().split(':')[0] && time.toString().split(':')[0] <= th.toString().split(':')[0]) {
                  this.selectedArrTimeList4.push({ id: item, text: time.toString().split(':')[0] + ":" + time.toString().split(':')[1] });
                }
              }
            }
          }
          break;
      }
      this.filterFlightSearch(ind);
    } catch (exp) { }
  }
  addAppliedFilterItem(cancel_class: string, schedule_class: string, arrow_class: string, title: string, value: string, origin: string, i: number) {
    switch (i) {
      case 0:
        this.appliedFilter1.push({
          cancel_class: cancel_class, schedule_class: schedule_class,
          arrow_class: arrow_class, title: title, value: value, origin: origin
        });
        break;
      case 1:
        this.appliedFilter2.push({
          cancel_class: cancel_class, schedule_class: schedule_class,
          arrow_class: arrow_class, title: title, value: value, origin: origin
        });
        break;
      case 2:
        this.appliedFilter3.push({
          cancel_class: cancel_class, schedule_class: schedule_class,
          arrow_class: arrow_class, title: title, value: value, origin: origin
        });
        break;
      case 3:
        this.appliedFilter4.push({
          cancel_class: cancel_class, schedule_class: schedule_class,
          arrow_class: arrow_class, title: title, value: value, origin: origin
        });
        break;
    }
  }
  removeAppliedFilterItem(id: any, type: any = "", ind: number) {
    //Unchecked Refundable
    if (id === "Refundable") {
      $("#chkRefundYes" + ind).prop("checked", false);
      $("#popularFilterId" + ind + id).prop("checked", false);
    }
    if (id === "NonRefundable") {
      $("#chkRefundNo" + ind).prop("checked", false);
    }
    switch (ind) {
      case 0:
        if (type == undefined || type == "") {
          this.appliedFilter1 = this.appliedFilter1.filter(x => x.value.toString().trim().toLowerCase() != id.toString().trim().toLowerCase());
        } else {
          let findInd = this.appliedFilter1.findIndex(x => x.value.toString().trim().toLowerCase() == id.toString().trim().toLowerCase() &&
            x.schedule_class.toString().trim().toLowerCase() == type.toString().trim().toLowerCase());
          this.appliedFilter1.splice(findInd, 1);
        }
        //Unchecked Stop Count
        for (let item of this.stopCountList1) {
          if (item.id === id) {
            $("#stopId" + ind + item.id).prop("checked", false);
            $("#popularFilterId" + ind + id).prop("checked", false);
          }
        }
        //Deselect departure panel
        if (type.toString().trim() == "dep_shedule") {
          for (let item of this.departureTimeFilter1) {
            if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
              $("#popularFilterId" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
              this.flightHelper._scheduleWidgetDeSelect((item.title.replaceAll('-', '')).replaceAll(' ', ''), 'dept', ind);
              this.selectedDeptTimeList1 = this.selectedDeptTimeList1.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
                != id.toString().replaceAll(" ", "").trim().toLowerCase());
            }
          }
        }
        if (type.toString().trim() == "ret_shedule") {
          for (let item of this.arrivalTimeFilter1) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
              this.flightHelper._scheduleWidgetDeSelect(i, 'arr', ind);
              this.selectedArrTimeList1 = this.selectedArrTimeList1.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
                != id.toString().replaceAll(" ", "").trim().toLowerCase());
            }
          }
        }
        //Unchecked airline
        for (let i = 0; i < this.airlines1.length; i++) {
          let item = this.flightHelper.getAirlineName(this.airlines1[i].code, this.airlines1);
          if (item.toString().toLowerCase() == id.toString().toLowerCase()) {
            $("#filterId" + ind + this.airlines1[i].code).prop("checked", false);
            this.selectedAirFilterList1 = this.shareService.removeList(this.airlines1[i].code, this.selectedAirFilterList1);
          }
        }
        break;
      case 1:
        if (type == undefined || type == "") {
          this.appliedFilter2 = this.appliedFilter2.filter(x => x.value.toString().trim().toLowerCase() != id.toString().trim().toLowerCase());
        } else {
          let findInd = this.appliedFilter2.findIndex(x => x.value.toString().trim().toLowerCase() == id.toString().trim().toLowerCase() &&
            x.schedule_class.toString().trim().toLowerCase() == type.toString().trim().toLowerCase());
          this.appliedFilter2.splice(findInd, 1);
        }
        //Unchecked Stop Count
        for (let item of this.stopCountList2) {
          if (item.id === id) {
            $("#stopId" + ind + item.id).prop("checked", false);
            $("#popularFilterId" + ind + id).prop("checked", false);
          }
        }
        if (type.toString().trim() == "dep_shedule") {
          for (let item of this.departureTimeFilter2) {
            if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
              $("#popularFilterId" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
              this.flightHelper._scheduleWidgetDeSelect((item.title.replaceAll('-', '')).replaceAll(' ', ''), 'dept', ind);
              this.selectedDeptTimeList2 = this.selectedDeptTimeList2.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
                != id.toString().replaceAll(" ", "").trim().toLowerCase());
            }
          }
        }
        if (type.toString().trim() == "ret_shedule") {
          for (let item of this.arrivalTimeFilter2) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
              this.flightHelper._scheduleWidgetDeSelect(i, 'arr', ind);
              this.selectedArrTimeList2 = this.selectedArrTimeList2.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
                != id.toString().replaceAll(" ", "").trim().toLowerCase());
            }
          }
        }
        //Unchecked airline
        for (let i = 0; i < this.airlines2.length; i++) {
          let item = this.flightHelper.getAirlineName(this.airlines2[i].code, this.airlines2);
          if (item.toString().toLowerCase() == id.toString().toLowerCase()) {
            $("#filterId" + ind + this.airlines2[i].code).prop("checked", false);
            this.selectedAirFilterList2 = this.shareService.removeList(this.airlines2[i].code, this.selectedAirFilterList2);
          }
        }
        break;
      case 2:
        if (type == undefined || type == "") {
          this.appliedFilter3 = this.appliedFilter3.filter(x => x.value.toString().trim().toLowerCase() != id.toString().trim().toLowerCase());
        } else {
          let findInd = this.appliedFilter3.findIndex(x => x.value.toString().trim().toLowerCase() == id.toString().trim().toLowerCase() &&
            x.schedule_class.toString().trim().toLowerCase() == type.toString().trim().toLowerCase());
          this.appliedFilter3.splice(findInd, 1);
        }
        //Unchecked Stop Count
        for (let item of this.stopCountList3) {
          if (item.id === id) {
            $("#stopId" + ind + item.id).prop("checked", false);
            $("#popularFilterId" + ind + id).prop("checked", false);
          }
        }
        if (type.toString().trim() == "dep_shedule") {
          for (let item of this.departureTimeFilter3) {
            if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
              $("#popularFilterId" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
              this.flightHelper._scheduleWidgetDeSelect((item.title.replaceAll('-', '')).replaceAll(' ', ''), 'dept', 2);
              this.selectedDeptTimeList3 = this.selectedDeptTimeList3.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
                != id.toString().replaceAll(" ", "").trim().toLowerCase());
            }
          }
        }
        if (type.toString().trim() == "ret_shedule") {
          for (let item of this.arrivalTimeFilter3) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
              this.flightHelper._scheduleWidgetDeSelect(i, 'arr', ind);
              this.selectedArrTimeList3 = this.selectedArrTimeList3.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
                != id.toString().replaceAll(" ", "").trim().toLowerCase());
            }
          }
        }
        //Unchecked airline
        for (let i = 0; i < this.airlines3.length; i++) {
          let item = this.flightHelper.getAirlineName(this.airlines3[i].code, this.airlines3);
          if (item.toString().toLowerCase() == id.toString().toLowerCase()) {
            $("#filterId" + ind + this.airlines3[i].code).prop("checked", false);
            this.selectedAirFilterList3 = this.shareService.removeList(this.airlines3[i].code, this.selectedAirFilterList3);
          }
        }
        break;
      case 3:
        if (type == undefined || type == "") {
          this.appliedFilter4 = this.appliedFilter4.filter(x => x.value.toString().trim().toLowerCase() != id.toString().trim().toLowerCase());
        } else {
          let findInd = this.appliedFilter4.findIndex(x => x.value.toString().trim().toLowerCase() == id.toString().trim().toLowerCase() &&
            x.schedule_class.toString().trim().toLowerCase() == type.toString().trim().toLowerCase());
          this.appliedFilter4.splice(findInd, 1);
        }
        //Unchecked Stop Count
        for (let item of this.stopCountList4) {
          if (item.id === id) {
            $("#stopId" + ind + item.id).prop("checked", false);
            $("#popularFilterId" + ind + id).prop("checked", false);
          }
        }
        if (type.toString().trim() == "dep_shedule") {
          for (let item of this.departureTimeFilter4) {
            if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
              $("#popularFilterId" + ind + (item.value.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
              this.flightHelper._scheduleWidgetDeSelect((item.title.replaceAll('-', '')).replaceAll(' ', ''), 'dept', 3);
              this.selectedDeptTimeList4 = this.selectedDeptTimeList4.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
                != id.toString().replaceAll(" ", "").trim().toLowerCase());
            }
          }
        }
        if (type.toString().trim() == "ret_shedule") {
          for (let item of this.arrivalTimeFilter4) {
            let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
            if (item.details.toString().toLowerCase() == id.toString().toLowerCase()) {
              this.flightHelper._scheduleWidgetDeSelect(i, 'arr', ind);
              this.selectedArrTimeList4 = this.selectedArrTimeList4.filter(x => x.id.toString().replaceAll(" ", "").trim().toLowerCase()
                != id.toString().replaceAll(" ", "").trim().toLowerCase());
            }
          }
        }
        //Unchecked airline
        for (let i = 0; i < this.airlines4.length; i++) {
          let item = this.flightHelper.getAirlineName(this.airlines4[i].code, this.airlines4);
          if (item.toString().toLowerCase() == id.toString().toLowerCase()) {
            $("#filterId" + ind + this.airlines4[i].code).prop("checked", false);
            this.selectedAirFilterList4 = this.shareService.removeList(this.airlines4[i].code, this.selectedAirFilterList4);
          }
        }
        break;
    }
    this.filterFlightSearch(ind);
  }
  removeAllAppliedFilterItem(ind: number) {
    this.setTempFilterData(ind);
    $("#chkRefundYes" + ind).prop("checked", false);
    $("#chkRefundNo" + ind).prop("checked", false);
    switch (ind) {
      case 0:
        this.appliedFilter1 = [];
        this.selectedDeptTimeList1 = [];
        this.selectedArrTimeList1 = [];
        this.selectedAirFilterList1 = [];
        for (let item of this.stopCountList1)
          $("#stopId" + ind + item.id).prop("checked", false);
        for (let item of this.airlines1)
          $("#filterId" + ind + item.code).prop("checked", false);
        for (let item of this.departureTimeFilter1) {
          let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
          this.flightHelper._scheduleWidgetDeSelect(i, 'dept', ind);
        }
        for (let item of this.arrivalTimeFilter1) {
          let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
          this.flightHelper._scheduleWidgetDeSelect(i, 'arr', ind);
        }
        for (let item of this.popularFilter1)
          $("#popularFilterId" + ind + (item.id.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
        // $("#changeWayPriceID"+ind).slider("destroy");
        break;
      case 1:
        this.appliedFilter2 = [];
        this.selectedDeptTimeList2 = [];
        this.selectedArrTimeList2 = [];
        this.selectedAirFilterList2 = [];
        for (let item of this.stopCountList2)
          $("#stopId" + ind + item.id).prop("checked", false);
        for (let item of this.airlines2)
          $("#filterId" + ind + item.code).prop("checked", false);
        for (let item of this.departureTimeFilter1) {
          let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
          this.flightHelper._scheduleWidgetDeSelect(i, 'dept', ind);
        }
        for (let item of this.arrivalTimeFilter2) {
          let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
          this.flightHelper._scheduleWidgetDeSelect(i, 'arr', ind);
        }
        for (let item of this.popularFilter2)
          $("#popularFilterId" + ind + (item.id.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
        // $("#changeWayPriceID"+ind).slider("destroy");
        break;
      case 2:
        this.appliedFilter3 = [];
        this.selectedDeptTimeList3 = [];
        this.selectedArrTimeList3 = [];
        this.selectedAirFilterList3 = [];
        for (let item of this.stopCountList3)
          $("#stopId" + ind + item.id).prop("checked", false);
        for (let item of this.airlines3)
          $("#filterId" + ind + item.code).prop("checked", false);
        for (let item of this.departureTimeFilter3) {
          let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
          this.flightHelper._scheduleWidgetDeSelect(i, 'dept', ind);
        }
        for (let item of this.arrivalTimeFilter3) {
          let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
          this.flightHelper._scheduleWidgetDeSelect(i, 'arr', ind);
        }
        for (let item of this.popularFilter3)
          $("#popularFilterId" + ind + (item.id.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
        // $("#changeWayPriceID"+ind).slider("destroy");
        break;
      case 3:
        this.appliedFilter4 = [];
        this.selectedDeptTimeList4 = [];
        this.selectedArrTimeList4 = [];
        this.selectedAirFilterList4 = [];
        for (let item of this.stopCountList4)
          $("#stopId" + ind + item.id).prop("checked", false);
        for (let item of this.airlines4)
          $("#filterId" + ind + item.code).prop("checked", false);
        for (let item of this.departureTimeFilter4) {
          let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
          this.flightHelper._scheduleWidgetDeSelect(i, 'dept', ind);
        }
        for (let item of this.arrivalTimeFilter4) {
          let i = (item.title.replaceAll('-', '')).replaceAll(' ', '');
          this.flightHelper._scheduleWidgetDeSelect(i, 'arr', ind);
        }
        for (let item of this.popularFilter4)
          $("#popularFilterId" + ind + (item.id.replaceAll('-', '')).replaceAll(' ', '')).prop("checked", false);
        // $("#changeWayPriceID"+ind).slider("destroy");
        break;
    }
  }
  filterRefund(type: string, event: any, ind: number) {
    try {
      switch (ind) {
        case 0:
          this.refundFilterList1 = [];
          if (type == "Yes") {
            if (event.target.checked) {
              if (!this.flightHelper.isExistAppliedFilter("Refundable", this.appliedFilter1)) {
                this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0", ind);
                this.refundFilterList1.push(true);
                $("#chkRefundNo" + ind).prop("checked", false);
                this.removeAppliedFilterItem("NonRefundable", "", ind);
              }
            } else {
              this.removeAppliedFilterItem("Refundable", "", ind);
            }
          }
          if (type == "No") {
            if (event.target.checked) {
              if (!this.flightHelper.isExistAppliedFilter("NonRefundable", this.appliedFilter1)) {
                this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "NonRefundable", "NonRefundable", "1", ind);
                this.refundFilterList1.push(false);
                $("#chkRefundYes" + ind).prop("checked", false);
                this.removeAppliedFilterItem("Refundable", "", ind);
              }
            } else {
              this.removeAppliedFilterItem("NonRefundable", "", ind);
            }
          }
          break;
        case 1:
          this.refundFilterList2 = [];
          if (type == "Yes") {
            if (event.target.checked) {
              if (!this.flightHelper.isExistAppliedFilter("Refundable", this.appliedFilter2)) {
                this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0", ind);
                this.refundFilterList2.push(true);
                $("#chkRefundNo" + ind).prop("checked", false);
                this.removeAppliedFilterItem("NonRefundable", "", ind);
              }
            } else {
              this.removeAppliedFilterItem("Refundable", "", ind);
            }
          }
          if (type == "No") {
            if (event.target.checked) {
              if (!this.flightHelper.isExistAppliedFilter("NonRefundable", this.appliedFilter2)) {
                this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "NonRefundable", "NonRefundable", "1", ind);
                this.refundFilterList2.push(false);
                $("#chkRefundYes" + ind).prop("checked", false);
                this.removeAppliedFilterItem("Refundable", "", ind);
              }
            } else {
              this.removeAppliedFilterItem("NonRefundable", "", ind);
            }
          }
          break;
        case 2:
          this.refundFilterList3 = [];
          if (type == "Yes") {
            if (event.target.checked) {
              if (!this.flightHelper.isExistAppliedFilter("Refundable", this.appliedFilter3)) {
                this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0", ind);
                this.refundFilterList3.push(true);
                $("#chkRefundNo" + ind).prop("checked", false);
                this.removeAppliedFilterItem("NonRefundable", "", ind);
              }
            } else {
              this.removeAppliedFilterItem("Refundable", "", ind);
            }
          }
          if (type == "No") {
            if (event.target.checked) {
              if (!this.flightHelper.isExistAppliedFilter("NonRefundable", this.appliedFilter3)) {
                this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "NonRefundable", "NonRefundable", "1", ind);
                this.refundFilterList3.push(false);
                $("#chkRefundYes" + ind).prop("checked", false);
                this.removeAppliedFilterItem("Refundable", "", ind);
              }
            } else {
              this.removeAppliedFilterItem("NonRefundable", "", ind);
            }
          }
          break;
        case 3:
          this.refundFilterList4 = [];
          if (type == "Yes") {
            if (event.target.checked) {
              if (!this.flightHelper.isExistAppliedFilter("Refundable", this.appliedFilter4)) {
                this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "Refundable", "Refundable", "0", ind);
                this.refundFilterList4.push(true);
                $("#chkRefundNo" + ind).prop("checked", false);
                this.removeAppliedFilterItem("NonRefundable", "", ind);
              }
            } else {
              this.removeAppliedFilterItem("Refundable", "", ind);
            }
          }
          if (type == "No") {
            if (event.target.checked) {
              if (!this.flightHelper.isExistAppliedFilter("NonRefundable", this.appliedFilter4)) {
                this.addAppliedFilterItem("fa fa-times-circle-o", "", "", "NonRefundable", "NonRefundable", "1", ind);
                this.refundFilterList4.push(false);
                $("#chkRefundYes" + ind).prop("checked", false);
                this.removeAppliedFilterItem("Refundable", "", ind);
              }
            } else {
              this.removeAppliedFilterItem("NonRefundable", "", ind);
            }
          }
          break;
      }
      this.filterFlightSearch(ind);
    } catch (exp) { }
  }
  changeWayPrice(ind: number) {
    let min: number, max: number, id: number, dif: number = 0;
    let updatedMax: number = 0;
    switch (ind) {
      case 0:
        this.tempDomOneWayData1 = this.domOneWayData1;
        min = Number.parseFloat(this.flightHelper._minimumRange(this.domOneWayData1));
        max = Number.parseFloat(this.flightHelper._maximumRange(this.domOneWayData1));
        id = $("#changeWayPriceID" + ind).val();
        dif = min + (((max - min) / 100) * id);
        this.udMinRangeVal1 = dif;
        updatedMax = this.udMinRangeVal1;
        this.appliedFilter1.forEach((item, index) => {
          if (item.origin.toString() == "range") this.appliedFilter1.splice(index, 1);
        });
        if (min != this.udMinRangeVal1) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "", "", min + "-" + this.udMinRangeVal1, min + "-" + this.udMinRangeVal1,
            "range", ind);
        }
        break;
      case 1:
        this.tempDomOneWayData2 = this.domOneWayData2;
        min = Number.parseFloat(this.flightHelper._minimumRange(this.domOneWayData2));
        max = Number.parseFloat(this.flightHelper._maximumRange(this.domOneWayData2));
        id = $("#changeWayPriceID" + ind).val();
        dif = min + (((max - min) / 100) * id);
        this.udMinRangeVal2 = dif;
        updatedMax = this.udMinRangeVal2;
        this.appliedFilter2.forEach((item, index) => {
          if (item.origin.toString() == "range") this.appliedFilter2.splice(index, 1);
        });
        if (min != this.udMinRangeVal2) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "", "", min + "-" + this.udMinRangeVal2, min + "-" + this.udMinRangeVal2,
            "range", ind);
        }
        break;
      case 2:
        this.tempDomOneWayData3 = this.domOneWayData3;
        min = Number.parseFloat(this.flightHelper._minimumRange(this.domOneWayData3));
        max = Number.parseFloat(this.flightHelper._maximumRange(this.domOneWayData3));
        id = $("#changeWayPriceID" + ind).val();
        dif = min + (((max - min) / 100) * id);
        this.udMinRangeVal3 = dif;
        updatedMax = this.udMinRangeVal3;
        this.appliedFilter3.forEach((item, index) => {
          if (item.origin.toString() == "range") this.appliedFilter3.splice(index, 1);
        });
        if (min != this.udMinRangeVal3) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "", "", min + "-" + this.udMinRangeVal3, min + "-" + this.udMinRangeVal3,
            "range", ind);
        }
        break;
      case 3:
        this.tempDomOneWayData4 = this.domOneWayData4;
        min = Number.parseFloat(this.flightHelper._minimumRange(this.domOneWayData4));
        max = Number.parseFloat(this.flightHelper._maximumRange(this.domOneWayData4));
        id = $("#changeWayPriceID" + ind).val();
        dif = min + (((max - min) / 100) * id);
        this.udMinRangeVal4 = dif;
        updatedMax = this.udMinRangeVal4;
        this.appliedFilter4.forEach((item, index) => {
          if (item.origin.toString() == "range") this.appliedFilter4.splice(index, 1);
        });
        if (min != this.udMinRangeVal4) {
          this.addAppliedFilterItem("fa fa-times-circle-o", "", "", min + "-" + this.udMinRangeVal4, min + "-" + this.udMinRangeVal4,
            "range", ind);
        }
        break;
    }
    this.filterFlightSearch(ind);
  }
  stopWiseFilter(item: any, itemTitle: any, event: any, ind: number) {
    switch (ind) {
      case 0:
        if (event.target.checked) {
          if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter1)) {
            this.addAppliedFilterItem("fa fa-times-circle-o", "", "", itemTitle, item, item, ind);
          }
        } else {
          this.removeAppliedFilterItem(item, "", ind);
        }
        break;
      case 1:
        if (event.target.checked) {
          if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter2)) {
            this.addAppliedFilterItem("fa fa-times-circle-o", "", "", itemTitle, item, item, ind);
          }
        } else {
          this.removeAppliedFilterItem(item, "", ind);
        }
        break;
      case 2:
        if (event.target.checked) {
          if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter3)) {
            this.addAppliedFilterItem("fa fa-times-circle-o", "", "", itemTitle, item, item, ind);
          }
        } else {
          this.removeAppliedFilterItem(item, "", ind);
        }
        break;
      case 3:
        if (event.target.checked) {
          if (!this.flightHelper.isExistAppliedFilter(item, this.appliedFilter4)) {
            this.addAppliedFilterItem("fa fa-times-circle-o", "", "", itemTitle, item, item, ind);
          }
        } else {
          this.removeAppliedFilterItem(item, "", ind);
        }
        break;
    }
    this.filterFlightSearch(ind);
  }
  showFareDetailsMobile(ind: any, way: number) {
    try {
      switch (way) {
        case 0:
          this.fareDetailsModalData1 = [];
          this.fareDetailsModalData1 = this.domOneWayData1.find(x => x.id == ind);
          break;
        case 1:
          this.fareDetailsModalData2 = [];
          this.fareDetailsModalData2 = this.domOneWayData2.find(x => x.id == ind);
          break;
        case 2:
          this.fareDetailsModalData3 = [];
          this.fareDetailsModalData3 = this.domOneWayData3.find(x => x.id == ind);
          break;
        case 3:
          this.fareDetailsModalData4 = [];
          this.fareDetailsModalData4 = this.domOneWayData4.find(x => x.id == ind);
          break;
      }
      $('#fareDetailsModal' + way).modal('show');
    } catch (exp) { }
  }
  getSelectedTopAirlines(i: number): any[] {
    let ret = this.airlines1;
    try {
      switch (i) {
        case 0:
          ret = this.airlines1;
          break;
        case 1:
          ret = this.airlines2;
          break;
        case 2:
          ret = this.airlines3;
          break;
        case 3:
          ret = this.airlines4;
          break;
      }
    } catch (exp) { }
    return ret;
  }
  getSelectedArrivalTimeFilter(i: number): any[] {
    let ret = this.arrivalTimeFilter1;
    try {
      switch (i) {
        case 0:
          ret = this.arrivalTimeFilter1;
          break;
        case 1:
          ret = this.arrivalTimeFilter2;
          break;
        case 2:
          ret = this.arrivalTimeFilter3;
          break;
        case 3:
          ret = this.arrivalTimeFilter4;
          break;
      }
    } catch (exp) { }
    return ret;
  }
  getSelectedStopCountList(i: number): any[] {
    let ret = this.stopCountList1;
    try {
      switch (i) {
        case 0:
          ret = this.stopCountList1;
          break;
        case 1:
          ret = this.stopCountList2;
          break;
        case 2:
          ret = this.stopCountList3;
          break;
        case 3:
          ret = this.stopCountList4;
          break;
      }
    } catch (exp) { }
    return ret;
  }
  getSelectedDepartureTimeFilter(i: number): any[] {
    let ret = this.departureTimeFilter1;
    try {
      switch (i) {
        case 0:
          ret = this.departureTimeFilter1;
          break;
        case 1:
          ret = this.departureTimeFilter2;
          break;
        case 2:
          ret = this.departureTimeFilter3;
          break;
        case 3:
          ret = this.departureTimeFilter4;
          break;
      }
    } catch (exp) { }
    return ret;
  }
  getSelectedPopularFilter(i: number): any[] {
    let ret = this.popularFilter1;
    try {
      switch (i) {
        case 0:
          ret = this.popularFilter1;
          break;
        case 1:
          ret = this.popularFilter2;
          break;
        case 2:
          ret = this.popularFilter3;
          break;
        case 3:
          ret = this.popularFilter4;
          break;
      }
    } catch (exp) { }
    return ret;
  }
  getSelectedRangeData(i: number): any[] {
    let ret = this.domOneWayData1;
    try {
      switch (i) {
        case 0:
          ret = this.domOneWayData1;
          break;
        case 1:
          ret = this.domOneWayData2;
          break;
        case 2:
          ret = this.domOneWayData3;
          break;
        case 3:
          ret = this.domOneWayData4;
          break;
      }
    } catch (exp) { }
    return ret;
  }
  getSelectedUpdateMinRangeVal(i: number): any {
    let ret = this.udMinRangeVal1;
    try {
      switch (i) {
        case 0:
          ret = this.udMinRangeVal1;
          break;
        case 1:
          ret = this.udMinRangeVal2;
          break;
        case 2:
          ret = this.udMinRangeVal3;
          break;
        case 3:
          ret = this.udMinRangeVal4;
          break;
      }
    } catch (exp) { }
    return ret;
  }
  getSelectedAppliedFilter(i: number): any {
    let ret = this.appliedFilter1;
    try {
      switch (i) {
        case 0:
          ret = this.appliedFilter1;
          break;
        case 1:
          ret = this.appliedFilter2;
          break;
        case 2:
          ret = this.appliedFilter3;
          break;
        case 3:
          ret = this.appliedFilter4;
          break;
      }
    } catch (exp) { }
    return ret;
  }
  selectFlightAction(id: any, selectTab: number) {
    try {
      for (let i = 0; i < this.selectedFlightDeparture.length; i++) {
        $("#flight_list" + i).css("display", "none");
      }
      this.selectedTab = selectTab;
      switch (selectTab) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
      }
      $(id).css("display", "block");
    } catch (exp) { }
  }
  selectFlightToIssue(ind: any, id: any) {
    try {
      switch (ind) {
        case 0:
          let find1 = this.domOneWayData1.find(x => x.id == id);
          this.selectedFlightData.data1 = find1;
          break;
        case 1:
          let find2 = this.domOneWayData2.find(x => x.id == id);
          this.selectedFlightData.data2 = find2;
          break;
        case 2:
          let find3 = this.domOneWayData3.find(x => x.id == id);
          this.selectedFlightData.data3 = find3;
          break;
        case 3:
          let find4 = this.domOneWayData4.find(x => x.id == id);
          this.selectedFlightData.data4 = find4;
          break;
      }
      // console.log("Selected Flight data:::::");
      // console.log(this.selectedFlightData);
    } catch (exp) {

    }
  }
  getSelectedFlightToIssueBottomAmount(): any {
    let ret: any = 0;
    try {
      let sum: number = 0;
      if (!this.shareService.isObjectEmpty(this.selectedFlightData.data1)) {
        sum += parseFloat(this.selectedFlightData.data1.clientFareTotal);
      }
      if (!this.shareService.isObjectEmpty(this.selectedFlightData.data2)) {
        sum += parseFloat(this.selectedFlightData.data2.clientFareTotal);
      }
      if (!this.shareService.isObjectEmpty(this.selectedFlightData.data3)) {
        sum += parseFloat(this.selectedFlightData.data3.clientFareTotal);
      }
      if (!this.shareService.isObjectEmpty(this.selectedFlightData.data4)) {
        sum += parseFloat(this.selectedFlightData.data4.clientFareTotal);
      }
      ret = sum;
    } catch (exp) { }
    return ret;
  }
  // getSelectedFlightToIssueBottomAmount(): any {
  //   let ret: any = 0;
  //   try {
  //     let sum: number = 0;
  //     if (!this.shareService.isObjectEmpty(this.selectedFlightData.data1)) {
  //       sum += parseFloat(this.selectedFlightData.data1.clientFareTotal);
  //       this.price = 1;
  //     }
  //     if (!this.shareService.isObjectEmpty(this.selectedFlightData.data2)) {
  //       sum += parseFloat(this.selectedFlightData.data2.clientFareTotal);
  //       this.price = 2;
  //     }
  //     if (!this.shareService.isObjectEmpty(this.selectedFlightData.data3)) {
  //       sum += parseFloat(this.selectedFlightData.data3.clientFareTotal);
  //       this.price = 3;
  //     }
  //     if (!this.shareService.isObjectEmpty(this.selectedFlightData.data4)) {
  //       sum += parseFloat(this.selectedFlightData.data4.clientFareTotal);
  //       this.price = 4;
  //     }
  //     ret = sum;
  //     if (this.trip.length > 0) {
  //       let priceValue = sum / this.price;
  //       ret = sum + priceValue;
  //     }
  //     if (this.trip.length > 1) {
  //       let priceValue = sum / this.price;
  //       ret = sum + priceValue + priceValue;
  //     }
  //     if (this.trip.length > 2) {
  //       let priceValue = sum / this.price;
  //       ret = sum + priceValue + priceValue + priceValue;
  //     }
  //     if (this.clientTotal > ret) {
  //       ret = this.clientTotal
  //     }
  //     if (this.clientTotal < ret) {
  //       let fare = this.shareService.amountShowWithCommas(this.clientTotal);
  //     }
  //   } catch (exp) { }
  //   return ret;
  // }
  showFlightDetailsMobile(ind: any, way: number) {
    try {
      switch (way) {
        case 0:
          var data = this.domOneWayData1.find(x => x.id == ind);
          this.flightDetailsModalData1.push({
            flightData: [],
            fromFlight: data.departureCityCode,
            toFlight: data.arrivalCityCode,
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
          this.flightDetailsModalData1[0].flightData.push(data.flightSegmentData);
          break;
        case 1:
          var data = this.domOneWayData2.find(x => x.id == ind);
          this.flightDetailsModalData2.push({
            flightData: [],
            fromFlight: data.departureCityCode,
            toFlight: data.arrivalCityCode,
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
          this.flightDetailsModalData2[0].flightData.push(data.flightSegmentData);
          break;
        case 2:
          var data = this.domOneWayData3.find(x => x.id == ind);
          this.flightDetailsModalData3.push({
            flightData: [],
            fromFlight: data.departureCityCode,
            toFlight: data.arrivalCityCode,
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
          this.flightDetailsModalData3[0].flightData.push(data.flightSegmentData);
          break;
        case 3:
          var data = this.domOneWayData4.find(x => x.id == ind);
          this.flightDetailsModalData4.push({
            flightData: [],
            fromFlight: data.departureCityCode,
            toFlight: data.arrivalCityCode,
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
          this.flightDetailsModalData4[0].flightData.push(data.flightSegmentData);
          break;
      }
      $('#flightDetailsModal' + way).modal('show');
    } catch (exp) {

    }
  }
  // showMakeProposal()
  // {
  //   try{
  //     let data:any[]=[];
  //     let data1=this.selectedFlightData.data1;
  //     let data2=this.selectedFlightData.data2;
  //     let data3=this.selectedFlightData.data3;
  //     let data4=this.selectedFlightData.data4;
  //     if(!this.shareService.isObjectEmpty(data1))
  //       data.push(data1);
  //     if(!this.shareService.isObjectEmpty(data2))
  //       data.push(data2);
  //     if(!this.shareService.isObjectEmpty(data3))
  //       data.push(data3);
  //     if(!this.shareService.isObjectEmpty(data4))
  //       data.push(data4);

  //     this.makeProposalData={
  //       firstLegData:data,
  //       tripTypeId:this.flightHelper.getTripTypeId(3),
  //       domestic:true
  //     };
  //     $("#dBaseDefault").text("0");
  //     $("#dTaxDefault").text("0");
  //     $("#dTotalDefault").text("0");
  //     $("#dAgentDefault").text("0");
  //     $("#mBaseDefault").text("0");
  //     $("#mTaxDefault").text("0");
  //     $("#mTotalDefault").text("0");
  //     $("#mAgentDefault").text("0");
  //     $("#profitAmount").val("");
  //     $("#discountAmount").val("");
  //     $("#proposalModal").modal('show');
  //   }catch(exp){}
  // }
  setDepartureTimeFilter(type: string, a_p: any, itiId: number, leg: number, ind: number) {
    try {
      switch (ind) {
        case 0:
          if (a_p.toString().indexOf('AM') > -1) {
            let before6 = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'AM', itiId, leg, this.scheduleDescs1, this.itineraries1);
            let am6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'AM', itiId, leg, this.scheduleDescs1, this.itineraries1);
            if (this.departureTimeFilter1.find(x => x.title == "Before 06AM") == undefined && before6 != 0 && before6 != undefined) {
              this.departureTimeFilter1.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
              if (this.popularFilter1.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
                this.popularFilter1.push({ id: "12AM-06AM", title: "Morning Departure", value: "Before 06AM", len: "", details: "12:00 AM-05:59 AM", price: before6, origin: "departure" });
              }
            }
            if (this.departureTimeFilter1.find(x => x.title == "06AM - 12PM") == undefined && am6 != undefined && am6 != 0) {
              this.departureTimeFilter1.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
            }
          }
          if (a_p.toString().indexOf('PM') > -1) {
            let after12pm = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'PM', itiId, leg, this.scheduleDescs1, this.itineraries1);
            let after6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'PM', itiId, leg, this.scheduleDescs1, this.itineraries1);
            if (this.departureTimeFilter1.find(x => x.title == "12PM - 06PM") == undefined && after12pm != undefined && after12pm != 0) {
              this.departureTimeFilter1.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
            }
            if (this.departureTimeFilter1.find(x => x.title == "After 06PM") == undefined && after6 != undefined && after6 != 0) {
              this.departureTimeFilter1.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
              if (this.popularFilter1.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
                this.popularFilter1.push({ id: "06PM-12AM", title: "Late Departure", value: "After 06PM", len: "", details: "06:00 PM-11:59 PM", price: after6, origin: "departure" });
              }
            }
          }
          break;
        case 1:
          if (a_p.toString().indexOf('AM') > -1) {
            let before6 = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'AM', itiId, leg, this.scheduleDescs2, this.itineraries2);
            let am6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'AM', itiId, leg, this.scheduleDescs2, this.itineraries2);
            if (this.departureTimeFilter2.find(x => x.title == "Before 06AM") == undefined && before6 != 0 && before6 != undefined) {
              this.departureTimeFilter2.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
              if (this.popularFilter2.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
                this.popularFilter2.push({ id: "12AM-06AM", title: "Morning Departure", value: "Before 06AM", len: "", details: "12:00 AM-05:59 AM", price: before6, origin: "departure" });
              }
            }
            if (this.departureTimeFilter2.find(x => x.title == "06AM - 12PM") == undefined && am6 != undefined && am6 != 0) {
              this.departureTimeFilter2.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
            }
          }
          if (a_p.toString().indexOf('PM') > -1) {
            let after12pm = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'PM', itiId, leg, this.scheduleDescs2, this.itineraries2);
            let after6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'PM', itiId, leg, this.scheduleDescs2, this.itineraries2);
            if (this.departureTimeFilter2.find(x => x.title == "12PM - 06PM") == undefined && after12pm != undefined && after12pm != 0) {
              this.departureTimeFilter2.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
            }
            if (this.departureTimeFilter2.find(x => x.title == "After 06PM") == undefined && after6 != undefined && after6 != 0) {
              this.departureTimeFilter2.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
              if (this.popularFilter2.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
                this.popularFilter2.push({ id: "06PM-12AM", title: "Late Departure", value: "After 06PM", len: "", details: "06:00 PM-11:59 PM", price: after6, origin: "departure" });
              }
            }
          }
          break;
        case 2:
          if (a_p.toString().indexOf('AM') > -1) {
            let before6 = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'AM', itiId, leg, this.scheduleDescs3, this.itineraries3);
            let am6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'AM', itiId, leg, this.scheduleDescs3, this.itineraries3);
            if (this.departureTimeFilter3.find(x => x.title == "Before 06AM") == undefined && before6 != 0 && before6 != undefined) {
              this.departureTimeFilter3.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
              if (this.popularFilter3.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
                this.popularFilter3.push({ id: "12AM-06AM", title: "Morning Departure", value: "Before 06AM", len: "", details: "12:00 AM-05:59 AM", price: before6, origin: "departure" });
              }
            }
            if (this.departureTimeFilter3.find(x => x.title == "06AM - 12PM") == undefined && am6 != undefined && am6 != 0) {
              this.departureTimeFilter3.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
            }
          }
          if (a_p.toString().indexOf('PM') > -1) {
            let after12pm = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'PM', itiId, leg, this.scheduleDescs3, this.itineraries3);
            let after6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'PM', itiId, leg, this.scheduleDescs3, this.itineraries3);
            if (this.departureTimeFilter3.find(x => x.title == "12PM - 06PM") == undefined && after12pm != undefined && after12pm != 0) {
              this.departureTimeFilter3.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
            }
            if (this.departureTimeFilter3.find(x => x.title == "After 06PM") == undefined && after6 != undefined && after6 != 0) {
              this.departureTimeFilter3.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
              if (this.popularFilter3.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
                this.popularFilter3.push({ id: "06PM-12AM", title: "Late Departure", value: "After 06PM", len: "", details: "06:00 PM-11:59 PM", price: after6, origin: "departure" });
              }
            }
          }
          break;
        case 3:
          if (a_p.toString().indexOf('AM') > -1) {
            let before6 = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'AM', itiId, leg, this.scheduleDescs4, this.itineraries4);
            let am6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'AM', itiId, leg, this.scheduleDescs4, this.itineraries4);
            if (this.departureTimeFilter4.find(x => x.title == "Before 06AM") == undefined && before6 != 0 && before6 != undefined) {
              this.departureTimeFilter4.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
              if (this.popularFilter4.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
                this.popularFilter4.push({ id: "12AM-06AM", title: "Morning Departure", value: "Before 06AM", len: "", details: "12:00 AM-05:59 AM", price: before6, origin: "departure" });
              }
            }
            if (this.departureTimeFilter4.find(x => x.title == "06AM - 12PM") == undefined && am6 != undefined && am6 != 0) {
              this.departureTimeFilter4.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
            }
          }
          if (a_p.toString().indexOf('PM') > -1) {
            let after12pm = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'PM', itiId, leg, this.scheduleDescs4, this.itineraries4);
            let after6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'PM', itiId, leg, this.scheduleDescs4, this.itineraries4);
            if (this.departureTimeFilter4.find(x => x.title == "12PM - 06PM") == undefined && after12pm != undefined && after12pm != 0) {
              this.departureTimeFilter4.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
            }
            if (this.departureTimeFilter4.find(x => x.title == "After 06PM") == undefined && after6 != undefined && after6 != 0) {
              this.departureTimeFilter4.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
              if (this.popularFilter4.findIndex(x => x.id.indexOf("12AM-06AM") > -1) < 0) {
                this.popularFilter4.push({ id: "06PM-12AM", title: "Late Departure", value: "After 06PM", len: "", details: "06:00 PM-11:59 PM", price: after6, origin: "departure" });
              }
            }
          }
          break;
      }
    } catch (exp) { }
  }
  setArrivalTimeFilter(type: string, a_p: any, itiId: number, leg: number, ind: number) {
    try {
      switch (ind) {
        case 0:
          if (a_p.toString().indexOf('AM') > -1) {
            let before6 = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'AM', itiId, leg, this.scheduleDescs1, this.itineraries1);
            let am6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'AM', itiId, leg, this.scheduleDescs1, this.itineraries1);
            if (this.arrivalTimeFilter1.find(x => x.title == "Before 06AM") == undefined && before6 != 0 && before6 != undefined) {
              this.arrivalTimeFilter1.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
            }
            if (this.arrivalTimeFilter1.find(x => x.title == "06AM - 12PM") == undefined && am6 != undefined && am6 != 0) {
              this.arrivalTimeFilter1.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
            }
          }
          if (a_p.toString().indexOf('PM') > -1) {
            let after12pm = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'PM', itiId, leg, this.scheduleDescs1, this.itineraries1);
            let after6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'PM', itiId, leg, this.scheduleDescs1, this.itineraries1);
            if (this.arrivalTimeFilter1.find(x => x.title == "12PM - 06PM") == undefined && after12pm != undefined && after12pm != 0) {
              this.arrivalTimeFilter1.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
            }
            if (this.arrivalTimeFilter1.find(x => x.title == "After 06PM") == undefined && after6 != undefined && after6 != 0) {
              this.arrivalTimeFilter1.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
            }
          }
          break;
        case 1:
          if (a_p.toString().indexOf('AM') > -1) {
            let before6 = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'AM', itiId, leg, this.scheduleDescs2, this.itineraries2);
            let am6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'AM', itiId, leg, this.scheduleDescs2, this.itineraries2);
            if (this.arrivalTimeFilter2.find(x => x.title == "Before 06AM") == undefined && before6 != 0 && before6 != undefined) {
              this.arrivalTimeFilter2.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
            }
            if (this.arrivalTimeFilter2.find(x => x.title == "06AM - 12PM") == undefined && am6 != undefined && am6 != 0) {
              this.arrivalTimeFilter2.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
            }
          }
          if (a_p.toString().indexOf('PM') > -1) {
            let after12pm = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'PM', itiId, leg, this.scheduleDescs2, this.itineraries2);
            let after6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'PM', itiId, leg, this.scheduleDescs2, this.itineraries2);
            if (this.arrivalTimeFilter2.find(x => x.title == "12PM - 06PM") == undefined && after12pm != undefined && after12pm != 0) {
              this.arrivalTimeFilter2.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
            }
            if (this.arrivalTimeFilter2.find(x => x.title == "After 06PM") == undefined && after6 != undefined && after6 != 0) {
              this.arrivalTimeFilter2.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
            }
          }
          break;
        case 2:
          if (a_p.toString().indexOf('AM') > -1) {
            let before6 = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'AM', itiId, leg, this.scheduleDescs3, this.itineraries3);
            let am6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'AM', itiId, leg, this.scheduleDescs3, this.itineraries3);
            if (this.arrivalTimeFilter3.find(x => x.title == "Before 06AM") == undefined && before6 != 0 && before6 != undefined) {
              this.arrivalTimeFilter3.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
            }
            if (this.arrivalTimeFilter3.find(x => x.title == "06AM - 12PM") == undefined && am6 != undefined && am6 != 0) {
              this.arrivalTimeFilter3.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
            }
          }
          if (a_p.toString().indexOf('PM') > -1) {
            let after12pm = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'PM', itiId, leg, this.scheduleDescs3, this.itineraries3);
            let after6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'PM', itiId, leg, this.scheduleDescs3, this.itineraries3);
            if (this.arrivalTimeFilter3.find(x => x.title == "12PM - 06PM") == undefined && after12pm != undefined && after12pm != 0) {
              this.arrivalTimeFilter3.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
            }
            if (this.arrivalTimeFilter3.find(x => x.title == "After 06PM") == undefined && after6 != undefined && after6 != 0) {
              this.arrivalTimeFilter3.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
            }
          }
          break;
        case 3:
          if (a_p.toString().indexOf('AM') > -1) {
            let before6 = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'AM', itiId, leg, this.scheduleDescs4, this.itineraries4);
            let am6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'AM', itiId, leg, this.scheduleDescs4, this.itineraries4);
            if (this.arrivalTimeFilter4.find(x => x.title == "Before 06AM") == undefined && before6 != 0 && before6 != undefined) {
              this.arrivalTimeFilter4.push({ title: "Before 06AM", details: "12:00 AM-05:59 AM", value: "12AM-06AM", price: before6, logo: '../../../assets/dist/img/sun.svg' });
            }
            if (this.arrivalTimeFilter4.find(x => x.title == "06AM - 12PM") == undefined && am6 != undefined && am6 != 0) {
              this.arrivalTimeFilter4.push({ title: "06AM - 12PM", details: "06:00 AM-11:59 AM", value: "06AM-12PM", price: am6, logo: '../../../assets/dist/img/sun.svg' });
            }
          }
          if (a_p.toString().indexOf('PM') > -1) {
            let after12pm = this.flightHelper.getMinimumPriceForTime(type, 1, 6, 'PM', itiId, leg, this.scheduleDescs4, this.itineraries4);
            let after6 = this.flightHelper.getMinimumPriceForTime(type, 6, 12, 'PM', itiId, leg, this.scheduleDescs4, this.itineraries4);
            if (this.arrivalTimeFilter4.find(x => x.title == "12PM - 06PM") == undefined && after12pm != undefined && after12pm != 0) {
              this.arrivalTimeFilter4.push({ title: "12PM - 06PM", details: "12:00 PM-05:59 PM", value: "12PM-06PM", price: after12pm, logo: '../../../assets/dist/img/sun-fog.svg' });
            }
            if (this.arrivalTimeFilter4.find(x => x.title == "After 06PM") == undefined && after6 != undefined && after6 != 0) {
              this.arrivalTimeFilter4.push({ title: "After 06PM", details: "06:00 PM-11:59 PM", value: "06PM-12AM", price: after6, logo: '../../../assets/dist/img/moon.svg' });
            }
          }
          break;
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
  setTimeFilter(type: string, ind: number) {
    try {
      switch (ind) {
        case 0:
          for (let item of this.itineraries1) {
            let time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs1).departure.time;
            if (type == 'arrival') {
              time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs1).arrival.time;
            }
            let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
            if (type == 'arrival') {
              this.setArrivalTimeFilter(type, a_p, item.id, item.legs[0].ref - 1, ind);
            } else {
              this.setDepartureTimeFilter(type, a_p, item.id, item.legs[0].ref - 1, ind);
            }
          }
          break;
        case 1:
          for (let item of this.itineraries2) {
            let time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs2).departure.time;
            if (type == 'arrival') {
              time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs2).arrival.time;
            }
            let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
            if (type == 'arrival') {
              this.setArrivalTimeFilter(type, a_p, item.id, item.legs[0].ref - 1, ind);
            } else {
              this.setDepartureTimeFilter(type, a_p, item.id, item.legs[0].ref - 1, ind);
            }
          }
          break;
        case 2:
          for (let item of this.itineraries3) {
            let time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs3).departure.time;
            if (type == 'arrival') {
              time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs3).arrival.time;
            }
            let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
            if (type == 'arrival') {
              this.setArrivalTimeFilter(type, a_p, item.id, item.legs[0].ref - 1, ind);
            } else {
              this.setDepartureTimeFilter(type, a_p, item.id, item.legs[0].ref - 1, ind);
            }
          }
          break;
        case 3:
          for (let item of this.itineraries4) {
            let time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs4).departure.time;
            if (type == 'arrival') {
              time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs4).arrival.time;
            }
            let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
            if (type == 'arrival') {
              this.setArrivalTimeFilter(type, a_p, item.id, item.legs[0].ref - 1, ind);
            } else {
              this.setDepartureTimeFilter(type, a_p, item.id, item.legs[0].ref - 1, ind);
            }
          }
          break;
      }
    } catch (exp) { }
  }
  setStopCount(ind: number) {
    let stopList: any[] = [];
    try {
      switch (ind) {
        case 0:
          this.stopCountList1 = [];
          for (let rootItem of this.domOneWayData1) {
            let price = rootItem.clientFareTotal;
            let len = rootItem.flightSegmentData.length;
            stopList.push({ id: len, price: price });
          }
          let stopGroup = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
          for (let item of stopGroup) {
            let min = item.value[0].price;
            let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
            this.stopCountList1.push({
              id: item.key, stopCount: item.value.length, title: title,
              price: 0
            });
            for (let subItem of item.value) {
              if (min > subItem.price) {
                min = subItem.price;
              }
            }
            this.stopCountList1.find(x => x.id == item.key).price = min;
            if (item.key == 2) {
              if (this.popularFilter1.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
                this.popularFilter1.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
              }
            }
          }
          let minPriceRef = this.flightHelper.getMinimumPricePopularFilterRefundable(true, this.domOneWayData1);
          let countRef = this.flightHelper.getTotalPopularFilterRefundable(true, this.domOneWayData1);
          if (this.popularFilter1.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
            this.popularFilter1.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef + ")", price: minPriceRef, origin: "refundable" });
          }
          break;
        case 1:
          this.stopCountList2 = [];
          for (let rootItem of this.domOneWayData2) {
            let price = rootItem.clientFareTotal;
            let len = rootItem.flightSegmentData.length;
            stopList.push({ id: len, price: price });
          }
          let stopGroup2 = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
          for (let item of stopGroup2) {
            let min = item.value[0].price;
            let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
            this.stopCountList2.push({
              id: item.key, stopCount: item.value.length, title: title,
              price: 0
            });
            for (let subItem of item.value) {
              if (min > subItem.price) {
                min = subItem.price;
              }
            }
            this.stopCountList2.find(x => x.id == item.key).price = min;
            if (item.key == 2) {
              if (this.popularFilter2.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
                this.popularFilter2.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
              }
            }
          }
          let minPriceRef2 = this.flightHelper.getMinimumPricePopularFilterRefundable(true, this.domOneWayData2);
          let countRef2 = this.flightHelper.getTotalPopularFilterRefundable(true, this.domOneWayData2);
          if (this.popularFilter2.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
            this.popularFilter2.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef2 + ")", price: minPriceRef2, origin: "refundable" });
          }
          break;
        case 2:
          this.stopCountList3 = [];
          for (let rootItem of this.domOneWayData3) {
            let price = rootItem.clientFareTotal;
            let len = rootItem.flightSegmentData.length;
            stopList.push({ id: len, price: price });
          }
          let stopGroup3 = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
          for (let item of stopGroup3) {
            let min = item.value[0].price;
            let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
            this.stopCountList3.push({
              id: item.key, stopCount: item.value.length, title: title,
              price: 0
            });
            for (let subItem of item.value) {
              if (min > subItem.price) {
                min = subItem.price;
              }
            }
            this.stopCountList3.find(x => x.id == item.key).price = min;
            if (item.key == 2) {
              if (this.popularFilter3.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
                this.popularFilter3.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
              }
            }
          }
          let minPriceRef3 = this.flightHelper.getMinimumPricePopularFilterRefundable(true, this.domOneWayData3);
          let countRef3 = this.flightHelper.getTotalPopularFilterRefundable(true, this.domOneWayData3);
          if (this.popularFilter3.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
            this.popularFilter3.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef3 + ")", price: minPriceRef3, origin: "refundable" });
          }
          break;
        case 3:
          this.stopCountList4 = [];
          for (let rootItem of this.domOneWayData4) {
            let price = rootItem.clientFareTotal;
            let len = rootItem.flightSegmentData.length;
            stopList.push({ id: len, price: price });
          }
          let stopGroup4 = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
          for (let item of stopGroup4) {
            let min = item.value[0].price;
            let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
            this.stopCountList4.push({
              id: item.key, stopCount: item.value.length, title: title,
              price: 0
            });
            for (let subItem of item.value) {
              if (min > subItem.price) {
                min = subItem.price;
              }
            }
            this.stopCountList4.find(x => x.id == item.key).price = min;
            if (item.key == 2) {
              if (this.popularFilter4.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
                this.popularFilter4.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
              }
            }
          }
          let minPriceRef4 = this.flightHelper.getMinimumPricePopularFilterRefundable(true, this.domOneWayData4);
          let countRef4 = this.flightHelper.getTotalPopularFilterRefundable(true, this.domOneWayData4);
          if (this.popularFilter4.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
            this.popularFilter4.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef4 + ")", price: minPriceRef4, origin: "refundable" });
          }
          break;
      }
      this.setTimeFilter('departure', ind);
      this.setTimeFilter('arrival', ind);
    } catch (exp) { }
  }
  private setAirport(ind: number) {
    this.topFlightSearchSkeleton = true;
    setTimeout(() => {
      let depAirport: string[] = [], arrAirport: string[] = [];
      switch (ind) {
        case 0:
          this.airports1 = { departure: [], arrival: [] };
          this.cmbAirport = this.flightHelper.getAirportData();
          for (let j = 0; j < this.scheduleDescs1.length; j++) {
            if (!depAirport.includes(this.scheduleDescs1[j].departure.airport)) {
              depAirport.push(this.scheduleDescs1[j].departure.airport);
            }
            if (!arrAirport.includes(this.scheduleDescs1[j].arrival.airport)) {
              arrAirport.push(this.scheduleDescs1[j].arrival.airport);
            }
          }
          for (let i = 0; i < this.cmbAirport.length; i++) {
            if (depAirport.includes(this.cmbAirport[i].code)) {
              this.airports1.departure.unshift({
                depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
                depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
              });
            }
          }
          for (let i = 0; i < this.cmbAirport.length; i++) {
            if (arrAirport.includes(this.cmbAirport[i].code)) {
              this.airports1.arrival.unshift({
                arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
                arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
              });
            }
          }
          break;
        case 1:
          this.airports2 = { departure: [], arrival: [] };
          this.cmbAirport = this.flightHelper.getAirportData();
          for (let j = 0; j < this.scheduleDescs2.length; j++) {
            if (!depAirport.includes(this.scheduleDescs2[j].departure.airport)) {
              depAirport.push(this.scheduleDescs2[j].departure.airport);
            }
            if (!arrAirport.includes(this.scheduleDescs2[j].arrival.airport)) {
              arrAirport.push(this.scheduleDescs2[j].arrival.airport);
            }
          }
          for (let i = 0; i < this.cmbAirport.length; i++) {
            if (depAirport.includes(this.cmbAirport[i].code)) {
              this.airports2.departure.unshift({
                depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
                depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
              });
            }
          }
          for (let i = 0; i < this.cmbAirport.length; i++) {
            if (arrAirport.includes(this.cmbAirport[i].code)) {
              this.airports2.arrival.unshift({
                arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
                arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
              });
            }
          }
          break;
        case 2:
          this.airports3 = { departure: [], arrival: [] };
          this.cmbAirport = this.flightHelper.getAirportData();
          for (let j = 0; j < this.scheduleDescs3.length; j++) {
            if (!depAirport.includes(this.scheduleDescs3[j].departure.airport)) {
              depAirport.push(this.scheduleDescs3[j].departure.airport);
            }
            if (!arrAirport.includes(this.scheduleDescs3[j].arrival.airport)) {
              arrAirport.push(this.scheduleDescs3[j].arrival.airport);
            }
          }
          for (let i = 0; i < this.cmbAirport.length; i++) {
            if (depAirport.includes(this.cmbAirport[i].code)) {
              this.airports3.departure.unshift({
                depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
                depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
              });
            }
          }
          for (let i = 0; i < this.cmbAirport.length; i++) {
            if (arrAirport.includes(this.cmbAirport[i].code)) {
              this.airports3.arrival.unshift({
                arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
                arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
              });
            }
          }
          break;
        case 3:
          this.airports4 = { departure: [], arrival: [] };
          this.cmbAirport = this.flightHelper.getAirportData();
          for (let j = 0; j < this.scheduleDescs4.length; j++) {
            if (!depAirport.includes(this.scheduleDescs4[j].departure.airport)) {
              depAirport.push(this.scheduleDescs4[j].departure.airport);
            }
            if (!arrAirport.includes(this.scheduleDescs4[j].arrival.airport)) {
              arrAirport.push(this.scheduleDescs4[j].arrival.airport);
            }
          }
          for (let i = 0; i < this.cmbAirport.length; i++) {
            if (depAirport.includes(this.cmbAirport[i].code)) {
              this.airports4.departure.unshift({
                depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
                depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
              });
            }
          }
          for (let i = 0; i < this.cmbAirport.length; i++) {
            if (arrAirport.includes(this.cmbAirport[i].code)) {
              this.airports4.arrival.unshift({
                arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
                arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
              });
            }
          }
          break;
      }
      this.topFlightSearchSkeleton = false;
      this.setFlightData(ind);
    }, 500);
  }
  setAirlineList() {
    this.authService.getAirlineInfo().subscribe(data => {
      this.airlines1 = [];
      this.airlines2 = [];
      this.airlines3 = [];
      this.airlines4 = [];
      var d = data.airlinelist;
      let flight: any[] = [];
      if (!this.shareService.isObjectEmpty(this.scheduleDescs1)) {
        let searchedAirline = this.scheduleDescs1;
        for (let j = 0; j < searchedAirline.length; j++) {
          let disclosure = searchedAirline[j].carrier.disclosure;
          if (disclosure != undefined && disclosure != "") {
            flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
          }
          flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
        }
        for (let i = 0; i < d.length; i++) {
          var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
          if (obj != "" && obj != undefined) {
            this.airlines1.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
          }
        }
        for (let i = 0; i < searchedAirline.length; i++) {
          for (let j = 0; j < this.airlines1.length; j++) {
            let disclosure = searchedAirline[i].carrier.disclosure;
            if (disclosure != undefined && disclosure != "") {
              if (this.airlines1[j].code == disclosure) {
                this.airlines1[j].data.unshift(searchedAirline[i]);
                break;
              }
            } else {
              if (this.airlines1[j].code == searchedAirline[i].carrier.marketing) {
                this.airlines1[j].data.unshift(searchedAirline[i]);
                break;
              }
            }
          }
        }
        this.setAirport(0);
        this.setItineryWiseAirlineInfo(d, 0);
      }
      if (!this.shareService.isObjectEmpty(this.scheduleDescs2)) {
        let searchedAirline = this.scheduleDescs2;
        for (let j = 0; j < searchedAirline.length; j++) {
          let disclosure = searchedAirline[j].carrier.disclosure;
          if (disclosure != undefined && disclosure != "") {
            flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
          }
          flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
        }
        for (let i = 0; i < d.length; i++) {
          var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
          if (obj != "" && obj != undefined) {
            this.airlines2.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
          }
        }
        for (let i = 0; i < searchedAirline.length; i++) {
          for (let j = 0; j < this.airlines2.length; j++) {
            let disclosure = searchedAirline[i].carrier.disclosure;
            if (disclosure != undefined && disclosure != "") {
              if (this.airlines2[j].code == disclosure) {
                this.airlines2[j].data.unshift(searchedAirline[i]);
                break;
              }
            } else {
              if (this.airlines2[j].code == searchedAirline[i].carrier.marketing) {
                this.airlines2[j].data.unshift(searchedAirline[i]);
                break;
              }
            }
          }
        }
        this.setAirport(1);
        this.setItineryWiseAirlineInfo(d, 1);
      }
      if (!this.shareService.isObjectEmpty(this.scheduleDescs3)) {
        let searchedAirline = this.scheduleDescs3;
        for (let j = 0; j < searchedAirline.length; j++) {
          let disclosure = searchedAirline[j].carrier.disclosure;
          if (disclosure != undefined && disclosure != "") {
            flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
          }
          flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
        }
        for (let i = 0; i < d.length; i++) {
          var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
          if (obj != "" && obj != undefined) {
            this.airlines3.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
          }
        }
        for (let i = 0; i < searchedAirline.length; i++) {
          for (let j = 0; j < this.airlines3.length; j++) {
            let disclosure = searchedAirline[i].carrier.disclosure;
            if (disclosure != undefined && disclosure != "") {
              if (this.airlines3[j].code == disclosure) {
                this.airlines3[j].data.unshift(searchedAirline[i]);
                break;
              }
            } else {
              if (this.airlines3[j].code == searchedAirline[i].carrier.marketing) {
                this.airlines3[j].data.unshift(searchedAirline[i]);
                break;
              }
            }
          }
        }
        this.setAirport(2);
        this.setItineryWiseAirlineInfo(d, 2);
      }
      if (!this.shareService.isObjectEmpty(this.scheduleDescs4)) {
        let searchedAirline = this.scheduleDescs4;
        for (let j = 0; j < searchedAirline.length; j++) {
          let disclosure = searchedAirline[j].carrier.disclosure;
          if (disclosure != undefined && disclosure != "") {
            flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
          }
          flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
        }
        for (let i = 0; i < d.length; i++) {
          var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
          if (obj != "" && obj != undefined) {
            this.airlines4.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
          }
        }
        for (let i = 0; i < searchedAirline.length; i++) {
          for (let j = 0; j < this.airlines4.length; j++) {
            let disclosure = searchedAirline[i].carrier.disclosure;
            if (disclosure != undefined && disclosure != "") {
              if (this.airlines4[j].code == disclosure) {
                this.airlines4[j].data.unshift(searchedAirline[i]);
                break;
              }
            } else {
              if (this.airlines4[j].code == searchedAirline[i].carrier.marketing) {
                this.airlines4[j].data.unshift(searchedAirline[i]);
                break;
              }
            }
          }
        }
        this.setAirport(3);
        this.setItineryWiseAirlineInfo(d, 3);
      }
    }, err => {
      console.log(JSON.stringify(err));
    });
  }
  setItineryWiseAirlineInfo(data: any, ind: number) {
    switch (ind) {
      case 0:
        for (let i = 0; i < this.itineraries1.length; i++) {
          for (let j = 0; j < this.airlines1.length; j++) {
            let marketing = this.itineraries1[i].pricingInformation[0].fare.validatingCarrierCode;
            if (this.flightHelper.getCurrentFlightCode(this.airlines1[j].code, this.scheduleDescs1) == marketing) {
              this.airlines1[j].itineryData.unshift(this.itineraries1[i].pricingInformation[0].fare);
              break;
            }
          }
        }
        for (let i = 0; i < this.airlines1.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (this.airlines1[i].code.toString().toLowerCase().trim()
              == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
              this.airlines1[i].logo = data[j].vLogo;
              break;
            }
          }
        }
        break;
      case 1:
        for (let i = 0; i < this.itineraries2.length; i++) {
          for (let j = 0; j < this.airlines2.length; j++) {
            let marketing = this.itineraries2[i].pricingInformation[0].fare.validatingCarrierCode;
            if (this.flightHelper.getCurrentFlightCode(this.airlines2[j].code, this.scheduleDescs2) == marketing) {
              this.airlines2[j].itineryData.unshift(this.itineraries2[i].pricingInformation[0].fare);
              break;
            }
          }
        }
        for (let i = 0; i < this.airlines2.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (this.airlines2[i].code.toString().toLowerCase().trim()
              == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
              this.airlines2[i].logo = data[j].vLogo;
              break;
            }
          }
        }
        break;
      case 2:
        for (let i = 0; i < this.itineraries3.length; i++) {
          for (let j = 0; j < this.airlines3.length; j++) {
            let marketing = this.itineraries3[i].pricingInformation[0].fare.validatingCarrierCode;
            if (this.flightHelper.getCurrentFlightCode(this.airlines3[j].code, this.scheduleDescs3) == marketing) {
              this.airlines3[j].itineryData.unshift(this.itineraries3[i].pricingInformation[0].fare);
              break;
            }
          }
        }
        for (let i = 0; i < this.airlines3.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (this.airlines3[i].code.toString().toLowerCase().trim()
              == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
              this.airlines3[i].logo = data[j].vLogo;
              break;
            }
          }
        }
        break;
      case 3:
        for (let i = 0; i < this.itineraries4.length; i++) {
          for (let j = 0; j < this.airlines4.length; j++) {
            let marketing = this.itineraries4[i].pricingInformation[0].fare.validatingCarrierCode;
            if (this.flightHelper.getCurrentFlightCode(this.airlines4[j].code, this.scheduleDescs4) == marketing) {
              this.airlines4[j].itineryData.unshift(this.itineraries4[i].pricingInformation[0].fare);
              break;
            }
          }
        }
        for (let i = 0; i < this.airlines4.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (this.airlines4[i].code.toString().toLowerCase().trim()
              == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
              this.airlines4[i].logo = data[j].vLogo;
              break;
            }
          }
        }
        break;
    }
  }
  private _setLoaderValue(obj: any) {
    try {
      this.fromFlight = obj.fromFlightName;
      this.toFlight = obj.toFlightName;
      this.departureDate = obj.departureDate;
      this.returnDate = obj.departureDate;
      this.adult = obj.adult != undefined ? obj.adult : "0";
      this.child = obj.childList.length;
      this.infant = obj.infant != undefined ? obj.infant : "0";
      this.childListFinal = obj.childList;
      this.isLoad = true;
      this.cabinTypeId = this.flightHelper.getCabinTypeId(obj.classType),
        this.tripTypeId = this.flightHelper.getTripTypeId(3);
      if (obj.childList.length == 0) {
        this.childListFinal = [];
        this.childList = [];
        this.childList2 = [];
        this.child = "0";
      }
    } catch (exp) { }
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
  private setDeparturePanel(date: any) {
    this.selectedDeparturePanelText =
      this.shareService.getDayNameShort(date) + ", " +
      this.shareService.getDay(date) + " " +
      this.shareService.getMonthShort(date) + "'" +
      this.shareService.getYearShort(date);
  }
  private setReturnPanel(date: any) {
    this.selectedReturnPanelText =
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
  dateChangeApi(type: boolean = true, item: any) {
    this.isCancellationShow = true;
    try {
      let dateCancel: DateChangeCancelModel = {
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
    } catch (exp) {
      console.log(exp);
    }
  }
  dateChangeApiMulti(type: boolean = true) {
    this.isCancellationShow1 = true;
    this.isCancellationShow2 = true;
    this.isCancellationShow3 = true;
    this.isCancellationShow4 = true;
    // console.log("Date changes action::");
    try {
      // console.log("select flight data::");
      // console.log(this.selectedFlightDeparture.length);
      // console.log(this.selectedFlightData);
      let len = this.selectedFlightDeparture.length;
      if (len > 0) {
        // console.log(this.selectedFlightData);
        let dateCancel1: DateChangeCancelModel = {
          providerId: this.selectedFlightData.data1.providerId,
          departureDate: this.selectedFlightData.data1.departureDate,
          departureCityCode: this.selectedFlightData.data1.departureCityCode,
          arrivalCityCode: this.selectedFlightData.data1.arrivalCityCode,
          airlineCode: this.selectedFlightData.data1.airlineCode,
          fareBasisCode: this.selectedFlightData.data1.fareBasisCode,
          flightRouteTypeId: this.selectedFlightData.data1.flightRouteTypeId,
          tripTypeId: this.selectedFlightData.data1.tripTypeId
        };
        this.authService.getDateChanges(dateCancel1).subscribe(data => {

          // console.log(JSON.stringify(data));
          this.setResponseText(data.res, data.amount, dateCancel1.airlineCode, type);
          this.isCancellationShow1 = false;
        }, err => {

        });
      }
      if (len > 1) {
        let dateCancel2: DateChangeCancelModel = {
          providerId: this.selectedFlightData.data2.providerId,
          departureDate: this.selectedFlightData.data2.departureDate,
          departureCityCode: this.selectedFlightData.data2.departureCityCode,
          arrivalCityCode: this.selectedFlightData.data2.arrivalCityCode,
          airlineCode: this.selectedFlightData.data2.airlineCode,
          fareBasisCode: this.selectedFlightData.data2.fareBasisCode,
          flightRouteTypeId: this.selectedFlightData.data2.flightRouteTypeId,
          tripTypeId: this.selectedFlightData.data2.tripTypeId
        };
        this.authService.getDateChanges(dateCancel2).subscribe(data => {

          // console.log(JSON.stringify(data));
          this.setResponseText(data.res, data.amount, dateCancel2.airlineCode, type);
          this.isCancellationShow2 = false;
        }, err => {

        });
      }
      if (len > 2) {
        let dateCancel3: DateChangeCancelModel = {
          providerId: this.selectedFlightData.data3.providerId,
          departureDate: this.selectedFlightData.data3.departureDate,
          departureCityCode: this.selectedFlightData.data3.departureCityCode,
          arrivalCityCode: this.selectedFlightData.data3.arrivalCityCode,
          airlineCode: this.selectedFlightData.data3.airlineCode,
          fareBasisCode: this.selectedFlightData.data3.fareBasisCode,
          flightRouteTypeId: this.selectedFlightData.data3.flightRouteTypeId,
          tripTypeId: this.selectedFlightData.data3.tripTypeId
        };
        this.authService.getDateChanges(dateCancel3).subscribe(data => {

          // console.log(JSON.stringify(data));
          this.setResponseText(data.res, data.amount, dateCancel3.airlineCode, type);
          this.isCancellationShow3 = false;
        }, err => {

        });
      }
      if (len > 3) {
        let dateCancel4: DateChangeCancelModel = {
          providerId: this.selectedFlightData.data3.providerId,
          departureDate: this.selectedFlightData.data3.departureDate,
          departureCityCode: this.selectedFlightData.data3.departureCityCode,
          arrivalCityCode: this.selectedFlightData.data3.arrivalCityCode,
          airlineCode: this.selectedFlightData.data3.airlineCode,
          fareBasisCode: this.selectedFlightData.data3.fareBasisCode,
          flightRouteTypeId: this.selectedFlightData.data3.flightRouteTypeId,
          tripTypeId: this.selectedFlightData.data3.tripTypeId
        };
        this.authService.getDateChanges(dateCancel4).subscribe(data => {

          // console.log(JSON.stringify(data));
          this.setResponseText(data.res, data.amount, dateCancel4.airlineCode, type);
          this.isCancellationShow4 = false;
        }, err => {

        });
      }
    } catch (exp) {
      console.log(exp);
    }
  }
  setResponseText(data: any, amount: any, airlineCode: any, type: boolean, way: number = -1) {
    try {
      this.authService.getResponseSearchText(airlineCode, type == true ? "Date Change" : "Cancel").subscribe(subData => {
        // var d = console.log(data);
        var firstCap = "", secondCap = "";
        try {
          firstCap = subData.data[0].nvFirstSentence;
          secondCap = subData.data[0].nvLastSentence;
        } catch (exp) { }
        if (type == true) {
          this.setDateChangesAmount(data, amount, firstCap, secondCap, way);
        } else {
          this.setCancellationAmount(data, amount, firstCap, secondCap, way);
        }
      }, err => { });
    } catch (exp) {
      console.log(exp);
    }
  }
  setDateChangesAmount(data: any, amount: any, firstCap: any, lastCap: any, way: number = -1) {
    this.amtDateChanges = "";
    this.amtDateChangesPlus = this.shareService.amountShowWithCommas(Math.round(amount));
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
          amt = crop.split(' ')[1];
          pre = crop.split(' ')[0];
        }
      }
      this.amtDateChanges = amt;
      this.amtDateChangesPre = pre;
      switch (way) {
        case 0:
          this.amtDateChanges1 = amt;
          this.amtDateChangesPre1 = pre;
          break;
        case 1:
          this.amtDateChanges2 = amt;
          this.amtDateChangesPre2 = pre;
          break;
        case 2:
          this.amtDateChanges3 = amt;
          this.amtDateChangesPre3 = pre;
          break;
        case 3:
          this.amtDateChanges4 = amt;
          this.amtDateChangesPre4 = pre;
          break;
      }
    } catch (exp) {
      let fare = envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let txt = fare.toString().replace(/\s+/g, ' ').trim();
      let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
      this.amtDateChanges = crop.split(' ')[1];
      this.amtDateChangesPre = crop.split(' ')[0];
      switch (way) {
        case 0:
          this.amtDateChanges1 = crop.split(' ')[1];
          this.amtDateChangesPre1 = crop.split(' ')[0];
          break;
        case 1:
          this.amtDateChanges2 = crop.split(' ')[1];
          this.amtDateChangesPre2 = crop.split(' ')[0];
          break;
        case 2:
          this.amtDateChanges3 = crop.split(' ')[1];
          this.amtDateChangesPre3 = crop.split(' ')[0];
          break;
        case 3:
          this.amtDateChanges4 = crop.split(' ')[1];
          this.amtDateChangesPre4 = crop.split(' ')[0];
          break;
      }
    }
  }
  setCancellationAmount(data: any, amount: any, firstCap: any, lastCap: any, way: number = -1) {
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
      switch (way) {
        case 0:
          this.amtCancellation1 = amt;
          this.amtCancellationPre1 = pre;
          break;
        case 1:
          this.amtCancellation2 = amt;
          this.amtCancellationPre2 = pre;
          break;
        case 2:
          this.amtCancellation3 = amt;
          this.amtCancellationPre3 = pre;
          break;
        case 3:
          this.amtCancellation4 = amt;
          this.amtCancellationPre4 = pre;
          break;
      }
    } catch (exp) {
      let fare = envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let txt = fare.toString().replace(/\s+/g, ' ').trim();
      let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
      this.amtCancellation = crop.split(' ')[1];
      this.amtCancellationPre = crop.split(' ')[0];
      switch (way) {
        case 0:
          this.amtCancellation1 = crop.split(' ')[1];
          this.amtCancellationPre1 = crop.split(' ')[0];
          break;
        case 1:
          this.amtCancellation2 = crop.split(' ')[1];
          this.amtCancellationPre2 = crop.split(' ')[0];
          break;
        case 2:
          this.amtCancellation3 = crop.split(' ')[1];
          this.amtCancellationPre3 = crop.split(' ')[0];
          break;
        case 3:
          this.amtCancellation4 = crop.split(' ')[1];
          this.amtCancellationPre4 = crop.split(' ')[0];
          break;
      }
    }
  }
  getDateChanges(refund: boolean, passenger: any, way: number = -1): any {
    try {
      let dateChanges = this.amtDateChanges, dateChangesPlus = this.amtDateChangesPlus, dateChangesPre = this.amtDateChangesPre;
      switch (way) {
        case 0:
          dateChanges = this.amtDateChanges1;
          dateChangesPre = this.amtDateChangesPre1;
          break;
        case 1:
          dateChanges = this.amtDateChanges2;
          dateChangesPre = this.amtDateChangesPre2;
          break;
        case 2:
          dateChanges = this.amtDateChanges3;
          dateChangesPre = this.amtDateChangesPre3;
          break;
        case 3:
          dateChanges = this.amtDateChanges4;
          dateChangesPre = this.amtDateChangesPre4;
          break;
      }
      if (refund == false) {
        return "Non Refundable + " + dateChangesPlus + "";
      } else {
        if (dateChanges == "" || dateChanges == undefined) {
          return "Airline Fee " + " + " + dateChangesPlus + "";
        }
        return dateChangesPre + " " + this.shareService.amountShowWithCommas(Math.round(parseFloat(dateChanges) * parseInt(passenger))) + " + " + dateChangesPlus + "";
      }
    } catch (exp) { }
  }
  getCancellation(refund: boolean, passenger: any, way: number = -1): any {
    try {
      let dateChanges = this.amtCancellation, dateChangesPlus = this.amtCancellationPlus, dateChangesPre = this.amtCancellationPre;
      switch (way) {
        case 0:
          dateChanges = this.amtCancellation1;
          dateChangesPre = this.amtCancellationPre1;
          break;
        case 1:
          dateChanges = this.amtCancellation2;
          dateChangesPre = this.amtCancellationPre2;
          break;
        case 2:
          dateChanges = this.amtCancellation3;
          dateChangesPre = this.amtCancellationPre3;
          break;
        case 3:
          dateChanges = this.amtCancellation4;
          dateChangesPre = this.amtCancellationPre4;
          break;
      }
      if (refund == false) {
        return "Non Refundable + " + dateChangesPlus + "";
      } else {
        if (dateChanges == "" || dateChanges == undefined) {
          return "Airline Fee " + " + " + dateChangesPlus + "";
        }
        return dateChangesPre + " " + this.shareService.amountShowWithCommas(Math.round(parseFloat(dateChanges) * parseInt(passenger))) + " + " + dateChangesPlus + "";
      }
    } catch (exp) { }
  }
  bookHoldWork(startDate: any, endDate: any) {
    let i = 0;
    // this.firstLegData=[];
    // this.firstLegFareData=[];
    this.bookingConfirmation = this.flightHelper.getLocalFlightSearchDateChange();
    this._setPanelSearchHeader(this.bookingConfirmation);
    this.getFlightSearch(this.bookingConfirmation);
    if (this.bookingConfirmation != null || this.bookingConfirmation != undefined) {
      this.referenceNum = this.bookingConfirmation.referenceNo;
      this.reservation = this.bookingConfirmation.reservationPNR;
    }
    this.paramModelData = this.flightHelper.getLocalFlightSearch();
    this.getFlightSearch(this.paramModelData);
    if (this.paramModelData.BookingManualId != null || this.paramModelData.BookingManualId != undefined || this.paramModelData.ItineraryNumber != null || this.paramModelData.ItineraryNumber != undefined) {
      this.referenceNum = this.paramModelData.BookingManualId;
      this.reservation = this.paramModelData.ItineraryNumber;
    }
    this.user = localStorage.getItem('uid');
    // for (let i = 0; i < this.item.length; i++) {
    //   this.firstLegData.push(this.item[i]);
    //   this.firstLegFareData.push(this.item[i].fareData);
    // }
    this.fmgBookingSearch.patchValue({
      User: this.user,
      Cabincode: this.cabincode,
      ReferenceNum: this.referenceNum,
      Reservation: this.reservation,
      StartDate: startDate,
      EndDate: endDate
    });
    this.fmgMulticityFlight = this.fmgBookingSearch.get('MulticityFlight') as FormArray;
    this.fmgFlightSegment = this.fmgBookingSearch.get('DateChangeFlightSegment') as FormArray;
    this.fmgFareData = this.fmgBookingSearch.get('FareData') as FormArray;

    let Iserial = 1;
    let serial = 1;
    for (let item of this.firstLegData) {
      this.fmgMulticityFlight.push(this.fb.group({
        DepartureDateTime: item.departureDate + "T" + item.departureTime + ":00",
        ArrivalDateTime: this.flightHelper.getAdjustmentDate(item.departureDate, item.adjustment)
          .format('YYYY-MM-DD') + "T" + item.arrivalTime + ":00",
        DepartureCode: item.departureCityCode,
        ArrivalCode: item.arrivalCityCode,
        ProviderId: item.providerId,
        Airlinecode: item.airlineCode,
        AirCraftId: item.airCraftId,
        AgentFareTotal: item.agentFareTotal,
        ClientFareTotal: item.clientFareTotal,
        GdsFareTotal: item.gdsFareTotal,
        FlightTypeId: item.tripTypeId,
        Serial: Iserial
      }));
      for (let flightItem of item.flightSegmentData) {
        this.fmgFlightSegment.push(this.fb.group({
          IFlightNumber: flightItem.airlineNumber,
          IOperatingFlightNumber: flightItem.airlineNumber,
          NvBookingClass: flightItem.bookingCode,
          VFromAirportId: flightItem.departureAirportCode,
          VToAirportId: flightItem.arrivalAirportCode,
          VOperatingAirlinesId: flightItem.airlineCode,
          VAirlinesId: flightItem.airlineCode,
          Serial: Iserial,
          DepartureDateTime: this.flightHelper.getAdjustmentDate(item.departureDate, flightItem.adjustment, flightItem.departureAdjustment)
            .format('YYYY-MM-DD') + "T" + flightItem.departureTime + ":00",
          ArrivalDateTime: this.flightHelper.getAdjustmentDate(item.departureDate, flightItem.adjustment, flightItem.arrivalAdjustment)
            .format('YYYY-MM-DD') + "T" + flightItem.arrivalTime + ":00"
        }));
      }
      Iserial += 1;
    }
    for (let fare of this.firstLegFareData) {
      this.fmgFareData.push(this.fb.group({
        AdultBaseGDS: fare.adultBaseGDS,
        AdultTaxGDS: fare.adultTaxGDS,
        AdultTotalGDS: fare.adultTotalGDS,
        AdultBaseClient: fare.adultBaseClient,
        AdultTaxClient: fare.adultTaxClient,
        AdultTotalClient: fare.adultTotalClient,
        AdultAgentFare: fare.adultAgentFare,
        ChildBaseGDS: fare.childBaseGDS,
        ChildTaxGDS: fare.childTaxGDS,
        ChildTotalGDS: fare.childTotalGDS,
        ChildBaseClient: fare.childBaseClient,
        ChildTaxClient: fare.childTaxClient,
        ChildTotalClient: fare.childTotalClient,
        ChildAgentFare: fare.childAgentFare,
        InfantBaseGDS: fare.infantBaseGDS,
        InfantTaxGDS: fare.infantTaxGDS,
        InfantTotalGDS: fare.infantTotalGDS,
        InfantBaseClient: fare.infantBaseClient,
        InfantTaxClient: fare.infantTaxClient,
        InfantTotalClient: fare.infantTotalClient,
        InfantAgentFare: fare.infantAgentFare,
        DiscountTypePercent: fare.discountTypePercent,
        MarkupPercent: fare.markupPercent,
      }));
    }
    if (!this.shareService.isObjectEmpty(this.secondLegData[0])) {
      for (let flightItem of this.secondLegData[0].flightSegmentData) {
        this.fmgFlightSegment.push(this.fb.group({
          IFlightNumber: flightItem.airlineNumber,
          IOperatingFlightNumber: flightItem.airlineNumber,
          NvBookingClass: flightItem.bookingCode,
          VFromAirportId: flightItem.departureAirportCode,
          VToAirportId: flightItem.arrivalAirportCode,
          VOperatingAirlinesId: flightItem.airlineCode,
          VAirlinesId: flightItem.airlineCode,
          Serial: i + 1,
          DepartureDateTime: this.flightHelper.getAdjustmentDate(this.firstLegData[0].departureDate, flightItem.adjustment, flightItem.departureAdjustment)
            .format('YYYY-MM-DD') + "T" + flightItem.departureTime + ":00",
          ArrivalDateTime: this.flightHelper.getAdjustmentDate(this.firstLegData[0].departureDate, flightItem.adjustment, flightItem.arrivalAdjustment)
            .format('YYYY-MM-DD') + "T" + flightItem.arrivalTime + ":00"
        }));
      }
    }
    this.authService.saveDateChangeMulticity(Object.assign({}, this.fmgBookingSearch.value)).subscribe(data => {
      this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.Path]);
      });
    }, error => {
      console.log(error);
    });
  }
  getDate(i: any): string {
    let ret: string = "";
    try {
      let date = i;
      ret = this.shareService.getDayNameShort(date) + ", " +
        this.shareService.getDay(date) + " " +
        this.shareService.getMonthShort(date) + "'" +
        this.shareService.getYearShort(date);

    } catch (exp) { }
    return ret;
  }
  private _setChildSet() {
    this.childListFinal = [];
    for (let i = 0; i < this.childList.length; i++) {
      this.childListFinal.push({ id: this.childList[i], age: parseInt($("#childX" + i).val()) });
    }
    for (let i = 0; i < this.childList2.length; i++) {
      this.childListFinal.push({ id: this.childList2[i], age: parseInt($("#childY" + i).val()) });
    }

  }
  makeProposalDataSet(ind: any, way: number) {
    try {
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
      switch (way) {
        case 0:
          this.makeProposalData1 = this.domOneWayData1.find(x => x.id === ind);
          break;
        case 1:
          this.makeProposalData2 = this.domOneWayData2.find(x => x.id === ind);
          break;
        case 2:
          this.makeProposalData3 = this.domOneWayData3.find(x => x.id === ind);
          break;
        case 3:
          this.makeProposalData4 = this.domOneWayData4.find(x => x.id === ind);
          break;
      }
      $('#proposalModal' + way).modal('show');
    } catch (exp) {

    }
  }
  // exchangeDepartureArrival(i: number) {
  //   let fromAirportId = this.selectedFlightDeparturePanel[i].Id;
  //   let fromCityCode = this.selectedFlightDeparturePanel[i].CityCode;
  //   let fromCityName = this.selectedFlightDeparturePanel[i].CityName;
  //   let fromAirportCode = this.selectedFlightDeparturePanel[i].AirportCode;
  //   let fromAirportName = this.selectedFlightDeparturePanel[i].AirportName;
  //   let fromCountryCode = this.selectedFlightDeparturePanel[i].CountryCode;
  //   let fromCountryName = this.selectedFlightDeparturePanel[i].CountryName;
  //   if (fromAirportId != "") {
  //     this.selectedFlightDeparturePanel[i].Id = this.selectedFlightArrivalPanel[i].Id;
  //     this.selectedFlightArrival[i].Id = fromAirportId;
  //   }
  //   if (fromCityCode != "") {
  //     this.selectedFlightDeparturePanel[i].CityCode = this.selectedFlightArrivalPanel[i].CityCode;
  //     this.selectedFlightArrivalPanel[i].CityCode = fromCityCode;
  //   }
  //   if (fromCityName != "") {
  //     this.selectedFlightDeparturePanel[i].CityName = this.selectedFlightArrivalPanel[i].CityName;
  //     this.selectedFlightArrivalPanel[i].CityName = fromCityName;
  //   }
  //   if (fromAirportCode != "") {
  //     this.selectedFlightDeparturePanel[i].AirportCode = this.selectedFlightArrivalPanel[i].AirportCode;
  //     this.selectedFlightArrivalPanel[i].AirportCode = fromAirportCode;
  //   }
  //   if (fromAirportName != "") {
  //     this.selectedFlightDeparturePanel[i].AirportName = this.selectedFlightArrivalPanel[i].AirportName;
  //     this.selectedFlightArrivalPanel[i].AirportName = fromAirportName;
  //   }
  //   if (fromCountryCode != "") {
  //     this.selectedFlightDeparturePanel[i].CountryCode = this.selectedFlightArrivalPanel[i].CountryCode;
  //     this.selectedFlightArrivalPanel[i].CountryCode = fromCountryCode;
  //   }
  //   if (fromCountryName != "") {
  //     this.selectedFlightDeparturePanel[i].CountryName = this.selectedFlightArrivalPanel[i].CountryName;
  //     this.selectedFlightArrivalPanel[i].CountryName = fromCountryName;
  //   }
  // }
  // selectEvent(item: any, type: string, i: any) {
  //   if (type == "from") {
  //     this.selectedFlightDeparture[i].Id = item.id;
  //     this.selectedFlightDeparture[i].CityCode = item.code;
  //     this.selectedFlightDeparture[i].CityName = item.cityname;
  //     this.selectedFlightDeparture[i].CountryCode = item.countrycode;
  //     this.selectedFlightDeparture[i].CountryName = item.countryname;
  //     this.selectedFlightDeparture[i].AirportName = item.text;

  //     this.selectedFlightDeparturePanel[i].Id = item.id;
  //     this.selectedFlightDeparturePanel[i].CityCode = item.code;
  //     this.selectedFlightDeparturePanel[i].CityName = item.cityname;
  //     this.selectedFlightDeparturePanel[i].CountryCode = item.countrycode;
  //     this.selectedFlightDeparturePanel[i].CountryName = item.countryname;
  //     this.selectedFlightDeparturePanel[i].AirportName = item.text;

  //     this.selectedFlightDepartureMobile[i].CityName = item.cityname;
  //     this.selectedFlightDepartureMobile[i].CountryName = item.countryname;

  //   }
  //   if (type == "to") {
  //     this.selectedFlightArrival[i].Id = item.id;
  //     this.selectedFlightArrival[i].CityCode = item.code;
  //     this.selectedFlightArrival[i].CityName = item.cityname;
  //     this.selectedFlightArrival[i].CountryCode = item.countrycode;
  //     this.selectedFlightArrival[i].CountryName = item.countryname;
  //     this.selectedFlightArrival[i].AirportName = item.text;

  //     this.selectedFlightArrivalPanel[i].Id = item.id;
  //     this.selectedFlightArrivalPanel[i].CityCode = item.code;
  //     this.selectedFlightArrivalPanel[i].CityName = item.cityname;
  //     this.selectedFlightArrivalPanel[i].CountryCode = item.countrycode;
  //     this.selectedFlightArrivalPanel[i].CountryName = item.countryname;
  //     this.selectedFlightArrivalPanel[i].AirportName = item.text;

  //     this.selectedFlightArrivalMobile[i].CityName = item.cityname;
  //     this.selectedFlightArrivalMobile[i].CountryName = item.countryname;
  //   }
  // }
  // getMultiRoutes(): string {
  //   let ret: string = "";
  //   try {
  //     let s = this.selectedFlightDeparture[0].CityName, e = this.selectedFlightArrival[this.selectedFlightArrival.length - 1].CityName;
  //     let mid = "";
  //     for (let i = 1; i < this.selectedFlightDeparture.length; i++) {
  //       if (mid.indexOf(this.selectedFlightDeparture[i].CityName) == -1) {
  //         mid += this.selectedFlightDeparture[i].CityName + ",";
  //       }
  //     }
  //     for (let i = 0; i < this.selectedFlightArrival.length - 1; i++) {
  //       if (mid.indexOf(this.selectedFlightArrival[i].CityName) == -1) {
  //         mid += this.selectedFlightArrival[i].CityName + ",";
  //       }
  //     }
  //     if (!this.shareService.isNullOrEmpty(mid)) {
  //       mid = " via " + mid.substring(0, mid.length - 1);
  //     }
  //     ret = s + " to " + e + mid;
  //   } catch (exp) { }
  //   return ret;
  // }
  // topMulticitySection() {
  //   if (this.isMulticityTopSection) {
  //     this.isMulticityTopSection = false;
  //   } else {
  //     this.isMulticityTopSection = true;
  //     let len = this.selectedFlightDeparture.length;
  //     setTimeout(() => {
  //       for (let i = 0; i < len; i++) {
  //         flatpickr(".flat-datepick-from" + (i + 1), {
  //           enableTime: false,
  //           dateFormat: "d-m-Y",
  //           allowInput: true,
  //           minDate: this.shareService.padLeft(this.shareService.getDay(this.selectedFlightDeparture[i].Date), '0', 2) + "." +
  //             this.shareService.padLeft(this.shareService.getMonth(this.selectedFlightDeparture[i].Date), '0', 2) + "." +
  //             this.shareService.getYearLong(this.selectedFlightDeparture[i].Date)
  //         });
  //       }
  //     });
  //     setTimeout(() => {
  //       for (let i = 0; i < len; i++) {
  //         $("#trip" + i).css("display", "block");
  //         $("#tripAction" + i).css("display", "none");
  //       }
  //       switch (len) {
  //         case 1:
  //           $("#tripAction0").css("display", "block");
  //           break;
  //         case 2:
  //           $("#tripAction1").css("display", "block");
  //           break;
  //         case 3:
  //           $("#tripAction2").css("display", "block");
  //           break;
  //         case 4:
  //           $("#tripAction3").css("display", "block");
  //           break;
  //       }
  //     });
  //   }
  // }
  // addRemoveCity(isDel: boolean = false) {
  //   try {
  //     var trip1 = $("#trip0").css("display");
  //     var trip2 = $("#trip1").css("display");
  //     var trip3 = $("#trip2").css("display");
  //     var trip4 = $("#trip3").css("display");
  //     for (let i = 0; i < 4; i++) {
  //       $("#tripAction" + i).css("display", "none");
  //     }

  //     if ((trip1 == "block" || trip1 == "flex") && (trip2 == "block" || trip2 == "flex")
  //       && (trip3 == "block" || trip3 == "flex") && (trip4 == "block" || trip4 == "flex")) {
  //       if (isDel) {
  //         $("#trip3").css("display", "none");
  //         $("#tripAction2").css("display", "block");
  //       } else {
  //         $("#tripAction3").css("display", "block");
  //       }
  //     } else if ((trip1 == "block" || trip1 == "flex") && (trip2 == "block" || trip2 == "flex")
  //       && (trip3 == "block" || trip3 == "flex")) {
  //       if (isDel) {
  //         $("#trip2").css("display", "none");
  //         $("#tripAction1").css("display", "block");
  //       } else {
  //         $("#trip3").css("display", "block");
  //         $("#tripAction3").css("display", "block");
  //       }
  //     } else if ((trip1 == "block" || trip1 == "flex") && (trip2 == "block" || trip2 == "flex")) {
  //       if (isDel) {
  //         $("#trip1").css("display", "none");
  //         $("#tripAction0").css("display", "block");
  //       } else {
  //         $("#trip2").css("display", "block");
  //         $("#tripAction2").css("display", "block");
  //       }
  //     } else if ((trip1 == "block" || trip1 == "flex")) {
  //       $("#trip1").css("display", "block");
  //       $("#tripAction1").css("display", "block");
  //     } else {
  //       $("#trip0").css("display", "block");
  //       $("#tripAction0").css("display", "block");
  //     }
  //   } catch (exp) { }
  // }
  // onChangeSearch(val: string, type: any, ind: number) {
  //   try {
  //     val = val.toLowerCase();
  //     let data = this.shareService.distinctList(this.cmbAirport.filter(x =>
  //       (x.code).toString().toLowerCase().startsWith(val)
  //       || (x.cityname).toString().toLowerCase().startsWith(val)
  //       || (x.countryname).toString().toLowerCase().startsWith(val)
  //       || (x.text).toString().toLowerCase().startsWith(val)
  //     ));
  //     if (type == 'from') {
  //       this.tempAirportsDeparture1 = [];
  //       this.tempAirportsDeparture2 = [];
  //       this.tempAirportsDeparture3 = [];
  //       this.tempAirportsDeparture4 = [];

  //       if (ind == 0) {
  //         this.tempAirportsDeparture1 = data;
  //         if (this.tempAirportsDeparture1.length > 15) {
  //           this.tempAirportsDeparture1 = this.tempAirportsDeparture1.slice(0, 15);
  //         }
  //       } else if (ind == 1) {
  //         this.tempAirportsDeparture2 = data;
  //         if (this.tempAirportsDeparture2.length > 15) {
  //           this.tempAirportsDeparture2 = this.tempAirportsDeparture2.slice(0, 15);
  //         }
  //       } else if (ind == 2) {
  //         this.tempAirportsDeparture3 = data;
  //         if (this.tempAirportsDeparture3.length > 15) {
  //           this.tempAirportsDeparture3 = this.tempAirportsDeparture3.slice(0, 15);
  //         }
  //       } else if (ind == 3) {
  //         this.tempAirportsDeparture4 = data;
  //         if (this.tempAirportsDeparture4.length > 15) {
  //           this.tempAirportsDeparture4 = this.tempAirportsDeparture4.slice(0, 15);
  //         }
  //       }
  //     }
  //     if (type == 'to') {
  //       this.tempAirportsArrival1 = [];
  //       this.tempAirportsArrival2 = [];
  //       this.tempAirportsArrival3 = [];
  //       this.tempAirportsArrival4 = [];
  //       if (ind == 0) {
  //         this.tempAirportsArrival1 = data;
  //         if (this.tempAirportsArrival1.length > 15) {
  //           this.tempAirportsArrival1 = this.tempAirportsArrival1.slice(0, 15);
  //         }
  //       } else if (ind == 1) {
  //         this.tempAirportsArrival2 = data;
  //         if (this.tempAirportsArrival2.length > 15) {
  //           this.tempAirportsArrival2 = this.tempAirportsArrival2.slice(0, 15);
  //         }
  //       } else if (ind == 2) {
  //         this.tempAirportsArrival3 = data;
  //         if (this.tempAirportsArrival3.length > 15) {
  //           this.tempAirportsArrival3 = this.tempAirportsArrival3.slice(0, 15);
  //         }
  //       } else if (ind == 3) {
  //         this.tempAirportsArrival4 = data;
  //         if (this.tempAirportsArrival4.length > 15) {
  //           this.tempAirportsArrival4 = this.tempAirportsArrival4.slice(0, 15);
  //         }
  //       }
  //     }
  //   } catch (exp) { }
  // }
  // flightFrom(ind: number) {
  //   try {
  //     this.trueFalseDeparture();
  //     if (ind == 0) {
  //       this.isSuggDeparture1 = true;
  //       setTimeout(() => {
  //         this.suggDeparture1.focus();
  //       });
  //     } else if (ind == 1) {
  //       this.isSuggDeparture2 = true;
  //       setTimeout(() => {
  //         this.suggDeparture2.focus();
  //       });
  //     } else if (ind == 2) {
  //       this.isSuggDeparture3 = true;
  //       setTimeout(() => {
  //         this.suggDeparture3.focus();
  //       });
  //     } else if (ind == 3) {
  //       this.isSuggDeparture4 = true;
  //       setTimeout(() => {
  //         this.suggDeparture4.focus();
  //       });
  //     }
  //   } catch (exp) { }
  // }
  // flightFromOutside(ind: number) {
  //   try {
  //     if (ind == 0) {
  //       this.isSuggDeparture1 = false;
  //       this.tempAirportsDeparture1 = this.tempDefaultDepArrFlight1;
  //     } else if (ind == 1) {
  //       this.isSuggDeparture2 = false;
  //       this.tempAirportsDeparture2 = this.tempDefaultDepArrFlight2;
  //     } else if (ind == 2) {
  //       this.isSuggDeparture3 = false;
  //       this.tempAirportsDeparture3 = this.tempDefaultDepArrFlight3;
  //     } else if (ind == 3) {
  //       this.isSuggDeparture4 = false;
  //       this.tempAirportsDeparture4 = this.tempDefaultDepArrFlight4;
  //     }
  //   } catch (exp) { }
  // }
  // flightFromMobile() {
  //   try {
  //     this.isSuggDepartureMobile1 = true;
  //     setTimeout(() => {
  //       this.suggDepartureMobile.focus();
  //     }, 50);
  //   } catch (exp) { }
  // }
  // flightFromOutsideMobile() {
  //   try {
  //     this.isSuggDepartureMobile1 = false;
  //     this.tempAirportsDeparture1 = this.tempDefaultDepArrFlight1;
  //   } catch (exp) { }
  // }
  // flightToOutside(ind: number) {
  //   try {
  //     if (ind == 0) {
  //       this.isSuggReturn1 = false;
  //       this.tempAirportsArrival1 = this.tempDefaultDepArrFlight1;
  //     } else if (ind == 1) {
  //       this.isSuggReturn2 = false;
  //       this.tempAirportsArrival2 = this.tempDefaultDepArrFlight2;
  //     } else if (ind == 2) {
  //       this.isSuggReturn3 = false;
  //       this.tempAirportsArrival3 = this.tempDefaultDepArrFlight3;
  //     } else if (ind == 3) {
  //       this.isSuggReturn4 = false;
  //       this.tempAirportsArrival4 = this.tempDefaultDepArrFlight4;
  //     }
  //   } catch (exp) { }
  // }
  // flightTo(ind: number) {
  //   try {
  //     this.trueFalseArrival();
  //     if (ind == 0) {
  //       this.isSuggReturn1 = true;
  //       setTimeout(() => {
  //         this.suggReturn1.focus();
  //       });
  //     } else if (ind == 1) {
  //       this.isSuggReturn2 = true;
  //       setTimeout(() => {
  //         this.suggReturn2.focus();
  //       });
  //     } else if (ind == 2) {
  //       this.isSuggReturn3 = true;
  //       setTimeout(() => {
  //         this.suggReturn3.focus();
  //       });
  //     } else if (ind == 3) {
  //       this.isSuggReturn4 = true;
  //       setTimeout(() => {
  //         this.suggReturn4.focus();
  //       });
  //     }
  //   } catch (exp) { }
  // }
  // flightToOutsideMobile() {
  //   try {
  //     this.isSuggReturnMobile = false;
  //     this.tempAirportsArrival1 = this.tempDefaultDepArrFlight1;
  //   } catch (exp) { }
  // }
  // changeClassLabel(code: string) {
  //   try {
  //     this.selectedClassTypeCode = code;
  //     this.selectedClassTypeId = this.flightHelper.getCabinTypeId(code);
  //     this.selectedClassTypeName = this.flightHelper.getCabinTypeName(code);
  //     let x = this._getTotalTravellers() + "Travellers," + this.selectedClassTypeName;
  //     if (x.length > 18) {
  //       let y = this._getTotalTravellers() + "Travellers,";
  //       this.selectedClassTypeName = this.selectedClassTypeName.toString().substring(0, 18 - y.length) + "..";
  //     }
  //   } catch (exp) { }
  // }
  // tripChange(event: any) {
  //   this.trueFalseSearchType();
  //   var type = event.target.value;
  //   type = Number.parseInt(type);
  //   this.selectedTripTypeId = this.flightHelper.getTripTypeId(type);
  //   switch (type) {
  //     case 1:
  //       this.isOneway = true;
  //       this.clearReturn();
  //       break;
  //     case 2:
  //       this.isRoundtrip = true;
  //       this.selectedFlightArrival[0].Date = this.getCurrentDate();
  //       this.setReturnPanel(this.selectedFlightArrival[0].Date);
  //       break;
  //     case 3:
  //       this.isMulticity = true;
  //       break;
  //     default:
  //       break;
  //   }
  // }
  // saveFlightSearchHistory(data: any, isMulticity: boolean, isDomestic: boolean) {
  //   try {
  //     let loadData: any = JSON.parse(JSON.stringify(data));
  //     let airlinesId = this.airlines1.find((x: { id: any; }) => x.id == data.airlines);
  //     if (airlinesId == undefined || airlinesId == "" || airlinesId == "0") {
  //       airlinesId = this.flightHelper.allAirlinesId;
  //     } else {
  //       airlinesId = airlinesId.masterId;
  //     }
  //     this.fmgSearchHistoryDetails = this.fmgSearchHistory.get('FlightSearchDetailsHistory') as FormArray;
  //     for (var item of data.childList) {
  //       this.fmgSearchHistoryDetails.push(this.fb.group({
  //         VFlightSearchHistoryId: '',
  //         IChildAge: item.age
  //       }));
  //     }
  //     let toId = "";
  //     let toReturnDate = "";
  //     if (isMulticity) {
  //       toId = loadData.Arrival[loadData.Arrival.length - 1].Id;
  //     } else {
  //       toId = loadData.Arrival[0].Id;
  //       toReturnDate = data.returnDate;
  //     }

  //     this.fmgSearchHistoryInfo = this.fmgSearchHistory.get('FlightSearchHistory') as FormData;
  //     this.fmgSearchHistoryInfo.patchValue({
  //       Id: this.shareService.getUserId(),
  //       DSearchDate: new Date(),
  //       VAirportIdfrom: this.selectedFlightDeparture[0].Id,
  //       VAirportIdto: toId,
  //       DDepartureDate: this.selectedFlightDeparture[0].Date,
  //       DReturnDate: toReturnDate,
  //       VFlightTypeId: data.tripTypeId,
  //       VCabinTypeId: data.cabinTypeId,
  //       INumberAdult: data.adult,
  //       INumberChild: data.childList.length,
  //       INumberInfant: data.infant,
  //       VAirlinesId: airlinesId,
  //       VFlightStopId: this.flightHelper.getFlightStopId(data.stop),
  //       VFareTypeId: this.flightHelper.getFareTypeId(1)
  //     });
  //     this.authService.saveFlightSearchHistory(Object.assign({}, this.fmgSearchHistory.value)).subscribe(subData => {

  //       if (subData.success) {
  //         this._navigationWork(isDomestic);
  //       }
  //     }, err => {
  //     });
  //   } catch (exp) {
  //     console.log(exp);
  //   }
  // }
  // private _setStoreFlightData(data: any, isSave: boolean) {
  //   let isDomestic = true;
  //   if ("loaderData" in localStorage) {
  //     localStorage.removeItem("loaderData");
  //   }
  //   localStorage.setItem('loaderData', JSON.stringify(data));
  //   if (this.isMulticity) {
  //     let loadData: any = JSON.parse(JSON.stringify(data));
  //     for (let i = 0; i < loadData.Departure.length; i++) {
  //       if (this.getCountryCode(loadData.Departure[i].CityCode) != this.getCountryCode(loadData.Arrival[i].CityCode)) {
  //         isDomestic = false;
  //         break;
  //       }
  //     }
  //   } else {
  //     let checkFromFlight = this.getCountryCode(data.fromFlightCode);
  //     let checkToFlight = this.getCountryCode(data.toFlightCode);
  //     if (checkFromFlight != checkToFlight) {
  //       isDomestic = false;
  //     }
  //   }
  //   if (isSave) {
  //     this.saveFlightSearchHistory(data, this.isMulticity, isDomestic);
  //   } else {
  //     this._navigationWork(isDomestic);
  //   }
  // }
  // plus(type: string) {
  //   if ((this.num1 + this.num2 + this.num3) < 9) {
  //     switch (type) {
  //       case "adult":
  //         if (this.num1 < 7 && this.num2 < 7) {
  //           this.num1++;
  //         }
  //         switch (this.num1) {
  //           case 2:
  //             if (this.num2 > 5) {
  //               this.childList = this.shareService.removeList(this.num2, this.childList);
  //               this.num2--;
  //             }
  //             break;
  //           case 3:
  //             while (4 < this.num2) {
  //               this.childList = this.shareService.removeList(this.num2, this.childList);
  //               this.num2--;
  //             }
  //             break;
  //           case 4:
  //             while (3 < this.num2) {
  //               this.childList = this.shareService.removeList(this.num2, this.childList);
  //               this.num2--;
  //             }
  //             break;
  //           case 5:
  //             while (2 < this.num2) {
  //               this.childList = this.shareService.removeList(this.num2, this.childList);
  //               this.num2--;
  //             }
  //             break;
  //           case 6:
  //             while (1 < this.num2) {
  //               this.childList = this.shareService.removeList(this.num2, this.childList);
  //               this.num2--;
  //             }
  //             break;
  //           case 7:
  //             while (0 < this.num2) {
  //               this.childList = this.shareService.removeList(this.num2, this.childList);
  //               this.num2--;
  //             }
  //             break;
  //         }
  //         break;
  //       case "child":
  //         if (this.num2 < 6) {
  //           switch (this.num1) {
  //             case 1: case 0:
  //               this.num2++;
  //               if (7 - this.num1 >= this.num2) {
  //                 this.childList.push(this.num2);
  //               } else {
  //                 this.num2--;
  //               }
  //               break;
  //             case 2:
  //               this.num2++;
  //               if (7 - this.num1 >= this.num2) {
  //                 this.childList.push(this.num2);
  //               } else {
  //                 this.num2--;
  //               }
  //               break;
  //             case 3:
  //               this.num2++;
  //               if (7 - this.num1 >= this.num2) {
  //                 this.childList.push(this.num2);
  //               } else {
  //                 this.num2--;
  //               }
  //               break;
  //             case 4:
  //               this.num2++;
  //               if (7 - this.num1 >= this.num2) {
  //                 this.childList.push(this.num2);
  //               } else {
  //                 this.num2--;
  //               }
  //               break;
  //             case 4:
  //               this.num2++;
  //               if (7 - this.num1 >= this.num2) {
  //                 this.childList.push(this.num2);
  //               } else {
  //                 this.num2--;
  //               }
  //               break;
  //             case 5:
  //               this.num2++;
  //               if (7 - this.num1 >= this.num2) {
  //                 this.childList.push(this.num2);
  //               } else {
  //                 this.num2--;
  //               }
  //               break;
  //             case 6:
  //               this.num2++;
  //               if (this.num1 - (this.num1 - 1) == this.num2) {
  //                 this.childList.push(this.num2);
  //               } else {
  //                 this.num2--;
  //               }
  //               break;
  //           }
  //         } else if (this.num2 >= 6 && this.num2 < 9) {
  //           this.num2++;
  //           this.childList2.push(this.num2);

  //         }
  //         break;
  //       case "infant":
  //         if (this.num3 < 7 && this.num3 < this.num1) {
  //           this.num3++;
  //         }
  //         break;
  //     }
  //   }
  // }
  // save() {
  //   this.showBox = false;
  //   $("#travellersBox").css("display", "none");
  //   this._setChildSet();
  // }
  // minus(type: string) {
  //   switch (type) {
  //     case "adult":
  //       if (this.num1 > 0) {
  //         this.num1--;
  //       }
  //       if (this.num1 < this.num3) {
  //         this.num3--;
  //       }
  //       break;
  //     case "child":
  //       if (this.num2 > 0) {
  //         if (this.num2 < 7) {
  //           this.childList = this.shareService.removeList(this.num2, this.childList);
  //           this.num2--;
  //         } else {
  //           this.childList2 = this.shareService.removeList(this.num2, this.childList2);
  //           this.num2--;
  //         }
  //       }
  //       break;
  //     case "infant":
  //       if (this.num3 > 0) {
  //         this.num3--;
  //       }
  //       break;
  //   }
  // }



  // setDepartureTimeFilter(type:string,a_p:any,itiId:number,leg:number,ind:number)
  // {
  //   try{
  //     switch(ind)
  //     {
  //       case 0:
  //         if(a_p.toString().indexOf('AM')>-1)
  //         {
  //           let before6=this.flightHelper.getMinimumPriceForTime(type,1,6,'AM',itiId,leg,this.scheduleDescs1,this.itineraries1);
  //           let am6=this.flightHelper.getMinimumPriceForTime(type,6,12,'AM',itiId,leg,this.scheduleDescs1,this.itineraries1);
  //           if(this.departureTimeFilter1.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
  //           {
  //             this.departureTimeFilter1.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
  //             if(this.popularFilter1.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
  //             {
  //               this.popularFilter1.push({id:"12AM-06AM",title:"Morning Departure",value:"Before 06AM",len:"",details:"12:00 AM-05:59 AM",price:before6,origin:"departure"});
  //             }
  //           }
  //           if(this.departureTimeFilter1.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
  //           {
  //             this.departureTimeFilter1.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //         }
  //         if(a_p.toString().indexOf('PM')>-1)
  //         {
  //           let after12pm=this.flightHelper.getMinimumPriceForTime(type,1,6,'PM',itiId,leg,this.scheduleDescs1,this.itineraries1);
  //           let after6=this.flightHelper.getMinimumPriceForTime(type,6,12,'PM',itiId,leg,this.scheduleDescs1,this.itineraries1);
  //           if(this.departureTimeFilter1.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
  //           {
  //             this.departureTimeFilter1.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
  //           }
  //           if(this.departureTimeFilter1.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
  //           {
  //             this.departureTimeFilter1.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
  //             if(this.popularFilter1.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
  //             {
  //               this.popularFilter1.push({id:"06PM-12AM",title:"Late Departure",value:"After 06PM",len:"",details:"06:00 PM-11:59 PM",price:after6,origin:"departure"});
  //             }
  //           }
  //         }
  //         break;
  //       case 1:
  //         if(a_p.toString().indexOf('AM')>-1)
  //         {
  //           let before6=this.flightHelper.getMinimumPriceForTime(type,1,6,'AM',itiId,leg,this.scheduleDescs2,this.itineraries2);
  //           let am6=this.flightHelper.getMinimumPriceForTime(type,6,12,'AM',itiId,leg,this.scheduleDescs2,this.itineraries2);
  //           if(this.departureTimeFilter2.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
  //           {
  //             this.departureTimeFilter2.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
  //             if(this.popularFilter2.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
  //             {
  //               this.popularFilter2.push({id:"12AM-06AM",title:"Morning Departure",value:"Before 06AM",len:"",details:"12:00 AM-05:59 AM",price:before6,origin:"departure"});
  //             }
  //           }
  //           if(this.departureTimeFilter2.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
  //           {
  //             this.departureTimeFilter2.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //         }
  //         if(a_p.toString().indexOf('PM')>-1)
  //         {
  //           let after12pm=this.flightHelper.getMinimumPriceForTime(type,1,6,'PM',itiId,leg,this.scheduleDescs2,this.itineraries2);
  //           let after6=this.flightHelper.getMinimumPriceForTime(type,6,12,'PM',itiId,leg,this.scheduleDescs2,this.itineraries2);
  //           if(this.departureTimeFilter2.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
  //           {
  //             this.departureTimeFilter2.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
  //           }
  //           if(this.departureTimeFilter2.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
  //           {
  //             this.departureTimeFilter2.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
  //             if(this.popularFilter2.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
  //             {
  //               this.popularFilter2.push({id:"06PM-12AM",title:"Late Departure",value:"After 06PM",len:"",details:"06:00 PM-11:59 PM",price:after6,origin:"departure"});
  //             }
  //           }
  //         }
  //         break;
  //       case 2:
  //         if(a_p.toString().indexOf('AM')>-1)
  //         {
  //           let before6=this.flightHelper.getMinimumPriceForTime(type,1,6,'AM',itiId,leg,this.scheduleDescs3,this.itineraries3);
  //           let am6=this.flightHelper.getMinimumPriceForTime(type,6,12,'AM',itiId,leg,this.scheduleDescs3,this.itineraries3);
  //           if(this.departureTimeFilter3.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
  //           {
  //             this.departureTimeFilter3.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
  //             if(this.popularFilter3.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
  //             {
  //               this.popularFilter3.push({id:"12AM-06AM",title:"Morning Departure",value:"Before 06AM",len:"",details:"12:00 AM-05:59 AM",price:before6,origin:"departure"});
  //             }
  //           }
  //           if(this.departureTimeFilter3.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
  //           {
  //             this.departureTimeFilter3.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //         }
  //         if(a_p.toString().indexOf('PM')>-1)
  //         {
  //           let after12pm=this.flightHelper.getMinimumPriceForTime(type,1,6,'PM',itiId,leg,this.scheduleDescs3,this.itineraries3);
  //           let after6=this.flightHelper.getMinimumPriceForTime(type,6,12,'PM',itiId,leg,this.scheduleDescs3,this.itineraries3);
  //           if(this.departureTimeFilter3.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
  //           {
  //             this.departureTimeFilter3.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
  //           }
  //           if(this.departureTimeFilter3.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
  //           {
  //             this.departureTimeFilter3.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
  //             if(this.popularFilter3.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
  //             {
  //               this.popularFilter3.push({id:"06PM-12AM",title:"Late Departure",value:"After 06PM",len:"",details:"06:00 PM-11:59 PM",price:after6,origin:"departure"});
  //             }
  //           }
  //         }
  //         break;
  //       case 3:
  //         if(a_p.toString().indexOf('AM')>-1)
  //         {
  //           let before6=this.flightHelper.getMinimumPriceForTime(type,1,6,'AM',itiId,leg,this.scheduleDescs4,this.itineraries4);
  //           let am6=this.flightHelper.getMinimumPriceForTime(type,6,12,'AM',itiId,leg,this.scheduleDescs4,this.itineraries4);
  //           if(this.departureTimeFilter4.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
  //           {
  //             this.departureTimeFilter4.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
  //             if(this.popularFilter4.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
  //             {
  //               this.popularFilter4.push({id:"12AM-06AM",title:"Morning Departure",value:"Before 06AM",len:"",details:"12:00 AM-05:59 AM",price:before6,origin:"departure"});
  //             }
  //           }
  //           if(this.departureTimeFilter4.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
  //           {
  //             this.departureTimeFilter4.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //         }
  //         if(a_p.toString().indexOf('PM')>-1)
  //         {
  //           let after12pm=this.flightHelper.getMinimumPriceForTime(type,1,6,'PM',itiId,leg,this.scheduleDescs4,this.itineraries4);
  //           let after6=this.flightHelper.getMinimumPriceForTime(type,6,12,'PM',itiId,leg,this.scheduleDescs4,this.itineraries4);
  //           if(this.departureTimeFilter4.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
  //           {
  //             this.departureTimeFilter4.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
  //           }
  //           if(this.departureTimeFilter4.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
  //           {
  //             this.departureTimeFilter4.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
  //             if(this.popularFilter4.findIndex(x=>x.id.indexOf("12AM-06AM")>-1)<0)
  //             {
  //               this.popularFilter4.push({id:"06PM-12AM",title:"Late Departure",value:"After 06PM",len:"",details:"06:00 PM-11:59 PM",price:after6,origin:"departure"});
  //             }
  //           }
  //         }
  //         break;
  //     }
  //   }catch(exp){}
  // }
  // setArrivalTimeFilter(type:string,a_p:any,itiId:number,leg:number,ind:number)
  // {
  //   try{
  //     switch(ind)
  //     {
  //       case 0:
  //         if(a_p.toString().indexOf('AM')>-1)
  //         {
  //           let before6=this.flightHelper.getMinimumPriceForTime(type,1,6,'AM',itiId,leg,this.scheduleDescs1,this.itineraries1);
  //           let am6=this.flightHelper.getMinimumPriceForTime(type,6,12,'AM',itiId,leg,this.scheduleDescs1,this.itineraries1);
  //           if(this.arrivalTimeFilter1.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
  //           {
  //             this.arrivalTimeFilter1.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //           if(this.arrivalTimeFilter1.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
  //           {
  //             this.arrivalTimeFilter1.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //         }
  //         if(a_p.toString().indexOf('PM')>-1)
  //         {
  //           let after12pm=this.flightHelper.getMinimumPriceForTime(type,1,6,'PM',itiId,leg,this.scheduleDescs1,this.itineraries1);
  //           let after6=this.flightHelper.getMinimumPriceForTime(type,6,12,'PM',itiId,leg,this.scheduleDescs1,this.itineraries1);
  //           if(this.arrivalTimeFilter1.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
  //           {
  //             this.arrivalTimeFilter1.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
  //           }
  //           if(this.arrivalTimeFilter1.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
  //           {
  //             this.arrivalTimeFilter1.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
  //           }
  //         }
  //         break;
  //       case 1:
  //         if(a_p.toString().indexOf('AM')>-1)
  //         {
  //           let before6=this.flightHelper.getMinimumPriceForTime(type,1,6,'AM',itiId,leg,this.scheduleDescs2,this.itineraries2);
  //           let am6=this.flightHelper.getMinimumPriceForTime(type,6,12,'AM',itiId,leg,this.scheduleDescs2,this.itineraries2);
  //           if(this.arrivalTimeFilter2.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
  //           {
  //             this.arrivalTimeFilter2.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //           if(this.arrivalTimeFilter2.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
  //           {
  //             this.arrivalTimeFilter2.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //         }
  //         if(a_p.toString().indexOf('PM')>-1)
  //         {
  //           let after12pm=this.flightHelper.getMinimumPriceForTime(type,1,6,'PM',itiId,leg,this.scheduleDescs2,this.itineraries2);
  //           let after6=this.flightHelper.getMinimumPriceForTime(type,6,12,'PM',itiId,leg,this.scheduleDescs2,this.itineraries2);
  //           if(this.arrivalTimeFilter2.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
  //           {
  //             this.arrivalTimeFilter2.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
  //           }
  //           if(this.arrivalTimeFilter2.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
  //           {
  //             this.arrivalTimeFilter2.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
  //           }
  //         }
  //         break;
  //       case 2:
  //         if(a_p.toString().indexOf('AM')>-1)
  //         {
  //           let before6=this.flightHelper.getMinimumPriceForTime(type,1,6,'AM',itiId,leg,this.scheduleDescs3,this.itineraries3);
  //           let am6=this.flightHelper.getMinimumPriceForTime(type,6,12,'AM',itiId,leg,this.scheduleDescs3,this.itineraries3);
  //           if(this.arrivalTimeFilter3.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
  //           {
  //             this.arrivalTimeFilter3.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //           if(this.arrivalTimeFilter3.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
  //           {
  //             this.arrivalTimeFilter3.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //         }
  //         if(a_p.toString().indexOf('PM')>-1)
  //         {
  //           let after12pm=this.flightHelper.getMinimumPriceForTime(type,1,6,'PM',itiId,leg,this.scheduleDescs3,this.itineraries3);
  //           let after6=this.flightHelper.getMinimumPriceForTime(type,6,12,'PM',itiId,leg,this.scheduleDescs3,this.itineraries3);
  //           if(this.arrivalTimeFilter3.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
  //           {
  //             this.arrivalTimeFilter3.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
  //           }
  //           if(this.arrivalTimeFilter3.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
  //           {
  //             this.arrivalTimeFilter3.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
  //           }
  //         }
  //         break;
  //       case 3:
  //         if(a_p.toString().indexOf('AM')>-1)
  //         {
  //           let before6=this.flightHelper.getMinimumPriceForTime(type,1,6,'AM',itiId,leg,this.scheduleDescs4,this.itineraries4);
  //           let am6=this.flightHelper.getMinimumPriceForTime(type,6,12,'AM',itiId,leg,this.scheduleDescs4,this.itineraries4);
  //           if(this.arrivalTimeFilter4.find(x=>x.title=="Before 06AM")==undefined && before6!=0 && before6!=undefined)
  //           {
  //             this.arrivalTimeFilter4.push({title:"Before 06AM",details:"12:00 AM-05:59 AM",value:"12AM-06AM",price:before6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //           if(this.arrivalTimeFilter4.find(x=>x.title=="06AM - 12PM")==undefined && am6!=undefined && am6!=0)
  //           {
  //             this.arrivalTimeFilter4.push({title:"06AM - 12PM",details:"06:00 AM-11:59 AM",value:"06AM-12PM",price:am6,logo:'../../../assets/dist/img/sun.svg'});
  //           }
  //         }
  //         if(a_p.toString().indexOf('PM')>-1)
  //         {
  //           let after12pm=this.flightHelper.getMinimumPriceForTime(type,1,6,'PM',itiId,leg,this.scheduleDescs4,this.itineraries4);
  //           let after6=this.flightHelper.getMinimumPriceForTime(type,6,12,'PM',itiId,leg,this.scheduleDescs4,this.itineraries4);
  //           if(this.arrivalTimeFilter4.find(x=>x.title=="12PM - 06PM")==undefined && after12pm!=undefined && after12pm!=0)
  //           {
  //             this.arrivalTimeFilter4.push({title:"12PM - 06PM",details:"12:00 PM-05:59 PM",value:"12PM-06PM",price:after12pm,logo:'../../../assets/dist/img/sun-fog.svg'});
  //           }
  //           if(this.arrivalTimeFilter4.find(x=>x.title=="After 06PM")==undefined && after6!=undefined && after6!=0)
  //           {
  //             this.arrivalTimeFilter4.push({title:"After 06PM",details:"06:00 PM-11:59 PM",value:"06PM-12AM",price:after6,logo:'../../../assets/dist/img/moon.svg'});
  //           }
  //         }
  //         break;
  //     }
  //   }catch(exp){}
  // }
  // isEmpty(data: any) {
  //   let ret: boolean = true;
  //   if (data != "" && data != undefined) {
  //     ret = false;
  //   }
  //   return ret;
  // }
  // setHeadSearchPanel(fromCountry: string, toCountry: string,
  //   fromAirport: string, toAirport: string, fromFlightName: string,
  //   toFlightName: string, fromFlightCode: string, toFlightCode: string) {
  //   try {
  //     $("#fromFlightCityName").text(fromFlightName + ', ' + fromCountry);
  //     $("#fromFlightCityDetails").text(fromFlightCode + ', ' + fromAirport);
  //     $("#toFlightCityName").text(toFlightName + ', ' + toCountry);
  //     $("#toFlightCityDetails").text(toFlightCode + ', ' + toAirport);
  //   } catch (exp) { }
  // }
  // setTimeFilter(type: string, ind: number) {
  //   try {
  //     switch (ind) {
  //       case 0:
  //         for (let item of this.itineraries1) {
  //           let time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs1).departure.time;
  //           if (type == 'arrival') {
  //             time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs1).arrival.time;
  //           }
  //           let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
  //           let hours = a_p.toString().trim().split(':')[0];
  //           if (type == 'arrival') {
  //             this.setArrivalTimeFilter(type, a_p, hours, time, ind);
  //           } else {
  //             this.setDepartureTimeFilter(type, a_p, hours, time, ind);
  //           }
  //         }
  //         break;
  //       case 1:
  //         for (let item of this.itineraries2) {
  //           let time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs2).departure.time;
  //           if (type == 'arrival') {
  //             time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs2).arrival.time;
  //           }
  //           let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
  //           let hours = a_p.toString().trim().split(':')[0];
  //           if (type == 'arrival') {
  //             this.setArrivalTimeFilter(type, a_p, hours, time, ind);
  //           } else {
  //             this.setDepartureTimeFilter(type, a_p, hours, time, ind);
  //           }
  //         }
  //         break;
  //       case 2:
  //         for (let item of this.itineraries3) {
  //           let time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs3).departure.time;
  //           if (type == 'arrival') {
  //             time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs3).arrival.time;
  //           }
  //           let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
  //           let hours = a_p.toString().trim().split(':')[0];
  //           if (type == 'arrival') {
  //             this.setArrivalTimeFilter(type, a_p, hours, time, ind);
  //           } else {
  //             this.setDepartureTimeFilter(type, a_p, hours, time, ind);
  //           }
  //         }
  //         break;
  //       case 3:
  //         for (let item of this.itineraries4) {
  //           let time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs4).departure.time;
  //           if (type == 'arrival') {
  //             time = this.flightHelper._scheduleDescs(item.legs[0].ref - 1, this.scheduleDescs4).arrival.time;
  //           }
  //           let a_p = this.shareService.getAmPm(time.toString().trim().split(':')[0], time.toString().trim().split(':')[1]);
  //           let hours = a_p.toString().trim().split(':')[0];
  //           if (type == 'arrival') {
  //             this.setArrivalTimeFilter(type, a_p, hours, time, ind);
  //           } else {
  //             this.setDepartureTimeFilter(type, a_p, hours, time, ind);
  //           }
  //         }
  //         break;
  //     }
  //   } catch (exp) { }
  // }
  // setStopCount(ind: number) {
  //   let stopList: any[] = [];
  //   try {
  //     switch (ind) {
  //       case 0:
  //         this.stopCountList1 = [];
  //         for (let rootItem of this.domOneWayData1) {
  //           let price = rootItem.clientFareTotal;
  //           let len = rootItem.flightSegmentData.length;
  //           stopList.push({ id: len, price: price });
  //         }
  //         let stopGroup = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
  //         for (let item of stopGroup) {
  //           let min = item.value[0].price;
  //           let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
  //           this.stopCountList1.push({
  //             id: item.key, stopCount: item.value.length, title: title,
  //             price: 0
  //           });
  //           for (let subItem of item.value) {
  //             if (min > subItem.price) {
  //               min = subItem.price;
  //             }
  //           }
  //           this.stopCountList1.find(x => x.id == item.key).price = min;
  //           if (item.key == 2) {
  //             if (this.popularFilter1.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
  //               this.popularFilter1.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
  //             }
  //           }
  //         }
  //         let minPriceRef = this.flightHelper.getMinimumPricePopularFilterRefundable(true, this.domOneWayData1);
  //         let countRef = this.flightHelper.getTotalPopularFilterRefundable(true, this.domOneWayData1);
  //         if (this.popularFilter1.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
  //           this.popularFilter1.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef + ")", price: minPriceRef, origin: "refundable" });
  //         }
  //         break;
  //       case 1:
  //         this.stopCountList2 = [];
  //         for (let rootItem of this.domOneWayData2) {
  //           let price = rootItem.clientFareTotal;
  //           let len = rootItem.flightSegmentData.length;
  //           stopList.push({ id: len, price: price });
  //         }
  //         let stopGroup2 = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
  //         for (let item of stopGroup2) {
  //           let min = item.value[0].price;
  //           let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
  //           this.stopCountList2.push({
  //             id: item.key, stopCount: item.value.length, title: title,
  //             price: 0
  //           });
  //           for (let subItem of item.value) {
  //             if (min > subItem.price) {
  //               min = subItem.price;
  //             }
  //           }
  //           this.stopCountList2.find(x => x.id == item.key).price = min;
  //           if (item.key == 2) {
  //             if (this.popularFilter2.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
  //               this.popularFilter2.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
  //             }
  //           }
  //         }
  //         let minPriceRef2 = this.flightHelper.getMinimumPricePopularFilterRefundable(true, this.domOneWayData2);
  //         let countRef2 = this.flightHelper.getTotalPopularFilterRefundable(true, this.domOneWayData2);
  //         if (this.popularFilter2.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
  //           this.popularFilter2.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef2 + ")", price: minPriceRef2, origin: "refundable" });
  //         }
  //         break;
  //       case 2:
  //         this.stopCountList3 = [];
  //         for (let rootItem of this.domOneWayData3) {
  //           let price = rootItem.clientFareTotal;
  //           let len = rootItem.flightSegmentData.length;
  //           stopList.push({ id: len, price: price });
  //         }
  //         let stopGroup3 = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
  //         for (let item of stopGroup3) {
  //           let min = item.value[0].price;
  //           let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
  //           this.stopCountList3.push({
  //             id: item.key, stopCount: item.value.length, title: title,
  //             price: 0
  //           });
  //           for (let subItem of item.value) {
  //             if (min > subItem.price) {
  //               min = subItem.price;
  //             }
  //           }
  //           this.stopCountList3.find(x => x.id == item.key).price = min;
  //           if (item.key == 2) {
  //             if (this.popularFilter3.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
  //               this.popularFilter3.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
  //             }
  //           }
  //         }
  //         let minPriceRef3 = this.flightHelper.getMinimumPricePopularFilterRefundable(true, this.domOneWayData3);
  //         let countRef3 = this.flightHelper.getTotalPopularFilterRefundable(true, this.domOneWayData3);
  //         if (this.popularFilter3.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
  //           this.popularFilter3.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef3 + ")", price: minPriceRef3, origin: "refundable" });
  //         }
  //         break;
  //       case 3:
  //         this.stopCountList4 = [];
  //         for (let rootItem of this.domOneWayData4) {
  //           let price = rootItem.clientFareTotal;
  //           let len = rootItem.flightSegmentData.length;
  //           stopList.push({ id: len, price: price });
  //         }
  //         let stopGroup4 = this.shareService.getMapToArray(this.shareService.groupBy(stopList, x => x.id));
  //         for (let item of stopGroup4) {
  //           let min = item.value[0].price;
  //           let title = item.key == 1 ? "Non stop" : "Stop " + (item.key - 1);
  //           this.stopCountList4.push({
  //             id: item.key, stopCount: item.value.length, title: title,
  //             price: 0
  //           });
  //           for (let subItem of item.value) {
  //             if (min > subItem.price) {
  //               min = subItem.price;
  //             }
  //           }
  //           this.stopCountList4.find(x => x.id == item.key).price = min;
  //           if (item.key == 2) {
  //             if (this.popularFilter4.findIndex(x => x.id.indexOf(item.key + "") > -1) < 0 && this.flightHelper.isNotZero(min) == true) {
  //               this.popularFilter4.push({ id: item.key + "", title: title, value: title, len: "(" + item.value.length + ")", price: min, origin: "stop" });
  //             }
  //           }
  //         }
  //         let minPriceRef4 = this.flightHelper.getMinimumPricePopularFilterRefundable(true, this.domOneWayData4);
  //         let countRef4 = this.flightHelper.getTotalPopularFilterRefundable(true, this.domOneWayData4);
  //         if (this.popularFilter4.findIndex(x => x.id.indexOf("Refundable") > -1) < 0) {
  //           this.popularFilter4.push({ id: "Refundable", title: "Refundable", value: "", len: "(" + countRef4 + ")", price: minPriceRef4, origin: "refundable" });
  //         }
  //         break;
  //     }
  //     this.setTimeFilter('departure', ind);
  //     this.setTimeFilter('arrival', ind);
  //   } catch (exp) { }
  // }
  // private setAirport(ind: number) {
  //   this.topFlightSearchSkeleton = true;
  //   setTimeout(() => {
  //     let depAirport: string[] = [], arrAirport: string[] = [];
  //     switch (ind) {
  //       case 0:
  //         this.airports1 = { departure: [], arrival: [] };
  //         this.cmbAirport = this.flightHelper.getAirportData();
  //         for (let j = 0; j < this.scheduleDescs1.length; j++) {
  //           if (!depAirport.includes(this.scheduleDescs1[j].departure.airport)) {
  //             depAirport.push(this.scheduleDescs1[j].departure.airport);
  //           }
  //           if (!arrAirport.includes(this.scheduleDescs1[j].arrival.airport)) {
  //             arrAirport.push(this.scheduleDescs1[j].arrival.airport);
  //           }
  //         }
  //         for (let i = 0; i < this.cmbAirport.length; i++) {
  //           if (depAirport.includes(this.cmbAirport[i].code)) {
  //             this.airports1.departure.unshift({
  //               depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
  //               depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
  //             });
  //           }
  //         }
  //         for (let i = 0; i < this.cmbAirport.length; i++) {
  //           if (arrAirport.includes(this.cmbAirport[i].code)) {
  //             this.airports1.arrival.unshift({
  //               arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
  //               arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
  //             });
  //           }
  //         }
  //         break;
  //       case 1:
  //         this.airports2 = { departure: [], arrival: [] };
  //         this.cmbAirport = this.flightHelper.getAirportData();
  //         for (let j = 0; j < this.scheduleDescs2.length; j++) {
  //           if (!depAirport.includes(this.scheduleDescs2[j].departure.airport)) {
  //             depAirport.push(this.scheduleDescs2[j].departure.airport);
  //           }
  //           if (!arrAirport.includes(this.scheduleDescs2[j].arrival.airport)) {
  //             arrAirport.push(this.scheduleDescs2[j].arrival.airport);
  //           }
  //         }
  //         for (let i = 0; i < this.cmbAirport.length; i++) {
  //           if (depAirport.includes(this.cmbAirport[i].code)) {
  //             this.airports2.departure.unshift({
  //               depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
  //               depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
  //             });
  //           }
  //         }
  //         for (let i = 0; i < this.cmbAirport.length; i++) {
  //           if (arrAirport.includes(this.cmbAirport[i].code)) {
  //             this.airports2.arrival.unshift({
  //               arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
  //               arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
  //             });
  //           }
  //         }
  //         break;
  //       case 2:
  //         this.airports3 = { departure: [], arrival: [] };
  //         this.cmbAirport = this.flightHelper.getAirportData();
  //         for (let j = 0; j < this.scheduleDescs3.length; j++) {
  //           if (!depAirport.includes(this.scheduleDescs3[j].departure.airport)) {
  //             depAirport.push(this.scheduleDescs3[j].departure.airport);
  //           }
  //           if (!arrAirport.includes(this.scheduleDescs3[j].arrival.airport)) {
  //             arrAirport.push(this.scheduleDescs3[j].arrival.airport);
  //           }
  //         }
  //         for (let i = 0; i < this.cmbAirport.length; i++) {
  //           if (depAirport.includes(this.cmbAirport[i].code)) {
  //             this.airports3.departure.unshift({
  //               depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
  //               depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
  //             });
  //           }
  //         }
  //         for (let i = 0; i < this.cmbAirport.length; i++) {
  //           if (arrAirport.includes(this.cmbAirport[i].code)) {
  //             this.airports3.arrival.unshift({
  //               arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
  //               arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
  //             });
  //           }
  //         }
  //         break;
  //       case 3:
  //         this.airports4 = { departure: [], arrival: [] };
  //         this.cmbAirport = this.flightHelper.getAirportData();
  //         for (let j = 0; j < this.scheduleDescs4.length; j++) {
  //           if (!depAirport.includes(this.scheduleDescs4[j].departure.airport)) {
  //             depAirport.push(this.scheduleDescs4[j].departure.airport);
  //           }
  //           if (!arrAirport.includes(this.scheduleDescs4[j].arrival.airport)) {
  //             arrAirport.push(this.scheduleDescs4[j].arrival.airport);
  //           }
  //         }
  //         for (let i = 0; i < this.cmbAirport.length; i++) {
  //           if (depAirport.includes(this.cmbAirport[i].code)) {
  //             this.airports4.departure.unshift({
  //               depCode: this.cmbAirport[i].code, depName: this.cmbAirport[i].text,
  //               depCityName: this.cmbAirport[i].cityname, depCountryName: this.cmbAirport[i].countryname
  //             });
  //           }
  //         }
  //         for (let i = 0; i < this.cmbAirport.length; i++) {
  //           if (arrAirport.includes(this.cmbAirport[i].code)) {
  //             this.airports4.arrival.unshift({
  //               arrCode: this.cmbAirport[i].code, arrName: this.cmbAirport[i].text,
  //               arrCityName: this.cmbAirport[i].cityname, arrCountryName: this.cmbAirport[i].countryname
  //             });
  //           }
  //         }
  //         break;
  //     }
  //     this.topFlightSearchSkeleton = false;
  //     this.setFlightData(ind);
  //   }, 500);
  // }
  // setAirlineList() {
  //   this.authService.getAirlineInfo().subscribe(data => {
  //     this.airlines1 = [];
  //     this.airlines2 = [];
  //     this.airlines3 = [];
  //     this.airlines4 = [];
  //     var d = data.airlinelist;
  //     let flight: any[] = [];
  //     if (!this.shareService.isObjectEmpty(this.scheduleDescs1)) {
  //       let searchedAirline = this.scheduleDescs1;
  //       for (let j = 0; j < searchedAirline.length; j++) {
  //         let disclosure = searchedAirline[j].carrier.disclosure;
  //         if (disclosure != undefined && disclosure != "") {
  //           flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
  //         }
  //         flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
  //       }
  //       for (let i = 0; i < d.length; i++) {
  //         var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
  //         if (obj != "" && obj != undefined) {
  //           this.airlines1.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
  //         }
  //       }
  //       for (let i = 0; i < searchedAirline.length; i++) {
  //         for (let j = 0; j < this.airlines1.length; j++) {
  //           let disclosure = searchedAirline[i].carrier.disclosure;
  //           if (disclosure != undefined && disclosure != "") {
  //             if (this.airlines1[j].code == disclosure) {
  //               this.airlines1[j].data.unshift(searchedAirline[i]);
  //               break;
  //             }
  //           } else {
  //             if (this.airlines1[j].code == searchedAirline[i].carrier.marketing) {
  //               this.airlines1[j].data.unshift(searchedAirline[i]);
  //               break;
  //             }
  //           }
  //         }
  //       }
  //       this.setAirport(0);
  //       this.setItineryWiseAirlineInfo(d, 0);
  //     }
  //     if (!this.shareService.isObjectEmpty(this.scheduleDescs2)) {
  //       let searchedAirline = this.scheduleDescs2;
  //       for (let j = 0; j < searchedAirline.length; j++) {
  //         let disclosure = searchedAirline[j].carrier.disclosure;
  //         if (disclosure != undefined && disclosure != "") {
  //           flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
  //         }
  //         flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
  //       }
  //       for (let i = 0; i < d.length; i++) {
  //         var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
  //         if (obj != "" && obj != undefined) {
  //           this.airlines2.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
  //         }
  //       }
  //       for (let i = 0; i < searchedAirline.length; i++) {
  //         for (let j = 0; j < this.airlines2.length; j++) {
  //           let disclosure = searchedAirline[i].carrier.disclosure;
  //           if (disclosure != undefined && disclosure != "") {
  //             if (this.airlines2[j].code == disclosure) {
  //               this.airlines2[j].data.unshift(searchedAirline[i]);
  //               break;
  //             }
  //           } else {
  //             if (this.airlines2[j].code == searchedAirline[i].carrier.marketing) {
  //               this.airlines2[j].data.unshift(searchedAirline[i]);
  //               break;
  //             }
  //           }
  //         }
  //       }
  //       this.setAirport(1);
  //       this.setItineryWiseAirlineInfo(d, 1);
  //     }
  //     if (!this.shareService.isObjectEmpty(this.scheduleDescs3)) {
  //       let searchedAirline = this.scheduleDescs3;
  //       for (let j = 0; j < searchedAirline.length; j++) {
  //         let disclosure = searchedAirline[j].carrier.disclosure;
  //         if (disclosure != undefined && disclosure != "") {
  //           flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
  //         }
  //         flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
  //       }
  //       for (let i = 0; i < d.length; i++) {
  //         var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
  //         if (obj != "" && obj != undefined) {
  //           this.airlines3.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
  //         }
  //       }
  //       for (let i = 0; i < searchedAirline.length; i++) {
  //         for (let j = 0; j < this.airlines3.length; j++) {
  //           let disclosure = searchedAirline[i].carrier.disclosure;
  //           if (disclosure != undefined && disclosure != "") {
  //             if (this.airlines3[j].code == disclosure) {
  //               this.airlines3[j].data.unshift(searchedAirline[i]);
  //               break;
  //             }
  //           } else {
  //             if (this.airlines3[j].code == searchedAirline[i].carrier.marketing) {
  //               this.airlines3[j].data.unshift(searchedAirline[i]);
  //               break;
  //             }
  //           }
  //         }
  //       }
  //       this.setAirport(2);
  //       this.setItineryWiseAirlineInfo(d, 2);
  //     }
  //     if (!this.shareService.isObjectEmpty(this.scheduleDescs4)) {
  //       let searchedAirline = this.scheduleDescs4;
  //       for (let j = 0; j < searchedAirline.length; j++) {
  //         let disclosure = searchedAirline[j].carrier.disclosure;
  //         if (disclosure != undefined && disclosure != "") {
  //           flight.push({ flightCode: disclosure, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
  //         }
  //         flight.push({ flightCode: searchedAirline[j].carrier.marketing, flightNumber: searchedAirline[j].carrier.marketingFlightNumber });
  //       }
  //       for (let i = 0; i < d.length; i++) {
  //         var obj = flight.find(x => x.flightCode == d[i].nvIataDesignator);
  //         if (obj != "" && obj != undefined) {
  //           this.airlines4.push({ code: d[i].nvIataDesignator, logo: '', number: obj.flightNumber, name: d[i].nvAirlinesName, data: [], itineryData: [] });
  //         }
  //       }
  //       for (let i = 0; i < searchedAirline.length; i++) {
  //         for (let j = 0; j < this.airlines4.length; j++) {
  //           let disclosure = searchedAirline[i].carrier.disclosure;
  //           if (disclosure != undefined && disclosure != "") {
  //             if (this.airlines4[j].code == disclosure) {
  //               this.airlines4[j].data.unshift(searchedAirline[i]);
  //               break;
  //             }
  //           } else {
  //             if (this.airlines4[j].code == searchedAirline[i].carrier.marketing) {
  //               this.airlines4[j].data.unshift(searchedAirline[i]);
  //               break;
  //             }
  //           }
  //         }
  //       }
  //       this.setAirport(3);
  //       this.setItineryWiseAirlineInfo(d, 3);
  //     }
  //   }, err => {
  //     console.log(JSON.stringify(err));
  //   });
  // }
  // setItineryWiseAirlineInfo(data: any, ind: number) {
  //   switch (ind) {
  //     case 0:
  //       for (let i = 0; i < this.itineraries1.length; i++) {
  //         for (let j = 0; j < this.airlines1.length; j++) {
  //           let marketing = this.itineraries1[i].pricingInformation[0].fare.validatingCarrierCode;
  //           if (this.flightHelper.getCurrentFlightCode(this.airlines1[j].code, this.scheduleDescs1) == marketing) {
  //             this.airlines1[j].itineryData.unshift(this.itineraries1[i].pricingInformation[0].fare);
  //             break;
  //           }
  //         }
  //       }
  //       for (let i = 0; i < this.airlines1.length; i++) {
  //         for (let j = 0; j < data.length; j++) {
  //           if (this.airlines1[i].code.toString().toLowerCase().trim()
  //             == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
  //             this.airlines1[i].logo = data[j].vLogo;
  //             break;
  //           }
  //         }
  //       }
  //       break;
  //     case 1:
  //       for (let i = 0; i < this.itineraries2.length; i++) {
  //         for (let j = 0; j < this.airlines2.length; j++) {
  //           let marketing = this.itineraries2[i].pricingInformation[0].fare.validatingCarrierCode;
  //           if (this.flightHelper.getCurrentFlightCode(this.airlines2[j].code, this.scheduleDescs2) == marketing) {
  //             this.airlines2[j].itineryData.unshift(this.itineraries2[i].pricingInformation[0].fare);
  //             break;
  //           }
  //         }
  //       }
  //       for (let i = 0; i < this.airlines2.length; i++) {
  //         for (let j = 0; j < data.length; j++) {
  //           if (this.airlines2[i].code.toString().toLowerCase().trim()
  //             == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
  //             this.airlines2[i].logo = data[j].vLogo;
  //             break;
  //           }
  //         }
  //       }
  //       break;
  //     case 2:
  //       for (let i = 0; i < this.itineraries3.length; i++) {
  //         for (let j = 0; j < this.airlines3.length; j++) {
  //           let marketing = this.itineraries3[i].pricingInformation[0].fare.validatingCarrierCode;
  //           if (this.flightHelper.getCurrentFlightCode(this.airlines3[j].code, this.scheduleDescs3) == marketing) {
  //             this.airlines3[j].itineryData.unshift(this.itineraries3[i].pricingInformation[0].fare);
  //             break;
  //           }
  //         }
  //       }
  //       for (let i = 0; i < this.airlines3.length; i++) {
  //         for (let j = 0; j < data.length; j++) {
  //           if (this.airlines3[i].code.toString().toLowerCase().trim()
  //             == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
  //             this.airlines3[i].logo = data[j].vLogo;
  //             break;
  //           }
  //         }
  //       }
  //       break;
  //     case 3:
  //       for (let i = 0; i < this.itineraries4.length; i++) {
  //         for (let j = 0; j < this.airlines4.length; j++) {
  //           let marketing = this.itineraries4[i].pricingInformation[0].fare.validatingCarrierCode;
  //           if (this.flightHelper.getCurrentFlightCode(this.airlines4[j].code, this.scheduleDescs4) == marketing) {
  //             this.airlines4[j].itineryData.unshift(this.itineraries4[i].pricingInformation[0].fare);
  //             break;
  //           }
  //         }
  //       }
  //       for (let i = 0; i < this.airlines4.length; i++) {
  //         for (let j = 0; j < data.length; j++) {
  //           if (this.airlines4[i].code.toString().toLowerCase().trim()
  //             == data[j].nvIataDesignator.toString().toLowerCase().trim()) {
  //             this.airlines4[i].logo = data[j].vLogo;
  //             break;
  //           }
  //         }
  //       }
  //       break;
  //   }
  // }
  // private _setLoaderValue(obj: any) {
  //   try {
  //     this.fromFlight = obj.fromFlightName;
  //     this.toFlight = obj.toFlightName;
  //     this.departureDate = obj.departureDate;
  //     this.returnDate = obj.departureDate;
  //     this.adult = obj.adult != undefined ? obj.adult : "0";
  //     this.child = obj.childList.length != undefined ? obj.childList.length : "0";
  //     this.infant = obj.infant != undefined ? obj.infant : "0";
  //     this.isLoad = true;
  //     this.cabinTypeId = this.flightHelper.getCabinTypeId(obj.classType),
  //       this.tripTypeId = this.getTripTypeId()

  //     if (obj.childList.length > 0) {
  //       if (obj.childList[0].age == "" || obj.childList[0].age == undefined) {
  //         this.childListFinal = [];
  //         this.childList = [];
  //         this.childList2 = [];
  //         this.child = "0";
  //       }
  //     }
  //   } catch (exp) { }
  // }
  // moveLeftFlight() {
  //   this.flightItem.moveLeft();
  // }

  // moveRightFlight() {
  //   this.flightItem.moveRight();
  // }
  // moveLeftFare() {
  //   this.fareItem.moveLeft();
  // }

  // moveRightFare() {
  //   this.fareItem.moveRight();
  // }
  // // private _setPanelSearchHeader(data: any) {
  // //   try {
  // //     this.isOneway = data.isOneWay;
  // //     this.isRoundtrip = data.isRoundTrip;
  // //     this.isMulticity = data.isMultiCity;
  // //     this.childListFinal = data.childList;
  // //     this.childList = data.childList1;
  // //     this.childList2 = data.childList2;
  // //     this.num1 = data.adult;
  // //     this.num2 = data.childList.length;
  // //     this.num3 = data.infant;
  // //     this.selectedClassTypeId = data.cabinTypeId;
  // //     this.selectedClassTypeCode = data.classType;
  // //     this.selectedClassTypeName = this.flightHelper.getCabinTypeName(data.classType);
  // //     let tripVal = this.isOneway ? "1" : (this.isRoundtrip ? "2" : "3");
  // //     this.selectTripType.setValue(tripVal);
  // //     this.selectedTripTypeId = this.flightHelper.getTripTypeId(parseInt(tripVal));

  // //     for (let i = 0; i < this.paramModelData.Departure.length; i++) {
  // //       this.selectedFlightDeparture[i].CityName = data.Departure[i].CityName;
  // //       this.selectedFlightDeparture[i].CountryCode = data.Departure[i].CountryCode;
  // //       this.selectedFlightDeparture[i].CountryName = data.Departure[i].CountryName;
  // //       this.selectedFlightDeparture[i].AirportName = data.Departure[i].AirportName;
  // //       this.selectedFlightDeparturePanel[i].CityName = data.Departure[i].CityName;
  // //       this.selectedFlightDeparturePanel[i].CountryCode = data.Departure[i].CountryCode;
  // //       this.selectedFlightDeparturePanel[i].CountryName = data.Departure[i].CountryName;
  // //       this.selectedFlightDeparturePanel[i].AirportName = data.Departure[i].AirportName;
  // //       this.selectedFlightDepartureMobile[i].CityName = data.Departure[i].CityName;
  // //       this.selectedFlightDepartureMobile[i].CountryName = data.Departure[i].CountryName;

  // //       this.selectedFlightArrival[i].CityName = data.Arrival[i].CityName;
  // //       this.selectedFlightArrival[i].CountryCode = data.Arrival[i].CountryCode;
  // //       this.selectedFlightArrival[i].CountryName = data.Arrival[i].CountryName;
  // //       this.selectedFlightArrival[i].AirportName = data.Arrival[i].AirportName;
  // //       this.selectedFlightArrivalPanel[i].CityName = data.Arrival[i].CityName;
  // //       this.selectedFlightArrivalPanel[i].CountryCode = data.Arrival[i].CountryCode;
  // //       this.selectedFlightArrivalPanel[i].CountryName = data.Arrival[i].CountryName;
  // //       this.selectedFlightArrivalPanel[i].AirportName = data.Arrival[i].AirportName;
  // //       this.selectedFlightArrivalMobile[i].CityName = data.Arrival[i].CityName;
  // //       this.selectedFlightArrivalMobile[i].CountryName = data.Arrival[i].CountryName;

  // //       if (i == 0 && this.isRoundtrip) {
  // //         this.selectedFlightArrival[i].Date = data.Arrival[i].Date;
  // //       }
  // //     }
  // //     flatpickr(".flat-datepick-from0", {
  // //       enableTime: false,
  // //       dateFormat: "d-m-Y",
  // //       allowInput: true,
  // //       minDate: "today"
  // //     });
  // //   } catch (exp) { }
  // // }
  // private setDeparturePanel(date: any) {
  //   this.selectedDeparturePanelText =
  //     this.shareService.getDayNameShort(date) + ", " +
  //     this.shareService.getDay(date) + " " +
  //     this.shareService.getMonthShort(date) + "'" +
  //     this.shareService.getYearShort(date);
  // }
  // private setReturnPanel(date: any) {
  //   this.selectedReturnPanelText =
  //     this.shareService.getDayNameShort(date) + ", " +
  //     this.shareService.getDay(date) + " " +
  //     this.shareService.getMonthShort(date) + "'" +
  //     this.shareService.getYearShort(date);
  // }
  // public loadScript() {
  //   let node4 = document.createElement("script");
  //   node4.src = this.urlMain;
  //   node4.type = "text/javascript";
  //   node4.async = true;
  //   node4.charset = "utf-8";
  //   document.getElementsByTagName("head")[0].appendChild(node4);
  // }

  // dateChangeApi(type: boolean = true, item:any) {
  //   this.isCancellationShow = true;
  //   try {
  //     let dateCancel:DateChangeCancelModel={
  //       providerId: item.providerId,
  //       departureDate: item.departureDate,
  //       departureCityCode: item.departureCityCode,
  //       arrivalCityCode: item.arrivalCityCode,
  //       airlineCode: item.airlineCode,
  //       fareBasisCode: item.fareBasisCode,
  //       flightRouteTypeId: item.flightRouteTypeId,
  //       tripTypeId: item.tripTypeId
  //     };
  //     this.authService.getDateChanges(dateCancel).subscribe(data => {
  //       console.log(JSON.stringify(data));
  //       this.setResponseText(data.res, data.amount, dateCancel.airlineCode, type);
  //       this.isCancellationShow = false;
  //     }, err => {

  //     });
  //   } catch (exp) {
  //     console.log(exp);
  //   }
  // }
  // dateChangeApiMulti(type: boolean = true) {
  //   this.isCancellationShow1 = true;
  //   this.isCancellationShow2 = true;
  //   this.isCancellationShow3 = true;
  //   this.isCancellationShow4 = true;
  //   console.log("Date changes action::");
  //   try {
  //     console.log("select flight data::");
  //     console.log(this.selectedFlightDeparture.length);
  //     console.log(this.selectedFlightData);
  //     let len = this.selectedFlightDeparture.length;
  //     if (len > 0) {
  //       let dateCancel1:DateChangeCancelModel={
  //         providerId: this.selectedFlightData.data1.providerId,
  //         departureDate: this.selectedFlightData.data1.departureDate,
  //         departureCityCode: this.selectedFlightData.data1.departureCityCode,
  //         arrivalCityCode: this.selectedFlightData.data1.arrivalCityCode,
  //         airlineCode: this.selectedFlightData.data1.airlineCode,
  //         fareBasisCode: this.selectedFlightData.data1.fareBasisCode,
  //         flightRouteTypeId: this.selectedFlightData.data1.flightRouteTypeId,
  //         tripTypeId: this.selectedFlightData.data1.tripTypeId
  //       };
  //       console.log(this.selectedFlightData);
  //       this.authService.getDateChanges(dateCancel1).subscribe(data => {

  //           console.log(JSON.stringify(data));
  //           this.setResponseText(data.res, data.amount, dateCancel1.airlineCode, type);
  //           this.isCancellationShow1 = false;
  //         }, err => {

  //         });
  //     }
  //     if (len > 1) {
  //       let dateCancel2:DateChangeCancelModel={
  //         providerId: this.selectedFlightData.data2.providerId,
  //         departureDate: this.selectedFlightData.data2.departureDate,
  //         departureCityCode: this.selectedFlightData.data2.departureCityCode,
  //         arrivalCityCode: this.selectedFlightData.data2.arrivalCityCode,
  //         airlineCode: this.selectedFlightData.data2.airlineCode,
  //         fareBasisCode: this.selectedFlightData.data2.fareBasisCode,
  //         flightRouteTypeId: this.selectedFlightData.data2.flightRouteTypeId,
  //         tripTypeId: this.selectedFlightData.data2.tripTypeId
  //       };
  //       this.authService.getDateChanges(dateCancel2).subscribe(data => {

  //           console.log(JSON.stringify(data));
  //           this.setResponseText(data.res, data.amount, dateCancel2.airlineCode, type);
  //           this.isCancellationShow2 = false;
  //         }, err => {

  //         });
  //     }
  //     if (len > 2) {
  //       let dateCancel3:DateChangeCancelModel={
  //         providerId: this.selectedFlightData.data3.providerId,
  //         departureDate: this.selectedFlightData.data3.departureDate,
  //         departureCityCode: this.selectedFlightData.data3.departureCityCode,
  //         arrivalCityCode: this.selectedFlightData.data3.arrivalCityCode,
  //         airlineCode: this.selectedFlightData.data3.airlineCode,
  //         fareBasisCode: this.selectedFlightData.data3.fareBasisCode,
  //         flightRouteTypeId: this.selectedFlightData.data3.flightRouteTypeId,
  //         tripTypeId: this.selectedFlightData.data3.tripTypeId
  //       };
  //       this.authService.getDateChanges(dateCancel3).subscribe(data => {

  //           console.log(JSON.stringify(data));
  //           this.setResponseText(data.res, data.amount, dateCancel3.airlineCode, type);
  //           this.isCancellationShow3 = false;
  //         }, err => {

  //         });
  //     }
  //     if (len > 3) {
  //       let dateCancel4:DateChangeCancelModel={
  //         providerId: this.selectedFlightData.data4.providerId,
  //         departureDate: this.selectedFlightData.data4.departureDate,
  //         departureCityCode: this.selectedFlightData.data4.departureCityCode,
  //         arrivalCityCode: this.selectedFlightData.data4.arrivalCityCode,
  //         airlineCode: this.selectedFlightData.data4.airlineCode,
  //         fareBasisCode: this.selectedFlightData.data4.fareBasisCode,
  //         flightRouteTypeId: this.selectedFlightData.data4.flightRouteTypeId,
  //         tripTypeId: this.selectedFlightData.data4.tripTypeId
  //       };
  //       this.authService.getDateChanges(dateCancel4).subscribe(data => {

  //           console.log(JSON.stringify(data));
  //           this.setResponseText(data.res, data.amount, dateCancel4.airlineCode, type);
  //           this.isCancellationShow4 = false;
  //         }, err => {

  //         });
  //     }
  //   } catch (exp) {
  //     console.log(exp);
  //   }
  // }
  // setResponseText(data: any, amount: any, airlineCode: any, type: boolean, way: number = -1) {
  //   try {
  //     this.authService.getResponseSearchText(airlineCode, type == true ? "Date Change" : "Cancel").subscribe(subData => {
  //       var d = console.log(data);
  //       var firstCap = "", secondCap = "";
  //       try {
  //         firstCap = subData.data[0].nvFirstSentence;
  //         secondCap = subData.data[0].nvLastSentence;
  //       } catch (exp) { }
  //       if (type == true) {
  //         this.setDateChangesAmount(data, amount, firstCap, secondCap, way);
  //       } else {
  //         this.setCancellationAmount(data, amount, firstCap, secondCap, way);
  //       }
  //     }, err => { });
  //   } catch (exp) {
  //     console.log(exp);
  //   }
  // }
  // setDateChangesAmount(data: any, amount: any, firstCap: any, lastCap: any, way: number = -1) {
  //   this.amtDateChanges = "";
  //   this.amtDateChangesPlus = this.shareService.amountShowWithCommas(Math.round(amount));
  //   this.amtDateChangesPre = "";
  //   let envData = data["soap-env:Envelope"];
  //   let envBody = envData["soap-env:Body"];
  //   try {
  //     let fareParaList = envBody.OTA_AirRulesRS.FareRuleInfo.Rules.Paragraph;
  //     let amt = "", pre = "";

  //     for (let item of fareParaList) {
  //       if (item.Title.indexOf('PENALTIES') > -1) {
  //         let txt = item.Text.toString().replace(/\s+/g, ' ').trim();
  //         let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
  //         crop = crop.toString().trim();
  //         amt = crop.split(' ')[1];
  //         pre = crop.split(' ')[0];
  //       }
  //     }
  //     this.amtDateChanges = amt;
  //     this.amtDateChangesPre = pre;
  //     switch (way) {
  //       case 0:
  //         this.amtDateChanges1 = amt;
  //         this.amtDateChangesPre1 = pre;
  //         break;
  //       case 1:
  //         this.amtDateChanges2 = amt;
  //         this.amtDateChangesPre2 = pre;
  //         break;
  //       case 2:
  //         this.amtDateChanges3 = amt;
  //         this.amtDateChangesPre3 = pre;
  //         break;
  //       case 3:
  //         this.amtDateChanges4 = amt;
  //         this.amtDateChangesPre4 = pre;
  //         break;
  //     }
  //   } catch (exp) {
  //     let fare = envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
  //     let txt = fare.toString().replace(/\s+/g, ' ').trim();
  //     let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
  //     this.amtDateChanges = crop.split(' ')[1];
  //     this.amtDateChangesPre = crop.split(' ')[0];
  //     switch (way) {
  //       case 0:
  //         this.amtDateChanges1 = crop.split(' ')[1];
  //         this.amtDateChangesPre1 = crop.split(' ')[0];
  //         break;
  //       case 1:
  //         this.amtDateChanges2 = crop.split(' ')[1];
  //         this.amtDateChangesPre2 = crop.split(' ')[0];
  //         break;
  //       case 2:
  //         this.amtDateChanges3 = crop.split(' ')[1];
  //         this.amtDateChangesPre3 = crop.split(' ')[0];
  //         break;
  //       case 3:
  //         this.amtDateChanges4 = crop.split(' ')[1];
  //         this.amtDateChangesPre4 = crop.split(' ')[0];
  //         break;
  //     }
  //   }
  // }
  // setCancellationAmount(data: any, amount: any, firstCap: any, lastCap: any, way: number = -1) {
  //   this.amtCancellation = "";
  //   this.amtCancellationPre = "";
  //   this.amtCancellationPlus = this.shareService.amountShowWithCommas(Math.round(amount));
  //   let envData = data["soap-env:Envelope"];
  //   let envBody = envData["soap-env:Body"];
  //   try {
  //     let fareParaList = envBody.OTA_AirRulesRS.FareRuleInfo.Rules.Paragraph;
  //     let amt = "", pre = "";

  //     for (let item of fareParaList) {
  //       if (item.Title.indexOf('PENALTIES') > -1) {
  //         let txt = item.Text.toString().replace(/\s+/g, ' ').trim();
  //         let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
  //         crop = crop.toString().trim();
  //         amt = crop.split(' ')[1];
  //         pre = crop.split(' ')[0];
  //       }
  //     }
  //     this.amtCancellation = amt;
  //     this.amtCancellationPre = pre;
  //     switch (way) {
  //       case 0:
  //         this.amtCancellation1 = amt;
  //         this.amtCancellationPre1 = pre;
  //         break;
  //       case 1:
  //         this.amtCancellation2 = amt;
  //         this.amtCancellationPre2 = pre;
  //         break;
  //       case 2:
  //         this.amtCancellation3 = amt;
  //         this.amtCancellationPre3 = pre;
  //         break;
  //       case 3:
  //         this.amtCancellation4 = amt;
  //         this.amtCancellationPre4 = pre;
  //         break;
  //     }
  //   } catch (exp) {
  //     let fare = envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
  //     let txt = fare.toString().replace(/\s+/g, ' ').trim();
  //     let crop = txt.substring(txt.indexOf(firstCap) + firstCap.length, txt.indexOf(lastCap));
  //     this.amtCancellation = crop.split(' ')[1];
  //     this.amtCancellationPre = crop.split(' ')[0];
  //     switch (way) {
  //       case 0:
  //         this.amtCancellation1 = crop.split(' ')[1];
  //         this.amtCancellationPre1 = crop.split(' ')[0];
  //         break;
  //       case 1:
  //         this.amtCancellation2 = crop.split(' ')[1];
  //         this.amtCancellationPre2 = crop.split(' ')[0];
  //         break;
  //       case 2:
  //         this.amtCancellation3 = crop.split(' ')[1];
  //         this.amtCancellationPre3 = crop.split(' ')[0];
  //         break;
  //       case 3:
  //         this.amtCancellation4 = crop.split(' ')[1];
  //         this.amtCancellationPre4 = crop.split(' ')[0];
  //         break;
  //     }
  //   }
  // }
  // getDateChanges(refund: boolean, passenger: any, way: number = -1): any {
  //   try {
  //     let dateChanges = this.amtDateChanges, dateChangesPlus = this.amtDateChangesPlus, dateChangesPre = this.amtDateChangesPre;
  //     switch (way) {
  //       case 0:
  //         dateChanges = this.amtDateChanges1;
  //         dateChangesPre = this.amtDateChangesPre1;
  //         break;
  //       case 1:
  //         dateChanges = this.amtDateChanges2;
  //         dateChangesPre = this.amtDateChangesPre2;
  //         break;
  //       case 2:
  //         dateChanges = this.amtDateChanges3;
  //         dateChangesPre = this.amtDateChangesPre3;
  //         break;
  //       case 3:
  //         dateChanges = this.amtDateChanges4;
  //         dateChangesPre = this.amtDateChangesPre4;
  //         break;
  //     }
  //     if (refund == false) {
  //       return "Non Refundable + " + dateChangesPlus + "";
  //     } else {
  //       if (dateChanges == "" || dateChanges == undefined) {
  //         return "Airline Fee " + " + " + dateChangesPlus + "";
  //       }
  //       return dateChangesPre + " " + this.shareService.amountShowWithCommas(Math.round(parseFloat(dateChanges) * parseInt(passenger))) + " + " + dateChangesPlus + "";
  //     }
  //   } catch (exp) { }
  // }
  // getCancellation(refund: boolean, passenger: any, way: number = -1): any {
  //   try {
  //     let dateChanges = this.amtCancellation, dateChangesPlus = this.amtCancellationPlus, dateChangesPre = this.amtCancellationPre;
  //     switch (way) {
  //       case 0:
  //         dateChanges = this.amtCancellation1;
  //         dateChangesPre = this.amtCancellationPre1;
  //         break;
  //       case 1:
  //         dateChanges = this.amtCancellation2;
  //         dateChangesPre = this.amtCancellationPre2;
  //         break;
  //       case 2:
  //         dateChanges = this.amtCancellation3;
  //         dateChangesPre = this.amtCancellationPre3;
  //         break;
  //       case 3:
  //         dateChanges = this.amtCancellation4;
  //         dateChangesPre = this.amtCancellationPre4;
  //         break;
  //     }
  //     if (refund == false) {
  //       return "Non Refundable + " + dateChangesPlus + "";
  //     } else {
  //       if (dateChanges == "" || dateChanges == undefined) {
  //         return "Airline Fee " + " + " + dateChangesPlus + "";
  //       }
  //       return dateChangesPre + " " + this.shareService.amountShowWithCommas(Math.round(parseFloat(dateChanges) * parseInt(passenger))) + " + " + dateChangesPlus + "";
  //     }
  //   } catch (exp) { }
  // }
}
