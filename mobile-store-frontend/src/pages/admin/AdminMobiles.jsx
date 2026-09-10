import React from 'react';
import { Smartphone, PlusCircle } from 'lucide-react';
import { Card, Button } from '../../components/ui';

const AdminMobiles = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Mobile Device Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage flagship smartphone inventory, pricing, visibility, and Cloudinary media.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
          Add New Mobile
        </Button>
      </div>

      <Card glass={true} className="p-12 text-center border-dashed border-dark-800">
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-accent-600/10 text-accent-400 mx-auto border border-accent-500/20">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Mobile Catalog Management Console
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            This administrative module is protected by JWT Bearer authorization.
            Full CRUD operations, stock status toggles, product visibility controls,
            and Cloudinary multi-image upload workflows will connect here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminMobiles;
