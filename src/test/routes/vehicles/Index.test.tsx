import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import Vehicles from "@/routes/vehicles/Index";

// Keep search params mutable so tests can exercise toggle and paging behavior.
let params = new URLSearchParams("type=achats&pagenumber=1&pagesize=20");

// Mock network calls at the page boundary.
const fetchMock = vi.fn();

// Capture pushState calls so URL updates can be asserted.
const pushStateMock = vi.fn();

// Replace the router search param hook with a stable test double.
vi.mock("react-router", () => ({
  useSearchParams: () => [params],
}));

// Replace the toggle group with simple buttons that invoke the same callback.
vi.mock("@/components/ui/toggle-group", () => ({
  ToggleGroup: ({ children, onValueChange }: { children: React.ReactNode; onValueChange: (value: string | undefined) => void }) => (
    <div>
      {React.Children.map(children, (child) =>
        {
            if(React.isValidElement(child)){
                const originalProps = child.props as React.ComponentProps<any>
                const value:string = String(originalProps.value)  || ""; 
                return React.cloneElement(child, {
                    ...originalProps,
                onClick: () => onValueChange(String(value)),
                'data-value': String(value), 
                });

            }

            return child


        }
      )}
    </div>
  ),
  ToggleGroupItem: ({ value, children, onClick }: { value: string; children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick} data-value={value}>{children}</button>
  ),
}));

// Replace pagination with a focused button that triggers page 2.
vi.mock("@/components/pagination/MmotorsPagination", () => ({
  default: ({ onPageChange }: { onPageChange: (page: number) => void }) => (
    <button type="button" onClick={() => onPageChange(2)}>next page</button>
  ),
}));

// Replace card rendering so the test stays focused on page behavior.
vi.mock("@/routes/vehicles/components/VehicleCard", () => ({
  default: ({ vehicle }: { vehicle: { brand: string; model: string } }) => (
    <div>{vehicle.brand} {vehicle.model}</div>
  ),
}));

// Replace the skeleton with a simple loading marker.
vi.mock("@/routes/vehicles/components/VehicleListSkeleton", () => ({
  default: () => <div>loading vehicles</div>,
}));

// Install the global fetch stub used by the page effect.
vi.stubGlobal("fetch", fetchMock);

// Reuse a small vehicle response so assertions stay deterministic.
const vehicleResponse = {
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
  totalCount: 1,
  pageNumber: 1,
  pageSize: 20,
  totalPages: 3,
};

// Build a deferred promise so the loading state can be observed.
const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

// Cover the vehicles page fetch, empty, and paging behaviors.
describe("Vehicles page", () => {
  // Reset the mutable router and global mocks between scenarios.
  beforeEach(() => {
    params = new URLSearchParams("type=achats&pagenumber=1&pagesize=20");
    fetchMock.mockReset();
    pushStateMock.mockReset();
    window.history.pushState = pushStateMock;
  });

  // Restore the global fetch stub after this file completes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify the page shows loading first and then renders fetched vehicles.
  it("shows loading and then renders fetched vehicles", async () => {
    const deferred = createDeferred<{ json: () => Promise<typeof vehicleResponse> }>();

    fetchMock.mockReturnValueOnce(deferred.promise);

    render(<Vehicles />);

    expect(screen.getByText("loading vehicles")).toBeInTheDocument();

    deferred.resolve({
      json: vi.fn().mockResolvedValue(vehicleResponse),
    });

    expect(await screen.findByText("Peugeot 208")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/vehicles?type=sale&pagenumber=1&pagesize=20");
  });

  // Verify the page shows the fallback image when the API returns no items.
  it("shows the empty-state image when no vehicles are returned", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
      }),
    });

    render(<Vehicles />);

    expect(await screen.findByAltText("No results")).toBeInTheDocument();
  });

  // Verify paging updates the URL and fetches the requested page.
  it("updates the URL and fetches the next page", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(vehicleResponse),
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          ...vehicleResponse,
          pageNumber: 2,
        }),
      });

    render(<Vehicles />);

    await screen.findByText("Peugeot 208");
    await user.click(screen.getByRole("button", { name: "next page" }));

    await waitFor(() => {
      expect(pushStateMock).toHaveBeenCalledWith(
        null,
        "",
        "/vehicles?type=achats&pagenumber=2&pagesize=20",
      );
    });
    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith("/api/vehicles?type=sale&pagenumber=2&pagesize=20");
    });
  });

  // Verify toggling to rentals rewrites the URL and refetches rental vehicles.
  it("updates the URL and refetches when the transaction type changes", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(vehicleResponse),
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          ...vehicleResponse,
          items: [
            {
              ...vehicleResponse.items[0],
              id: 2,
              model: "3008",
              listingType: 1,
            },
          ],
        }),
      });

    render(<Vehicles />);

    await screen.findByText("Peugeot 208");
    await user.click(screen.getByRole("button", { name: "Locations" }));

    await waitFor(() => {
      expect(pushStateMock).toHaveBeenCalledWith(
        null,
        "",
        "/vehicles?type=locations&pagenumber=1&pagesize=20",
      );
    });
    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith("/api/vehicles?type=rental&pagenumber=1&pagesize=20");
    });
    expect(await screen.findByText("Peugeot 3008")).toBeInTheDocument();
  });
});