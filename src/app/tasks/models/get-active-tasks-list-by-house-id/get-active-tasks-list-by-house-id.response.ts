import { NumberSymbol } from "@angular/common";
import { CategoryState } from "../category-status.enum";
import { TaskState } from "../task-status.enum";

export interface GetAllTasksResponse {
    tasks: GetAllTasksListItemResponse[];
}

export interface GetAllTasksListItemResponse {
    id:number;
    house: string;
    name: string;
    description: string;
    categoryId: number;
    totalActiveTasks: number;
    state: TaskState;
    createdAt: Date;
    finishDate: Date;
    icon: FormData;
}