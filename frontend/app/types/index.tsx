export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string;
}