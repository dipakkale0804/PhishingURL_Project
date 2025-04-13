import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ScanResult } from "@shared/schema";

export function usePhishingDetector() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const checkUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest("POST", "/api/scan", { url });
        const data = await response.json() as ScanResult;
        setResult(data);
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  });

  return {
    checkUrl: checkUrlMutation.mutate,
    isLoading,
    error,
    result,
    reset: () => {
      setResult(null);
      setError(null);
    }
  };
}
