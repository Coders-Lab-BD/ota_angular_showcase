import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Input, Inject, ChangeDetectionStrategy, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { LoaderService } from '../../_services/loader.service';
import { FlightHelperService } from '../flight-helper.service';
import { Priceinfo } from '../priceinfo';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-make-proposal',
  templateUrl: './make-proposal.component.html',
  styleUrls: ['./make-proposal.component.css']
})
export class MakeProposalComponent implements OnInit {

  coreUrl = '';

  constructor(public flightHelper:FlightHelperService,
  public shareService:ShareService,public authService:AuthService,
  private fb: FormBuilder,private router: Router, private httpClient: HttpClient,
  @Inject(DOCUMENT) private document: Document) { 

    document.addEventListener('proposalModalShown', () => {
      this.updateData();
    });
  }
  profitIncrementType:string|any;
  profitAmountType:string|any;
  discountType:string|any;
  discountAmountType:string|any;
  btnLoad:boolean=false;
  public profitList:any={};
  public discountList:any={};
  public profitAdult:any={};
  public profitChild:any={};
  public profitInfant:any={};
  public discountAdult:any={};
  public discountChild:any={};
  public discountInfant:any={};
  agencyName:string="";
  agencyEmail:string="";
  agencyPhone:string="";
  agencyAddress: string = "";

  agencyManualId: string = "";
  agencyPhoto:string="";

  fmgAgencyProposal:FormGroup|any;
  fmgAgencyProposalFare:FormGroup|any;
  fmgAgencyProposalFlight:FormGroup|any;
  fmgProposal:FormGroup|any;
  roundTrip = ["3E58A4D3-FCD4-4CFA-9371-B03D46A20574"];
  multiCity = ["CF748349-6049-4F33-AA7D-A1EB7440C33B"];
  totalTime: any;
  arrivalCity: any;
  arrivalDate: any;
  adjustment: any;
  departureCityCode: any;
  adultBaseClient: any;
  adultTaxClient: any;
  childBaseClient: any;
  childTaxClient: any;
  infantBaseClient: any;
  infantTaxClient: any;
  
  adultBaseFare: number =0;
  adultTaxFare: number =0;
  adultCount : number =0;
  adultTotal : number =0;

  childBaseFare: number =0;
  childTaxFare: number =0;
  childCount: number =0;
  childTotal: number =0;

  infantBaseFare: number =0;
  infantTaxFare: number =0;
  infantCount: number =0;
  infantTotal: number =0;

  clientTotal: any ='';
  agentTotal: number =0;
  discountAmount:any='';

  ngOnInit(): void {
    this.coreUrl = environment.apiUrl.substring(0, environment.apiUrl.length - 4);
  }

  isAdultFareVisible:boolean=false;
  isChildFareVisible:boolean=false;
  isInfantFareVisible:boolean=false;
  
  allAdultBaseFare:number=0;
  allAdultTaxFare:number=0;
  adultTotalFare:any = 0;
  adultTotalPassenger:any = 0;

  allChildBaseFare:number=0;
  allChildTaxFare:number=0;
  childTotalFare :any = 0;
  childTotalPassenger :any = 0;

  allInfantBaseFare:number=0;
  allInfantTaxFare:number=0;
  infantTotalFare :any = 0;
  infantTotalPassenger :any = 0;
  fareDetails : any;
  fligtDetails:any = [];
  
