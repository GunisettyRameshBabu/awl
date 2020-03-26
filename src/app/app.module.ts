import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SecureLayoutComponent } from "./Layout/secure-layout/secure-layout.component";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { ToastrService, ToastrModule } from "ngx-toastr";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbModule
} from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from "./Home/home.component";
import { ProjectsService } from "./Projectdetails/project.service";
import { DatePipe } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HomeResolver } from "./Home/home.resolver";
import { FindYourPositionComponent } from "./Home/find-your-position/find-your-position.component";
import { ContactInfoComponent } from "./Projects/contact-info/contact-info.component";
import { ContactinfoResolver } from "./Projects/contactinfo.resolver";
import { ProjectDetailsComponent } from "./Projectdetails/project-details.component";
import { AgmCoreModule } from "@agm/core";
import { AlertModule } from "./alert/alert.module";
import { UsPhoneNumberPipe } from "./shared/pipes/us-phone-number.pipe";
import { ModalpopupComponent } from "./shared/modalpopup/modalpopup.component";
import { FindYourPositionDetailsComponent } from "./Home/find-your-position-details/find-your-position-details.component";
import { FindYourPositionProjectResolver } from "./Home/find-your-position-details/find-your-position-details-project.resolver";
import { FindYourPositionApllicationResolver } from "./Home/find-your-position-details/find-your-position-details-application.resolver";
import { FindYourPositionWaitingListResolver } from "./Home/find-your-position-details/find-your-postion-details-waitinglist.resolver";
import { CapitalizePipe } from "./shared/pipes/capitalize.pipe";
import { PageHeaderComponent } from "./shared/page-header/page-header.component";
import { ChangeApllicationComponent } from "./Home/change-application/change-application.component";
import { BedRoomAdmissionsComponent } from "./WaitingList/bed-room-admissions/bed-room-admissions.component";
import { BedRoomAdmissioinsProjectResolver } from "./WaitingList/bed-room-admissions/bed-room-admissions-project.resolver";
import { BedRoomAdmissionsApllicationResolver } from "./WaitingList/bed-room-admissions/bed-room-admissions-applications.resolver";
import { FilterPipe } from "./shared/pipes/filter.pipe";
import { RouterOverlaySpinnerComponent } from "./shared/spinners/router-overlay-spinner/router-overlay-spinner.component";
import { LiveAddressDirective } from "./shared/directives/live-address.directive";
import { PhoneMaskDirective } from "./shared/directives/phone-mask.directive";
import { NgxSpinnerModule } from "ngx-spinner";
import { HttpOverlaySpinnerComponent } from "./Shared/spinners/http-overlay-spinner/http-overlay-spinner.component";
import { BedRooms } from "./WaitingList/bedrooms/bedrooms.component";
import { WaitingListComponent } from "./Home/waiting-list/waiting-list.component";
import { ScrollingModule } from '@angular/cdk/scrolling';

const routes: Routes = [
  {
    path: "",
    component: SecureLayoutComponent,
    data: {
      breadcrumb: "Home"
    },
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "home"
      },
      {
        path: "home",
        component: HomeComponent,
        data: {
          breadcrumbIgnore: true
        },
        resolve: {
          projects: HomeResolver
        },
        runGuardsAndResolvers: "always",
        children: []
      },
      {
        path: "bedrooms",
        component: BedRooms,
        data: {
          breadcrumb: "Bed Room Admissions",
        },
        children: [
          {
            path: ":hid/:aptSize/:type", 
            component: BedRoomAdmissionsComponent,
            data: {
              breadcrumb: "Bed Room Admissions",
              breadcrumbIgnore : true
            },
            resolve: {
              project: BedRoomAdmissioinsProjectResolver,
             // waitingLists: BedRoomAdmissionsApllicationResolver
            },
            runGuardsAndResolvers: "always"
          },
          {
            path: "waitlist",
            component: WaitingListComponent,
            data: {
              breadcrumb: "Waiting List",
            },
            children : [
              {
                path: ":hid/:applicationNumber/position",
                component: FindYourPositionDetailsComponent,
                data: {
                  breadcrumb: "Waiting List",
              breadcrumbIgnore: true
                },
                resolve: {
                  project: FindYourPositionProjectResolver,
                  application: FindYourPositionApllicationResolver,
                  waitingLists: FindYourPositionWaitingListResolver
                },
                runGuardsAndResolvers: "always",
                children: []
              },
              {
                path: ":hid/:applicationNumber/contact/edit",
                component: ContactInfoComponent,
                data: {
                  breadcrumb: "Contact Info"
                },
                resolve: {
                  project: ContactinfoResolver
                },
                runGuardsAndResolvers: "always"
              }
            ]
          },
          
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SecureLayoutComponent,
    HomeComponent,
    FindYourPositionComponent,
    ContactInfoComponent,
    ProjectDetailsComponent,
    UsPhoneNumberPipe,
    ModalpopupComponent,
    FindYourPositionDetailsComponent,
    HttpOverlaySpinnerComponent,
    RouterOverlaySpinnerComponent,
    CapitalizePipe,
    PageHeaderComponent,
    ChangeApllicationComponent,
    BedRoomAdmissionsComponent,
    FilterPipe,
    LiveAddressDirective,
    PhoneMaskDirective,
    BedRooms,
    WaitingListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: "reload"
    }),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBWwCieFatZwOp1wFiT18h8nXh-EJW4YYI",
      libraries: ["places"]
    }),
    RouterModule.forChild(routes),
    AlertModule,
    NgxSpinnerModule,
    ScrollingModule
  ],
  providers: [
    HomeResolver,
    ProjectsService,
    DatePipe,
    ContactinfoResolver,
    FindYourPositionProjectResolver,
    FindYourPositionWaitingListResolver,
    FindYourPositionApllicationResolver,
    BedRoomAdmissioinsProjectResolver,
    BedRoomAdmissionsApllicationResolver,
    FilterPipe
  ],
  entryComponents: [
    FindYourPositionComponent,
    ProjectDetailsComponent,
    ModalpopupComponent,
    HttpOverlaySpinnerComponent,
    RouterOverlaySpinnerComponent,
    ChangeApllicationComponent
  ],
  bootstrap: [AppComponent],
  exports: [ReactiveFormsModule]
})
export class AppModule {}
