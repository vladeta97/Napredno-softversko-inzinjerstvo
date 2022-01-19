import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FosterComponent } from './foster.component';

describe('FosterComponent', () => {
  let component: FosterComponent;
  let fixture: ComponentFixture<FosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
