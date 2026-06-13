import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import VehicleListSkeleton from "@/routes/vehicles/components/VehicleListSkeleton";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="vehicle-skeleton" />,
}));

// Test suite for the VehicleListSkeleton component.
describe("VehicleListSkeleton", () => {
  it("renders five skeleton placeholders", () => {
    render(<VehicleListSkeleton />);

    expect(screen.getAllByTestId("vehicle-skeleton")).toHaveLength(5);
  });
});