import { CategoryState } from "../category-status.enum";
import { TaskState } from "../task-status.enum";

export interface GetActiveTasksListByHouseIdResponse {
    id:number;
    house: string;
    name: string;
    description: string;
    category: CategoryState;
    state: TaskState;
    createdAt: Date;
    finishDate: Date;
}