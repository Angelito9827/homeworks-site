import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HouseService } from '../services/house-service/house.service';

@Component({
  selector: 'app-houses-add',
  templateUrl: './houses-add.component.html',
  styleUrl: './houses-add.component.css'
})
export class HousesAddComponent {
  
  constructor(private houseService: HouseService) {
    
  }
}
