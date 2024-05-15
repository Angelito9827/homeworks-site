import { NumberSymbol } from "@angular/common";
import { CategoryState } from "../category-status.enum";
import { TaskState } from "../task-status.enum";

export interface GetActiveTasksListResponse {
    tasks: GetActiveTasksListByHouseIdResponse[];
}

export interface GetActiveTasksListByHouseIdResponse {
    id:number;
    house: string;
    name: string;
    description: string;
    category: CategoryState;
    totalActiveTasks: number;
    state: TaskState;
    createdAt: Date;
    finishDate: Date;
    icon: FormData;
}