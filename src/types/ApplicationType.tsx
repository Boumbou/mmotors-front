import type { ListingType, VehicleType } from "./VehicleType"

export type ApplicationType = {
    applicationServices: any[]
    applicationType: ListingType
    createdAt: string
    documents: Array<{}>
    id: number
    reviewedByUserId: string | null
    status: ApplicationStatus
    totalAmount: number
    updatedAt: string
    userId: string
    vehicleId: number
    vehicle: VehicleType,
    customer: {
        name: string,
        lastName: string,
        email: string
    }
}

export const ApplicationStatus ={
    Draft : 0,
    OnHold : 1,
    Submitted : 2,
    Approved : 3,
    Rejected : 4
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export const ApplicationStatusMap: { [key in ApplicationStatus]: {label: string, color: string} } = {
    [ApplicationStatus.Draft]: {label:"Brouillon", color: "gray"},
    [ApplicationStatus.OnHold]: {label:"En attente", color: "yellow"},
    [ApplicationStatus.Submitted]: {label:"Soumis", color: "blue"},
    [ApplicationStatus.Approved]: {label:"Approuvé", color: "green"},
    [ApplicationStatus.Rejected]: {label:"Rejeté", color: "red"}
}