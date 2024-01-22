import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
})
export class ConfirmEmailComponent implements OnInit {
  urlMain = "./assets/dist/js/main.min.js";

  loadAPI: Promise<any> | any;

  checkStatus = false;
  confirmStatus = false;
  user: any;
  code: any;
  appLogo: any;
  copyright: any;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private authService: AuthService, private route: ActivatedRoute, private appComponent: AppComponent) {}

  ngOnInit() {
    this.authService.IsUserLoggedIn();
    this.appComponent.setTitle('Verify Email');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('lockscreen');
    this.appLogo = environment.logo;
    this.copyright = environment.copyright;

    this.user = this.route.snapshot.queryParamMap.get('userId');
    this.code = this.route.snapshot.queryParamMap.get('code');

    this.authService.confirm_registration(this.user, this.code).subscribe(
      () => {
        this.confirmStatus = true;
        this.checkStatus = true;
      },
      (error) => {
        this.checkStatus = true;
      }
    );

    this.loadAPI = new Promise(resolve => {
      console.log("resolving promise...");
      this.loadScript();
    });
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('lockscreen');
  }

  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }
}
