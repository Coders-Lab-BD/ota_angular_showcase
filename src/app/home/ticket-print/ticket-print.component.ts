import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { environment } from 'src/environments/environment';
import { FlightHelperService } from '../flight-helper.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
declare var window: any;
declare var $: any;

@Component({
  selector: 'app-ticket-print',
  templateUrl: './ticket-print.component.html',
  styleUrls: ['./ticket-print.component.css']
})
export class TicketPrintComponent implements OnInit {
  coreUrl = '';
  ticketprint = false;

  constructor(public flightHelper:FlightHelperService,
    public shareService:ShareService,public authService:AuthService,
    private fb: FormBuilder,private router: Router, private httpClient: HttpClient,
    @Inject(DOCUMENT) private document: Document) { }
    @Input() data: any = [];
    @Input() fareDetails: any;
    @Input() agencyInfo: any= [];
    @Input() isFare: any;
    @Input() iscompanyInfo: any;
    @Input() istotalFareChange: any;
    @Input() reissueTotalFare: any;
    @Input() refundTotalFare: any;

  ngOnInit(): void {
    this.coreUrl = environment.apiUrl.substring(0, environment.apiUrl.length - 4);
  }

  print()
  {
    // try{
      this.ticketprint = true;
      setTimeout(()=>{
        var divContents = $("#ticketView").html();
        var printWindow = window.open('', '');
        printWindow.document.write('<html><head><title></title>');
        printWindow.document.write('<link rel="stylesheet" href="../../../assets/dist/css/bootstrap.min.css">');
        printWindow.document.write('<link rel="stylesheet" href="../../../assets/dist/css/font-awesome.min.css">');
        printWindow.document.write('<link rel="stylesheet" href="../../../assets/dist/css/owl.carousel.min.css">');
        printWindow.document.write('<link rel="stylesheet" href="../../../assets/dist/css/main.css">');
        printWindow.document.write('<link rel="stylesheet" href="../../../assets/dist/css/responsive.min.css">');
        printWindow.document.write('</head><body >');
        // printWindow.document.write('<img src="../../../assets/images/ticket/partner.png">');
        printWindow.document.write(divContents);
        printWindow.document.write('<script src="../../../assets/dist/js/jquery.min.js"></script>');
        printWindow.document.write('<script src="../../../assets/dist/js/bootstrap.bundle.min.js"></script>');
        printWindow.document.write('<script src="../../../assets/dist/js/owl.carousel.min.js"></script>');
        printWindow.document.write('<script src="../../../assets/dist/js/main.min.js"></script>');
        printWindow.document.write('<script type="text/javascript">addEventListener("load", () => { print(); close(); })</script></body></html>');

        printWindow.document.close();
        printWindow.focus();
      },500);
  }



  subtractMinutesFromTime(timeString: string, minutesToSubtract: number): string {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
  
    // Create a Date object with the input time
    const timeObject = new Date(0, 0, 0, hours, minutes);
  
    // Subtract the specified number of minutes
    timeObject.setMinutes(timeObject.getMinutes() - minutesToSubtract);
  
    // Extract the updated hours and minutes
    const updatedHours = timeObject.getHours();
    const updatedMinutes = timeObject.getMinutes();
  
    // Format the updated time as "HH:mm"
    const updatedTime = `${updatedHours.toString().padStart(2, '0')}:${updatedMinutes.toString().padStart(2, '0')}`;
  
    return updatedTime;
  }
  
  reload() {
    location.reload();
  }

}
