import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, config, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
enum queryFilterTypes {
  hid = 'hid'
}

@Injectable()
export class FindYourPositionProjectResolver implements Resolve<any> {

  constructor(private http: HttpClient, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    return this.http.get(environment.awlWebApiUrl + '/projects/' + route.params[queryFilterTypes.hid]).pipe(catchError(err => {
      return of({});
    }));
  }
}