  updateData(){
    this.reset();
    this.fligtDetails = [];
    var isDomestic = localStorage.getItem('isDomestic');//False True
    var flightType = localStorage.getItem('flightType');//OneWay RoundTrip Multi

    if(isDomestic=='False' && flightType=='OneWay'){
      var model = JSON.parse(localStorage.getItem('proposalData')!);
      this.fligtDetails.push(model.flightDetails);
      model = model.fareDetails;
      
      model.forEach((element:any) => {
        if(element!=null){
          if(element.passengerType==='Adult'){
            this.isAdultFareVisible = true;
            this.adultBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.adultTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.adultTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.adultTotalPassenger = parseFloat(element.passengerNumber);
            this.adultCount = this.adultTotalPassenger;
          }
          if(element.passengerType==='Child'){
            this.isChildFareVisible = true;
            this.childBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.childTaxFare =  parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.childTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.childTotalPassenger = parseFloat(element.passengerNumber);
            this.childCount = this.childTotalPassenger;
          }
          if(element.passengerType==='Infant'){
            this.isInfantFareVisible = true;
            this.infantBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.infantTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.infantTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.infantTotalPassenger = parseFloat(element.passengerNumber);
            this.infantCount = this.infantTotalPassenger;
          }
        }
      });
  
      this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
    }

    else if(isDomestic=='False' && flightType=='RoundTrip'){
      var model = JSON.parse(localStorage.getItem('proposalData')!);
      var fareDetails:any = [];
      model.forEach((ele:any) => {
        this.fligtDetails.push(ele.flightDetails);
        fareDetails = ele.fareDetails;
      });
      
      fareDetails.forEach((element:any) => {
        if(element!=null){
          if(element.passengerType==='Adult'){
            this.isAdultFareVisible = true;
            this.adultBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.adultTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.adultTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.adultTotalPassenger = parseFloat(element.passengerNumber);
            this.adultCount = this.adultTotalPassenger;
          }
          if(element.passengerType==='Child'){
            this.isChildFareVisible = true;
            this.childBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.childTaxFare =  parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.childTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.childTotalPassenger = parseFloat(element.passengerNumber);
            this.childCount = this.childTotalPassenger;
          }
          if(element.passengerType==='Infant'){
            this.isInfantFareVisible = true;
            this.infantBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.infantTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.infantTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.infantTotalPassenger = parseFloat(element.passengerNumber);
            this.infantCount = this.infantTotalPassenger;
          }
        }
      });
  
      this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
    }

    else if(isDomestic=='False' && flightType=='Multi'){
      var model = JSON.parse(localStorage.getItem('proposalData')!);
      var fareDetails:any = [];
      model.forEach((ele:any) => {
        this.fligtDetails.push(ele.flightDetails);
        fareDetails = ele.fareDetails;
      });
      
      fareDetails.forEach((element:any) => {
        if(element!=null){
          if(element.passengerType==='Adult'){
            this.isAdultFareVisible = true;
            this.adultBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.adultTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.adultTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.adultTotalPassenger = parseFloat(element.passengerNumber);
            this.adultCount = this.adultTotalPassenger;
          }
          if(element.passengerType==='Child'){
            this.isChildFareVisible = true;
            this.childBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.childTaxFare =  parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.childTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.childTotalPassenger = parseFloat(element.passengerNumber);
            this.childCount = this.childTotalPassenger;
          }
          if(element.passengerType==='Infant'){
            this.isInfantFareVisible = true;
            this.infantBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.infantTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.infantTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.infantTotalPassenger = parseFloat(element.passengerNumber);
            this.infantCount = this.infantTotalPassenger;
          }
        }
      });
  
      this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
    }

    else if(isDomestic=='True' && flightType=='OneWay'){
      var model = JSON.parse(localStorage.getItem('proposalData')!);
      var fareDetails:any = [];
      model.forEach((ele:any) => {
        this.fligtDetails.push(ele.flightDetails);
        fareDetails = ele.fareDetails;
      });
      
      fareDetails.forEach((element:any) => {
        if(element!=null){
          if(element.passengerType==='Adult'){
            this.isAdultFareVisible = true;
            this.adultBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.adultTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.adultTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.adultTotalPassenger = parseFloat(element.passengerNumber);
            this.adultCount = this.adultTotalPassenger;
          }
          if(element.passengerType==='Child'){
            this.isChildFareVisible = true;
            this.childBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.childTaxFare =  parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.childTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.childTotalPassenger = parseFloat(element.passengerNumber);
            this.childCount = this.childTotalPassenger;
          }
          if(element.passengerType==='Infant'){
            this.isInfantFareVisible = true;
            this.infantBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
            this.infantTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
            this.infantTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
            this.infantTotalPassenger = parseFloat(element.passengerNumber);
            this.infantCount = this.infantTotalPassenger;
          }
        }
      });
  
      this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
    }

    else if(isDomestic=='True' && flightType=='RoundTrip'){
      var model = JSON.parse(localStorage.getItem('proposalData')!);
      var fareDetails:any = [];
      model.forEach((ele:any) => {
        this.fligtDetails.push(ele.flightDetails);
        fareDetails.push(ele.fareDetails);
      });

      fareDetails.forEach((ele:any) => {
        if(ele!=null){
          ele.forEach((element:any) => {
            if(element.passengerType==='Adult'){
              this.isAdultFareVisible = true;
              this.adultBaseFare += parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
              this.adultTaxFare += parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
              this.adultTotalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
              this.adultTotalPassenger = parseFloat(element.passengerNumber);
              this.adultCount = this.adultTotalPassenger;
            }
            if(element.passengerType==='Child'){
              this.isChildFareVisible = true;
              this.childBaseFare += parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
              this.childTaxFare +=  parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
              this.childTotalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
              this.childTotalPassenger = parseFloat(element.passengerNumber);
              this.childCount = this.childTotalPassenger;
            }
            if(element.passengerType==='Infant'){
              this.isInfantFareVisible = true;
              this.infantBaseFare += parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
              this.infantTaxFare += parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
              this.infantTotalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
              this.infantTotalPassenger = parseFloat(element.passengerNumber);
              this.infantCount = this.infantTotalPassenger;
            }
          });
        }
      });
  
      this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
    }

    else if(isDomestic=='True' && flightType=='Multi'){
      var model = JSON.parse(localStorage.getItem('proposalData')!);
      var fareDetails:any = [];
      model.forEach((ele:any) => {
        this.fligtDetails.push(ele.flightDetails);
        fareDetails.push(ele.fareDetails);
      });

      fareDetails.forEach((ele:any) => {
        if(ele!=null){
          ele.forEach((element:any) => {
            if(element.passengerType==='Adult'){
              this.isAdultFareVisible = true;
              this.adultBaseFare += parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
              this.adultTaxFare += parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
              this.adultTotalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
              this.adultTotalPassenger = parseFloat(element.passengerNumber);
              this.adultCount = this.adultTotalPassenger;
            }
            if(element.passengerType==='Child'){
              this.isChildFareVisible = true;
              this.childBaseFare += parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
              this.childTaxFare +=  parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
              this.childTotalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
              this.childTotalPassenger = parseFloat(element.passengerNumber);
              this.childCount = this.childTotalPassenger;
            }
            if(element.passengerType==='Infant'){
              this.isInfantFareVisible = true;
              this.infantBaseFare += parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
              this.infantTaxFare += parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
              this.infantTotalFare += parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
              this.infantTotalPassenger = parseFloat(element.passengerNumber);
              this.infantCount = this.infantTotalPassenger;
            }
          });
        }
      });
  
      this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
    }

    let userId = this.shareService.getUserId();
    this.authService.getAgencyInfo(userId).subscribe( data=>{
      this.agencyName=data.agencyinfo.nvAgencyName;
      this.agencyEmail=data.agencyinfo.nvAgencyEmail;
      this.agencyAddress=data.agencyinfo.nvAgencyAddress;
      this.agencyPhone = data.agencyinfo.nvAgencyPhoneNumber;

      this.agencyManualId = data.agencyinfo.vAgencyManualId;
      this.agencyPhoto = this.coreUrl + data.agencyinfo.vAgencyPhoto;
    });
  }

