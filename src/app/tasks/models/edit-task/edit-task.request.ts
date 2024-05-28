export interface EditTaskRequest {
    name: string;
    assignedTo: string;
    categoryId: number;
    finishDate: Date;
    description: string;
}