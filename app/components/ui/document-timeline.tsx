"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  User,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

interface DocumentTimelineProps {
  events: Event[];
  documentType: 'invoice' | 'offer';
}

const getEventIcon = (action: string) => {
  const actionLower = action.toLowerCase();
  
  if (actionLower.includes('created')) return FileText;
  if (actionLower.includes('sent')) return Send;
  if (actionLower.includes('viewed')) return Eye;
  if (actionLower.includes('paid')) return CreditCard;
  if (actionLower.includes('cancelled') || actionLower.includes('rejected')) return XCircle;
  if (actionLower.includes('accepted') || actionLower.includes('approved')) return CheckCircle;
  if (actionLower.includes('overdue')) return AlertCircle;
  if (actionLower.includes('expired')) return Clock;
  
  return Calendar;
};

const getEventColor = (action: string) => {
  const actionLower = action.toLowerCase();
  
  if (actionLower.includes('created')) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
  if (actionLower.includes('sent')) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
  if (actionLower.includes('viewed')) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  if (actionLower.includes('paid')) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  if (actionLower.includes('cancelled') || actionLower.includes('rejected')) return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  if (actionLower.includes('accepted') || actionLower.includes('approved')) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  if (actionLower.includes('overdue')) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
  if (actionLower.includes('expired')) return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
  
  return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
};

export function DocumentTimeline({ events, documentType }: DocumentTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Document History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No events recorded yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Document History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = getEventIcon(event.action);
            const colorClass = getEventColor(event.action);
            const isLast = index === events.length - 1;
            
            return (
              <div key={event.id} className="relative">
                <div className="flex items-start gap-4">
                  {/* Timeline Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Timeline Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {event.action}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(event.timestamp), 'dd.MM.yyyy')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {event.user}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        at {format(new Date(event.timestamp), 'HH:mm')}
                      </span>
                    </div>
                    
                    {event.details && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {event.details}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-5 top-10 w-px h-6 bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