  reset(){
    this.adultBaseFare = 0;
    this.adultTaxFare = 0;
    this.adultTotalFare = 0;
    this.adultTotalPassenger = 0;
    this.adultCount = 0;

    this.childBaseFare = 0;
    this.childTaxFare = 0;
    this.childTotalFare = 0;
    this.childTotalPassenger = 0;
    this.childCount = 0;

    this.infantBaseFare = 0;
    this.infantTaxFare = 0;
    this.infantTotalFare = 0;
    this.infantTotalPassenger = 0;
    this.infantCount = 0;

    this.clientTotal = 0;
  }

  adultBaseFareInputChange(event: any) {
    $("#discountAmount").val("");
    this.discountAmount ='';
    this.adultBaseFare = event.target.value;
    this.allAdultBaseFare=this.adultBaseFare*this.adultCount;
    this.adultTotalFare = this.adultTotal = this.adultBaseFare*this.adultCount + this.adultTaxFare*this.adultCount;
    this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
  }

  adultTaxFareInputChange(event: any) {
    $("#discountAmount").val("");
    this.discountAmount ='';
    this.adultTaxFare = event.target.value;
    this.allAdultTaxFare=this.adultTaxFare*this.adultCount;
    this.adultTotalFare = this.adultTotal = this.adultBaseFare*this.adultCount + this.adultTaxFare*this.adultCount;
    this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
  }

