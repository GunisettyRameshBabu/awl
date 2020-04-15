import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from "@angular/animations";
import { filter } from "rxjs/operators";
import { DataSource, CollectionViewer } from "@angular/cdk/collections";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { BedRoomsService } from "./bed-room-admissions.service";

enum queryFilterTypes {
  page = "page",
  pageSize = "pageSize",
  hid = "hid",
  aptSize = "aptSize",
  type = "type",
  senior = "senior",
  mobility = "mobility",
}

@Component({
  selector: "app-bed-room-admissions",
  templateUrl: "./bed-room-admissions.component.html",
  styleUrls: ["./bed-room-admissions.component.css"],
  animations: [
    trigger("hideShowAnimator", [
      state("true", style({ opacity: 1 })),
      state("false", style({ opacity: 0 })),
      transition("0 => 1", animate(".5s")),
      transition("1 => 0", animate(".9s")),
    ]),
  ],
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
  bedroomSizes: { id: number; name: string }[] = [
    { id: 0, name: "Studio" },
    { id: 1, name: "1 Bedroom" },
    { id: 2, name: "2 Bedroom" },
    { id: 3, name: "3 Bedroom" },
    { id: 4, name: "4 Bedroom" },
    { id: 5, name: "5 Bedroom" },
  ];
  hasChildren: boolean;
  dataSource: BedRoomsDataSource;
  constructor(
    private route: ActivatedRoute,
    private naviageRoute: Router,
    private bedRoomService: BedRoomsService
  ) {
    this.naviageRoute.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.dataSource = new BedRoomsDataSource(this.bedRoomService, this.route);
  }

  ngOnInit() {
    this.hasChildren = false;
    this.naviageRoute.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.hasChildren = this.route.children.length > 0;
      });
    this.pageNumber = 1;
    this.itemsPerPage = 25;
    this.showFilter = true;
    this.route.params.subscribe((data: any) => {
      this.hid = data.hid;
      this.applicationType = data.type;
      this.aptSize = data.aptSize;
    });

    // Loop through all query parameters for the route and set local variables...
    this.route.snapshot.queryParamMap.keys.forEach((key) => {
      switch (key) {
        case queryFilterTypes.page: {
          this.pageNumber = Number(this.route.snapshot.queryParamMap.get(key));
          break;
        }

        case queryFilterTypes.pageSize: {
          this.itemsPerPage = Number(
            this.route.snapshot.queryParamMap.get(key)
          );
          break;
        }

        case queryFilterTypes.senior: {
          this.senior = this.route.snapshot.queryParamMap.get(key);
          break;
        }

        case queryFilterTypes.mobility: {
          this.mobility = this.route.snapshot.queryParamMap.get(key);
          break;
        }
      }
    });

    // Retrieve initial data from the resolver and map to local variables...

    this.mapData(this.route.snapshot.data);
  }

  mapData(data) {
    this.project = data["project"];
    // this.waitList = data["waitingLists"]['results'];
    // this.totalItems = data["waitingLists"]['inlineCount'];
    // console.log(this.waitList);
  }

  applyFilter() {
    const params = { senior: this.senior, mobility: this.mobility };
    this.naviageRoute.navigate(
      [
        "bedrooms/" +
          this.hid +
          "/" +
          this.aptSize +
          "/" +
          this.applicationType,
      ],
      { queryParams: params }
    );
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
    if (this.pageNumber && this.pageNumber !== 1) {
      // Add page number to query parameters...
      queryParamaters[queryFilterTypes.page] = this.pageNumber;
    }

    queryParamaters[queryFilterTypes.pageSize] = this.itemsPerPage;

    this.naviageRoute.navigate(
      [
        "projects/" +
          this.hid +
          "/waitlist/bedrooms/" +
          this.aptSize +
          "/" +
          this.applicationType,
      ],
      {
        replaceUrl: true,
        queryParams: queryParamaters,
      }
    );
  }
}

export class BedRoomsDataSource extends DataSource<any | undefined> {
  private cachedFacts = Array.from<any>({ length: 0 });
  private dataStream = new BehaviorSubject<(any | undefined)[]>(
    this.cachedFacts
  );
  private subscription = new Subscription();

  private pageSize = 25;
  private lastPage = 0;

  constructor(
    private bedRoomService: BedRoomsService,
    private route: ActivatedRoute
  ) {
    super();

    // Start with some data.
    this._fetchFactPage();
    console.log(window.history);
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<(any | undefined)[] | ReadonlyArray<any | undefined>> {
    this.subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const currentPage = this._getPageForIndex(range.end);

        if (currentPage > this.lastPage) {
          this.lastPage = currentPage;
          this._fetchFactPage();
        }
      })
    );
    return this.dataStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }

  private _fetchFactPage(): void {
    let search = { pageNumber: this.lastPage, pageSize: this.pageSize };
    // Check if search criteria was provided...
    this.route.queryParams.subscribe((params) => {
      if (params[queryFilterTypes.senior]) {
        // Add Senior to the parameters...
        search[queryFilterTypes.senior] = params[queryFilterTypes.senior];
      }

      if (params[queryFilterTypes.mobility]) {
        // Add Senior to the parameters...
        search[queryFilterTypes.mobility] = params[queryFilterTypes.mobility];
      }

      this.route.params.subscribe((data: any) => {
        search[queryFilterTypes.hid] = data.hid;
        search[queryFilterTypes.type] = data.type;
        search[queryFilterTypes.aptSize] = data.aptSize;
      });
    });

    this.bedRoomService.getProjects(search).subscribe((res) => {
      this.cachedFacts = this.cachedFacts.concat(res.results);
      this.dataStream.next(this.cachedFacts);
    });
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }
}
