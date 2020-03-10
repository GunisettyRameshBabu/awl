import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, config, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

enum queryFilterTypes {
    page = 'page',
    pageSize = 'pageSize',
    hid = 'hid',
    aptSize = 'aptSize',
    type = 'type',
    senior = 'senior',
    mobility = 'mobility'
}

@Injectable()
export class BedRoomAdmissionsApllicationResolver implements Resolve<any> {

    constructor(private http: HttpClient, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
        // Construct parameters for the HTTP request...
        let httpParams = new HttpParams();
        httpParams = httpParams.append(queryFilterTypes.page, route.queryParams[queryFilterTypes.page]
            ? route.queryParams[queryFilterTypes.page] : '1');
        httpParams = httpParams.append(queryFilterTypes.pageSize, '25');
        // Check if Apartment size was provided...
        if (route.params[queryFilterTypes.type]) {
            // Add Apartment Size to the parameters...
            httpParams = httpParams.append(queryFilterTypes.type, route.params[queryFilterTypes.type]);
        }

        if (route.params[queryFilterTypes.aptSize]) {
            // Add Apartment Size to the parameters...
            httpParams = httpParams.append(queryFilterTypes.aptSize, route.params[queryFilterTypes.aptSize]);
        }

        if (route.queryParams[queryFilterTypes.senior]) {
            // Add Senior to the parameters...
            httpParams = httpParams.append(queryFilterTypes.senior, route.queryParams[queryFilterTypes.senior]);
        }

        if (route.queryParams[queryFilterTypes.mobility]) {
            // Add Senior to the parameters...
            httpParams = httpParams.append(queryFilterTypes.mobility, route.queryParams[queryFilterTypes.mobility]);
        }
        return this.http.get(environment.awlWebApiUrl + '/projects/' + route.params[queryFilterTypes.hid]
            + '/applications', { params: httpParams }
        ).pipe(catchError(err => {
            return of([]);
        }));
    }
}
