import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteTasksComponent } from './edit-delete-tasks.component';

describe('EditDeleteTasksComponent', () => {
  let component: EditDeleteTasksComponent;
  let fixture: ComponentFixture<EditDeleteTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDeleteTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDeleteTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
