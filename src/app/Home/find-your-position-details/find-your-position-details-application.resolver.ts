import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, config , throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError  } from 'rxjs/operators';

enum queryFilterTypes {
    applicationNumber = 'applicationNumber',
    hid = 'hid'
}

@Injectable()
export class FindYourPositionApllicationResolver implements Resolve<any> {

    constructor(private http: HttpClient, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
        // Construct parameters for the HTTP request...
        let httpParams = new HttpParams();

        // Check if search criteria was provided...
        if (route.queryParams[queryFilterTypes.applicationNumber]) {
            // Add search criteria to the parameters...
            httpParams = httpParams.append(queryFilterTypes.applicationNumber, route.queryParams[queryFilterTypes.applicationNumber]);
        }
        return this.http.get(environment.awlWebApiUrl + '/projects/' + route.params[queryFilterTypes.hid] + '/applications/'
        + route.params[queryFilterTypes.applicationNumber] ).pipe(catchError(err => {
            return of({});
        }));
    }
}
