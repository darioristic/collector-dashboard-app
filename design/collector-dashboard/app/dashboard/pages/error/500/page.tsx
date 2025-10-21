import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error500() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 500 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-foreground/20 select-none">500</h1>
        </div>
        
        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Internal Server Error
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Something went wrong on our end. Please try again later.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Link>
          </Button>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 text-xs text-muted-foreground/60">
          <p>If the problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
