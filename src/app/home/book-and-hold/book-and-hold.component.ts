import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { AuthService } from 'src/app/_services/auth.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { GenderTitleModel } from 'src/app/model/gender-title-model';
import { PassengerInfoModel } from 'src/app/model/passenger-info-model';
import Swal from 'sweetalert2';
import { FlightHelperService } from '../flight-helper.service';
import yearDropdownPlugin from 'src/app/_services/flatpickr-yearDropdownPlugin';

@Component({
  selector: 'app-book-and-hold',
  templateUrl: './book-and-hold.component.html',
  styleUrls: ['./book-and-hold.component.css']
})
export class BookAndHoldComponent implements OnInit {
  selectedCommonFlight: any;
  commonFlightDetails:any;
  bookAndHold: BookAndHold | any;
  adultDetailsArray: PassDetails[] = [];
  totalAdult:any;
  totalInfant:any;
  totalChild:any;
  flightType:any;
  TripType: any = '';
  agencyId:any;
  agenyInfo:any;
  showPassportDiv = true;
  countrylists: any = [];
  readonly iAdultBDateAge: number = 12;
  selectedCountry: string | undefined;

  loadedGenderTitleList:any[]=[];
  genderTitleListAdult:GenderTitleModel[]=[];
  genderTitleListChild:GenderTitleModel[]=[];
  genderTitleListInfant:GenderTitleModel[]=[];
  passengerInfoListAdult:PassengerInfoModel[]=[];
  passengerInfoListChild:PassengerInfoModel[]=[];
  passengerInfoListInfant:PassengerInfoModel[]=[];
  onlyChildInfant:any[]=['1BECFC19-114F-405B-8C5A-078ADD34CC85','451AA67B-BC10-444F-AEC0-53BACA61AA1B'];

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService,
    public shareService: ShareService, private toastrService: ToastrService,
    @Inject(DOCUMENT) private document: Document, private renderer: Renderer2, public flightHelper: FlightHelperService,
    private storage:LocalStorageService) { }

  ngOnInit(): void {

    this.renderer.addClass(this.document.body, 'flight_search_details');
    // Retrieve the passed data from state
    this.route.paramMap.subscribe(params => {
      this.selectedCommonFlight = history.state.selectedCommonFlight;
      this.commonFlightDetails = this.selectedCommonFlight;
    });
    if(this.commonFlightDetails==null){
      this.router.navigate(['/home/common-flight-search']);
    }
    var isDomestic = localStorage.getItem('isDomestic');
    var showPassport = localStorage.getItem('showPassportDiv');
    if(showPassport == 'false'){
      this.showPassportDiv = false;
    }
    if(isDomestic=='True'){
      this.TripType="Domestic";
    }else{
      this.TripType="International";
    }
    console.log(this.commonFlightDetails);
    var model = JSON.parse(localStorage.getItem('loaderData')!);
    this.totalAdult = parseFloat(model.adult);
    this.totalInfant = parseFloat(model.infant);
    this.totalChild = parseFloat(model.childList.length);

    if(model.isOneWay){
      this.flightType=FlightTypes.OneWay;
    }else if(model.isRoundTrip){
      this.flightType=FlightTypes.RoundTrip;
    }else if(model.isMultiCity){
      this.flightType=FlightTypes.Multicity;
    }
    this.init();
    this.calculationInvoiceSummary();
    this.agencyId=this.shareService.getUserId();
    this.authService.getAgency(this.agencyId).subscribe(data => {
      this.agenyInfo = data.data[0] ;
    });
  }
  init() {
    this._getCountryList();
    this._passengerInfoLoad();
    this._genderTitleLoad();
    var departureDate = JSON.parse(localStorage.getItem('departureDate')!);
    const lastElement: string = departureDate.slice(-1)[0];
    
    let date="";
    let adultMaxDate=this.shareService.setDate(-this.iAdultBDateAge,0,-1,date);
    //let infantMinDate = this.shareService.setDate(-2, 0, +4, date);
    let infantMinDate = this.shareService.getDateBeforeNDays(lastElement,726);// for infant
    //let childMinDate=this.shareService.setDate(-11,0,0,date);
    let childMinDate= this.shareService.getDateBeforeNDays(lastElement,4378);//for child
    setTimeout(()=>{
      for (let i = 0; i < this.totalAdult; i++) {
        flatpickr(".adultexpire-date"+i,{
          plugins: [
            yearDropdownPlugin({
             date: new Date(),
             yearStart: 0,
             yearEnd: 50
           })
         ],
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:this.shareService.getFlatPickDate(date)
        });
        flatpickr(".adult-bdate"+i,{
          plugins: [
            yearDropdownPlugin({
             date: adultMaxDate,
             yearStart: 200,
             yearEnd: 0
           })
         ],
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          maxDate:this.shareService.getFlatPickDateFromDate(adultMaxDate)
        });
      }
      for (let i = 0; i < this.totalInfant; i++) {
        flatpickr(".infantexpire-date"+i,{
          plugins: [
            yearDropdownPlugin({
             date: new Date(),
             yearStart: 0,
             yearEnd: 50
           })
         ],
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:this.shareService.getFlatPickDate(date)
        });
        flatpickr(".infant-bdate"+i,{
          plugins: [
            yearDropdownPlugin({
             date: new Date(),
             yearStart: 2,
             yearEnd: 0
           })
         ],
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:this.shareService.getFlatPickDateFromDate(infantMinDate),
          maxDate:this.shareService.getFlatPickDate(date)
        });
      }
      for (let i = 0; i < this.totalChild; i++) {
        flatpickr(".childexpire-date"+i,{
          plugins: [
            yearDropdownPlugin({
             date: new Date(),
             yearStart: 0,
             yearEnd: 50
           })
         ],
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:this.shareService.getFlatPickDate(date)
        });
        flatpickr(".child-bdate"+i,{
          plugins: [
            yearDropdownPlugin({
             date: new Date(),
             yearStart: 12,
             yearEnd: 0
           })
         ],
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput:true,
          minDate:this.shareService.getFlatPickDateFromDate(childMinDate),
          maxDate:this.shareService.getFlatPickDate(date),
        });
      }
    });
  }

  isBookClicked:boolean=false;
  adultBase:number=0;
  adultTax:number=0;
  adultClientFare:number=0;
  adultDisount:number=0;
  adultAgentFare:number=0;

  childBase:number=0;
  childTax:number=0;
  childClientFare:number=0;
  childDisount:number=0;
  childAgentFare:number=0;

  infantBase:number=0;
  infantTax:number=0;
  infantClientFare:number=0;
  infantDisount:number=0;
  infantAgentFare:number=0;

  adultPassSelectedFile: any=[];
  adultVisaSelectedFile: any=[];
  childPassSelectedFile: any = [];
  childVisaSelectedFile: any = [];
  infantPassSelectedFile: any = [];
  infantVisaSelectedFile: any = [];

  calculationInvoiceSummary(){
    if(this.TripType =="Domestic"){
      if(this.totalAdult>0){
        this.commonFlightDetails.forEach((element:any) => {
          this.adultBase += parseFloat(element.fareDetails[0].markupBaseFare) * this.totalAdult;
          this.adultTax += parseFloat(element.fareDetails[0].markupTaxFare) * this.totalAdult;
          this.adultClientFare += parseFloat(element.fareDetails[0].markupTotalFare) * this.totalAdult;
          this.adultDisount += parseFloat(element.fareDetails[0].discount) * this.totalAdult;
          this.adultAgentFare += parseFloat(element.fareDetails[0].totalAgentFare) * this.totalAdult;
        });
      }
      if(this.totalChild>0){
        try {
          this.commonFlightDetails.forEach((element:any) => {
            this.childBase += parseFloat(element.fareDetails[1].markupBaseFare) * this.totalChild;
            this.childTax += parseFloat(element.fareDetails[1].markupTaxFare) * this.totalChild;
            this.childClientFare += parseFloat(element.fareDetails[1].markupTotalFare) * this.totalChild;
            this.childDisount += parseFloat(element.fareDetails[1].discount) * this.totalChild;
            this.childAgentFare += parseFloat(element.fareDetails[1].totalAgentFare) * this.totalChild;
          });
        } catch {
          this.commonFlightDetails.forEach((element:any) => {
            this.childBase += parseFloat(element.fareDetails[0].markupBaseFare) * this.totalChild;
            this.childTax += parseFloat(element.fareDetails[0].markupTaxFare) * this.totalChild;
            this.childClientFare += parseFloat(element.fareDetails[0].markupTotalFare) * this.totalChild;
            this.childDisount += parseFloat(element.fareDetails[0].discount) * this.totalChild;
            this.childAgentFare += parseFloat(element.fareDetails[0].totalAgentFare) * this.totalChild;
          });
        }
      }
      if(this.totalInfant>0){
        this.commonFlightDetails.forEach((element:any) => {
          try{
            this.infantBase += parseFloat(element.fareDetails[2].markupBaseFare) * this.totalInfant;
            this.infantTax += parseFloat(element.fareDetails[2].markupTaxFare) * this.totalInfant;
            this.infantClientFare += parseFloat(element.fareDetails[2].markupTotalFare) * this.totalInfant;
            this.infantDisount += parseFloat(element.fareDetails[2].discount) * this.totalInfant;
            this.infantAgentFare += parseFloat(element.fareDetails[2].totalAgentFare) * this.totalInfant;
          }catch{
            this.infantBase += parseFloat(element.fareDetails[1].markupBaseFare) * this.totalInfant;
            this.infantTax += parseFloat(element.fareDetails[1].markupTaxFare) * this.totalInfant;
            this.infantClientFare += parseFloat(element.fareDetails[1].markupTotalFare) * this.totalInfant;
            this.infantDisount += parseFloat(element.fareDetails[1].discount) * this.totalInfant;
            this.infantAgentFare += parseFloat(element.fareDetails[1].totalAgentFare) * this.totalInfant;
          }
        });
      }
    }
    else if(this.TripType == "International"){
      if(this.totalAdult>0){
        this.adultBase = parseFloat(this.commonFlightDetails[0].fareDetails[0].markupBaseFare) * this.totalAdult;
        this.adultTax = parseFloat(this.commonFlightDetails[0].fareDetails[0].markupTaxFare) * this.totalAdult;
        this.adultClientFare = parseFloat(this.commonFlightDetails[0].fareDetails[0].markupTotalFare) * this.totalAdult;
        this.adultDisount = parseFloat(this.commonFlightDetails[0].fareDetails[0].discount) * this.totalAdult;
        this.adultAgentFare = parseFloat(this.commonFlightDetails[0].fareDetails[0].totalAgentFare) * this.totalAdult;
      }
      if(this.totalChild>0){
        this.childBase = parseFloat(this.commonFlightDetails[0].fareDetails[1].markupBaseFare) * this.totalChild;
        this.childTax = parseFloat(this.commonFlightDetails[0].fareDetails[1].markupTaxFare) * this.totalChild;
        this.childClientFare = parseFloat(this.commonFlightDetails[0].fareDetails[1].markupTotalFare) * this.totalChild;
        this.childDisount = parseFloat(this.commonFlightDetails[0].fareDetails[1].discount) * this.totalChild;
        this.childAgentFare = parseFloat(this.commonFlightDetails[0].fareDetails[1].totalAgentFare) * this.totalChild;
      }
      if(this.totalInfant>0){
        try{
          this.infantBase = parseFloat(this.commonFlightDetails[0].fareDetails[2].markupBaseFare) * this.totalInfant;
          this.infantTax = parseFloat(this.commonFlightDetails[0].fareDetails[2].markupTaxFare) * this.totalInfant;
          this.infantClientFare = parseFloat(this.commonFlightDetails[0].fareDetails[2].markupTotalFare) * this.totalInfant;
          this.infantDisount = parseFloat(this.commonFlightDetails[0].fareDetails[2].discount) * this.totalInfant;
          this.infantAgentFare = parseFloat(this.commonFlightDetails[0].fareDetails[2].totalAgentFare) * this.totalInfant;
        }catch
        {
          this.infantBase = parseFloat(this.commonFlightDetails[0].fareDetails[1].markupBaseFare) * this.totalInfant;
          this.infantTax = parseFloat(this.commonFlightDetails[0].fareDetails[1].markupTaxFare) * this.totalInfant;
          this.infantClientFare = parseFloat(this.commonFlightDetails[0].fareDetails[1].markupTotalFare) * this.totalInfant;
          this.infantDisount = parseFloat(this.commonFlightDetails[0].fareDetails[1].discount) * this.totalInfant;
          this.infantAgentFare = parseFloat(this.commonFlightDetails[0].fareDetails[1].totalAgentFare) * this.totalInfant;
        }
      }
    }
  }

  getFirstShow(ind:number):string
  {

    if(ind==0)
    {
      return "show";
    }
    return "";
  }
  getRange(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index);
  }
  checkValidationWithPassportDiv(totalAdult: any,totalChild:any,totalInfant:any): boolean
  {
    let valAdult=0,valChild=0,valInfant=0,valEmail=0,valPhone=0;
    let isAdult = false, isChild = false, isInfant = false;
    for (let i = 0; i < totalAdult; i++)
    {
      $("#valTitleAdult" + i).css('display', 'none');
      $("#valFirstNameAdult"+i).css('display','none');
      $("#valLastNameAdult"+i).css('display','none');
      $("#valDOBAdult"+i).css('display','none');
      $("#valNationalityAdult" + i).css('display', 'none');
      $("#valPassportAdult"+i).css('display','none');
      $("#valPassportExpiryAdult"+i).css('display','none');

      var gTitleId = $("#adultGenderTitleId" + i).val();
      var fName=$("#adultFirstName"+i).val();
      var lName=$("#adultLastName"+i).val();
      var iDob=$("#adultDOB"+i).val();
      var iNationality=$("#nationalityAdult"+i).val();
      var iPassport=$("#adultPassportNo"+i).val();
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
      if(this.shareService.isNullOrEmpty(iDob))
      {
        $("#valDOBAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality))
      {
        $("#valNationalityAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassport))
      {
        $("#valPassportAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassportExpiry))
      {
        $("#valPassportExpiryAdult"+i).css('display','block');
      }
      if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
        && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
        && !this.shareService.isNullOrEmpty(iNationality) && !this.shareService.isNullOrEmpty(iPassport)
        && !this.shareService.isNullOrEmpty(iPassportExpiry))
      {
        valAdult+=1;
      }
      isAdult=true;
    }
    for (let i = 0; i < totalChild; i++)
    {
      $("#valTitleChild"+i).css('display','none');
      $("#valFirstNameChild"+i).css('display','none');
      $("#valLastNameChild"+i).css('display','none');
      $("#valDOBChild"+i).css('display','none');
      $("#valNationalityChild"+i).css('display','none');
      $("#valPassportChild"+i).css('display','none');
      $("#valPassportExpiryChild" + i).css('display', 'none');

      var gTitleId=$("#childGenderTitleId"+i).val();
      var fName=$("#childFirstName"+i).val();
      var lName=$("#childLastName"+i).val();
      var iDob=$("#childDOB"+i).val();
      var iNationality=$("#childNationality"+i).val();
      var iPassport=$("#childPassport"+i).val();
      var iPassportExpiry = $("#childExpiryDate" + i).val();
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
      if(this.shareService.isNullOrEmpty(iDob))
      {
        $("#valDOBChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality))
      {
        $("#valNationalityChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassport))
      {
        $("#valPassportChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassportExpiry))
      {
        $("#valPassportExpiryChild"+i).css('display','block');
      }
      if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
      && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
      && !this.shareService.isNullOrEmpty(iNationality) && !this.shareService.isNullOrEmpty(iPassport)
      && !this.shareService.isNullOrEmpty(iPassportExpiry))
      {
        valChild+=1;
      }
      isChild=true;
    }
    for (let i = 0; i < totalInfant; i++)
    {
      $("#valTitleInfant"+i).css('display','none');
      $("#valFirstNameInfant"+i).css('display','none');
      $("#valLastNameInfant"+i).css('display','none');
      $("#valDOBInfant"+i).css('display','none');
      $("#valNationalityInfant"+i).css('display','none');
      $("#valPassportInfant"+i).css('display','none');
      $("#valPassportExpiryInfant"+i).css('display','none');
      var gTitleId=$("#infantGenderTitleId"+i).val();
      var fName=$("#infantFirstName"+i).val();
      var lName=$("#infantLastName"+i).val();
      var iDob=$("#infantDOB"+i).val();
      var iNationality=$("#infantNationality"+i).val();
      var iPassport=$("#infantPassport"+i).val();
      var iPassportExpiry = $("#infantExpiryDate" + i).val();

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
      if(this.shareService.isNullOrEmpty(iDob))
      {
        $("#valDOBInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality))
      {
        $("#valNationalityInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassport))
      {
        $("#valPassportInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iPassportExpiry))
      {
        $("#valPassportExpiryInfant"+i).css('display','block');
      }

      if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
        && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
        && !this.shareService.isNullOrEmpty(iNationality) && !this.shareService.isNullOrEmpty(iPassport)
        && !this.shareService.isNullOrEmpty(iPassportExpiry))
      {
        valInfant+=1;
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
    if($("#agencyEmail").val()=="")
    {
      $("#reqEmail").css('display','block');
    }
    if($("#agencyEmail").val()!="")
    {
      $("#reqEmail").css('display','none');
      let isEmail=this.shareService.validateEmail($("#agencyEmail").val());
      if(!isEmail)
      {
        $("#valEmail").css('display','block');
      }else{
        valEmail=1;
      }
    }

    if(((isAdult && valAdult==totalAdult)|| !isAdult) && ((isChild && valChild==totalChild)|| !isChild) && ((isInfant && valInfant==totalInfant)|| !isInfant)
    &&  (valEmail==1 && valPhone==1))
    {
      return true;
    }
    return false;
  }

  checkValidationWithoutPassportDiv(totalAdult: any,totalChild:any,totalInfant:any): boolean
  {
    let valAdult=0,valChild=0,valInfant=0,valEmail=0,valPhone=0;
    let isAdult = false, isChild = false, isInfant = false;
    for (let i = 0; i < totalAdult; i++)
    {
      $("#valTitleAdult" + i).css('display', 'none');
      $("#valFirstNameAdult"+i).css('display','none');
      $("#valLastNameAdult"+i).css('display','none');
      $("#valDOBAdult"+i).css('display','none');
      $("#valNationalityAdult" + i).css('display', 'none');

      var gTitleId = $("#adultGenderTitleId" + i).val();
      var fName=$("#adultFirstName"+i).val();
      var lName=$("#adultLastName"+i).val();
      var iDob=$("#adultDOB"+i).val();
      var iNationality=$("#nationalityAdult"+i).val();
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
      if(this.shareService.isNullOrEmpty(iDob))
      {
        $("#valDOBAdult"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality))
      {
        $("#valNationalityAdult"+i).css('display','block');
      }
      
      if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
        && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
        && !this.shareService.isNullOrEmpty(iNationality))
      {
        valAdult+=1;
      }
      isAdult=true;
    }
    for (let i = 0; i < totalChild; i++)
    {
      $("#valTitleChild"+i).css('display','none');
      $("#valFirstNameChild"+i).css('display','none');
      $("#valLastNameChild"+i).css('display','none');
      $("#valDOBChild"+i).css('display','none');
      $("#valNationalityChild"+i).css('display','none');

      var gTitleId=$("#childGenderTitleId"+i).val();
      var fName=$("#childFirstName"+i).val();
      var lName=$("#childLastName"+i).val();
      var iDob=$("#childDOB"+i).val();
      var iNationality=$("#childNationality"+i).val();
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
      if(this.shareService.isNullOrEmpty(iDob))
      {
        $("#valDOBChild"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality))
      {
        $("#valNationalityChild"+i).css('display','block');
      }
      if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
      && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
      && !this.shareService.isNullOrEmpty(iNationality))
      {
        valChild+=1;
      }
      isChild=true;
    }
    for (let i = 0; i < totalInfant; i++)
    {
      $("#valTitleInfant"+i).css('display','none');
      $("#valFirstNameInfant"+i).css('display','none');
      $("#valLastNameInfant"+i).css('display','none');
      $("#valDOBInfant"+i).css('display','none');
      $("#valNationalityInfant"+i).css('display','none');
      var gTitleId=$("#infantGenderTitleId"+i).val();
      var fName=$("#infantFirstName"+i).val();
      var lName=$("#infantLastName"+i).val();
      var iDob=$("#infantDOB"+i).val();
      var iNationality=$("#infantNationality"+i).val();

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
      if(this.shareService.isNullOrEmpty(iDob))
      {
        $("#valDOBInfant"+i).css('display','block');
      }
      if(this.shareService.isNullOrEmpty(iNationality))
      {
        $("#valNationalityInfant"+i).css('display','block');
      }

      if(!this.shareService.isNullOrEmpty(gTitleId) && !this.shareService.isNullOrEmpty(fName)
        && !this.shareService.isNullOrEmpty(lName) && !this.shareService.isNullOrEmpty(iDob)
        && !this.shareService.isNullOrEmpty(iNationality) )
      {
        valInfant+=1;
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
    if($("#agencyEmail").val()=="")
    {
      $("#reqEmail").css('display','block');
    }
    if($("#agencyEmail").val()!="")
    {
      $("#reqEmail").css('display','none');
      let isEmail=this.shareService.validateEmail($("#agencyEmail").val());
      if(!isEmail)
      {
        $("#valEmail").css('display','block');
      }else{
        valEmail=1;
      }
    }

    if(((isAdult && valAdult==totalAdult)|| !isAdult) && ((isChild && valChild==totalChild)|| !isChild) && ((isInfant && valInfant==totalInfant)|| !isInfant)
    &&  (valEmail==1 && valPhone==1))
    {
      return true;
    }
    return false;
  }
  hideBooking=false;
  bookHoldWork() {
    this.adultDetailsArray = [];
    if(this.showPassportDiv){
      if (this.checkValidationWithPassportDiv(this.totalAdult, this.totalChild, this.totalInfant)) {
        this.isBookClicked = true;
        for (let i = 0; i < this.totalAdult; i++) {
        const passDetail: PassDetails = {
          passangerType : PassangerTypes.Adult,
          fName: String($('#adultFirstName' + i).val() || ''),
          title: String($('#adultGenderTitleId' + i).val() || ''),
          lName: String($('#adultLastName' + i).val() || ''),
          dob: String($('#adultDOB' + i).val() || '').split("-").reverse().join("-"),
          passNo: String($('#adultPassportNo' + i).val() || ''),
          passExp: String($('#adultPassportExpiry' + i).val() || '').split("-").reverse().join("-"),
          nationality: String($('#nationalityAdult' + i).val() || ''),
          isSave: $("#adultSave"+i).is(':checked'),
          passport:this.adultPassSelectedFile[i],
          visa:this.adultVisaSelectedFile[i]
        };
        this.adultDetailsArray.push(passDetail);
        }
  
        for (let i = 0; i < this.totalChild; i++) {
          const passDetail: PassDetails = {
            passangerType : PassangerTypes.Child,
            fName: String($('#childFirstName' + i).val() || ''),
            title: String($('#childGenderTitleId' + i).val() || ''),
            lName: String($('#childLastName' + i).val() || ''),
            dob: String($('#childDOB' + i).val() || '').split("-").reverse().join("-"),
            passNo: String($('#childPassport' + i).val() || ''),
            passExp: String($('#childExpiryDate' + i).val() || '').split("-").reverse().join("-"),
            nationality: String($('#childNationality' + i).val() || ''),
            isSave: $("#childSave"+i).is(':checked'),
            passport:this.childPassSelectedFile[i],
            visa:this.childVisaSelectedFile[i]
          };
  
          this.adultDetailsArray.push(passDetail);
        }
  
        for (let i = 0; i < this.totalInfant; i++) {
          const passDetail: PassDetails = {
            passangerType : PassangerTypes.Infant,
            fName: String($('#infantFirstName' + i).val() || ''),
            title: String($('#infantGenderTitleId' + i).val() || ''),
            lName: String($('#infantLastName' + i).val() || ''),
            dob: String($('#infantDOB' + i).val() || '').split("-").reverse().join("-"),
            passNo: String($('#infantPassport' + i).val() || ''),
            passExp: String($('#infantExpiryDate' + i).val() || '').split("-").reverse().join("-"),
            nationality: String($('#infantNationality' + i).val() || ''),
            isSave: $("#infantSave"+i).is(':checked'),
            passport:this.infantPassSelectedFile[i],
            visa:this.infantVisaSelectedFile[i]
          };
  
          this.adultDetailsArray.push(passDetail);
        }
        var isDomestic = localStorage.getItem('isDomestic');
  
        var TripType='';
        if(isDomestic=='True'){
          TripType="Domestic";
        }else{
          TripType="International";
        }
  
        this.bookAndHold = {
          passangers: [],
          tripType: '',
          flightTypes: '',
          flightDetails: '',
          agencyPhone: '',
          agencyEmail: '',
          agencyId: '',
          IsRevalidated: false
        };
        var commonFlightDetails = this.commonFlightDetails.map((element:any) => ({ ...element }));
        
        this.bookAndHold.passangers = this.adultDetailsArray;
        this.bookAndHold.flightDetails = JSON.stringify(commonFlightDetails);
        this.bookAndHold.agencyPhone = $('#agencyPhoneNumber').val();
        this.bookAndHold.agencyEmail = $('#agencyEmail').val();
        this.bookAndHold.agencyId = this.agencyId;
        this.bookAndHold.tripType = TripType;
        this.bookAndHold.flightTypes = this.flightType;
  
        console.log(this.bookAndHold);
  
        this.authService.createPNR(this.bookAndHold).subscribe( data=>{
          console.log(data.data);
          if(data.data.statusCode=='200'){
            if(!data.data.isValid){
              // Swal.fire({
              //   title: 'Fare has been changed. Can you proceed with the new fare?',
              //   icon: 'error',
              //   showCancelButton: true,
              //   confirmButtonColor: '#3085d6',
              //   cancelButtonColor: '#d33',
              //   confirmButtonText: 'Yes'
              // }).then((result) => {
              //   if (result.value) {
              //     this.bookAndHold.IsRevalidated = true;
              //     this.authService.createPNR(this.bookAndHold).subscribe( data=>{
              //       if(data.data.statusCode=='200'){
              //         this.toastrService.success("Success",data.data.message);
  
              //           const navigationExtras: NavigationExtras = {
              //             state: {
              //               bookingId: data.data.bookNHoldID
              //             }
              //           };
              //           this.router.navigate(['/home/book-and-hold-details'], navigationExtras);
              //       }
              //     },error=>{
              //       this.toastrService.error('Error', data.data.message);
              //     });
              //   }
              // });
              this.toastrService.error('Error', "Fare has been changed");
              setTimeout(() => {
                this.router.navigate(['/home/common-flight-search']);
              }, 4000);
            }
            else if(data.data.isValid){
              this.toastrService.success("Success",data.data.message);
  
                const navigationExtras: NavigationExtras = {
                  state: {
                    bookingId: data.data.bookNHoldID
                  }
                };
                this.router.navigate(['/home/book-and-hold-details'], navigationExtras);
            }
          }
          else if(data.data.statusCode=='300'){
          this.hideBooking = true;
          this.toastrService.error('Error', data.data.message);
          }
          else{
            this.isBookClicked = false;
            this.toastrService.error('Error', data.data.message);
          }
  
  
        },error=>{
          this.isBookClicked = false;
          this.toastrService.error('Error', 'Booking Failed');
        });
      }
    }else{
      if (this.checkValidationWithoutPassportDiv(this.totalAdult, this.totalChild, this.totalInfant)) {
        this.isBookClicked = true;
        for (let i = 0; i < this.totalAdult; i++) {
        const passDetail: PassDetails = {
          passangerType : PassangerTypes.Adult,
          fName: String($('#adultFirstName' + i).val() || ''),
          title: String($('#adultGenderTitleId' + i).val() || ''),
          lName: String($('#adultLastName' + i).val() || ''),
          dob: String($('#adultDOB' + i).val() || '').split("-").reverse().join("-"),
          passNo: String($('#adultPassportNo' + i).val() || ''),
          passExp: String($('#adultPassportExpiry' + i).val() || '').split("-").reverse().join("-"),
          nationality: String($('#nationalityAdult' + i).val() || ''),
          isSave: $("#adultSave"+i).is(':checked'),
          passport:this.adultPassSelectedFile[i],
          visa:this.adultVisaSelectedFile[i]
        };
        this.adultDetailsArray.push(passDetail);
        }
  
        for (let i = 0; i < this.totalChild; i++) {
          const passDetail: PassDetails = {
            passangerType : PassangerTypes.Child,
            fName: String($('#childFirstName' + i).val() || ''),
            title: String($('#childGenderTitleId' + i).val() || ''),
            lName: String($('#childLastName' + i).val() || ''),
            dob: String($('#childDOB' + i).val() || '').split("-").reverse().join("-"),
            passNo: String($('#childPassport' + i).val() || ''),
            passExp: String($('#childExpiryDate' + i).val() || '').split("-").reverse().join("-"),
            nationality: String($('#childNationality' + i).val() || ''),
            isSave: $("#childSave"+i).is(':checked'),
            passport:this.childPassSelectedFile[i],
            visa:this.childVisaSelectedFile[i]
          };
  
          this.adultDetailsArray.push(passDetail);
        }
  
        for (let i = 0; i < this.totalInfant; i++) {
          const passDetail: PassDetails = {
            passangerType : PassangerTypes.Infant,
            fName: String($('#infantFirstName' + i).val() || ''),
            title: String($('#infantGenderTitleId' + i).val() || ''),
            lName: String($('#infantLastName' + i).val() || ''),
            dob: String($('#infantDOB' + i).val() || '').split("-").reverse().join("-"),
            passNo: String($('#infantPassport' + i).val() || ''),
            passExp: String($('#infantExpiryDate' + i).val() || '').split("-").reverse().join("-"),
            nationality: String($('#infantNationality' + i).val() || ''),
            isSave: $("#infantSave"+i).is(':checked'),
            passport:this.infantPassSelectedFile[i],
            visa:this.infantVisaSelectedFile[i]
          };
  
          this.adultDetailsArray.push(passDetail);
        }
        var isDomestic = localStorage.getItem('isDomestic');
  
        var TripType='';
        if(isDomestic=='True'){
          TripType="Domestic";
        }else{
          TripType="International";
        }
  
        this.bookAndHold = {
          passangers: [],
          tripType: '',
          flightTypes: '',
          flightDetails: '',
          agencyPhone: '',
          agencyEmail: '',
          agencyId: '',
          IsRevalidated: false
        };
        var commonFlightDetails = this.commonFlightDetails.map((element:any) => ({ ...element }));
        
        commonFlightDetails.forEach((element:any) => {
          element.totalAgentFare = (this.adultAgentFare + this.childAgentFare + this.infantAgentFare).toString();
          element.totalFare = (this.adultClientFare+this.childClientFare+this.infantClientFare).toString();
        });
        this.bookAndHold.passangers = this.adultDetailsArray;
        this.bookAndHold.flightDetails = JSON.stringify(commonFlightDetails);
        this.bookAndHold.agencyPhone = $('#agencyPhoneNumber').val();
        this.bookAndHold.agencyEmail = $('#agencyEmail').val();
        this.bookAndHold.agencyId = this.agencyId;
        this.bookAndHold.tripType = TripType;
        this.bookAndHold.flightTypes = this.flightType;
  
        console.log(this.bookAndHold);
  
        this.authService.createPNR(this.bookAndHold).subscribe( data=>{
          console.log(data.data);
          if(data.data.statusCode=='200'){
            if(!data.data.isValid){
              // Swal.fire({
              //   title: 'Fare has been changed. Can you proceed with the new fare?',
              //   icon: 'error',
              //   showCancelButton: true,
              //   confirmButtonColor: '#3085d6',
              //   cancelButtonColor: '#d33',
              //   confirmButtonText: 'Yes'
              // }).then((result) => {
              //   if (result.value) {
              //     this.bookAndHold.IsRevalidated = true;
              //     this.authService.createPNR(this.bookAndHold).subscribe( data=>{
              //       if(data.data.statusCode=='200'){
              //         this.toastrService.success("Success",data.data.message);
  
              //           const navigationExtras: NavigationExtras = {
              //             state: {
              //               bookingId: data.data.bookNHoldID
              //             }
              //           };
              //           this.router.navigate(['/home/book-and-hold-details'], navigationExtras);
              //       }
              //     },error=>{
              //       this.toastrService.error('Error', data.data.message);
              //     });
              //   }
              // });
              this.toastrService.error('Error', "Fare has been changed");
              setTimeout(() => {
                this.router.navigate(['/home/common-flight-search']);
              }, 4000);
            }
            else if(data.data.isValid){
              this.toastrService.success("Success",data.data.message);
  
                const navigationExtras: NavigationExtras = {
                  state: {
                    bookingId: data.data.bookNHoldID
                  }
                };
                this.router.navigate(['/home/book-and-hold-details'], navigationExtras);
            }
          }
          else if(data.data.statusCode=='300'){
            this.hideBooking = true;
            this.toastrService.error('Error', data.data.message);
          }
            else{
            this.isBookClicked = false;
            this.toastrService.error('Error', data.data.message);
          }
  
  
        },error=>{
          this.isBookClicked = false;
          this.toastrService.error('Error', 'Booking Failed');
        });
      }
    }
    

  }

  flightShowHideAction(fareDetailsWrap:any, flightDetailsWrap:any)
{
  const FlightButton = this.document.getElementById("flightDetailsShowHide");
  const fareButton = this.document.getElementById("fareDetailsShowHide");
  if ($(flightDetailsWrap).css('display') == 'block') {
    $(flightDetailsWrap).hide('slow');
    if(FlightButton){
      FlightButton.textContent = "View Flight Details";
    }
  }
  else {
    $(fareDetailsWrap).hide('slow');
    $(flightDetailsWrap).show('slow');
    if(fareButton){
      fareButton.textContent = "View Fare Details";
    }
    if(FlightButton){
      FlightButton.textContent = "Hide Flight Details";
    }
  }
  }

  fareShowHideAction(fareDetailsWrap:any, flightDetailsWrap:any)
  {
    const FlightButton = this.document.getElementById("flightDetailsShowHide");
    const fareButton = this.document.getElementById("fareDetailsShowHide");
    if ($(fareDetailsWrap).css('display') == 'block') {
      $(fareDetailsWrap).hide('slow');
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
      if(fareButton){
        fareButton.textContent = "View Fare Details";
      }
    }
    else {
      $(fareDetailsWrap).show('slow');
      $(flightDetailsWrap).hide('slow');
      if(fareButton){
        fareButton.textContent = "Hide Fare Details";
      }
      if(FlightButton){
        FlightButton.textContent = "View Flight Details";
      }
    }
  }
  _getCountryList() {
    try{
      this.authService.getCountryList().subscribe(data => {
        this.countrylists = [];
        this.countrylists = data.countrylist;
        this.selectedCountry = this.countrylists.find((item: { nvCountryName: string; }) => item.nvCountryName === 'Bangladesh')?.nvCountryCode;
      }, err => {
        console.log(err);
      }, () => {
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
    }catch(exp){
      console.log(exp);
    }
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
  passengerInfoChange(id: string, type: string, titleID: string, firstNameID: string, lastNameID: string,
    birthDateID: string, passportNo: string, passportExpiry: string, valTitle: string, valFName: string, valLName: string,
  valDob:string,valPassport:string,valPassportExpiry:string)
  {
    debugger;
    var val: any=$("#"+id).val();
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
          objData=this.passengerInfoListAdult.find(x=>x.InfoID.toString()== val.toString());
          break;
        case "child":
          objData=this.passengerInfoListChild.find(x=>x.InfoID.toString()== val.toString());
          break;
        case "infant":
          objData=this.passengerInfoListInfant.find(x=>x.InfoID.toString()== val.toString());
          break;
      }
      if(objData!=undefined)
      {
        console.log(objData);
        $("#"+titleID).val(objData.TitleName);
        $("#"+firstNameID).val(objData.FirstName);
        $("#"+lastNameID).val(objData.LastName);
        let d=new Date(objData.DateOfBirth);
        $("#"+birthDateID).val(this.shareService.padLeft(d.getDate().toString(),'0',2) + "-" + this.shareService.padLeft((d.getMonth()+1).toString(),'0',2) + "-" + d.getFullYear());
        $("#"+passportNo).val(objData.PassportNumber);
        let ped=new Date(objData.PassportExpiryDate);
        $("#"+passportExpiry).val(this.shareService.padLeft(d.getDate().toString(),'0',2) + "-" + this.shareService.padLeft((ped.getMonth()+1).toString(),'0',2) + "-" + ped.getFullYear());

      }
    }

    this.flightHelper._removeValidText(titleID, valTitle);
    this.flightHelper._removeValidText(firstNameID, valFName);
    this.flightHelper._removeValidText(lastNameID, valLName);
    this.flightHelper._removeValidText(birthDateID, valDob);
    this.flightHelper._removeValidText(passportNo, valPassport);
    this.flightHelper._removeValidText(passportExpiry, valPassportExpiry);

  }

  adultPassOnChangeFile(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.adultPassSelectedFile.push(reader.result);
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  adultVisaOnChangeFile(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.adultVisaSelectedFile.push(reader.result);
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  childPassOnChangeFile(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.childPassSelectedFile.push(reader.result);
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  childVisaOnChangeFile(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.childVisaSelectedFile.push(reader.result);
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  infantPassOnChangeFile(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.infantPassSelectedFile.push(reader.result);
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  infantVisaOnChangeFile(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.infantVisaSelectedFile.push(reader.result);
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

}
export interface PassDetails{
  passangerType: PassangerTypes;
  title: string;
  fName: string;
  lName: string;
  dob: string;
  passNo: string;
  passExp: string;
  nationality:string;
  isSave:boolean;
  passport:File;
  visa:File;
}
export interface BookAndHold{
  passangers:PassDetails[];
  tripType:string;
  flightTypes:string;
  flightDetails: string;
  agencyPhone: String;
  agencyEmail: String;
  agencyId: string;
  IsRevalidated: boolean;
}
enum FlightTypes {
  OneWay,
  RoundTrip,
  Multicity
}
enum PassangerTypes{
  Adult,
  Child,
  Infant
}
