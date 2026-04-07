'use client';

import React, { type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DialogueToolProps = {
  children: ReactNode;
  content: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DialogueTool = ({
  children,
  content,
  title,
  description,
  contentClassName,
  open,
  onOpenChange,
}: DialogueToolProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className={contentClassName}>
        {title || description ? (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
        ) : null}

        {content}
      </DialogContent>
    </Dialog>
  );
};

export default DialogueTool;
