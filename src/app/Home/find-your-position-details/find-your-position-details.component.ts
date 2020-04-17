import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { BreadcrumbService } from "src/app/breadcrumb.service";

@Component({
  selector: "app-find-your-position-details",
  templateUrl: "./find-your-position-details.component.html",
  styleUrls: ["./find-your-position-details.component.css"],
})
export class FindYourPositionDetailsComponent implements OnInit {
  project;
  application;
  waitingLists: any[];
  showNote;
  hasChildren: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bredcrumbService: BreadcrumbService
  ) {
    // Force new instance of component when reloading...
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    if (this.route.children.length == 0) {
      this.route.params.subscribe((data: any) => {
        this.bredcrumbService.addBreadCrumb({
          label: "Wait List",
          url:
            "/bedrooms/waitlist/" +
            data["hid"] +
            "/" +
            data["applicationNumber"] +
            "/position",
        });
      });
    }
  }

  ngOnInit() {
    this.hasChildren = false;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.hasChildren = this.route.children.length > 0;
      });
    // Retrieve initial data from the resolver and map to local variables...

    this.mapData(this.route.snapshot.data);
    this.showNote = true;
  }

  mapData(data) {
    this.project = data["project"];
    this.application = data["application"];
    this.waitingLists = [];
    const keys = Object.keys(data["waitingLists"]);

    for (const key of keys) {
      this.waitingLists.push({ key: key, value: data["waitingLists"][key] });
    }
  }

  getType(value) {
    if (value < 25) {
      return "danger";
    } else if (value < 50) {
      return "warning";
    } else if (value < 75) {
      return "info";
    } else {
      return "success";
    }
  }

  showUpdateNote() {
    this.showNote = !this.showNote;
  }
}
