import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SixthreeComponent } from './sixthree.component';

describe('SixthreeComponent', () => {
  let component: SixthreeComponent;
  let fixture: ComponentFixture<SixthreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SixthreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SixthreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
