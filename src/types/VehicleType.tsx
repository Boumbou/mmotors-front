/*
    * this file defines the type of the vehicle object
    * it is used in the vehicles page and in the vehicle details page
    * it is also used in the vehicle form page
*/

import type { ApplicationType } from "./ApplicationType";


export type VehicleListResponse = {
    items: VehicleType[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export type VehicleType = Record<string, any> & {
    id: number;
    brand: string;
    model: string;
    year: number;
    motorization: Motorization; // this is a string because it is an enum in the backend
    mileage: number;
    listedAmount: number;
    rentalTermMonths?: number|null; // this is optional because it is only for RENTAL
    listingType: ListingType; // this is an enum
    status: VehicleStatus; // this is an enum
    imageUrl?: string|null; // this is optional because it can be null
    imageKey?: string|null; // this is optional because it can be null
    applications?: ApplicationType[]; // this is optional because it is only for RENTAL
}

export const ListingType = {
  SALE: 0,
  RENTAL: 1,
} as const;

export const listingTypeLabels: Record<ListingType, string> = {
  [ListingType.SALE]: "Achat",
  [ListingType.RENTAL]: "Location",
};

export type ListingType = typeof ListingType[keyof typeof ListingType];

export const VehicleStatus = {
  AVAILABLE: 0,
  SOLD: 1,
  RENTED: 2,
} as const;

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  [VehicleStatus.AVAILABLE]: "Disponible",
  [VehicleStatus.SOLD]: "Vendu",
  [VehicleStatus.RENTED]: "Loué",
};

export type VehicleStatus = typeof VehicleStatus[keyof typeof VehicleStatus];

export const motorization= {
    Petrol:0,
    Diesel:1,
    Electric:2,
    Hybrid:3
} as const;

export const motorizationLabels: Record<typeof motorization[keyof typeof motorization], string> = {
    [motorization.Petrol]: "Essence",
    [motorization.Diesel]: "Diesel",
    [motorization.Electric]: "Électrique",
    [motorization.Hybrid]: "Hybride"
};

export type Motorization = typeof motorization[keyof typeof motorization];