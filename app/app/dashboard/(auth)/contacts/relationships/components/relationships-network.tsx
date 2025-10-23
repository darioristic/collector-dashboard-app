'use client';

import { Building2, Loader2, Network as NetworkIcon, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Relationship, Company } from '@/lib/api/types';

interface RelationshipsNetworkProps {
  relationships: Relationship[];
  companies: Company[];
  isLoading: boolean;
}

const TYPE_COLORS = {
  CUSTOMER: 'bg-blue-500',
  SUPPLIER: 'bg-purple-500',
  PARTNER: 'bg-green-500',
  INTERNAL: 'bg-gray-500',
};

export function RelationshipsNetwork({
  relationships,
  companies,
  isLoading,
}: RelationshipsNetworkProps) {
  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (relationships.length === 0) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center gap-2">
        <NetworkIcon className="size-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No relationships to visualize</p>
        <p className="text-xs text-muted-foreground">
          Create relationships to see the network diagram
        </p>
      </div>
    );
  }

  // Build connection map
  const connectionMap = new Map<string, Set<string>>();
  const companyMap = new Map<string, Company>();

  companies.forEach((company) => {
    companyMap.set(company.id, company);
  });

  relationships.forEach((rel) => {
    if (!connectionMap.has(rel.sourceCompanyId)) {
      connectionMap.set(rel.sourceCompanyId, new Set());
    }
    connectionMap.get(rel.sourceCompanyId)?.add(rel.targetCompanyId);
  });

  // Get connection counts
  const connectionCount = new Map<string, number>();
  companies.forEach((company) => {
    const count = relationships.filter(
      (r) => r.sourceCompanyId === company.id || r.targetCompanyId === company.id
    ).length;
    connectionCount.set(company.id, count);
  });

  // Get most connected companies (hubs)
  const hubs = Array.from(connectionMap.entries())
    .map(([id, connections]) => ({
      company: companyMap.get(id),
      connectionCount: connections.size,
      connections: Array.from(connections)
        .map((cId) => companyMap.get(cId))
        .filter((c): c is Company => c !== undefined),
    }))
    .filter((hub) => hub.company)
    .sort((a, b) => b.connectionCount - a.connectionCount)
    .slice(0, 10);

  // Get companies involved in relationships
  const involvedCompanies = companies.filter(
    (company) => (connectionCount.get(company.id) || 0) > 0
  );

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-blue-500" />
          <span className="text-sm">Customer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-purple-500" />
          <span className="text-sm">Supplier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-green-500" />
          <span className="text-sm">Partner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-gray-500" />
          <span className="text-sm">Internal</span>
        </div>
      </div>

      {/* Relationship Stats by Type */}
      <div>
        <h3 className="mb-4 text-sm font-medium">Relationships by Type</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {(['CUSTOMER', 'SUPPLIER', 'PARTNER'] as const).map((type) => {
            const count = relationships.filter((r) => r.relationType === type).length;
            const percentage = relationships.length > 0 ? ((count / relationships.length) * 100).toFixed(0) : '0';

            return (
              <Card key={type} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="secondary">
                    {type.toLowerCase()}
                  </Badge>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${
                      type === 'CUSTOMER'
                        ? 'bg-blue-500'
                        : type === 'SUPPLIER'
                        ? 'bg-purple-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {percentage}% of total
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Network Hubs */}
      {hubs.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-medium">Most Connected Companies</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {hubs.map((hub) => (
              <Card key={hub.company?.id} className="p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border bg-muted">
                    <Building2 className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{hub.company?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {hub.connectionCount} connection{hub.connectionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {hub.company?.type.toLowerCase()}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {hub.connections.slice(0, 5).map((connected) => (
                    <div
                      key={connected.id}
                      className="flex items-center gap-2 rounded-md border bg-background p-2 text-sm"
                    >
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span className="flex-1 truncate">{connected.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {connected.city}
                      </span>
                    </div>
                  ))}
                  {hub.connections.length > 5 && (
                    <div className="text-xs text-muted-foreground">
                      +{hub.connections.length - 5} more...
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Company Network Grid */}
      {involvedCompanies.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-medium">Company Network Overview</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {involvedCompanies.map((company) => {
              const connections = connectionCount.get(company.id) || 0;
              return (
                <Card
                  key={company.id}
                  className="p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                      <Building2 className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {connections} connection{connections !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

