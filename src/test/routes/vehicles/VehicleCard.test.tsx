import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import VehicleCard from "@/routes/vehicles/components/VehicleCard";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

// Mock framer-motion to avoid unnecessary rendering issues during tests.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

// Test suite for the VehicleCard component.
describe("VehicleCard", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });
  // Test case to check if the vehicle details are rendered
  it("renders vehicle details and navigates to the details page", async () => {
    const user = userEvent.setup();

    render(
      <VehicleCard
        vehicle={{
          id: 42,
          brand: "Peugeot",
          model: "208",
          year: 2024,
          motorization: 0,
          mileage: 12000,
          listedAmount: 21990,
          listingType: 0,
          status: 0,
          imageUrl: null,
        }}
        searchParams="type=achats&pagenumber=1"
      />,
    );

    // assert results
    expect(screen.getByAltText("Peugeot 208")).toHaveAttribute("src", "/NoPicture.png");
    expect(screen.getByText("Disponible")).toBeInTheDocument();
    expect(screen.getByText("12,000 km")).toBeInTheDocument();
    expect(screen.getByText("21,990 €")).toBeInTheDocument();

    await user.click(screen.getByText("Peugeot 208"));
    expect(navigateMock).toHaveBeenCalledWith("/catalogue/vehicle/42?type=achats&pagenumber=1", {});
  });
});