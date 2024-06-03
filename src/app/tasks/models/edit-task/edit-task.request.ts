export interface EditTaskRequest {
    id:number;
    name: string;
    assignedTo: number;
    categoryId: number;
    finishDate: Date;
    description: string;
}