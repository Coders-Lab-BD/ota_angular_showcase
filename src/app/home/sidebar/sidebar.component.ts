import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'aside[app-sidebar]',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  url: any;
  menu: any;
  menuHtml: any;
  amount!: string;
  agencyName!: string;
  agencyImg!: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.url = this.router.url;
    this.authService.getSideMenu().subscribe(data => {
      // console.log(data);
      const Menu = data.menu;
      this.amount = data.amount;
      data.agency.forEach((value: any, index: any) => {
        this.agencyName = value.nvAgencyName;
        this.agencyImg = value.vAgencyPhoto;
      });
      this.menu = Menu;
      // this.menu = Menu.filter((x: { nvMenuName: string; })=>x.nvMenuName!="Dashboard");
    }, error => {
      console.log(error);
    });
  }

  // hello() {
  //   const panels = document.querySelectorAll('.collapse');

  //   panels.forEach(panel => {
  //       panel.classList.remove('show');
  //   })
  // }
}
