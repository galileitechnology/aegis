import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

interface UrlCheck {
  timestamp: Date;
  status: 'up' | 'down' | 'error';
  responseTime?: number;
  error?: string;
}

interface UrlStatus {
  url: string;
  currentStatus: 'checking' | 'up' | 'down' | 'error';
  history: UrlCheck[];
  lastChecked?: Date;
  currentResponseTime?: number;
  uptimePercentage: number;
}

const UrlMonitor: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [urlStatuses, setUrlStatuses] = useState<UrlStatus[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [checkInterval, setCheckInterval] = useState(30000);
  
  const urlStatusesRef = useRef(urlStatuses);
  const isMonitoringRef = useRef(isMonitoring);
  const checkIntervalRef = useRef(checkInterval);

  useEffect(() => {
    urlStatusesRef.current = urlStatuses;
    isMonitoringRef.current = isMonitoring;
    checkIntervalRef.current = checkInterval;
  }, [urlStatuses, isMonitoring, checkInterval]);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const getHttpStatusText = (statusCode: number): string => {
    const statusTexts: { [key: number]: string } = {
      100: 'Continue', 101: 'Switching Protocols', 200: 'OK', 201: 'Created',
      202: 'Accepted', 203: 'Non-Authoritative Information', 204: 'No Content',
      205: 'Reset Content', 206: 'Partial Content', 300: 'Multiple Choices',
      301: 'Moved Permanently', 302: 'Found', 303: 'See Other', 304: 'Not Modified',
      305: 'Use Proxy', 307: 'Temporary Redirect', 308: 'Permanent Redirect',
      400: 'Bad Request', 401: 'Unauthorized', 402: 'Payment Required', 403: 'Forbidden',
      404: 'Not Found', 405: 'Method Not Allowed', 406: 'Not Acceptable',
      407: 'Proxy Authentication Required', 408: 'Request Timeout', 409: 'Conflict',
      410: 'Gone', 411: 'Length Required', 412: 'Precondition Failed',
      413: 'Payload Too Large', 414: 'URI Too Long', 415: 'Unsupported Media Type',
      416: 'Range Not Satisfiable', 417: 'Expectation Failed', 418: 'I\'m a teapot',
      421: 'Misdirected Request', 422: 'Unprocessable Entity', 423: 'Locked',
      424: 'Failed Dependency', 425: 'Too Early', 426: 'Upgrade Required',
      428: 'Precondition Required', 429: 'Too Many Requests', 431: 'Request Header Fields Too Large',
      451: 'Unavailable For Legal Reasons', 500: 'Internal Server Error', 501: 'Not Implemented',
      502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout',
      505: 'HTTP Version Not Supported', 506: 'Variant Also Negotiates', 507: 'Insufficient Storage',
      508: 'Loop Detected', 510: 'Not Extended', 511: 'Network Authentication Required',
    };
    
    return statusTexts[statusCode] || 'Unknown Status';
  };

  const checkUrl = useCallback(async (url: string): Promise<Omit<UrlCheck, 'timestamp'>> => {
    const startTime = Date.now();
    
    try {
      // Strategy 1: Try direct request first (bypass CORS when possible)
      const directStartTime = Date.now();
      const directResponse = await axios.get(url, {
        timeout: 10000,
        validateStatus: () => true,
      });
      
      const directResponseTime = Date.now() - directStartTime;
      const isUp = directResponse.status >= 200 && directResponse.status < 300;
      
      // Additional check: if we get 200 but the response is from a proxy error page
      const content = directResponse.data?.toString() || '';
      const isLikelyProxyError = 
        content.includes('CORS') || 
        content.includes('cors') || 
        content.includes('proxy') ||
        content.includes('Origin') ||
        content.includes('cross-origin') ||
        content.length < 100; // Very short responses might be error pages
      
      if (isUp && !isLikelyProxyError) {
        return {
          status: 'up',
          responseTime: directResponseTime,
          error: undefined
        };
      }
      
      // If direct request failed or seems like a proxy error, try alternative methods
    } catch (directError) {
      // Direct request failed, continue to proxy methods
    }

    // Strategy 2: Try multiple detection methods
    const detectionMethods = [
      // Method 1: HEAD request (less likely to trigger CORS)
      async () => {
        try {
          const headStartTime = Date.now();
          const response = await axios.head(url, {
            timeout: 8000,
            validateStatus: () => true,
          });
          return {
            success: response.status >= 200 && response.status < 300,
            responseTime: Date.now() - headStartTime,
            status: response.status,
            method: 'HEAD'
          };
        } catch {
          return { success: false, method: 'HEAD' };
        }
      },
      
      // Method 2: Fetch with no-cors to at least detect network connectivity
      async () => {
        try {
          const fetchStartTime = Date.now();
          await fetch(url, { 
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
          });
          return {
            success: true,
            responseTime: Date.now() - fetchStartTime,
            method: 'no-cors'
          };
        } catch {
          return { success: false, method: 'no-cors' };
        }
      },
      
      // Method 3: Try with a reliable CORS proxy that passes through status codes
      async () => {
        try {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
          const proxyStartTime = Date.now();
          const response = await axios.get(proxyUrl, {
            timeout: 10000,
          });
          
          // AllOrigins returns the actual status code in the response
          const actualStatus = response.data?.status?.http_code;
          if (actualStatus) {
            return {
              success: actualStatus >= 200 && actualStatus < 300,
              responseTime: Date.now() - proxyStartTime,
              status: actualStatus,
              method: 'allorigins'
            };
          }
          return { success: false, method: 'allorigins' };
        } catch {
          return { success: false, method: 'allorigins' };
        }
      }
    ];

    // Try all detection methods
    for (const method of detectionMethods) {
      try {
        const result = await method();
        if (result.success) {
          return {
            status: 'up',
            responseTime: result.responseTime,
            error: undefined
          };
        }
      } catch (error) {
        continue;
      }
    }

    // If all methods fail, consider it down
    const responseTime = Date.now() - startTime;
    return {
      status: 'down',
      responseTime,
      error: 'All connection methods failed - Site appears to be down'
    };
  }, []);

  const checkSingleUrl = useCallback(async (url: string) => {
    try {
      const checkResult = await checkUrl(url);
      const newCheck: UrlCheck = {
        timestamp: new Date(),
        ...checkResult
      };

      setUrlStatuses(prev => 
        prev.map(status => {
          if (status.url === url) {
            const newHistory = [...status.history, newCheck].slice(-50);
            const upCount = newHistory.filter(check => check.status === 'up').length;
            const uptimePercentage = newHistory.length > 0 ? (upCount / newHistory.length) * 100 : 0;

            return {
              ...status,
              currentStatus: checkResult.status,
              currentResponseTime: checkResult.responseTime,
              lastChecked: new Date(),
              history: newHistory,
              uptimePercentage
            };
          }
          return status;
        })
      );
    } catch (error) {
      console.error(`Error checking URL ${url}:`, error);
      const responseTime = Date.now();
      setUrlStatuses(prev => 
        prev.map(status => 
          status.url === url 
            ? { 
                ...status, 
                currentStatus: 'error' as const,
                lastChecked: new Date(),
                error: 'Check failed - possible network issue'
              }
            : status
        )
      );
    }
  }, [checkUrl]);

  // Monitoring system
  const monitoringRef = useRef<NodeJS.Timeout | null>(null);

  const startMonitoring = useCallback(() => {
    if (monitoringRef.current) {
      clearInterval(monitoringRef.current);
    }

    const performCheck = async () => {
      const currentStatuses = urlStatusesRef.current;
      if (currentStatuses.length === 0) return;

      // Update checking status for all URLs
      setUrlStatuses(prev => prev.map(status => ({
        ...status,
        currentStatus: 'checking' as const
      })));

      // Check all URLs in parallel with better error handling
      const checkPromises = currentStatuses.map(async (status) => {
        try {
          await checkSingleUrl(status.url);
        } catch (error) {
          console.error(`Failed to check ${status.url}:`, error);
        }
      });

      await Promise.allSettled(checkPromises);
    };

    // Initial check
    performCheck();

    // Set up interval
    monitoringRef.current = setInterval(performCheck, checkIntervalRef.current);
  }, [checkSingleUrl]);

  const stopMonitoring = useCallback(() => {
    if (monitoringRef.current) {
      clearInterval(monitoringRef.current);
      monitoringRef.current = null;
    }
  }, []);

  // Main monitoring effect
  useEffect(() => {
    if (isMonitoring && urlStatuses.length > 0) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [isMonitoring, urlStatuses.length, startMonitoring, stopMonitoring]);

  useEffect(() => {
    if (isMonitoring && urlStatuses.length > 0) {
      startMonitoring();
    }
  }, [checkInterval, isMonitoring, startMonitoring]);

  const addUrl = async () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) return;

    if (!validateUrl(trimmedUrl)) {
      alert('Please enter a valid URL (including http:// or https://)');
      return;
    }

    if (urlStatuses.some(status => status.url === trimmedUrl)) {
      alert('This URL is already being monitored');
      return;
    }

    const newUrlStatus: UrlStatus = {
      url: trimmedUrl,
      currentStatus: 'checking',
      history: [],
      uptimePercentage: 0
    };

    setUrlStatuses(prev => [...prev, newUrlStatus]);
    setUrlInput('');

    await checkSingleUrl(trimmedUrl);
  };

  const removeUrl = (urlToRemove: string) => {
    setUrlStatuses(prev => prev.filter(status => status.url !== urlToRemove));
  };

  const toggleMonitoring = () => {
    if (urlStatuses.length === 0) {
      alert('Please add at least one URL to monitor');
      return;
    }
    setIsMonitoring(!isMonitoring);
  };

  const handleManualCheck = async () => {
    if (urlStatuses.length === 0) return;
    
    setUrlStatuses(prev => prev.map(status => ({
      ...status,
      currentStatus: 'checking' as const
    })));

    await Promise.allSettled(
      urlStatuses.map(status => checkSingleUrl(status.url))
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addUrl();
    }
  };

  const getStatusColor = (status: UrlStatus['currentStatus']) => {
    switch (status) {
      case 'up': return 'bg-green-500';
      case 'down': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'checking': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrlStatusText = (status: UrlStatus['currentStatus']) => {
    switch (status) {
      case 'up': return 'Up';
      case 'down': return 'Down';
      case 'error': return 'Error';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  const clearHistory = (url: string) => {
    setUrlStatuses(prev => 
      prev.map(status => 
        status.url === url 
          ? { ...status, history: [], uptimePercentage: 0 }
          : status
      )
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">URL Monitor</h1>
        <p className="text-[#fff]">Monitor your websites and APIs in real-time</p>
        {isMonitoring && (
          <div className="flex items-center gap-2 mt-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
            <span className="text-sm">Live monitoring active - checking every {checkInterval / 1000}s</span>
          </div>
        )}
      </div>

      <div className="bg-[#191919] shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="urlInput" className="block text-sm font-medium text-[#fff] mb-2">
              Add URL to Monitor
            </label>
            <div className="flex gap-2">
              <input
                id="urlInput"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addUrl}
                className="px-4 py-2 cursor-pointer bg-[#5200ff] hover:bg-[#5230ff] text-white transition-colors"
              >
                Add URL
              </button>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Include http:// or https:// prefix
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#fff] mb-2">
              Monitoring Controls
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={toggleMonitoring}
                className={`px-4 py-2 transition-colors ${
                  isMonitoring 
                    ? 'bg-red-600 hover:bg-red-800 cursor-pointer' 
                    : 'bg-[#191919] hover:bg-[#5200ff] cursor-pointer border-1 border-[#505050]'
                } text-white`}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
              
              <button
                onClick={handleManualCheck}
                className="cursor-pointer px-4 py-2 text-white hover:bg-[#5200ff] transition-colors border-1 border-[#505050]"
                disabled={urlStatuses.some(status => status.currentStatus === 'checking') || urlStatuses.length === 0}
              >
                Check Now
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="interval" className="block text-sm font-medium text-[#fff] mb-2">
            Check Interval: {checkInterval / 1000} seconds
          </label>
          <input
            id="interval"
            type="range"
            min="10000"
            max="120000"
            step="10000"
            value={checkInterval}
            onChange={(e) => setCheckInterval(Number(e.target.value))}
            className="w-full"
            disabled={isMonitoring}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>10s</span>
            <span>30s</span>
            <span>60s</span>
            <span>120s</span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-[#191919]">
          <h4 className="font-medium text-[#fff] mb-2">Status Legend:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Down</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Error (Network)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Checking</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Uses multiple detection methods to avoid false positives from CORS proxies
          </p>
        </div>

        {urlStatuses.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">Summary:</span>
              <span className="text-green-600">
                Up: {urlStatuses.filter(s => s.currentStatus === 'up').length}
              </span>
              <span className="text-yellow-600">
                Down: {urlStatuses.filter(s => s.currentStatus === 'down').length}
              </span>
              <span className="text-red-600">
                Error: {urlStatuses.filter(s => s.currentStatus === 'error').length}
              </span>
              <span className="text-blue-600">
                Checking: {urlStatuses.filter(s => s.currentStatus === 'checking').length}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {urlStatuses.map((urlStatus) => (
          <div key={urlStatus.url} className="bg-[#191919] shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(urlStatus.currentStatus)}`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg break-all">{urlStatus.url}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className={`font-medium ${
                      urlStatus.currentStatus === 'up' ? 'text-green-600' :
                      urlStatus.currentStatus === 'down' ? 'text-yellow-600' :
                      urlStatus.currentStatus === 'error' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {getUrlStatusText(urlStatus.currentStatus)}
                    </span>
                    <span className='text-gray-400'>Uptime: {urlStatus.uptimePercentage.toFixed(1)}%</span>
                    <span className='text-gray-400'>Checks: {urlStatus.history.length}</span>
                    {urlStatus.currentResponseTime && (
                      <span className='text-gray-400'>Response: {urlStatus.currentResponseTime}ms</span>
                    )}
                    {urlStatus.lastChecked && (
                      <span className="text-xs text-gray-400">
                        Last: {urlStatus.lastChecked.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => checkSingleUrl(urlStatus.url)}
                  className="px-3 py-1 bg-[#191919] hover:bg-[#5200ff] text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer"
                  disabled={urlStatus.currentStatus === 'checking'}
                >
                  Check
                </button>
                <button
                  onClick={() => clearHistory(urlStatus.url)}
                  className="px-3 py-1 bg-[#191919] hover:bg-[#191919] text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer"
                >
                  Clear History
                </button>
                <button
                  onClick={() => removeUrl(urlStatus.url)}
                  className="px-3 py-1 bg-[#191919] hover:bg-[red] text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>

            {urlStatus.history.length > 0 && (
              <>
                <div className="mb-3">
                  <h4 className="font-medium text-[#fff] mb-2">Recent History (Last 50 checks)</h4>
                  <div className="flex items-end gap-1 h-8">
                    {urlStatus.history.slice(-20).map((check, index) => (
                      <div
                        key={index}
                        className={`flex-1 ${
                          check.status === 'up' ? 'bg-green-400' :
                          check.status === 'down' ? 'bg-yellow-400' :
                          'bg-red-400'
                        } transition-all hover:opacity-80`}
                        style={{ 
                          height: check.responseTime 
                            ? `${Math.min(check.responseTime / 50, 100)}%` 
                            : '20%' 
                        }}
                        title={`${check.timestamp.toLocaleTimeString()} - ${check.status} - ${check.responseTime}ms - ${check.error || 'No error'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-[#fff] mb-3">Detailed History</h4>
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Time</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Response Time</th>
                          <th className="text-left py-2">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...urlStatus.history].reverse().slice(0, 10).map((check, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{check.timestamp.toLocaleTimeString()}</td>
                            <td className="py-2">
                              <span className={`inline-flex items-center gap-1 ${
                                check.status === 'up' ? 'text-green-600' :
                                check.status === 'down' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  check.status === 'up' ? 'bg-green-500' :
                                  check.status === 'down' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`} />
                                {check.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2">{check.responseTime}ms</td>
                            <td className="py-2 text-red-500 text-xs">{check.error || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {urlStatus.history.length === 0 && urlStatus.currentStatus === 'checking' && (
              <div className="text-center py-4 text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  Checking URL status...
                </div>
              </div>
            )}

            {urlStatus.history.length === 0 && urlStatus.currentStatus !== 'checking' && (
              <div className="text-center py-4 text-gray-500">
                No history yet. Click "Check" to perform the first check.
              </div>
            )}
          </div>
        ))}
      </div>

      {urlStatuses.length === 0 && (
        <div className="text-center py-12 bg-[#191919] shadow-sm border">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#fff] mb-2">No URLs Added</h3>
          <p className="text-gray-500 mb-4">Add URLs above to start monitoring their status</p>
        </div>
      )}
    </div>
  );
};

export default UrlMonitor;