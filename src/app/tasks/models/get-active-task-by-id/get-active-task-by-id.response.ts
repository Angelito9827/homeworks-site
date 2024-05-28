import { TaskState } from "../task-status.enum";

export interface GetTaskByIdResponse {
    id:number;
    house: string;
    name: string;
    description: string;
    category: number;
    state: TaskState;
    assignedTo: string;
    assignedBy: string;
    createdAt: Date;
    finishDate: Date;
}