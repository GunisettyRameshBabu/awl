import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

enum queryFilterTypes {
  page = 'page',
  pageSize = 'pageSize',
  hid = 'hid',
  aptSize = 'aptSize',
  type = 'type',
  senior = 'senior',
  mobility = 'mobility'
}

@Component({
  selector: 'app-bed-room-admissions',
  templateUrl: './bed-room-admissions.component.html',
  styleUrls: ['./bed-room-admissions.component.css'],
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('0 => 1', animate('.5s')),
      transition('1 => 0', animate('.9s'))
    ]) 
  ]
})
export class BedRoomAdmissionsComponent implements OnInit {

  project;
  hid;
  waitList: any[];
  totalItems;
  pageNumber: number;
  itemsPerPage;
  showFilter;
  applicationType;
  senior;
  mobility;
  aptSize: number;
  bedroomSizes: {id: number , name: string}[] = [
    { id: 0, name: 'Studio' },
    { id: 1, name: '1 Bedroom' },
    { id: 2, name: '2 Bedroom' },
    { id: 3, name: '3 Bedroom' },
    { id: 4, name: '4 Bedroom' },
    { id: 5, name: '5 Bedroom' }];
  constructor(private route: ActivatedRoute, private naviageRoute: Router) {
    this.naviageRoute.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
  }

  ngOnInit() {
    this.pageNumber = 1;
    this.itemsPerPage = 25;
    this.showFilter = false;
    this.route.params.subscribe((data: any) => {
      this.hid = data.hid;
      this.applicationType = data.type;
      this.aptSize = data.aptSize;
    });

    // Loop through all query parameters for the route and set local variables...
    this.route.snapshot.queryParamMap.keys.forEach(key => {
      switch (key) {
        case queryFilterTypes.page: {
          this.pageNumber = Number(this.route.snapshot.queryParamMap.get(key));
          break;
        }

        case queryFilterTypes.pageSize: {
          this.itemsPerPage = Number(this.route.snapshot.queryParamMap.get(key));
          break;
        }

        case queryFilterTypes.senior: {
          this.senior = this.route.snapshot.queryParamMap.get(key);
          break;
        }

        case queryFilterTypes.mobility: {
          this.mobility =this.route.snapshot.queryParamMap.get(key);
          break;
        }
      }
    });


    // Retrieve initial data from the resolver and map to local variables...

    this.mapData(this.route.snapshot.data);
  }

  mapData(data) {
    this.project = data['project'];
    this.waitList = data["waitingLists"]['results'];
    this.totalItems = data["waitingLists"]['inlineCount'];
    console.log(this.waitList);
  }

  applyFilter() {
    const params = { senior: this.senior, mobility: this.mobility };
    this.naviageRoute.navigate(['projects/' + this.hid + '/waitlist/bedrooms/' + this.aptSize + '/' + this.applicationType],
      { queryParams: params });
  }

  isAvailable(bedroomSize: any) {
    switch (bedroomSize.id) {
      case 0:
          return this.project.studioWaitList > 0;
          break;
      case 1:
          return this.project.oneBedroomWaitList > 0;
          break;
      case 2:
          return this.project.twoBedroomWaitList > 0;
          break;
      case 3:
          return this.project.threeBedroomWaitList > 0;
          break;
      case 4:
          return this.project.fourBedroomWaitList > 0;
          break;
      case 5:
          return this.project.fiveBedroomWaitList > 0;
          break;
  }
  }

  pageChange(requestedPageNumber) {
    // Set current page number to the requested page number...
    this.pageNumber = requestedPageNumber;

    // Reload the page...
    this.reload(false);
  }

  reload(resetPageNumber: boolean) {
    const queryParamaters = {};

    // Check if the current page should be reset...
    if (resetPageNumber) {
      // Reset the current page to 1...
      this.pageNumber = 1;
    }

    if (this.mobility) {
      queryParamaters[queryFilterTypes.mobility] = this.mobility;
    }

    if (this.senior) {
      queryParamaters[queryFilterTypes.senior] = this.senior;
    }

    // Check if page number was provided (and not the default of 1)...
    if (this.pageNumber && this.pageNumber !==1) {
      // Add page number to query parameters...
      queryParamaters[queryFilterTypes.page] = this.pageNumber;
    }

    queryParamaters[queryFilterTypes.pageSize] = this.itemsPerPage;

    this.naviageRoute.navigate(['projects/' + this.hid + '/waitlist/bedrooms/' + this.aptSize + '/' + this.applicationType], {
      replaceUrl: true,
      queryParams: queryParamaters
    });
  }

}
