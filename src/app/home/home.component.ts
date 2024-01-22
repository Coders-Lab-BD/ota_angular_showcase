import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  host: {'class': 'wrapper'},
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  router: string;

  constructor(public _router: Router) {
    this.router = _router.url;
   }

  ngOnInit() {
  }

  SetActive(targetElement: HTMLElement) {
    // let targetElement = event.target as HTMLElement;
    // if (targetElement.nodeName !== 'A') {
    //   targetElement = targetElement.parentElement;
    // }
    this.SetInactive();
    this.AddClass(targetElement);
  }

  SetInactive() {
    const menu = document.getElementsByName('mainParent')[0];
    const allMenuOpenTag = menu.getElementsByClassName('menu-open') as HTMLCollectionOf<Element>;
    for (let i = 0; i < allMenuOpenTag.length; i--) {
      const temp = allMenuOpenTag[i] as HTMLElement;
      this.RemoveClass(temp);
      i++;
    }
  }

  private RemoveClass(menuOpenTag: HTMLElement) {
    (menuOpenTag.childNodes[0] as HTMLElement).classList.remove('active');
    (menuOpenTag.childNodes[1] as HTMLElement).style.display = 'none';
    menuOpenTag.classList.remove('menu-open');

  }

  public AddClass(target: any) {
    const parent = target.parentElement.parentElement;
    const parentName = parent.attributes['name'].nodeValue;
    if (parentName === 'childParent') {
      const parentLi = parent.parentElement;
      parentLi.classList.add('menu-open');
      (parentLi.childNodes[1] as HTMLElement).style.display = 'block';
      (parentLi.childNodes[0] as HTMLElement).classList.add('active');
      this.AddClass(parent);
    }
  }

}
