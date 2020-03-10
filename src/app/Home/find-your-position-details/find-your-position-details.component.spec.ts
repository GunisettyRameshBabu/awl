import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindYourPositionDetailsComponent } from './find-your-position-details.component';

describe('FindYourPositionDetailsComponent', () => {
  let component: FindYourPositionDetailsComponent;
  let fixture: ComponentFixture<FindYourPositionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindYourPositionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindYourPositionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
