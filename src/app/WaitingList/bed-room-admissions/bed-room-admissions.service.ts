import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
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

@Injectable({
  providedIn: 'root'
})
export class BedRoomsService {

  constructor(private http: HttpClient) { }

  getProjects(criteria: any)
  : Observable<any> {
    // Construct parameters for the HTTP request...
    let httpParams = new HttpParams();
    httpParams = httpParams.append(queryFilterTypes.page, criteria.pageNumber
        ? criteria.pageNumber + 1 : '1');
    httpParams = httpParams.append(queryFilterTypes.pageSize, criteria.pageSize);
    // Check if Apartment size was provided...
    if (criteria.type) {
        // Add Apartment Size to the parameters...
        httpParams = httpParams.append(queryFilterTypes.type, criteria.type);
    }

    if (criteria.aptSize) {
        // Add Apartment Size to the parameters...
        httpParams = httpParams.append(queryFilterTypes.aptSize, criteria.aptSize);
    }

    if (criteria.senior) {
        // Add Senior to the parameters...
        httpParams = httpParams.append(queryFilterTypes.senior, criteria.senior);
    }

    if (criteria.mobility) {
        // Add Senior to the parameters...
        httpParams = httpParams.append(queryFilterTypes.mobility, criteria.mobility);
    }
    return this.http.get(environment.awlWebApiUrl + '/projects/' + criteria.hid
        + '/applications', { params: httpParams }
    ).pipe(catchError(err => {
        return of([]);
    }));
  }
}
