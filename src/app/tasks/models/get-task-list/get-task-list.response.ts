import { CategoryState } from "../category-status.enum";
import { TaskState } from "../task-status.enum";


export interface GetTaskListResponse {
    tasks: GetTaskListItemResponse[];
    totalElements: number;
    page: number;
    pageSize: number;
}

export interface GetTaskListItemResponse {
    id:number;
    house: string;
    name: string;
    description: string;
    category: CategoryState;
    state: TaskState;
    createdAt: Date;
    finishDate: Date;

    // TODO: Hablar con ángel si esto debería ser una FK de la tabla users o no vamos a necesitar navegar tanto
    assignedTo: string;
    assignedBy: string;

    //FKs
    categoryId: number;
    houseId: number;
}