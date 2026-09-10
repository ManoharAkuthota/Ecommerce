import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { Card } from '../../components/ui';

const AdminReviews = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Customer Review Moderation
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Audit, verify, and moderate verified buyer testimonials and ratings.
          </p>
        </div>
      </div>

      <Card glass={true} className="p-12 text-center border-dashed border-dark-800">
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-amber-500/10 text-amber-400 mx-auto border border-amber-500/20">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Customer Feedback Moderation Console
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            This administrative module is protected by JWT Bearer authorization.
            Real-time testimonial filtering, rating metrics inspection, and deletion
            workflows will connect here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminReviews;
