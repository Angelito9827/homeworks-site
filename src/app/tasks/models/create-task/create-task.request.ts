export interface CreateTaskRequest {
    house: string;
    taskName: string;
    description?: string;
    finishDate: Date;
    assignedTo: string;
    //FKs
    categoryId: number;
    houseId: number;
}