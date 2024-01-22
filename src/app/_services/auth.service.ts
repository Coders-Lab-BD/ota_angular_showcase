import { map } from 'rxjs/operators';

import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BkashModel } from '../model/bkash-model';
import { DateChangeCancelModel } from '../model/date-change-cancel-model.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private accountUrl = this.baseUrl +  'Account/';
  public flightUrl = this.baseUrl +  'Flight/';
  public flightSearchUrl = this.baseUrl +  'FlightSearch/';
  public commonFlightSearchUrl = this.baseUrl +  'CommonFlightSearch/';
  public bookAndHoldUrl = this.baseUrl +  'BookAndHold/';
  public passengerUrl = this.baseUrl +  'Passenger/';
  public bkashUrl = this.baseUrl + 'BKash/';
  private transactionUrl = this.baseUrl + 'Transaction/';


  constructor(private http: HttpClient, private router: Router, private _location: Location) {}


  register(model: any) {
    return this.http.post(this.accountUrl + 'register', model);
  }

  confirm_registration(useridparam: any, codeparam: any) {
    return this.http.get(this.accountUrl + 'confirmemail?userId=' + useridparam + '&code=' + codeparam);
  }

  login(model: any) {
    return this.http.post<any>(this.accountUrl + 'login', model)
    .pipe(
      map((response: any) => {
        const user = response;
        if (user!=undefined && user!="") {
          debugger;
          localStorage.setItem('is2faenabled', user.is2faenabled);
          localStorage.setItem('uid', user.id);
          localStorage.setItem('token', user.token);
          localStorage.setItem('index', user.index);
          localStorage.setItem('ulhid', user.ulhid);
          localStorage.setItem('name', user.name);
          localStorage.setItem('autoLogoutTime',user.autoLogoutTime);
          let currentTime = new Date();
          localStorage.setItem('lastActivity',currentTime.toString());

        }
      })
    );
  }
  twoFactorLogin(model: any) {
    return this.http.post<any>(this.accountUrl + 'ValidateTwoFactorAuth', model)
    .pipe(
      map((response: any) => {
        debugger;
        const user:any =  JSON.parse(response.data);
        if (user!=undefined && user!="") {
          //localStorage.setItem('is2faenabled', user.is2faenabled);
          localStorage.setItem('uid', user.id);
          localStorage.setItem('token', user.token);
          localStorage.setItem('index', user.index);
          localStorage.setItem('ulhid', user.ulhid);
          localStorage.setItem('name', user.name);
          localStorage.setItem('autoLogoutTime',user.autoLogoutTime);
          let currentTime = new Date();
          localStorage.setItem('lastActivity',currentTime.toString());

        }
      })
    );
  }
  //#region Two Factor Authentication
  enableTwoFactorAuth(isEnabled:boolean){
    let userId = localStorage.getItem('uid');
    return this.get(this.accountUrl + `SetTwoFactorAuth?userId=${userId}&isEnabled=${isEnabled}`);
  }
  //#endregion

  forgotPassword(model: any) {
    return this.http.post(this.accountUrl + 'forgotpassword', model);
  }

  resetPassword(model: any) {
    return this.http.post(this.accountUrl + 'resetpassword', model);
  }

  //#region Generate Change Phone Number Token
  GenerateChangePhoneNumberToken(phoneNumber:string) {
    let userId = localStorage.getItem('uid');
    return this.post(this.accountUrl + `GenerateChangePhoneNumberToken?userId=${userId}&phoneNumber=${phoneNumber}`, null)
  }
  ValidateChangePhoneNumberToken(model:string) {
    return this.post(this.accountUrl + 'ValidateChangePhoneNumberToken', model)
  }
  //#endregion

  //#region Generate Change Email
  GenerateChangeEmailToken(newEmail:string) {
    let userId = localStorage.getItem('uid');
    return this.post(this.accountUrl + `GenerateChangeEmailToken?userId=${userId}&newEmail=${newEmail}`, null)
  }
  ValidateChangeEmailToken(model:string) {
    return this.post(this.accountUrl + 'ValidateChangeEmailToken', model)
  }
  //#endregion

  // ================================================================================

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (token !== 'undefined' && token !== null && token !== '') {
      this.http.get(this.accountUrl + 'isAuthorized?url=' + this.router.url).subscribe(data => {
        if (!data) {
          this._location.back();
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  isAllowed(id: any) {
    this.http.get(this.accountUrl + 'isAllowed?id=' + id).subscribe(data => {
      if (!data) {
        this._location.back();
      }
    }, error => {
      console.log(error);
    });
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  IsUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (token !== 'undefined' && token !== null && token !== '') {
      this.http.get(this.accountUrl + 'isLoggedIn').subscribe(data => {
        if (data) {
          // const is2faenabled = JSON.parse(localStorage.getItem('is2faenabled'));
          // if (is2faenabled) {
          //   const is2fadone = JSON.parse(localStorage.getItem('is2fadone'));
          //   if (is2fadone) {
          //     const userIndex = localStorage.getItem('index');
          //     this.router.navigate([userIndex]);
          //   } else {
          //     this.router.navigate(['2fa']);
          //   }
          // } else {
          // }
          // const userIndex = localStorage.getItem('index');
            // this.router.navigate([userIndex]);
            console.log("UserID:"+localStorage.getItem('Id'));
        }
      }, error => {
        console.log(error);
        localStorage.clear();
      });
    }
  }
  get<T>(url:any)
  {
    return this.http.get<T>(url);
  }
  post<T>(url:any,model:any)
  {
    return this.http.post<T>(url,model);
  }
  logout(ulhid: any) {
    return this.http.get(this.accountUrl + 'logout?ulhid=' + ulhid);
  }
  getLoginSliderImages()
  {
    return this.get<any>(this.accountUrl+'getLoginSliderImages');
  }

  pageVisit() {
    return this.http.get(this.accountUrl + 'pagevisit?path=' + this.router.url);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(this.accountUrl + 'getCurrentUser');
  }

  getSideMenu(): Observable<any> {
    return this.http.get<any>(this.accountUrl + 'getSideMenu');
  }

  getDashboardData(offset: any) {
    return this.http.get(this.accountUrl + 'getDashboardData?offset=' + offset);
  }

  // getProfileData(): Observable<any> {
  //   return this.http.get<any>(this.accountUrl + 'getProfileData');
  // }
  getProfileData(): Observable<any> {
    return this.http.get<any>(this.accountUrl + 'getProfileData');
  }


  changePassword(model: any) {
    return this.http.post(this.accountUrl + 'changepassword', model);
  }

  updateProfile(model: any) {
    return this.http.post(this.accountUrl + 'updateprofile', model);
  }

  getProviders() {
    return this.http.get<any>(this.accountUrl + 'providers');
  }

  associateRegister(model: any) {
    return this.http.post<any>(this.accountUrl + 'associate', model);
  }

  setPassword(model: any) {
    return this.http.post(this.accountUrl + 'setpassword', model);
  }

  getGridData(offset: any, pg: any, sl: any, sv: any) {
    return this.http.get<any>(this.accountUrl + 'GetGridData?offset=' + offset + '&pg=' + pg + '&sl=' + sl + '&sv=' + sv);
  }

  // ======================== Admin Controller ===========================
  getStatusList(): Observable<any> {
    return this.http.get<any>(this.accountUrl + 'getStatusList');
  }

  deleteStatus(id: any) {
    return this.http.get(this.accountUrl + 'deleteStatus?Id=' + id);
  }

  getStatusById(id: any) {
    return this.http.get<any>(this.accountUrl + 'getStatusById?Id=' + id);
  }

  saveStatus(model: any) {
    return this.http.post(this.accountUrl + 'saveStatus', model);
  }
  getAgencyPermit(id:any): Observable<any> {
    return this.http.get<any>(this.accountUrl + 'getAgencyPermit?id='+id);  //Done
  }
  getAgency(id:any): Observable<any> {
    return this.http.get<any>(this.accountUrl + 'getAgency?id='+id);
  }
  // ================= Flight Controller Start ===================
  getAgencyProposalData(pg: any, sl: any, sv: any, id: any) {
    return this.get<any>(this.flightUrl + `getAgencyProposalData?pg=${pg}&sl=${sl}&sv=${sv}&id=${id}`);
  }
  getIndexAddImages(): Observable<any> {
    return this.http.get<any>(this.commonFlightSearchUrl + 'getIndexAddImages');  //Done
  }
  getFlightList(): Observable<any> {
    return this.http.get<any>(this.commonFlightSearchUrl + 'getFlightList');  //Done
  }

  getAirlineInfo(): Observable<any> {
    return this.http.get<any>(this.flightSearchUrl + 'getAirlineInfo');  //Done
  }
  getAircraftInfo(): Observable<any> {
    return this.http.get<any>(this.flightUrl + 'getAircraftInfo');
  }
  getAirlineList(): Observable<any> {
    return this.http.get<any>(this.commonFlightSearchUrl + 'getAirlineList');  //Done
  }
  getImageList(): Observable<any> {
    return this.http.get<any>(this.flightUrl + 'getImageList');
  }
  getMarkupList(): Observable<any> {
    return this.http.get<any>(this.flightUrl + 'getMarkupList');
  }
  // ================= Flight Search ===================
  saveFlightSearchHistory(model:any): Observable<any> {
    return this.http.post<any>(this.commonFlightSearchUrl + 'saveFlightSearchHistory',model);
  }
  saveFlightSearch(model:any): Observable<any> {
    return this.http.post<any>(this.flightSearchUrl + 'saveFlightSearch',model);
  }
  saveFlightSearchOneWayRoundTrip(model:any): Observable<any> {
    return this.http.post<any>(this.flightSearchUrl + 'saveFlightSearchOneWayRoundTrip',model);
  }
  saveDateChangeMulticity(model:any): Observable<any> {
    return this.http.post<any>(this.flightSearchUrl + 'saveDateChangeMulticity',model);
  }
  saveFlightSearchRoundTrip(model:any): Observable<any> {
    return this.http.post<any>(this.flightSearchUrl + 'saveFlightSearchRoundTrip',model);
  }
  getFlightSearch(model:any): Observable<any> {
    return this.http.post<any>(this.flightSearchUrl + 'getFlightSearch',model);
  }
  getOneWayFlightSearch(model:any): Observable<any> {
    return this.http.post<any>(this.flightSearchUrl + 'getOneWayFlightSearch',model);
  }

  getFlightSearchDomRoundTrip(model:any): Observable<any> {
    return this.http.post<any>(this.flightSearchUrl + 'getFlightSearchDomRoundTrip',model);
  }


  // ================= Fare Search ===================
  getFareSearch(model:any): Observable<any> {
    return this.http.post<any>(this.flightSearchUrl + 'getFareSearch',model);
  }
  // ================= Passenger Details ===================
  getRecentFlightSearch(id:any): Observable<any> {
    return this.get<any>(this.passengerUrl + 'getRecentFlightSearch?id='+id);  //Done
  }
  getB2BNotice(givenDateTime:any): Observable<any> {
    return this.get<any>(this.passengerUrl + 'getB2BNotice?givenDateTime='+givenDateTime);  //Done
  }
  getRecentBookingFlight(givenDateTime:any,id:any): Observable<any> {
    return this.get<any>(this.passengerUrl + 'getRecentBookingFlight?givenDateTime='+givenDateTime+"&id="+id);  //Done
  }
  getTopAirport(): Observable<any> {
    return this.get<any>(this.passengerUrl + 'getTopAirport'); //Done
  }
  getGenderList(): Observable<any> {
    return this.get<any>(this.flightUrl + 'getGender');
  }
  getPassengerType(): Observable<any> {
    return this.get<any>(this.flightUrl + 'getPassengerType');
  }
  getPassengerInformation(id: any): Observable<any> {
    return this.get<any>(this.passengerUrl + 'getPassengerInformation?id=' + id);  //Done
  }
  getGenderTitleList(): Observable<any> {
    return this.get<any>(this.passengerUrl + 'getGenderTitle');
  }
  getSpecialService(): Observable<any> {
    return this.get<any>(this.flightUrl + 'getSpecialService');
  }
  deductAgentFare(id: any): Observable<any> {
    return this.get<any>(this.flightUrl + 'deductAgentFare?Id=' + id);  //Done
  }
  saveBookingStatus(model: any) {
    return this.post(this.flightUrl + 'saveBookingStatus', model);
  }
  postSabreIssueTicket(model: any) {
    return this.post<any>(this.flightUrl + 'postSabreIssueTicket', model);
  }
  getAssignSupplierWithProviderBySupplierAndProviderId(model: any) {
    return this.post<any>(this.flightUrl + 'getAssignSupplierWithProviderBySupplierAndProviderId', model);
  }
  getBookingJourneybyBookingId(bookingId: any) {
    return this.http.get<any>(this.flightUrl + 'getBookingJourneybyBookingId?bookingId=' + bookingId);
  }
  CancelBooking(model: any) {
    return this.post(this.flightUrl + 'CancelBooking', model);
  }
  getPNRCreation(model:any): Observable<any> {
    return this.post<any>(this.passengerUrl + 'getPNRCreation',model); //Done
  }
  getRevalidateItinery(model:any): Observable<any> {
    return this.post<any>(this.passengerUrl + 'getRevalidateItinery',model); //Done
  }
  getBooking(model:any): Observable<any> {
    return this.post<any>(this.flightUrl + 'getBooking',model);
  }
  getIssues(model:any): Observable<any> {
    return this.post<any>(this.flightUrl + 'getIssues',model);
  }
  saveBookSuccess(model:any): Observable<any> {
    return this.post<any>(this.flightUrl + 'saveBookSuccess',model);
  }
  saveBookFail(model:any): Observable<any> {
    return this.post<any>(this.flightUrl + 'saveBookFail',model);
  }

  saveProposal(model:any): Observable<any> {
    return this.post<any>(this.flightUrl + 'saveProposal',model);
  }
  getAgencyInfo(id: any): Observable<any> {
    return this.http.get<any>(this.commonFlightSearchUrl + 'getAgencyInfo?id=' + id);
  }
  getAgencyProposalDataForPrint(id: any): Observable<any> {
    return this.http.get<any>(this.flightUrl + 'getAgencyProposalDataForPrint?agencyProposalId=' + id);
  }
  getDateChanges(model:DateChangeCancelModel): Observable<any> {
    return this.post<any>(this.flightUrl + `getDateChanges`,model);
  }
  getDateChangesRoundTrip(id:any,departureDate:any,fromCity:any,toCity:any,airline:any,farebasis:any,flightRouteTypeId:any,flightTypeId:any): Observable<any> {
    return this.http.get<any>(this.flightUrl + 'getDateChangesRoundTrip?id='+id+"&departureDate="+departureDate+
    "&fromCity="+fromCity+"&toCity="+toCity+"&airline="+airline+"&farebasis="+farebasis+
    "&flightRouteTypeId="+flightRouteTypeId+"&flightTypeId="+flightTypeId);
  }
  getRecentBookingFlightForGrid(givenDateTime:any,id:any, pg: any, sl: any, sv: any): Observable<any> {
    return this.get<any>(this.flightUrl + `getRecentBookingFlightForGrid?givenDateTime=${givenDateTime}&id=${id}&pg=${pg}&sl=${sl}&sv=${sv}`);
  }
  getQuickPassengerData(pg: any, sl: any, sv: any, id: any) {
    return this.get<any>(this.passengerUrl + `getQuickPassengerData?pg=${pg}&sl=${sl}&sv=${sv}&id=${id}`);
  }
  savePassanger(model:any) {
    return this.post<any>(this.passengerUrl + 'savePassenger', model);
  }
  updatePassengerInfo(model:any){
    return this.http.post(this.flightUrl + 'updatePassengerInfo', model);
  }
  getPassengerAttachments(id: any) {
    return this.get<any>(this.flightUrl + 'getPassengerAttachments?passengerInformationId=' + id);
  }
  deletePassenger(id: any) {
    return this.get(this.passengerUrl + 'deletePassenger?Id=' + id);
  }
  getB2bLoaderImage(): Observable<any> {
    return this.get<any>(this.transactionUrl + 'getB2bLoaderImage');
  }
  getPaymentModeList(): Observable<any> {
    return this.get<any>(this.transactionUrl + 'getPaymentModeList');
  }
  savePayment(model:any): Observable<any> {
    return this.post<any>(this.transactionUrl + 'savePayment',model);
  }
  getBankbranchListByBankId(bankId:any): Observable<any> {
    return this.get<any>(this.transactionUrl + `getBankbranchListByBankId?bankId=${bankId}`);
  }
  getDepositToAccountList(id:any): Observable<any> {
    return this.get<any>(this.transactionUrl + `getDepositToAccountList?id=${id}`);
  }
  loadBranchByDepositeAcc(depositeAccId:string): Observable<any> {
    return this.get<any>(this.transactionUrl + `loadBranchByDepositeAcc?depositeAccId=${depositeAccId}`);
  }

  savenagadTransaction(model:any): Observable<any> {
    return this.post<any>(this.flightUrl + 'savenagadTransaction',model);
  }
  getnagad(id: any) {
    return this.get<any>(this.flightUrl + 'getnagad?Id=' + id);
  }
  getPaymentHistoryData(pg: any, sl: any, sv: any, id: any) {
    return this.get<any>(this.transactionUrl + `getPaymentHistoryData?pg=${pg}&sl=${sl}&sv=${sv}&id=${id}`);
  }
  getPaymentLaserData(pg: any, sl: any, fdate: any, tdate: any, id: any) {
    return this.get<any>(this.transactionUrl + `getPaymentLedgerData?pg=${pg}&sl=${sl}&fromDate=${fdate}&toDate=${tdate}&id=${id}`);
  }
  getTransactionById(id: any) {
    return this.get<any>(this.flightUrl + 'getTransactionById?Id=' + id);
  }
  deleteTransaction(id: any) {
    return this.get(this.flightUrl + 'deleteTransaction?Id=' + id);
  }
  getChargeList(pg: any, sl: any, sv: any){
    return this.get<any>(this.flightUrl + `getChargeList?pg=${pg}&sl=${sl}&sv=${sv}`);
  }
  saveCharge(model:any): Observable<any> {
    return this.post<any>(this.flightUrl + 'saveCharge',model);
  }
  getChargeById(id: any) {
    return this.get<any>(this.flightUrl + 'getChargeById?Id=' + id);
  }
  deleteCharge(id: any) {
    return this.get(this.flightUrl + 'deleteCharge?Id=' + id);
  }
  getCountryList(): Observable<any> {
    return this.get<any>(this.passengerUrl + 'getCountryList');
  }
  getResponseSearchText(id:any,type:any): Observable<any> {
    return this.get<any>(this.flightUrl + 'getResponseSearchText?id='+id+"&type="+type);
  }
  getViewBookingById(id: any) {
    return this.get<any>(this.flightUrl + 'getViewBookingById?Id=' + id);
  }
  getPnr(id: any) {
    return this.get<any>(this.flightUrl + 'getPnr?Id=' + id);
  }
  getServerSideBookingList(id:any, pg: any, sl: any, sv: any): Observable<any> {
    return this.get<any>(this.flightUrl + `getServerSideBookingList?id=${id}&pg=${pg}&sl=${sl}&sv=${sv}`);
  }
  GetServerSideBookingAllActionList(id:any, pg: any, sl: any, sv: any): Observable<any> {
    return this.get<any>(this.flightUrl + `GetServerSideBookingAllActionList?id=${id}&pg=${pg}&sl=${sl}&sv=${sv}`);
  }
  saveDateChange(model: any) {
    return this.post(this.flightUrl + 'saveDateChange', model);
  }
  saveDateChangerequest(model: any) {
    return this.post(this.flightUrl + 'saveDateChangerequest', model);
  }
  saveReIssuerequest(model: any) {
    return this.post(this.flightUrl + 'saveReIssuerequest', model);
  }
  savePartialPayment(model: any) {
    return this.post(this.flightUrl + 'savePartialPayment', model);
  }
  saveVoid(model: any) {
    return this.post(this.flightUrl + 'saveVoid', model);
  }
  saveRefund(model: any) {
    return this.post(this.flightUrl + 'saveRefund', model);
  }
  splitBooking(model: any) {
    return this.post(this.flightUrl + 'splitBooking', model);
  }
  getGenerateTokenBkash(): Observable<any> {
    return this.get<any>(this.bkashUrl + 'getGenerateTokenBkash');
  }
  getPaymentCreateBkash(model:BkashModel): Observable<any> {
    return this.get<any>(this.bkashUrl + `getPaymentCreateBkash?token=${model.token}&payerReference=${model.payerRefrence}&amount=${model.amount}&merchantInvoiceNumber=${model.merchantInvoiceNumber}`);
  }
  getPaymentExecuteBkash(token:string,payerRefrence:string, merchantInvoiceNumber:string): Observable<any> {
    return this.get<any>(this.bkashUrl + `getPaymentExecuteBkash?token=${token}&payerReference=${payerRefrence}&merchantInvoiceNumber=${merchantInvoiceNumber}`);
  }
  getNagadSensitive(type:string,retSensitive:string="0"): Observable<any> {
    return this.get<any>(this.flightUrl + `getNagadSensitive?type=${type}&retSensitive=${retSensitive}`);
  }
  getCheckoutInit(model: any){
    return this.post(this.flightUrl + 'getCheckoutInit', model);
  }
  getNagadPaymentVerification(model: any){
    return this.post(this.flightUrl + 'getNagadPaymentVerification?', model);
  }
  getCommonFlightSearch(model: any): Observable<any> {
    return this.http.post<any>(this.commonFlightSearchUrl + 'GetFlightSearch',model);
  }
  createPNR(model: any): Observable<any> {
    return this.http.post<any>(this.bookAndHoldUrl + 'CreatePNR',model);
  }
  GetBookingDetailsByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'GetBookingDetailsByBookingId?bookingId='+model);
  }
  GetBookingDetails(userId:any, pageNo:number, length:number): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + `GetBookingDetails?agencyId=${userId}&pageNo=${pageNo}&length=${length}`);
  }
  issueTicketByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'issueTicketByBookingId?bookingId='+model);
  }
  issueRequestByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'issueRequestByBookingId?bookingId='+model);
  }
  issueRequestCanceledByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'issueRequestCanceledByBookingId?bookingId='+model);
  }
  refundRequestByBookingId(model: any): Observable<any> {
    return this.http.post<any>(this.bookAndHoldUrl + 'refundRequestByBookingId',model);
  }
  refundRequestCanceledByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'refundRequestCanceledByBookingId?bookingId='+model);
  }
  refundByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'refundByBookingId?bookingId='+model);
  }
  refundOfferAceptedByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'refundOfferAceptedByBookingId?bookingId='+model);
  }
  refundOfferRejectedByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'refundOfferRejectedByBookingId?bookingId='+model);
  }
  getTicketRefundInfoByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'getTicketRefundInfoByBookingId?bookingId='+model);
  }
  cancelBookinByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'cancelBookinByBookingId?bookingId='+model);
  }
  reIssueRequestedByAgency(model: any): Observable<any> {
    return this.http.post<any>(this.bookAndHoldUrl + 'reIssueRequestedByAgency',model);
  }
  reIssueOfferRejectedByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'reIssueOfferRejectedByBookingId?bookingId='+model);
  }
  getTicketReissueInfoByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'getTicketReissueInfoByBookingId?bookingId='+model);
  }
  reIssueOfferAceptedByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'reIssueOfferAceptedByBookingId?bookingId='+model);
  }
  reIssueRequestCanceledByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'reIssueRequestCanceledByBookingId?bookingId='+model);
  }
  voidRequestByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'voidRequestByBookingId?bookingId='+model);
  }
  voidRequestCanceledByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'voidRequestCanceledByBookingId?bookingId='+model);
  }
  issueTransaction(BookAndHoldId:string): Observable<any>{
    return this.http.get<any>(this.transactionUrl + 'issueTransaction?BookAndHoldId='+ BookAndHoldId);
  }
  GetPaymentMode(): Observable<any>{
    return this.http.get<any>(this.transactionUrl + 'GetPaymentMode');
  }
  GetPaymentTermsOffline(): Observable<any>{
    return this.http.get<any>(this.transactionUrl + 'GetPaymentTermsOffline');
  }
  GetPaymentTermsOnline(): Observable<any>{
    return this.http.get<any>(this.transactionUrl + 'GetPaymentTermsOnline');
  }
  getCurrentBalance(): Observable<any>{
    return this.http.get<any>(this.transactionUrl + 'GetCurrentBalance');
  }
  getBillStatus(BookAndHoldId:string): Observable<any>{
    return this.http.get<any>(this.transactionUrl + 'GetBillStatus?BookAndHoldId=' + BookAndHoldId);
  }
  timeLimitExtendRequestByBookingId(model: any): Observable<any> {
    return this.http.get<any>(this.bookAndHoldUrl + 'timeLimitExtendRequestByBookingId?bookingId='+model);
  }
  UpdateFileByPassengerId(model: any): Observable<any> {
    return this.http.post<any>(this.bookAndHoldUrl + 'UpdateFileByPassengerId',model);
  }
  GetFareDetailsByFareBasisCode(model: any): Observable<any> {
    return this.http.post<any>(this.commonFlightSearchUrl + 'GetFareDetailsByFareBasisCode',model);
  }
  GetPenalties(model: any): Observable<any> {
    return this.http.post<any>(this.commonFlightSearchUrl + 'GetPenalties',model);
  }
  // getCheckoutInit(model: any,merchant_id:string,order_id:string) {
  //   const headers = {
  //     "Access-Control-Allow-Origin":"*",
  //     "X-KM-IP-V4": "192.168.1.12",
  //     "X-KM-Client-Type": "PC_WEB",
  //     "X-KM-Api-Version": "v-0.2.0",
  //     "Content-Type": "application/json",
  //   };
  //   return this.http.post<any>(`http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/${merchant_id}/${order_id}`, model,{headers});
  //   // return this.http.post<any>(`https://auth.mynagad.com:10900/authentication-service-provider-1.0/login`,model);
  // }
}
