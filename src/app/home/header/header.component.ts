import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { HomeComponent } from '../home.component';
import { environment } from 'src/environments/environment';
import { ShareService } from 'src/app/_services/share.service';
declare var window: any;
declare var $: any;

@Component({
  selector: 'nav[app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUserPhoto: any;
  currentUserName: any;
  indexAddImages: any[] = [];
  adminUrl = environment.adminUrl;

  amount!: string;

  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService, private router: Router,
    private toastrService: ToastrService, private homeComponent: HomeComponent,
    public shareService:ShareService) { }

  ngOnInit() {
    //this.getIndexAddImages();
    this.getCurrentBalance();
  }
  getCurrentBalance(){
    this.authService.getCurrentBalance().subscribe( data=>{
      this.amount = data.data;
    },
    error => {
      console.log(error);
      this.toastrService.error("Error", error);
    })
  }
  getIndexAddImages() {
    this.indexAddImages=[];
    this.authService.getIndexAddImages().subscribe(data => {
      // console.log("Index images");
        for(let item of data.items)
        {
          if(this.indexAddImages.findIndex(x=>x.id==item.vImageId)<0)
          {
            this.indexAddImages.push({id:item.vImageId,image:item.nvImage, type:item.vType});
          }
        }
      //this.amount = data.amount;
      //console.log(this.indexAddImages.findIndex(x=>x.id=='1D96157C-066C-4798-86FC-E8AC2528F5F1'));
      // console.log(this.indexAddImages.map(object => object.image.indexOf(1)))


      }, err => {
      console.log(err);
    });
  }
  getIndexesImage(type:any):number
  {
    // console.log(type);
    let ret:number=-1;
    try{
      let findedInd = this.indexAddImages.findIndex(x => x.type.indexOf(type) > -1);
      if(findedInd!=-1)
      {
        ret=findedInd;
      }
    }catch(exp){}
    return ret;
  }
  logout() {
    const ulhid = localStorage.getItem('ulhid');
    this.authService.logout(ulhid).subscribe(() => {
      localStorage.clear();
      // console.log('Logged out successfully');
      // this.toastrService.success('Success', 'logged out');
    }, (error) => {
      localStorage.clear();
      this.router.navigate(['../../login']);
      // console.log(error);
      // this.toastrService.error('Failed', 'Logout failed');
    }, () => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

}
