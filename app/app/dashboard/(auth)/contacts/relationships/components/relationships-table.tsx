'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  Building2,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useDeleteRelationship } from '@/hooks/use-relationships';
import type { ApiResponse, Relationship } from '@/lib/api/types';

interface RelationshipsTableProps {
  data?: ApiResponse<Relationship[]>;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
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

export function RelationshipsTable({
  data,
  isLoading,
  currentPage,
  onPageChange,
}: RelationshipsTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [relationshipToDelete, setRelationshipToDelete] = useState<Relationship | null>(null);
  const deleteRelationship = useDeleteRelationship();

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
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const relationships = data?.data || [];
  const pagination = data?.pagination;

  if (relationships.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">No relationships found</p>
        <p className="text-xs text-muted-foreground">
          Try adjusting your filters or create a new relationship
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Company</TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Target Company</TableHead>
                <TableHead>Relation Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relationships.map((relationship) => (
                <TableRow key={relationship.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {relationship.sourceCompany?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {relationship.sourceCompany?.city}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {relationship.targetCompany?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {relationship.targetCompany?.city}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={RELATION_COLORS[relationship.relationType]}
                    >
                      {relationship.relationType.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_COLORS[relationship.status]}
                    >
                      {relationship.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(relationship.createdAt), 'dd.MM.yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRelationshipToDelete(relationship);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total}{' '}
              total)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Relationship</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this relationship between{' '}
              {relationshipToDelete?.sourceCompany?.name} and{' '}
              {relationshipToDelete?.targetCompany?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteRelationship.isPending}
            >
              {deleteRelationship.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

