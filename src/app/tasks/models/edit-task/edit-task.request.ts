export interface EditTaskRequest {
    id:number;
    name: string;
    assignedTo: number;
    categoryId: number;
    deadlineDate: Date;
    description: string;
}