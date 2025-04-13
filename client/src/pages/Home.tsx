import { useState } from "react";
import URLInputForm from "@/components/URLInputForm";
import ResultsCard from "@/components/ResultsCard";
import ScanHistory from "@/components/ScanHistory";
import PhishingEducation from "@/components/PhishingEducation";
import PhishingStatistics from "@/components/PhishingStatistics";
import { Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ScanResult, ScanHistoryItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [urlToCheck, setUrlToCheck] = useState("");
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  const checkUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/scan", { url });
      return response.json() as Promise<ScanResult>;
    },
    onSuccess: (data) => {
      setScanResult(data);
      
      // Add to history if not already there
      const urlExists = scanHistory.some(item => item.url === urlToCheck);
      if (!urlExists) {
        try {
          const domain = new URL(urlToCheck).hostname;
          const newHistoryItem: ScanHistoryItem = {
            url: urlToCheck,
            domain,
            status: data.resultStatus,
            time: "Just now"
          };
          
          // Keep history limited to most recent items
          const updatedHistory = [newHistoryItem, ...scanHistory];
          if (updatedHistory.length > 5) {
            updatedHistory.pop();
          }
          
          setScanHistory(updatedHistory);
        } catch (error) {
          console.error("Failed to parse URL for history:", error);
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Error checking URL",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });

  const handleUrlSubmit = (url: string) => {
    setUrlToCheck(url);
    checkUrlMutation.mutate(url);
  };

  const resetForm = () => {
    setUrlToCheck("");
    setScanResult(null);
  };

  const setUrlFromHistory = (url: string) => {
    setUrlToCheck(url);
    checkUrlMutation.mutate(url);
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">PhishGuard</h1>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode">
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Left Column - URL Input and Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Card */}
              {!scanResult && !checkUrlMutation.isPending && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-2xl font-semibold mb-3 dark:text-white">Welcome to PhishGuard</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Our advanced system helps identify potential phishing URLs to keep you safe online.
                    Enter a suspicious URL below to analyze it for phishing indicators.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <h3 className="font-medium mt-2 dark:text-white">Scan URLs</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Check any suspicious links</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                      </svg>
                      <h3 className="font-medium mt-2 dark:text-white">Get Results</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Instant safety analysis</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      <h3 className="font-medium mt-2 dark:text-white">Learn</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Understand the threats</p>
                    </div>
                  </div>
                </div>
              )}

              {/* URL Input Form */}
              <URLInputForm 
                urlToCheck={urlToCheck} 
                setUrlToCheck={setUrlToCheck}
                onSubmit={handleUrlSubmit}
                isChecking={checkUrlMutation.isPending}
              />

              {/* Loading State */}
              {checkUrlMutation.isPending && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <svg className="h-5 w-5 text-primary animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v6l4 2"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium dark:text-white">Analyzing URL</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Checking for phishing indicators...</p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Extracting URL features</span>
                      <span>Applying detection rules</span>
                      <span>Generating report</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Card */}
              {scanResult && !checkUrlMutation.isPending && (
                <ResultsCard 
                  result={scanResult}
                  urlToCheck={urlToCheck}
                  onReset={resetForm}
                />
              )}
            </div>

            {/* Right Column - History and Information */}
            <div className="mt-8 lg:mt-0 space-y-6">
              {/* Recent History */}
              <ScanHistory 
                scanHistory={scanHistory}
                onSelectUrl={setUrlFromHistory}
                onClearHistory={clearHistory}
              />

              {/* Educational Information */}
              <PhishingEducation />

              {/* Statistics Card */}
              <PhishingStatistics />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">© {new Date().getFullYear()} PhishGuard. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <span className="text-sm">Privacy Policy</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <span className="text-sm">Terms of Service</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
