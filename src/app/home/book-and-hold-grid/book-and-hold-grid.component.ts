import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { FlightHelperService } from '../flight-helper.service';

@Component({
  selector: 'app-book-and-hold-grid',
  templateUrl: './book-and-hold-grid.component.html',
  styleUrls: ['./book-and-hold-grid.component.css']
})
export class BookAndHoldGridComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute,private authService: AuthService,public shareService:ShareService, private toastrService: ToastrService,public flightHelper: FlightHelperService) { }
  data:any;
  isProcessing:any;
  recordsFiltered:any;
  totalRows:number=0;
  totalPage:number=0;
  pageArray:any = [];
  pageNo:number = 1;
  length:number = 10;
  userId:any;
  activePage: number =1;
  start: number =0;
  end: number = 0;
  color: string = 'blue';
  providerColumn:any;
  ngOnInit(): void {
    this.isProcessing =true;
    this.userId = this.shareService.getUserId();
    this.pageArray = [];
    this.authService.GetBookingDetails(this.userId, this.pageNo, this.length).subscribe( data=>{
      this.data = data.data;
      this.totalRows = data.totalRows;
      this.providerColumn = data.providerColumn;
      console.log(this.providerColumn);
      
      this.totalPage = Math.ceil(this.totalRows/10);
      this.createPageList();
      if(this.data.length==0){
        this.recordsFiltered=0;
      }
      this.start = (((this.pageNo*this.length)-this.length)+1);
      this.end = this.pageNo * this.length;
      if(this.end > this.totalRows){
        this.end = this.totalRows;
      }
      this.isProcessing =false;
    },error=>{
      this.toastrService.error('Error', 'Booking data not found');
    });


  }

  addPageInPageList(t: any, v: any, c: any){
    this.pageArray.push({
      title: t,
      value: v,
      class: c
    });
  }

  createPageList(){
    this.pageArray = [];
    this.addPageInPageList("Previous", 0, "");
    if(this.totalPage <= 7){
      for(let i=1; i<=this.totalPage; i++){
        this.addPageInPageList("" + i, i, "");
      }
    }
    else {
      if(this.pageNo < 5){
        for(let i=1; i<=5; i++){
          this.addPageInPageList("" + i, i, "");
        }
        this.addPageInPageList("...", 0, "disabled");
        this.addPageInPageList("" + this.totalPage, this.totalPage, "");
      }
      else if(this.pageNo > this.totalPage - 4){
        this.addPageInPageList("1", 1, "");
        this.addPageInPageList("...", 0, "disabled");
        for(let i=this.totalPage - 4; i<=this.totalPage; i++){
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
        this.addPageInPageList("" + this.totalPage, this.totalPage, "");
      }
    }
    this.addPageInPageList("Next", 0, "");

    this.pageArray[0].value = (this.pageNo <= 1) ? 0 : this.pageNo - 1;
    this.pageArray[0].class = (this.pageNo <= 1) ? "disabled" : "";
    const pi = this.pageArray.findIndex((x: any) => x.value == this.pageNo);
    if(pi > 0){
      this.pageArray[pi].class = "active";
    }
    const li = this.pageArray.length - 1;
    this.pageArray[li].value = (this.totalPage <= this.pageNo) ? 0 : this.pageNo + 1;
    this.pageArray[li].class = (this.totalPage <= this.pageNo) ? "disabled" : "";
  }

  pageClick(value: any) {
    if (value != 0) {
      this.activePage = value;
      this.isProcessing =true;
      this.pageNo = value;
      this.pageArray = [];

      this.authService.GetBookingDetails(this.userId, this.pageNo, this.length).subscribe( data=>{
        this.data = data.data;
        this.totalRows = data.totalRows;
        this.totalPage = Math.ceil(this.totalRows/10);
        this.createPageList();
        if(this.data.length==0){
          this.recordsFiltered=0;
        }
        this.start = (((this.pageNo*this.length)-this.length)+1);
        this.end = this.pageNo * this.length;
        if(this.end > this.totalRows){
          this.end = this.totalRows;
        }
        this.isProcessing =false;
      },error=>{
        this.toastrService.error('Error', 'Booking data not found');
      });

    }
  }

  lengthChange(sl: any) {
    this.length = sl;
    this.pageNo = 1;
    this.pageArray = [];
    this.isProcessing =true;
    this.activePage = 1;
    this.authService.GetBookingDetails(this.userId, this.pageNo, this.length).subscribe( data=>{
      this.data = data.data;
      this.totalRows = data.totalRows;
      this.totalPage = Math.ceil(this.totalRows/this.length);
      this.createPageList();

      if(this.data.length==0){
        this.recordsFiltered=0;
      }
      this.start = (((this.pageNo*this.length)-this.length)+1);
      this.end = this.pageNo * this.length;
      if(this.end > this.totalRows){
        this.end = this.totalRows;
      }
      this.isProcessing =false;
    },error=>{
      this.toastrService.error('Error', 'Booking data not found');
    });

  }

  getpnr(model:any){
    var pnrList = '';
    if(model){
      model.forEach((element:any) => {
        pnrList += element.pnr+' ';
      });
    }
    return pnrList;
  }

  getAirlinesPnr(model:any){
    var pnrList = '';
    if(model){
      model.forEach((element:any) => {
        pnrList += element.airlinesPNR+' ';
      });
    }
    return pnrList;
  }

  edit(bookingId:any){
    const navigationExtras: NavigationExtras = {
      state: {
        bookingId: bookingId
      }
    };
    this.router.navigate(['/home/book-and-hold-details'], navigationExtras);
  }

  getTicketNumber(record:any){
    let tickrtNumber = '';
    record.adult.forEach((element:any) => {
      if(element.ticketNumber!=null){
        tickrtNumber += element.ticketNumber+', ';
      }
    });
    record.child.forEach((element:any) => {
      if(element.ticketNumber!=null){
        tickrtNumber += element.ticketNumber+', ';
      }
    });
    record.infant.forEach((element:any) => {
      if(element.ticketNumber!=null){
        tickrtNumber += element.ticketNumber+', ';
      }
    });
    return tickrtNumber.trim().slice(0, -1);
  }

  getArrow(flightType:any){
    if(flightType=='OneWay'){
      return '>';
    }else {
      return '<>';
    }
  }

  getBackgroundStyle(bookingStatus: string) {
    if (bookingStatus === 'Isssued') {
        return 'background-color: green;';
    } else if (bookingStatus === 'Booked') {
        return 'background-color: blue;';
    } else if (bookingStatus === 'Refunded') {
        return 'background-color: red;';
    } else if (bookingStatus === 'Cancelled') {
        return 'background-color: red;';
    } else if (bookingStatus === 'Refund Request Processing') {
        return 'background-color: violet;';
    }else if (bookingStatus === 'Refund Request Rejected') {
        return 'background-color: red;';
    } else if (bookingStatus === 'Refund Requested') {
        return 'background-color: blueviolet;';
    } else if (bookingStatus === 'Date Change Rejected') {
        return 'background-color: red;';
    } else if (bookingStatus === 'Date Change Requested') {
        return 'background-color: blueviolet;';
    }else if (bookingStatus === 'Date Changed') {
        return 'background-color: green;';
    }else if (bookingStatus === 'Void') {
        return 'background-color: red;';
    }else{
        return 'background-color: red;';
    }
  }

  removeDuplicate(airlinesPnr:string){
    if(airlinesPnr==' ()' || airlinesPnr=='()'){
      return '';
    }else{
      let a = airlinesPnr.split(' ');
      let uniqueAirlinesPnr = Array.from(new Set(a));
      return uniqueAirlinesPnr.join('');
    }
  }
}
