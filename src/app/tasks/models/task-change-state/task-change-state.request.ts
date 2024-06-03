import { TaskState } from "../task-status.enum";

export interface TaskChangeStateRequest {
    id:number;
    state: TaskState;
}