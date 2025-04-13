import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { analyzeUrl } from "./utils/urlAnalyzer";

const urlSchema = z.object({
  url: z.string().url("Please provide a valid URL")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to scan a URL
  app.post("/api/scan", async (req, res) => {
    try {
      // Validate the URL
      const { url } = urlSchema.parse(req.body);
      
      // Check if we already have this URL in recent scans
      const existingScan = await storage.getRecentScanByUrl(url);
      
      if (existingScan) {
        // If URL was recently scanned, return the cached result
        return res.json(existingScan);
      }
      
      // Analyze the URL for phishing indicators
      const result = await analyzeUrl(url);
      
      // Store the scan result
      await storage.saveScan(result);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid URL", 
          errors: error.errors.map(e => e.message)
        });
      }
      
      console.error("Error scanning URL:", error);
      res.status(500).json({ message: "Failed to scan URL" });
    }
  });

  // Get recent scan history
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getRecentScans(10);
      res.json(history);
    } catch (error) {
      console.error("Error getting scan history:", error);
      res.status(500).json({ message: "Failed to retrieve scan history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
