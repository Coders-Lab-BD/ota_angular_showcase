import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../_services/auth.service';
import { ToastrService } from '../_services/toastr.service';
import { AppComponent } from '../app.component';
declare var window: any;
declare var localStorage: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  urlMain = "./assets/dist/js/main.min.js";

  loadAPI: Promise<any> | any;

  @ViewChild('btnClose', { static: true })
  btnClose!: ElementRef;
  @ViewChild('btnModalOpen', { static: true })
  btnModalOpen!: ElementRef;

  model: any = {};
  loginForm!: FormGroup;
  twoFactorLoginForm!: FormGroup;
  appLogo: any;
  copyright: any;
  socialProviders: string[] = [];
  sliderImages:any[]=[];
  isExternalLoginAllowed = false;
  baseUrl = environment.apiUrl + "Account";
  errorMsg:string="";

  show_button: boolean = false;
  show_eye: boolean = false;

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2,
  private authService: AuthService, private fb: FormBuilder, private toastrService: ToastrService,
   private appComponent: AppComponent, private route: ActivatedRoute, private elementRef: ElementRef) {

   }

  ngOnInit() {
    this.getFlightList();
    const token = this.route.snapshot.queryParamMap.get('token');
    const index = this.route.snapshot.queryParamMap.get('index');
    const ulhid = this.route.snapshot.queryParamMap.get('ulhid');
    // const setPass = this.route.snapshot.queryParamMap.get('setPass');
    if (token !== null && index !== null && ulhid !== null) {
      localStorage.setItem('token', token);
      localStorage.setItem('index', index);
      localStorage.setItem('ulhid', ulhid);
      // localStorage.setItem('setPass', setPass);
      window.location.href = localStorage.getItem('index');
    }
    const error = this.route.snapshot.queryParamMap.get('error');
    if (error !== null) {
      this.toastrService.error('Failed', error);
    }
    this.authService.IsUserLoggedIn();
    this.CreateLoginForm();
    this.appComponent.setTitle('Login');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    this.appLogo = environment.logo;
    this.copyright = environment.copyright;
    this.GetProviders();
    this.getSliderImages();
    this.loadAPI = new Promise(resolve => {
      console.log("resolving promise...");
      this.loadScript();
    });
  }
  getSliderImages()
  {
    this.sliderImages=[];
    try{
      this.authService.getLoginSliderImages().subscribe(data=>{
        for(let item of data.data)
        {
          if(this.sliderImages.findIndex(x=>x.id==item.vImageId)<0)
          {
            this.sliderImages.push({id:item.vImageId,image:item.nvImage});
          }
        }
      },(error)=>{});
    }catch(exp){}
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }

  GetProviders() {
    this.authService.getProviders()
      .subscribe(result => {
        // this.socialProviders = result.providers;
        this.socialProviders = result;
        if (this.socialProviders.length > 0) {
          this.isExternalLoginAllowed = true;
        }
          // console.log(this.socialProviders);
      });
  }

  CreateLoginForm() {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
    });
    this.twoFactorLoginForm = this.fb.group({
      Id: ['', [Validators.required]],
      TFACode: ['', [Validators.required]],
    });
  }

  login() {
    this.errorMsg="";
    if (this.loginForm.valid) {
      this.model = Object.assign({}, this.loginForm.value);
      this.authService.login(this.model).subscribe(data => {
          const is2faenabled = JSON.parse(localStorage.getItem('is2faenabled'));
          if (is2faenabled) {
            //window.location.href = '2fa';
            debugger;
            let uid = localStorage.getItem('uid');
            this.twoFactorLoginForm = this.fb.group({
              Id: [uid, [Validators.required]],
              TFACode: ['', [Validators.required]],
            });
            this.btnModalOpen.nativeElement.click();
          } else {
            window.location.href = localStorage.getItem('index');
          }
        },
        (error) => {
          this.errorMsg=error.replaceAll("<br>","");
          if (error === 'Email not verified') {
            // Swal.fire({
            //   title: 'Email not verified',
            //   // tslint:disable-next-line: max-line-length
            //   text: 'Your account will be approved after email verification. An email has already been sent to you to verify your email address.',
            //   icon: 'warning',
            //   showCancelButton: true,
            //   cancelButtonColor: '#d33',
            // });
          }
          if (error === 'Registration status not verified') {
            // Swal.fire({
            //   title: 'Registration status not verified',
            //   // tslint:disable-next-line: max-line-length
            //   text: 'Your account will be approved after registration status verification. Registration status is approved by FlySkyLand authority.',
            //   icon: 'warning',
            //   showCancelButton: true,
            //   cancelButtonColor: '#d33',
            // });
          }
          if (error === 'Status not Active') {
            // Swal.fire({
            //   title: 'Status not Active',
            //   // tslint:disable-next-line: max-line-length
            //   text: 'Your account will be activated after status active by FlySkyLand authority.',
            //   icon: 'warning',
            //   showCancelButton: true,
            //   cancelButtonColor: '#d33',
            // });
          }
          console.log(error);
        },
        () => {
          // window.location.href = localStorage.getItem('index');
          // window.location.href = '2fa';
        }
      );
    } else {
      this.appComponent.validateAllFormFields(this.loginForm);
    }
  }
  ngAfterViewInit(): void {
    this.setupOtpInputListeners();
  }

  otpInputs: HTMLInputElement[] = [];

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


  twoFactorLogin() {
    this.errorMsg = "";
    var otpValues = "";
    var otpInputs = document.querySelectorAll("#otp input");
    otpInputs.forEach(function(input:any) {
        otpValues += input.value;
    });
    this.twoFactorLoginForm.value.TFACode = otpValues;
    if (this.twoFactorLoginForm.value.TFACode != '' && this.twoFactorLoginForm.value.Id != '') {
      this.model = Object.assign({}, this.twoFactorLoginForm.value);
      this.authService.twoFactorLogin(this.model).subscribe(() => {
          window.location.href = localStorage.getItem('index');
        },
        (error) => {
          this.toastrService.error('Error',error);
        },
        () => {
          // window.location.href = localStorage.getItem('index');
          // window.location.href = '2fa';
        }
      );
    } else {
      this.appComponent.validateAllFormFields(this.twoFactorLoginForm);
    }
  }
  airports: any[]=[];
  getFlightList() {

    this.authService.getFlightList().subscribe(data => {
      this.airports = [];
      for(let item of data.airportlist)
      {
        this.airports.push({
          id: item.vAirportId,
          text:item.nvAirportName,
          cityname: item.nvCityName,
          countrycode: item.nvCountryCode,
          countryname: item.nvCountryName,
          code: item.nvAirportCode,
          all:item.nvCityName+" "+item.nvCountryName+" "+item.nvAirportName+" "+item.nvAirportCode
        });
      }
      this.setAiportInfoInStorage(this.airports);
      }, err => {
      console.log(err);
    });
  }
  setAiportInfoInStorage(data:any)
    {
      try{
        if("airportInfo" in localStorage)
        {
          localStorage.removeItem("airportInfo");
        }
        localStorage.setItem('airportInfo',JSON.stringify(data));
      }catch(exp){}
    }
  // ExternalLogin() {
  //   this.authService.externalLogin().subscribe(
  //     () => {
  //       window.location.href = localStorage.getItem('index');
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
  // Admin() {
  //   this.loginForm.setValue({
  //     Email: 'sanzid.tayef@gmail.com',
  //     Password: 'Tayef123',
  //   });
  //   this.login();
  // }
}
