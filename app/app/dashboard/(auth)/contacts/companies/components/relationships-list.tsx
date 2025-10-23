'use client';

import { useState } from 'react';
import { Plus, Building2, ArrowRight, Edit, Trash2, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRelationships, useDeleteRelationship } from '@/hooks/use-relationships';
import type { Relationship } from '@/lib/api/types';

interface RelationshipsListProps {
  companyId: string;
}

const RELATION_COLORS = {
  CUSTOMER: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  SUPPLIER: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  PARTNER: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
};

const STATUS_COLORS = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  INACTIVE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export function RelationshipsList({ companyId }: RelationshipsListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [relationshipToDelete, setRelationshipToDelete] = useState<Relationship | null>(null);

  const { data, isLoading } = useRelationships({ companyId });
  const deleteRelationship = useDeleteRelationship();

  const relationships = data?.data || [];

  const handleDelete = () => {
    if (relationshipToDelete) {
      deleteRelationship.mutate(relationshipToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setRelationshipToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Loading relationships...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Company Relationships</h3>
        <Button size="sm" disabled>
          <Plus className="mr-2 size-4" />
          Add Relationship
        </Button>
      </div>

      {relationships.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Network className="mx-auto mb-2 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No relationships yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Relationships will appear here when they are created
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {relationships.map((relationship) => {
            const isSource = relationship.sourceCompanyId === companyId;
            const relatedCompany = isSource
              ? relationship.targetCompany
              : relationship.sourceCompany;

            return (
              <div
                key={relationship.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex flex-1 items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
                    <Building2 className="size-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{relatedCompany?.name || 'Unknown'}</p>
                      <ArrowRight className="size-4 text-muted-foreground" />
                      <Badge
                        variant="secondary"
                        className={RELATION_COLORS[relationship.relationType]}
                      >
                        {relationship.relationType.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={STATUS_COLORS[relationship.status]}
                      >
                        {relationship.status.toLowerCase()}
                      </Badge>
                      {relatedCompany?.city && (
                        <span className="text-sm text-muted-foreground">
                          {relatedCompany.city}, {relatedCompany.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setRelationshipToDelete(relationship);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Relationship</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this relationship? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

