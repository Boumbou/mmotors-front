/*
    * this file defines the type of the vehicle object
    * it is used in the vehicles page and in the vehicle details page
    * it is also used in the vehicle form page
*/

/*
    public int Id { get; set; }
    public string Brand { get; set; }
    public string Model { get; set; }
    public int Year { get; set; }
    public Motorization Motorization { get; set; }
    public int Mileage { get; set; }
    public decimal ListedAmount { get; set; }
    public RentalTerm? RentalTermMonths { get; set; } // Nullable, only for RENTAL
    public ListingType ListingType { get; set; } // SALE or RENTAL
    public VehicleStatus Status { get; set; } // AVAILABLE, SOLD, RENTED
    public string? ImageUrl { get; set; }
    public string? ImageKey { get; set; }
*/


export type VehicleType = {
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