import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { ToastrService } from '../_services/toastr.service';
import { AppComponent } from '../app.component';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  urlMain = "./assets/dist/js/main.min.js";

  loadAPI: Promise<any> | any;

  model: any = {};
  forgotPasswordStatus = false;
  forgotPasswordForm!: FormGroup;
  appName: any;
  copyright: any;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private authService: AuthService, private fb: FormBuilder, private toastrService: ToastrService, private appComponent: AppComponent) {}

  ngOnInit() {
    this.authService.IsUserLoggedIn();
    this.CreateForgotPasswordForm();
    this.appComponent.setTitle('Forgot Password');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    this.appName = environment.projectName;
    this.copyright = environment.copyright;

    this.loadAPI = new Promise(resolve => {
      console.log("resolving promise...");
      this.loadScript();
    });
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

  CreateForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.model = Object.assign({}, this.forgotPasswordForm.value);
      this.authService.forgotPassword(this.model).subscribe(
        (next) => {
          this.forgotPasswordStatus = true;
        },
        (error) => {}
      );
    } else {
      this.validateAllFormFields(this.forgotPasswordForm);
    }
  }
}
