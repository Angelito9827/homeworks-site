import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SendInvitationEmailRequest } from '../models/send-invitation-email/send-invitation-email.request';
import { HouseService } from '../services/house-service/house.service';
import { HouseMemberService } from '../services/house-member-service/house-member.service';
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
  request: SendInvitationEmailRequest = {
    email: '',
    houseId: 0,
  };

  attemptedSubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private houseMembersService: HouseMemberService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.fieldErrors.emailError = false;
  }

  checkEmailError() {
    return this.fieldErrors.emailError;
  }

  setEmailError(hasError: boolean) {
    this.fieldErrors.emailError = hasError;
  }

  validateEmail() {
    const emailControl = this.form.get('email');

    if (emailControl) {
      this.setEmailError(emailControl?.invalid || false);

      emailControl.markAsTouched();
    }

    this.onSendInvitationButton();
  }

  stablishRequest() {
    this.request.email = this.form.get('email')?.value;
  }

  areAllStepsValid(): boolean {
    return !this.checkEmailError() && this.form.valid;
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

  onSendInvitationButton() {
    this.attemptedSubmit = true;

    if (!this.areAllStepsValid()) {
      console.log('Not all steps are valid');
      return;
    }

    this.stablishRequest();
    console.log('Request stablished');
    this.houseMembersService
      .sendInvitationEmail(this.request)
      .pipe()
      .subscribe();
  }

  shouldShowError(): boolean {
    return (
      this.attemptedSubmit &&
      this.form.get('email')?.errors?.['required'] &&
      this.form.get('email')?.touched
    );
  }

  validateFields() {}
}
