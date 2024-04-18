import { Component } from '@angular/core';
import { GetHouseListResponse } from '../models/get-house-list/get-house-list.response';
import { GetHouseListRequest } from '../models/get-house-list/get-house-list.request';
import { HouseService } from '../house-service/house.service';

@Component({
  selector: 'app-houses-list',
  templateUrl: './houses-list.component.html',
  styleUrl: './houses-list.component.css'
})
export class HousesListComponent {

  response?: GetHouseListResponse;
  request: GetHouseListRequest = { page: 0, pageSize: 5 }

  constructor(private houseService: HouseService) {
  }

  ngOnInit(): void {

    this.getHousesList();

  }

  private getHousesList() {
    this.houseService.get(this.request)
      .pipe()
      .subscribe({
        next: (response: GetHouseListResponse) => {
          console.log(response);
          this.response = response;
        }
      });
  }
}
