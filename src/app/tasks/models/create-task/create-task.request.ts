import { CategoryState } from "../category-status.enum";

export interface CreateTaskRequest {
  name:string;
  description: string;
  creationDate: Date;
  deadlineDate: Date;
  assignedTo: string;
  assignedBy: string;
  houseId: number;
  categoryId: CategoryState;

}
