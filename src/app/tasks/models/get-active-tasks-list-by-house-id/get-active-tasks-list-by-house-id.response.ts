import { TaskState } from "../task-status.enum";

export interface GetAllTasksResponse {
    tasks: GetAllTasksListItemResponse[];
}

export interface GetAllTasksListItemResponse {
    totalActiveTasks: number;
    assignedToImage: string;
    id:number;
    name: string;
    description: string;
    state: TaskState;
    creationDate: Date;
    deadlineDate: Date;

    assignedTo: string;
    assignedBy: string;

    category:{
        id: number;
        name: string;
        description: string;
        icon: FormData;
    }
  
    house:{
        id: number;
        name: string;
        description: string;
        address: string;
        profileImage: string;
    }
}