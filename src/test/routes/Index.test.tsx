import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "@/routes/Index";

// Expose navigation calls so the CTA behavior can be asserted.
const mockNavigate = vi.fn();

// Mock network calls at the page boundary.
const fetchMock = vi.fn();

// Replace router navigation with a stable test double.
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Replace the card component so the test stays focused on page behavior.
vi.mock("@/routes/vehicles/components/VehicleCard", () => ({
  default: ({ vehicle }: { vehicle: { brand: string; model: string } }) => (
    <div>{vehicle.brand} {vehicle.model}</div>
  ),
}));

// Install the global fetch stub used by the page effect.
vi.stubGlobal("fetch", fetchMock);

// Reuse one vehicle payload so fetch-driven rendering stays deterministic.
const vehiclesResponse = {
  items: [
    {
      id: 1,
      brand: "Peugeot",
      model: "208",
      year: 2024,
      motorization: 2,
      mileage: 12000,
      listedAmount: 24000,
      listingType: 0,
      status: 0,
    },
  ],
};

// Group the home page fetch and navigation behaviors in one suite.
describe("Home", () => {
  // Reset global mocks between scenarios.
  beforeEach(() => {
    mockNavigate.mockReset();
    fetchMock.mockReset();
  });

  // Restore the global fetch stub after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify the page fetches and renders the latest vehicle offers.
  it("fetches and renders the latest vehicles", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(vehiclesResponse),
    });

    render(<Home />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/vehicles?pagesize=20&pagenumber=1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
    expect(screen.getByText("Peugeot 208")).toBeInTheDocument();
  });

  // Verify the page shows the empty fallback when no vehicles are returned.
  it("shows an empty state when no latest offers are returned", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ items: [] }),
    });

    render(<Home />);

    expect(
      await screen.findByText("Aucune offre disponible pour le moment."),
    ).toBeInTheDocument();
  });

  // Verify the main CTA buttons navigate to the expected catalogue filters.
  it("navigates to the sale and rental catalogue filters", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ items: [] }),
    });

    render(<Home />);

    await user.click(screen.getByRole("button", { name: /location/i }));
    await user.click(screen.getByRole("button", { name: /vente/i }));

    expect(mockNavigate).toHaveBeenNthCalledWith(
      1,
      "/catalogue?type=locations&pagenumber=1&pagesize=20",
    );
    expect(mockNavigate).toHaveBeenNthCalledWith(
      2,
      "/catalogue?type=achats&pagenumber=1&pagesize=20",
    );
  });
});