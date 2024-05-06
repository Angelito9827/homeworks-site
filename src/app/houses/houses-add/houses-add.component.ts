import { Component, VERSION } from '@angular/core';
import { HouseService } from '../services/house-service/house.service';
import { HouseMemberService } from '../services/house-member-service/house-member.service';
import { SendInvitationEmailRequest } from '../models/send-invitation-email/send-invitation-email.request';

@Component({
  selector: 'app-houses-add',
  templateUrl: './houses-add.component.html',
  styleUrl: './houses-add.component.css',
})
export class HousesAddComponent {
  constructor(
    private houseService: HouseService,
    private houseMembersService: HouseMemberService
  ) {}

  url: any = '';
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
    let invitationRequest: SendInvitationEmailRequest = {
      email: '',
      houseId: 1,
    };
    this.houseMembersService.sendInvitationEmail(invitationRequest)
    .pipe()
    .subscribe();
  }
}
