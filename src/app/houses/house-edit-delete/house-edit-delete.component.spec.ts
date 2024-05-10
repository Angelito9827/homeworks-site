import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseEditDeleteComponent } from './house-edit-delete.component';

describe('HouseEditDeleteComponent', () => {
  let component: HouseEditDeleteComponent;
  let fixture: ComponentFixture<HouseEditDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HouseEditDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HouseEditDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
