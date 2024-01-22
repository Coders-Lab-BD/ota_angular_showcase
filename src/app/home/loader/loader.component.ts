import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from '../../_services/loader.service';
import { LoaderState } from './loader.model';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css','../../../assets/dist/css/custom.css'],
})
export class LoaderComponent implements OnInit {
  
  @Input() fromFlight:any=[];
  @Input() toFlight:any;
  @Input() departureDate:any;
  @Input() returnDate:string|undefined;
  @Input() adult:string | undefined;
  @Input() child:string | undefined;
  @Input() infant: string | undefined;
  
  imgUrl: string = '';
  adminUrl = environment.adminUrl;

  constructor(private loaderService: LoaderService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getB2bLoaderImage().subscribe(data => {      
      let loaderImageUrl = data.loaderimage.replace('../../', this.adminUrl);
      this.imgUrl =  loaderImageUrl;
    });
  }

  ngOnDestroy() {
    
  }
}
