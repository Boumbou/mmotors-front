import { render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminSetting } from "@/routes/profile/components/AdminSetting";

const fetchMock = vi.fn();

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/routes/profile/components/ServicesList", () => ({
  ServicesList: ({ services }: { services: Array<{ id: number; name: string }> }) => (
    <div>services count {services.length}</div>
  ),
}));

vi.mock("@/routes/profile/components/DocTemplateList", () => ({
  DocTemplateList: () => <div>document templates</div>,
}));

vi.stubGlobal("fetch", fetchMock);

describe("AdminSetting", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("loads services and renders the admin sections", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue([{ id: 1, name: "Garantie" }]),
    });

    render(<AdminSetting />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/services", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    expect(await screen.findByText("services count 1")).toBeInTheDocument();
    expect(screen.getByText("Gérer les services")).toBeInTheDocument();
    expect(screen.getByText("document templates")).toBeInTheDocument();
    expect(screen.getByText("Section en construction...")).toBeInTheDocument();
  });
});