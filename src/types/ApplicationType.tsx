import type { ServiceType } from "./ServiceType"
import type { ListingType } from "./VehicleType"

export type ApplicationType = {
    applicationServices: ServiceType[]
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
}

export const ApplicationStatus ={
    Draft : 0,
    OnHold : 1,
    Submitted : 2,
    Approved : 3,
    Rejected : 4
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export const ApplicationStatusMap: { [key in ApplicationStatus]: string } = {
    [ApplicationStatus.Draft]: "Brouillon",
    [ApplicationStatus.OnHold]: "En attente",
    [ApplicationStatus.Submitted]: "Soumis",
    [ApplicationStatus.Approved]: "Approuvé",
    [ApplicationStatus.Rejected]: "Rejeté"
}