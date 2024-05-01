export interface GetHouseListResponse {
    houses: GetHouseListItemResponse[];
    totalElements: number;
    page: number;
    pageSize: number;
}

export interface GetHouseListItemResponse {
    id:number;
    name: string;
    description: string;
    address: string;
    createdBy: string;
    createdAt: Date;
    houseMembers: number;
    activeTasks: number;
    profilePicture: string;
    isHouseAdmin: boolean;
}