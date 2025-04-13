import React from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanHistoryItem } from "@shared/schema";
import { ShieldCheck, AlertTriangle, AlertCircle, History } from "lucide-react";

interface ScanHistoryProps {
  scanHistory: ScanHistoryItem[];
  onSelectUrl: (url: string) => void;
  onClearHistory: () => void;
}

export default function ScanHistory({ scanHistory, onSelectUrl, onClearHistory }: ScanHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'phishing':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBgClass = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-green-100 dark:bg-green-900/40';
      case 'suspicious':
        return 'bg-yellow-100 dark:bg-yellow-900/40';
      case 'phishing':
        return 'bg-red-100 dark:bg-red-900/40';
      default:
        return 'bg-red-100 dark:bg-red-900/40';
    }
  };

  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Recent Scans</h2>
      </CardHeader>

      {scanHistory.length === 0 ? (
        <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
          <History className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No scan history yet</p>
        </CardContent>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {scanHistory.map((item, index) => (
              <li 
                key={index} 
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" 
                onClick={() => onSelectUrl(item.url)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getStatusBgClass(item.status)}`}
                  >
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.domain}</p>
                    <p className="text-xs text-gray-500 truncate font-mono">{item.url}</p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">{item.time}</div>
                </div>
              </li>
            ))}
          </ul>

          <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 justify-center">
            <Button 
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium">
              Clear History
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
