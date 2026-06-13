import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import useStore from "@/routes/auth/userStore";

// Mock network calls at the fetch boundary used by the auth store.
const fetchMock = vi.fn();

// Build a minimal JSON response shape for login and register requests.
const jsonResponse = (data: unknown) => ({
  json: vi.fn().mockResolvedValue(data),
});

// Build a minimal fetch response shape for logout requests.
const simpleResponse = (ok: boolean) => ({ ok });

// Reuse one normalized user payload across store scenarios.
const apiUser = {
  id: 42,
  created: "2026-06-13T10:00:00.000Z",
  email: "jean@example.com",
  name: "Jean",
  lastName: "Dupont",
};

// Reset store state and persisted storage so tests stay isolated.
const resetAuthStore = () => {
  useStore.setState({ user: null });
  window.localStorage.clear();
};

// Install the global fetch stub once for this focused test file.
vi.stubGlobal("fetch", fetchMock);

// Exercise only the public auth actions exposed by the store.
describe("userStore", () => {
  // Clear all persisted and mocked state before each scenario.
  beforeEach(() => {
    fetchMock.mockReset();
    resetAuthStore();
  });

  // Restore the global stub after the file finishes.
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  // Verify login stores the normalized user and returns the success message.
  it("logs in a user and stores the normalized profile", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        result: { succeeded: true },
        user: apiUser,
        roles: ["Customer"],
      }),
    );

    const result = await useStore.getState().login("jean@example.com", "secret123");

    expect(result).toBe("Connexion réussie");
    expect(fetchMock).toHaveBeenCalledWith("/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: "jean@example.com", Password: "secret123" }),
    });
    expect(useStore.getState().user).toEqual({
      ...apiUser,
      roles: ["Customer"],
    });
  });

  // Verify login keeps state empty and rejects on API failure.
  it("rejects login when the API reports failure", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        result: { succeeded: false },
      }),
    );

    await expect(
      useStore.getState().login("jean@example.com", "wrong-password"),
    ).rejects.toThrow(
      "Oops nous n'avons pas pu vous connecter, veuillez vérifier vos identifiants et réessayer.",
    );
    expect(useStore.getState().user).toBeNull();
  });

  // Verify registration stores the normalized user and returns the success message.
  it("registers a user and stores the normalized profile", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        result: { succeeded: true },
        user: apiUser,
        roles: ["Customer"],
      }),
    );

    const result = await useStore
      .getState()
      .register("jean@example.com", "secret123", "Jean", "Dupont");

    expect(result).toBe("Inscription réussie");
    expect(fetchMock).toHaveBeenCalledWith("/api/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: "jean@example.com",
        Password: "secret123",
        Name: "Jean",
        LastName: "Dupont",
      }),
    });
    expect(useStore.getState().user).toEqual({
      ...apiUser,
      roles: ["Customer"],
    });
  });

  // Verify registration keeps state empty and rejects on API failure.
  it("rejects registration when the API reports failure", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        result: { succeeded: false },
      }),
    );

    await expect(
      useStore
        .getState()
        .register("jean@example.com", "secret123", "Jean", "Dupont"),
    ).rejects.toThrow(
      "Oops nous n'avons pas pu vous inscrire, veuillez vérifier vos informations et réessayer.",
    );
    expect(useStore.getState().user).toBeNull();
  });

  // Verify logout clears the stored user after a successful API call.
  it("logs out the current user and clears the store", async () => {
    useStore.setState({
      user: {
        ...apiUser,
        roles: ["Customer"],
      },
    });
    fetchMock.mockResolvedValueOnce(simpleResponse(true));

    const result = await useStore.getState().logout();

    expect(result).toBe("Déconnexion réussie");
    expect(fetchMock).toHaveBeenCalledWith("/api/account/logout", {
      method: "POST",
      credentials: "include",
    });
    expect(useStore.getState().user).toBeNull();
  });
});