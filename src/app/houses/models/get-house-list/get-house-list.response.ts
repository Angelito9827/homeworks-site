export interface GetHouseListResponse {
    elements: GetHouseListItemResponse[];
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
    profileImage: string;
    isAdmin: boolean;
}