'use client';

import { ToastContainer } from 'react-toastify';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
      draggable
      theme="dark"
      toastClassName="glass !bg-background/50 !shadow-none rounded-2xl border-2 border-white/10"
      className="text-sm"
      limit={1}
      hideProgressBar={false}
      progressClassName="!bg-white/20"
    />
  );
}
