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
    motorization: string; // this is a string because it is an enum in the backend
    mileage: number;
    listedAmount: number;
    rentalTermMonths?: number|null; // this is optional because it is only for RENTAL
    listingType: number; // this is a string because it is an enum in the backend
    status: string; // this is a string because it is an enum in the backend
    imageUrl?: string|null; // this is optional because it can be null
    imageKey?: string|null; // this is optional because it can be null
}
