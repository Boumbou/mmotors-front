import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import VehicleManagementList from "@/routes/profile/components/VehicleManagementList";

// Mock network calls at the list boundary.
const fetchMock = vi.fn();

// Replace the router link with a simple anchor wrapper.
vi.mock("react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

// Replace the table with a simple marker that exposes vehicle count.
vi.mock("@/routes/profile/components/VehicleTable", () => ({
  default: ({ vehicles }: { vehicles: Array<{ brand: string }> }) => (
    <div>{vehicles.map((vehicle) => vehicle.brand).join(", ") || "no vehicles"}</div>
  ),
}));

// Replace pagination with a direct next-page button.
vi.mock("@/components/pagination/MmotorsPagination", () => ({
  default: ({ onPageChange }: { onPageChange: (page: number) => void }) => (
    <button type="button" onClick={() => onPageChange(2)}>next page</button>
  ),
}));

// Replace the motion wrapper with a passthrough container.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

// Install the global fetch stub used by the page effect and pagination callback.
vi.stubGlobal("fetch", fetchMock);

// Reuse one paged vehicle response so assertions stay deterministic.
const pageOne = {
  items: [{ id: 42, brand: "Peugeot" }],
  totalCount: 1,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 2,
};

// Cover the initial load and pagination callback behavior.
describe("VehicleManagementList", () => {
  // Reset shared fetch mocks between scenarios.
  beforeEach(() => {
    fetchMock.mockReset();
  });

  // Restore the global fetch stub after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify the component fetches and renders the first page of vehicles.
  it("fetches and renders the first page of vehicles", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(pageOne),
    });

    render(<VehicleManagementList />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/vehicles?pagenumber=1&pageSize=10", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
    expect(await screen.findByText("Peugeot")).toBeInTheDocument();
    expect(screen.getByText("Ajouter un véhicule")).toBeInTheDocument();
  });

  // Verify the pagination callback requests the selected page.
  it("fetches a new page when pagination changes", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(pageOne),
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          ...pageOne,
          pageNumber: 2,
        }),
      });

    render(<VehicleManagementList />);

    await screen.findByText("Peugeot");
    await user.click(screen.getByRole("button", { name: "next page" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith("/api/vehicles?pagenumber=2&pageSize=10", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });
});