"use client";

import React from "react";
import { Button } from "@/components/Button";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const Modal = ({ isOpen, title, onClose, children, footer }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900 shadow-xl">
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-4">
          <div>
            {title ? <h2 className="text-xl font-semibold text-white">{title}</h2> : null}
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="Close modal">
            Close
          </Button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? <div className="border-t border-white/10 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
};
