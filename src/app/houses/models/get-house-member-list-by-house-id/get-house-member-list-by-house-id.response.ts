export interface GetHouseMemberListByHouseIdResponse {
    houseMembers: GetHouseMemberListItemByHouseIdResponse [];
}

export interface GetHouseMemberListItemByHouseIdResponse {
    id: number;
    name: string;
    lastName: string;
    profileImage: string;
}