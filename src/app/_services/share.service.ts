import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  longMonth:string[]=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  shortMonth:string[]=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  longWeekDays:string[]=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  shortWeekDays:string[]=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dateType:string="gmt";
  constructor() { }

  public getRandomNumber(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  public getDbToBd(date:string):string
  {
    let returnDate:string='';
    try{
      if(date.indexOf('-')>0)
      {
        returnDate=date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0];
      }
    }catch(exp){}
    return returnDate;
  }
  public getBdToDb(date:string):string
  {
    let returnDate:string='';
    try{
      if(date.indexOf('-')>0)
      {
        returnDate=date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0];
      }
    }catch(exp){}
    return returnDate;
  }
  // padLeft('1','0',2) = 01
  public padLeft(text:string, padChar:string, size:number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
  }
  public getDayNameLong(dateStr:string,type:string=""):string{
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=this.longWeekDays[d.getDay()];
      if(type==this.dateType)
      {
        ret=this.longWeekDays[d.getUTCDay()];
      }
    }catch(exp){}
    return ret;
  }
  public getDayNameShort(dateStr:string,type:string=""):string{
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=this.shortWeekDays[d.getDay()];
      if(type==this.dateType)
      {
        ret=this.shortWeekDays[d.getUTCDay()];
      }
    }catch(exp){}
    return ret;
  }
  public getMonthShort(dateStr:string,type:string=""):string{
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=this.shortMonth[d.getMonth()];
      if(type==this.dateType)
      {
        ret=this.shortMonth[d.getUTCMonth()];
      }
    }catch(exp){}
    return ret;
  }
  public getMonthNum(dateStr:string,type:string=""):number{
    var ret=0;
    try{
      var d=this._cdate(dateStr);
      ret=d.getMonth();
      if(type==this.dateType)
      {
        ret=d.getUTCMonth();
      }
    }catch(exp){}
    return ret+1;
  }
  public getMonthLong(dateStr:string,type:string=""):string{
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=this.longMonth[d.getMonth()];
      if(type==this.dateType)
      {
        ret=this.longMonth[d.getUTCMonth()];
      }
    }catch(exp){

    }
    return ret;
  }
  public getYearShort(dateStr:string,type:string=""):string{
    let ret="";
    try{
      var d=this._cdate(dateStr);
      // ret=d.getFullYear().toString().substr(-2);
      ret=d.getFullYear().toString();
      if(type==this.dateType)
      {
        // ret=d.getUTCFullYear().toString().substr(-2);
        ret=d.getUTCFullYear().toString();
      }
    }catch(exp){}
    return ret;
  }
  public getYearLong(dateStr:string="",type:string=""):string{
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=d.getFullYear().toString();
      if(type==this.dateType)
      {
        ret=d.getUTCFullYear().toString();
      }
    }catch(exp){}
    return ret;
  }
  public getMonth(dateStr:string="",type:string=""):string
  {
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=(d.getMonth()+1).toString();
      if(type==this.dateType)
      {
        ret=(d.getUTCMonth()+1).toString();
      }
    }catch(exp){}
    return ret;
  }
  public getDay(dateStr:string="",type:string=""):string
  {
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=d.getDate().toString();
      if(type==this.dateType)
      {
        ret=d.getUTCDate().toString();
      }
    }catch(exp){}
    return ret;
  }
  public getHour(dateStr:string="",type:string=""):string
  {
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=d.getHours().toString();
      if(type==this.dateType)
      {
        ret=d.getUTCHours().toString();
      }
    }catch(exp){}
    return ret;
  }
  public getMinute(dateStr:string="",type:string=""):string
  {
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=d.getMinutes().toString();
      if(type==this.dateType)
      {
        ret=d.getUTCMinutes().toString();
      }
    }catch(exp){}
    return ret;
  }
  public getSecond(dateStr:string="",type:string=""):string
  {
    let ret="";
    try{
      var d=this._cdate(dateStr);
      ret=d.getSeconds().toString();
      if(type==this.dateType)
      {
        ret=d.getUTCSeconds().toString();
      }
    }catch(exp){}
    return ret;
  }
  private _cdate(dateStr:any):Date
  {
    var d=new Date();
    try{
      if(dateStr!="" && dateStr!=undefined)
      {
        d=new Date(dateStr);
      }
    }catch(exp){}
    return d;
  }
  public removeList(id: any,list:any[]): any {
    return list.filter(item => item != id);
  }
  public getAmPm(hrs:any,min:any):any
  {
    let ret="";
    try{
      let a_p = "";
      if (hrs < 12)
        a_p = "AM";
      else
        a_p = "PM";
      if (hrs == 0)
        hrs = 12;
      if (hrs > 12)
        hrs = hrs - 12;
      ret=this.padLeft(hrs,'0',2) + ":" + this.padLeft(min,'0',2) + " " + a_p;
    }catch(exp){}
    return ret;
  }
  public amountShowWithCommas(number:any) {
    // try{
    // var parts = number.toString().split(".");
    // return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }catch(exp){}
    // return "";
    const parsedAmount = parseFloat(number);

    if (!isNaN(parsedAmount)) {
      const formattedAmount = parsedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formattedAmount;
    } else {
      return 'Invalid Amount';
    }
  }
  public amountShowWithCommasNoFrac(number:any) {
    const parsedAmount = parseFloat(number);

    if (!isNaN(parsedAmount)) {
      const formattedAmount = parsedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return formattedAmount;
    } else {
      return 'Invalid Amount';
    }
  }
  public domesticamountShowWithCommas(number:any,numb: any) {
    try{
      var num = number + numb
      var parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }catch(exp){}
    return "";
  }
  public toCapital(str:string)
  {
    return str.toUpperCase();
  }
  public toCapitalize(str:string)
  {
    const words = str.split(' ');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
  }
  public getOnlyNumber(str:any):number
  {
    let ret:number=0;
    try{
      if(str==undefined || str=="")
      {
        return ret;
      }
      let data=str.replace(/\D/g, "");
      if(!this.isNullOrEmpty(data))
      {
        ret=parseInt(data);
      }
    }catch(exp){}
    return ret;
  }
  public isNumber(str:any):boolean
  {
    try{
      var filter = /^\d+\.?\d*$/;
      return filter.test(str);
    }catch(exp){}
    return false;
  }
  public getOnlyAmount(str:any):number
  {
    let ret:number=0;
    try{
      if(str==undefined || str=="")
      {
        return ret;
      }
      ret=parseFloat(str.replace(/^[A-Za-z\!\@\#\$\%\^\&\*\)\(+\=\_-]+$/g, ""));
    }catch(exp){}
    return ret;
  }
  public number(e:any):any {
    try{
      e = e || window.event;
    var charCode = e.which ? e.which : e.keyCode;
    return /\d/.test(String.fromCharCode(charCode));
    }catch(exp)
    {

    }
  }
  public amount(evt:any):any {
      try{
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode != 46 && (charCode < 48 || charCode > 57)))
            return false;
        return true;
      }catch(exp)
      {
      }
  }
  //validatePhone('8801819400400','BD',true)=>true
  public validatePhone(phone:any,region:any,phonePrefix:boolean=false) {
    var filter = /(^(01){1}[3456789]{1}(\d){8})$/;
    try{
      switch(region)
      {
        case 'BD':case 'bd':
          filter=/(^(01){1}[3456789]{1}(\d){8})$/;
          if(phonePrefix)
          {
            filter = /(^(\88|0088)?(01){1}[3456789]{1}(\d){8})$/;
          }
          break;
      }
      if (filter.test(phone)) {
          return true;
      }
    }catch(exp)
    {

    }
    return false;
  }
  //validateEmail('sarmon1997@protonmail.com')=>true
  public validateEmail(email:any):any {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    try{
      return re.test(email);
    }catch(exp)
    {

    }
  }
  amountCommaWithDecimal(event:any,id:any,decimal:any):any
  {
    id="#"+id;
    try{
      if(!this.amount(event))
      {
        return false;
      }
      var val = document.querySelector(id).value;
      if (val != undefined) {
          val = val.replace(/[^0-9\.]/g, '');
          if (val != "") {
              const valArr = val.split('.');
              valArr[0] = (parseInt(valArr[0], 10)).toLocaleString();

              val = valArr.join('.');
          }
      }
      if(val.toString().indexOf('.')>-1)
      {
        var temp=val.toString().split('.')[1];
        if(temp.length>decimal-1)
        {
          return false;
        }
      }
      document.querySelector(id).value=val;
    }catch(exp)
    {

    }
    return true;
  }
  amountWithDecimal(event:any,id:any,decimal:any):any
  {
    decimal=decimal-1<0?0:decimal;
    id="#"+id;
    try{
      if(this.amount(event))
      {
        var val=document.querySelector(id).value;
        if(val.toString().indexOf('.')>-1)
        {
          var temp=val.toString().split('.')[1];
          if(temp.length>decimal-1)
          {
            return false;
          }
        }
      }
    }catch(exp){}
  }
  amountWithComma(id:any)
  {
    id="#"+id;
    try{
      var val = document.querySelector(id).value;
      if (val != undefined) {
          val = val.replace(/[^0-9\.]/g, '');
          if (val != "") {
              const valArr = val.split('.');
              valArr[0] = (parseInt(valArr[0], 10)).toLocaleString();

              val = valArr.join('.');
          }
      }
      document.querySelector(id).value=val;
    }catch(exp)
    {
    }
  }
  public getAgeFull(birthDate:any, toDate:any):any {
    if (!isNaN(birthDate) || !isNaN(toDate)) {
        return "";
    }
    let ret:string="";
    try{
      var birthdate = birthDate;
      var senddate = toDate;
      var x = birthdate.split("-");
      var y = senddate.split("-");
      var bdays = x[0];
      var bmonths = x[1];
      var byear = x[2];
      var sdays = y[0];
      var smonths = y[1];
      var syear = y[2];
      if (sdays < bdays) {
          sdays = parseInt(sdays) + 30;
          smonths = parseInt(smonths) - 1;
          var fdays = sdays - bdays;
      }
      else {
          var fdays = sdays - bdays;
      }
      if (smonths < bmonths) {
          smonths = parseInt(smonths) + 12;
          syear = syear - 1;
          var fmonths = smonths - bmonths;
      }
      else {
          var fmonths = smonths - bmonths;
      }
      var fyear = syear - byear;
      ret=fyear + 'Y. ' + fmonths + 'M. ' + fdays + 'D';
    }catch(exp)
    {

    }
    return ret;
  }
  public getTimeDifference(start:any,end:any):any
  {
    try{
      start = start.split(":");
      end = end.split(":");
      let fromHour=start[0],fromMinute=start[1];
      let toHour=end[0],toMinute=end[1];
      var startDate = new Date(0, 0, 0, fromHour, fromMinute, 0);
      var endDate = new Date(0, 0, 0, toHour, toMinute, 0);
      var diff = endDate.getTime() - startDate.getTime();
      var hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      var minutes = Math.floor(diff / 1000 / 60);
      if (hours < 0)
         hours = hours + 24;

      return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    }catch(exp)
    {

    }
  }
  public getAddedTime(fromHour:number,fromMinute:number,toHour:number,toMinute:number):any
  {
    try{
      let hours=0,minutes=0;
      hours=fromHour+toHour;
      if(hours>24)
      {
        hours=0;
      }
      minutes=fromMinute+toMinute;
      if(minutes>59)
      {
        let remH=minutes/60;
        hours+=remH;
        minutes=minutes%60;
      }
      return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    }catch(exp)
    {

    }
  }
  public getAdded(fromHour:number,fromMinute:number):any
  {
    try{
      let hours=0,minutes=0;
      hours=fromHour;
      if(hours>24)
      {
        hours=0;
      }
      minutes=fromMinute;
      if(minutes>59)
      {
        let remH=minutes/60;
        hours+=remH;
        minutes=minutes%60;
      }
      return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    }catch(exp)
    {

    }
  }
  public distinctList(data:any):any
  {
    let output=[];
    try{
      var flags = [], l = data.length, i;
      for( i=0; i<l; i++) {
          if( flags[data[i].id]) continue;
          flags[data[i].id] = true;
          output.push(data[i]);
      }
      return output;
    }catch(exp){}
  }
  public isNullOrEmpty(val:any):boolean
  {
    let ret:boolean=false;
    if(val=="" || val==undefined)
    {
      ret=true;
    }
    return ret;
  }
  public getUserId()
  {
    return localStorage.getItem('uid');
  }
  public getUserName()
  {
    return localStorage.getItem('name');
  }
  public groupBy = <T>(array: T[], predicate: (v: T) => string) =>
  array.reduce((acc, value) => {
    (acc[predicate(value)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });
  public getMinimum(data:any):number
  {
    let ret:number=0;
    try{
      let min=data[0];
      for(let item of data)
      {
        if(min>item)
        {
          min=item;
        }
      }
      ret=min;
    }catch(exp){}
    return ret;
  }
  public getMaximum(data:any):number
  {
    let ret:number=0;
    try{
      let m=data[0];
      for(let item of data)
      {
        if(m<item)
        {
          m=item;
        }
      }
      ret=m;
    }catch(exp){}
    return ret;
  }
  public getRoundTime(hhmm:any):any
  {
    let ret=hhmm;
    try{
      if(hhmm.indexOf(':')>-1)
      {
        let data=hhmm.split(':');
        let hh=data[0];
        let mm=data[1];
        if(parseInt(mm)==59)
        {
          let hour=(parseInt(hh)+1);
          ret=this.padLeft(hour.toString(),'0',2)+":00";
        }
      }
    }catch(exp){}
    return ret;
  }
  public getMapToArray(data:any):any[]
  {
    let ret:any[]=[];
    try{
      for(let [key, value] of new Map<any,any>(Object.entries(data)))
      {
        ret.push({key:key,value:value});
      }
    }catch(exp){}
    return ret;
  }
  public isObjectEmpty(data:any):boolean
  {
    let ret:boolean=true;
    try{
      if (Object.keys(data).length>0) {
        ret=false;
      }
    }catch(exp){}
    return ret;
  }
  public addMore(data:any[]):number{
    let ret:number=0;
    for(let item of data)
    {
      try{
        ret+=Number(item);
      }catch(exp){
        ret+=0;
      }
    }
    return ret;
  }
  public Equals(value1:string,value2:string):boolean{
    let ret:boolean=false;
    try{
      if(value1.trim().toLowerCase()===value2.trim().toLowerCase())
      {
        ret=true;
      }
    }catch(exp){}
    return ret;
  }
  public addYearMonthDay(date:any,add:any,type:any):any
  {
    let ret:any=new Date();
    try{
      let day=date.toString().split('-')[2];
      let month=date.toString().split('-')[1];
      let year=date.toString().split('-')[0];
      switch(type.toString().toLowerCase())
      {
        case 'day':
          ret=new Date(year,month,day);
          ret.setDate(ret.getDate()+parseInt(add));
        break;
        case 'month':
          ret=new Date(year,month,day);
          ret.setDate(ret.getMonth()+parseInt(add));
        break;
        case 'year':
          ret=new Date(year,month,day);
          ret.setDate(ret.getFullYear()+parseInt(add));
        break;
        default:
          ret=new Date(year,month,day);
        break;
      }
    }catch(exp){}
    return ret;
  }
  public setDate(year:number=0,month:number=0,day:number=0,dateStr:string=""):Date
  {
    let ret=new Date();
    try{
      let date=new Date();
      if(!this.isNullOrEmpty(dateStr))
      {
        date=new Date(dateStr);
      }
      ret=new Date(date.getFullYear()+year,date.getMonth()+month,date.getDate()+day);
    }catch(exp){}
    return ret;
  }
  public getFlatPickDate(date:string):string
  {
    let ret:string="";
    try{
      ret=this.padLeft(this.getDay(date),'0',2)+"."+
      this.padLeft(this.getMonth(date),'0',2)+"."+
      this.getYearLong(date);
    }catch(exp){}
    return ret;
  }
  public getFlatPickDateFromDate(date:Date):string
  {
    let ret:string="";
    let text = date.toString();
    try{
      ret=this.padLeft(date.getDate()+"",'0',2)+"."+
      this.getMonthNum(text)+"."+date.getFullYear();
    }catch(exp){}
    return ret;
  }
  public getTwoDecimalPoint(amount: any) {

    // const integerPart: any = Math.floor(amount);
    // console.log(Math.ceil(23.3456));
    const parsedAmount = parseFloat(amount);

    if (!isNaN(parsedAmount)) {
      const formattedAmount = parsedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formattedAmount;
    } else {
      return 'Invalid Amount';
    }
  }
  getDateBeforeNDays(baseDate: string, numberOfDays: number): Date {
    const date = new Date(baseDate);
    const resultDate = new Date(date);
    resultDate.setDate(date.getDate() - numberOfDays);
    return resultDate;
  }

}
