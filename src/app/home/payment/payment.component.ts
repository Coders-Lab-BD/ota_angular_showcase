
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { AuthService } from 'src/app/_services/auth.service';
import { ScriptService } from 'src/app/_services/script.service';
import { ShareService } from 'src/app/_services/share.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { AppComponent } from 'src/app/app.component';
import { BkashModel } from 'src/app/model/bkash-model';
import { NagadModel } from 'src/app/model/nagad-model';
import { environment } from 'src/environments/environment';

// var CryptoJS = require("crypto-js");
declare var $: any;
declare var Window: any;
declare let bKash: any;
declare let nagad: any;
declare let CryptoJS: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  urlJquery = "./assets/dist/js/jquery.min.js";
  urlBootstrap = "./assets/dist/js/bootstrap.bundle.min.js";
  urlOwl = "./assets/dist/js/owl.carousel.min.js";
  urlMain = "./assets/dist/js/main.min.js";
  loadAPI: Promise<any> | any;

  banklists: any = [];
  bankBranchLists: any = [];
  depositaccounts: any = [];
  filteredDepositaccounts: any = [];
  paymentForm!: FormGroup;
  paymentModel: any;
  isbankTransfer = false;
  isBkash = false;
  isOfflineSubmit = false;
  isProcess = true;
  isBkashSubmit = true;
  isProcessingNagad = false;
  isNagadPayment = false;
  selectedCharge: any = "";
  selectedPaymentId: any = "";
  selectedAssignPaymentId: any = "";
  selectedAmount: any = "";
  selectedPrice: any = "";
  payAmount: number = 0;

  selectedFile: File | null = null;
  fileData: any = File;
  paymentAttchement: any = null;
  uploadedImageName: any = null;
  @ViewChild('iframe', { static: false })
  iframe!: ElementRef;
  paymentModes: any[] = []
  paymentTerms: any[] = []
  offlinePaymentTerms: any[] = []
  onlinePaymentTerms: any[] = []
  PaymentModeId: string = '';
  depositAmount: number = 0;
  selectDepositAmount: number = 0.00;
  paymenttype: number = 0;
  selectedChargeAmount: number = 0.00;
  isBankDeposit: boolean = false;
  isOnline: boolean = false;
  isOffline: boolean = false;
  isTk: boolean = true;
  paymentTypeId: any;
  className:string="d-none";

  paymentReferenceId: any;
  constructor(public shareService: ShareService, private fb: FormBuilder, private router: Router,
    private appComponent: AppComponent, private toastrService: ToastrService, public authService: AuthService,
    private scriptService: ScriptService,private datePipe: DatePipe) {
    this.scriptService.load("jquery3", "bKashLive", "nagadSandBox");
  }
  ngAfterViewInit(): void {
    // this.nagadPaymentVerification();
    // console.log("Crypto Check::");
    // console.log(this.getNagad());
  }

  ngOnInit(): void {
    this.CreatePaymentForm();
    $(document).ready(function () {
      $('.js-example-basic-single').select2();
    });
    this.loadAPI = new Promise(resolve => {
      this.loadScript();
    });
    this.authService.GetPaymentMode().subscribe(data => {
      this.paymentModes = data
    }, error => {
      this.toastrService.error('', 'payment modes get failed.');
      console.log(error);
    });
    this.authService.GetPaymentTermsOffline().subscribe(data => {
      this.offlinePaymentTerms = data
    }, error => {
      this.toastrService.error('', 'Offline payment terms get failed.');
      console.log(error);
    });
    this.authService.GetPaymentTermsOnline().subscribe(data => {
      this.onlinePaymentTerms = data
    }, error => {
      this.toastrService.error('', 'Online payment terms get failed.');
      console.log(error);
    });
  }
  getNagad() {
    try {
      let amt = this.payAmount;
      this.paymentModel = Object.assign({}, this.paymentForm.value);
      var TransactionDate = this.paymentModel.TransactionDate.split('-').reverse().join('-');
      var ngModel: NagadModel = {
        amount: amt + "",
        currency: 'BDT',
        totalAmount: this.selectedAmount,
        assignPaymentId: this.selectedAssignPaymentId,
        paymentModeId: this.selectedPaymentId,
        depositedate: TransactionDate
      };
      var _this = this;
      _this.authService.getCheckoutInit(ngModel).subscribe((response) => {

        function getMessage(message: string) {
          return message;
        }
        const message: unknown = response;
        if (typeof message === 'string') {
          const result = getMessage(message);
          var paymentReference = result.split('http://sandbox.mynagad.com:10060/check-out/');
          this.paymentReferenceId = paymentReference[1];
          document.location.href = result;
          this.isProcessingNagad = false;
          this.isNagadPayment = true;
        }
      }, err => {
        console.log(err);
      });
      // this.authService.getNagadSensitive("encrypt").subscribe(encData=>{
      //   console.log("encrypted data::");
      //   console.log(encData);
      //   if(encData!=undefined)
      //   {
      //     this.authService.getNagadSensitive("sign").subscribe(signData=>{
      //       console.log(signData);
      //         if(signData!=undefined)
      //         {
      //           const checkout_init_body = {
      //             //accountNumber optional
      //             dateTime: date_time,
      //             sensitiveData: encData.res,
      //             signature: signData.res,
      //           };
      //           console.log(checkout_init_body);
      //           setTimeout(()=>{
      //             this.authService.getCheckoutInit(checkout_init_body,merchant_id,order_id).subscribe(data=>{
      //               console.log("Data::");
      //               console.log(data);
      //             },err=>{
      //               console.log(err);
      //             });
      //             // fetch(
      //             //   `{http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/${merchant_id}/${order_id}}`,
      //             //   {
      //             //     method: "POST",
      //             //     headers: {
      //             //       "Access-Control-Allow-Headers": "Content-Type",
      //             //       "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      //             //       "Access-Control-Allow-Origin": "*",
      //             //       "X-KM-IP-V4": "192.168.1.12",
      //             //       "X-KM-Client-Type": "PC_WEB",
      //             //       "X-KM-Api-Version": "v-0.2.0",
      //             //       "Content-Type": "application/json",
      //             //     },
      //             //     body: JSON.stringify(checkout_init_body),
      //             //   }
      //             // ).then((data)=>{
      //             //   console.log(data);
      //             // }).catch(err=>{
      //             //   console.log(err);
      //             // });
      //           });
      //         }
      //     },err=>{

      //     });
      //   }
      // },err=>{
      //   console.log(err);
      // });

    } catch (exp) { }
  }
  nagadPaymentVerification(){
    try {
      var date_time = '';
      if (this.paymentForm.valid) {
        this.paymentModel = Object.assign({}, this.paymentForm.value);
        var TransactionDate = this.paymentModel.TransactionDate.split('-').reverse().join('-');
        date_time = TransactionDate;
      }
      let amt = this.payAmount;
      const paymentverify_init_body = {
        //accountNumber optional
        dateTime: date_time,
        paymentReferenceId: this.paymentReferenceId,
        amount: amt + "",
      };
      this.authService.getNagadPaymentVerification(paymentverify_init_body).subscribe(data => {
      }, res => {});
    } catch (exp) {}
  }
  generateTokenBkash() {
    try {
      this.authService.getGenerateTokenBkash().subscribe(data => {
        this.CreateBkashPayment(data);
        localStorage.removeItem("paymentresult");
        this.isBkashSubmit = true;
        this.isProcess = true;
      }, res => {
      });
    } catch (exp) { }
  }
  CreateBkashPayment(data: any){
    let amt = this.depositAmount;
    let token = data.id_token;
    localStorage.setItem('bToken', token);
    let paymentModel = Object.assign({}, this.paymentForm.value);
        paymentModel.TransactionDate = paymentModel.TransactionDate.split('-').reverse().join('-');
        paymentModel.TravelionAccountId = paymentModel.TravelionAccountId.split(',')[2];
        paymentModel.Charge = this.selectedChargeAmount;
        paymentModel.Amount =  this.selectDepositAmount;

    const currentDate = new Date();
    const currentDateString = currentDate.toLocaleString().split('/').join('')
                                                          .split(':').join('')
                                                          .split(' ').join('')
                                                          .split(',').join('-');
    var bkModel: BkashModel = {
      token: token,
      amount: amt + "",
      currency: 'BDT',
      merchantInvoiceNumber: this.shareService.getRandomNumber(100, 999).toString() +"-"+currentDateString,
      intent: 'sale',
      paymentID: '',
      payerRefrence: paymentModel.PayerRefrence,
      travelionAccountId: paymentModel.TravelionAccountId
    };
    debugger;
    let stringPaymentModel = JSON.stringify(paymentModel);
    localStorage.setItem(bkModel.merchantInvoiceNumber+bkModel.payerRefrence , stringPaymentModel);/// payment Information

    this.authService.getPaymentCreateBkash(bkModel)
          .subscribe((response) => {

            var data = response;
            if (data && data.paymentID != null) {
              bkModel.paymentID = data.paymentID;
              data.errorCode = null;
              data.errorMessage = null;

              window.open(data.bkashURL,"_self");
            }
            else {
              bKash.create().onError();
            }
          }, (error: any) => {
            bKash.create().onError();
          });
  }
  setAmount(evt: any) {
    let amt = evt.target.value;
    this.payAmount = amt.toString().replace(",", "");
  }

  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }
  fileProgress(fileInput: any) {
    this.selectedFile = fileInput.target.files[0];
    this.fileData = fileInput.target.files[0] as File;
    this.uploadedImageName = fileInput.target.files[0].name;
    this.preview();
    const invalidFeedbackDiv = document.getElementById('paymentAttchementError');
    const fileSizeInMB = fileInput.target.files[0].size / (1024 * 1024);
    if (this.selectedFile && this.selectedFile.size > 0 && fileSizeInMB<1) {
      if (invalidFeedbackDiv !== null) {
        invalidFeedbackDiv.style.display = 'none';
      }
    } else {
      this.selectedFile = null;
      this.fileData = null;
      this.uploadedImageName = null;
      if (invalidFeedbackDiv !== null) {
        invalidFeedbackDiv.style.display = 'block';
      }
    }
  }

  preview() {
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);

    reader.onload = (_event) => {
      this.paymentAttchement = reader.result;
      this.paymentForm.value.Attchement = reader.result;
    };

  }

  show(e: any) {
    if (e.target.value) {
      this.bankBranchLists = [];
      this.paymentTypeId = e.target.value;
      this.className = "d-none"
      this.selectDepositAmount = 0.00;
      this.selectedChargeAmount = 0.00;
      var depositAmountInput:any = document.getElementById('depositAmountInput');
      if (depositAmountInput) {
        depositAmountInput.value = '';
      }
      this.selectedCharge = '';
      const travelionAccountIdControl = this.paymentForm.get('TravelionAccountId');

      if (travelionAccountIdControl) {
        travelionAccountIdControl.setValue('');
      }

      this.authService.getDepositToAccountList(this.paymentTypeId).subscribe((res: any) => {
        if (res == null) {
          this.filteredDepositaccounts = [];
        }
        else {
          this.filteredDepositaccounts = res.value;
        }

      }, error => {
        this.toastrService.error('', 'Deposite account get failed.');
        console.log(error);
      })
      if (this.isOffline) {
        if (e.target.value == environment.BankDepositId) {
          this.isBankDeposit = true;
        }
        else {
          this.isBankDeposit = false;
        }
      }
      this.selectedPaymentId = e.target.value;
      if (this.isOnline == true) {
        this.isBkash=true;
        this.isbankTransfer = false;
        this.isBkashSubmit = true;
        this.isOfflineSubmit = false;
      } else {
        this.isBkash=false;
        this.isbankTransfer = true;
        this.isProcess = true;
        this.isBkashSubmit = false;
        this.isOfflineSubmit = true;
        this.isProcessingNagad = false;
      }
    }
  }

  amount(e: any) {
    debugger;
    let result = e.target.value.split(',')[0];
    this.selectedPrice = '';
    this.selectedAmount= '';
    this.paymentForm.get('Amount')?.setValue('');
    this.selectedAssignPaymentId = e.target.value.split(',')[2];
    if (result == "Amount") {
      this.paymenttype = 0;
      var Charge = e.target.value.split(',')[1];
      this.selectedCharge = Charge;
      this.selectedChargeAmount = Charge;
      this.isTk = true;
    } else if (result == 'Percent') {
      this.paymenttype = 1;
      var Charge = e.target.value.split(',')[1];
      this.selectedCharge = Charge;
      this.selectedChargeAmount = Charge;
      this.isTk = false;
    } else {
      this.selectedCharge = '0';
      this.selectedChargeAmount = 0;
    }
    if (this.isBankDeposit && e.target.value != '') {
      this.loadBranchByDepositeAcc(this.selectedAssignPaymentId)
    }
  }
  loadBranchByDepositeAcc(depositeAccId: string) {
    this.bankBranchLists = [];
    this.authService.loadBranchByDepositeAcc(depositeAccId).subscribe((res: any) => {
      res.value.forEach((bb:any) => {
        this.bankBranchLists.push({
          id: bb.id,
          BranchName:bb.value
        })
      });
    }, error => {
      this.toastrService.error('', 'Bank branch get failed.');
      console.log(error);
    })
  }

  price(e: any) {
    debugger;
    let price = this.selectedCharge.substring(this.selectedCharge.length - 2);
    //let amount = this.selectedCharge.substring(2, 0);
    let amount = this.selectedCharge.substring(0, this.selectedCharge.length - 2);
    if (price == 'Tk') {
      this.selectedPrice = amount;
      var value = e.target.value.replace(/,/g, "");
      this.selectedAmount = value - amount;
    } else if (price == ' %') {
      var value = e.target.value.replace(/,/g, "");
      var money = value * amount / 100;
      this.selectedPrice = Math.round(money);
      var value = e.target.value.replace(/,/g, "");
      this.selectedAmount = value - this.selectedPrice;
    }
  }
  getPaymentModeList(e: any) {
    debugger;
    this.bankBranchLists = [];
    this.className = "d-none"
    this.selectDepositAmount = 0.00;
    this.selectedChargeAmount = 0.00;
    var depositAmountInput:any = document.getElementById('depositAmountInput');
    if (depositAmountInput) {
      depositAmountInput.value = '';
    }
    this.selectedCharge = '';
    this.isBkash = false;

    this.PaymentModeId = e.target.value;
    try {
      this.authService.getPaymentModeList().subscribe(data => {
        if (e.target.value.toLowerCase() === "edb1bec6-4752-4f78-9559-c966a99e51dc".toLowerCase()) {
          this.banklists = [];
          this.banklists = data.banklist;
          this.depositaccounts = [];
          this.depositaccounts = data.deposittoaccountlist;
          this.paymentTerms = [];
          this.isOffline = true;
          this.isOnline = false;
          this.paymentTerms = this.offlinePaymentTerms;
          this.isBkashSubmit = false;
          this.isOfflineSubmit = true;
        } else {
          this.banklists = [];
          this.banklists = data.banklist;
          this.paymentTerms = [];
          this.isOffline = false;
          this.isOnline = true;
          this.isbankTransfer = false;
          this.paymentTerms = this.onlinePaymentTerms;
          this.isBkashSubmit = true;
          this.isOfflineSubmit = false;
        }
      }, err => {
        console.log(err);
      }, () => {
      });
    } catch (exp) { }
  }

  CreatePaymentForm() {
    flatpickr(".date", {
      enableTime: false,
      dateFormat: "d-m-Y",
      allowInput: false,
      maxDate: "today",
      onChange: function(selectedDates, dateStr, instance) {
        const minDate = new Date();
        if (selectedDates[0] > minDate) {
          instance.setDate(minDate, false);
        }
      },
    });

    this.paymentForm = this.fb.group({
      PaymentModeId: ['', Validators.nullValidator],
      PaymentTypeId: ['', Validators.nullValidator],
      TransactionDate: [this.datePipe.transform(new Date(), 'dd-MM-yyyy'), Validators.required], // Set to today's date initially['', Validators.required],
      OrganizationId: ['', Validators.nullValidator],
      BranchName: ['', Validators.nullValidator],
      TravelionAccountId: ['', Validators.nullValidator],
      Attchement: ['', Validators.nullValidator],
      ReferenceNo: ['', Validators.required],
      Amount: ['', Validators.required],
      PayerRefrence: ['', Validators.nullValidator]
    })
  }

  savePayment() {
    if (this.paymentForm.valid) {

      const invalidFeedbackDiv = document.getElementById('paymentAttchementError');
      if (this.selectedFile && this.selectedFile.size > 0) {

        if (invalidFeedbackDiv !== null) {
          invalidFeedbackDiv.style.display = 'none';
        }

        let paymentModel = Object.assign({}, this.paymentForm.value);
        paymentModel.TransactionDate = paymentModel.TransactionDate.split('-').reverse().join('-');
        paymentModel.TravelionAccountId = paymentModel.TravelionAccountId.split(',')[2];
        paymentModel.Charge = this.selectedChargeAmount;
        paymentModel.Amount =  this.selectDepositAmount;
        paymentModel.Attchement = this.paymentAttchement;


        this.authService.savePayment(paymentModel).subscribe(data => {
          if(data.statusCode == 200){
            this.toastrService.success('Success', 'Payment data saved successfully.');
            this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(["/home/paymenthistory"]);
            });
          }
          else{
            this.toastrService.error('Error', data.message);
          }

        }, error => {
          this.toastrService.error('', 'Payment data saved failed.');
          console.log(error);
        });
      } else {
        this.toastrService.warning('', 'Required field is not filled');
        if (invalidFeedbackDiv !== null) {
          invalidFeedbackDiv.style.display = 'block';
        }
      }

    } else {
      this.appComponent.validateAllFormFields(this.paymentForm);
      this.toastrService.warning('', 'Required field is not filled');
    }
  }
  calculateAmount(event: any) {
    var depositAmount = parseInt(event.target.value);
    if (!isNaN(depositAmount)) {
      this.className="d-block"
      this.depositAmount = parseInt(event.target.value);
      if (this.paymenttype == 0) {
        let temp = this.depositAmount - parseInt(this.selectedCharge);
        this.selectDepositAmount = temp > 0 ? temp : 0;
      }
      else {
        let temp = this.depositAmount - (this.depositAmount * (this.selectedCharge / 100));
        this.selectedChargeAmount = parseFloat((this.depositAmount * (this.selectedCharge / 100)).toFixed(2));
        this.selectDepositAmount = temp > 0 ? temp : 0;
      }
    }
    else {
      this.className="d-none"
      this.selectedChargeAmount = 0.00;
      this.selectDepositAmount = 0.00;
    }


  }
  changeBank(event: any) {
    var bankId = event.target.value;
    this.authService.getBankbranchListByBankId(bankId).subscribe((res: any) => {
      this.bankBranchLists = JSON.parse(res.value);
    }, error => {
      this.toastrService.error('', 'Bank branch get failed.');
      console.log(error);
    })

  }


}
