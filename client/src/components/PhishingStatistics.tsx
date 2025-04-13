import { 
  Card, 
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PhishingStatistics() {
  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Phishing Statistics</h2>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phishing Sites Detected</span>
            <span className="text-sm font-medium text-red-500">83%</span>
          </div>
          <Progress value={83} className="h-2 bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '83%' }}></div>
          </Progress>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Suspicious URLs</span>
            <span className="text-sm font-medium text-yellow-500">12%</span>
          </div>
          <Progress value={12} className="h-2 bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '12%' }}></div>
          </Progress>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Safe Sites</span>
            <span className="text-sm font-medium text-green-500">5%</span>
          </div>
          <Progress value={5} className="h-2 bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '5%' }}></div>
          </Progress>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">Based on last 10,000 scans by PhishGuard users</p>
      </CardContent>
    </Card>
  );
}
