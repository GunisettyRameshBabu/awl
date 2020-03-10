import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindYourPositionComponent } from './find-your-position.component';

describe('FindYourPositionComponent', () => {
  let component: FindYourPositionComponent;
  let fixture: ComponentFixture<FindYourPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindYourPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindYourPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
