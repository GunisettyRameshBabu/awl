import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class SharedapiService {
  constructor(private http: HttpClient) { }

  private get(url) {
    return this.http.get(environment.awlWebApiUrl + url);
  }

  private post(url, body) {
    return this.http.post(environment.awlWebApiUrl + url , body );
  }

  getProjects() {
    return this.get('/projects/');
  }

  getApplications(hid, filter) {
    let httpParams = new HttpParams();

    // Check if search criteria was provided...
    if (filter) {
      // Add search criteria to the parameters...
      httpParams = httpParams.append('filter', filter);
    }

    // if (hid) {
    //   // Add search criteria to the parameters...
    //   httpParams = httpParams.append('hid', hid );
    // }
    return this.http.get(environment.awlWebApiUrl + '/projects/' + hid + '/applications', { params: httpParams });
  }

  getProject(hid) {
    return this.http.get(environment.awlWebApiUrl + '/projects/' + hid);
  }

  findApplicant(hid, params) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('applicationNumber', params.applicationNumber);
    httpParams = httpParams.append('firstName', params.firstName);
    httpParams = httpParams.append('lastName', params.lastName);
    return this.http.get(environment.awlWebApiUrl + '/projects/' + hid + '/applications', { params: httpParams });
  }

  saveContact(contact: Contact) {
    return this.post( '/Contacts/', contact);
  }

  validateAddress(address) : Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('street', address);
    httpParams = httpParams.append('auth-id', environment.liveAddressAuthId);
    return this.http.get(environment.liveAddressUrl , { params : httpParams });
  }
}
