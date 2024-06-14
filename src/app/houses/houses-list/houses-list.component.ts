import { Component } from '@angular/core';
import { GetHouseListResponse } from '../models/get-house-list/get-house-list.response';
import { GetHouseListRequest } from '../models/get-house-list/get-house-list.request';
import { HouseService } from '../services/house-service/house.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-houses-list',
  templateUrl: './houses-list.component.html',
  styleUrl: './houses-list.component.css',
})
export class HousesListComponent {
  user: string = '';
  response?: GetHouseListResponse;
  request: GetHouseListRequest = { page: 0, pageSize: 5 };

  constructor(
    private houseService: HouseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole();
    this.getHousesList();
  }

  private getHousesList() {
    this.houseService
      .get(this.request)
      .pipe()
      .subscribe({
        next: (response: GetHouseListResponse) => {
          console.log(response);
          this.response = response;
        },
      });
  }

  onPageChange(page: number) {
    // Actualiza el número de página en la solicitud y vuelve a obtener la lista de "paticas"
    this.request.page = page;
  }
}
