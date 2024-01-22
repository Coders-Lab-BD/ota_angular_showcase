import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
declare var window: any;
declare var $: any;
declare var $;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public constructor(private datepipe: DatePipe, private titleService: Title) {}

  ngOnInit() {

  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle + ' | ' + environment.projectName);
  }

  // public saveMessage(newName: string) {
  //   return (newName + '  ' + environment.saveMessage);
  // }
  // public updateMessage(newName: string) {
  //   return (newName + '  ' + environment.saveMessage);
  // }
  // public deleteMessage(newName: string) {
  //   return (newName + '  ' + environment.saveMessage);
  // }
  // public savefailedMessage(newName: string) {
  //   return (newName + '  ' + environment.saveMessage);
  // }
  // public deletefailedMessage(newName: string) {
  //   return (newName + '  ' + environment.saveMessage);
  // }

  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });


  }

  public UTCToLocalTime(utc: any) {
    const date = new Date(utc);
    const utcDate = new Date(date + ' UTC');
    return this.datepipe.transform(utcDate, 'MM/dd/yyyy, hh:mm:ss a');
  }
}
