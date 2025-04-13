import { pgTable, text, serial, jsonb, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (from original file)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// URL Scan schema
export const urlScans = pgTable("url_scans", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  scanDate: timestamp("scan_date").defaultNow().notNull(),
  resultStatus: text("result_status").notNull(), // 'safe', 'suspicious', 'phishing'
  riskScore: integer("risk_score").notNull(), // 0-100
  detectionResults: jsonb("detection_results").notNull(),
});

export const insertUrlScanSchema = createInsertSchema(urlScans).omit({
  id: true,
  scanDate: true,
});

export type InsertUrlScan = z.infer<typeof insertUrlScanSchema>;
export type UrlScan = typeof urlScans.$inferSelect;

// Detection Result Type
export type DetectionResult = {
  title: string;
  description: string;
  status: "passed" | "failed" | "warning";
};

// Scan Result Type (returned from API)
export type ScanResult = {
  url: string;
  domain: string;
  resultStatus: "safe" | "suspicious" | "phishing";
  resultTitle: string;
  resultSubtitle: string;
  riskScore: number; // 0-100
  detectionResults: DetectionResult[];
};

// Scan History Item Type (for the frontend)
export type ScanHistoryItem = {
  url: string;
  domain: string;
  status: "safe" | "suspicious" | "phishing";
  time: string;
};
