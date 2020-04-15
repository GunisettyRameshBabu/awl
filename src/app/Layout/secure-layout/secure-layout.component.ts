import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Params,
  Router,
  NavigationStart,
  NavigationCancel,
  NavigationError,
} from "@angular/router";
import { filter } from "rxjs/operators";
import { HttpOverlaySpinnerService } from "src/app/Shared/spinners/http-overlay-spinner/http-overlay-spinner.service";
import { RouterOverlaySpinnerService } from "src/app/Shared/spinners/router-overlay-spinner/router-overlay-spinner.service";
import { ToastrService } from "ngx-toastr";
declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-secure-layout",
  templateUrl: "./secure-layout.component.html",
  styleUrls: ["./secure-layout.component.css"],
})
export class SecureLayoutComponent implements OnInit {
  breadcrumbs: Array<any>;
  breadcrumbsUrl;
  currentPage;
  _opened = false;

  public currentRoute: string;
  isHttpOverlaySpinnerVisible: boolean = false;
  isRouterOverlaySpinnerVisible: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpOverlaySpinnerService: HttpOverlaySpinnerService,
    private routerOverlaySpinnerService: RouterOverlaySpinnerService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {
    this.currentRoute = router.url.toLowerCase();

    // Clear existing breadcrumb data...
    this.breadcrumbs = [];
    this.breadcrumbsUrl = "";
    this.generateBreadcrumbs(this.activatedRoute.root);
  }

  ngOnInit() {
    $(".topbar").stick_in_parent({});

    // Subscribe to the NavigationEnd event...
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Generate breadcrumbs for the current route...
        this.generateBreadcrumbs(this.activatedRoute.root);

        // Pop the last breadcrumb (current page) off the array and store in variable. We'll show
        // this separately from the other breadcrumbs...
        this.currentPage = this.breadcrumbs.pop().label;
      });

    // Monitor changes to the state (visible/hidden) of the HTTP Overlay Spinner...
    this.httpOverlaySpinnerService.spinnerState.subscribe((state: boolean) => {
      // Set variable to indicate if the HTTP Overlay Spinner is visible...
      this.isHttpOverlaySpinnerVisible = state;
    });

    // Monitor changes to the state (visible/hidden) of the Router Overlay Spinner...
    this.routerOverlaySpinnerService.spinnerState.subscribe(
      (state: boolean) => {
        // Set variable to indicate if the Router Overlay Spinner is visible...
        this.isRouterOverlaySpinnerVisible = state;
      }
    );
  }

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  generateBreadcrumbs(activatedRoute: ActivatedRoute) {
    // Check if the route has a breadcrumb label and is not set to ignore...
    if (activatedRoute.snapshot.data.hasOwnProperty("breadcrumb")) {
      this.breadcrumbsUrl +=
        "/" +
        activatedRoute.snapshot.url.map((segment) => segment.path).join("/");
      if (!activatedRoute.snapshot.data["breadcrumbIgnore"]) {
        // Push the breadcrumb data onto the array...
        this.breadcrumbs.push({
          label: activatedRoute.snapshot.data["breadcrumb"],
          url: this.breadcrumbsUrl,
        });
      }
      // Construct the breadcrumb url (each subsequent route will add to this)...
    }
    // Loop through each child route and recursively generate breadcrumbs for each...
    activatedRoute.children.forEach((child) => {
      this.generateBreadcrumbs(child);
    });
  }

  openNav() {
    document.getElementById("collapseLeftNav").style.width = "100%";
  }

  closeNav() {
    document.getElementById("collapseLeftNav").style.width = "0";
  }

  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Show the Router Overlay Spinner...
        this.routerOverlaySpinnerService.show();

        // Close all open toastr messages...
        this.toastr.clear();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Hide the Router Overlay Spinner...
        this.routerOverlaySpinnerService.hide();
      }

      window.scroll(0, 0);
      // this.cd.detectChanges();
    });
  }
}
