import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SharedapiService } from 'src/app/shared/services/sharedapi.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-your-position',
  templateUrl: './find-your-position.component.html',
  styleUrls: ['./find-your-position.component.css']
})
export class FindYourPositionComponent implements OnInit, OnDestroy {
  @Input() projectName: any;
  @Input() hid: any;
  applicationNumber: any;
  loadingApplications: boolean;
  noResults: boolean;
  applications: any[];
  applicationsSubscription;
  constructor(private sharedApiService: SharedapiService, public modal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
    this.loadingApplications = false;
    this.noResults = false;
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

  ngOnDestroy() {
    if(this.applicationsSubscription) {
      this.applicationsSubscription.unsubscribe();
    }
  }

  cancel() {
    this.modal.close();
    
  }

  onItemClick(applicationNumber) {
    this.applicationNumber = applicationNumber;
    this.applications = null;
  }

  ok() {
    this.modal.close();
    if (this.applicationNumber) {
    this.router.navigate(['projects/' + this.hid + '/applications/' + this.applicationNumber + '/position']);
    }
  }

}
