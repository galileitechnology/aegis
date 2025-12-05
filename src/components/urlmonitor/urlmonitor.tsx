"use client"
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';

// Interface matching the PostgreSQL single table structure
interface UrlMonitor {
  id?: number;
  url: string;
  name?: string;
  current_status: 'checking' | 'up' | 'down' | 'error';
  last_status_code?: number;
  last_response_time_ms?: number;
  last_error_message?: string;
  check_interval_seconds: number;
  is_monitoring_active: boolean;
  total_checks: number;
  successful_checks: number;
  uptime_percentage: number;
  recent_checks: UrlCheck[];
  last_checked_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface UrlCheck {
  timestamp: Date;
  status: 'up' | 'down' | 'error';
  response_time_ms?: number;
  status_code?: number;
  error_message?: string;
}

// Filter options
type StatusFilter = 'all' | 'up' | 'down' | 'error' | 'checking';
type PausedFilter = 'all' | 'active' | 'paused';

const UrlMonitor: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [urlMonitors, setUrlMonitors] = useState<UrlMonitor[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [checkInterval, setCheckInterval] = useState(30000);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pausedFilter, setPausedFilter] = useState<PausedFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPausedFilterOpen, setIsPausedFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showHistoryTable, setShowHistoryTable] = useState<{[key: string]: boolean}>({});
  
  const urlMonitorsRef = useRef(urlMonitors);
  const isMonitoringRef = useRef(isMonitoring);
  const autoRefreshRef = useRef(autoRefresh);
  const filterRef = useRef<HTMLDivElement>(null);
  const pausedFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    urlMonitorsRef.current = urlMonitors;
    isMonitoringRef.current = isMonitoring;
    autoRefreshRef.current = autoRefresh;
  }, [urlMonitors, isMonitoring, autoRefresh]);

  // Close filter dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (pausedFilterRef.current && !pausedFilterRef.current.contains(event.target as Node)) {
        setIsPausedFilterOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load URL monitors from database on component mount
  useEffect(() => {
    loadUrlMonitors();
    
    // Set up auto-refresh interval to sync with background monitoring
    const refreshInterval = setInterval(() => {
      if (autoRefreshRef.current) {
        loadUrlMonitors();
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Filtered monitors based on selected status and paused filter
  const filteredMonitors = useMemo(() => {
    let filtered = urlMonitors;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(monitor => monitor.current_status === statusFilter);
    }
    
    // Apply paused filter
    if (pausedFilter === 'active') {
      filtered = filtered.filter(monitor => monitor.is_monitoring_active);
    } else if (pausedFilter === 'paused') {
      filtered = filtered.filter(monitor => !monitor.is_monitoring_active);
    }
    
    return filtered;
  }, [urlMonitors, statusFilter, pausedFilter]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, pausedFilter]);

  // Stats for filtered monitors
  const filteredStats = useMemo(() => {
    const filtered = statusFilter === 'all' ? urlMonitors : 
      urlMonitors.filter(m => m.current_status === statusFilter);
    
    // Apply paused filter to stats
    let filteredByPaused = filtered;
    if (pausedFilter === 'active') {
      filteredByPaused = filteredByPaused.filter(m => m.is_monitoring_active);
    } else if (pausedFilter === 'paused') {
      filteredByPaused = filteredByPaused.filter(m => !m.is_monitoring_active);
    }
    
    return {
      total: filteredByPaused.length,
      up: filteredByPaused.filter(m => m.current_status === 'up').length,
      down: filteredByPaused.filter(m => m.current_status === 'down').length,
      error: filteredByPaused.filter(m => m.current_status === 'error').length,
      checking: filteredByPaused.filter(m => m.current_status === 'checking').length,
      active: filteredByPaused.filter(m => m.is_monitoring_active).length,
      paused: filteredByPaused.filter(m => !m.is_monitoring_active).length,
    };
  }, [urlMonitors, statusFilter, pausedFilter]);

  const loadUrlMonitors = async () => {
    try {
      const response = await axios.get('/api/urlmonitor');
      setUrlMonitors(response.data);
    } catch (error) {
      console.error('Error loading URL monitors:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const checkSingleUrl = useCallback(async (url: string) => {
    const monitorToUpdate = urlMonitorsRef.current.find(m => m.url === url);
    if (!monitorToUpdate?.id) return;

    try {
      // Update status to checking locally
      setUrlMonitors(prev => 
        prev.map(monitor => 
          monitor.url === url 
            ? { ...monitor, current_status: 'checking' as const }
            : monitor
        )
      );

      // Call the server-side API to check the URL
      const checkResponse = await axios.post('/api/urlmonitor/check', { url });
      const checkResult = checkResponse.data;
      
      // Create new check entry
      const newCheck: UrlCheck = {
        timestamp: new Date(),
        status: checkResult.status,
        response_time_ms: checkResult.response_time_ms,
        status_code: checkResult.status_code,
        error_message: checkResult.error_message,
      };
      
      // Get existing recent checks
      const recentChecks = monitorToUpdate.recent_checks || [];
      const updatedRecentChecks = [...recentChecks, newCheck].slice(-50);
      
      // Calculate uptime percentage
      const upCount = updatedRecentChecks.filter(check => check.status === 'up').length;
      const uptimePercentage = updatedRecentChecks.length > 0 ? 
        (upCount / updatedRecentChecks.length) * 100 : 0;
      
      // Calculate successful checks
      const totalChecks = (monitorToUpdate.total_checks || 0) + 1;
      const successfulChecks = (monitorToUpdate.successful_checks || 0) + 
        (checkResult.status === 'up' ? 1 : 0);
      
      // Prepare update data
      const updateData = {
        current_status: checkResult.status,
        last_status_code: checkResult.status_code,
        last_response_time_ms: checkResult.response_time_ms,
        last_error_message: checkResult.error_message,
        last_checked_at: new Date().toISOString(),
        total_checks: totalChecks,
        successful_checks: successfulChecks,
        uptime_percentage: uptimePercentage,
        recent_checks: updatedRecentChecks,
      };
      
      // Update the monitor via API
      await axios.put(`/api/urlmonitor?id=${monitorToUpdate.id}`, updateData);
      
      // Update local state
      setUrlMonitors(prev => 
        prev.map(monitor => 
          monitor.url === url 
            ? {
                ...monitor,
                current_status: checkResult.status,
                last_status_code: checkResult.status_code,
                last_response_time_ms: checkResult.response_time_ms,
                last_error_message: checkResult.error_message,
                last_checked_at: new Date(),
                total_checks: totalChecks,
                successful_checks: successfulChecks,
                uptime_percentage: uptimePercentage,
                recent_checks: updatedRecentChecks,
                updated_at: new Date(),
              }
            : monitor
        )
      );
      
    } catch (error: any) {
      console.error(`Error checking URL ${url}:`, error);
      
      // Prepare error data
      const totalChecks = (monitorToUpdate.total_checks || 0) + 1;
      
      const errorCheck: UrlCheck = {
        timestamp: new Date(),
        status: 'error',
        error_message: error.message?.substring(0, 255) || 'Check failed',
      };
      
      const recentChecks = monitorToUpdate.recent_checks || [];
      const updatedRecentChecks = [...recentChecks, errorCheck].slice(-50);
      
      const errorData = {
        current_status: 'error' as const,
        last_error_message: error.message?.substring(0, 255) || 'Check failed',
        last_checked_at: new Date().toISOString(),
        total_checks: totalChecks,
        recent_checks: updatedRecentChecks,
      };
      
      // Update local state
      setUrlMonitors(prev => 
        prev.map(monitor => 
          monitor.url === url 
            ? { 
                ...monitor, 
                current_status: 'error' as const,
                last_error_message: error.message?.substring(0, 255) || 'Check failed',
                last_checked_at: new Date(),
                total_checks: totalChecks,
                recent_checks: updatedRecentChecks,
                updated_at: new Date(),
              }
            : monitor
        )
      );
      
      // Also update database
      try {
        await axios.put(`/api/urlmonitor?id=${monitorToUpdate.id}`, errorData);
      } catch (dbError) {
        console.error('Failed to update database:', dbError);
      }
    }
  }, []);

  // Manual monitoring system (only for when user is on page)
  const monitoringRef = useRef<NodeJS.Timeout | null>(null);

  const startManualMonitoring = useCallback(() => {
    if (monitoringRef.current) {
      clearInterval(monitoringRef.current);
    }

    const performManualCheck = async () => {
      const currentMonitors = urlMonitorsRef.current;
      if (currentMonitors.length === 0) return;

      // Only check active monitors
      const activeMonitors = currentMonitors.filter(monitor => 
        monitor.is_monitoring_active
      );

      if (activeMonitors.length === 0) return;

      // Update checking status for active URLs
      setUrlMonitors(prev => prev.map(monitor => 
        monitor.is_monitoring_active 
          ? { ...monitor, current_status: 'checking' }
          : monitor
      ));

      // Check all active URLs sequentially to avoid rate limiting
      for (const monitor of activeMonitors) {
        await checkSingleUrl(monitor.url);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between checks
      }
    };

    // Initial check
    performManualCheck();

    // Set up interval for manual monitoring
    monitoringRef.current = setInterval(performManualCheck, checkInterval);
  }, [checkInterval, checkSingleUrl]);

  const stopManualMonitoring = useCallback(() => {
    if (monitoringRef.current) {
      clearInterval(monitoringRef.current);
      monitoringRef.current = null;
    }
  }, []);

  // Manual monitoring effect
  useEffect(() => {
    if (isMonitoring && urlMonitors.length > 0) {
      startManualMonitoring();
    } else {
      stopManualMonitoring();
    }

    return () => {
      stopManualMonitoring();
    };
  }, [isMonitoring, urlMonitors.length, startManualMonitoring, stopManualMonitoring]);

  const addUrl = async () => {
    const trimmedUrl = urlInput.trim();
    const trimmedName = nameInput.trim();
    if (!trimmedUrl) return;

    if (!validateUrl(trimmedUrl)) {
      alert('Please enter a valid URL (including http:// or https://)');
      return;
    }

    if (urlMonitors.some(monitor => monitor.url === trimmedUrl)) {
      alert('This URL is already being monitored');
      return;
    }

    try {
      const response = await axios.post('/api/urlmonitor', {
        url: trimmedUrl,
        name: trimmedName || null,
        check_interval_seconds: checkInterval / 1000,
      });

      setUrlMonitors(prev => [...prev, response.data]);
      setNameInput('');
      setUrlInput('');

      // Perform initial check
      await checkSingleUrl(trimmedUrl);
    } catch (error) {
      console.error('Error adding URL monitor:', error);
      alert('Failed to add URL monitor to database');
    }
  };

  const removeUrl = async (urlToRemove: string) => {
    const monitorToRemove = urlMonitors.find(m => m.url === urlToRemove);
    if (!monitorToRemove?.id) return;

    try {
      await axios.delete(`/api/urlmonitor?id=${monitorToRemove.id}`);
      setUrlMonitors(prev => prev.filter(monitor => monitor.url !== urlToRemove));
    } catch (error) {
      console.error('Error removing URL monitor:', error);
      alert('Failed to remove URL monitor from database');
    }
  };

  const toggleUrlMonitoring = async (url: string) => {
    const monitorToUpdate = urlMonitors.find(m => m.url === url);
    if (!monitorToUpdate?.id) return;

    const newMonitoringStatus = !monitorToUpdate.is_monitoring_active;

    try {
      await axios.put(`/api/urlmonitor?id=${monitorToUpdate.id}`, {
        is_monitoring_active: newMonitoringStatus
      });

      setUrlMonitors(prev => 
        prev.map(monitor => 
          monitor.url === url 
            ? { ...monitor, is_monitoring_active: newMonitoringStatus }
            : monitor
        )
      );
    } catch (error) {
      console.error('Error updating monitoring status:', error);
      alert('Failed to update monitoring status in database');
    }
  };

  const toggleGlobalMonitoring = () => {
    if (urlMonitors.length === 0) {
      alert('Please add at least one URL to monitor');
      return;
    }
    setIsMonitoring(!isMonitoring);
  };

  const handleManualCheck = async () => {
    if (urlMonitors.length === 0) return;
    
    setUrlMonitors(prev => prev.map(monitor => ({
      ...monitor,
      current_status: 'checking'
    })));

    // Check active URLs
    const activeMonitors = urlMonitors.filter(monitor => monitor.is_monitoring_active);
    for (const monitor of activeMonitors) {
      await checkSingleUrl(monitor.url);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addUrl();
    }
  };

  const getStatusColor = (status: UrlMonitor['current_status']) => {
    switch (status) {
      case 'up': return 'bg-green-500';
      case 'down': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'checking': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: UrlMonitor['current_status']) => {
    switch (status) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'checking': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getFilterButtonColor = (filter: StatusFilter) => {
    switch (filter) {
      case 'up': return 'bg-green-100 text-green-800 border-green-300';
      case 'down': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      case 'checking': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'all': return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getFilterLabel = (filter: StatusFilter) => {
    switch (filter) {
      case 'up': return 'Up';
      case 'down': return 'Down';
      case 'error': return 'Error';
      case 'checking': return 'Checking';
      case 'all': return 'All Statuses';
    }
  };

  const getPausedFilterLabel = (filter: PausedFilter) => {
    switch (filter) {
      case 'active': return 'Active Only';
      case 'paused': return 'Paused Only';
      case 'all': return 'All';
    }
  };

  const getPausedFilterButtonColor = (filter: PausedFilter) => {
    switch (filter) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'all': return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getUrlStatusText = (status: UrlMonitor['current_status']) => {
    switch (status) {
      case 'up': return 'Up';
      case 'down': return 'Down';
      case 'error': return 'Error';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  const clearHistory = async (url: string) => {
    const monitorToUpdate = urlMonitors.find(m => m.url === url);
    if (!monitorToUpdate?.id) return;

    try {
      await axios.put(`/api/urlmonitor?id=${monitorToUpdate.id}`, {
        recent_checks: [],
        uptime_percentage: 0,
        total_checks: 0,
        successful_checks: 0,
      });

      setUrlMonitors(prev => 
        prev.map(monitor => 
          monitor.url === url 
            ? { 
                ...monitor, 
                recent_checks: [], 
                uptime_percentage: 0,
                total_checks: 0,
                successful_checks: 0,
              }
            : monitor
        )
      );
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Failed to clear history in database');
    }
  };

  // Calculate paginated monitors
  const paginatedMonitors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMonitors.slice(startIndex, endIndex);
  }, [filteredMonitors, currentPage, itemsPerPage]);

  // Toggle history table visibility for a specific monitor
  const toggleHistoryTable = (url: string) => {
    setShowHistoryTable(prev => ({
      ...prev,
      [url]: !prev[url]
    }));
  };

  // Toggle all history tables visibility
  const toggleAllHistoryTables = () => {
    const allVisible = Object.values(showHistoryTable).every(v => v === false);
    const newState: {[key: string]: boolean} = {};
    
    if (allVisible) {
      // Hide all
      urlMonitors.forEach(monitor => {
        newState[monitor.url] = true;
      });
    } else {
      // Show all
      urlMonitors.forEach(monitor => {
        newState[monitor.url] = false;
      });
    }
    
    setShowHistoryTable(newState);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading URL monitors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">URL Monitor</h1>
        <p className="text-[#fff]">Monitor your websites and APIs in real-time</p>
        <div className="flex items-center gap-4 mt-2">
          {isMonitoring && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 rounded bg-green-500 animate-pulse"></div>
              <span className="text-sm">Manual monitoring active - checking every {checkInterval / 1000}s</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-2 h-2 rounded bg-blue-500"></div>
            <span className="text-sm">Background monitoring: Active (cron)</span>
          </div>
        </div>
      </div>

      <div className="bg-[#191919] shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="urlInput" className="block text-sm font-medium text-[#fff] mb-2">
              Add URL to Monitor
            </label>
            <div className="flex gap-2">
              <input
                id="nameInput"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="URL name"
                className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                className="p-2 w-fit cursor-pointer bg-[#5200ff] hover:bg-[#5230ff] text-white transition-colors"
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
                onClick={toggleGlobalMonitoring}
                className={`px-4 py-2 transition-colors ${
                  isMonitoring 
                    ? 'bg-red-600 hover:bg-red-800 cursor-pointer' 
                    : 'bg-[#191919] hover:bg-[#5200ff] cursor-pointer border-1 border-[#505050]'
                } text-white`}
              >
                {isMonitoring ? 'Stop Manual' : 'Start Manual'}
              </button>
              
              <button
                onClick={handleManualCheck}
                className="cursor-pointer px-4 py-2 text-white hover:bg-[#5200ff] transition-colors border-1 border-[#505050]"
                disabled={urlMonitors.some(monitor => monitor.current_status === 'checking') || urlMonitors.length === 0}
              >
                Check Now
              </button>
              
              <button
                onClick={() => {
                  setAutoRefresh(!autoRefresh);
                  if (!autoRefresh) loadUrlMonitors();
                }}
                className={`cursor-pointer px-4 py-2 transition-colors border-1 border-[#505050] ${
                  autoRefresh ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#191919] hover:bg-[#5200ff]'
                } text-white`}
              >
                Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="mb-6 bg-[transparent]">
          <h3 className="font-medium text-[#fff] mb-4">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-[#fff] mb-2">Status Filter</label>
              <div className="relative inline-block" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`inline-flex items-center gap-2 px-4 py-2 border ${getFilterButtonColor(statusFilter)} hover:opacity-90 transition-opacity`}
                >
                  <span>{getFilterLabel(statusFilter)}</span>
                  <span className="ml-2">▾</span>
                </button>
                
                {isFilterOpen && (
                  <div className="absolute z-10 mt-2 w-56 bg-[#000] shadow-lg border">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 ${statusFilter === 'all' ? 'bg-[#131313]' : ''}`}
                      >
                        <span>All Statuses</span>
                        <span className="ml-auto text-sm text-gray-500">({urlMonitors.length})</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setStatusFilter('up');
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-green-50 ${statusFilter === 'up' ? 'bg-green-50' : ''}`}
                      >
                        <span className="text-green-700">Up</span>
                        <span className="ml-auto text-sm text-green-600">
                          ({urlMonitors.filter(m => m.current_status === 'up').length})
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setStatusFilter('down');
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-yellow-50 ${statusFilter === 'down' ? 'bg-yellow-50' : ''}`}
                      >
                        <span className="text-yellow-700">Down</span>
                        <span className="ml-auto text-sm text-yellow-600">
                          ({urlMonitors.filter(m => m.current_status === 'down').length})
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setStatusFilter('error');
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-red-50 ${statusFilter === 'error' ? 'bg-red-50' : ''}`}
                      >
                        <span className="text-red-700">Error</span>
                        <span className="ml-auto text-sm text-red-600">
                          ({urlMonitors.filter(m => m.current_status === 'error').length})
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setStatusFilter('checking');
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-blue-50 ${statusFilter === 'checking' ? 'bg-blue-50' : ''}`}
                      >
                        <span className="text-blue-700">Checking</span>
                        <span className="ml-auto text-sm text-blue-600">
                          ({urlMonitors.filter(m => m.current_status === 'checking').length})
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Paused Filter */}
            <div>
              <label className="block text-sm font-medium text-[#fff] mb-2">Monitoring Status Filter</label>
              <div className="relative inline-block" ref={pausedFilterRef}>
                <button
                  onClick={() => setIsPausedFilterOpen(!isPausedFilterOpen)}
                  className={`inline-flex items-center gap-2 px-4 py-2 border ${getPausedFilterButtonColor(pausedFilter)} hover:opacity-90 transition-opacity`}
                >
                  <span>{getPausedFilterLabel(pausedFilter)}</span>
                  <span className="ml-2">▾</span>
                </button>
                
                {isPausedFilterOpen && (
                  <div className="absolute z-10 mt-2 w-56 bg-[#000] shadow-lg border">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setPausedFilter('all');
                          setIsPausedFilterOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 ${pausedFilter === 'all' ? 'bg-[#131313]' : ''}`}
                      >
                        <span>All (Active & Paused)</span>
                        <span className="ml-auto text-sm text-gray-500">
                          ({urlMonitors.length})
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setPausedFilter('active');
                          setIsPausedFilterOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-green-50 ${pausedFilter === 'active' ? 'bg-green-50' : ''}`}
                      >
                        <span className="text-green-700">Active Only</span>
                        <span className="ml-auto text-sm text-green-600">
                          ({urlMonitors.filter(m => m.is_monitoring_active).length})
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setPausedFilter('paused');
                          setIsPausedFilterOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-yellow-50 ${pausedFilter === 'paused' ? 'bg-yellow-50' : ''}`}
                      >
                        <span className="text-yellow-700">Paused Only</span>
                        <span className="ml-auto text-sm text-yellow-600">
                          ({urlMonitors.filter(m => !m.is_monitoring_active).length})
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(statusFilter !== 'all' || pausedFilter !== 'all') && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setPausedFilter('all');
                }}
                className="text-sm text-blue-500 hover:text-blue-400 underline"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* History Table Controls */}
        {filteredMonitors.length > 0 && (
          <div className="mb-4 p-3 bg-[#191919] border">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-[#fff]">Detailed History Tables</h4>
                <p className="text-sm text-gray-400">Toggle visibility of detailed history tables</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleAllHistoryTables}
                  className="px-3 py-2 bg-[#191919] hover:bg-[#5200ff] text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer"
                >
                  {Object.values(showHistoryTable).every(v => v === false) ? 'Show All Tables' : 'Hide All Tables'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="interval" className="block text-sm font-medium text-[#fff] mb-2">
            Manual Check Interval: {checkInterval / 1000} seconds
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
        </div>

        {urlMonitors.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">Total Summary:</span>
              <span className="text-green-600">
                Up: {urlMonitors.filter(s => s.current_status === 'up').length}
              </span>
              <span className="text-yellow-600">
                Down: {urlMonitors.filter(s => s.current_status === 'down').length}
              </span>
              <span className="text-red-600">
                Error: {urlMonitors.filter(s => s.current_status === 'error').length}
              </span>
              <span className="text-blue-600">
                Checking: {urlMonitors.filter(s => s.current_status === 'checking').length}
              </span>
              <span className="text-green-500">
                Active: {urlMonitors.filter(s => s.is_monitoring_active).length}
              </span>
              <span className="text-yellow-500">
                Paused: {urlMonitors.filter(s => !s.is_monitoring_active).length}
              </span>
              <span className="text-gray-400">
                Total: {urlMonitors.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {filteredMonitors.length === 0 && urlMonitors.length > 0 ? (
        <div className="text-center py-12 bg-[#191919] shadow-sm border rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#fff] mb-2">No URLs Match Filters</h3>
          <p className="text-gray-500 mb-4">
            No URLs found with status: <span className={`font-medium ${getStatusTextColor(statusFilter as any)}`}>{getFilterLabel(statusFilter)}</span>
            {pausedFilter !== 'all' && ` and monitoring status: ${getPausedFilterLabel(pausedFilter)}`}
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setPausedFilter('all');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-[#5200ff] hover:bg-[#5230ff] text-white rounded"
          >
            Show All URLs
          </button>
        </div>
      ) : filteredMonitors.length > 0 ? (
        <div className="grid gap-6">
          {/* URL Monitors List */}
          {paginatedMonitors.map((monitor) => (
            <div key={monitor.id || monitor.url || monitor.name} className="bg-[#191919] shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(monitor.current_status)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg break-all">{monitor.name}</h3>
                      {!monitor.is_monitoring_active && (
                        <span className="text-xs text-black bg-yellow-500 px-2 py-1 rounded">
                          PAUSED
                        </span>
                      )}
                    </div>
                    <h3 className="text-[#dcdcdc] break-all">{monitor.url}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className={`font-medium ${getStatusTextColor(monitor.current_status)}`}>
                        {getUrlStatusText(monitor.current_status)}
                      </span>
                      <span className='text-gray-400'>Uptime: {Number(monitor.uptime_percentage).toFixed(1)}%</span>
                      <span className='text-gray-400'>Checks: {Number(monitor.total_checks)}</span>
                      {monitor.last_response_time_ms !== null && monitor.last_response_time_ms !== undefined && (
                        <span className='text-gray-400'>Response: {Number(monitor.last_response_time_ms)}ms</span>
                      )}
                      {monitor.last_checked_at && (
                        <span className="text-xs text-gray-400">
                          Last: {new Date(monitor.last_checked_at).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => checkSingleUrl(monitor.url)}
                    className="px-3 py-1 bg-[#191919] hover:bg-[#5200ff] text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer"
                    disabled={monitor.current_status === 'checking'}
                  >
                    Check
                  </button>
                  <button
                    onClick={() => toggleUrlMonitoring(monitor.url)}
                    className={`px-3 py-1 text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer ${
                      monitor.is_monitoring_active 
                        ? 'bg-[red] hover:bg-[#ff4c4c]' 
                        : 'bg-[#191919] hover:bg-[#11db11]'
                    }`}
                  >
                    {monitor.is_monitoring_active ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={() => clearHistory(monitor.url)}
                    className="px-3 py-1 bg-[#191919] hover:bg-[#191919] text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer"
                  >
                    Clear History
                  </button>
                  <button
                    onClick={() => removeUrl(monitor.url)}
                    className="px-3 py-1 bg-[#191919] hover:bg-[red] text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {monitor.recent_checks.length > 0 && (
                <>
                  <div className="mb-3">
                    <h4 className="font-medium text-[#fff] mb-2">Recent History (Last 50 checks)</h4>
                    <div className="flex items-end gap-1 h-8">
                      {monitor.recent_checks.slice(-20).map((check, index) => (
                        <div
                          key={index}
                          className={`flex-1 ${
                            check.status === 'up' ? 'bg-green-400' :
                            check.status === 'down' ? 'bg-yellow-400' :
                            'bg-red-400'
                          } transition-all hover:opacity-80`}
                          style={{ 
                            height: check.response_time_ms 
                              ? `${Math.min(Number(check.response_time_ms) / 50, 100)}%` 
                              : '20%' 
                          }}
                          title={`${new Date(check.timestamp).toLocaleTimeString()} - ${check.status} - ${Number(check.response_time_ms)}ms - ${check.error_message || 'No error'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* History Table Toggle Button */}
                  <div className="mt-4 mb-3">
                    <button
                      onClick={() => toggleHistoryTable(monitor.url)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#191919] hover:bg-[#5200ff] text-white text-sm transition-colors border-1 border-[#505050] cursor-pointer"
                    >
                      <span>
                        Detailed History {showHistoryTable[monitor.url] ? '(Hide)' : '(Show)'}
                      </span>
                    </button>
                  </div>

                  {/* Detailed History Table (Conditional) */}
                  {showHistoryTable[monitor.url] && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-[#fff] mb-3">Detailed History</h4>
                      <div className="max-h-60 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-[#0f0f0f]">
                              <th className="text-left py-2 px-2">Time</th>
                              <th className="text-left py-2 px-2">Status</th>
                              <th className="text-left py-2 px-2">Response Time</th>
                              <th className="text-left py-2 px-2">Status Code</th>
                              <th className="text-left py-2 px-2">Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...monitor.recent_checks].reverse().slice(0, 10).map((check, index) => (
                              <tr key={index} className="border-b hover:bg-[#0f0f0f]">
                                <td className="py-2 px-2">{new Date(check.timestamp).toLocaleTimeString()}</td>
                                <td className="py-2 px-2">
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
                                <td className="py-2 px-2">{check.response_time_ms ? `${Number(check.response_time_ms)}ms` : '-'}</td>
                                <td className="py-2 px-2">{Number(check.status_code) || '-'}</td>
                                <td className="py-2 px-2 text-red-500 text-xs">{check.error_message || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {monitor.recent_checks.length === 0 && monitor.current_status === 'checking' && (
                <div className="text-center py-4 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    Checking URL status...
                  </div>
                </div>
              )}

              {monitor.recent_checks.length === 0 && monitor.current_status !== 'checking' && (
                <div className="text-center py-4 text-gray-500">
                  No history yet. Click "Check" to perform the first check.
                </div>
              )}
            </div>
          ))}
          
          {/* Pagination Controls */}
          {filteredMonitors.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#191919] text-white disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-gray-300">
                Page {currentPage} of {Math.ceil(filteredMonitors.length / itemsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredMonitors.length / itemsPerPage), p + 1))}
                disabled={currentPage >= Math.ceil(filteredMonitors.length / itemsPerPage)}
                className="px-4 py-2 bg-[#191919] text-white disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-[#191919] text-white border border-gray-600 cursor-pointer"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          )}
        </div>
      ) : null}

      {urlMonitors.length === 0 && !loading && (
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