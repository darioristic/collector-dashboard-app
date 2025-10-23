'use client';

import { useState } from 'react';
import { useOrders, useConfirmOrder, useFulfillOrder, useCancelOrder, useBulkOrderAction } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BulkActionsBar } from '@/components/ui/bulk-actions-bar';
import { PageLoader } from '@/components/ui/standard-loader';
import { Plus, CheckCircle, Package, XCircle, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const { data, isLoading } = useOrders({ page, limit: 20 });
  
  const confirmOrder = useConfirmOrder();
  const fulfillOrder = useFulfillOrder();
  const cancelOrder = useCancelOrder();
  const bulkAction = useBulkOrderAction();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-500',
      CONFIRMED: 'bg-blue-500',
      FULFILLED: 'bg-green-500',
      CANCELLED: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const handleConfirm = async (id: string) => {
    try {
      await confirmOrder.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Order confirmed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm order',
        variant: 'destructive',
      });
    }
  };

  const handleFulfill = async (id: string) => {
    try {
      await fulfillOrder.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Order fulfilled successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fulfill order',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelOrder.mutateAsync({ id });
      toast({
        title: 'Success',
        description: 'Order cancelled successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel order',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async (action: 'confirm' | 'fulfill' | 'cancel') => {
    try {
      const result = await bulkAction.mutateAsync({ ids: selectedIds, action });
      toast({
        title: 'Success',
        description: result.data.message,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action',
        variant: 'destructive',
      });
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o: any) => o.id));
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading orders..." />;
  }

  const orders = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your orders</p>
        </div>
        <div className="flex gap-2">
          {orders.length > 0 && (
            <Button variant="outline" onClick={toggleAll}>
              {selectedIds.length === orders.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Button onClick={() => router.push('/dashboard/sales/orders/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order: any) => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4 flex-1">
                <Checkbox
                  checked={selectedIds.includes(order.id)}
                  onCheckedChange={() => toggleSelection(order.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{order.orderNo}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Customer:</span> {order.customer?.name}</p>
                    <p><span className="font-medium">Total:</span> {order.currency} {order.total}</p>
                    {order.offer && (
                      <p><span className="font-medium">From Offer:</span> {order.offer.offerNo}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/dashboard/sales/orders/${order.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                {order.status === 'DRAFT' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfirm(order.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancel(order.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {order.status === 'CONFIRMED' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFulfill(order.id)}
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pagination && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}

      <BulkActionsBar 
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
      >
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleBulkAction('confirm')}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Confirm
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleBulkAction('fulfill')}
        >
          <Package className="mr-2 h-4 w-4" />
          Fulfill
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleBulkAction('cancel')}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </BulkActionsBar>
    </div>
  );
}

