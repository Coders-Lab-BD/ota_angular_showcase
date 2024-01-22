import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.css']
})
export class ChargeComponent implements OnInit {
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
  isDataGridShow = true;
  isBtnCreateShow = true;

  dataTable: any;
  dtOptions: any;
  tableData: any;
  header: any;
  @ViewChild('dataTable', { static: true })
  table!: { nativeElement: any; };
  @ViewChild('btnClose', { static: true })
  btnClose!: ElementRef;
  @ViewChild('btnEditShow', { static: true })
  btnEditShow!: ElementRef;
  @ViewChild('btnModalOpen', { static: true })
  btnModalOpen!: ElementRef;
  chargeForm!: FormGroup;
  chargeModel: any;
  flighttypelists:any=[];
  flightroutetypelists:any=[];

  constructor( private fb: FormBuilder, public shareService:ShareService, public authService:AuthService, private router: Router, private appComponent: AppComponent, private toastrService: ToastrService ) { }

  ngOnInit(): void {
    this.CreateChargeForm();
    this.getChargeList();
    this.isBtnCreateShow = false;
  }

  lengthChange(sl: any){
    this.pageNo = 1;
    this.length = sl;
    this.getChargeList();
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
      this.getChargeList();
    }
  }

  searchClick(){
    this.searchedValue = this.searchValue;
    this.pageNo = 1;
    this.getChargeList();
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

  CreateChargeForm(){
    this.chargeForm = this.fb.group({
      VChargeId: ['', Validators.nullValidator],
      VFlightRouteTypeId: ['', Validators.required],
      VFlightTypeId: ['', Validators.required],
      NDateChangeFee: ['', Validators.required],
      NCancellationFee: ['', Validators.required]
    })
  }

  getChargeList() {
    this.authService.getChargeList(this.pageNo, this.length, this.searchedValue).subscribe(data => {
      this.recordsTotal = data.recordsTotal;
      this.recordsFiltered = data.recordsFiltered;
      this.filteredRecordsShow = (this.searchedValue != "") ? true : false;
      this.start = (this.recordsFiltered == 0) ? 0 : (((this.pageNo - 1) * this.length) + 1);
      this.end = (this.recordsFiltered == 0) ? 0 : (this.pageNo * this.length);
      this.end = (this.end < this.recordsFiltered) ? this.end : this.recordsFiltered;
      this.end = (this.end < this.recordsTotal) ? this.end : this.recordsTotal;
      data.chargelist.forEach((value: any, index: any) => {
        value.index = this.start + index;
      });
      this.createPageList();
      this.tableData = data.chargelist;

      this.flightroutetypelists = [];
      this.flightroutetypelists = data.flightroutetypelist;
      this.flighttypelists = [];
      this.flighttypelists = data.flighttypelist;
    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;

    });
  }

  saveCharge() {
    if (this.chargeForm.valid) {
      this.chargeModel = Object.assign({}, this.chargeForm.value);
      this.chargeModel.VChargeId = (this.chargeModel.VChargeId === '') ? null : this.chargeModel.VChargeId;
      this.authService.saveCharge(this.chargeModel).subscribe(() => {
        this.btnClose.nativeElement.click();
        this.toastrService.success('Success', 'Charge data saved successfully.');
        const url = this.router.url;
        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate([url]);
        });
      }, error => {
        this.toastrService.error('', 'Charge data saved failed.');
        console.log(error);
      });
    } else {
      this.appComponent.validateAllFormFields(this.chargeForm);
      this.toastrService.warning('', 'Required field is not filled');
    }
  }

  edit(vChargeId: any) {
    this.header='Update Charge';
    this.authService.getChargeById(vChargeId).subscribe((data: { charge: any[]; }) => {
      const charge = data.charge[0];
      this.chargeForm = this.fb.group({
        VChargeId: [charge.vChargeId, Validators.nullValidator],
        VFlightRouteTypeId: [charge.vFlightRouteTypeId, Validators.required],
        VFlightTypeId: [charge.vFlightTypeId, Validators.required],
        NDateChangeFee: [charge.nDateChangeFee, Validators.required],
        NCancellationFee: [charge.nCancellationFee, Validators.required]
      });
      this.btnModalOpen.nativeElement.click();
    }, err => {
      this.toastrService.error('Error', 'Data fetch problem');
      console.log(err);
    });
  }

  remove(vChargeId: any, nvFlightRouteTypeName: any) {
    Swal.fire({
      title: 'Are you sure to delete' + '"' + nvFlightRouteTypeName + '" ' + '?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.authService.deleteCharge(vChargeId).subscribe(() => {
          this.toastrService.success('Success', 'Charge data deleted successfully.');
          window.location.reload();
        }, error => {
          this.toastrService.error('', 'Charge data failed to delete.');
          console.log(error);
        });
      }
    });
  }

  Create() {
    this.CreateChargeForm();
    this.isDataGridShow = false;
    this.isBtnCreateShow = false;
  }

  reload(){
    const url = this.router.url;
    this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

  EditShow() {
    this.isDataGridShow = false;
  }
}