  childBaseFareInputChange(event: any) {
    $("#discountAmount").val("");
    this.discountAmount ='';
    this.childBaseFare = event.target.value;
    this.allChildBaseFare=this.childBaseFare*this.childCount;
    this.childTotalFare = this.childTotal = this.childBaseFare*this.childCount + this.childTaxFare*this.childCount;
    this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
  }

  childTaxFareInputChange(event: any) {
    $("#discountAmount").val("");
    this.discountAmount ='';
    this.childTaxFare = event.target.value;
    this.allChildTaxFare=this.childTaxFare*this.childCount;
    this.childTotalFare = this.childTotal = this.childBaseFare*this.childCount + this.childTaxFare*this.childCount;
    this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
  }

  infantBaseFareInputChange(event: any) {
    $("#discountAmount").val("");
    this.discountAmount ='';
    this.infantBaseFare = event.target.value;
    this.allInfantBaseFare=this.infantBaseFare*this.infantCount;
    this.infantTotalFare =  this.infantTotal = this.infantBaseFare*this.infantCount + this.infantTaxFare*this.infantCount;
    this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
  }

  infantTaxFareInputChange(event: any) {
    $("#discountAmount").val("");
    this.discountAmount ='';
    this.infantTaxFare = event.target.value;
    this.allInfantTaxFare=this.infantTaxFare*this.infantCount;
    this.infantTotalFare = this.infantTotal = this.infantBaseFare*this.infantCount + this.infantTaxFare*this.infantCount;
    this.clientTotal = this.adultTotalFare+this.childTotalFare+this.infantTotalFare;
  }

  parseFloat(one:any,two:any,three:any){
    return parseFloat(one)+parseFloat(two)+parseFloat(three);
  }

  calculateDisccoutn(event: any){
    var am = event.target.value;
    var discountTypeId=$("#discountTypeId").val();
    var priceTypeDiscount=$("#priceTypeDiscount").val();
    if('Base'===discountTypeId){
      if(priceTypeDiscount==='1'){
        this.discountAmount = parseFloat(am);
      }
      if(priceTypeDiscount==='2'){
        this.discountAmount = (this.parseFloat(this.adultBaseFare,this.childBaseFare,this.infantBaseFare)*parseFloat(am))/100;
      }
    }
    if('Tax'===discountTypeId){
      if(priceTypeDiscount==='1'){
        this.discountAmount = parseFloat(am);
      }
      if(priceTypeDiscount==='2'){
        this.discountAmount = (this.parseFloat(this.adultTaxFare,this.childTaxFare,this.infantTaxFare)*parseFloat(am))/100;
      }
    }
    if('Total'===discountTypeId){
      if(priceTypeDiscount==='1'){
        this.discountAmount = parseFloat(am);
      }
      if(priceTypeDiscount==='2'){
        this.discountAmount = (parseFloat(this.clientTotal)*parseFloat(am))/100;
      }
    }
    this.discountAmount = Math.round(this.discountAmount);
  }

  getCalc(data1:any,data2:any,type:string=""):any
  {
    let ret;
    try{
      switch(type)
      {
        case "+":
          ret=parseFloat(data1)+parseFloat(data2);
          break;
      }
    }catch(exp){}
    return ret;
  }

  selectType(type:string)
  {
    this.discountAmount ='';
    if(type=="profit")
    {
      $("#mBaseDefault").text("0");
      $("#mTaxDefault").text("0");
      $("#mTotalDefault").text("0");
      $("#mAgentDefault").text("0");
      $("#profitAmount").val("");
      this.profitList={};
    }
    if(type=="discount")
    {
      $("#dBaseDefault").text("0");
      $("#dTaxDefault").text("0");
      $("#dTotalDefault").text("0");
      $("#dAgentDefault").text("0");
      $("#discountAmount").val("");
      this.discountList={};
    }
  }

  downloadProposal(){
    setTimeout(()=>{
      var divContents = $("#flightProposal").html();
      var printWindow = window.open('', '');
      // printWindow.document.write(divContents);
      // printWindow.document.close();
      // printWindow.print();
      printWindow.document.write('<html><head><title></title>');
      printWindow.document.write('<link rel="stylesheet" href="../../assets/dist/css/font-awesome.min.css">');
      printWindow.document.write('</head><body >');
      printWindow.document.write(divContents);
      printWindow.document.write('<script type="text/javascript">addEventListener("load", () => { print(); close(); })</script></body></html>');

      printWindow.document.close();
      printWindow.focus();


    },500);
  }
}

