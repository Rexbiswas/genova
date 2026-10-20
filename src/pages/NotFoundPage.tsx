import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-white rounded-card border border-border p-8 shadow-card text-center max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-ink-muted">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-ink">404</h2>
        <h3 className="text-base font-bold text-ink">Page Not Found</h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          The healthcare resource or screen you are trying to access does not exist or was relocated.
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

export default NotFoundPage;
