import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PropertyInput {
    title: string;
    video?: ExternalBlob;
    description: string;
    price?: bigint;
    location?: string;
    images: Array<string>;
}
export interface Property {
    id: bigint;
    title: string;
    video?: ExternalBlob;
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
    createProperty(input: PropertyInput): Promise<Property>;
    deleteProperty(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProperty(_id: bigint): Promise<Property | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantAdmin(user: Principal): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listProperties(): Promise<Array<Property>>;
    revokeAdmin(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProperty(id: bigint, input: PropertyInput): Promise<Property>;
}
