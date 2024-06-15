import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousesAddComponent } from './houses-add.component';

describe('HousesAddComponent', () => {
  let component: HousesAddComponent;
  let fixture: ComponentFixture<HousesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HousesAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HousesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
