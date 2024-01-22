import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
declare var window: any;
declare var $: any;
@Component({
  selector: 'app-dom-multi-city-flight-result',
  templateUrl: './dom-multi-city-flight-result.component.html',
  styleUrls: ['./dom-multi-city-flight-result.component.css', '../../../../assets/dist/css/custom.css']
})
export class DomMultiCityFlightResultComponent implements OnInit {

  topFlightSearchSkeleton: boolean = true;
  first_leg_index:any='00';
  second_leg_index:any='10';
  third_leg_index:any='20';
  fouth_leg_index:any='30';
  five_leg_index:any='40';
  dataitem:any = 0;
  first_leg:any;
  second_leg:any;
  third_leg:any;
  fourth_leg:any;
  first:boolean=true;
  @Input() filterData: any[] = [];
  @Input() multicityTabList: any[] = [];
  @Input() displayedData: any[] = [];
  @Input() isShowFilter:any;
  @Output() childEvent = new EventEmitter();
  @Output() viewMoreAndLessChildEvent = new EventEmitter();
  @Input() isAgentFare: Boolean | undefined;
  showMore: boolean = false;
  bookFlightDetails:any[]=[];
  // displayedData: any[] = [];

  constructor(public shareService:ShareService, private router: Router,private authService: AuthService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    debugger;
    // this.ViewMoreAndLessData();
  }
  selectFlightAction(id: number) {
    this.dataitem=id;
    this.childEvent.emit(id);
    // this.ViewMoreAndLessData();
  }
  bottomFlightAction()
  {
    var isBottom=$("#bottomFlightData").css("display");
    $("#triggerSummary").removeClass("clicked");
    $("#triggerOverlay").removeClass("clicked");
    if(isBottom=="block" || isBottom=="flex")
    {
      $("#bottomFlightData").hide('slow');
    }else{
      $("#bottomFlightData").show('slow');
      $("#triggerSummary").addClass("clicked");
      $("#triggerOverlay").addClass("clicked");
    }
  }

  first_leg_selectFlightBatch (index:number, value:number){
    if(this.first){
      if(this.filterData[0]){
        this.first_leg =this.filterData[0][0];
      }
      if(this.filterData[1]){
        this.second_leg =this.filterData[1][0];
      }
      if(this.filterData[2]){
        this.third_leg =this.filterData[2][0];
      }
      if(this.filterData[3]){
        this.fourth_leg=this.filterData[3][0];
      }
      this.first = false;
    }
    if(index==0){
      this.first_leg_index = this.getString(index,value);
      this.first_leg = this.filterData[index][value];
    }
    else if(index==1){
      this.second_leg_index = this.getString(index,value);
      this.second_leg = this.filterData[index][value];
    }
    else if(index==2){
      this.third_leg_index = this.getString(index,value);
      this.third_leg = this.filterData[index][value];
    }
    else if(index==3){
      this.fouth_leg_index = this.getString(index,value);
      this.fourth_leg = this.filterData[index][value];
    }
    else if(index==4){
      this.five_leg_index = this.getString(index,value);
    }

  }
  getString(dataitem:number,j:number){
    return dataitem.toString()+j.toString();
  }
  getTotalAmount(first:any, second:any, third:any, fourth:any){
    return parseFloat(first.replace(/,/g, ''))+parseFloat(second.replace(/,/g, ''))+parseFloat(third.replace(/,/g, ''))+parseFloat(fourth.replace(/,/g, ''));
  }
  bookAndHoldAction(){
    if(this.first_leg){
      this.bookFlightDetails.push(this.first_leg);
    }
    if(this.second_leg){
      this.bookFlightDetails.push(this.second_leg);
    }
    if(this.third_leg){
      this.bookFlightDetails.push(this.third_leg);
    }
    if(this.fourth_leg){
      this.bookFlightDetails.push(this.fourth_leg);
    }
    const navigationExtras: NavigationExtras = {
      state: {
        selectedCommonFlight: this.bookFlightDetails
      }
    };
    this.router.navigate(['/home/book-and-hold'], navigationExtras);
  }
    get showMoreText(): string {
    return this.showMore ? 'View Less' : 'View More';
  }
  requestAction(){
    if(this.first_leg){
      this.bookFlightDetails.push(this.first_leg);
    }
    if(this.second_leg){
      this.bookFlightDetails.push(this.second_leg);
    }
    if(this.third_leg){
      this.bookFlightDetails.push(this.third_leg);
    }
    if(this.fourth_leg){
      this.bookFlightDetails.push(this.fourth_leg);
    }
    console.log(this.bookFlightDetails);
    var bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')!);
    bookingDetails.fligtDetails = this.bookFlightDetails;
    console.log(bookingDetails);
    this.authService.reIssueRequestedByAgency(bookingDetails).subscribe( data=>{
      console.log(data.data);
      if(data.data.statusCode == 200 ){
        this.toastrService.success("Success",data.data.message);
        const navigationExtras: NavigationExtras = {
          state: {
            bookingId: data.data.data
          }
        };
        this.router.navigate(['/home/book-and-hold-details'], navigationExtras);
      }
    },error=>{
      this.toastrService.error('Error', 'Request failed');
    });
  }
  toggleViewMoreLess() {
    debugger;
    this.viewMoreAndLessChildEvent.emit();
    // this.sortByAscending();
    // if (this.showMore) {
    //     this.displayedData[0] = this.filterData[0].slice(0, 10);
    //     this.displayedData[1] = this.filterData[1].slice(0, 10);
    //     if (this.filterData[2]) {
    //       this.displayedData[2] = this.filterData[2].slice(0, 10);
    //     }
    //     if (this.filterData[3]) {
    //       this.displayedData[3] = this.filterData[3].slice(0, 10);
    //     }
    // } else {
    //   // Show all items
    //   this.displayedData = this.filterData.slice();
    // }
    this.showMore = !this.showMore;
  }
  ViewMoreAndLessData() {
    debugger;
    // this.viewMoreAndLessChildEvent.emit();
    // this.sortByAscending();
    //   this.displayedData[0] = this.filterData[0].slice(0, 10);
    //   this.displayedData[1] = this.filterData[1].slice(0, 10);
    //   if (this.filterData[2]) {
    //     this.displayedData[2] = this.filterData[2].slice(0, 10);
    //   }
    //   if (this.filterData[3]) {
    //     this.displayedData[3] = this.filterData[3].slice(0, 10);
    //   }
    this.showMore = false;
  }
  makeProposalDataSet()
  {
    try{
        let bookFlightDetails=[];
        
        if(this.first_leg){
          bookFlightDetails.push(this.first_leg);
        }
        if(this.second_leg){
          bookFlightDetails.push(this.second_leg);
        }
        if(this.third_leg){
          bookFlightDetails.push(this.third_leg);
        }
        if(this.fourth_leg){
          bookFlightDetails.push(this.fourth_leg);
        }
        console.log("Data::");
        console.log(bookFlightDetails);
        localStorage.setItem('flightType','Multi');
        localStorage.setItem('proposalData',JSON.stringify(bookFlightDetails));
        const customEvent = new Event('proposalModalShown');
        document.dispatchEvent(customEvent);
        $('#proposalModal').modal('show');
      }catch(exp){

      }
  }
}
