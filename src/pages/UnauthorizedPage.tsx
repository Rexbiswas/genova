import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-white rounded-card border border-border p-8 shadow-card text-center max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-error flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-ink">403</h2>
        <h3 className="text-base font-bold text-ink">Access Denied</h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          You do not have administrative clinical permissions to access this medical record or internal panel.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/dashboard')}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="w-full"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
