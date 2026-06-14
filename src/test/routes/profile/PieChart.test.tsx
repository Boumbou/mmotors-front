import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChartPieDonutText } from "@/routes/profile/components/PieChart";

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => <div>tooltip</div>,
  ChartTooltipContent: () => <div>tooltip content</div>,
}));

vi.mock("recharts", () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Label: ({ content }: { content: (args: { viewBox: { cx: number; cy: number } }) => React.ReactNode }) => (
    <div>{content({ viewBox: { cx: 50, cy: 50 } })}</div>
  ),
}));

describe("ChartPieDonutText", () => {
  it("aggregates application counts by status and renders the total", () => {
    render(
      <ChartPieDonutText
        title="Répartition des dossiers"
        data={[
          {
            id: 1,
            applicationServices: [],
            applicationType: 0,
            createdAt: "2026-06-13T10:00:00.000Z",
            documents: [],
            reviewedByUserId: null,
            rejectionReason: "",
            status: 0,
            totalAmount: 0,
            updatedAt: "2026-06-13T10:00:00.000Z",
            userId: "u1",
            vehicleId: 1,
            vehicle: { id: 1, brand: "Peugeot", model: "208", year: 2024, motorization: 0, mileage: 0, listedAmount: 0, listingType: 0, status: 0 },
            customer: { name: "Ari", lastName: "Martin", email: "ari@example.com" },
          },
          {
            id: 2,
            applicationServices: [],
            applicationType: 0,
            createdAt: "2026-06-13T10:00:00.000Z",
            documents: [],
            reviewedByUserId: null,
            rejectionReason: "",
            status: 2,
            totalAmount: 0,
            updatedAt: "2026-06-13T10:00:00.000Z",
            userId: "u1",
            vehicleId: 1,
            vehicle: { id: 1, brand: "Peugeot", model: "208", year: 2024, motorization: 0, mileage: 0, listedAmount: 0, listingType: 0, status: 0 },
            customer: { name: "Ari", lastName: "Martin", email: "ari@example.com" },
          },
          {
            id: 3,
            applicationServices: [],
            applicationType: 0,
            createdAt: "2026-06-13T10:00:00.000Z",
            documents: [],
            reviewedByUserId: null,
            rejectionReason: "",
            status: 2,
            totalAmount: 0,
            updatedAt: "2026-06-13T10:00:00.000Z",
            userId: "u1",
            vehicleId: 1,
            vehicle: { id: 1, brand: "Peugeot", model: "208", year: 2024, motorization: 0, mileage: 0, listedAmount: 0, listingType: 0, status: 0 },
            customer: { name: "Ari", lastName: "Martin", email: "ari@example.com" },
          },
        ]}
      />,
    );

    expect(screen.getByText("Répartition des dossiers")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Dossiers")).toBeInTheDocument();
    expect(screen.getByText("Sur l'ensemble des dossiers en cours")).toBeInTheDocument();
  });

  it("renders a zero total when no data is provided", () => {
    render(<ChartPieDonutText title="Répartition vide" />);

    expect(screen.getByText("Répartition vide")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});