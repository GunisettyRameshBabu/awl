import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { HttpOverlaySpinnerService } from "./Shared/spinners/http-overlay-spinner/http-overlay-spinner.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public httpOverlaySppinner: HttpOverlaySpinnerService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.httpOverlaySppinner.show();
    return next.handle(req).pipe(
      tap(evt => {
        this.httpOverlaySppinner.hide();
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          try {
            this.httpOverlaySppinner.hide();
          } catch (e) {
            this.httpOverlaySppinner.hide();
          }
          //log error
          console.error(err);
        }
        return of(err);
      })
    );
  }
}
