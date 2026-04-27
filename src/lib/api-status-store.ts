import { create } from "zustand";

export type ApiStatus = "connected" | "disconnected" | "error" | "loading";

interface ApiStatusStore {
  status: ApiStatus;
  lastCheck: Date | null;
  errorMessage: string | null;
  setStatus: (status: ApiStatus, errorMessage?: string) => void;
  checkHealth: () => Promise<void>;
}

export const useApiStatusStore = create<ApiStatusStore>((set, get) => ({
  status: "loading",
  lastCheck: null,
  errorMessage: null,

  setStatus: (status, errorMessage) => set({ status, errorMessage, lastCheck: new Date() }),

  checkHealth: async () => {
    set({ status: "loading", errorMessage: null });
    try {
      const response = await fetch("http://localhost:8000/health", {
        method: "GET",
        signal: AbortSignal.timeout(5000), // Timeout après 5 secondes
      });

      if (response.ok) {
        set({ status: "connected", errorMessage: null, lastCheck: new Date() });
      } else {
        set({ 
          status: "error", 
          errorMessage: "API non disponible (erreur HTTP)", 
          lastCheck: new Date() 
        });
      }
    } catch (error) {
      let message = "API non disponible";
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          message = "API non disponible (timeout)";
        } else if (error.message.includes("fetch")) {
          message = "Impossible de contacter l'API";
        } else {
          message = error.message;
        }
      }
      set({ status: "disconnected", errorMessage: message, lastCheck: new Date() });
    }
  },
}));
