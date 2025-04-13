import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function PhishingEducation() {
  const [activeTab, setActiveTab] = useState("what-is");

  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Phishing Education</h2>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="what-is">What is Phishing?</TabsTrigger>
            <TabsTrigger value="signs">Warning Signs</TabsTrigger>
            <TabsTrigger value="protection">Protection Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="what-is" className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Phishing is a cybercrime where attackers disguise themselves as trustworthy entities to steal sensitive information like login credentials and credit card details.
            </p>
            <div className="flex items-start space-x-2 text-sm">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-gray-600 dark:text-gray-400">
                Phishing attacks often begin with deceptive emails or messages that lead to fraudulent websites.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="signs" className="space-y-3">
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Suspicious sender email addresses with misspellings</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>URLs that mimic legitimate sites with slight variations</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Poor spelling, grammar, or design on the website</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Requests for personal information or urgent action</span>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="protection" className="space-y-3">
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Verify the URL in your browser's address bar</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Look for HTTPS and the padlock icon before entering data</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Don't click on suspicious links in emails or messages</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Use tools like PhishGuard to verify suspicious URLs</span>
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
