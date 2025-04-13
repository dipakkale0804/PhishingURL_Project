import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScanResult, DetectionResult } from "@shared/schema";
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  Check, 
  X, 
  FileWarning, 
  RefreshCw,
  Copy 
} from "lucide-react";

interface ResultsCardProps {
  result: ScanResult;
  urlToCheck: string;
  onReset: () => void;
}

export default function ResultsCard({ result, urlToCheck, onReset }: ResultsCardProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "URL copied to clipboard",
        duration: 2000
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Failed to copy URL",
        variant: "destructive",
        duration: 2000
      });
    });
  };

  // Maps status to icon component
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <ShieldCheck className="h-6 w-6 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'phishing':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-red-500" />;
    }
  };
  
  // Maps detection result status to icon
  const getResultIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <X className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      default:
        return <Check className="h-3 w-3 text-green-500" />;
    }
  };

  // Get background and text colors based on status
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'safe':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-100 dark:border-green-900/30',
          iconBg: 'bg-green-100 dark:bg-green-900/40',
          statusBg: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
          bar: 'bg-green-500'
        };
      case 'suspicious':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-100 dark:border-yellow-900/30',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
          statusBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
          bar: 'bg-yellow-500'
        };
      case 'phishing':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-100 dark:border-red-900/30',
          iconBg: 'bg-red-100 dark:bg-red-900/40',
          statusBg: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
          bar: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-100 dark:border-red-900/30',
          iconBg: 'bg-red-100 dark:bg-red-900/40',
          statusBg: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
          bar: 'bg-red-500'
        };
    }
  };

  const statusClasses = getStatusClasses(result.resultStatus);

  return (
    <Card className="overflow-hidden">
      {/* Result Header */}
      <div className={`p-6 border-b ${statusClasses.bg} ${statusClasses.border}`}>
        <div className="flex items-center space-x-3">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${statusClasses.iconBg}`}>
            {getStatusIcon(result.resultStatus)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{result.resultTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400">{result.resultSubtitle}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Analyzed URL:</h3>
          <div className="mt-1 flex items-center">
            <span className="font-mono text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded border dark:border-gray-700 overflow-x-auto max-w-full">
              {urlToCheck}
            </span>
            <button 
              onClick={() => copyToClipboard(urlToCheck)} 
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Copy to clipboard">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Risk Score */}
      <CardContent className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Risk Assessment</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
          <span 
            className={`font-medium px-2 py-1 rounded text-sm ${statusClasses.statusBg}`}>
            {result.resultStatus.toUpperCase()}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
          <div 
            className={`h-full ${statusClasses.bar}`}
            style={{ width: `${result.riskScore}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Low Risk</span>
          <span>Medium Risk</span>
          <span>High Risk</span>
        </div>
      </CardContent>

      {/* Detected Issues */}
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {result.resultStatus !== 'safe' ? 'Detected Issues' : 'Security Checks Passed'}
        </h3>
        <ul className="space-y-3">
          {result.detectionResults.map((item: DetectionResult, index: number) => (
            <li key={index} className="flex items-start space-x-3">
              <div 
                className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 
                  ${item.status === 'passed' ? 'bg-green-100 dark:bg-green-900/40' : 
                  item.status === 'failed' ? 'bg-red-100 dark:bg-red-900/40' : 
                  'bg-yellow-100 dark:bg-yellow-900/40'}`}>
                {getResultIcon(item.status)}
              </div>
              <div>
                <p className="text-sm font-medium dark:text-gray-200">{item.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* Actions */}
      <CardFooter className="p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-3 justify-end">
        <Button 
          variant="outline"
          onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Another URL
        </Button>
        {result.resultStatus !== 'safe' && (
          <Button>
            <FileWarning className="mr-2 h-4 w-4" />
            Report to PhishGuard
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
