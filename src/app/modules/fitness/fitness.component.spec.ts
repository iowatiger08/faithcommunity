import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FitnessComponent } from './fitness.component';

describe('FitnessComponent', () => {
  let component: FitnessComponent;
  let fixture: ComponentFixture<FitnessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FitnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FitnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
