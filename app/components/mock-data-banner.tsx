'use client';

import { useEffect, useState } from 'react';
import { Database, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function MockDataBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    const mockEnabled = localStorage.getItem('use_mock_data') === 'true';
    const bannerDismissed = localStorage.getItem('mock_banner_dismissed') === 'true';
    
    setUseMock(mockEnabled);
    setShowBanner(!mockEnabled && !bannerDismissed);
  }, []);

  const enableMockData = () => {
    localStorage.setItem('use_mock_data', 'true');
    window.location.reload();
  };

  const dismissBanner = () => {
    localStorage.setItem('mock_banner_dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner && !useMock) return null;

  if (useMock) {
    return (
      <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <Database className="size-4" />
        <AlertTitle>Mock Data Mode Active</AlertTitle>
        <AlertDescription className="mt-2 flex items-center justify-between">
          <span>Using 25 sample companies and 24 contacts for testing.</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              localStorage.removeItem('use_mock_data');
              window.location.reload();
            }}
          >
            Switch to Database
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
      <Database className="size-4" />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <AlertTitle>No Data Found</AlertTitle>
          <AlertDescription className="mt-2">
            Database is not configured or empty. Would you like to use sample data to
            test the UI?
          </AlertDescription>
          <Button
            size="sm"
            className="mt-3"
            onClick={enableMockData}
          >
            Load 25 Sample Companies
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={dismissBanner}
          className="ml-4"
        >
          <X className="size-4" />
        </Button>
      </div>
    </Alert>
  );
}

