import { DatePipe, DOCUMENT } from '@angular/common';
import { Component, Renderer2, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';

@Component({
  selector: 'app-refund-partial-date-void-temporary-request',
  templateUrl: './refund-partial-date-void-temporary-request.component.html',
  styleUrls: ['./refund-partial-date-void-temporary-request.component.css']
})
export class RefundPartialDateVoidTemporaryRequestComponent implements OnInit {
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
  loadAPI: Promise<any> | any;
  urlMain = "./assets/dist/js/main.min.js";
  urlDemo = "./assets/dist/js/demo.js";
  queryString: any;
  bookinglists: any[] = [];
  CancelRequest1 = ["2241E541-4504-4F55-8CBA-0425755880FE"];
  AcceptRequest1 = ["A48898D8-050B-4C2C-8163-93BB80F71BFE"];
  CancelTicket = ["06470B0A-6814-4FFE-8E5E-086DD257F9BE"];
  TemporaryCancel = ["A7712A7B-CC8C-4FF0-B4DA-2B665E7B5632"];
  CancelOffer1 = ["D0A40954-7867-4B7C-8AC8-C0700CF1E925"];
  PartialPaymentRequest = ["28D18AB1-9749-4B87-BA85-49CF90D1C693"];
  CancelRequest2 = ["509FA446-364A-4D5E-B3DF-1B6A17667515"];
  AcceptOffer1 = ["324DCF66-EF5D-43E1-9751-18BE00B21C0B"];
  AcceptRequest2 = ["96E4026D-2DF8-439F-84CD-CE1D63B8D01F"];
  AcceptRequest3 = ["E64E2907-A80E-4913-A94E-21553C0D9C5E"];
  CancelRequest3 = ["0624D519-1C24-4FC9-BC0D-89FF0EEB0515"];
  CancelRequest4 = ["6DAE36DD-5885-404C-8B71-99265B9E29B8"];
  AcceptRequest4 = ["2A960CCA-CFDA-4B53-8F2F-391693A0A99A"];
  CancelRequest5 = ["14059F12-9694-4E0C-B577-14A2F8EE7E63"];
  CancelOffer2 = ["5EA08B86-2C10-4107-A5AD-1682C8141876"];
  CancelRequest6 = ["EAEEE238-8A88-48F5-8611-8E2F15CE41C7"];
  CancelRequest7 = ["DE24A31B-EEDB-4C96-A7F2-DE0DAFB488A4"];
  AcceptRequest5 = ["9F23744F-3ADB-47D7-8B7C-676D7235E654"];
  AcceptRequest6 = ["1353B59C-2BE7-4B5E-B2CC-051924255F3A"];
  AcceptOffer2 = ["2E698D0D-F4AD-4D70-9803-F2A59529A2BE"];
  CancelRequest8 = ["2C373253-DDE8-4515-A2F3-6BC94AD8059B"];
  AcceptRequest7 = ["8EAB0637-679D-4C13-8CF9-41EE6ADE7D45"];
  CancelRequest9 = ["A891FF48-AC40-4CC0-BEF7-729C7FDA887A"];
  VoidTicket = ["16608C16-4EC3-440E-87ED-C1BA697CE7B8"];
  DateChange = ["584FCA2C-C68E-428C-A6A8-ADFE7043735F"];
  Void = ["DEAA59D8-95F0-4958-A95E-88A09A994945"];
  Refund = ["E3F85DD5-ACC8-441D-939C-6645F7EEA196"];

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, public datepipe: DatePipe, public shareService: ShareService, private authService: AuthService) { }

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
    this.authService.GetServerSideBookingAllActionList(userId, this.pageNo, this.length, this.searchedValue).subscribe(data => {
      this.recordsTotal = data.recordsTotal;
      this.recordsFiltered = data.recordsFiltered;
      this.filteredRecordsShow = (this.searchedValue != "") ? true : false;
      this.start = (this.recordsFiltered == 0) ? 0 : (((this.pageNo - 1) * this.length) + 1);
      this.end = (this.recordsFiltered == 0) ? 0 : (this.pageNo * this.length);
      this.end = (this.end < this.recordsFiltered) ? this.end : this.recordsFiltered;
      this.end = (this.end < this.recordsTotal) ? this.end : this.recordsTotal;
      data.bookinglist.forEach((value: any, index: any) => {
        value.index = this.start + index;
        // if (value.vTicketProcessStatusId == this.AcceptRequest1 || value.vTicketProcessStatusId == this.AcceptRequest2 || value.vTicketProcessStatusId == this.AcceptRequest3 ||
        //   value.vTicketProcessStatusId == this.AcceptRequest4 || value.vTicketProcessStatusId == this.AcceptRequest5 || value.vTicketProcessStatusId == this.AcceptRequest6 ||
        //   value.vTicketProcessStatusId == this.AcceptRequest7 || value.vTicketProcessStatusId == this.CancelRequest1 || value.vTicketProcessStatusId == this.CancelRequest2 ||
        //   value.vTicketProcessStatusId == this.CancelRequest3 || value.vTicketProcessStatusId == this.CancelRequest4 || value.vTicketProcessStatusId == this.CancelRequest5 ||
        //   value.vTicketProcessStatusId == this.CancelRequest6 || value.vTicketProcessStatusId == this.CancelRequest7 || value.vTicketProcessStatusId == this.CancelRequest8 ||
        //   value.vTicketProcessStatusId == this.CancelRequest9 || value.vTicketProcessStatusId == this.CancelTicket || value.vTicketProcessStatusId == this.TemporaryCancel ||
        //   value.vTicketProcessStatusId == this.CancelOffer1 || value.vTicketProcessStatusId == this.CancelOffer2 || value.vTicketProcessStatusId == this.PartialPaymentRequest ||
        //   value.vTicketProcessStatusId == this.AcceptOffer1 || value.vTicketProcessStatusId == this.AcceptOffer2 || value.vTicketProcessStatusId == this.VoidTicket ||
        //   value.vTicketProcessStatusId == this.DateChange || value.vTicketProcessStatusId == this.Void || value.vTicketProcessStatusId == this.Refund) {
          value.dCreationDateTime = this.datepipe.transform(value.dCreationDateTime, 'dd-MMM-yyyy');
        //   this.bookinglists.push(value)
        // }
      });
      // data.bookingrefund.forEach((value: any, index: any) => {
      //   value.index = this.start + index;
      //   value.dCreationDateTime = this.datepipe.transform(value.dCreationDateTime, 'dd-MMM-yyyy');
      //   this.bookinglists.push(value)
      // });
      // data.bookingpartialpayment.forEach((value: any, index: any) => {
      //   value.index = this.start + index;
      //   value.dCreationDateTime = this.datepipe.transform(value.dCreationDateTime, 'dd-MMM-yyyy');
      //   this.bookinglists.push(value)
      // });
      // data.bookingvoid.forEach((value: any, index: any) => {
      //   value.index = this.start + index;
      //   value.dCreationDateTime = this.datepipe.transform(value.dCreationDateTime, 'dd-MMM-yyyy');
      //   this.bookinglists.push(value)
      // });
      // data.bookingtemporarycancel.forEach((value: any, index: any) => {
      //   value.index = this.start + index;
      //   value.dCreationDateTime = this.datepipe.transform(value.dCreationDateTime, 'dd-MMM-yyyy');
      //   this.bookinglists.push(value)
      // });
      // data.temporarycancel.forEach((value: any, index: any) => {
      //   value.index = this.start + index;
      //   value.dCreationDateTime = this.datepipe.transform(value.dCreationDateTime, 'dd-MMM-yyyy');
      //   this.bookinglists.push(value)
      // });
      this.createPageList();
      this.tableData = data.bookinglist;
    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;
    });
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
  edit(id: any){}
}
