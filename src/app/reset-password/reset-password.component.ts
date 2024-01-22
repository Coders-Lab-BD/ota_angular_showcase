import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { ToastrService } from '../_services/toastr.service';
import { AppComponent } from '../app.component';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  urlMain = "./assets/dist/js/main.min.js";

  loadAPI: Promise<any> | any;

  model: any = {};
  resetPasswordStatus = false;
  resetPasswordForm!: FormGroup;
  appName: any;
  copyright: any;
  user: any;
  code: any;
  errorMsg:string="";
  show_button: Boolean = false;
  show_eye: Boolean = false;
  showConfirm_button: Boolean = false;
  showConfirm_eye: Boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private authService: AuthService, private fb: FormBuilder, private toastrService: ToastrService, private appComponent: AppComponent, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.authService.IsUserLoggedIn();
    this.CreateResetForm();
    this.appComponent.setTitle('Reset Your Password');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    this.appName = environment.projectName;
    this.copyright = environment.copyright;
    this.model.id = this.route.snapshot.queryParams.userId;
    this.model.Code = this.route.snapshot.queryParams.code;

    this.loadAPI = new Promise(resolve => {
      console.log("resolving promise...");
      this.loadScript();
    });
  }
  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  showConfirmPassword() {
    this.showConfirm_button = !this.showConfirm_button;
    this.showConfirm_eye = !this.showConfirm_eye;
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
  }

  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }

  CreateResetForm() {
    this.resetPasswordForm = this.fb.group(
      {
        Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        ConfirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('Password')?.value === g.get('ConfirmPassword')?.value ? null : { mismatch: true };
  }

  resetPassword() {
    this.errorMsg="";
    if (this.resetPasswordForm.valid) {
      this.model.Password = this.resetPasswordForm.get('Password')?.value;
      this.model.ConfirmPassword = this.resetPasswordForm.get('ConfirmPassword')?.value;
      this.authService.resetPassword(this.model).subscribe(
        () => {
          this.resetPasswordStatus = true;
        },
        (error) => {
          this.errorMsg=error.replaceAll("<br>","");;
        },
        () => {}
      );
    } else {
      this.appComponent.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
