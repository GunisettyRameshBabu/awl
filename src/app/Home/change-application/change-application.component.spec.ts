import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeApllicationComponent } from './change-application.component';

describe('ChangeApllicationComponent', () => {
  let component: ChangeApllicationComponent;
  let fixture: ComponentFixture<ChangeApllicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeApllicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeApllicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
