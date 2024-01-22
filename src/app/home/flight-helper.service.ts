import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ShareService } from '../_services/share.service';
import { BookModel } from '../model/book-model.model';
import { FilterModel } from '../model/filter-model';
import { MarkuDiscountModel } from '../model/marku-discount-model.model';

@Injectable({
  providedIn: 'root'
})
export class FlightHelperService {
  public cmbAirport:any[]=[];
  readonly scheduleWidgetSelectColor="#E97017";
  readonly scheduleWidgetSelectTitleColor="#ffffff";
  readonly scheduleWidgetSelectPriceColor="#ffffff";
  readonly scheduleWidgetDeSelectColor="#ffffff";
  readonly scheduleWidgetDeSelectTitleColor="#656b82";
  readonly scheduleWidgetDeSelectPriceColor="#656b82";
  readonly domestic='gfnrPeT0B0WDCkFUmXnZLQ';
  readonly international='cMloGqGvQUmnuWxqEpPHcA';
  public allAirlinesId='0360FF29-9420-4DE2-8EDE-3491F258421E';
  public flightRouteType:string[]=["201AEDA8-F116-4176-85B3-78BF13BEFC0E","334B56AD-6980-4FD2-B088-F4F7A0ED321D"];
  readonly staticDate="1900-01-01";
  readonly formatYYYYMMDD="YYYY-MM-DD";
  readonly currency="BDT";//৳
  readonly AdultID="0A411685-6159-4FCB-A39F-07C3C921A16F";
  readonly ChildID="B6C0E526-B18C-4879-82A3-D9F06F758383";
  readonly InfantID="7643EF4A-AF56-4DEE-B571-70F1881D4A80";
  constructor(private shareService:ShareService,private authService: AuthService, ) {

   }
   getCountryCode(id:string,dataList:any[]):string
   {
     let ret:string="";
     try{
       var data=dataList.find(x=>x.code.toString().toLowerCase()==id.trim().toLowerCase());
       if(data!="" && data!=undefined)
       {
         ret=data.countrycode;
       }
     }catch(exp){}
     return ret;
   }
   getCountryName(id:string,dataList:any[]):string
   {
     let ret:string="";
     try{
       var data=dataList.find(x=>x.code.toString().toLowerCase()==id.toString().toLowerCase());
       if(data!="" && data!=undefined)
       {
         ret=data.countryname;
       }
     }catch(exp){}
     return ret;
   }
   _getGroupFareAmount(data:any):any
   {
     let ret:number=0;
     try{
       ret=data!=undefined && data!="" && !isNaN(data)?data:0;
     }catch(exp){}
     return ret;
   }
   _getGroupPassengerTotalFare(data:any,passenger:any):any
   {
     let ret:any="";
     try{
       for(let item of data)
       {
         if(item.passengerInfo.passengerType.indexOf(passenger)>-1)
         {
           ret=item.passengerInfo.passengerTotalFare;
         }
       }
     }catch(exp){}
     return ret;
   }
   _getGroupPassengerEquivalent(data:any,passenger:any):number
   {
     let ret:number=0;
     try{
       let dataInfo=this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data),passenger).equivalentAmount;
       if(dataInfo!=undefined && dataInfo!="")
       {
         ret=parseInt(dataInfo);
       }
     }catch(exp){}
     return ret;
   }
   _getGroupPassengerTax(data:any,passenger:any):number
   {
     let ret:number=0;
     try{
       let dataInfo=this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data),passenger).totalTaxAmount;
       if(dataInfo!=undefined && dataInfo!="")
       {
         ret=parseInt(dataInfo);
       }
     }catch(exp){}
     return ret;
   }
   _getGroupPassengerTotal(data:any,passenger:any):number
   {
     let ret:number=0;
     try{
       let dataInfo=this._getGroupPassengerTotalFare(this._getGroupPassengerInfoList(data),passenger).totalFare;
       if(dataInfo!=undefined && dataInfo!="")
       {
         ret=parseInt(dataInfo);
       }
     }catch(exp){}
     return ret;
   }
   _getGroupPassengerInfoList(data:any):any
   {
     let ret:any="";
     try{
       ret=data.itineraries[0].pricingInformation[0].fare.passengerInfoList;
     }catch(exp){}
     return ret;
   }
   _getRevalidatePrice(data:any,passenger:any,type:any):number
  {
    let ret:number=0;
    try{
      for(let item of data)
      {
        switch(passenger.toString().trim().toLowerCase())
        {
          case 'adult':
            if(item.passengerInfo.passengerType.toString().indexOf("ADT")>-1)
            {
              switch(type.toString().trim().toLowerCase())
              {
                case 'base':
                  ret=item.passengerInfo.passengerTotalFare.equivalentAmount;
                  break;
                case 'tax':
                  ret=item.passengerInfo.passengerTotalFare.totalTaxAmount;
                  break;
                case 'total':
                  ret=item.passengerInfo.passengerTotalFare.totalFare;
                  break;
                default:
                  break;
              }
            }
            break;
          case 'child':
            if(item.passengerInfo.passengerType.indexOf("C")>-1)
            {
              switch(type.toString().toLowerCase())
              {
                case 'base':
                  ret=item.passengerInfo.passengerTotalFare.equivalentAmount;
                  break;
                case 'tax':
                  ret=item.passengerInfo.passengerTotalFare.totalTaxAmount;
                  break;
                case 'total':
                  ret=item.passengerInfo.passengerTotalFare.totalFare;
                  break;
                default:
                  break;
              }
            }
            break;
          case 'infant':
            if(item.passengerInfo.passengerType.indexOf("INF")>-1)
            {
              switch(type.toString().toLowerCase())
              {
                case 'base':
                  ret=item.passengerInfo.passengerTotalFare.equivalentAmount;
                  break;
                case 'tax':
                  ret=item.passengerInfo.passengerTotalFare.totalTaxAmount;
                  break;
                case 'total':
                  ret=item.passengerInfo.passengerTotalFare.totalFare;
                  break;
                default:
                  break;
              }
            }
            break;
          default:
            break;
        }
      }
    }catch(exp){}
    return ret;
  }

   _getPassengerTypeId(code:any,data:any[]):any
  {
    let ret:any="";
    try{

      for(let item of data)
      {
        if(item.text.toString().substring(0,1).toLowerCase()==code.toString().toLowerCase().substring(0,1))
        {
          ret=item.id;
        }
      }
    }catch(exp){}
    return ret;
  }
   _getGenderName(id:any,data:any[]):any
  {
    let ret:string="F";
    try{
      if(data.includes(id))
      {
        ret="M";
      }
    }catch(exp)
    {
    }
    return ret;
  }
  _getSSRCode(id:any,data:any[]):any
  {
    let ret:string="";
    try{
      for(let item of data)
      {
        if(item.id.toString().toLowerCase()==id.toString().toLowerCase())
        {
          ret=item.text.toString().split('-')[0].trim();
        }
      }
    }catch(exp){}
    return ret;
  }
  _getSSRName(id:any,data:any[]):any
  {
    let ret:string="";
    try{
      for(let item of data)
      {
        if(item.id.toString().toLowerCase()==id.toString().toLowerCase())
        {
          ret=item.text.toString().split('-')[1].trim();
        }
      }
    }catch(exp){}
    return ret;
  }
   setTitle(setId:any,title:any,first:any,last:any)
   {
     var t,f,l;
     if(title!="" && title!=undefined)
     {
       t=$('#'+title).find('option:selected').text();
     }
     if(first!="" && first!=undefined)
     {
       f=$("#"+first).val();
     }
     if(last!="" && last!=undefined)
     {
       l=$("#"+last).val();
     }
     $("#"+setId).text(t+" "+f+" "+l);
   }
   _removeValidText(id:any,val:any)
   {
     var item=$("#"+id).val();
     if(!this.shareService.isNullOrEmpty(item))
     {
       $("#"+val).css("display","none");
     }
   }
   _isRevalidatePrice(price1:any,price2:any):boolean
   {
     let ret:boolean=false;
     try{
       if(price1==undefined || price1=="")
       {
         price1=0;
       }
       if(price2==undefined || price2=="")
       {
         price2=0;
       }
       if(price1===price2)
       {
         ret=true;
       }
     }catch(exp){}
     return ret;
   }
   _setToUpper(id:any)
   {
     var name=$("#"+id).val();
     if(name!=undefined && name!="")
     {
       $("#"+id).val(this.shareService.toCapital(name.toString()));
     }
   }
   _setToCapital(id:any)
   {
     var name = $("#" + id).val();
     if(name!=undefined && name!="")
     {
       $("#"+id).val(this.shareService.toCapitalize(name.toString()));
     }
   }
   _changeToDateTime(date:any,time:any):any
   {
     try{
       if(!this.shareService.isNullOrEmpty(date) && !this.shareService.isNullOrEmpty(time))
       {
        let dateTime: Date = new Date();
        dateTime.setDate(date.split('-')[2]);
        dateTime.setMonth(date.split('-')[1]);
        dateTime.setFullYear(date.split('-')[0]);
        dateTime.setHours(time.split(':')[0]);
        dateTime.setMinutes(time.split(':')[1]);
        return dateTime;
       }
       return new Date();
     }catch(exp){}
     return new Date();
   }
   getSelectedFilterRoute(i:number,data:any[]):string
   {
     let ret:string="";
    try{
      ret=data[i].CityName;
    }catch(exp){}
    return ret;
   }
   getSelectedRouteHead(i:number,dataDept:any[],dataArr:any[]):string
   {
     let ret:string="";
    try{
      ret="Flights from "+dataDept[i].CityName+" to "+dataArr[i].CityName;
    }catch(exp){}
    return ret;
   }
   getMinimumPricePopularFilterRefundable(type:boolean,itemData:any[]):any
   {
     let ret:number=0;
     try{
       let data=itemData.filter(function(i, j) {
         return i.refundable==type;
       });
       let min=data[0].clientFareTotal;
       for(let item of data)
       {
         if(min>item.clientFareTotal)
         {
           min=item.clientFareTotal;
         }
       }
       ret=min;
     }catch(exp){}
     return ret;
   }
   getTotalPopularFilterRefundable(type:boolean,itemData:any[]):any
   {
     let ret:number=0;
     try{
       let data=itemData.filter(function(i, j) {
         return i.refundable==type;
       });
       for(let item of data)
       {
         ret+=1;
       }
     }catch(exp){}
     return ret;
   }
   getDepCityName(obj:string,airportData:any):string{
    let ret:string="";
    try{
      if(airportData!=undefined && airportData!="")
      {

        for(let item of airportData.departure)
        {
          if(item.depCode.toString().toLowerCase()===obj.toString().toLowerCase())
          {
            ret=item.depCityName;
            break;
          }
        }
      }
    }catch(exp){}
    return ret;
  }
  getDepCountryName(obj:string,airportData:any):string{
    let ret:string="";
    try{
      if(airportData!=undefined && airportData!="")
      {
        for(let item of airportData.departure)
        {

          if(item.depCode.toString().toLowerCase()===obj.toString().toLowerCase())
          {
            ret=item.depCountryName;
            break;
          }
        }
      }
    }catch(exp){}
    return ret;
  }
  getArrCityName(obj:string,airportData:any):string{
    let ret:string="";
    try{
      if(airportData!="" && airportData!=undefined)
      {
        for(let item of airportData.arrival)
        {
          if(item.arrCode.toString().toLowerCase()===obj.toString().toLowerCase())
          {
            ret=item.arrCityName;
            break;
          }
        }
      }
    }catch(exp){}
    return ret;
  }
  getArrCountryName(obj:string,airportData:any):string{
    let ret:string="";
    try{
      if(airportData!="" && airportData!=undefined)
      {
        for(let item of airportData.arrival)
        {
          if(item.arrCode.toString().toLowerCase()===obj.toString().toLowerCase())
          {
            ret=item.arrCountryName;
            break;
          }
        }
      }
    }catch(exp){}
    return ret;
  }
   getAirlineLogo(obj:string,airlineData:any):string
  {
    let ret:string="";

    try{
      if(airlineData!=undefined && airlineData!="")
      {
        for(let item of airlineData)
        {
          if(item.code==obj)
          {
            ret=item.logo;
            break;
          }
        }
      }
    }catch(exp){console.log("Get Airlines Name:"+exp);}
    return ret;
  }
   getTotalAdultChildInfant(adult:number,child:number,infant:number):number
  {
    let ret:number=0;
    try{
      ret=adult+child+infant;
    }catch(exp)
    {

    }
    return ret;
  }
  getAirlineId(code:any,itemData:any[]):any
  {
    let ret:string="";
    try{
      let data=itemData.find(x=>x.id.toString().toLowerCase()==code.toString().toLowerCase());
      ret=data.masterId;
    }catch(exp){}
    return ret;
  }
  getAircraftId(code:any,itemData:any[]):any
  {
    let ret:string="";
    try{
      let data=itemData.find(x=>x.code.toString().toLowerCase()==code.toString().toLowerCase());
      ret=data.id;
    }catch(exp){}
    return ret;
  }
  getAirportId(code:any,itemData:any[]):any
  {
    let ret:string="";
    try{
      let data=itemData.find(x=>x.id.toString().toLowerCase()==code.toString().toLowerCase());
      ret=data.masterId;
    }catch(exp){}
    return ret;
  }
   getSeatsAvailability(id:any,itemData:any[]):number
   {
     let ret:number=0;
     try{
       let adult=this._passengerInfo(id,'ADT',itemData);
       let child=this._passengerInfo(id,'C',itemData);
       let infant=this._passengerInfo(id,'INF',itemData);
       if(adult!=undefined && adult!="")
       {
         adult=adult.fareComponents[0].segments[0].segment.seatsAvailable;
       }else{
         adult=0;
       }
       if(child!=undefined && child!="")
       {
         child=child.fareComponents[0].segments[0].segment.seatsAvailable;
       }else{
         child=0;
       }
       if(infant!=undefined && infant!="")
       {
         infant=infant.fareComponents[0].segments[0].segment.seatsAvailable;
       }else{
         infant=0;
       }
       ret=parseInt(adult)+parseInt(child)+parseInt(infant);
     }catch(exp){}
     return ret;
   }
   getMinimumPriceForTime(type:string,from:number,to:number,ap:any,itiID:any,leg:number,scheduleData:any[],itineryData:any[]):number
  {
    let ret=0;
    let retArr:number[]=[],min:number=0;
    try{
      let time=this._scheduleDescs(leg,scheduleData).departure.time;
      if(type.indexOf('arrival')>-1)
      {
        time=this._scheduleDescs(leg,scheduleData).arrival.time;
      }
      let hh=time.toString().trim().split(':')[0];
      let mm=time.toString().trim().split(':')[1];
      let a_p=this.shareService.getAmPm(hh,mm);
      let hours=a_p.toString().trim().split(':')[0];
      if(a_p.toString().indexOf(ap)>-1 && ap=='AM')
      {
        if(from==1 && to==6)
        {
          if(Number.parseInt(hours.toString().trim())==12 || (Number.parseInt(hours.toString().trim())>=1 && Number.parseInt(hours.toString().trim())<6))
          {
            retArr.push(this._totalFare(itiID,itineryData).totalPrice);
          }
        }
        if(from==6 && to==12)
        {
          if(Number.parseInt(hours.toString().trim())>=6 && Number.parseInt(hours.toString().trim())<12)
          {
            retArr.push(this._totalFare(itiID,itineryData).totalPrice);
          }
        }
      }
      if(a_p.toString().indexOf(ap)>-1 && ap=='PM')
      {
        if(from==1 && to==6)
        {
          if(Number.parseInt(hours.toString().trim())==12 || (Number.parseInt(hours.toString().trim())>=1 && Number.parseInt(hours.toString().trim())<6))
          {
            retArr.push(this._totalFare(itiID,itineryData).totalPrice);
          }
        }
        if(from==6 && to==12)
        {
          if(Number.parseInt(hours.toString().trim())>=6 && Number.parseInt(hours.toString().trim())<12)
          {
            retArr.push(this._totalFare(itiID,itineryData).totalPrice);
          }
        }
      }
      min=retArr[0];
      for(let item of retArr)
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
   _scheduleWidgetSelect(i:any,cap:string,way:number=-1)
   {
     let temp=way.toString();
     if(way==-1)
     {
      temp="";
     }
     console.log('#'+cap+'ScheduleBox'+temp+i);
     $('#'+cap+'ScheduleBox'+temp+i).css("background-color", this.scheduleWidgetSelectColor);
     $('#'+cap+'TitleId'+temp+i).css("color", this.scheduleWidgetSelectTitleColor);
     $('#'+cap+'PriceId'+temp+i).css("color", this.scheduleWidgetSelectPriceColor);
   }
   _scheduleWidgetDeSelect(i:any,cap:string,way:number=-1)
   {
    let temp=way.toString();
    if(way==-1)
    {
     temp="";
    }
     $('#'+cap+'ScheduleBox'+temp+i).css("background-color", this.scheduleWidgetDeSelectColor);
     $('#'+cap+'TitleId'+temp+i).css("color", this.scheduleWidgetDeSelectTitleColor);
     $('#'+cap+'PriceId'+temp+i).css("color", this.scheduleWidgetDeSelectPriceColor);
   }
   chkAlterBeforeAfter(type:string):string
  {
    let ret:string=type;
    if(type.indexOf("before")>-1)
    {
      ret="12AM-06AM".toLowerCase();
    }else if(type.indexOf("after")>-1)
    {
      ret="06PM-12AM".toLowerCase();
    }
    return ret;
  }
  getFlightNoMore(data:any[]):string
  {
    let ret:string="";
    try{
      for(let item of data)
      {
        ret+=item.airlineCode+item.airlineNumber+",";
      }
      ret=ret.substring(0,ret.length-1);
    }catch(exp){
      console.log(exp);
    }
    return ret;
  }
   isExistAppliedFilter(id:any,itemData:any[],type:any=""):boolean{
    let isExist:boolean=false;
    try{
      for(let item of itemData)
      {
        if(type!="" && type!=undefined)
        {
          if(
          item.title.toString().toLowerCase()==id.toString().toLowerCase()
          && item.schedule_class.toString().toLowerCase()==type.toString().toLowerCase() )
          {
            isExist=true;
          }
        }else{
          if(item.title==id)
          {
            isExist=true;
          }
        }
      }
    }catch(exp){}
    return isExist;
  }
   _isExistAppliedFilter(id:string,itemData:FilterModel[],type:string=""):boolean{
    let isExist:boolean=false;
    try{
      for(let item of itemData)
      {
        if(type!="" && type!=undefined)
        {
          if(
          item.Id.toString().toLowerCase()==id.toString().toLowerCase()
          && item.ScheduleClass.toString().toLowerCase()==type.toString().toLowerCase() )
          {
            isExist=true;
          }
        }else{
          if(item.Title==id)
          {
            isExist=true;
          }
        }
      }
    }catch(exp){}
    return isExist;
  }
   flightShowHideAction(id:any,flightDetailsWrap:any,
    flightDetailsShowHide:any,result_single_box:any,fareDetailsShowHide:any,
    fareDetailsWrap:any,isPadding:boolean=false)
  {
    if($(flightDetailsWrap+id).css('display') == 'block')
    {
      $(flightDetailsShowHide+id).text("View Flight Details");
      $(flightDetailsWrap+id).hide('slow');
      if(isPadding)
        $(result_single_box).css("paddingBottom","0px");
    }else{
      $(flightDetailsWrap+id).show('slow');
      $(flightDetailsShowHide+id).text("Hide Flight Details");

      $(fareDetailsShowHide+id).text("View Fare Details");
      $(fareDetailsWrap+id).hide('slow');
      if(isPadding)
        $(result_single_box).css("paddingBottom","10px");
    }
  }


  ReplaceParentheses(textWithParentheses:string) {
    var textWithoutParentheses = textWithParentheses.replace(/\(|\)/g, '');
    return textWithoutParentheses;
  }
  ReplaceSpace(textWithSpaces:string) {
    var textWithSpaces = textWithSpaces.replace(/\s/g, "").toLowerCase();
    return textWithSpaces;
  }

  flightShowAction(id:any,flightDetailsWrap:any,
    flightDetailsShowHide:any,result_single_box:any,isPadding:boolean=false)
  {
    if($(flightDetailsWrap+id).css('display') == 'block')
    {
      $(flightDetailsShowHide+id).text("View Flight Details");
      $(flightDetailsWrap+id).hide('slow');
      if(isPadding)
        $(result_single_box).css("paddingBottom","0px");
    }else{
      $(flightDetailsWrap+id).show('slow');
      $(flightDetailsShowHide+id).text("Hide Flight Details");
      if(isPadding)
        $(result_single_box).css("paddingBottom","10px");
    }
  }
  fareShowHideAction(id:any,flightDetailsWrap:any,
    flightDetailsShowHide:any,result_single_box:any,fareDetailsShowHide:any,
    fareDetailsWrap:any,isPadding:boolean=false)
  {
    if($(fareDetailsWrap+id).css('display') == 'block')
    {
      $(fareDetailsShowHide+id).text("View Fare Details");
      $(fareDetailsWrap+id).hide('slow');
      if(isPadding)
        $(result_single_box).css("paddingBottom","0px");
    }else{
      $(fareDetailsWrap+id).show('slow');
      $(fareDetailsShowHide+id).text("Hide Fare Details");

      $(flightDetailsShowHide+id).text("View Flight Details");
      $(flightDetailsWrap+id).hide('slow');
      if(isPadding)
        $(result_single_box).css("paddingBottom","10px");
    }
  }
  getCurrentFlightCode(id:any,itemData:any[]):string
  {
    let ret:string=id;
    try{
      for(let i=0;i<itemData.length;i++)
      {
        let marketing=itemData[i].carrier.marketing;
        let disclosure=itemData[i].carrier.disclosure;
        if((disclosure!=undefined && disclosure==id) || (marketing!=undefined && marketing==id))
        {
            ret=marketing;
            break;
        }
      }
    }catch(exp){}
    return ret;
  }

  _minimumRange(itemData:any[]):string
  {
    let ret:string="";
    try{
      let updatePrice=itemData[0].clientFareTotal;
      for(let i=1;i<itemData.length;i++)
      {
        let price=itemData[i].clientFareTotal;
        if(Number.parseFloat(price)<Number.parseFloat(updatePrice))
        {
          updatePrice=price;
        }
      }
      ret=updatePrice;
    }catch(exp){}
    return ret;
  }
  _maximumRange(itemData:any[]):string
  {
    let ret:string="";
    try{
      let updatePrice=itemData[0].clientFareTotal;
      for(let i=1;i<itemData.length;i++)
      {
        let price=itemData[i].clientFareTotal;
        if(Number.parseFloat(price)>Number.parseFloat(updatePrice))
        {
          updatePrice=price;
        }
      }
      ret=updatePrice;
    }catch(exp){}
    return ret;
  }

  _groupedDayMonthYear(data:any):string
  {
    let ret:string="";
    try{
      ret=this.shareService.getDayNameShort(data.departureDate)+", "+
      this.shareService.getMonthShort(data.departureDate)+" "+
      this.shareService.getDay(data.departureDate)+", "+
      this.shareService.getYearLong(data.departureDate);

    }catch(exp){}
    return ret;
  }
  _groupedTotalFare(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=this._groupedFare(ind,itemData).totalFare;
    }catch(exp){}
    return data;
  }
  _groupedFare(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=this._groupedPricingInfo(ind,itemData)[0].fare;
    }catch(exp){}
    return data;
  }
  _groupedPricingInfo(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=this._groupedItineraries(ind,itemData).pricingInformation;
    }catch(exp){}
    return data;
  }
  _groupedItineraries(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=itemData[ind].itineraries[0];

    }catch(exp){}
    return data;
  }
  _groupedLegDescriptions(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=this._groupDescription(ind,itemData).legDescriptions;
    }catch(exp){}
    return data;
  }
  _groupDescription(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=itemData[ind].groupDescription;

    }catch(exp){}
    return data;
  }
  _timeArrival(ind:any,itemData:any[]):string
  {
    let ret:string="";
    try{
      let data=this._arrival(ind,itemData).time;
      data=data.toString().split(':')[0]+':'+data.toString().split(':')[1];
      if(data!=undefined && data!="")
      {
        ret=data;
      }
    }catch(exp){}
    return ret;
  }
  _getStopData(data:any[]):string
  {
    let ret:string="";
    try{
      for(let item of data)
      {
        ret+=item.arrivalCity+",";
      }
      if(!this.shareService.isNullOrEmpty(ret))
      {
        ret=ret.substring(0,ret.length-1);
        if(ret.length>10)
        {
          ret=ret.substring(0,10)+"..";
        }
      }
    }catch(exp){}
    return ret;
  }
  _getLayTime(diff:string,hhmm:string):number
  {
    let ret:number=0;
    hhmm=hhmm.toString().toLowerCase();
    try{
      let flayHour=this.shareService.getOnlyNumber(diff);
      let flayMinute=0;
      if(diff.indexOf('m')>-1 && diff.indexOf('h')>-1)
      {
        let fdifData=diff.split(' ');
        flayHour=this.shareService.getOnlyNumber(fdifData[0]);
        flayMinute=parseInt(fdifData[1].toString().substring(0,fdifData[1].length-1));
      }else if(diff.indexOf('m')<0 && diff.indexOf('h')>-1)
      {
        flayHour=this.shareService.getOnlyNumber(diff);
      }else if(diff.indexOf('m')>-1 && diff.indexOf('h')<0)
      {
        flayMinute=this.shareService.getOnlyNumber(diff);
      }
      if(hhmm.indexOf("hour")>-1)
      {
        ret=flayHour;
      }else{
        ret=flayMinute;
      }
    }catch(exp){}
    return ret;
  }
  _differenceActual(gmt:any,utc:any):string
  {
    let ret:string="";
    try{
      let fromHour=parseInt(gmt.split(':')[0]);
      let fromMin=parseInt(gmt.split(':')[1]);
      let toHour=parseInt(utc.split(':')[0]);
      let toMin=parseInt(utc.split(':')[1]);
      let dif=this.shareService.getAddedTime(fromHour,fromMin,toHour,toMin);
      let hour=dif.toString().split(':')[0];
      let min=dif.toString().split(':')[1];

      hour=parseInt(hour.toString());
      min=parseInt(min.toString());
      if(parseInt(hour)>0 && parseInt(min)>0)
      {
        ret=hour+"h "+min+"m";
      }else if(parseInt(hour)>0 && parseInt(min)<=0)
      {
        ret=hour+"h";
      }else if(parseInt(hour)<=0 && parseInt(min)>0)
      {
        ret=min+"m";
      }
    }catch(exp){}
    return ret;
  }
  _timeDifference(ind:any,itemData:any[]):string
  {
    let ret:string="";

    try{
      let arr=this._timeArrival(ind,itemData);
      let dep=this._timeDeparture(ind,itemData);
      ret=this._difference(dep,arr);
    }catch(exp){}
    return ret;
  }
  _timeDifferenceActual1(legs:any,itemData:any[]):string {
    var td = "", data
    try{
         data = itemData.find( (x: { id: number; })=>x.id==legs).elapsedTime;
         console.log(data);
         let h = Math.floor(data/60);
         let m = data%60;
         td = h.toString() + 'h ' + m.toString() + 'm'
        return td;
    }
    catch (exp){
      return td="";
    }
  }
  _timeDifferenceGMT(dep:any,arr:any):string
  {
    let ret:string="";
    try{
      let fromHour=parseInt(dep.split(':')[0]);
      let fromMin=parseInt(dep.split(':')[1]);
      let toHour=parseInt(arr.split(':')[0]);
      let toMin=parseInt(arr.split(':')[1]);
      ret=this.getFlightDifferenceGMT(fromHour,fromMin,toHour,toMin);
    }catch(exp){}
    return ret;
  }
  _timeDifferenceUTC(dep:any,arr:any):string
  {
    let ret:string="";
    try{
      let fromExpr=dep.substring(0,1);
      let toExpr=arr.substring(0,1);
      dep=dep.substring(1);
      arr=arr.substring(1);
      let fromHour=parseInt(dep.split(':')[0]);
      let fromMin=parseInt(dep.split(':')[1]);
      let toHour=parseInt(arr.split(':')[0]);
      let toMin=parseInt(arr.split(':')[1]);
      ret=this.getFlightDifferenceUTC(fromHour,fromMin,fromExpr,toHour,toMin,toExpr);
    }catch(exp){}
    return ret;
  }
  _difference(dep:any,arr:any):string
  {
    let ret:string="";
    try{
      let dif=this.shareService.getTimeDifference(dep,arr);
      let hour=dif.toString().split(':')[0];
      let min=dif.toString().split(':')[1];
      if(parseInt(hour)>0 && parseInt(min)>0)
      {
        ret=hour+"h "+min+"m";
      }else if(parseInt(hour)>0 && parseInt(min)<=0)
      {
        ret=hour+"h";
      }else if(parseInt(hour)<=0 && parseInt(min)>0)
      {
        ret=min+"m";
      }
    }catch(exp)
    {}
    return ret;
  }
  _terminalArrival(ind:any,itemData:any[]):string
  {
    let ret:string="";
    try{
      let data=this._arrival(ind,itemData).terminal;
      if(data!=undefined && data!="")
      {
        ret="Terminal "+data;
      }
    }catch(exp){}
    return ret;
  }
  _timeDeparture(ind:any,itemData:any[]):string
  {
    let ret:string="";
    try{
      let data=this._departure(ind,itemData).time;
      data=data.toString().split(':')[0]+':'+data.toString().split(':')[1];
      if(data!=undefined && data!="")
      {
        ret=data;
      }
    }catch(exp){}
    return ret;
  }
  _terminalDeparture(ind:any,itemData:any[]):string
  {
    let ret:string="";
    try{
      let data=this._departure(ind,itemData).terminal;
      if(data!=undefined && data!="")
      {
        ret="Terminal "+data;
      }
    }catch(exp){}
    return ret;
  }
  _departure(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._scheduleDescs(ind,itemData).departure;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _arrival(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._scheduleDescs(ind,itemData).arrival;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _airlinesName(ind:any,itemData:any[],airlineData:any[]):string
  {
    let ret:string="";
    try{
      let flightCode=this._carrier(ind,itemData).marketing;
      ret=this.getAirlineName(flightCode,airlineData);
      if(ret=="")
      {
        ret=this.getAirlineName(this._carrier(ind,itemData).disclosure,airlineData);
      }
    }catch(exp){}
    return ret;
  }
  _airlinesCode(ind:any,itemData:any[],airlineData:any[]):string
  {
    let ret:string="";
    try{
      let flightCode=this._carrier(ind,itemData).marketing;
      ret=this.getAirlineName(flightCode,airlineData);
      if(ret=="")
      {
        ret=this._carrier(ind,itemData).disclosure;
      }else{
        ret=this._carrier(ind,itemData).marketing;

      }
    }catch(exp){}
    return ret;
  }
  airlinesCode(ind:any,itemData:any[],airlineData:any[]):string
  {
    let ret:string="";
    try{
      let flightCode=this._carrier(ind,itemData).marketing;
      let aflightCode=this._carrier(ind,itemData).disclosure;
      if(aflightCode != null){
        ret="";
      }else{
        ret=this.getAirlineName(flightCode,airlineData);
      }
      if(ret=="")
      {
        ret=this._carrier(ind,itemData).disclosure;
      }else{
        ret=this._carrier(ind,itemData).marketing;
      }
    }catch(exp){}
    return ret;
  }
  _equipment(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._carrier(ind,itemData).equipment;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _carrier(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._scheduleDescs(ind,itemData).carrier;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoCabinWeight(type:any)
  {
    let data="";
    try{
      switch(type.toLowerCase())
      {
        case "c":
          data="9Kgs";
          break;
        default:
          data="7Kgs";
          break;
      }
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerCabinAdult(ind:any,itemData:any[],fareData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoCabinWeight(this._fareComponentAdult(ind,itemData,fareData).cabinCode);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerCabinChild(ind:any,itemData:any[],fareData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoCabinWeight(this._fareComponentChild(ind,itemData,fareData).cabinCode);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerCabinInfant(ind:any,itemData:any[],fareData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoCabinWeight(this._fareComponentInfant(ind,itemData,fareData).cabinCode);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsSegmentsAdult(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoFareComponentsAdult(ind,itemData)[0].segments[0].segment;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsSegmentsChild(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoFareComponentsChild(ind,itemData)[0].segments[0].segment;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsSegmentsInfant(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoFareComponentsInfant(ind,itemData)[0].segments[0].segment;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fareComponentDescs(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=itemData[ind];
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fareComponentAdult(ind:any,itemData:any[],fareData:any[]):any{
    var data="";
    try{
      let ref=this._passengerInfoFareComponentsAdult(ind,itemData)[this._passengerInfoAdult(ind,itemData).fareComponents.length-1].ref-1;
      data=this._fareComponentDescs(ref,fareData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fareComponentChild(ind:any,itemData:any[],fareData:any[]):any{
    var data="";
    try{
      let ref=this._passengerInfoFareComponentsChild(ind,itemData)[this._passengerInfoChild(ind,itemData).fareComponents.length-1].ref-1;
      data=this._fareComponentDescs(ref,fareData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _fareComponentInfant(ind:any,itemData:any[],fareData:any[]):any{
    var data="";
    try{
      let ref=this._passengerInfoFareComponentsInfant(ind,itemData)[this._passengerInfoInfant(ind,itemData).fareComponents.length-1].ref-1;
      data=this._fareComponentDescs(ref,fareData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _pieceOrKgsAdult(ind:any,itemData:any[],baggageData:any[]):any
  {
    var data="";
    try{
      data=this._passengerInfoBaggageAdult(ind,itemData,baggageData).pieceCount;
      if(data==undefined)
      {
        data=this._passengerInfoBaggageAdult(ind,itemData,baggageData).weight+" "+this._passengerInfoBaggageAdult(ind,itemData,baggageData).unit;
      }else{
        data=data+" pcs";
      }
    }catch(exp){}
    return data;
  }
  _pieceOrKgsChild(ind:any,itemData:any[],baggageData:any[]):any
  {
    var data="";
    try{
      data=this._passengerInfoBaggageChild(ind,itemData,baggageData).pieceCount;
      if(data==undefined)
      {
        data=this._passengerInfoBaggageChild(ind,itemData,baggageData).weight+" "+this._passengerInfoBaggageChild(ind,itemData,baggageData).unit;
      }else{
        data=data+" pcs";
      }
    }catch(exp){}
    return data;
  }
  _pieceOrKgsInfant(ind:any,itemData:any[],baggageData:any[]):any
  {
    var data="";
    try{
      data=this._passengerInfoBaggageInfant(ind,itemData,baggageData).pieceCount;
      if(data==undefined)
      {
        data=this._passengerInfoBaggageInfant(ind,itemData,baggageData).weight+" "+this._passengerInfoBaggageInfant(ind,itemData,baggageData).unit;
      }else{
        data=data+" pcs";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoBaggageAdult(ind:any,itemData:any[],baggageData:any[]):any{
    var data="";
    try{
      data=this._baggageAllowanceDescs(this._passengerInfoAdult(ind,itemData).baggageInformation[0].allowance.ref,baggageData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoBaggageChild(ind:any,itemData:any[],baggageData:any[]):any{
    var data="";
    try{
      data=this._baggageAllowanceDescs(this._passengerInfoChild(ind,itemData).baggageInformation[0].allowance.ref,baggageData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoBaggageInfant(ind:any,itemData:any[],baggageData:any[]):any{
    var data="";
    try{
      data=this._baggageAllowanceDescs(this._passengerInfoInfant(ind,itemData).baggageInformation[0].allowance.ref,baggageData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _baggageAllowanceDescs(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=itemData[ind-1];
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _passengerInfoFareComponentsAdult(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoAdult(ind,itemData).fareComponents;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsChild(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoChild(ind,itemData).fareComponents;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoFareComponentsInfant(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfoInfant(ind,itemData).fareComponents;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerTotalFare(ind:any,itemData:any[]):number
  {
    let ret=0;
    try{
      let a=this._passengerInfoTotalFareAdult(ind,itemData).totalPrice;
      let c=this._passengerInfoTotalFareChild(ind,itemData).totalPrice;
      let i=this._passengerInfoTotalFareInfant(ind,itemData).totalPrice;
      a=(a!=undefined && a!="")?a:0;
      c=(c!=undefined && c!="")?c:0;
      i=(i!=undefined && i!="")?i:0;
      ret=Number.parseInt(a)+Number.parseInt(c)+Number.parseInt(i);
    }catch(exp){}
    return ret;
  }
  _passengerInfoTotalFareAdult(ind:any,itemData:any[]):any{
    var data="0";
    try{
      data=this._passengerInfoAdult(ind,itemData).passengerTotalFare;
      if(data==undefined)
      {
        return "0";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoTotalFareChild(ind:any,itemData:any[]):any{
    var data="0";
    try{
      data=this._passengerInfoChild(ind,itemData).passengerTotalFare;
      if(data==undefined)
      {
        return "0";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoTotalFareInfant(ind:any,itemData:any[]):any{
    var data="0";
    try{
      data=this._passengerInfoInfant(ind,itemData).passengerTotalFare;
      if(data==undefined)
      {
        return "0";
      }
    }catch(exp){}
    return data;
  }

  _passengerInfoAdult(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfo(ind,'ADT',itemData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoChild(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfo(ind,'C',itemData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoInfant(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._passengerInfo(ind,'INF',itemData);
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
   _passengerInfo(ind:any,type:any,itemData:any[]):any{
    var data="";
    try{
      let i=0;
      for(let item of this._passengerInfoList(ind,itemData))
      {
        if(item.passengerInfo.passengerType.toString().indexOf(type)>-1 || item.passengerInfo.passengerType.toString().indexOf("ADT")>-1)
        {
          data=item.passengerInfo;
        }else{
          if(item.passengerInfo.passengerType.toString().indexOf(type)>-1)
          {
            data=item.passengerInfo;
          }
        }
        i+=1;
      }
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _totalFare(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._fare(ind,itemData).totalFare;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _passengerInfoList(ind:any,itemData:any[]):any
  {
    var data=[];
    try{
      data=this._fare(ind,itemData).passengerInfoList;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){
      console.log(exp);
    }
    return data;
  }
  _fare(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=this._pricingInfo(ind,itemData)[0].fare;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }

  _scheduleDescs(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=itemData[ind];
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _schedules(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=this._legDescs(ind,itemData).schedules;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  getMinimumPriceForStopCount(count:any,itemData:any[],scheduleData:any[]):any{
  let ret="";
  try{
    ret=this._totalFare(0,itemData).totalPrice;
    let ind=0;
    for(let item of itemData)
    {
      if(this._scheduleDescs(item.legs[0].ref-1,scheduleData).stopCount==count)
      {
        if(ret>this._totalFare(ind,itemData).totalPrice)
        {
          ret=this._totalFare(ind,itemData).totalPrice;
        }
      }
      ind++;
    }
  }catch(exp){}
  return ret;
  }
  _legDescs(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=itemData[ind];
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _itineryLegs(ind:any,itemData:any[]):any
  {
    var data="";
    try{
      data=itemData[ind].legs;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
  _pricingInfo(ind:any,itemData:any[]):any{
    var data="";
    try{
      data=itemData.find((x: { id: number; })=>x.id===ind).pricingInformation;
      if(data==undefined)
      {
        return "";
      }
    }catch(exp){}
    return data;
  }
   public getAdjustmentDate(date:any,adj:any,adjSegement:any=undefined):any{
    let ret:any="";
    try{
      if(adj==undefined || adj=="")
      {
        adj=0;
      }
      if(adjSegement==undefined || adjSegement=="")
      {
        adjSegement=0;
      }
      adj+=adjSegement;
      let addedDate=moment(date).add(adj, 'days');
      ret=addedDate;
    }catch(exp){}
    return ret;
  }
  getAirlineName(obj:string,itemData:any):string
{
  let ret:string="";

  try{
    if(itemData!=undefined && itemData!="")
    {
      for(let item of itemData)
      {
        if(item.code==obj)
        {
          ret=item.name;
          break;
        }
      }
    }
  }catch(exp){console.log("Get Airlines Name:"+exp);}
  return ret;
}
  public getAirportData():any[]
  {
    try{
      var data=JSON.parse(localStorage.getItem("airportInfo")!);
    }catch(exp)
    {
    }
    return data;
  }
  public getLocalFlightSearch():any
  {
    try{
      var data=JSON.parse(localStorage.getItem('loaderData')!);
    }catch(exp)
    {
    }
    return data;
  }
  public getLocalFlightSearchDateChange():any
  {
    try{
      var data=JSON.parse(localStorage.getItem('bookingConfirmation')!);
    }catch(exp)
    {
    }
    return data;
  }
  public getLocalFlightSearchDateChangeFlight():any
  {
    try{
      var data=JSON.parse(localStorage.getItem('flightIndi')!);
    }catch(exp)
    {
    }
    return data;
  }
  getCityNameById(id:string):string
  {
    let ret:string="";
    try{
      var data=this.getAirportData().find(x=>x.masterId.toString().toLowerCase()==id.toString().toLowerCase());
      if(data!="" && data!=undefined)
      {
        ret=data.cityname;
      }
    }catch(exp){}
    return ret;
  }
  public _typeWiseIdMarkup(data:MarkuDiscountModel[],airlineCode:string):any
  {
    let ret:any="";
    try{
      for(let item of data)
      {
        if(item.AirlineCode.indexOf(airlineCode)>-1)
        {
          switch(item.Type)
          {
            case 'Base':
              ret='05D14950-C662-49C6-808C-0B062864D424';
              break;
            case 'Tax':
              ret='769BF25A-F0BD-488C-86E2-D2A945FCF205';
              break;
            case 'Total':
              ret='C16D24FC-220F-4462-82DB-1E0FB3EAC9D0';
              break;
          }
        }
      }
    }catch(exp){}
    return ret;
  }
  public _typeWiseMarkupPercent(data:MarkuDiscountModel[],airlineCode:string):any
  {
    let ret:any="";
    try{
      for(let item of data)
      {
        if(item.AirlineCode.indexOf(airlineCode)>-1)
        {
          switch(item.Type)
          {
            case 'Base':
              ret=item.Percent;
              break;
            case 'Tax':
              ret=item.Percent;
              break;
            case 'Total':
              ret=item.Percent;
              break;
          }
        }
      }
    }catch(exp){}
    return ret;
  }
  public _typeWiseIdDiscount(data:MarkuDiscountModel[],airlineCode:string):any
  {
    let ret:any="";
    try{
      for(let item of data)
      {
        if(item.AirlineCode.indexOf(airlineCode)>-1)
        {
          switch(item.Type)
          {
            case 'Base':
              ret='0433B596-6A8F-4409-ACF3-6D73E34B945A';
              break;
            case 'Tax':
              ret='80399BAC-7328-4FA9-8126-8C1BA5A6A5B7';
              break;
            case 'Total':
              ret='C7BA97C6-06EF-43E2-9D59-900027C51C8B';
              break;
          }
          break;
        }
      }
    }catch(exp){}
    return ret;
  }
  public _typeWiseDiscountPercent(data:MarkuDiscountModel[],airlineCode:string):any
  {
    let ret:any="";
    try{
      for(let item of data)
      {
        if(item.AirlineCode.indexOf(airlineCode)>-1)
        {
          switch(item.Type)
          {
            case 'Base':
              ret=item.Percent;
              break;
            case 'Tax':
              ret=item.Percent;
              break;
            case 'Total':
              ret=item.Percent;
              break;
          }
        }
      }
    }catch(exp){}
    return ret;
  }
  public __idWiseTypeMarkup(id:string):any
  {
    let ret:any="";
    try{
      switch(id)
      {
        case '05D14950-C662-49C6-808C-0B062864D424':
          ret='Base';
          break;
        case '769BF25A-F0BD-488C-86E2-D2A945FCF205':
          ret='Tax';
          break;
        case 'C16D24FC-220F-4462-82DB-1E0FB3EAC9D0':
          ret='Total';
          break;
      }
    }catch(exp){}
    return ret;
  }
  public __typeWiseIdMarkup(type:string):any
  {
    let ret:any="";
    try{
      switch(type)
      {
        case 'Base':
          ret='05D14950-C662-49C6-808C-0B062864D424';
          break;
        case 'Tax':
          ret='769BF25A-F0BD-488C-86E2-D2A945FCF205';
          break;
        case 'Total':
          ret='C16D24FC-220F-4462-82DB-1E0FB3EAC9D0';
          break;
      }
    }catch(exp){}
    return ret;
  }
  public __idWiseTypeDiscount(id:string):any
  {
    let ret:any="";
    try{
      switch(id)
      {
        case '0433B596-6A8F-4409-ACF3-6D73E34B945A':
          ret='Base';
          break;
        case '80399BAC-7328-4FA9-8126-8C1BA5A6A5B7':
          ret='Tax';
          break;
        case 'C7BA97C6-06EF-43E2-9D59-900027C51C8B':
          ret='Total';
          break;
      }
    }catch(exp){}
    return ret;
  }
  public __typeWiseIdDiscount(type:string):any
  {
    let ret:any="";
    try{
      switch(type)
      {
        case 'Base':
          ret='0433B596-6A8F-4409-ACF3-6D73E34B945A';
          break;
        case 'Tax':
          ret='80399BAC-7328-4FA9-8126-8C1BA5A6A5B7';
          break;
        case 'Total':
          ret='C7BA97C6-06EF-43E2-9D59-900027C51C8B';
          break;
      }
    }catch(exp){}
    return ret;
  }
  public _typeOfMarkupDiscount(data:any,airlineCode:string):any
  {
    let ret:any="";
    try{
      for(let item of data)
      {
        if(item.airlineCode.toString().toLowerCase()==airlineCode.toString().toLowerCase())
        {
          ret=item.type;
        }
      }
    }catch(exp){}
    return ret;
  }
  isInstant(data:BookModel[],airlineCode:string):boolean
  {
    let ret:boolean=false;
    for(let item of data)
    {
      if(item.AirlineCode.toString().indexOf(airlineCode)>-1)
      {
        if(item.isInstant)
        {
          ret=true;
        }
        break;
      }
    }
    return ret;
  }
  getFlightStopId(type:any):string
  {
    let ret:string="";
    console.log("type:"+type);
    try{
      switch(parseInt(type))
      {
        case 0:
          ret="02BA18E3-184A-4FB3-8C6E-C48A8EDF56DA";
          break;
        case 1:
          ret="48E4B5A1-B85D-4EA7-AFB1-714528B34D49";
          break;
        case 2:
          ret="E9435415-241B-457A-9120-99941F67184A";
          break;
        default:
          break;
      }
    }catch(exp){}
    return ret;
  }

  getFareTypeId(type:any):string
  {
    let ret:string="";
    try{
      switch(parseInt(type))
      {
        case 1:
          ret="34BC9B43-75E7-49BF-B1B5-9D65441BAF31";
          break;
        case 2:
          ret="AAF637CB-ACDA-43DF-ABAE-88B0FCDFB8B7";
          break;
        default:
          break;
      }
    }catch(exp){}
    return ret;
  }

  getCabinTypeId(type:string):string
  {
    let ret:string="";
    try{
      switch(type)
      {
        case "C":case "c":
          ret="247DF2F1-7FAA-4054-AB89-28D9277B472C";
          break;
        case "Y":case "y":
          ret="3477EFC4-5C2D-4A76-A570-D8C48D18EDD5";
          break;
        case "J":case "j":
          ret="C08A0D00-F215-4E29-BCAB-A844C4A88169";
          break;
        case "F":case "f":
          ret="69593E4F-1B40-4E67-A326-A0D0D13E2C7F";
          break;
        default:
          break;
      }
    }catch(exp){}
    return ret;
  }
  getCabinTypeCodeById(type:string):string
  {
    let ret:string="";
    try{
      switch(type)
      {
        case "247DF2F1-7FAA-4054-AB89-28D9277B472C":
          ret="C";
          break;
        case "3477EFC4-5C2D-4A76-A570-D8C48D18EDD5":
          ret="Y";
          break;
        case "C08A0D00-F215-4E29-BCAB-A844C4A88169":
          ret="J";
          break;
        case "69593E4F-1B40-4E67-A326-A0D0D13E2C7F":
          ret="F";
          break;
        default:
          break;
      }
    }catch(exp){}
    return ret;
  }
  getPassengerdTypeId(type:string):string
  {
    let ret:string="";
    try{
      switch(type)
      {
        case "ADT":
          ret="0A411685-6159-4FCB-A39F-07C3C921A16F";
          break;
        case "INF":
          ret="7643EF4A-AF56-4DEE-B571-70F1881D4A80";
          break;
        case "C":
          ret="B6C0E526-B18C-4879-82A3-D9F06F758383";
          break;
        default:
          break;
      }
    }catch(exp){}
    return ret;
  }
  getCabinTypeName(type:string):string
  {
    let ret:string="";
    try{
      switch(type)
      {
        case "C":case "c":
          ret="Business";
          break;
        case "Y":case "y":
          ret="Economy";
          break;
        case "J":case "j":
          ret="Premium Economy";
          break;
        case "F":case "f":
          ret="First Class";
          break;
        default:
          break;
      }
    }catch(exp){}
    return ret;
  }
  getTripTypeId(type:number)
  {
    let ret:string="";
    try{
      switch(type)
      {
        case 1:
          ret="32AFE94B-4C4F-421D-AA91-11E0BD5E125C";
          break;
        case 2:
          ret="3E58A4D3-FCD4-4CFA-9371-B03D46A20574";
          break;
        case 3:
          ret="CF748349-6049-4F33-AA7D-A1EB7440C33B";
          break;
        case 4:
          ret="7CE2C1A8-DB8B-4838-BB59-84B202EAF6B7";
          break;
        default:
          break;
      }
    }catch(exp)
    {

    }
    return ret;
  }
  getTripTypeName(type:string)
  {
    let ret:string="";
    try{
      switch(type)
      {
        case "32AFE94B-4C4F-421D-AA91-11E0BD5E125C":
          ret="One Way";
          break;
        case "3E58A4D3-FCD4-4CFA-9371-B03D46A20574":
          ret="Round Trip";
          break;
        case "CF748349-6049-4F33-AA7D-A1EB7440C33B":
          ret="Multi City";
          break;
        case "7CE2C1A8-DB8B-4838-BB59-84B202EAF6B7":
          ret="All";
          break;
        default:
          break;
      }
    }catch(exp)
    {

    }
    return ret;
  }
  getTripTypeNumber(type:string)
  {
    let ret:number=0;
    try{
      switch(type)
      {
        case "32AFE94B-4C4F-421D-AA91-11E0BD5E125C":
          ret=1;
          break;
        case "3E58A4D3-FCD4-4CFA-9371-B03D46A20574":
          ret=2;
          break;
        case "CF748349-6049-4F33-AA7D-A1EB7440C33B":
          ret=3;
          break;
        case "7CE2C1A8-DB8B-4838-BB59-84B202EAF6B7":
          ret=4;
          break;
        default:
          break;
      }
    }catch(exp)
    {

    }
    return ret;
  }
  getDistinctAirport(data:any):any[]
  {
    let ret:any=[];
    try{
      var flags = [], l = data.length, i;
      for( i=0; i<l; i++) {
          if( flags[data[i].code]) continue;
          flags[data[i].code] = true;
          ret.push(data[i]);
      }
    }catch(exp){}
    return ret;
  }
  public _getDisountTotalPrice(data:any,baseFare:number,tax:number,total:number,member:any,airlineCode:any):number
  {
    let ret:number=0;
    try{
      if(data.length>0)
      {
        for(let item of data)
        {
          if(item.AirlineCode.toString().trim().toLowerCase()==airlineCode.toString().trim().toLowerCase())
          {
            switch(item.Type)
            {
              case "Base":
                if(item.CalculationType==="Amount"){
                  ret=item.Percent;
                }else{
                  ret=baseFare*(parseFloat(item.Percent)/100);
                }
                break;
              case "Tax":
                ret=tax*(parseFloat(item.Percent)/100);
                break;
              case "Total":
                ret=total*(parseFloat(item.Percent)/100);
                break;
              default:break;
            }
            break;
          }
          else{
            switch(item.Type)
            {
              case "Base":
                if(item.CalculationType==="Amount"){
                  ret=item.Percent;
                }else{
                  ret=baseFare*(parseFloat(item.Percent)/100);
                }

                break;
              case "Tax":
                ret=tax*(parseFloat(item.Percent)/100);
                break;
              case "Total":
                ret=total*(parseFloat(item.Percent)/100);
                break;
              default:break;
            }
          }
        }
      }
      ret=member!=0 && member!=undefined?ret:0;
    }catch(exp){}
    return ret;
  }
  public _getDisountTotalPrice1(Percent:number,Type:string,CalculationType:string,baseFare:number,tax:number,total:number,member:any,airlineCode:any):number
  {
    let ret:number=0;
    try{
      if(Percent>0)
      {
        if(CalculationType==="Amount"){
          ret=Percent;
        }
        else
        {
          switch(Type)
          {
            case "Base":
                ret=baseFare*(parseFloat(Percent.toString())/100);
              break;
            case "Tax":
                ret=tax*(parseFloat(Percent.toString())/100);
              break;
            case "Total":
              ret=total*(parseFloat(Percent.toString())/100);
              break;
            default:break;
          }
        }
      }
      ret=member!=0 && member!=undefined?ret:0;
    }catch(exp){}
    return ret;
  }
  public _getMarkupPrice(data:any,type:string,baseFare:number,tax:number,total:number,airlineCode:string):any
  {
    let ret:number=0;
    let per:number=0;
    try{
      for(let item of data)
      {
        if(item.AirlineCode.toString().trim().toLowerCase()==airlineCode.toString().trim().toLowerCase())
        {
          if(item.Type.toString().toLowerCase()==type.toString().toLowerCase())
          {
            switch(item.Type)
            {
              case "Base":
                if(item.CalculationType==="Amount"){
                  per=item.Percent;
                  ret=baseFare+per;
                }else{
                  ret=baseFare+(baseFare*(parseFloat(item.Percent)/100));
                }

                break;
              case "Tax":
                ret=tax+(tax*(parseFloat(item.Percent)/100));
                break;
              case "Total":
                ret=total+(total*(parseFloat(item.Percent)/100));
                break;
              default:break;
            }
          }
          break;
        }else{
          if(item.Type.toString().toLowerCase()==type.toString().toLowerCase())
          {
            switch(item.Type)
            {
              case "Base":
                if(item.CalculationType==="Amount"){
                  per=item.Percent;
                  ret=baseFare+per;
                }else{
                  ret=baseFare+(baseFare*(parseFloat(item.Percent)/100));
                }
                ret=baseFare+(baseFare*(parseFloat(item.Percent)/100));
                break;
              case "Tax":
                ret=tax+(tax*(parseFloat(item.Percent)/100));
                break;
              case "Total":
                ret=total+(total*(parseFloat(item.Percent)/100));
                break;
              default:break;
            }
          }
        }

      }
    }catch(exp){}
    return ret;
  }
  public _getMarkupTotalPrice(data:any[],baseFare:number,tax:number,total:number,member:any,airlineCode:string):number
  {
    let ret:any=0;
    let per:number=0;
    try{
      ret=total;
      // console.log("Base:"+baseFare+" Tax:"+tax+" Total:"+total+" Member:"+member+" airlineCode:"+airlineCode);
      if(data.length>0)
      {
        for(let item of data)
        {
          if(item.AirlineCode.toString().trim().toLowerCase()==airlineCode.toString().trim().toLowerCase())
            {
              switch(item.Type)
              {
                case "Base":

                  if(item.CalculationType==="Amount"){
                    per=item.Percent;
                    ret=baseFare+per+tax;
                  }else{
                    ret=baseFare+(baseFare*(parseFloat(item.Percent)/100))+tax;
                  }

                  break;
                case "Tax":
                  ret=tax+(tax*(parseFloat(item.Percent)/100))+baseFare;
                  break;
                case "Total":
                  ret=total+(total*(parseFloat(item.Percent)/100));
                  break;
                default:break;
              }
              break;
            }else{
              switch(item.Type)
              {
                case "Base":

                  if(item.CalculationType==="Amount"){
                    per=item.Percent;
                    ret=baseFare+per+tax;
                  }else{
                    ret=baseFare+(baseFare*(parseFloat(item.Percent)/100))+tax;
                  }
                  break;
                case "Tax":
                  ret=tax+(tax*(parseFloat(item.Percent)/100))+baseFare;
                  break;
                case "Total":
                  ret=total+(total*(parseFloat(item.Percent)/100));
                  break;
                default:break;
              }
          }
        }
      }
      // console.log("                    Final Return::"+ret);
      ret=member!=0 && member!=undefined && member!=''?ret*member:0;
    }catch(exp){}
    return ret;
  }
  public _getMarkupTotalPrice1(Percent:number,Type:string,CalculationType:string,baseFare:number,tax:number,total:number,member:any):number
  {
    let ret:any=0;
    let per:number=0;
    try{
      ret=total;
      // console.log("Base:"+baseFare+" Tax:"+tax+" Total:"+total+" Member:"+member+" airlineCode:"+airlineCode);
      if(Percent>0)
      {
        switch(Type)
        {
          case "Base":
            if(CalculationType==="Amount"){
              per=Percent;
              ret=baseFare+per+tax;
            }else{
              ret=baseFare+(baseFare*(parseFloat(Percent.toString())/100))+tax;
            }
            break;
          case "Tax":
            if(CalculationType==="Amount"){
              per=Percent;
              ret=baseFare+per+tax;
            }else{
              ret=tax+(tax*(parseFloat(Percent.toString())/100))+baseFare;
            }
            break;
          case "Total":
            if(CalculationType==="Amount"){
              per=Percent;
              ret=total+per;
            }else{
              ret=total+(total*(parseFloat(Percent.toString())/100));
            }
            break;
          default:break;
        }
      }
      // console.log("                    Final Return::"+ret);
      ret=member!=0 && member!=undefined && member!=''?ret*member:0;
    }catch(exp){}
    return ret;
  }
  public _agentPrice(markupData:any,discountData:any,traffic:any,baseFare:any,tax:any,total:any,airlineCode:any):any
  {
    let ret:any="0";
    try{
      let markupPrice=this._getMarkupTotalPrice(markupData,baseFare,tax,total,traffic,airlineCode);
      let discountPrice=this._getDisountTotalPrice(discountData,baseFare,tax,total,traffic,airlineCode);
      ret=(markupPrice*parseInt(traffic))-discountPrice;
    }catch(exp){}
    return ret;
  }
  public _typeWisePrice(data:any,type:string,baseFare:any,tax:any,total:any,member:any,airlineCode:string):any
  {
    let ret:any=0;
    try{
      ret=parseFloat(this._getMarkupPrice(data,type,baseFare,tax,total,airlineCode));
      if(ret == 0){
        switch(type.toString().toLowerCase())
        {
          case "base":
            ret=baseFare;
            break;
          case "tax":
            ret=tax;
            break;
          case "total":
            ret=total;
            break;
          default:break;
        }
      }
      switch(type.toString().toLowerCase())
      {
        case "base":
          ret=member!=0 && member!=undefined?ret:0;
          break;
        case "tax":
          ret=member!=0 && member!=undefined?ret:0;
          break;
        case "total":
          ret=member!=0 && member!=undefined?ret:0;
          break;
        default:break;
      }
      ret=member!=0 && member!=undefined?ret*member:0;

    }catch(exp){}
    return ret;
  }


  isOneWay(type:any):boolean
  {
    let ret:boolean=false;
    if(type.toString().trim().toLowerCase()
    =='32AFE94B-4C4F-421D-AA91-11E0BD5E125C'.toString().trim().toLowerCase())
    {
      ret=true;
    }
    return ret;
  }
  isRoundtrip(type:any):boolean
  {
    let ret:boolean=false;
    if(type.toString().trim().toLowerCase()
    =='3E58A4D3-FCD4-4CFA-9371-B03D46A20574'.toString().trim().toLowerCase())
    {
      ret=true;
    }
    return ret;
  }
  isMulticity(type:any):boolean
  {
    let ret:boolean=false;
    if(type.toString().trim().toLowerCase()
    =='CF748349-6049-4F33-AA7D-A1EB7440C33B'.toString().trim().toLowerCase())
    {
      ret=true;
    }
    return ret;
  }
  _count(i:number):any
  {
    return new Array(i);
  }
  getApiAirlineInfo(data:any,type:any=""):any[]
  {
    let ret:any[]=[];
    try{
      if(type!="" && type!=undefined)
      {
        for(let item of data)
        {
          let marketing=item.carrier.marketing;
          let disclosure=item.carrier.disclosure;
          if(disclosure!=undefined)
          {
            ret.push(disclosure);
          }else{
            ret.push(marketing);
          }
        }
      }else{
        for(let item of data)
        {
          for(let subSubItem of item.pricingInformation)
          {
            ret.push(subSubItem.fare.governingCarriers);
          }
        }
      }
    }catch(exp){}
    return ret;
  }
  getFlightDifferenceGMT(fromHour:number,fromMinute:number,toHour:number,toMinute:number):any
  {
    let ret:string="";
    try{
      let hours=0,minutes=0;
      if(fromHour>toHour)
      {
        hours=24-fromHour;
        if(0<fromMinute)
        {
          let retM=hours*60;
          retM=retM-fromMinute;
          hours=retM/60;
          minutes=retM%60;
        }
        hours+=toHour;
        minutes+=toMinute;
        if(minutes>59)
        {
          let remHour=minutes/60;
          hours+=remHour;
          minutes=minutes%60;
        }
        hours=parseInt(hours.toString());
        minutes=parseInt(minutes.toString());
        ret= (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
      }else{
        ret=this.shareService.getTimeDifference(fromHour+":"+fromMinute,toHour+":"+toMinute);
      }

    }catch(exp){}
    return ret;
  }

  getFlightDifferenceUTC(fromHour:number,fromMinute:number,fromExpr:any,toHour:number,toMinute:number,toExpr:any):any
  {
    let ret:string="";
    try{
      let hours:number=0,minutes:number=0;
      if(fromExpr=="+" && toExpr=="+")
      {
        hours=fromHour-toHour;
      }
      else if(fromExpr=="+" && toExpr=="-")
      {
        hours=fromHour+toHour;
      }
      else if(fromExpr=="-" && toExpr=="+")
      {
        hours=fromHour+toHour;
      }
      else if(fromExpr=="-" && toExpr=="-")
      {
        hours=-fromHour+toHour;
      }
      if(fromMinute>toMinute)
      {
        if(fromExpr=="+" && toExpr=="+")
        {
          minutes=fromMinute-toMinute;
        }
        else if(fromExpr=="+" && toExpr=="-")
        {
          minutes=fromMinute+toMinute;
        }
        else if(fromExpr=="-" && toExpr=="+")
        {
          minutes=fromMinute+toMinute;
        }
        else if(fromExpr=="-" && toExpr=="-")
        {
          minutes=-fromMinute+toMinute;
        }
      }else if(toMinute>fromMinute){
        if(fromExpr=="+" && toExpr=="+")
        {
          minutes=toMinute-fromMinute;
        }
        else if(fromExpr=="+" && toExpr=="-")
        {
          minutes=toMinute+fromMinute;
        }
        else if(fromExpr=="-" && toExpr=="+")
        {
          minutes=toMinute+fromMinute;
        }
        else if(fromExpr=="-" && toExpr=="-")
        {
          minutes=-toMinute+fromMinute;
        }
        let retH=hours*60;
        retH-=minutes;
        hours=retH/60;
        minutes=retH%60;
      }
      hours=parseInt(hours.toString());
      minutes=parseInt(minutes.toString());
      ret= hours + ":" +minutes;

    }catch(exp){}
    return ret;
  }
  isNotZero(data:any):boolean
  {
    let ret:boolean=false;
    try{
      if(parseInt(data)>0)
      {
        ret=true;
      }
    }catch(exp){
    }
    return ret;
  }
  airlineRouteEnableId(data:BookModel[],code:string):string
  {
    let ret:string="";
    try{
      for(let item of data)
      {
        if(item.AirlineCode.toString().indexOf(code)>-1)
        {
          ret=item.AirlineRouteEnableId;
          break;
        }
      }
    }catch(exp){}
    return ret;
  }
  getSafeId(data:string):string
  {
    let str:string = data.replace("-","").replace(" ","").replace("(","").replace(")","");
    return str;
  }
  getMakeId(item1:any="",item2:any="",item3:any="",item4:any="",item5:any=""):string
  {
    let ret:string="";
    try{
      ret=item1+item2+item3+item4+item5;
    }catch(exp){console.log(exp)}
    return ret;
  }
  toSafeNumber(data:any):number
  {
    let ret:number=0;
    try{
      ret=parseInt(this.toSafeText(data));
    }catch(exp){
      ret=0;
    }
    return ret;
  }
  toSafeText(data:any):any
  {
    if(this.shareService.isNullOrEmpty(data) || isNaN(data))
      return "";
    return data;
  }
}
