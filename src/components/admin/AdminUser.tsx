'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import DialogueTool from '../shared/DialogueTool';
import LogoutModal from '../modals/LogoutModal';

const AdminUser = () => {
  const { currentUser, myChannel } = useAuthContext();

  const [open, setOpen] = useState(false);

  const user_name = currentUser?.user_name || 'Admin User';

  const email = currentUser?.email || 'No email';

  const tv_name = myChannel?.tv_name || '';

  const avatar = null;

  const initials = user_name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="rounded-lg border-2 border-white/5 bg-white/5 p-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#7c3aed] to-[#0b9eca] text-sm font-semibold text-white">
          {avatar ? (
            <Image
              src={avatar}
              alt={user_name}
              fill
              className="object-cover"
              sizes="44px"
            />
          ) : (
            <span>{initials || 'AU'}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{user_name}</p>

          <p className="truncate text-xs text-muted-foreground">{email}</p>

          {tv_name ? (
            <p className="truncate text-[11px] text-white/70">{tv_name}</p>
          ) : null}
        </div>
      </div>

      <DialogueTool
        open={open}
        onOpenChange={setOpen}
        title="Confirm Logout"
        description="Are you sure you want to Logout?"
        content={<LogoutModal onClose={() => setOpen(false)} />}
        contentClassName='border-2'
      >
        <Button className="w-full text-red-500 y-2 bg-background/30">
          <LogOut /> Logout
        </Button>
      </DialogueTool>
    </div>
  );
};

export default AdminUser;
