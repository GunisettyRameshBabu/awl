import { Component, OnInit, OnDestroy } from "@angular/core";
import { SelectorMatcher } from "@angular/compiler";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  timeout,
  filter,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  catchError,
} from "rxjs/operators";
import { animate, style, transition, trigger } from "@angular/animations";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProjectDetailsComponent } from "../Projectdetails/project-details.component";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  FormControl,
  ValidatorFn,
  AbstractControl,
  NgForm,
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ApiService } from "../app.service";
import { SharedapiService } from "../shared/services/sharedapi.service";
import { FindYourPositionComponent } from "./find-your-position/find-your-position.component";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { DataSource, CollectionViewer } from "@angular/cdk/collections";
import { Home } from "./home.model";
import { HomeService } from "./home.service";
import { BreadcrumbService } from "../breadcrumb.service";

enum queryFilterTypes {
  search = "filter",
  pageNumber = "page",
  pageSize = "pageSize",
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  page = 1;
  pagescount = 0;
  pageSize = 25;
  selectedProject = {};
  searchFilter: string;
  totalProjects: any;
  filterProjects: any;
  itemsPerPage: number;
  pageNumber: number;
  projects;
  totalItems: number;
  totalPages: number;
  queryParamSubscription;
  queryFilterTypes = queryFilterTypes;
  private hasChildren: boolean;
  projectSubscription;
  dataSource: ProjectsDataSource;

  constructor(
    fb: FormBuilder,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private apiService: SharedapiService,
    private homeService: HomeService,
    private breadcrumbService: BreadcrumbService,
    private activatedRoute: ActivatedRoute
  ) {
    // Force new instance of component when reloading...
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    if (this.activatedRoute.children.length == 0) {
      this.breadcrumbService.addBreadCrumb({ label: "Home", url: "" });
    }

    this.dataSource = new ProjectsDataSource(this.homeService, this.route);
  }

  ngOnInit() {
    this.hasChildren = false;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.hasChildren = this.route.children.length > 0;
      });
    // Retrieve initial data from the resolver and map to local variables...

    // this.mapData(this.route.snapshot.data);

    this.queryParamSubscription = this.route.queryParamMap.subscribe(
      (queryParams) => {
        // Set default query filter values...
        this.searchFilter = "";
        this.pageNumber = 1;

        // Loop through all query parameters for the route and set local variables...
        this.route.snapshot.queryParamMap.keys.forEach((key) => {
          switch (key) {
            case queryFilterTypes.search: {
              this.searchFilter = this.route.snapshot.queryParamMap.get(key);
              break;
            }

            case queryFilterTypes.pageNumber: {
              this.pageNumber = Number(
                this.route.snapshot.queryParamMap.get(key)
              );
              break;
            }
          }
        });
      }
    );

    // this.projectSubscription = this.apiService.getProjects().subscribe((data: any[]) => {
    //   this.projects = data;
    // } , (err) => { console.log(err); })
  }

  ngOnDestroy() {
    // Avoid memory leaks here by cleaning up after ourselves...
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }

    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }

  mapData(data) {
    this.projects = data["projects"]["results"];
    this.pageNumber = data["projects"]["pageNumber"];
    this.itemsPerPage = 25;
    this.totalItems = data["projects"]["inlineCount"];
    this.totalPages = data["projects"]["totalPages"];
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

    if (this.searchFilter) {
      queryParamaters[queryFilterTypes.search] = this.searchFilter;
    }

    // Check if page number was provided (and not the default of 1)...
    if (this.pageNumber && this.pageNumber !== 1) {
      // Add page number to query parameters...
      queryParamaters[queryFilterTypes.pageNumber] = this.pageNumber;
    }

    queryParamaters[queryFilterTypes.pageSize] = this.itemsPerPage;

    this.router.navigate([this.route.routeConfig.path], {
      replaceUrl: true,
      queryParams: queryParamaters,
    });
  }

  clearSearch() {
    this.searchFilter = "";
    this.route.queryParams.subscribe((params) => {
      if (params[queryFilterTypes.search]) {
        // Screen has been filtered, reset...
        this.reload(true);
      }
    });
  }

  clicked(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  openModal(prj) {
    const dialogRef = this.modalService.open(FindYourPositionComponent, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    dialogRef.componentInstance.projectName = prj.projectName;
    dialogRef.componentInstance.hid = prj.hid;
  }

  showProjectDetails(hid) {
    this.apiService.getProject(hid).subscribe(
      (x: any) => {
        const dialogRef = this.modalService.open(ProjectDetailsComponent, {
          centered: true,
          backdrop: "static",
          keyboard: false,
          windowClass: "custom-width",
          size: "sm",
        });
        dialogRef.componentInstance.selectedProject = x;
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  // search = (text$: Observable<string>) => {
  //   // if (this.searchFilter != '') {
  //   //   return this.apiService
  //   //   .getProjects(this.searchFilter).pipe(
  //   //    map((results: any) =>
  //   //    results.results.map(x => x.projectName)
  //   //   ));
  //   // } else {
  //   //   return [];
  //   // }

  // }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      // switchMap allows returning an observable rather than maps array
      switchMap((searchText) =>
        this.apiService.getProjects(searchText).pipe(
          map((results: any) => {
            let suggetions = [];
            results.results.forEach((element) => {
              suggetions.push(element.projectName);
              suggetions.push(element.projectCity);
            });
            return suggetions;
          })
        )
      )
    );
  };

  updateContactInfo(prj) {
    this.router.navigate([
      "",
      "projects",
      prj.hid,
      "applications",
      "contact",
      "edit",
    ]);
  }

  filter(event) {
    if (event.keyCode === 13) {
      this.reload(true);
    }
  }
}

export class ProjectsDataSource extends DataSource<Home | undefined> {
  private cachedFacts = Array.from<Home>({ length: 0 });
  private dataStream = new BehaviorSubject<(Home | undefined)[]>(
    this.cachedFacts
  );
  private subscription = new Subscription();

  private pageSize = 25;
  private lastPage = 0;

  constructor(private homeService: HomeService, private route: ActivatedRoute) {
    super();

    // Start with some data.
    this._fetchFactPage();
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<(Home | undefined)[] | ReadonlyArray<Home | undefined>> {
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
      if (params[queryFilterTypes.search]) {
        search[queryFilterTypes.search] = params[queryFilterTypes.search];
      }
    });

    this.homeService.getProjects(search).subscribe((res) => {
      this.cachedFacts = this.cachedFacts.concat(res.results);
      this.dataStream.next(this.cachedFacts);
    });
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }
}
