import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterOverlaySpinnerService } from './Shared/spinners/router-overlay-spinner/router-overlay-spinner.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpOverlaySpinnerService } from './Shared/spinners/http-overlay-spinner/http-overlay-spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit , AfterViewInit {
  title = 'PublicAWL';
  isRouterOverlaySpinnerVisible: boolean;
  isHttpOverlaySpinnerVisible: boolean;

  constructor(
    private router: Router, private cd: ChangeDetectorRef,
    private httpOverlaySpinnerService: HttpOverlaySpinnerService,
    private routerOverlaySpinnerService: RouterOverlaySpinnerService,
    private toastr: ToastrService) {
  }
  
  ngOnInit() {
    // Monitor changes to the state (visible/hidden) of the HTTP Overlay Spinner...
    this.httpOverlaySpinnerService.spinnerState.subscribe((state: boolean) => {
      // Set variable to indicate if the HTTP Overlay Spinner is visible...
      this.isHttpOverlaySpinnerVisible = state;
    });

    // Monitor changes to the state (visible/hidden) of the Router Overlay Spinner...
    this.routerOverlaySpinnerService.spinnerState.subscribe((state: boolean) => {
      // Set variable to indicate if the Router Overlay Spinner is visible...
      this.isRouterOverlaySpinnerVisible = state;
    });
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show the Router Overlay Spinner...
        this.routerOverlaySpinnerService.show();

        // Close all open toastr messages...
        this.toastr.clear();

      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // Hide the Router Overlay Spinner...
        this.routerOverlaySpinnerService.hide();
      }

      window.scroll(0, 0);
     // this.cd.detectChanges();
    });
  }
}

