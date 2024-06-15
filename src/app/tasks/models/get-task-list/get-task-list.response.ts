import { CategoryState } from "../category-status.enum";
import { TaskState } from "../task-status.enum";


export interface GetTaskListResponse {
    elements: GetTaskListItemResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface GetTaskListItemResponse {
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
        icon: string;
    }
  
    house:{
        id: number;
        name: string;
        description: string;
        address: string;
        profileImage: string;
    }
   
   
}