export interface CreateTaskRequest {
    house: string;
    name: string;
    description?: string;
    finishDate: Date;
    assignedTo: string;
    //FKs
    categoryId: number;
    houseId: number;
}