import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import Swal from 'sweetalert2';
import { FlightHelperService } from '../flight-helper.service';
import { HomeComponent } from '../home.component';
import yearDropdownPlugin from 'src/app/_services/flatpickr-yearDropdownPlugin';

declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-book-and-hold-details',
  templateUrl: './book-and-hold-details.component.html',
  styleUrls: ['./book-and-hold-details.component.css']
})
export class BookAndHoldDetailsComponent implements OnInit {
  bookingId:any;
  data:any;
  flightName:any='';
  airport:any='';
  TripType:any;
  pnrList:any='';
  airlinesPNRList:any=[];
  duplicateAirlinesPNRList:any=[];
  issueDate:any='';
  isFareVisible:boolean=true;
  isAdultFareVisible:boolean=false;
  isChildFareVisible:boolean=false;
  isInfantFareVisible:boolean=false;
  tickrtNumber:any='';
  @ViewChild('btnClose', { static: true })
  btnClose!: ElementRef;
  @ViewChild('btnModalOpen', { static: true })
  btnModalOpen!: ElementRef;
  passengerwithticket:any=[];
  ticketData:any=[];
  isFare:boolean=true;
  iscompanyInfo:boolean=true;
  istotalFareChange:boolean=false;
  adultBaseFare:any = 0;
  adultTaxFare:any = 0;
  adultTotalFare:any = 0;
  adultTotalPassenger:any = 0;
  childBaseFare :any = 0;
  childTaxFare :any = 0;
  childTotalFare :any = 0;
  childTotalPassenger :any = 0;
  infantBaseFare :any = 0 ;
  infantTaxFare :any =0 ;
  infantTotalFare :any = 0;
  infantTotalPassenger :any = 0;
  agencyInfo:any=[];
  fareDetails : any;
  userId:any;
  ticketRefund:any;
  ticketReissue:any;
  refund:boolean=false;
  reissue:boolean=false;
  issueType:any;
  reIssue = false;
  refundReq = false;
  void = false;

//#region  Bill Status
 billStatus: any;
//#endregion

