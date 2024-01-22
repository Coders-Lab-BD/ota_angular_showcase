import { DOCUMENT, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Select2OptionData } from 'ng-select2';
import { AppComponent } from 'src/app/app.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../_services/auth.service';
import { ShareService } from '../../_services/share.service';
import { ToastrService } from '../../_services/toastr.service';
import { FlightHelperService } from '../flight-helper.service';
import flatpickr from 'flatpickr';
import yearDropdownPlugin from 'src/app/_services/flatpickr-yearDropdownPlugin';

declare var window: any;
declare var $: any;

@Component({
  selector: 'app-quick-passenger',
  templateUrl: './quick-passenger.component.html',
  styleUrls: ['./quick-passenger.component.css']
})
export class QuickPassengerComponent implements OnInit {

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

  PassengerTypeList!: Array<Select2OptionData>;
  genderTypeList!: Array<Select2OptionData>;


  @ViewChild('btnClose', { static: true })
  btnClose!: ElementRef;
  @ViewChild('btnModalOpen', { static: true })
  btnModalOpen!: ElementRef;
  @ViewChild('filebtnClose', { static: true })
  filebtnClose!: ElementRef;
  @ViewChild('filebtnModalOpen', { static: true })
  filebtnModalOpen!: ElementRef;

  quickPassengerForm!:FormGroup;
  quickPassengerModel!:any;
  header: any;

  urlMain = "./assets/dist/js/main.min.js";
  urlDemo = "./assets/dist/js/demo.js";

