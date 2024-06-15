import { TaskState } from "../task-status.enum";

export interface GetAllTasksRequest {
    houseId:number;
    categoryId?: number;
    taskState?: TaskState;
}