  constructor(private route: ActivatedRoute,private router: Router, private authService: AuthService,
  public shareService:ShareService, private toastrService: ToastrService,public flightHelper: FlightHelperService,
  private homeComponent: HomeComponent)
  { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookingId = history.state.bookingId;
      if(this.bookingId!=null){
        localStorage.setItem('bookingId',this.bookingId);
      }
    });
    if(this.bookingId==null){
      this.bookingId = localStorage.getItem('bookingId');
    }

    //this.bookingId = 'B0A8D524-B5F6-4736-8BDB-2103E6D68039';
    console.log(this.bookingId);
    this.getBillStatus(this.bookingId);
    this.userId = this.shareService.getUserId();
    this.authService.GetBookingDetailsByBookingId(this.bookingId).subscribe( data=>{
      console.log(data.data);
      this.data = data.data;
      this.flightName = this.data.flightTypes;
      this.data.fligtDetails.forEach((element:any) => {
        this.airport += element.departureAirport + ' - ' + element.arrivalAirport +',';
      });
      this.TripType = this.data.tripType;
      this.data.pnrList.forEach((element:any) => {
        this.pnrList += element.pnr + ' ';
        let PNRList = element.airlinesPNR.split(/\s+/);
        for (let list of PNRList)
        {
          if (!this.airlinesPNRList.some((e:any)=> e === list)) {
            this.airlinesPNRList.push(list);
          }
          this.duplicateAirlinesPNRList.push(list);
        }
      });
      this.data.adult.forEach((element:any) => {
        if(element.ticketNumber!=null){
          this.tickrtNumber += element.ticketNumber+' ';
        }
      });
      this.data.child.forEach((element:any) => {
        if(element.ticketNumber!=null){
          this.tickrtNumber += element.ticketNumber+' ';
        }
      });
      this.data.infant.forEach((element:any) => {
        if(element.ticketNumber!=null){
          this.tickrtNumber += element.ticketNumber+' ';
        }
      });
      this.tickrtNumber.trim();
      this.setIssueType();
      if(this.data.bookAndHoldLog[0].id==='71943eb6-0a19-4e2b-9880-5d2cdab38cf0' || this.data.bookAndHoldLog[0].id === '313c81b3-e37d-423d-a97c-fda36336931d'){
        this.authService.getTicketRefundInfoByBookingId(this.bookingId).subscribe( data=>{
          console.log(data.data);
          this.ticketRefund = data.data;
        },error=>{
          this.toastrService.error('Error', 'Refund data loading failed');
        });
        this.refund=true;
      }
      if(this.data.bookAndHoldLog[0].id==='8ce34a92-baca-4c65-a873-112d38f05b30'){
        this.authService.getTicketRefundInfoByBookingId(this.bookingId).subscribe( data=>{
          console.log(data.data);
          this.ticketRefund = data.data;
        },error=>{
          this.toastrService.error('Error', 'Refund data loading failed');
        });
        this.refund=true;
      }
      if(this.data.bookAndHoldLog[0].id==='987ae2ed-d037-4a33-9287-5ec86bc1d655'){
        this.authService.getTicketReissueInfoByBookingId(this.bookingId).subscribe( data=>{
          console.log(data.data);
          this.ticketReissue = data.data;
        },error=>{
          this.toastrService.error('Error', 'ReIssue data loading failed');
        });
        this.reissue=true;
      }
      this.issueDate = this.data.issueDate;
      if(this.issueDate!=''){
        this.void = this.checkVoidDate(this.issueDate);
      }
      // this.calculationInvoiceSummary();
    },error=>{
      this.toastrService.error('Error', 'Booking data not found');
    });
  }

  checkVoidDate(inputDateString: any): boolean {
    const inputDate = new Date(inputDateString);

    if (!isNaN(inputDate.valueOf())) {
      const currentDate = new Date();
      const desiredTime = new Date();
      desiredTime.setHours(22, 30, 0, 0);

      const isToday = inputDate.toDateString() === currentDate.toDateString();
      const isAfterDesiredTime = inputDate.getTime() > desiredTime.getTime();

      if (!isToday || isAfterDesiredTime) {
        console.log("The input date is not today or after 10:30 PM.");
        return false;
      } else {
        console.log("The input date is today and before 10:30 PM.");
        return true;
      }
    } else {
      console.log("Invalid input date format.");
      return false;
    }
  }

  setIssueType(){
    this.issueType = this.data.fligtDetails[0].fareDetails[0].issueType;
  }

  fareShowHideAction() {
    const fareDetailsElement = document.getElementById("fareDetailsWrap");
    if (fareDetailsElement) {
      if (fareDetailsElement.style.display === 'none' || fareDetailsElement.style.display === '') {
        fareDetailsElement.style.display = 'block'; // Show the element
      } else {
        fareDetailsElement.style.display = 'none'; // Hide the element
      }
    }
  }

  manualIssue(){
    Swal.fire({
      title: 'Do you want to issue request?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.issueRequestByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Issue Request failed');
        });
      }
    });
  }

  timeLimitExtend(){
    Swal.fire({
      title: 'Do you want to extend time limit?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.timeLimitExtendRequestByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Extend time limit request failed');
        });
      }
    });
  }

  reloadComponent() {
    this.router.navigateByUrl('/asdfdasf',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['/home/book-and-hold-details']).then(()=>{
        console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }

  cancelManualIssue(){
    Swal.fire({
      title: 'Do you want to cancel issue request?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.issueRequestCanceledByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Issue Request cancel failed');
        });
      }
    });
  }

  autoIssue(){
    Swal.fire({
      title: 'Do you want to issue ticket?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
          this.issueTransaction();
      }
    });
  }

  issueTransaction(){
    this.authService.issueTransaction(this.bookingId).subscribe( data=>{
      if(data.statusCode == 200){
        this.issue();
      }
      else{
        this.toastrService.error("Error", data.message);
      }
    },
    error=>{
      this.toastrService.error("Error", error);
    });
  }

  issue(){
    this.authService.issueTicketByBookingId(this.bookingId).subscribe( data=>{
      debugger;
      console.log(data);
      if(data.data[0].statusCode == 200 ){
        this.toastrService.success("Success","Ticket successfully issued.");
        setTimeout(() => {
          this.reloadComponent();
        }, 4000); // 4000 milliseconds (4 seconds)
      }
      else{
        this.toastrService.error('Error', data.data[0].message);
      }

    },error=>{
      this.toastrService.error('Error', 'Ticket issue failed');
    });
  }

  cancelBooking(){
    Swal.fire({
      title: 'Do you want to cancel booking?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.cancelBookinByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.statusCode==200){
            this.toastrService.success("Success", data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }else{
            this.toastrService.error('Error', data.message);
          }
        },error=>{
          console.log(error);
          this.toastrService.error('Error', 'Cancel booking failed');
        });
      }
    });
  }

  getFirstShow(ind: number): string {
    if (ind == 0) {
      return "show";
    }
    return "";
  }

  reload() {
    location.reload();
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
  reissueTotalFare =0;
  refundTotalFare = 0;

  faremanipulate(){
    this.data.fligtDetails[0].fareDetails.forEach((element:any) => {
      if(element!=null){
        if(element.passengerType==='Adult'){
          this.isAdultFareVisible = true;
          this.adultBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
          this.adultTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
          this.adultTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
          this.adultTotalPassenger = parseFloat(element.passengerNumber);
        }
        if(element.passengerType==='Child'){
          this.isChildFareVisible = true;
          this.childBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
          this.childTaxFare =  parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
          this.childTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
          this.childTotalPassenger = parseFloat(element.passengerNumber);
        }
        if(element.passengerType==='Infant'){
          this.isInfantFareVisible = true;
          this.infantBaseFare = parseFloat(element.markupBaseFare)*parseFloat(element.passengerNumber);
          this.infantTaxFare = parseFloat(element.markupTaxFare)*parseFloat(element.passengerNumber);
          this.infantTotalFare = parseFloat(element.markupTotalFare)*parseFloat(element.passengerNumber);
          this.infantTotalPassenger = parseFloat(element.passengerNumber);
        }
      }
    });
    if(this.isFareVisible){
      this.isFareVisible=false;
    }else{
      this.isFareVisible=true;
    }
    if(this.data?.ticketReIssueRequest?.totalFare){
      this.reissueTotalFare = this.data?.ticketReIssueRequest?.totalFare;
    }
    if(this.data?.ticketRefundRequest?.refundAmount){
      this.refundTotalFare = this.data?.ticketRefundRequest?.refundAmount;
    }

  }

  calculateTotalClientFare(fareDetails:any): number {
    let total = 0;
    for (const fareDetail of fareDetails) {
      if (fareDetail) {
        total += fareDetail.markupTotalFare * fareDetail.passengerNumber;
      }
    }
    return total;
  }

  calculateTotalAgentFare(fareDetails:any): number {
    let total = 0;
    for (const fareDetail of fareDetails) {
      if (fareDetail) {
        total += fareDetail.totalAgentFare * fareDetail.passengerNumber;
      }
    }
    return total;
  }

  // adultBase:number=0;
  // adultTax:number=0;
  // adultClientFare:number=0;
  // adultDisount:number=0;
  // adultAgentFare:number=0;

  // childBase:number=0;
  // childTax:number=0;
  // childClientFare:number=0;
  // childDisount:number=0;
  // childAgentFare:number=0;

  // infantBase:number=0;
  // infantTax:number=0;
  // infantClientFare:number=0;
  // infantDisount:number=0;
  // infantAgentFare:number=0;

  // calculationInvoiceSummary(){
  //   if(this.TripType =="Domestic"){
  //     if(this.data.adult.length>0){
  //       this.data.fligtDetails.forEach((element:any) => {
  //         this.adultClientFare += parseFloat(element.fareDetails[0].markupTotalFare) * this.data.adult.length;
  //         this.adultAgentFare += parseFloat(element.fareDetails[0].totalAgentFare) * this.data.adult.length;
  //       });
  //     }
  //     if(this.data.child.length>0){
  //       this.data.fligtDetails.forEach((element:any) => {
  //         this.childClientFare += parseFloat(element.fareDetails[1].markupTotalFare) * this.data.child.length;
  //         this.childAgentFare += parseFloat(element.fareDetails[1].totalAgentFare) * this.data.child.length;
  //       });
  //     }
  //     if(this.data.infant.length>0){
  //       this.data.fligtDetails.forEach((element:any) => {
  //         try{
  //           this.infantClientFare += parseFloat(element.fareDetails[2].markupTotalFare) * this.data.infant.length;
  //           this.infantAgentFare += parseFloat(element.fareDetails[2].totalAgentFare) * this.data.infant.length;
  //         }catch{
  //           this.infantClientFare += parseFloat(element.fareDetails[1].markupTotalFare) * this.data.infant.length;
  //           this.infantAgentFare += parseFloat(element.fareDetails[1].totalAgentFare) * this.data.infant.length;
  //         }
  //       });
  //     }
  //   }
  //   else if(this.TripType == "International"){
  //     if(this.data.adult.length>0){
  //       this.adultBase = parseFloat(this.data.fligtDetails[0].fareDetails[0].markupBaseFare) * this.data.adult.length;
  //       this.adultTax = parseFloat(this.data.fligtDetails[0].fareDetails[0].markupTaxFare) * this.data.adult.length;
  //       this.adultClientFare = parseFloat(this.data.fligtDetails[0].fareDetails[0].markupTotalFare) * this.data.adult.length;
  //       this.adultDisount = parseFloat(this.data.fligtDetails[0].fareDetails[0].discount) * this.data.adult.length;
  //       this.adultAgentFare = parseFloat(this.data.fligtDetails[0].fareDetails[0].totalAgentFare) * this.data.adult.length;
  //     }
  //     if(this.data.child.length>0){
  //       this.childBase = parseFloat(this.data.fligtDetails[0].fareDetails[1].markupBaseFare) * this.data.child.length;
  //       this.childTax = parseFloat(this.data.fligtDetails[0].fareDetails[1].markupTaxFare) * this.data.child.length;
  //       this.childClientFare = parseFloat(this.data.fligtDetails[0].fareDetails[1].markupTotalFare) * this.data.child.length;
  //       this.childDisount = parseFloat(this.data.fligtDetails[0].fareDetails[1].discount) * this.data.child.length;
  //       this.childAgentFare = parseFloat(this.data.fligtDetails[0].fareDetails[1].totalAgentFare) * this.data.child.length;
  //     }
  //     if(this.data.infant.length>0){
  //       try{
  //         this.infantBase = parseFloat(this.data.fligtDetails[0].fareDetails[2].markupBaseFare) * this.data.infant.length;
  //         this.infantTax = parseFloat(this.data.fligtDetails[0].fareDetails[2].markupTaxFare) * this.data.infant.length;
  //         this.infantClientFare = parseFloat(this.data.fligtDetails[0].fareDetails[2].markupTotalFare) * this.data.infant.length;
  //         this.infantDisount = parseFloat(this.data.fligtDetails[0].fareDetails[2].discount) * this.data.infant.length;
  //         this.infantAgentFare = parseFloat(this.data.fligtDetails[0].fareDetails[2].totalAgentFare) * this.data.infant.length;
  //       }catch
  //       {
  //         this.infantBase = parseFloat(this.data.fligtDetails[0].fareDetails[1].markupBaseFare) * this.data.infant.length;
  //         this.infantTax = parseFloat(this.data.fligtDetails[0].fareDetails[1].markupTaxFare) * this.data.infant.length;
  //         this.infantClientFare = parseFloat(this.data.fligtDetails[0].fareDetails[1].markupTotalFare) * this.data.infant.length;
  //         this.infantDisount = parseFloat(this.data.fligtDetails[0].fareDetails[1].discount) * this.data.infant.length;
  //         this.infantAgentFare = parseFloat(this.data.fligtDetails[0].fareDetails[1].totalAgentFare) * this.data.infant.length;
  //       }
  //     }
  //   }
  // }

  adultBaseFareInputChange(event: any) {
    this.adultBaseFare = event.target.value;
    this.adultTotalFare = this.adultBaseFare*this.adultTotalPassenger + this.adultTaxFare*this.adultTotalPassenger;
  }

  adultTaxFareInputChange(event: any) {
    this.adultTaxFare = event.target.value;
    this.adultTotalFare = this.adultBaseFare*this.adultTotalPassenger + this.adultTaxFare*this.adultTotalPassenger;
  }

  childBaseFareInputChange(event: any) {
    this.childBaseFare = event.target.value;
    this.childTotalFare = this.childBaseFare*this.childTotalPassenger + this.childTaxFare*this.childTotalPassenger;
  }

  childTaxFareInputChange(event: any) {
    this.childTaxFare = event.target.value;
    this.childTotalFare = this.childBaseFare*this.childTotalPassenger + this.childTaxFare*this.childTotalPassenger;
  }

  infantBaseFareInputChange(event: any) {
    this.infantBaseFare = event.target.value;
    this.infantTotalFare = this.infantBaseFare*this.infantTotalPassenger + this.infantTaxFare*this.infantTotalPassenger;
  }

  infantTaxFareInputChange(event: any) {
    this.infantTaxFare = event.target.value;
    this.infantTotalFare = this.infantBaseFare*this.infantTotalPassenger + this.infantTaxFare*this.infantTotalPassenger;
  }

  reissueFareManipulation(event:any){
    this.reissueTotalFare = event.target.value;
  }

  refundFareManipulation(event:any){
    this.refundTotalFare = event.target.value;
  }

  showTicket(ind:any)
  {
    try{

        this.authService.getAgencyInfo(this.userId).subscribe( data=>{
          this.agencyInfo = data.agencyinfo;
          console.log(this.agencyInfo);
        });
        const fareDetails: Fareetails = {
          adultBaseFare : this.adultBaseFare,
          adultTaxFare : this.adultTaxFare,
          adultTotalFare:this.adultTotalFare,
          adultTotalPass:this.adultTotalPassenger,
          childBaseFare:this.childBaseFare,
          childTaxFare:this.childTaxFare,
          childTotalFare:this.childTotalFare,
          childTotalPass:this.childTotalPassenger,
          infantBaseFare:this.infantBaseFare,
          infantTaxFare:this.infantTaxFare,
          infantTotalFare:this.infantTotalFare,
          infantTotalPass:this.infantTotalPassenger,
          totalFare:this.adultTotalFare+this.childTotalFare+this.infantTotalFare
        };
        this.fareDetails = fareDetails;
       $('#ticketModal').modal('show');
    }catch(exp){}
  }

  showModifyTicketModal()
  {
    this.faremanipulate();
    this.btnModalOpen.nativeElement.click();
  }

  refundRequest(){
    this.refundReq = true;
  }

  refundRequ(){
    Swal.fire({
      title: 'Do you want to refund request?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.passengers.forEach(element => {
          this.data.adult.forEach((adult:any) => {
            if(adult.id===element){
              this.adults.push(adult);
            }
          });
        });
        this.passengers.forEach(element => {
          this.data.child.forEach((child:any) => {
            if(child.id===element){
              this.childs.push(child);
            }
          });
        });
        this.passengers.forEach(element => {
          this.data.infant.forEach((infant:any) => {
            if(infant.id===element){
              this.infants.push(infant);
            }
          });
        });
    
        let bookingDetails = null;
        if(this.data.adult.length==this.adults.length
          && this.data.child.length==this.childs.length
          && this.data.infant.length==this.infants.length)
        {
          bookingDetails = null;
        }
        else
        {
          this.data.adult = this.adults;
          this.data.child = this.childs;
          this.data.infant = this.infants;
          this.data.fligtDetails.forEach((commonData:any) => {
            if(this.adults.length>0){
              commonData.fareDetails[0].passengerNumber = this.adults.length;
            }else{
              try {
                commonData.fareDetails[0] = null;
              } catch (error) {
    
              }
            }
            if(this.childs.length>0){
              commonData.fareDetails[1].passengerNumber = this.childs.length;
            }else{
              if(this.infants.length>0){
                try {
                  commonData.fareDetails[1].passengerNumber = this.infants.length;
                } catch (error) {
                  
                }
              }else{
                try {
                  commonData.fareDetails[1] = null;
                } catch (error) {
      
                }
              }
            }
            if(this.infants.length>0){
              try {
                commonData.fareDetails[2].passengerNumber = this.infants.length;
              } catch (error) {
    
              }
            }else{
              try {
                commonData.fareDetails[2] = null;
              } catch (error) {
    
              }
            }
    
          });
          bookingDetails = this.data;
        }
    
        const data = {
          bookingId: this.bookingId,
          bookingDetails: bookingDetails
        };
    
    
        this.authService.refundRequestByBookingId(data).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            localStorage.setItem('bookingId',data.data.data);
            location.reload();
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Issue Request failed');
        });
      }else{
        
      }
    });
  }

  cancelRefundRequest(){
    Swal.fire({
      title: 'Do you want to cancel refund request?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.refundRequestCanceledByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Issue Request cancel failed');
        });
      }
    });
  }

  refundRequestAccepted(){
    Swal.fire({
      title: 'Do you want to accept offer?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.refundOfferAceptedByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }else if(data.data.statusCode == 400){
            this.toastrService.error('Error', data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Refund failed');
        });
      }
    });
  }

  refundRequestRejected(){
    Swal.fire({
      title: 'Do you want to rejet offer?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.refundOfferRejectedByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Refund offer reject failed');
        });
      }
    });
  }

  flightSearchDataSet() {
    let isDomestic = 'False';
    if(this.TripType=="Domestic"){
      isDomestic='True'
    }else{
      isDomestic='False'
    }

    let multiDeparture:any[]=[];
    let multiArrival:any[]=[];
    let oneWay=false;
    let roundTrip=false;
    let multiCity=false;
    let cabin:any =[];
    if(this.data.flightTypes=="OneWay"){
      var selectedFromDate = String($('#dateChange'+0).val() || '');
      selectedFromDate = selectedFromDate.split('-').reverse().join('-');
      oneWay=true;
      multiDeparture.push({
        CityCode:this.data.fligtDetails[0].departureAirport,
        CityName:this.data.fligtDetails[0].departureCity,
        Date:selectedFromDate
      });
      multiArrival.push({
        CityCode:this.data.fligtDetails[0].arrivalAirport,
        CityName:this.data.fligtDetails[0].arrivalCity,
        Date:''
      });
    }else if(this.data.flightTypes=="RoundTrip"){
      roundTrip=true;
      var selectedFromDate = String($('#dateChange'+0).val() || '');
      selectedFromDate = selectedFromDate.split('-').reverse().join('-');
      var selectedToDate = String($('#dateChange'+1).val() || '');
      selectedToDate = selectedToDate.split('-').reverse().join('-');
      if(selectedToDate=='' || selectedFromDate==''){
        roundTrip=false;
        oneWay=true;
      }
      if(oneWay && selectedToDate==''){
        multiDeparture.push({
          CityCode:this.data.fligtDetails[0].departureAirport,
          CityName:this.data.fligtDetails[0].departureCity,
          Date:selectedFromDate
        });
        multiArrival.push({
          CityCode:this.data.fligtDetails[0].arrivalAirport,
          CityName:this.data.fligtDetails[0].arrivalCity,
          Date:''
        });
      }else if(oneWay && selectedFromDate==''){
        multiDeparture.push({
          CityCode:this.data.fligtDetails[0].arrivalAirport,
          CityName:this.data.fligtDetails[0].arrivalCity,
          Date:selectedToDate
        });
        multiArrival.push({
          CityCode:this.data.fligtDetails[0].departureAirport,
          CityName:this.data.fligtDetails[0].departureCity,
          Date:''
        });
      }else if(roundTrip ){
        multiDeparture.push({
          CityCode:this.data.fligtDetails[0].departureAirport,
          CityName:this.data.fligtDetails[0].departureCity,
          Date:selectedFromDate
        });
        multiArrival.push({
          CityCode:this.data.fligtDetails[0].arrivalAirport,
          CityName:this.data.fligtDetails[0].arrivalCity,
          Date:selectedToDate
        });
      }

    }else if(this.data.flightTypes=="Multicity"){
      multiCity=true;
      var count = 0;
      var index = [];
      for(var i=0; i< this.data.fligtDetails.length; i++){
        var selectedDate = String($('#dateChange'+i).val() || '');
        selectedDate = selectedDate.split('-').reverse().join('-');
        if(selectedDate!=''){
          count++;
          index.push(i);
        }
      }
      if(count==1){
        multiCity=false;
        oneWay=true;
      }
      index.forEach(element => {
        multiDeparture.push({
          CityCode:this.data.fligtDetails[element].departureAirport,
          CityName:this.data.fligtDetails[element].departureCity,
          Date:String($('#dateChange'+element).val().split('-').reverse().join('-') || '')
        });
        multiArrival.push({
          CityCode:this.data.fligtDetails[element].arrivalAirport,
          CityName:this.data.fligtDetails[element].arrivalCity,
          Date:''
        });
      });
    }
    
    this.data.fligtDetails.forEach((element:any) => {
      if(element.cabinClass=='Economy')
      {
        cabin.push('Y')
      }else if(element.cabinClass=='Business')
      {
        cabin.push('C')
      }else if(element.cabinClass=='Premium Economy')
      {
        cabin.push('J')
      }else if(element.cabinClass=='First Class')
      {
        cabin.push('F')
      }
    });

    this.passengers.forEach(element => {
      this.data.adult.forEach((adult:any) => {
        if(adult.id===element){
          this.adults.push(adult);
        }
      });
    });
    this.passengers.forEach(element => {
      this.data.child.forEach((child:any) => {
        if(child.id===element){
          this.childs.push(child);
        }
      });
    });
    this.passengers.forEach(element => {
      this.data.infant.forEach((infant:any) => {
        if(infant.id===element){
          this.infants.push(infant);
        }
      });
    });
    this.data.adult = this.adults;
    this.data.child = this.childs;
    this.data.infant = this.infants;
    //console.log(JSON.stringify(this.data));
    let loaderData={
      Departure:multiDeparture,
      Arrival:multiArrival,
      adult:this.adults.length,
      childList:new Array(this.childs.length),
      infant:this.infants.length,
      classType:cabin,
      airlines:this.data.fligtDetails[0].carrier,
      isOneWay:oneWay,
      isRoundTrip:roundTrip,
      isMultiCity:multiCity,
      isReissue:true,
      stop:'2'
    };
    localStorage.setItem('isDomestic',isDomestic);
    localStorage.setItem('providerName',this.data.fligtDetails[0].providerName);
    localStorage.setItem('supplierShortName',this.data.fligtDetails[0].supplierShortName);
    localStorage.setItem('loaderData', JSON.stringify(loaderData));
    localStorage.setItem('bookingDetails', JSON.stringify(this.data));
    this.router.navigate(['/home/common-flight-search']);
  }
  adults:any[]=[];
  childs:any[]=[];
  infants:any[]=[];
  passengers: any[] = [];

  onAdultChange(item:any, isChecked: any) {
    if(isChecked.target.checked) {
      console.log("checked");
      this.passengers.push(item.id);
      this.data.infant.forEach((infant:any) => {
        if(infant.number==item.number){
          this.passengers.push(infant.id);
          const infantCheckbox = document.getElementById(infant.id) as HTMLInputElement;
          if (infantCheckbox) {
            infantCheckbox.checked = true;
          }
        }
      });
    } else {
      console.log("unchecked");
      let index = this.passengers.indexOf(item.id);
      this.passengers.splice(index,1);
      this.data.infant.forEach((infant:any) => {
        if(infant.number==item.number){
          let index = this.passengers.indexOf(infant.id);
          this.passengers.splice(index,1);
          const infantCheckbox = document.getElementById(infant.id) as HTMLInputElement;
          if (infantCheckbox) {
            infantCheckbox.checked = false;
          }
        }
      });
    }
  }

  onChildChange(id:string, isChecked: any) {
    if(isChecked.target.checked) {
      console.log("checked");
      this.passengers.push(id);
    } else {
      console.log("unchecked");
      let index = this.passengers.indexOf(id);
      this.passengers.splice(index,1);
    }
  }

  dateChangeRequest(){
    this.reIssue = true;
        setTimeout(()=>{
          flatpickr(".departure-date",{
            plugins: [
              yearDropdownPlugin({
               date: new Date(),
               yearStart: 0,
               yearEnd: 2
             })
           ],
            enableTime: false,
            dateFormat: "d-m-Y",
            allowInput:true,
            minDate:"today"
          });
        });
  }

  cancelDateChangeRequest(){
    Swal.fire({
      title: 'Do you want to cancel date change request?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.reIssueRequestCanceledByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Date change request failed');
        });
      }
    });
  }

  reissueRequestAccepted(){
    Swal.fire({
      title: 'Do you want to accept offer?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.reIssueOfferAceptedByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }else if(data.data.statusCode == 400){
            this.toastrService.error('Error', data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Reissue offer accept failed');
        });
      }
    });
  }

  reissueRequestRejected(){
    Swal.fire({
      title: 'Do you want to rejet offer?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.reIssueOfferRejectedByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Reissue offer reject failed');
        });
      }
    });
  }

  voidRequest(){
    Swal.fire({
      title: 'Do you want to void request?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.voidRequestByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Void Request failed');
        });
      }
    });
  }

  cancelVoidRequest(){
    Swal.fire({
      title: 'Do you want to cancel refund request?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.authService.voidRequestCanceledByBookingId(this.bookingId).subscribe( data=>{
          console.log(data);
          if(data.data.statusCode == 200 ){
            this.toastrService.success("Success",data.data.message);
            setTimeout(() => {
              this.reloadComponent();
            }, 4000); // 4000 milliseconds (4 seconds)
          }
          else{
            this.toastrService.error('Error', data.data.message);
          }
        },error=>{
          this.toastrService.error('Error', 'Void Request cancel failed');
        });
      }
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
  getBillStatus(bookingId:any){
    this.authService.getBillStatus(bookingId).subscribe(data =>{
      this.billStatus = JSON.parse(data.data)
      console.log(this.billStatus);

    },
    error =>{
      this.toastrService.error('',error);
    })
  }

  getFileType(base64String: string): string {

    if (base64String.includes('jpeg')||base64String.includes('jpg')||base64String.includes('png')) {
      return 'JPG';
    } else if (base64String.includes('pdf')) {
      return 'PDF';
    } else {
      return 'Unknown';
    }
  }

  displayPDF(base64String: string): void {
    const pdfData = `${base64String}`;
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
    const imageData = `${base64String}`;
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

  adultPassSelectedFile: any=[];
  adultVisaSelectedFile: any=[];
  childPassSelectedFile: any = [];
  childVisaSelectedFile: any = [];
  infantPassSelectedFile: any = [];
  infantVisaSelectedFile: any = [];

  openUpdatePassDiv(index:any){
    const fareDetailsElement = document.getElementById(index);
    if (fareDetailsElement) {
      if (fareDetailsElement.style.display === 'none' || fareDetailsElement.style.display === '') {
        fareDetailsElement.style.display = 'block'; // Show the element
      } else {
        fareDetailsElement.style.display = 'none'; // Hide the element
      }
    }

  }

  adultPassOnChangeFile(event: any, index:any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.adultPassSelectedFile[index] = reader.result;;
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  adultVisaOnChangeFile(event: any, index:any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.adultVisaSelectedFile[index] = reader.result;;
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  childPassOnChangeFile(event: any, index:any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.childPassSelectedFile[index] = reader.result;;
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  childVisaOnChangeFile(event: any, index:any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.childVisaSelectedFile[index] = reader.result;;
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  infantPassOnChangeFile(event: any, index:any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.infantPassSelectedFile[index] = reader.result;;
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  infantVisaOnChangeFile(event: any, index:any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let self = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (reader.result) {
            console.log(reader.result);
            self.infantVisaSelectedFile[index] = reader.result;;
        } else {
            console.error('Failed to read the file.');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  saveAdultPassFile(id:any,inde:any){
    console.log(id,this.adultPassSelectedFile[inde]);
    const data ={
      id:id,
      passport:this.adultPassSelectedFile[inde]
    };
    this.authService.UpdateFileByPassengerId(data).subscribe( data=>{
      console.log(data);
      if(data.data.statusCode == 200 ){
        this.toastrService.success("Success",data.data.message);
        setTimeout(() => {
          this.reloadComponent();
        }, 4000); // 4000 milliseconds (4 seconds)
      }
      else{
        this.toastrService.error('Error', data.data.message);
      }
    });
  }

  saveAdultVisaFile(id:any,inde:any){
    console.log(id,this.adultVisaSelectedFile[inde]);
    const data ={
      id:id,
      visa:this.adultVisaSelectedFile[inde]
    };
    this.authService.UpdateFileByPassengerId(data).subscribe( data=>{
      console.log(data);
      if(data.data.statusCode == 200 ){
        this.toastrService.success("Success",data.data.message);
        setTimeout(() => {
          this.reloadComponent();
        }, 4000); // 4000 milliseconds (4 seconds)
      }
      else{
        this.toastrService.error('Error', data.data.message);
      }
    });
  }

  saveChildPassFile(id:any,inde:any){
    console.log(id,this.childPassSelectedFile[inde]);
    const data ={
      id:id,
      passport:this.childPassSelectedFile[inde]
    };
    this.authService.UpdateFileByPassengerId(data).subscribe( data=>{
      console.log(data);
      if(data.data.statusCode == 200 ){
        this.toastrService.success("Success",data.data.message);
        setTimeout(() => {
          this.reloadComponent();
        }, 4000); // 4000 milliseconds (4 seconds)
      }
      else{
        this.toastrService.error('Error', data.data.message);
      }
    });
  }

  saveChildVisaFile(id:any,inde:any){
    console.log(id,this.childVisaSelectedFile[inde]);
    const data ={
      id:id,
      visa:this.childVisaSelectedFile[inde]
    };
    this.authService.UpdateFileByPassengerId(data).subscribe( data=>{
      console.log(data);
      if(data.data.statusCode == 200 ){
        this.toastrService.success("Success",data.data.message);
        setTimeout(() => {
          this.reloadComponent();
        }, 4000); // 4000 milliseconds (4 seconds)
      }
      else{
        this.toastrService.error('Error', data.data.message);
      }
    });
  }

  saveInfantPassFile(id:any,inde:any){
    console.log(id,this.infantPassSelectedFile[inde]);
    const data ={
      id:id,
      passport:this.infantPassSelectedFile[inde]
    };
    this.authService.UpdateFileByPassengerId(data).subscribe( data=>{
      console.log(data);
      if(data.data.statusCode == 200 ){
        this.toastrService.success("Success",data.data.message);
        setTimeout(() => {
          this.reloadComponent();
        }, 4000); // 4000 milliseconds (4 seconds)
      }
      else{
        this.toastrService.error('Error', data.data.message);
      }
    });
  }

  saveInfantVisaFile(id:any,inde:any){
    console.log(id,this.infantVisaSelectedFile[inde]);
    const data ={
      id:id,
      visa:this.infantVisaSelectedFile[inde]
    };
    this.authService.UpdateFileByPassengerId(data).subscribe( data=>{
      console.log(data);
      if(data.data.statusCode == 200 ){
        this.toastrService.success("Success",data.data.message);
        setTimeout(() => {
          this.reloadComponent();
        }, 4000); // 4000 milliseconds (4 seconds)
      }
      else{
        this.toastrService.error('Error', data.data.message);
      }
    });
  }
}

export interface Fareetails{
  adultBaseFare:number;
  adultTaxFare:number;
  adultTotalFare:number;
  adultTotalPass:number;

  childBaseFare:number;
  childTaxFare:number;
  childTotalFare:number;
  childTotalPass:number;

  infantBaseFare:number;
  infantTaxFare:number;
  infantTotalFare:number;
  infantTotalPass:number;

  totalFare:number;
}

