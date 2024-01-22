import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ClickOutsideModule } from 'ng-click-outside';
import { DragScrollModule } from 'ngx-drag-scroll';
import { HttpInterceptorService } from '../_services/http-interceptor.service';
import { IndexComponent } from './Index/Index.component';
import { AppClickOutsideDirective } from './app-click-outside.directive';
import { AvailableRequestComponent } from './available-request/available-request.component';
import { BookAndHoldComponent } from './book-and-hold/book-and-hold.component';
import { BookSuccessComponent } from './book-success/book-success.component';
import { BookingAssistanceFlightComponent } from './booking-assistance-flight/booking-assistance-flight.component';
import { BookingAssistanceHotelComponent } from './booking-assistance-hotel/booking-assistance-hotel.component';
import { ChargeComponent } from './charge/charge.component';
import { CommonFlightSearchComponent } from './common-flight-search/common-flight-search.component';
import { DomOneWayFlightResultComponent } from './common-flight-search/dom-one-way-flight-result/dom-one-way-flight-result.component';
import { IntOneWayFlightResultComponent } from './common-flight-search/int-one-way-flight-result/int-one-way-flight-result.component';
import { RoundTripFlightResultComponent } from './common-flight-search/round-trip-flight-result/round-trip-flight-result.component';
import { DateChangeDomMulticityComponent } from './date-change-dom-multicity/date-change-dom-multicity.component';
import { DateChangeDomOnewayComponent } from './date-change-dom-oneway/date-change-dom-oneway.component';
import { DateChangeInternationalMulticityComponent } from './date-change-international-multicity/date-change-international-multicity.component';
import { DateChangeInternationalComponent } from './date-change-international/date-change-international.component';
import { DomMulticityComponent } from './dom-multicity/dom-multicity.component';
import { DomRoundtripComponent } from './dom-roundtrip/dom-roundtrip.component';
import { DomesticOneWayFlightSearchComponent } from './domestic-one-way-flight-search/domestic-one-way-flight-search.component';
import { FareDetailsModalComponent } from './fare-details-modal/fare-details-modal.component';
import { FlightDetailsModalComponent } from './flight-details-modal/flight-details-modal.component';
import { FlightPanelComponent } from './flight-panel/flight-panel.component';
import { FlightProposalComponent } from './flight-proposal/flight-proposal.component';
import { GroupRequestComponent } from './group-request/group-request.component';
import { HeaderComponent } from './header/header.component';
import { HolidayPackagesComponent } from './holiday-packages/holiday-packages.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HotelsComponent } from './hotels/hotels.component';
import { IntMulticityComponent } from './int-multicity/int-multicity.component';
import { IntRoundtripComponent } from './int-roundtrip/int-roundtrip.component';
import { InternationalOneWayFlightSearchComponent } from './international-one-way-flight-search/international-one-way-flight-search.component';
import { LoaderComponent } from './loader/loader.component';
import { MakeProposalComponent } from './make-proposal/make-proposal.component';
import { NagadCheckoutComponent } from './nagad-checkout/nagad-checkout.component';
import { NoticeComponent } from './notice/notice.component';
import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';
import { PaymentConfirmationComponent } from './payment/payment-confirmation/payment-confirmation.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentLaserComponent } from './payment-laser/payment-laser.component';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';
import { ProposalInfoComponent } from './proposal-info/proposal-info.component';
import { QuickPassengerComponent } from './quick-passenger/quick-passenger.component';
import { RecentBookingFlightComponent } from './recent-booking-flight/recent-booking-flight.component';
import { RefundPartialDateVoidTemporaryRequestComponent } from './refund-partial-date-void-temporary-request/refund-partial-date-void-temporary-request.component';
import { SecondHeaderComponent } from './second-header/second-header.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TicketPrintComponent } from './ticket-print/ticket-print.component';
import { VisaComponent } from './visa/visa.component';
import { IntMultiCityComponent } from './common-flight-search/int-multi-city/int-multi-city.component';
import { TopSearchBarComponent } from './common-flight-search/top-search-bar/top-search-bar.component';
import { DomRoundTripFlightResultComponent } from './common-flight-search/dom-round-trip-flight-result/dom-round-trip-flight-result.component';
import { DomMultiCityFlightResultComponent } from './common-flight-search/dom-multi-city-flight-result/dom-multi-city-flight-result.component';
import { BookAndHoldGridComponent } from './book-and-hold-grid/book-and-hold-grid.component';
import { BookAndHoldDetailsComponent } from './book-and-hold-details/book-and-hold-details.component';
// import { DomOneWayFlightResultComponent } from './dom-one-way-flight-result/dom-one-way-flight-result.component';

@NgModule({
   declarations: [
      HomeComponent,
      LoaderComponent,
      HeaderComponent,
      SidebarComponent,
      SidebarMenuComponent,
      IndexComponent,
      HotelsComponent,
      VisaComponent,
      HolidayPackagesComponent,
      BookingAssistanceFlightComponent,
      BookingAssistanceHotelComponent,
      GroupRequestComponent,
      AvailableRequestComponent,
      SecondHeaderComponent,
      DomesticOneWayFlightSearchComponent,
      InternationalOneWayFlightSearchComponent,
      FareDetailsModalComponent,
      FlightDetailsModalComponent,
      RecentBookingFlightComponent,
      NoticeComponent,
      AppClickOutsideDirective,
      PassengerDetailsComponent,
      BookSuccessComponent,
      IntRoundtripComponent,
      MakeProposalComponent,
      FlightProposalComponent,
      ProposalInfoComponent,
      ProfileComponent,
      PaymentComponent,
      QuickPassengerComponent,
      ChargeComponent,
      DomRoundtripComponent,
      DomMulticityComponent,
      DateChangeDomOnewayComponent,
      DateChangeDomMulticityComponent,
      DateChangeInternationalComponent,
      IntMulticityComponent,
      DateChangeInternationalMulticityComponent,
      FlightPanelComponent,
      RefundPartialDateVoidTemporaryRequestComponent,
      TicketPrintComponent,
      NagadCheckoutComponent,
      PaymentHistoryComponent,
      PaymentLaserComponent,
      PaymentConfirmationComponent,
      CommonFlightSearchComponent,
      RoundTripFlightResultComponent,
      BookAndHoldComponent,
      IntOneWayFlightResultComponent,
      DomOneWayFlightResultComponent,
      IntMultiCityComponent,
      TopSearchBarComponent,
      DomRoundTripFlightResultComponent,
      DomMultiCityFlightResultComponent,
      BookAndHoldGridComponent,
      BookAndHoldDetailsComponent
   ],
   imports: [
      CommonModule,
      BrowserModule,
      AutocompleteLibModule,
      HomeRoutingModule,
      HttpClientModule,
      FormsModule,
      NgbModule,
      ReactiveFormsModule,
      ClickOutsideModule,
      DragScrollModule
   ],
   providers: [
      {
         provide: HTTP_INTERCEPTORS,
         useClass: HttpInterceptorService,
         multi: true
      }
   ]
})
export class HomeModule { }
