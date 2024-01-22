import { DatePipe, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Select2OptionData } from 'ng-select2';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FlightHelperService } from '../flight-helper.service';
import { HomeComponent } from '../home.component';


declare var $: any;
declare function GenerateQRCode(params: any): any;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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


  // Page visited

  isProcessingPageVisited = true;
  lengthPageVisited = 10;
  searchedValuePageVisited = '';
  searchValuePageVisited = '';
  pageNoPageVisited = 1;
  pageListPageVisited: any;
  startPageVisited = 0;
  endPageVisited = 0;
  recordsTotalPageVisited = 0;
  recordsFilteredPageVisited = 0;
  filteredRecordsShowPageVisited = false;
  tableDataPageVisited: any;

  countryList!: Array<Select2OptionData>;



  urlMain = "./assets/dist/js/main.min.js";
  urlDemo = "./assets/dist/js/demo.js";

  loadAPI: Promise<any> | any;


  profileModel: any;
  codeSubmitModel: any;
  changePasswordModel: any;
  registerStatus = false;
  agencyProfileForm!: FormGroup;
  codeSubmitForm!: FormGroup;
  changePasswordForm!: FormGroup;
  changePhoneAndNumberForm!: FormGroup;
  authModel!:any;
  User = {
    id: '',
    firstName: '',
    lastName: '',
    userName: '',
    twoFactorEnabled: false,
    photo: '',
    email: '',
    roleId: '',
    fullName: '',
    roleName: '',
    country: '',
    gender: '',
    phoneNumber: '',
    lastLogin: '',
    totalLogin: '',
    totalPageVisited: '',
    agencyId: '',
    agencyManualId: '',
    agencyAddress: '',
    agencyCity: '1',
    agencyCountryId: '',
    agencyEmail: '',
    agencyName: '',
    agencyPhone: '',
    agencyPhoto: '',
    agencyPostalCode: '',
    agencyCountryName:''
  };



  photo = '';
  dataTableLogin: any;
  dtOptionsLogin: any;
  tableDataLogin = [];
  dataTablePageVisit: any;
  dtOptionsPageVisit: any;
  tableDataPageVisit = [];
  @ViewChild('dataTableLogin', {static: true}) logintable:any;
  @ViewChild('dataTablePageVisit', {static: true}) pagevisittable:any;

  //image
  fileData!: File;
  previewUrl: any = null;
  fileUploadProgress: string = '';
  uploadedFilePath: string = '';
  profilePhoto: any = '';

  coreUrl = environment.apiUrl.substring(0, environment.apiUrl.length - 4);



  uploadedImageName: string = '';
  profileImgURL: any = '';

  isQRCodeShow = false;
  is2faEnabled = false;
  txt2FactorEnable: string = '';
  btnName: string = 'Enable 2-step';
  setPass = false;
  passText = 'Change Password';

  @ViewChild('btnClose', { static: true })
  btnClose!: ElementRef;
  @ViewChild('btnModalOpen', { static: true })
  btnModalOpen!: ElementRef;

  changeType: string = '';
  isEmailVerified: boolean = true;
  isPhoneVerified: boolean = false;



  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private fb: FormBuilder, public formatter: NgbDateParserFormatter,
   private authService: AuthService,
  private router: Router, private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,public flightHelper:FlightHelperService, private appComponent: AppComponent,  private homeComponent: HomeComponent) {
  }
    ngOnInit() {

      this.init();
      this.getProfileData();
      this.CreateChangePasswordForm();
      this.CreateAgencyProfileForm();
      this.createChangePhoneAndNumberForm();

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
    this.getProfileData();
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
      this.getProfileData();
    }
  }

  searchClick(){
    this.searchedValue = this.searchValue;
    this.pageNo = 1;
    this.getProfileData();
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


 // page visited

 lengthChangePageVisited(sl: any){
  this.pageNoPageVisited = 1;
  this.lengthPageVisited = sl;
  //this.getVisitedData();
}

createPageListPageVisited(){
  let totalPage = Math.ceil(((this.searchedValuePageVisited == "") ? this.recordsTotalPageVisited : this.recordsFilteredPageVisited) / this.lengthPageVisited);
  this.pageListPageVisited = [];
  this.addPageInPageListPageVisited("Previous", 0, "");
  if(totalPage <= 7){
    for(let i=1; i<=totalPage; i++){
      this.addPageInPageListPageVisited("" + i, i, "");
    }
  }
  else {
    if(this.pageNo < 5){
      for(let i=1; i<=5; i++){
        this.addPageInPageListPageVisited("" + i, i, "");
      }
      this.addPageInPageListPageVisited("...", 0, "disabled");
      this.addPageInPageListPageVisited("" + totalPage, totalPage, "");
    }
    else if(this.pageNoPageVisited > totalPage - 4){
      this.addPageInPageListPageVisited("1", 1, "");
      this.addPageInPageListPageVisited("...", 0, "disabled");
      for(let i=totalPage - 4; i<=totalPage; i++){
        this.addPageInPageListPageVisited("" + i, i, "");
      }
    }
    else{
      this.addPageInPageListPageVisited("1", 1, "");
      this.addPageInPageListPageVisited("...", 0, "disabled");
      for(let i=this.pageNoPageVisited-1; i<=this.pageNoPageVisited+1; i++){
        this.addPageInPageListPageVisited("" + i, i, "");
      }
      this.addPageInPageListPageVisited("...", 0, "disabled");
      this.addPageInPageListPageVisited("" + totalPage, totalPage, "");
    }
  }
  this.addPageInPageListPageVisited("Next", 0, "");

  this.pageListPageVisited[0].value = (this.pageNoPageVisited <= 1) ? 0 : this.pageNoPageVisited - 1;
  this.pageListPageVisited[0].class = (this.pageNoPageVisited <= 1) ? "disabled" : "";
  const pi = this.pageListPageVisited.findIndex((x: any) => x.value == this.pageNoPageVisited);
  if(pi > 0){
    this.pageListPageVisited[pi].class = "active";
  }
  const li = this.pageListPageVisited.length - 1;
  this.pageListPageVisited[li].value = (totalPage <= this.pageNoPageVisited) ? 0 : this.pageNoPageVisited + 1;
  this.pageListPageVisited[li].class = (totalPage <= this.pageNoPageVisited) ? "disabled" : "";
}

pageClickPageVisited(value: any){
  if(value != 0){
    this.pageNoPageVisited = value;
    //this.getVisitedData();
  }
}

searchClickPageVisited(){
  this.searchedValuePageVisited = this.searchValuePageVisited;
  this.pageNoPageVisited = 1;
  //this.getVisitedData();
}

EnterSubmitPageVisited(event: any){
  if(event.keyCode === 13){
    this.searchClickPageVisited();
  }
}

addPageInPageListPageVisited(t: any, v: any, c: any){
  this.pageListPageVisited.push({
    title: t,
    value: v,
    class: c
  });
}




  SetInactive() {
    this.homeComponent.SetInactive();
  }




  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    this.uploadedImageName=fileInput.target.files[0].name;
    this.preview();
  }

  preview() {
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);

    reader.onload = (_event) => {
      this.profilePhoto = reader.result;
      this.agencyProfileForm.value.VAgencyPhoto = reader.result;
      this.profileImgURL = reader.result;


    };

  }

  DeletePicture(e: any) {
    e.preventDefault();
    this.profilePhoto = null;
    $("#profileFile").val('');
    this.profileImgURL = '';
  }


  CreateAgencyProfileForm() {
    this.agencyProfileForm = this.fb.group({
      VAgencyId: ['', Validators.required],
      NvAgencyName: ['', Validators.required],
      NvAgencyEmail: ['', [Validators.required, Validators.email]],
      NvAgencyPhoneNumber: ['', Validators.required],
      NvAgencyAddress: ['', Validators.required],
      VCountryId: ['', Validators.required],
      NvAgencyCityName: ['', Validators.required],
      VAgencyPostalCode: ['', Validators.required],
      VAgencyPhoto: ['', Validators.nullValidator],

      //
      // Photo: ['', Validators.nullValidator],
      // FirstName: ['', Validators.required],
      // LastName: ['', Validators.required],
      // UserName: ['', Validators.required],
      // Email: ['', [Validators.required, Validators.email]],
      // Country: ['', Validators.required],
      // Gender: ['', Validators.required],
      // PhoneNumber: ['', Validators.required],
      // RoleId: ['', Validators.required]
    });
  }

  CreateChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      OldPassword: ['', Validators.required],
      NewPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator});
  }

  CreateSetPasswordForm() {
    this.changePasswordForm = this.fb.group({
      NewPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('NewPassword')!.value === g.get('ConfirmPassword')!.value ? null : {'mismatch': true};
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
        this.changePasswordModel = Object.assign({}, this.changePasswordForm.value);
        if (this.setPass) {
          this.authService.setPassword(this.changePasswordModel).subscribe(() => {
            this.setPass = false;
            this.passText = 'Change Password';
            this.CreateChangePasswordForm();
            this.toastrService.success('', 'Password set successfully');
          }, error => {
            this.toastrService.error('', 'Password set failed');
            console.log(error);
          });
        } else {
          this.authService.changePassword(this.changePasswordModel).subscribe(() => {
            this.CreateChangePasswordForm();
            this.toastrService.success('', 'Password change successfully');
          }, error => {
            this.toastrService.error('', 'Password change failed');
            console.log(error);
          });
        }
    } else {
      this.toastrService.warning('', 'Required field is not filled');
    }
  }

  updateProfile() {
    if (this.agencyProfileForm.valid) {

      // console.log(this.agencyProfileForm.value);
      this.profileModel = Object.assign({}, this.agencyProfileForm.value);
      this.profileModel.VAgencyPhoto = this.profilePhoto;

      // this.profileModel.Id = this.User.id;
      this.authService.updateProfile(this.profileModel).subscribe(() => {
        this.toastrService.success('', 'Agency profile data updated successfully');
        const url = this.router.url;
        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate([url]);
        });
      }, error => {
        this.toastrService.warning('', error);
        console.log(error);
      });
    } else {
      this.appComponent.validateAllFormFields(this.agencyProfileForm);
      this.toastrService.warning('', 'Required field is not filled');
    }
  }



  async getBase64ImageFromUrl(imageUrl:any) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.addEventListener('load', function() {
          resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }


  getVisitedData() { // Not used now if needed will be used for visited and login history data
    this.isProcessingPageVisited = true;
    const date = new Date();
    const tzo = date.getTimezoneOffset() * -1;
    const dt = this.datepipe.transform(date, 'MM/dd/yyyy, hh:mm a');
    this.authService.getProfileData().subscribe(data => {

      //console.log(data);

      this.isEmailVerified = data.isEmailVerified;
      this.isPhoneVerified = data.isPhoneNumberVerified;
      this.recordsTotalPageVisited = data.recordsTotalPageVisited;
      this.recordsFilteredPageVisited = data.recordsFilteredPageVisited;
      this.filteredRecordsShowPageVisited = (this.searchedValuePageVisited != "") ? true : false;
      this.startPageVisited = (this.recordsFilteredPageVisited == 0) ? 0 : (((this.pageNoPageVisited - 1) * this.lengthPageVisited) + 1);
      this.endPageVisited = (this.recordsFilteredPageVisited == 0) ? 0 : (this.pageNoPageVisited * this.lengthPageVisited);
      this.endPageVisited = (this.endPageVisited < this.recordsFilteredPageVisited) ? this.endPageVisited : this.recordsFilteredPageVisited;
      this.endPageVisited = (this.endPageVisited < this.recordsTotalPageVisited) ? this.endPageVisited : this.recordsTotalPageVisited;

      this.createPageListPageVisited();
      this.tableDataPageVisited=data.visitedlist

    }, err => {
      console.log(err);
    }, () => {
    this.isProcessingPageVisited = false;


    });
  }

  getProfileData() {

    this.isProcessing = true;
    const date = new Date();
    const tzo = date.getTimezoneOffset() * -1;
    const dt = this.datepipe.transform(date, 'MM/dd/yyyy, hh:mm a');
    this.authService.getProfileData().subscribe(data => {
      // console.log("Country list::");
      //console.log(data);
      this.isEmailVerified = data.isEmailVerified;
      this.isPhoneVerified = data.isPhoneNumberVerified;
      this.countryList = [];
      data.countrylist.forEach((countrylist: { vCountryId: any; nvCountryName: any; }) => {
        this.countryList.push({
          id: countrylist.vCountryId,
          text: countrylist.nvCountryName
        });
      });



    this.User = data.user[0];
    this.is2faEnabled = data.istwofactorenabled;
    if (this.is2faEnabled) {
      this.txt2FactorEnable = 'Disable Two-Step Verification';
    } else {
      this.txt2FactorEnable = 'Enable Two-Step Verification';
      }
      // console.log(this.User);
      this.profileImgURL =  this.User.agencyPhoto;
      this.profilePhoto = this.User.agencyPhoto;

      // this.invoicePhoto = voucher.nvInvoiceAttachment;
      // this.invoiceImgURL = this.coreUrl + this.invoicePhoto;

      this.User.lastLogin = this.appComponent.UTCToLocalTime(this.User.lastLogin)!;
      this.User.gender = (this.User.gender == null) ? '' : this.User.gender;

      this.getBase64ImageFromUrl(this.User.agencyPhoto)
      .then(result => this.previewUrl = this.agencyProfileForm.value.VAgencyPhoto = result)
      .catch(err => console.error(err));


      this.agencyProfileForm = this.fb.group({
        VAgencyId: [this.User.agencyId, Validators.required],
        NvAgencyName: [this.User.agencyName, Validators.required],
        NvAgencyEmail: [this.User.agencyEmail, [Validators.required, Validators.email]],
        NvAgencyPhoneNumber: [this.User.agencyPhone, Validators.required],
        NvAgencyAddress: [this.User.agencyAddress, Validators.required],
        VCountryId: [this.User.agencyCountryId, Validators.required],
        NvAgencyCityName: [this.User.agencyCity, Validators.required],
        VAgencyPostalCode: [this.User.agencyPostalCode, Validators.required],
        VAgencyPhoto: [this.User.agencyPhoto, Validators.nullValidator],

      });





        const setPass = data.setpass;
      if (setPass) {
        this.setPass = true;
        this.passText = 'Set Password';
        this.CreateSetPasswordForm();
      } else {
        this.CreateChangePasswordForm();
      }

      $("#email").prop('disabled', true);
      //$("#country").prop('disabled', true);
      $("#role").prop('disabled', true);

      this.recordsTotal = data.recordsTotal;
      this.recordsFiltered = data.recordsFiltered;
      this.filteredRecordsShow = (this.searchedValue != "") ? true : false;
      this.start = (this.recordsFiltered == 0) ? 0 : (((this.pageNo - 1) * this.length) + 1);
      this.end = (this.recordsFiltered == 0) ? 0 : (this.pageNo * this.length);
      this.end = (this.end < this.recordsFiltered) ? this.end : this.recordsFiltered;
      this.end = (this.end < this.recordsTotal) ? this.end : this.recordsTotal;




      this.createPageList();

      this.tableData = data.loginlist;



    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;



    });



  }



  enableTwoFactorAuth() {
    let action:any;
    if (this.is2faEnabled) {
      action = 'disable'
    }
    else {
      action = 'enable'
    }
    Swal.fire({
      title: 'Are you want to ' + action + 'Two-Factor Auth' + '?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + action + ' it!'
    }).then((result) => {
      if (result.value) {
        this.authService.enableTwoFactorAuth(!this.is2faEnabled).subscribe(()=>{
          this.toastrService.success("Success", `Two-Step Verification ${action}`);
          this.getProfileData();
        },
        error=>{
          this.toastrService.error("Error",error);
        })
      }
    });
  }
  createChangePhoneAndNumberForm() {
    this.changePhoneAndNumberForm = this.fb.group({
      PhoneNumber: ['', Validators.required],
      NewEmail: ['', [Validators.required, Validators.email]],
      TFACode: ['', Validators.required],
    });
  }

  otpInputs: HTMLInputElement[] = [];
  ngAfterViewInit(): void {
    this.setupOtpInputListeners();
  }

  setupOtpInputListeners(): void {
    const inputs = this.elementRef.nativeElement.querySelectorAll('#otp > *[id]');
    this.otpInputs = Array.from(inputs);

    this.otpInputs.forEach((input, index) => {
      input.addEventListener('input', () => this.handleInput(index));
    });
  }

  handleInput(index: number): void {
    const inputValue = this.otpInputs[index].value;

    if (inputValue && index < this.otpInputs.length - 1) {
      this.otpInputs[index + 1].focus();
    }

    if (!inputValue && index > 0) {
      this.otpInputs[index - 1].focus();
    }
  }

  // Listen to keydown events
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Handle the 'delete' key press
    if (event.key === 'Backspace') {

    }
  }

  sendRequest() {
    if (this.changeType == 'email') {
      if (this.changePhoneAndNumberForm.controls.NewEmail.valid &&
        this.changePhoneAndNumberForm.controls.TFACode.valid) {
          this.authModel = Object.assign({}, this.changePhoneAndNumberForm.value);
          this.authModel.Id = localStorage.getItem('uid');;
          this.authService.ValidateChangeEmailToken(this.authModel).subscribe((res: any) => {
            this.btnClose.nativeElement.click();
            if (res.statusCode == 200) {
              this.toastrService.success("Success", res.message);
            }
          }, (error:any) => {
            console.log(error);
            this.toastrService.error("Error",error);
          });
      }
      else {
        this.toastrService.error("Error",'Please provide Token.');
      }
    }
    else {
      var tfaCode = "";
      var tfaInputs = document.querySelectorAll("#otp input");
      tfaInputs.forEach(function(input:any) {
        tfaCode += input.value;
      });
      if (tfaCode) {
        this.authModel = Object.assign({}, this.changePhoneAndNumberForm.value);
        this.authModel.TFACode = tfaCode;
        this.authModel.Id = localStorage.getItem('uid');;
        this.authService.ValidateChangePhoneNumberToken(this.authModel).subscribe((res: any) => {
          this.btnClose.nativeElement.click();
          if (res.statusCode == 200) {
            this.toastrService.success("Success", res.message);
          }
          var otpInputs:any = document.querySelectorAll("#otp input[type='text']");
          otpInputs.forEach(function (input:any) {
            input.value = '';
          });
        }, (error:any) => {
          console.log(error);
          this.toastrService.error("Error",error);
        });
      }
      else {
        this.toastrService.error("Error",'Please provide OTP code.');
      }
    }


  }

  changePhoneAndEmail(type: string) {
    if (type == 'phone') {
      this.changeType = 'phone number'
    }
    else {
      this.changeType = 'email'
    }
    this.createChangePhoneAndNumberForm();
    this.btnModalOpen.nativeElement.click();
  }
  emailOTPRequest() {
    if (this.changePhoneAndNumberForm.controls.NewEmail.valid) {
      var newEmail = this.changePhoneAndNumberForm.value.NewEmail
      this.authService.GenerateChangeEmailToken(newEmail).subscribe((res:any) => {
        if (res.statusCode == 200) {
          this.toastrService.success("Success", res.message);
        }
      }, (error:any) => {
        console.log(error);
        this.toastrService.error("Error",error);
      });
    }
    else {
      this.toastrService.error("Error",'Please provide valid email.');
    }
  }
  phoneOTPRequest() {
    if (this.changePhoneAndNumberForm.controls.PhoneNumber.valid) {
      var phoneNumber = this.changePhoneAndNumberForm.value.PhoneNumber
      this.authService.GenerateChangePhoneNumberToken(phoneNumber).subscribe((res:any) => {
        if (res.statusCode == 200) {
          this.toastrService.success("Success", res.message);
        }
      }, (error:any) => {
        console.log(error);
        this.toastrService.error("Error",error);
      });
    }
    else {
      this.toastrService.error("Error",'Please provide valid phone number.');
    }
  }
  setOTP(token: string) {
    if (token) {
      var otpInputs:any = document.querySelectorAll("#otp input[type='text']");
      otpInputs.forEach(function (input:any, index:any) {
        input.value = token[index];
      });
    }
  }



}
