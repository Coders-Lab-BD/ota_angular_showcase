import { Component, ElementRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from '../../_services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Select2OptionData } from 'ng-select2';
import { NgbCalendar, NgbDateParserFormatter,NgbDateStruct,NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
import { DatePipe, DOCUMENT } from '@angular/common';
import {ShareService} from '../../_services/share.service';
import {Observable, Subject, merge, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import { FlightHelperService } from '../flight-helper.service';
import flatpickr from "flatpickr";
declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {
  urlMain = "./assets/dist/js/main.min.js";
  urlDemo = "./assets/dist/js/demo.js";

  loadAPI: Promise<any> | any;
  bookingNotice: any=[];
  contentTitle:string="";
  contentText:string="";
  private sub: any;
  id:string="";
  constructor(@Inject(DOCUMENT) private document: Document, public datepipe: DatePipe, private renderer: Renderer2,
  private calendar: NgbCalendar, private fb: FormBuilder, public formatter: NgbDateParserFormatter, private authService: AuthService,
  private router: Router, private httpClient: HttpClient, private toastrService: ToastrService,private elementRef: ElementRef,
  public shareService:ShareService,private flightHelper:FlightHelperService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._init();
  }
  private _init()
  {
    this.loadAPI = new Promise(resolve => {
      // console.log("resolving promise...");
      this.loadScript();
    });
    this.getB2BNotice();
  }
  public loadScript() {
    let node4 = document.createElement("script");
    node4.src = this.urlMain;
    node4.type = "text/javascript";
    node4.async = true;
    node4.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node4);
  }
  getB2BNotice()
  {
    this.bookingNotice=[];
    var currentLocation = window.location.search;
    var id=currentLocation.replaceAll("?id=","");
    try{
      var curDate=this.shareService.getYearLong()+"-"+
      this.shareService.getMonth()+"-"+this.shareService.getDay()+" "+
      this.shareService.padLeft(this.shareService.getHour(),'0',2)+":"+this.shareService.padLeft(this.shareService.getMinute(),'0',2);
      this.authService.getB2BNotice(curDate).subscribe(data=>{

        for(let item of data.data)
        {
          if(item.vNoticeID.toString().toLowerCase()==id.toString().toLowerCase())
          {
            this.contentTitle=item.nvNoticeName;
            this.contentText=item.nvNoticeContent;
            break;
          }
        }

      });

    }catch(exp){}
  }

}
