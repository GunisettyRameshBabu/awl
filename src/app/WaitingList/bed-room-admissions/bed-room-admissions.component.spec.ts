import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedRoomAdmissionsComponent } from './bed-room-admissions.component';

describe('BedRoomAdmissionsComponent', () => {
  let component: BedRoomAdmissionsComponent;
  let fixture: ComponentFixture<BedRoomAdmissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedRoomAdmissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedRoomAdmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
