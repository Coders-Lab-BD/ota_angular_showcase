import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  public setItem(key: string, data: any): void {
    if(key in localStorage)
      this.removeItem(key);
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getItem(key: string): any {
    let ret:any=undefined;
    try{
      let data=localStorage.getItem(key);
      if(data!=undefined)
        ret=JSON.parse(data);
    }catch(exp){}
    return ret;
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
