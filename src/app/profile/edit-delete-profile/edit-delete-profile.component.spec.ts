import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteProfileComponent } from './edit-delete-profile.component';

describe('EditDeleteProfileComponent', () => {
  let component: EditDeleteProfileComponent;
  let fixture: ComponentFixture<EditDeleteProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDeleteProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDeleteProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
