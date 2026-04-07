'use client';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/auth/useLogout';

type LogoutModalProps = {
  onClose: () => void;
};

const LogoutModal = ({ onClose }: LogoutModalProps) => {
  const { logout, is_logging_out } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex gap-3 w-full">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={is_logging_out}
        className="border-white/10 bg-transparent text-white hover:bg-white/5 flex-1 border-2"
      >
        Cancel
      </Button>

      <Button
        type="button"
        onClick={handleLogout}
        disabled={is_logging_out}
        className="bg-red-500 text-white hover:bg-red-600 flex-1"
      >
        {is_logging_out ? 'Logging out...' : 'Yes, Log out'}
      </Button>
    </div>
  );
};

export default LogoutModal;
