import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MindfulnessComponent } from './mindfulness.component';

describe('MindfulnessComponent', () => {
  let component: MindfulnessComponent;
  let fixture: ComponentFixture<MindfulnessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MindfulnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MindfulnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
