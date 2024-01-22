import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ScriptService } from 'src/app/_services/script.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { AppComponent } from 'src/app/app.component';
import Swal from 'sweetalert2';

declare var $: any;
declare var Window: any;
declare let bKash: any;
declare let nagad: any;
declare let CryptoJS: any;
@Component({
  selector: 'app-payment',
  templateUrl: 'payment-confirmation.component.html',
  styleUrls: ['payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit, AfterViewInit {
  urlJquery = "./assets/dist/js/jquery.min.js";
  urlBootstrap = "./assets/dist/js/bootstrap.bundle.min.js";
  urlOwl = "./assets/dist/js/owl.carousel.min.js";
  urlMain = "./assets/dist/js/main.min.js";
  loadAPI: Promise<any> | any;

  payerRefrence:string = "";
  merchantInvoiceNumber:string = "";

  paymentReferenceId: any;
  constructor(public shareService: ShareService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private appComponent: AppComponent, private toastrService: ToastrService, public authService: AuthService,
    private scriptService: ScriptService) {
    this.scriptService.load("jquery3", "bKashLive", "nagadSandBox");
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    debugger;
    this.route.paramMap.subscribe((params:ParamMap) => {
      this.payerRefrence += params.get("payerReference");
      this.merchantInvoiceNumber += params.get("merchantInvoiceNumber");
    });

      if(this.payerRefrence != "" && this.merchantInvoiceNumber != ""){
        this.executeRequestOnAuthorization(this.payerRefrence, this.merchantInvoiceNumber)
      }

  }


  executeRequestOnAuthorization(payerRefrence:string, merchantInvoiceNumber:string) {
    let token = localStorage.getItem("bToken") ?? "test";
    this.authService.getPaymentExecuteBkash(token,payerRefrence,merchantInvoiceNumber)
      .subscribe((response) => {
        if (response.statusCode == '0000') {
          Swal.fire({
            title: 'Payment successfully Completed. Your transaction id is ' + response.trxID,
            icon: 'success',
            showCancelButton: false,
            cancelButtonColor: '#d33',
          }).then(() => {
            this.savePayment(response);

          });
        }
        else if (response.statusCode != '0000') {

          Swal.fire({
            title: response.statusMessage,
            icon: 'warning',
            showCancelButton: false,
            cancelButtonColor: '#d33',
          }).then(() => {
            this.router.navigate(["/home/payment"]);
          });
        }
      }, (error: any) => {
        bKash.execute().onError();
      });
  }

  savePayment(response: any) {
    debugger;
    let paymentModel:any = localStorage.getItem(this.merchantInvoiceNumber+this.payerRefrence );/// payment Information
    paymentModel = JSON.parse(paymentModel);
    let payment = {
      PaymentModeId : paymentModel.PaymentModeId, // online Id
      PaymentTypeId: paymentModel.PaymentTypeId,   //MFS id from database
      TransactionDate: paymentModel.TransactionDate,
      TravelionAccountId: paymentModel.TravelionAccountId,
      //Attchement: this.paymentModel.Attchement,
      ReferenceNo: response.trxID + ' ' +this.payerRefrence,
      Charge: paymentModel.Charge,
      Amount: paymentModel.Amount
    }

    this.authService.savePayment(payment).subscribe(data => {
      if (data.statusCode == '200') {
        localStorage.removeItem( this.merchantInvoiceNumber+this.payerRefrence  );
        this.toastrService.success('Success', 'Payment data saved successfully.');
        this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(["/home/paymenthistory"]);
        });
      }
      else{
        this.toastrService.warning('warning', data.message);
      }


    }, error => {

      this.toastrService.error('', 'Payment data saved failed.');
      console.log(error);
    });

  }


}
