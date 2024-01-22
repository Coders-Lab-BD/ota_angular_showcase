import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from '../home.component';

declare var $: any;


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ul[sidebarmenu]',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  @Input() sidebarmenu: any;
  constructor(private router: Router, private homeComponent: HomeComponent) { }
  ngOnInit() {
    // this.iconToggle('');
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    const menu = document.getElementsByName('mainParent')[0];
    const targets = menu.getElementsByTagName('a');
    for (let i = 0; i < targets.length; i ++) {
      if (targets[i].pathname === this.router.url) {
        this.homeComponent.AddClass(targets[i] as HTMLElement);
        break;
      }
    }
  }

  iconToggle(id:any) {
    // console.log(id);
    // const icon = document.getElementById(id);
    // icon?.addEventListener('click', (e) => {
    //   e.preventDefault();
    //    alert("clicked");
    // })

    let icon = $("#"+id);
    // console.log(icon);
    // icon.click(function () {
    //   alert("a");
    // })
    $("#" + id).click(function (event:any) {
      event.stopImmediatePropagation();
      // function body
      // console.log("a");
    });




    // const icon = document.querySelectorAll('.icon-toggle');
    // icon.forEach(i => {
    //   i.addEventListener('click', () => {
    //     console.log('a');

    //     let ic = i.children[1];
    //     if (ic.classList.contains('fa-angle-left')) {
    //       ic.classList.remove('fa-angle-left');
    //       ic.classList.add('fa-angle-down');
    //     }else {
    //       ic.classList.remove('fa-angle-down');
    //       ic.classList.add('fa-angle-left');
    //     }

    //   })
    // })
  }


  addShowClass() {
  const panels = document.querySelectorAll('.collapse');

    panels.forEach(panel => {
      panel.addEventListener('click', () => {
          this.removeAllShowClass();
          panel.classList.add('show');
      })
    })
  }

  removeAllShowClass() {
  const panels = document.querySelectorAll('.collapse');

    panels.forEach(panel => {
        panel.classList.remove('show');
    })
  }

  SetActive(event: any) {
    let targetElement = event.target as any;
    if (targetElement.nodeName !== 'A') {
      targetElement = targetElement.parentElement;
    }
    this.homeComponent.SetActive(targetElement);
  }

}
