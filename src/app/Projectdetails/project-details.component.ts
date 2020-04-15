import { Component, Input, OnInit } from "@angular/core";
import { ProjectsService } from "./project.service";
// import {Project} from "../models";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Project } from "../shared/models/project.model";
import { GeocodeService } from "../shared/services/geocode.service";
import { RouterModule, Routes } from "@angular/router";

@Component({
  templateUrl: "./project-details.component.html",
})
export class ProjectDetailsComponent implements OnInit {
  @Input() selectedProject: Project;

  public customStyle = [
    {
      featureType: "poi.business",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];
  address: string;
  location: GoogleLocation;
  loading = false;
  constructor(
    private projectService: ProjectsService,
    private modalRef: NgbActiveModal,
    private geocodeService: GeocodeService
  ) {}

  ngOnInit() {
    if (this.selectedProject) {
      this.loading = true;
      this.address =
        this.selectedProject.projectAddress1 +
        " " +
        this.selectedProject.projectCity +
        " NY " +
        this.selectedProject.projectZipCode;
      this.addressToCoordinates();
    }
  }

  cancel() {
    this.selectedProject = null;
    this.address = "";
    this.modalRef.dismiss("cancel");
  }

  mapInitialized(map) {
    window.setTimeout(() => {
      const center = map.getCenter();
      map.setCenter(center);
    }, 100);
  }

  addressToCoordinates() {
    this.geocodeService.geocodeAddress(this.address).subscribe(
      (location: GoogleLocation) => {
        this.location = location;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }
}

export interface GoogleLocation {
  lat: number;
  lng: number;
}
