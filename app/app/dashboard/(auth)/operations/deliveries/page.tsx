'use client';

import { useState } from 'react';
import { useDeliveries, useMarkDelivered, useSignDelivery } from '@/hooks/use-deliveries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Truck, CheckCircle, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function DeliveriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [signedBy, setSignedBy] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  
  const { data, isLoading } = useDeliveries({ page, limit: 20 });
  const markDelivered = useMarkDelivered();
  const signDelivery = useSignDelivery();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PREPARED: 'bg-gray-500',
      DELIVERED: 'bg-blue-500',
      SIGNED: 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const handleMarkDelivered = async (id: string) => {
    try {
      await markDelivered.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Delivery marked as delivered',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark delivery',
        variant: 'destructive',
      });
    }
  };

  const handleSign = async () => {
    if (!selectedDelivery || !signedBy) return;
    
    try {
      await signDelivery.mutateAsync({ id: selectedDelivery, signedBy });
      toast({
        title: 'Success',
        description: 'Delivery signed successfully',
      });
      setSelectedDelivery(null);
      setSignedBy('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign delivery',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const deliveries = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Deliveries</h1>
          <p className="text-muted-foreground mt-1">Track and manage deliveries</p>
        </div>
        <Button onClick={() => router.push('/dashboard/operations/deliveries/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Delivery
        </Button>
      </div>

      <div className="grid gap-4">
        {deliveries.map((delivery: any) => (
          <Card key={delivery.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{delivery.deliveryNo}</h3>
                  <Badge className={getStatusColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Order:</span> {delivery.order?.orderNo}</p>
                  <p><span className="font-medium">Customer:</span> {delivery.order?.customer?.name}</p>
                  <p><span className="font-medium">Delivery Date:</span> {new Date(delivery.deliveryDate).toLocaleDateString('sr-RS')}</p>
                  {delivery.signedBy && (
                    <p><span className="font-medium">Signed By:</span> {delivery.signedBy}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/dashboard/operations/deliveries/${delivery.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                {delivery.status === 'PREPARED' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMarkDelivered(delivery.id)}
                  >
                    <Truck className="h-4 w-4" />
                  </Button>
                )}
                
                {delivery.status === 'DELIVERED' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedDelivery(delivery.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sign Delivery</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Signer name"
                          value={signedBy}
                          onChange={(e) => setSignedBy(e.target.value)}
                        />
                        <Button onClick={handleSign} className="w-full">
                          Sign Delivery
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
    </div>
  );
}

