import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <div className="min-h-screen bg-background">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-card border-r border-border">
              <div className="p-6">
                <h2 className="text-xl font-bold">Midday Dashboard</h2>
              </div>
              <nav className="px-4 pb-4">
                <div className="space-y-2">
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground">
                    Overview
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
                    Analytics
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
                    Reports
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
                    Settings
                  </a>
                </div>
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <header className="bg-background/40 sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b backdrop-blur-md">
                <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">U</span>
                    </div>
                  </div>
                </div>
              </header>
              
              {/* Page Content */}
              <main className="flex-1">
                <div className="p-4 xl:container xl:mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}