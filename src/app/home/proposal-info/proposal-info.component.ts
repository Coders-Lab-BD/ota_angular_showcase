import { Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from '../../_services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { NgbCalendar, NgbDateParserFormatter,NgbDateStruct,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, DOCUMENT } from '@angular/common';
import {ShareService} from '../../_services/share.service';
import { FlightHelperService } from '../flight-helper.service';
import { environment } from 'src/environments/environment';
declare var window: any;
declare var $: any;


@Component({
  selector: 'app-proposal-info',
  templateUrl: './proposal-info.component.html',
  styleUrls: ['./proposal-info.component.css']
})
export class ProposalInfoComponent implements OnInit {

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

  coreUrl = '';


  urlMain = "./assets/dist/js/main.min.js";
  urlDemo = "./assets/dist/js/demo.js";

  loadAPI: Promise<any> | any;


  proposalData: any;
  traverlerCount: any;

  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter,
   private authService: AuthService,
  private router: Router, private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,public flightHelper:FlightHelperService) {

  }
    ngOnInit() {

      this.coreUrl = environment.apiUrl.substring(0, environment.apiUrl.length - 4);
      this.init();


      this.getServerSideTableData();
    }
    public clicked: boolean = false;

    public loadScript() {
      let node4 = document.createElement("script");
      node4.src = this.urlMain;
      node4.type = "text/javascript";
      node4.async = true;
      node4.charset = "utf-8";
      document.getElementsByTagName("head")[0].appendChild(node4);
    }
    public init():void{



      this.loadAPI = new Promise(resolve => {
        // console.log("resolving promise...");
        this.loadScript();
      });


  }


  lengthChange(sl: any){
    this.pageNo = 1;
    this.length = sl;
    this.getServerSideTableData();
  }

  createPageList(){
    let totalPage = Math.ceil(((this.searchedValue == "") ? this.recordsTotal : this.recordsFiltered) / this.length);
    this.pageList = [];
    this.addPageInPageList("Previous", 0, "");
    if(totalPage <= 7){
      for(let i=1; i<=totalPage; i++){
        this.addPageInPageList("" + i, i, "");
      }
    }
    else {
      if(this.pageNo < 5){
        for(let i=1; i<=5; i++){
          this.addPageInPageList("" + i, i, "");
        }
        this.addPageInPageList("...", 0, "disabled");
        this.addPageInPageList("" + totalPage, totalPage, "");
      }
      else if(this.pageNo > totalPage - 4){
        this.addPageInPageList("1", 1, "");
        this.addPageInPageList("...", 0, "disabled");
        for(let i=totalPage - 4; i<=totalPage; i++){
          this.addPageInPageList("" + i, i, "");
        }
      }
      else{
        this.addPageInPageList("1", 1, "");
        this.addPageInPageList("...", 0, "disabled");
        for(let i=this.pageNo-1; i<=this.pageNo+1; i++){
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
    if(pi > 0){
      this.pageList[pi].class = "active";
    }
    const li = this.pageList.length - 1;
    this.pageList[li].value = (totalPage <= this.pageNo) ? 0 : this.pageNo + 1;
    this.pageList[li].class = (totalPage <= this.pageNo) ? "disabled" : "";
  }

  pageClick(value: any){
    if(value != 0){
      this.pageNo = value;
      this.getServerSideTableData();
    }
  }

  searchClick(){
    this.searchedValue = this.searchValue;
    this.pageNo = 1;
    this.getServerSideTableData();
  }

  EnterSubmit(event: any){
    if(event.keyCode === 13){
      this.searchClick();
    }
  }

  addPageInPageList(t: any, v: any, c: any){
    this.pageList.push({
      title: t,
      value: v,
      class: c
    });
  }

  getServerSideTableData() {
    this.isProcessing = true;
    const date = new Date();
    const tzo = date.getTimezoneOffset() * -1;
    const dt = this.datepipe.transform(date, 'MM/dd/yyyy, hh:mm a');
    var userId=this.shareService.getUserId();
    this.authService.getAgencyProposalData(this.pageNo, this.length, this.searchedValue, userId).subscribe(data => {
      this.recordsTotal = data.recordsTotal;
      this.recordsFiltered = data.recordsFiltered;
      this.filteredRecordsShow = (this.searchedValue != "") ? true : false;
      this.start = (this.recordsFiltered == 0) ? 0 : (((this.pageNo - 1) * this.length) + 1);
      this.end = (this.recordsFiltered == 0) ? 0 : (this.pageNo * this.length);
      this.end = (this.end < this.recordsFiltered) ? this.end : this.recordsFiltered;
      this.end = (this.end < this.recordsTotal) ? this.end : this.recordsTotal;

      this.createPageList();
      this.tableData = data.agencyproposal;



    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;

    });
  }


  PrintAgencyProposal(agencyProposalId: any) {



    this.traverlerCount=0;
    this.proposalData = [];
    this.authService.getAgencyProposalDataForPrint(agencyProposalId).subscribe(data => {
      this.proposalData = data.proposaldata;
      // console.log(`${this.coreUrl}${this.proposalData[0].vLogo}`);

      //vAgencyPhoto
      $("#img").attr("src", `${this.coreUrl}${this.proposalData[0].vAgencyPhoto}`);
      $("#airlineImg").attr("src", `${this.coreUrl}${this.proposalData[0].vLogo}`);



      let adultRow = data.pricesummary.filter((x: any) => x.iOrderBy == 1);
      let childRow = data.pricesummary.filter((x: any) => x.iOrderBy == 2);
      let infantRow = data.pricesummary.filter((x: any) => x.iOrderBy == 3);
      if (adultRow.length > 0) {
        let adultRowSet = ` <tr >
        <td style=" ;
        padding: 8px;font-weight: bold;">${adultRow[0].nvPassengerTypeName}(${adultRow[0].travelerCount})</td>
        <td style=" ;
        padding: 8px;"></td>
        </tr>
        <tr >
        <td style=" ;
        padding: 8px;">Base Fare</td>
        <td style=" ;
        padding: 8px;">${this.shareService.amountShowWithCommas(adultRow[0].nBase) }</td>
        </tr>
        <tr >
        <td style=" ;
        padding: 8px;">Tax</td>
        <td style=" ;
        padding: 8px;">${this.shareService.amountShowWithCommas(adultRow[0].nTax)}</td>
        </tr>`;

        $("#adultRow").html(adultRowSet);

      } else {
        $("#adultRow").html('');
      }

      if (childRow.length > 0) {
        let childRowSet = `
        <tr >
          <td style=" ;
          padding: 8px;font-weight: bold">${childRow[0].nvPassengerTypeName}(${childRow[0].travelerCount})</td>
          <td style=" ;
          padding: 8px;"></td>
          </tr>
          <tr >
        <td style=" ;
        padding: 8px;">Base Fare</td>
        <td style=" ;
        padding: 8px;">${this.shareService.amountShowWithCommas(childRow[0].nBase)}</td>
        </tr>
        <tr >
        <td style=" ;
        padding: 8px;">Tax</td>
        <td style=" ;
        padding: 8px;">${this.shareService.amountShowWithCommas(childRow[0].nTax)}</td>
          </tr>
        `;

        $("#childRow").html(childRowSet);
      } else {
        $("#childRow").html('');
      }

      if (infantRow.length > 0) {
        let infantRowSet = `
        <tr >

        <td style=" ;
        padding: 8px;font-weight: bold">${infantRow[0].nvPassengerTypeName}(${infantRow[0].travelerCount})</td>
        <td style=" ;
        padding: 8px;"></td>
        </tr>
        <tr >
        <td style=" ;
        padding: 8px;">Base Fare</td>
        <td style=" ;
        padding: 8px;">${this.shareService.amountShowWithCommas(infantRow[0].nBase)}</td>
        </tr>
        <tr >
        <td style=" ;
        padding: 8px;">Tax</td>
        <td style=" ;
        padding: 8px;">${this.shareService.amountShowWithCommas(infantRow[0].nTax)}</td>
        </tr>

        `;

        $("#infantRow").html(infantRowSet);

      } else {
        $("#infantRow").html('');
      }


      let totalAmount = data.pricesummary.reduce((accum: any, item: any) => parseFloat(accum) + parseFloat(item.nTotal), 0);
      let totalDiscount = data.pricesummary.reduce((accum: any, item: any) => parseFloat(accum) + parseFloat(item.nDiscountAmount), 0);
      $("#totalAmount").text(this.shareService.amountShowWithCommas(totalAmount));
      $("#totalDiscount").text(this.shareService.amountShowWithCommas(totalDiscount));
      let totalPayable = totalAmount - totalDiscount;
      $("#totalPayable").text(this.shareService.amountShowWithCommas(totalPayable));

      this.traverlerCount = this.proposalData[0].travelerCount;
      var sigularPluralPerson = '';

      if (this.traverlerCount > 1) {
        sigularPluralPerson = 'Persons';
      } else {
        sigularPluralPerson = 'Person';
      }

      // $("#my_image").attr("src","second.jpg");

      $("#airportFromToCode").css({"background-color": "#808080", "color": "#fff"});

      $("#agencyManualId").text(this.proposalData[0].vAgencyManualID);
      $("#agencyName").text(this.proposalData[0].nvAgencyName);
      $("#agencyPhoneEmail").text(this.proposalData[0].nvAgencyPhoneNumber + "," + this.proposalData[0].nvAgencyEmail);
      $("#agencyAddress").text(this.proposalData[0].nvAgencyAddress);
      $("#cabinType").text(this.proposalData[0].nvCabinTypeName);
      $("#tripType").text(this.proposalData[0].nvFlightName);
      $("#flyingFrom").text(this.proposalData[0].fylingFromCity);
      $("#flyingTo").text(this.proposalData[0].fylingToCity);
      $("#departureDate").text(this.datepipe.transform(this.proposalData[0].dFromDate, 'EE d MMM yy'));
      $("#travelerCount").text(this.proposalData[0].travelerCount + " " + sigularPluralPerson);
      $("#airportFromToCode").text(this.proposalData[0].airportFromCode + "-" + this.proposalData[0].airportToCode);
      $("#airlineName").text(this.proposalData[0].nvAirlinesName);
      $("#fromAirportCodeCity").text(this.proposalData[0].airportFromCode + ", " + this.proposalData[0].fylingFromCity);
      $("#toAirportCodeCity").text(this.proposalData[0].airportToCode + ", " + this.proposalData[0].fylingToCity);
      $("#depFromDate").text(this.datepipe.transform(this.proposalData[0].dFromDate, 'EE d MMM yy'));
      $("#depToDate").text(this.datepipe.transform(this.proposalData[0].dToDate, 'EE d MMM yy'));

      var divContents = $("#agencyProposal").html();
      var printWindow = window.open('', '');

      // printWindow.document.write(divContents);
      // printWindow.document.close();
      // printWindow.print();


      // printWindow.document.write('<html><head><title></title>');
      // printWindow.document.write('<link rel="stylesheet" href="../../assets/dist/css/font-awesome.min.css">');
      // printWindow.document.write('</head><body >');

      // printWindow.document.write(divContents);

      // printWindow.document.write('</body></html>');

      printWindow.document.write('<html><head><title></title>');
      printWindow.document.write('<link rel="stylesheet" href="../../assets/dist/css/font-awesome.min.css">');
      printWindow.document.write('</head><body >');
      printWindow.document.write(divContents);
      printWindow.document.write('<script type="text/javascript">addEventListener("load", () => { print(); close(); })</script></body></html>');

      printWindow.document.close();
      printWindow.focus();




    });
  }



}
