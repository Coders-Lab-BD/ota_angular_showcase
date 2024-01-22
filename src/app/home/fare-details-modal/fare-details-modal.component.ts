import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DateChangeCancelModel } from 'src/app/model/date-change-cancel-model.model';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';
import { LoaderService } from '../../_services/loader.service';

@Component({
  selector: 'app-fare-details-modal',
  templateUrl: './fare-details-modal.component.html',
  styleUrls: ['./fare-details-modal.component.css']
})
export class FareDetailsModalComponent implements OnInit {

  @Input() data:any=[];



  fareDetails:any=[];
  adult:string|undefined;
  child:string|undefined;
  infant:string|undefined;
  clientFareTotal:number|undefined;
  agentFareTotal:number|undefined;
  amtDateChangesPre:any;
  amtDateChanges:any;
  amtDateChangesPlus:any;
  amtCancellationPre:any;
  amtCancellation:any;
  amtCancellationPlus:any;
  isCancellationShow:boolean=true;

  constructor(public shareService:ShareService,public authService:AuthService) {
    this.setFareData();
  }

  ngOnInit(): void {

  }
  setFareData()
  {
    try{
      // console.log(this.data);
      this.adult=this.data.adult;
      this.child=this.data.child.length;
      this.infant=this.data.infant;
      this.fareDetails=this.data.fareData;
      this.clientFareTotal=this.data.clientFareTotal;
      this.agentFareTotal=this.data.agentFareTotal;
    }catch(exp){}
  }
  dateChangeApi(type:boolean=true,item:any)
  {
    this.isCancellationShow=true;
    try{
      let dateCancel:DateChangeCancelModel={
        providerId: item.providerId,
        departureDate: item.departureDate,
        departureCityCode: item.departureCityCode,
        arrivalCityCode: item.arrivalCityCode,
        airlineCode: item.airlineCode,
        fareBasisCode: item.fareBasisCode,
        flightRouteTypeId: item.flightRouteTypeId,
        tripTypeId: item.tripTypeId
      };
      this.authService.getDateChanges(dateCancel).subscribe(data=>{

        // console.log(JSON.stringify(data));
        // console.log(data);
        if(type)
        {
          this.setDateChangesAmount(data.res,data.amount);
        }else{
          this.setCancellationAmount(data.res,data.amount);
        }
        this.isCancellationShow=false;
      },err=>{

      });
    }catch(exp){}
  }
  setCancellationAmount(data:any,amount:any)
  {
    this.amtCancellation="";
    this.amtCancellationPre="";
    this.amtCancellationPlus=this.shareService.amountShowWithCommas(Math.round(amount));
    let envData=data["soap-env:Envelope"];
    let envBody=envData["soap-env:Body"];
    var patNum = /^\d+\.?\d*$/;
    var patAlpha=/^[a-zA-Z]+$/;
    try{
      let fareParaList=envBody.OTA_AirRulesRS.FareRuleInfo.Rules.Paragraph;
      let amt="",pre="";
      for(let item of fareParaList)
      {
        if(item.Title.indexOf('PENALTIES')>-1)
        {
          let l=0;
          for(let m=0;m<item.Text.split(' ').length;m++)
          {
            if(item.Text.split(' ')[m].indexOf('.')>-1 && item.Text.split(' ')[m].match(patNum))
            {
              if(l==0)
              {
                l=1;
                continue;
              }
              if(l==1)
              {
                pre=item.Text.split(' ')[m-1];
                amt=Math.round(item.Text.split(' ')[m])+"";
              }
            }
          }
        }
      }
      if(amt=="" || amt==undefined)
      {
        for(let item of fareParaList)
        {
          if(item.Title.indexOf('PENALTIES')>-1)
          {
            let l=0;
            for(let m=0;m<item.Text.split(' ').length;m++)
            {
              if(item.Text.split(' ')[m].indexOf('CANCEL')>-1 && item.Text.split(' ')[m+3].indexOf('BDT')>-1)
              {
                pre=item.Text.split(' ')[m+3].substring(item.Text.split(' ')[m+3].indexOf('-')+1,item.Text.split(' ')[m+3].length)+" ";
                amt=Math.round(item.Text.split(' ')[m+4])+"";
              }
              if(item.Text.split(' ')[m].indexOf('CANCEL')>-1 && item.Text.split(' ')[m+1].indexOf('INR')>-1)
              {
                pre=item.Text.split(' ')[m+1];
                amt=Math.round(item.Text.split(' ')[m+2])+"";
                break;
              }
            }
          }
        }
      }
      this.amtCancellation=amt;
      this.amtCancellationPre=pre;
    }catch(exp){
    }
  }
  setDateChangesAmount(data:any,amount:any)
  {
    this.amtDateChanges="";
    this.amtDateChangesPlus="";
    this.amtDateChangesPre="";
    let envData=data["soap-env:Envelope"];
    let envBody=envData["soap-env:Body"];
    var patNum = /^\d+\.?\d*$/;
    var patAlpha=/^[a-zA-Z]+$/;
    this.amtDateChangesPlus=this.shareService.amountShowWithCommas(Math.round(amount));
    try{
      let fare=envBody.OTA_AirRulesRS.DuplicateFareInfo.Text;
      let listAmount=[];
      let listCur=[];
      let i=0,j=0;
      for(let item of fare.split(' '))
      {
        if(item.indexOf('.')>-1 && item.match(patNum))
        {
          listAmount.push(item);
          j++;
        }
        if(j==1 && item.match(patAlpha))
        {
          listCur.push(item);
          j=0;
        }
        i++;
      }
      this.amtDateChanges=Math.round(this.shareService.getMinimum(listAmount));
      this.amtDateChangesPre=listCur[0];
    }catch(exp)
    {
      try{
        let fareParaList=envBody.OTA_AirRulesRS.FareRuleInfo.Rules.Paragraph;
        let amt="",pre="";
        for(let item of fareParaList)
        {
          if(item.Title.indexOf('PENALTIES')>-1)
          {
            for(let m=0;m<item.Text.split(' ').length;m++)
            {
              if(item.Text.split(' ')[m].indexOf('.')>-1 && item.Text.split(' ')[m].match(patNum))
              {
                pre=item.Text.split(' ')[m-1];
                amt=Math.round(item.Text.split(' ')[m])+"";
                break;
              }
            }

          }
        }
        if(amt=="" || amt==undefined)
        {
          for(let item of fareParaList)
          {
            if(item.Title.indexOf('PENALTIES')>-1)
            {
              for(let m=0;m<item.Text.split(' ').length;m++)
              {
                if(item.Text.split(' ')[m].indexOf('BDT')>-1)
                {
                  pre=item.Text.split(' ')[m];
                  amt=Math.round(this.shareService.getOnlyAmount(item.Text.split(' ')[m+1]))+"";
                  break;
                }
                if(item.Text.split(' ')[m].indexOf('INR')>-1)
                {
                  pre=item.Text.split(' ')[m];
                  amt=Math.round(this.shareService.getOnlyAmount(item.Text.split(' ')[m+1]))+"";
                  break;
                }
              }
            }
          }
        }
        this.amtDateChanges=amt;
        this.amtDateChangesPre=pre;
      }catch(exp){
        console.log(exp);
      }
    }
  }
  getDateChanges(refund:boolean,passenger:any):any
  {
    try{
      if(refund==false)
      {
        return "Non Refundable + "+this.amtDateChangesPlus+"";
      }else{
        return this.amtDateChangesPre+" "+this.shareService.amountShowWithCommas(Math.round(parseFloat(this.amtDateChanges)*parseInt(passenger)))+" + "+this.amtDateChangesPlus+"";
      }
    }catch(exp){}
  }
  getCancellation(refund:boolean,passenger:any):any
  {
    try{
      if(refund==false)
      {
        return "Non Refundable + "+this.amtCancellationPlus+"";
      }else{
        if(this.amtCancellation=="" || this.amtCancellation==undefined)
        {
          return "Airline Fee "+" + "+this.amtCancellationPlus+"";
        }
        return this.amtCancellationPre+" "+this.shareService.amountShowWithCommas(Math.round(parseFloat(this.amtCancellation)*parseInt(passenger)))+" + "+this.amtCancellationPlus+"";
      }
    }catch(exp){}
  }

}
