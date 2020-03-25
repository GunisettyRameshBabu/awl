import { Component, OnInit , Input } from '@angular/core';
import { SharedapiService } from 'src/app/shared/services/sharedapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-application',
  templateUrl: './change-application.component.html',
  styleUrls: ['./change-application.component.css']
})
export class ChangeApllicationComponent implements OnInit {

@Input() applicationNumber;
@Input() hid;
applications: any[];
loadingApplications;
applicationsSubscription;
noResults;
  constructor(private sharedApiService: SharedapiService, private router: Router) { }

  ngOnInit() {
  }

  getApplications(reload: boolean) {
    if (reload) {
      if (this.applicationNumber) {
        this.loadingApplications = true;
        this.applicationsSubscription = this.sharedApiService.getApplications(this.hid, this.applicationNumber).subscribe((data: any[]) => {
          this.applications = data.length === 0 ? null : data;
          this.noResults = data.length === 0;
          this.loadingApplications = false;
        });
      } else {
        this.applications = null;
      }
    }
  }

  changeApplication() {
    this.router.navigate(['/bedrooms/waitlist/' + this.hid + '/' + this.applicationNumber + '/position']);
  }

  onItemClick(applicationNumber) {
    this.applicationNumber = applicationNumber;
    this.applications = null;
  }

  cancelApplication() {
    this.router.navigate([this.router.url]);
  }

}
