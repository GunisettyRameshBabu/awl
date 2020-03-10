import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  FormBuilder
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedapiService } from "src/app/shared/services/sharedapi.service";
import { AlertService } from "src/app/alert/alert.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalpopupComponent } from "src/app/shared/modalpopup/modalpopup.component";
import { Contact } from "src/app/shared/models/contact.model";
import { map } from "rxjs/operators";
import { Project } from "src/app/shared/models/project.model";

@Component({
  selector: "app-contact-info",
  templateUrl: "./contact-info.component.html",
  styleUrls: ["./contact-info.component.css"]
})
export class ContactInfoComponent implements OnInit {
  project: Project;
  step;
  verifying;
  contact: Contact;
  contactForm: FormGroup;
  submitted;
  hid;
  contactForm2: FormGroup;
  uspsValid: boolean;
  showNote = false;
  applicationNumberExist: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedApiService: SharedapiService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // Retrieve initial data from the resolver and map to local variables...

    this.mapData(this.route.snapshot.data);
    this.step = 1;
    this.verifying = false;
    this.submitted = false;
    this.uspsValid = null;
    this.contactForm = new FormGroup({
      ApplicationNumber: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]*$/)
      ]),
      FirstName: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[a-z ,.'-]+$/i)
      ]),
      LastName: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[a-z ,.'-]+$/i)
      ])
    });

    this.contactForm2 = this.fb.group(
      {
        EmailAddress: new FormControl("", [Validators.email]),
        ConfirmEmailAddress: new FormControl("", [Validators.email]),
        Address: new FormControl(
          "",
          [Validators.required],
          this.validateAddress.bind(this)
        ),
        Phone1: new FormControl(""),
        Phone2: new FormControl(""),
        AddressLine1: new FormControl(""),
        AddressLine2: new FormControl(""),
        City: new FormControl(""),
        State: new FormControl(""),
        ZipCode: new FormControl("")
      },
      { validator: this.checkPasswords }
    );

    this.route.params.subscribe((data: any) => {
      this.hid = data.hid;
      this.contactForm.controls.ApplicationNumber.setValue(
        data.applicationNumber
      );
      this.applicationNumberExist =
        (data.applicationNumber != undefined &&
        data.applicationNumber != null &&
        data.applicationNumber != "");
    });
  }

  checkPasswords(group: AbstractControl) {
    // here we have the 'passwords' group
    const pass = group.get("EmailAddress").value;
    const confirmPass = group.get("ConfirmEmailAddress").value;
    if (pass !== confirmPass) {
      group.get("ConfirmEmailAddress").setErrors({ notSame: true });
    }
  }

  validateAddress(control: AbstractControl) {
    return this.sharedApiService.validateAddress(control.value).pipe(
      map((res: any[]) => {
        if (res.length > 0) {
          this.uspsValid = true;
          this.f2.AddressLine1.setValue(res[0].delivery_line_1);
          this.f2.AddressLine2.setValue(res[0].delivery_line_2);
          this.f2.City.setValue(res[0].components.city_name);
          this.f2.State.setValue(res[0].components.state_abbreviation);
          this.f2.ZipCode.setValue(res[0].components.zipcode);
        } else {
          this.uspsValid = false;
          this.contactForm2.get("Address").setErrors({ liveaddress: true });
        }
      })
    );
  }

  validateApplicant() {
    this.submitted = true;
    this.alertService.clear();
    if (this.contactForm.valid) {
      this.verifying = true;
      this.sharedApiService
        .findApplicant(this.hid, {
          applicationNumber: this.f.ApplicationNumber.value,
          firstName: this.f.FirstName.value,
          lastName: this.f.LastName.value
        })
        .subscribe(
          (data: Contact) => {
            this.alertService.clear();
            this.step = 2;
            this.contact = data;
            this.verifying = false;
            this.submitted = false;
            this.contactForm2.reset(this.contact);
          },
          err => {
            this.verifying = false;
            if (err.status == "404") {
              this.alertService.error(
                "Head of Household or Co-Head of Household not found"
              );
            } else if (err.status == "401") {
              this.alertService.error(
                "There is already a pending change request submitted for this application"
              );
            } else {
            }
          }
        );
    } else {
      this.verifying = false;
    }
  }

  clickedCancel() {
    this.router.navigate(["home"]);
  }

  get f() {
    return this.contactForm.controls;
  }

  get f2() {
    return this.contactForm2.controls;
  }

  mapData(data) {
    this.project = data["project"];
  }

  saveChanges() {
    this.alertService.clear();
    if (this.contactForm2.valid && this.uspsValid) {
      this.submitted = false;
      if (!this.f2.Phone1.value && !this.f2.Phone2.value) {
        const dialogRef = this.modalService.open(ModalpopupComponent, {
          centered: true,
          backdrop: "static",
          keyboard: false
        });
        dialogRef.componentInstance.title =
          '<span class="text-danger"><i class="fa fa-warning"></i> Warning</span>';
        dialogRef.componentInstance.body = `You have not provided a phone number,
        so any phone numbers already on file will be erased with this update.
          Click \'OK\' to continue. Click \'Cancel\' if you want to return to the screen and enter a phone number.`;
        dialogRef.componentInstance.CancelEvent.subscribe((data: any) => {});

        dialogRef.componentInstance.SuccessEvent.subscribe((data: any) => {
          this.save();
        });
      } else {
        this.save();
      }
    }
    this.submitted = true;
  }

  save() {
    const obj = new Contact();
    obj.confirmationNumber = 0;
    obj.applicationNumber = this.f.ApplicationNumber.value;
    obj.hid = this.hid;
    obj.firstName = this.f.FirstName.value;
    obj.lastName = this.f.LastName.value;
    obj.emailAddress = this.f2.EmailAddress.value;
    obj.phone1 =
      this.f2.Phone1.value == undefined ? null : this.f2.Phone1.value;
    obj.phone2 =
      this.f2.Phone2.value == undefined ? null : this.f2.Phone2.value;
    obj.addressLine1 = this.f2.AddressLine1.value;
    obj.addressLine2 =
      this.f2.AddressLine2.value == undefined
        ? null
        : this.f2.AddressLine2.value;
    obj.city = this.f2.City.value;
    obj.state = this.f2.State.value;
    obj.zipCode = this.f2.ZipCode.value;
    obj.status = null;
    obj.sequence = 1;
    console.log(obj);
    this.sharedApiService.saveContact(obj).subscribe(
      (contact: Contact) => {
        this.contact = contact;
        this.step = 3;
      },
      err => {
        this.alertService.error(
          "Please review your selections and make the necessary changes"
        );
      }
    );
  }
}
