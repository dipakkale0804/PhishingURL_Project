import React, { useState } from "react";
import { Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface URLInputFormProps {
  urlToCheck: string;
  setUrlToCheck: (url: string) => void;
  onSubmit: (url: string) => void;
  isChecking: boolean;
}

export default function URLInputForm({ 
  urlToCheck, 
  setUrlToCheck, 
  onSubmit, 
  isChecking 
}: URLInputFormProps) {
  const [urlError, setUrlError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlToCheck) {
      setUrlError("Please enter a URL to check");
      return;
    }
    
    // Validate URL format
    try {
      new URL(urlToCheck);
      setUrlError("");
      onSubmit(urlToCheck);
    } catch (e) {
      setUrlError("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  const clearInput = () => {
    setUrlToCheck("");
    setUrlError("");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">Enter URL to Check</h2>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link2 className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="url"
              value={urlToCheck}
              onChange={(e) => setUrlToCheck(e.target.value)}
              className="pl-10 pr-12 py-6 font-mono text-sm w-full"
              placeholder="https://example.com"
              disabled={isChecking}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              {urlToCheck && !isChecking && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  onClick={clearInput}
                  className="mr-2 h-8 w-8 p-0"
                  aria-label="Clear input">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {urlError && <span className="text-destructive text-sm">{urlError}</span>}
            <div></div>
            <Button 
              type="submit" 
              disabled={isChecking || !urlToCheck}>
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {isChecking ? 'Analyzing...' : 'Check URL'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
