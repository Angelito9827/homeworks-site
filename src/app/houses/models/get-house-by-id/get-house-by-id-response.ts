export interface GetHouseByIdResponse {
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