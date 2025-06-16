export interface LoginResponse{
    tokenType:string;
    accessToken:string
}


export interface LoginPayload{
     email:string;
     password:string;

}