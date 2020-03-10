import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, config } from 'rxjs';
import { environment } from '../../environments/environment';

enum queryFilterTypes {
  search = 'filter',
  pageNumber = 'page',
  pageSize = 'pageSize'
}

@Injectable()
export class HomeResolver implements Resolve<any> {

  constructor(private http: HttpClient, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    // Construct parameters for the HTTP request...
    let httpParams = new HttpParams();

    // Check if search criteria was provided...
    if (route.queryParams[queryFilterTypes.search]) {
      // Add search criteria to the parameters...
      httpParams = httpParams.append(queryFilterTypes.search, route.queryParams[queryFilterTypes.search]);
    }

    // Check if page number was provided (and not the default of 1)...
    if (route.queryParams[queryFilterTypes.pageNumber] && route.queryParams[queryFilterTypes.pageNumber] > 1) {
      // Add page number to the parameters...
      httpParams = httpParams.append(queryFilterTypes.pageNumber, route.queryParams[queryFilterTypes.pageNumber].toString());
    } else {
      httpParams = httpParams.append(queryFilterTypes.pageNumber, '1');
    }

    // Check if page size was provided (and not the default of 1)...
    if (route.queryParams[queryFilterTypes.pageSize] && route.queryParams[queryFilterTypes.pageSize] > 1) {
      // Add page number to the parameters...
      httpParams = httpParams.append(queryFilterTypes.pageSize, route.queryParams[queryFilterTypes.pageSize].toString());
    } else {
      httpParams = httpParams.append(queryFilterTypes.pageSize, '25' );
    }

    return this.http.get(environment.awlWebApiUrl + '/projects' , { params : httpParams  });
  }
}
