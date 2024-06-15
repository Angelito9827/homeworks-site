export interface EditPerfilRequest {
    id:number;
    nickName: string;
    profilePicture: FormData;
    name: string;
    lastName: string;
    email: string;
    tlf: number;
    password: string
}