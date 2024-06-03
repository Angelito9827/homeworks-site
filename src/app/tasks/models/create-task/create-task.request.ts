export interface CreateTaskRequest {
    house: string;
    name: string;
    description?: string;
    finishDate: Date;
    assignedTo: number;
    //FKs
    categoryId: number;
    houseId: number;
}