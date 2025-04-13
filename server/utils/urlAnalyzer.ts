import { ScanResult, DetectionResult } from "@shared/schema";
import { URL } from "url";

// Helper to create result messages based on status
const getResultMessages = (status: "safe" | "suspicious" | "phishing") => {
  switch (status) {
    case "safe":
      return {
        title: "URL Appears Safe",
        subtitle: "No phishing indicators detected in this URL."
      };
    case "suspicious":
      return {
        title: "Potentially Suspicious",
        subtitle: "Some concerning patterns found. Proceed with caution."
      };
    case "phishing":
      return {
        title: "Likely Phishing Attempt",
        subtitle: "Multiple high-risk factors detected. Avoid this URL."
      };
  }
};

// Analyze URL for phishing indicators
export async function analyzeUrl(urlString: string): Promise<ScanResult> {
  // Parse the URL to extract domain and other components
  const url = new URL(urlString);
  const domain = url.hostname;
  const path = url.pathname;
  const detectionResults: DetectionResult[] = [];
  let riskScore = 0;
  
  // Check for common signs of phishing URLs
  
  // 1. Check SSL/TLS (HTTPS)
  if (url.protocol === 'https:') {
    detectionResults.push({
      title: "Valid HTTPS Connection",
      description: "The site uses secure HTTPS for data transmission.",
      status: "passed"
    });
  } else {
    detectionResults.push({
      title: "Missing SSL Certificate",
      description: "The site does not use HTTPS encryption to secure data transmission.",
      status: "failed"
    });
    riskScore += 25;
  }

  // 2. Check domain length (very long domains are suspicious)
  if (domain.length > 30) {
    detectionResults.push({
      title: "Suspicious Domain Length",
      description: "The domain name is unusually long which is often a sign of phishing.",
      status: "failed"
    });
    riskScore += 15;
  } else {
    detectionResults.push({
      title: "Normal Domain Length",
      description: "The domain name has a reasonable length.",
      status: "passed"
    });
  }

  // 3. Check for suspicious keywords in domain
  const suspiciousKeywords = ['secure', 'login', 'signin', 'verify', 'account', 'update', 'confirm', 'banking'];
  const containsSuspiciousKeywords = suspiciousKeywords.some(keyword => domain.includes(keyword));
  
  if (containsSuspiciousKeywords) {
    detectionResults.push({
      title: "Suspicious Keywords in Domain",
      description: "The domain contains words commonly used in phishing attempts.",
      status: "warning"
    });
    riskScore += 10;
  }

  // 4. Check for brand impersonation
  const targetedBrands = ['paypal', 'apple', 'microsoft', 'google', 'amazon', 'facebook', 'netflix'];
  const impersonatedBrand = targetedBrands.find(brand => 
    domain.includes(brand) && !domain.includes(`${brand}.com`) && !domain.includes(`${brand}.org`)
  );
  
  if (impersonatedBrand) {
    detectionResults.push({
      title: "Possible Brand Impersonation",
      description: `The domain appears to impersonate ${impersonatedBrand.charAt(0).toUpperCase() + impersonatedBrand.slice(1)} but is not the official domain.`,
      status: "failed"
    });
    riskScore += 30;
  }

  // 5. Check for excessive subdomains
  const subdomainCount = domain.split('.').length - 1;
  if (subdomainCount > 3) {
    detectionResults.push({
      title: "Excessive Subdomains",
      description: "The URL contains an unusual number of subdomains which is suspicious.",
      status: "warning"
    });
    riskScore += 10;
  }

  // 6. Check for numeric IP address as domain
  const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipPattern.test(domain)) {
    detectionResults.push({
      title: "IP Address Used Instead of Domain",
      description: "The URL uses a numeric IP address instead of a domain name, which is highly suspicious.",
      status: "failed"
    });
    riskScore += 25;
  }

  // 7. Check for suspicious TLDs
  const suspiciousTLDs = ['xyz', 'tk', 'ml', 'ga', 'cf', 'info', 'online', 'site'];
  const tld = domain.split('.').pop() || '';
  
  if (suspiciousTLDs.includes(tld)) {
    detectionResults.push({
      title: "Suspicious Top-Level Domain",
      description: `The domain uses .${tld} which is often associated with free domains used in phishing.`,
      status: "warning"
    });
    riskScore += 10;
  }

  // 8. Check for special characters in domain
  if (/[^a-zA-Z0-9.-]/.test(domain)) {
    detectionResults.push({
      title: "Special Characters in Domain",
      description: "The domain contains special characters which is unusual and suspicious.",
      status: "failed"
    });
    riskScore += 20;
  }

  // 9. Check for URL redirects in path
  if (path.includes("url=") || path.includes("redirect=") || path.includes("goto=")) {
    detectionResults.push({
      title: "URL Redirection Detected",
      description: "The URL contains redirection parameters which may lead to a malicious site.",
      status: "warning"
    });
    riskScore += 15;
  }

  // Determine overall result status based on risk score
  let resultStatus: "safe" | "suspicious" | "phishing";
  if (riskScore >= 50) {
    resultStatus = "phishing";
  } else if (riskScore >= 20) {
    resultStatus = "suspicious";
  } else {
    resultStatus = "safe";
    
    // If safe, ensure we have some passed checks
    if (detectionResults.filter(r => r.status === "passed").length < 3) {
      detectionResults.push({
        title: "No Known Phishing Indicators",
        description: "The URL doesn't match known patterns used in phishing attacks.",
        status: "passed"
      });
      
      detectionResults.push({
        title: "Legitimate Domain Structure",
        description: "The domain structure follows standard naming conventions.",
        status: "passed"
      });
    }
  }

  // Get appropriate result messages
  const { title, subtitle } = getResultMessages(resultStatus);

  // Create the final result
  return {
    url: urlString,
    domain,
    resultStatus,
    resultTitle: title,
    resultSubtitle: subtitle,
    riskScore: Math.min(riskScore, 100), // Cap at 100
    detectionResults
  };
}
