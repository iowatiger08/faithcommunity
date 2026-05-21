import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeddingComponent } from './wedding.component';

describe('WeddingComponent', () => {
  let component: WeddingComponent;
  let fixture: ComponentFixture<WeddingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WeddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
