'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { type ReactNode } from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  children: ReactNode;
}

export function BulkActionsBar({ selectedCount, onClearSelection, children }: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <Card className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 shadow-lg border-2">
      <div className="flex items-center gap-4 p-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{selectedCount}</span>
          <span className="text-muted-foreground">selected</span>
        </div>
        
        <div className="h-8 w-px bg-border" />
        
        <div className="flex items-center gap-2">
          {children}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

