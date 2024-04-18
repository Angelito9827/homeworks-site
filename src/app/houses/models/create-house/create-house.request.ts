export interface CreateHouseRequest {
    name: string;
    description: string;
    address: string;
    category: number;
    houseMembers: number;
    profilePicture: string;
}