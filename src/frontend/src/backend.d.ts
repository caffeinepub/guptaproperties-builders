import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Property {
    id: bigint;
    title: string;
    video?: string;
    description: string;
    price?: bigint;
    location?: string;
    images: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProperty(title: string, description: string, price: bigint | null, location: string | null, images: Array<string>, video: string | null): Promise<Property>;
    deleteProperty(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProperty(_id: bigint): Promise<Property | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listProperties(): Promise<Array<Property>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProperty(id: bigint, title: string, description: string, price: bigint | null, location: string | null, images: Array<string>, video: string | null): Promise<Property>;
}
