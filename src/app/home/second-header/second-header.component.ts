import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from 'src/app/_services/toastr.service';
import { ShareService } from 'src/app/_services/share.service';
import { error } from 'console';

@Component({
  selector: 'nav[app-second-header]',
  templateUrl: './second-header.component.html',
  styleUrls: ['./second-header.component.css']
})
export class SecondHeaderComponent implements OnInit {
  amount!: string;
  constructor(private authService: AuthService, private router: Router,
    private toastrService: ToastrService,
    public shareService:ShareService) { }

  ngOnInit(): void {
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
    this.authService.getIndexAddImages().subscribe(data => {
        // console.log("Index images");
        //this.amount = data.amount;
      }, err => {
      console.log(err);
    });
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
