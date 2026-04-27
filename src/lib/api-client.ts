// Client TypeScript pour l'API FastAPI Simplex
// Utilise le client généré par openapi-typescript-codegen

import { OpenAPI, DefaultService } from './api-generated';
import type { SimplexRequest, SimplexResponse } from './api-generated';
import { useApiStatusStore } from './api-status-store';

// Configuration de l'URL de base de l'API
OpenAPI.BASE = 'http://localhost:8000';

class SimplexAPIClient {
  private checkHealth = useApiStatusStore.getState().checkHealth;

  async solve(request: SimplexRequest): Promise<SimplexResponse> {
    // Vérifier la connexion avant d'envoyer la requête
    await this.checkHealth();
    
    const status = useApiStatusStore.getState().status;
    if (status !== "connected") {
      throw new Error("L'API n'est pas disponible. Veuillez vérifier que le serveur est démarré.");
    }

    try {
      return await DefaultService.solveSolvePost(request);
    } catch (error) {
      // Marquer l'API comme déconnectée en cas d'erreur
      useApiStatusStore.getState().setStatus("disconnected", "Erreur de communication avec l'API");
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string }> {
    try {
      const result = await DefaultService.healthHealthGet();
      useApiStatusStore.getState().setStatus("connected");
      return result;
    } catch (error) {
      useApiStatusStore.getState().setStatus("disconnected", "Impossible de contacter l'API");
      throw error;
    }
  }
}

export const simplexAPI = new SimplexAPIClient();

// Réexporter les types pour faciliter l'utilisation
export type { SimplexRequest, SimplexResponse } from './api-generated';
export type { Constraint } from './api-generated';
