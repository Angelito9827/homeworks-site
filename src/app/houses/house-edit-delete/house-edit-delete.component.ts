import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '../services/house-service/house.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-house-edit-delete',
  templateUrl: './house-edit-delete.component.html',
  styleUrl: './house-edit-delete.component.css'
})
export class HouseEditDeleteComponent {
  form!: FormGroup;
  url: any = '';
  fieldErrors = { emailError: false };

  attemptedSubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.createForm();
  }

  onSelectFile(event: any) {
    if (event && event.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (eventLoad) => {
        if (eventLoad && eventLoad.target) {
          this.url = eventLoad.target.result;
          console.log(this.url);
        }
      };
    }
  }

  public delete() {
    this.url = null;
  }
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  validateFields() {}
}
