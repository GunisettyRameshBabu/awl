import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Home } from './home.model';
import { environment } from 'src/environments/environment';

enum queryFilterTypes {
    search = 'filter',
    pageNumber = 'page',
    pageSize = 'pageSize'
  }

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getProjects(criteria: { filter?: any, pageNumber: any , pageSize: any }): Observable<any> {
    // Construct parameters for the HTTP request...
    let httpParams = new HttpParams();

    // Check if search criteria was provided...
    if (criteria.filter) {
      // Add search criteria to the parameters...
      httpParams = httpParams.append(queryFilterTypes.search, criteria.filter);
    }

    // Check if page number was provided (and not the default of 1)...
    if (criteria.pageNumber && criteria.pageNumber > 1) {
      // Add page number to the parameters...
      httpParams = httpParams.append(queryFilterTypes.pageNumber, criteria.pageNumber + 1);
    } else {
      httpParams = httpParams.append(queryFilterTypes.pageNumber, '1');
    }

    // Check if page size was provided (and not the default of 1)...
    if (criteria.pageSize && criteria.pageSize) {
      // Add page number to the parameters...
      httpParams = httpParams.append(queryFilterTypes.pageSize, criteria.pageSize.toString());
    } else {
      httpParams = httpParams.append(queryFilterTypes.pageSize, '25' );
    }

    return this.http.get<any>(environment.awlWebApiUrl + '/projects' , { params : httpParams  });
  }
}
