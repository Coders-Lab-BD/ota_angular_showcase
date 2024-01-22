import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { NagadTransactionModel } from 'src/app/model/nagad-model';
import { AuthService } from 'src/app/_services/auth.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nagad-checkout',
  templateUrl: './nagad-checkout.component.html',
  styleUrls: ['./nagad-checkout.component.css']
})
export class NagadCheckoutComponent implements OnInit {
  safeUrl!: SafeResourceUrl;
  url = 'home/nagad-checkout';
  issuer_payment_ref!: string;
  merchant!: string;
  message!: string;
  order_id!: string;
  payment_dt: any;
  payment_ref_id!: string;
  status!: string;
  date: any;
  paymenttype: any;
  amount: any;
  charge: any;

  constructor(private sanitizer: DomSanitizer, public authService: AuthService, private toastrService: ToastrService, private router: Router, private route: ActivatedRoute, private appComponent: AppComponent) { }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.message = params['message'];
    this.status = params['status'];
    this.payment_ref_id = params['payment_ref_id'];
    if(this.message == 'Successful Transaction'){
      this.nagadTransaction(this.payment_ref_id,this.message);
      this.getnagad(this.payment_ref_id);
    }
    // console.log(this.safeUrl);
  }
  getnagad(id: string,){
    this.authService.getnagad(id).subscribe(data => {
      data.paymentinformation.forEach((value: any, index: any) => {
        this.date = value.dDepositDate;
        this.paymenttype = value.nvPaymentModeName;
        this.amount = value.nTransactionAmount;
        this.charge = value.nServiceCharge;
      });
    }, err => {
      this.toastrService.error('', 'Data fetch problem');
      console.log(err);
    });
  }
  nagadTransaction(id: string, msg: string){
    var ngModel: NagadTransactionModel = {
      id: id,
      msg: msg,
    };
    this.authService.savenagadTransaction(ngModel).subscribe(() => {}, error => {});
  }
  close(){
    this.router.navigate(['home/payment']);
  }

}
