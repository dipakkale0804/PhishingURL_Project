import { urlScans, type InsertUrlScan, type UrlScan, type ScanResult, type ScanHistoryItem } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods (from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // URL Scan methods
  saveScan(scan: ScanResult): Promise<void>;
  getRecentScanByUrl(url: string): Promise<ScanResult | null>;
  getRecentScans(limit: number): Promise<ScanHistoryItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scans: ScanResult[];
  currentUserId: number;

  constructor() {
    this.users = new Map();
    this.scans = [];
    this.currentUserId = 1;
  }

  // User methods (from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // URL Scan methods
  async saveScan(scan: ScanResult): Promise<void> {
    // Add to the beginning of the array for most recent first
    this.scans.unshift(scan);
    
    // Keep only the last 100 scans to prevent memory bloat
    if (this.scans.length > 100) {
      this.scans = this.scans.slice(0, 100);
    }
  }

  async getRecentScanByUrl(url: string): Promise<ScanResult | null> {
    // Look for a scan of this URL in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // This is a simplified approach - we'd need to add timestamps to scans for a real implementation
    const recentScan = this.scans.find(scan => scan.url === url);
    return recentScan || null;
  }

  async getRecentScans(limit: number): Promise<ScanHistoryItem[]> {
    return this.scans.slice(0, limit).map(scan => ({
      url: scan.url,
      domain: scan.domain,
      status: scan.resultStatus,
      time: "Recently" // In a real app, we'd compute this from a timestamp
    }));
  }
}

export const storage = new MemStorage();
