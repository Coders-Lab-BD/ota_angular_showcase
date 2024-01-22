import { Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from '../../_services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, DOCUMENT } from '@angular/common';
import { ShareService } from '../../_services/share.service';
import { FlightHelperService } from '../flight-helper.service';
import flatpickr from "flatpickr";
import { Select2OptionData } from 'ng-select2';
import * as moment from 'moment';
import { AppComponent } from 'src/app/app.component';
import Swal from 'sweetalert2';
declare var window: any;
declare var $: any;

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
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

  @ViewChild('btnClose', { static: true })
  btnClose!: ElementRef;
  @ViewChild('btnModalOpen', { static: true })
  btnModalOpen!: ElementRef;

  urlMain = "./assets/dist/js/main.min.js";
  urlDemo = "./assets/dist/js/demo.js";

  loadAPI: Promise<any> | any;

  paymentDetails: any;

  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
    private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter,
    private authService: AuthService, private activatedRoute: ActivatedRoute,
    private router: Router, private httpClient: HttpClient, private toastrService: ToastrService, private elementRef: ElementRef,
    public shareService: ShareService, public flightHelper: FlightHelperService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.init();
    debugger;
    //#region Payment Refrence from Transaction Ledger page
    let paymentId = null;
        this.activatedRoute.paramMap.subscribe(params => {
          this.searchedValue = history.state.paymentId == undefined ? '' : history.state.paymentId;      
        });
    //#endregion
    
    this.getServerSidePaymentHistoryData();
     //#region Payment Refrence from Transaction Ledger page
    if(this.searchedValue != ''){
      this.view(this.searchedValue);
    }
    //#endregion
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
  public init(): void {
    this.loadAPI = new Promise(resolve => {
      // console.log("resolving promise...");
      this.loadScript();
    });
  }

  lengthChange(sl: any) {
    this.pageNo = 1;
    this.length = sl;
    this.getServerSidePaymentHistoryData();
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
      this.getServerSidePaymentHistoryData();
    }
  }

  searchClick() {
    this.searchedValue = this.searchValue;
    this.pageNo = 1;
    this.getServerSidePaymentHistoryData();
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

  getServerSidePaymentHistoryData() {
    this.isProcessing = true;
    const date = new Date();
    const tzo = date.getTimezoneOffset() * -1;
    const dt = this.datepipe.transform(date, 'MM/dd/yyyy, hh:mm a');
    var userId=this.shareService.getUserId();
    this.authService.getPaymentHistoryData(this.pageNo, this.length, this.searchedValue, userId).subscribe(data => {
      data = JSON.parse(data.data);
      console.log(data);
      this.paymentDetails = data.transaction[0];
      this.recordsTotal = data.recordsTotal;
      this.recordsFiltered = data.recordsFiltered;
      this.filteredRecordsShow = (this.searchedValue != "") ? true : false;
      this.start = (this.recordsFiltered == 0) ? 0 : (((this.pageNo - 1) * this.length) + 1);
      this.end = (this.recordsFiltered == 0) ? 0 : (this.pageNo * this.length);
      this.end = (this.end < this.recordsFiltered) ? this.end : this.recordsFiltered;
      this.end = (this.end < this.recordsTotal) ? this.end : this.recordsTotal;
      this.createPageList();
      this.tableData = data.transaction;
    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;
    });
  }

  view(paymentId: any){
    this.btnModalOpen.nativeElement.click();
    this.paymentDetails = this.tableData.filter((x: { Id: any; }) => x.Id === paymentId)[0];
    console.log(this.paymentDetails);
  }
  remove(id: any, nvPaymentModeName: any) {
    Swal.fire({
      title: 'Are you sure to delete' + '"' + nvPaymentModeName + '" ' + '?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.authService.deleteTransaction(id).subscribe(() => {
          this.toastrService.success('Success', 'Transaction data deleted successfully.');
          window.location.reload();
        }, error => {
          this.toastrService.error('', 'Transaction data failed to delete.');
          console.log(error);
        });
      }
    });
  }


}