  loadAPI: Promise<any> | any;
  agencyId:any;
  vPassengerInformationId: any;
  passportAttchement: any = null;
  visaAttchement: any = null;
  url: SafeResourceUrl | undefined;
  isPdf: boolean = false;
  defaultUrl: string = 'assets/images/notfound/not_found.jpg';
  passportUrl: string = '';
  visaUrl: string = '';

  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter,
   private authService: AuthService,
  private router: Router, private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,public flightHelper:FlightHelperService, private appComponent: AppComponent, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.init();
    this.getServerSideTableData();
    this.CreatePassengerForm();
    this.agencyId=this.shareService.getUserId();
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
    this.authService.getQuickPassengerData(this.pageNo, this.length, this.searchedValue, userId).subscribe(data => {
      data = data.value;
      this.recordsTotal = data.recordsTotal;

      this.recordsFiltered = data.recordsFiltered;
      this.filteredRecordsShow = (this.searchedValue != "") ? true : false;
      this.start = (this.recordsFiltered == 0) ? 0 : (((this.pageNo - 1) * this.length) + 1);
      this.end = (this.recordsFiltered == 0) ? 0 : (this.pageNo * this.length);
      this.end = (this.end < this.recordsFiltered) ? this.end : this.recordsFiltered;
      this.end = (this.end < this.recordsTotal) ? this.end : this.recordsTotal;

      this.createPageList();
      this.tableData = data.passengerinfo;


      this.PassengerTypeList = [];
      data.passengertype.forEach((passengertype: { vPassengerTypeId: any; nvPassengerTypeName: any; }) => {
        this.PassengerTypeList.push({
          id: passengertype.vPassengerTypeId,
          text: passengertype.nvPassengerTypeName
        });
      });
      this.genderTypeList = [];
      data.gendertype.forEach((gendertype: { vAssignTitleWithGenderId: any; nvGenderTitleName: any; }) => {
        this.genderTypeList.push({
          id: gendertype.vAssignTitleWithGenderId,
          text: gendertype.nvGenderTitleName
        });
        this.genderTypeList.sort((a, b) => {
          const order = ['MR','MS','MRS','MSTR','MISS'];
          return order.indexOf(a.text) - order.indexOf(b.text);
        });
      });


    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;

    });
  }


  CreatePassengerForm() {
    let adultMaxDate=this.shareService.setDate(-this.iAdultBDateAge,0,-1,"");
    setTimeout(()=>{
      $(".bdate").flatpickr({
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
      $(".edate").flatpickr({
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
        minDate:this.shareService.getFlatPickDate("")
      }); 
    });
    this.quickPassengerForm = this.fb.group({
      NvFirstName: ['', Validators.required],
      NvLastName: ['', Validators.required],
      DBirthDate: ['', Validators.nullValidator],
      VPassengerTypeId: ['', Validators.required],
      NvPassportNumber: ['', Validators.required],
      DExpiryDate: ['', Validators.required],
      VAssignTitleWithGenderId: ['', Validators.required],
      VPassengerPhoneNumber:  ['', Validators.required],
      VPassengerEmail:  ['', [Validators.required, Validators.email]],
    });

  }

  visaFile: any;
  passFile: any;
  passPdf: any;
  visaPdf: any;
  readonly iAdultBDateAge: number = 12;
  edit(record: any) {
    let adultMaxDate=this.shareService.setDate(-this.iAdultBDateAge,0,-1,"");
    setTimeout(()=>{
      $(".bdate").flatpickr({
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
      $(".edate").flatpickr({
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
        minDate:this.shareService.getFlatPickDate("")
      }); 
    });

    this.header = 'Edit Passenger';
    this.vPassengerInformationId = record.vPassengerInformationId;
    this.passportUrl = record.passportAttachment? record.passportAttachment: '';
    this.visaUrl = record.visaAttachment? record.visaAttachment: '';

    let dBirthDate;
    let dateIncreaseBirthDate;
    if(record.dBirthDate!=null){
      dBirthDate =  (new Date(record.dBirthDate));
      dateIncreaseBirthDate = new Date(dBirthDate.getTime() + 86400000);
    }
    let dExpiryDate;
    let dateIncreaseExpiryDate;
    if(record.dExpiryDate!=null){
      dExpiryDate =  (new Date(record.dExpiryDate));
      dateIncreaseExpiryDate = new Date(dExpiryDate.getTime() + 86400000);
    }


    this.authService.getPassengerAttachments(record.vPassengerInformationId).subscribe(files => {
      files.data.forEach( (data: { fileAttachment: any; type: any; }) =>{
        if(data.type==1){
          if(this.detectFileType(data.fileAttachment)==='JPG'){
            this.passFile=data.fileAttachment;
          }else{
            this.passPdf = data.fileAttachment;
          }

        }if(data.type==2){
          if(this.detectFileType(data.fileAttachment)==='JPG'){
            this.visaFile=data.fileAttachment;
          }else{
            this.visaPdf = data.fileAttachment;
          }
        }
      });

    }, (error:any) => {
      console.log(error);
    });

    this.quickPassengerForm = this.fb.group({

      passFile: [record.passFile],
      visaFile: [record.visaFile],
      // VPassengerInformationId: [record.vPassengerInformationId, Validators.required],
      NvFirstName: [record.nvFirstName, Validators.required],
      NvLastName: [record.nvLastName, Validators.required],
      NvPassportNumber: [record.nvPassportNumber, Validators.required],
      VPassengerTypeId: [record.vPassengerTypeId, Validators.required],
      VAssignTitleWithGenderId: [record.vAssignTitleWithGenderId, Validators.required],
      VPassengerPhoneNumber: [record.vPassengerPhoneNumber, Validators.required],
      VPassengerEmail: [record.vPassengerEmail, [Validators.required, Validators.email]],

      DBirthDate:[record.dBirthDate==null?null: dateIncreaseBirthDate?.toISOString().replace(/T.*/,'').split('-').reverse().join('-'), Validators.nullValidator],
      DExpiryDate:[record.dExpiryDate==null?null: dateIncreaseExpiryDate?.toISOString().replace(/T.*/,'').split('-').reverse().join('-'), Validators.nullValidator],


    });
    this.btnModalOpen.nativeElement.click();
  }
  createPassenger() {

    this.CreatePassengerForm();

    this.header = 'Create Passenger';
    this.vPassengerInformationId = null;
    this.btnModalOpen.nativeElement.click();
  }

  displayBase64PDF(base64String: string): void {
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



  detectFileType(base64String: string): string {

    if (base64String.includes('jpeg')||base64String.includes('jpg')||base64String.includes('png')) {
      return 'JPG';
    } else if (base64String.includes('pdf')) {
      return 'PDF';
    } else {
      return 'Unknown';
    }
  }

  openImageInNewWindow(base64String: string): void {
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


  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  fileName = '';
  selectedFiles: any;
  onFileSelected(event: any) {

    this.selectedFiles = event.target.files;
    for (let i = 0; i < this.selectedFiles.length; i++) {


    const file:File = event.target.files[i];
    if (file) {
      console.log("file Details");
      console.log(file);


      }
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("thumbnail", file);
       // const upload$ = this.http.post("/api/thumbnail-upload", formData);
     //   upload$.subscribe();
    }
  }


  passFileURL: any =[];
  passFileNames: any = [];
  passSelectedFile: File | null = null;

  passOnChangeFile(files: any) {
    this.passFileURL=[];
    this.passFileNames= [];
    this.passSelectedFile = files.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(files.target.files[0]);
    reader.onload=(event:any)=>{
      console.log(files.target.files[0]);
      this.passportAttchement = reader.result;
      this.passFileURL.push ( event.target.result) ;
    }
   this.passFileNames[0]= files.target.files[0].name;

  }

  visaFileURL: any =[];
  visaFileNames: any = [];
  visaSelectedFile: File | null = null;

  visaOnChangeFile(files: any) {
    this.visaFileURL=[];
    this.visaFileNames= [];
    this.visaSelectedFile = files.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(files.target.files[0]);
    reader.onload = (event: any) => {
      this.visaAttchement = reader.result;
      this.visaFileURL.push ( event.target.result) ;
    }
   this.visaFileNames[0]= files.target.files[0].name;

  }


  reload(){
    const url = this.router.url;
        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate([url]);
        });

  }

  savePassengerInformation() {

    var bDate = $("#bDate").val();
    let parsedbDate = moment(bDate,"DD-MM-YYYY");

    if(parsedbDate.isValid()){
      let outputbDate = parsedbDate.format("YYYY-MM-DD");
      this.quickPassengerForm.controls.DBirthDate.setValue(outputbDate);

    }


    if (this.quickPassengerForm.valid && this.quickPassengerForm.value.VPassengerTypeId != "0") {
      this.quickPassengerModel = Object.assign({}, this.quickPassengerForm.value);
      if (this.passportAttchement !== null) {
        this.quickPassengerModel.NvPassportAttachment = this.passportAttchement;
      }
      if (this.visaAttchement !== null) {
        this.quickPassengerModel.NvVisaAttachment = this.visaAttchement;
      }

      this.quickPassengerModel.VPassengerInformationId = this.vPassengerInformationId;
      this.quickPassengerModel.DExpiryDate = this.quickPassengerModel.DExpiryDate.split('-').reverse().join('-');

      this.authService.savePassanger(this.quickPassengerModel).subscribe(() => {
        this.btnClose.nativeElement.click();

          this.toastrService.success('', 'Passenger information save successfully.');
          this.reload();

      }, (error:any) => {
        console.log(error);

      });
    } else {
      this.appComponent.validateAllFormFields(this.quickPassengerForm);
      this.toastrService.warning('', 'Required field is not filled');
      if (this.quickPassengerForm.value.DBirthDate == null) {
      this.quickPassengerForm.controls.DBirthDate.setValue('');

      } else {

        let dBirthDate =  (new Date(this.quickPassengerForm.value.DBirthDate));
        this.quickPassengerForm.controls.DBirthDate.setValue(dBirthDate.toISOString().replace(/T.*/,'').split('-').reverse().join('-'));

      }
    }
  }

  passRemoveFile(fileName: string) {
    if(this.passSelectedFile != null && this.passSelectedFile.name===fileName){
      this.passSelectedFile = null;
      this.passFileURL=[];
      this.passFileNames= [];
    }
  }

  visaRemoveFile(fileName: string) {
    if(this.visaSelectedFile != null && this.visaSelectedFile.name===fileName){
      this.visaSelectedFile = null;
      this.visaFileURL=[];
      this.visaFileNames= [];
    }
  }


  remove(vPassengerInformationId: any, nvFirstName: any) {
    Swal.fire({
      title: 'Are you sure to delete' + '"' + nvFirstName + '" ' + '?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.authService.deletePassenger(vPassengerInformationId).subscribe(() => {
          this.toastrService.success('Success', 'Passenger data deleted successfully.');
          window.location.reload();
        }, error => {
          this.toastrService.error('', 'Passenger data failed to delete.');
          console.log(error);
        });
      }
    });
  }
  openFile(url: string) {
    const lastDotIndex = url.lastIndexOf('.');

    if (lastDotIndex !== -1) {
      let type = url.slice(lastDotIndex + 1)
        if (type.toLowerCase() == 'pdf') {
          this.isPdf = true;
        }
        else {
          this.isPdf = false;
        }
    }

    if (url !== '') {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    else {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultUrl);
    }
    // this.filebtnModalOpen.nativeElement.click();
    $('#fileModal').modal('show');
  }
  className='adult-bdate';
  setPassType(item: any) {
    console.log(item.target.value);
    if('0a411685-6159-4fcb-a39f-07c3c921a16f'==item.target.value){
      let adultMaxDate=this.shareService.setDate(-this.iAdultBDateAge,0,-1,"");
      $(".bdate").flatpickr({
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
    }else if('b6c0e526-b18c-4879-82a3-d9f06f758383'==item.target.value){
      let childMinDate= this.shareService.getDateBeforeNDays(new Date().toString(),4378);//for child
      $(".bdate").flatpickr({
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
        maxDate:this.shareService.getFlatPickDate(""),
      });
    }else if('7643ef4a-af56-4dee-b571-70f1881d4a80'==item.target.value){
      let infantMinDate = this.shareService.getDateBeforeNDays(new Date().toString(),726);// for infant
      $(".bdate").flatpickr({
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
        maxDate:this.shareService.getFlatPickDate("")
      });
      
    }
  }

}
