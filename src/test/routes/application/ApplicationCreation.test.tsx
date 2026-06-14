import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ApplicationCreation from "@/routes/application/components/ApplicationCreation";
import type { VehicleType } from "@/types/VehicleType";

// Reuse one sale vehicle so the tests stay focused on rendered behavior.
const saleVehicle: VehicleType = {
  id: 42,
  brand: "Peugeot",
  model: "208",
  year: 2024,
  motorization: 2,
  mileage: 12000,
  listedAmount: 24000,
  listingType: 0,
  status: 0,
  imageUrl: null,
};

// Reuse one rental vehicle to cover the alternate pricing branch.
const rentalVehicle:VehicleType = {
  ...saleVehicle,
  listingType: 1,
  rentalTermMonths: 36,
  listedAmount: 600,
};

// Reuse services so the tests can assert displayed labels and totals.
const services = [
  { id: 1, name: "Livraison", overheadType: 1, overheadValue: 300 },
  { id: 2, name: "Garantie", overheadType: 0, overheadValue: 0.1 },
];

// Keep the displayed overhead values deterministic across assertions.
const calculateOverhead = vi.fn((service: { id: number }) =>
  service.id === 1 ? 300 : 2400,
);

// Group the component's purchase and rental behaviors in one focused suite.
describe("ApplicationCreation", () => {
  // Verify the sale flow renders the summary and triggers application creation.
  it("renders a sale summary and submits the application", async () => {
    const user = userEvent.setup();
    const onCreateApplication = vi.fn();

    render(
      <ApplicationCreation
        vehicle={saleVehicle}
        services={services}
        totalOverhead={2700}
        calculateOverhead={calculateOverhead}
        onCreateApplication={onCreateApplication}
      />,
    );

    expect(screen.getByText("Nouveau dossier de vente")).toBeInTheDocument();
    expect(screen.getByText("Peugeot 208 Électrique")).toBeInTheDocument();
    expect(screen.getByText("Achat immédiat")).toBeInTheDocument();
    expect(screen.getByText("Livraison")).toBeInTheDocument();
    expect(screen.getByText("Garantie")).toBeInTheDocument();
    expect(screen.getByText("Prix total de l'achat")).toBeInTheDocument();
    expect(screen.getByText("26,700.00€")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Poursuivre ma demande/i }));

    expect(onCreateApplication).toHaveBeenCalledTimes(1);
  });

  // Verify the rental flow renders monthly and total pricing information.
  it("renders rental-specific monthly and total amounts", () => {
    render(
      <ApplicationCreation
        vehicle={rentalVehicle}
        services={services}
        totalOverhead={2700}
        calculateOverhead={calculateOverhead}
        onCreateApplication={vi.fn()}
      />,
    );

    expect(screen.getByText("Nouveau dossier de location")).toBeInTheDocument();
    expect(screen.getByText("36 mois")).toBeInTheDocument();
    expect(screen.getByText("Mensualité")).toBeInTheDocument();
    expect(screen.getByText("Montant total")).toBeInTheDocument();
    expect(screen.getByText("3,300.00€")).toBeInTheDocument();
    expect(screen.getByText("118,800.00€")).toBeInTheDocument();
  });
});