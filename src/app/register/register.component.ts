import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../_services/auth.service';
import { ToastrService } from '../_services/toastr.service';
import { AppComponent } from '../app.component';
import { FlightHelperService } from '../home/flight-helper.service';
declare var window: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  urlMain = "./assets/dist/js/main.min.js";

  loadAPI: Promise<any> | any;

  model: any = {};
  registerStatus = false;
  emailVerification = true;
  statusVerification = true;
  // registerForm!: FormGroup;
  registerForm = {};
  appName: any;
  copyright: any;
  isAssociate = false;
  companyDetails!: FormGroup;
  contactDetails!: FormGroup;
  loginDetails!: FormGroup;
  company_step = false;
  contact_step = false;
  login_step = false;
  step = 1;
  errorMsg: string = "";
  passwordError1: string = "";
  passwordError2: string = "";
  passwordError3: string = "";

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2,
              private http: HttpClient, private authService: AuthService, private fb: FormBuilder,
              private appComponent: AppComponent, private route: ActivatedRoute, private router: Router,
              private toasterService: ToastrService,public flightHelper: FlightHelperService) { }

  ngOnInit() {
    this._getCountryList();
    this.authService.IsUserLoggedIn();
    this.authService.isAllowed('82A52FA2-E91F-4195-84FD-8EA32DA2637A');

    const associate = this.route.snapshot.queryParamMap.get('associate');
    const loginProvider = this.route.snapshot.queryParamMap.get('loginProvider');
    const providerDisplayName = this.route.snapshot.queryParamMap.get('providerDisplayName');
    const providerKey = this.route.snapshot.queryParamMap.get('providerKey');
    if (associate !== null && loginProvider !== null && providerDisplayName !== null && providerKey !== null) {
      this.isAssociate = true;
      this.CreateAssociateRegisterForm(associate, loginProvider, providerDisplayName, providerKey);
    }
    this.companyDetails = this.fb.group(
      {
        AgencyName: ['', Validators.required],
        AgEmail: ['', [Validators.required, Validators.email]],
        PhoneNumber: ['', Validators.required],
        Country: ['', Validators.nullValidator],
        CityName: ['', Validators.required],
        PostalCode: ['', Validators.nullValidator],
        Address: ['', Validators.required]
      });
    this.contactDetails = this.fb.group(
      {
        AuthorizedPersonName: ['', Validators.required],
        AEmail: ['', [Validators.required, Validators.email]],
        APhoneNumber: ['', Validators.required]
      });
    this.loginDetails = this.fb.group(
      {
        UserName: ['', Validators.required],
        Email: ['', [Validators.required, Validators.email]],
        Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        ConfirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.appComponent.setTitle('Register');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
    this.appName = environment.projectName;
    this.copyright = environment.copyright;

    this.loadAPI = new Promise(resolve => {
      console.log("resolving promise...");
      this.loadScript();
    });
  }
  countrylists: any = [];
  selectedCountry: string | undefined;
  dialCode='';
  dialCodeList: any = [];
  _getCountryList() {
    try{
      this.authService.getCountryList().subscribe(data => {
        this.countrylists = [];
        this.countrylists = data.countrylist;
        this.selectedCountry = this.countrylists.find((item: { nvCountryName: string; }) => item.nvCountryName === 'Bangladesh')?.nvCountryName;

        this.http.get('assets/CountryCodes.json').subscribe(
          (data: any) => {
            this.dialCodeList = data;
            data.forEach((element:any) => {
              if(element.name === this.selectedCountry){
                this.dialCode = element.dial_code;
              }
            });
          },
          (err) => {
            console.log(err);
          }
        );

      }, err => {
        console.log(err);
      }, () => {
      });
    }catch(exp){}
  }

  onCountryChange(){
    this.dialCodeList.forEach((element:any) => {
      if(element.name === this.selectedCountry){
        this.dialCode = element.dial_code;
      }
    });
  }
  get company() { return this.companyDetails.controls; }
  get contact() { return this.contactDetails.controls; }
  get login() { return this.loginDetails.controls; }

  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
  }
  contactSubmit() {
    if (this.contactDetails.invalid) {
      this.appComponent.validateAllFormFields(this.contactDetails);
    } else {
      this.step = 3;

      this.loginDetails.patchValue({
        UserName: this.loginDetails.value.Email == '' ? this.contactDetails.value.AEmail : this.loginDetails.value.Email,
        Email: this.loginDetails.value.Email == '' ? this.contactDetails.value.AEmail : this.loginDetails.value.Email
      });
    }
  }
  companySubmit() {
    if (this.companyDetails.invalid) {
      this.appComponent.validateAllFormFields(this.companyDetails);
    } else {
      this.step = 2;

      this.contactDetails.setValue({
        AuthorizedPersonName: this.contactDetails.value.AuthorizedPersonName == '' ? '' : this.contactDetails.value.AuthorizedPersonName,
        AEmail: this.contactDetails.value.AEmail == '' ? this.companyDetails.value.AgEmail : this.contactDetails.value.AEmail,
        APhoneNumber: this.contactDetails.value.APhoneNumber == '' ? this.companyDetails.value.PhoneNumber : this.contactDetails.value.APhoneNumber
      });


    }

  }
  previousCompany() {
    this.step--;
    if (this.step < 1) {
      this.step = 1;
    }
    this.contactDetails.setValue({
      AuthorizedPersonName: '',
      AEmail: '',
      APhoneNumber: ''
    });
  }
  previousContact() {
    this.step--;
    if (this.step < 1) {
      this.step = 1;
    }
    this.loginDetails.patchValue({
      UserName: '',
      Email: ''
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('Password')?.value === g.get('ConfirmPassword')?.value ? null : { mismatch: true };
  }

  CreateAssociateRegisterForm(as: any, lp: any, pdn: any, pk: any) {
    this.registerForm = this.fb.group(
      {
        UserName: ['', Validators.required],
        Email: [as, [Validators.required, Validators.email]],
        AssociateEmail: ['', [Validators.nullValidator, Validators.email]],
        AssociateExistingAccount: [false, Validators.required],
        LoginProvider: [lp, Validators.required],
        ProviderDisplayName: [pdn, Validators.required],
        ProviderKey: [pk, Validators.required]
      }
    );
  }
  show_button: Boolean = false;
  show_eye: Boolean = false;

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  showConfirm_button: Boolean = false;
  showConfirm_eye: Boolean = false;
  showConfirmPassword() {
    this.showConfirm_button = !this.showConfirm_button;
    this.showConfirm_eye = !this.showConfirm_eye;
  }

  submit() {
    this.errorMsg = "";
    this.passwordError1 = "";
    this.passwordError2 = "";
    this.passwordError3 = "";
    let passValid = false;
    let passValue = this.loginDetails.get('Password')?.value;
    if (!this.loginDetails.get("Password")?.valid || !this.loginDetails.get("ConfirmPassword")?.valid) {
      this.passwordError3 = "* Minimum requirement password is 6 character.";
    }
    if (this.loginDetails.get("Password")?.valid) {
      let isNum = false, isUp = false;
      var i = 0;
      while (i <= passValue.length) {
        if (passValue.charAt(i).charCodeAt() >= 48 && passValue.charAt(i).charCodeAt() <= 57) {
          isNum = true;
          break;
        }
        i++;
      }
      i = 0;
      while (i <= passValue.length) {
        if (passValue.charAt(i).charCodeAt() >= 65 && passValue.charAt(i).charCodeAt() <= 90) {
          isUp = true;
          break;
        }
        i++;
      }
      if (!isNum && !isUp) {
        this.passwordError1 = "* Password have must a upper case";
        this.passwordError2 = "* Password have must a digit";
      } else if (!isNum) {
        this.passwordError2 = "* Password have must a digit";
      } else if (!isUp) {
        this.passwordError1 = "* Password have must a upper case";
      }
      if (isNum && isUp) {
        passValid = true;
      }
    }
    if (passValid) {
      if (this.loginDetails.invalid) {
        this.appComponent.validateAllFormFields(this.loginDetails);
      } else {
        if (this.step == 3) {
          this.login_step = true;

        }
      }
      this.registerForm =
      {
        AgencyName: this.companyDetails.value.AgencyName,
        AgEmail: this.companyDetails.value.AgEmail,
        PhoneNumber: this.companyDetails.value.PhoneNumber,
        CityName: this.companyDetails.value.CityName,
        Country: this.companyDetails.value.Country,
        PostalCode: this.companyDetails.value.PostalCode,
        Address: this.companyDetails.value.Address,
        BRegistrationStatus: false,
        BStatusId: false,
        AuthorizedPersonName: this.contactDetails.value.AuthorizedPersonName,
        AEmail: this.contactDetails.value.AEmail,
        APhoneNumber: this.contactDetails.value.APhoneNumber,
        UserName: this.loginDetails.value.UserName,
        Email: this.loginDetails.value.Email,
        Password: this.loginDetails.value.Password,
        ConfirmPassword: this.loginDetails.value.ConfirmPassword
      };

      this.model = Object.assign({}, this.registerForm);
      if (this.isAssociate) {
        this.authService.associateRegister(this.model).subscribe(
          data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('flights', data.flights);
            localStorage.setItem('ulhid', data.ulhid);
            localStorage.setItem('setPass', data.setPass);
            window.location.href = localStorage.getItem('flights');
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        if (this.companyDetails.valid && this.contactDetails.valid && this.loginDetails.valid) {
          this.authService.register(this.model).subscribe(
            data => {
              this.registerStatus = true;
              this.emailVerification = Boolean(data);
              this.statusVerification = Boolean(data);
              this.toasterService.success("Congratulation","Registration Successfull");
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 5000);
            },
            (error) => {
              this.errorMsg = error.replaceAll("<br>", "").replaceAll("**", "*");
            }
          );
        }
      }
    }
  }
}
