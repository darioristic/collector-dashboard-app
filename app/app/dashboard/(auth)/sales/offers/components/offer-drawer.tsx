'use client';

import { format } from 'date-fns';
import { X, DollarSign, Calendar, User, FileText, Mail, Phone, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface Offer {
  id: string;
  offerNo: string;
  status: string;
  customer?: { 
    name: string;
    email?: string;
    phone?: string;
    company?: { name: string };
  };
  total: number;
  currency: string;
  validUntil?: string;
  createdAt: string;
  description?: string;
}

interface OfferDrawerProps {
  offer: Offer;
  isOpen: boolean;
  onClose: () => void;
}

export function OfferDrawer({ offer, isOpen, onClose }: OfferDrawerProps) {
  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'warning' | 'info' | 'success' | 'destructive' | 'outline'> = {
      DRAFT: 'secondary',
      SENT: 'info',
      ACCEPTED: 'success',
      REJECTED: 'destructive',
      EXPIRED: 'warning',
    };
    return variants[status] || 'secondary';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl">{offer.offerNo}</SheetTitle>
              <SheetDescription>
                Offer details and information
              </SheetDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}
          <div className="flex gap-2">
            <Badge variant={getStatusVariant(offer.status)}>
              {offer.status}
            </Badge>
          </div>

          {/* Amount */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
            </div>
            <div className="text-2xl font-semibold">
              {offer.currency} {offer.total}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{offer.customer?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">Customer Name</p>
                </div>
              </div>
              
              {offer.customer?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{offer.customer.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
              )}
              
              {offer.customer?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{offer.customer.phone}</p>
                    <p className="text-xs text-muted-foreground">Phone</p>
                  </div>
                </div>
              )}
              
              {offer.customer?.company?.name && (
                <div className="flex items-center gap-3">
                  <Building className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{offer.customer.company.name}</p>
                    <p className="text-xs text-muted-foreground">Company</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Important Dates</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {offer.validUntil ? format(new Date(offer.validUntil), 'dd.MM.yyyy') : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">Valid Until</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {offer.description && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>
          )}

          {/* Created Date */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3">
              <FileText className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Created {format(new Date(offer.createdAt), 'dd.MM.yyyy')}
                </p>
                <p className="text-xs text-muted-foreground">Offer Created</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
