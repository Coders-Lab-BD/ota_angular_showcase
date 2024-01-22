import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { IndexComponent } from './Index/Index.component';
import { AvailableRequestComponent } from './available-request/available-request.component';
import { BookAndHoldDetailsComponent } from './book-and-hold-details/book-and-hold-details.component';
import { BookAndHoldGridComponent } from './book-and-hold-grid/book-and-hold-grid.component';
import { BookAndHoldComponent } from './book-and-hold/book-and-hold.component';
import { BookSuccessComponent } from './book-success/book-success.component';
import { BookingAssistanceFlightComponent } from './booking-assistance-flight/booking-assistance-flight.component';
import { BookingAssistanceHotelComponent } from './booking-assistance-hotel/booking-assistance-hotel.component';
import { ChargeComponent } from './charge/charge.component';
import { CommonFlightSearchComponent } from './common-flight-search/common-flight-search.component';
import { DateChangeDomMulticityComponent } from './date-change-dom-multicity/date-change-dom-multicity.component';
import { DateChangeDomOnewayComponent } from './date-change-dom-oneway/date-change-dom-oneway.component';
import { DateChangeInternationalMulticityComponent } from './date-change-international-multicity/date-change-international-multicity.component';
import { DateChangeInternationalComponent } from './date-change-international/date-change-international.component';
import { DomMulticityComponent } from './dom-multicity/dom-multicity.component';
import { DomRoundtripComponent } from './dom-roundtrip/dom-roundtrip.component';
import { DomesticOneWayFlightSearchComponent } from './domestic-one-way-flight-search/domestic-one-way-flight-search.component';
import { FlightProposalComponent } from './flight-proposal/flight-proposal.component';
import { GroupRequestComponent } from './group-request/group-request.component';
import { HolidayPackagesComponent } from './holiday-packages/holiday-packages.component';
import { HomeComponent } from './home.component';
import { HotelsComponent } from './hotels/hotels.component';
import { IntMulticityComponent } from './int-multicity/int-multicity.component';
import { IntRoundtripComponent } from './int-roundtrip/int-roundtrip.component';
import { InternationalOneWayFlightSearchComponent } from './international-one-way-flight-search/international-one-way-flight-search.component';
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
import { VisaComponent } from './visa/visa.component';

const homeRoutes: Routes = [
  { path: 'home',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    component: HomeComponent, // this is the component with the <router-outlet> in the template
    children: [
      {path: 'index', component: IndexComponent},
      {path: '', redirectTo: '/home/index', pathMatch: 'full'},
      {path: 'hotels', component: HotelsComponent},
      {path: 'visa', component: VisaComponent},
      {path: 'group-req', component: GroupRequestComponent},
      {path: 'available-req', component: AvailableRequestComponent},
      {path: 'booking-assistance-flight', component: BookingAssistanceFlightComponent},
      {path: 'booking-assistance-hotel', component: BookingAssistanceHotelComponent},
      {path: 'holiday-packages', component: HolidayPackagesComponent},
      {path: 'domestic-one-way-flight-search', component: DomesticOneWayFlightSearchComponent},
      {path: 'international-one-way-flight-search', component: InternationalOneWayFlightSearchComponent},
      {path: 'recent-booking-flight/:id', component: RecentBookingFlightComponent},
      {path: 'refund-partial-date-void-temporary-request', component: RefundPartialDateVoidTemporaryRequestComponent},
      {path: 'notice', component: NoticeComponent},
      {path: 'passenger-details', component: PassengerDetailsComponent},
      {path: 'book-success', component: BookSuccessComponent},
      {path: 'int-roundtrip', component: IntRoundtripComponent},
      {path: 'flight-proposal', component: FlightProposalComponent},
      {path: 'proposal-info', component: ProposalInfoComponent},
      {path: 'payment', component: PaymentComponent},
      {path: 'payment-confirmation/:payerReference/:merchantInvoiceNumber', component: PaymentConfirmationComponent},
      {path: 'paymenthistory', component: PaymentHistoryComponent},
      {path: 'nagad-checkout', component: NagadCheckoutComponent},
      {path: 'charge', component: ChargeComponent},
      {path: 'profile', component: ProfileComponent },
      {path: 'quick-passenger', component: QuickPassengerComponent },
      {path: 'dom-roundtrip', component: DomRoundtripComponent },
      {path: 'dom-multicity', component: DomMulticityComponent },
      {path: 'date-change-domestic', component: DateChangeDomOnewayComponent },
      {path: 'date-change-domestic-multicity', component: DateChangeDomMulticityComponent },
      {path: 'date-change-international', component: DateChangeInternationalComponent },
      {path: 'date-change-international-multicity', component: DateChangeInternationalMulticityComponent },
      {path: 'profile', component: ProfileComponent },
      {path: 'quick-passenger', component: QuickPassengerComponent },
      {path: 'dom-roundtrip', component: DomRoundtripComponent },
      {path: 'dom-multicity', component: DomMulticityComponent },
      {path: 'int-multicity', component: IntMulticityComponent },
      {path: 'payment-laser', component: PaymentLaserComponent },
      {path: 'common-flight-search', component: CommonFlightSearchComponent },
      {path: 'book-and-hold', component: BookAndHoldComponent },
      {path: 'book-and-hold-details', component: BookAndHoldDetailsComponent },
      {path: 'book-and-hold-grid', component: BookAndHoldGridComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
