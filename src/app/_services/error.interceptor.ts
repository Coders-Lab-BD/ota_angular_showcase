import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from './toastr.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private toastrService: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    let modalStateErrors = '';

                    if (error.status === 400) {
                        console.log(error.error);
                        if (error.error && typeof error.error === 'object')
                        {
                            // API startup Password settings error
                            for (const key in error.error) {
                                if (error.error[key]) {
                                    modalStateErrors += "* " + error.error[key].description + '<br>';
                                }
                            }
                            console.log(modalStateErrors);
                            this.toastrService.error('',modalStateErrors);
                            return throwError(modalStateErrors || 'Server Error');
                        }
                        else
                        {
                            this.toastrService.error('',error.error);
                            return throwError(error.error);
                        }
                    }

                    if (error.status === 401) {
                        console.log(error.statusText);
                        this.toastrService.error('',error.statusText);
                        return throwError(error.statusText);
                    }

                    const applicationError = error.headers.get('Application-Error');
                    if (applicationError) {
                        console.log(applicationError);
                        this.toastrService.error('',applicationError);
                        return throwError(applicationError);
                    }
                    // const serverError = error.error;
                    // let modalStateErrors = '';
                    // if (serverError && typeof serverError === 'object') {
                    //     for (const key in serverError) {
                    //         if (serverError[key] && key === 'title') {
                    //             modalStateErrors += serverError[key] + '\n';
                    //         }
                    //     }
                    // }

                    const serverError = error.error;
                    let modalStateErrorsTitle;
                    modalStateErrorsTitle = serverError.title;

                    if (serverError.errors && typeof serverError.errors === 'object' && serverError.hasOwnProperty('errors')) {
                        for (const key in serverError.errors) {
                            if (serverError.errors[key]) {
                                for (let i = 0; i < serverError.errors[key].length; i++) {
                                    modalStateErrors += "* " + serverError.errors[key][i] + '<br>';
                                }
                            }
                        }
                    }

                    console.log(modalStateErrors || serverError);
                    this.toastrService.error(modalStateErrorsTitle,modalStateErrors);
                    return throwError(modalStateErrors || serverError || 'Server Error');
                }
                else{
                  return throwError('');
                }
            })
        );
    }

    private handleError(error: HttpErrorResponse) {

    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
