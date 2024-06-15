export interface CreateTaskRequest {
  
    name: string;
    description: string;
    deadlineDate: string; // Asegúrate de que el formato sea el esperado por tu backend
    assignedTo: string;
    categoryId: number;
    houseId: number;
}