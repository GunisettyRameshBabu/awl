import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedRooms } from './bedrooms.component';

describe('WaitingListComponent', () => {
  let component: BedRooms;
  let fixture: ComponentFixture<BedRooms>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedRooms ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedRooms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
