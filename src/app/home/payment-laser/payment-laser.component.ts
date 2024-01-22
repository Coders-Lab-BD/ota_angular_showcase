import { DatePipe, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import flatpickr from 'flatpickr';
import { AuthService } from 'src/app/_services/auth.service';
import yearDropdownPlugin from 'src/app/_services/flatpickr-yearDropdownPlugin';
import { ShareService } from 'src/app/_services/share.service';

@Component({
  selector: 'app-payment-laser',
  templateUrl: './payment-laser.component.html',
  styleUrls: ['./payment-laser.component.css']
})
export class PaymentLaserComponent implements OnInit {
  isProcessing = true;
  length = 10;
  searchFromDate = '';
  searchToDate = '';
  fromDate = '';
  toDate = '';
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

  constructor(@Inject(DOCUMENT) private document: Document, public shareService: ShareService, public datepipe: DatePipe, private fb: FormBuilder, public formatter: NgbDateParserFormatter,
    private authService: AuthService, private router: Router, private httpClient: HttpClient, private elementRef: ElementRef) { }

  ngOnInit() {
    this.init();
    //#region initial ledger for last 60 days
    let daysToAdd = 60;
    let today = new Date();
    const newDate = new Date(today);
    newDate.setDate(today.getDate() - daysToAdd);
    this.searchToDate = today.toDateString();
    this.searchFromDate = newDate.toDateString();
    this.getServerSidePaymentLaserData();
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
    setTimeout(() => {
      flatpickr(".fromdate", {
        plugins: [
          yearDropdownPlugin({
           date: new Date(),
           yearStart: 100,
           yearEnd: 100
         })
       ],
        enableTime: false,
        dateFormat: "d-m-Y",
        allowInput: false,
        //maxDate: "today"
      });
      flatpickr(".todate", {
        plugins: [
          yearDropdownPlugin({
           date: new Date(),
           yearStart: 100,
           yearEnd: 100
         })
       ],
        enableTime: false,
        dateFormat: "d-m-Y",
        allowInput: false
      });  
    });
    


    $(document).ready(() => {
      $('.fromdate').on('change', (a:any) => {
        
        let dateObject = new Date(a.currentTarget._flatpickr.selectedDates[0]);
        const day = dateObject.getDate().toString().padStart(2, '0');
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
        const year = dateObject.getFullYear();

        this.fromDate = `${day}/${month}/${year}`;

        flatpickr(".todate", {
          plugins: [
            yearDropdownPlugin({
             date: new Date(),
             yearStart: 100,
             yearEnd: 100
           })
         ],
          enableTime: false,
          dateFormat: "d-m-Y",
          allowInput: false,
          minDate: this.fromDate
        });  
      });
    });
  }




  lengthChange(sl: any) {
    this.pageNo = 1;
    this.length = sl;
    this.getServerSidePaymentLaserData();
  }

  createPageList() {
    let totalPage = Math.ceil(((this.searchFromDate == "") ? this.recordsTotal : this.recordsFiltered) / this.length);
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
      this.getServerSidePaymentLaserData();
    }
  }

  searchClick() {
    this.searchFromDate = this.fromDate.split('-').reverse().join('-');;
    this.searchToDate = this.toDate.split('-').reverse().join('-');;
    this.pageNo = 1;
    this.getServerSidePaymentLaserData();
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

  getServerSidePaymentLaserData() {
    this.isProcessing = true;
    const date = new Date();
    const tzo = date.getTimezoneOffset() * -1;
    const dt = this.datepipe.transform(date, 'MM/dd/yyyy, hh:mm a');
    var userId=this.shareService.getUserId();
    this.authService.getPaymentLaserData(this.pageNo, this.length, this.searchFromDate, this.searchToDate, userId).subscribe(data => {
      debugger;
      if(data.statusCode == 200){
        data = JSON.parse(data.data);
      this.recordsTotal = data.recordsTotal;
      this.recordsFiltered = data.recordsFiltered;
      this.filteredRecordsShow = (this.searchFromDate != "") ? true : false;
      this.start = (this.recordsFiltered == 0) ? 0 : (((this.pageNo - 1) * this.length) + 1);
      this.end = (this.recordsFiltered == 0) ? 0 : (this.pageNo * this.length);
      this.end = (this.end < this.recordsFiltered) ? this.end : this.recordsFiltered;
      this.end = (this.end < this.recordsTotal) ? this.end : this.recordsTotal;
      this.createPageList();
      this.tableData = data.PAYMENT;
      console.log(data.PAYMENT);
      }
      
    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;
    });
  }

  reload() {
    const url = this.router.url;
    this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }
  
  PreviewDetails(bookingId:any, paymentId: any){
    const navigationExtras: NavigationExtras = {
      state: {
        bookingId: bookingId,
        paymentId: paymentId
      }
    };
    if(paymentId == null && bookingId == null) return;
    if(paymentId == null ||   paymentId == "00000000-0000-0000-0000-000000000000")
      this.router.navigate(['/home/book-and-hold-details'], navigationExtras);
    else
    this.router.navigate(['/home/paymenthistory'], navigationExtras);
  }
}
