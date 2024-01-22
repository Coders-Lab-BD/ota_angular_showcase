import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from './toastr.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private toastrService: ToastrService,private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    
    if (token){

      if(this.isAutoLogout()){
          const redirectUrl = '/login';
          const redirectedRequest = request.clone({ url: redirectUrl });
          setTimeout(() => {
            this.toastrService.info("Logout","You are Logout");            
          }, 1000);
          // modified request to the next handler
          this.router.navigate([redirectUrl])
          return next.handle(redirectedRequest);
      }
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      request.headers.append('Content-Type', 'application/xml');
      request.headers.append('Access-Control-Allow-Origin', '*');
    }
    return next.handle(request);
  }

  isAutoLogout(): boolean {
    const token = localStorage.getItem('token');
    let lastActivity = localStorage.getItem('lastActivity');
      if(lastActivity && token){
          let lastActivityDate = new Date(lastActivity);
          let currentTime = new Date();
          const diffInMs = Math.abs(currentTime.getTime() - lastActivityDate.getTime());
          const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));
          localStorage.removeItem('lastActivity');//removing previous datetime
          localStorage.setItem('lastActivity',currentTime.toString()); // assigning new DateTime

          let a = localStorage.getItem('autoLogoutTime') ?? "0";
          const  autoLogoutTime = parseInt(a);
          if(autoLogoutTime && diffInMinutes > autoLogoutTime){
            localStorage.removeItem('token');    
            return true;
          }
        }
    return false;
  }


}
