'use client';

import { ToastContainer } from 'react-toastify';


export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName={(context) => {
        const type = context?.type;

        const base =
          'rounded-xl border-2 bg-[#13131a] text-white shadow-lg backdrop-blur-md w-full md:w-fit px-3 py-2 md:px-6';

        if (type === 'success') {
          return `${base} border-[#00ff9d]/70 shadow-[#00ff9d]/10`;
        }

        if (type === 'error') {
          return `${base} border-red-400/70 shadow-red-400/10`;
        }

        if (type === 'warning') {
          return `${base} border-yellow-400/70 shadow-yellow-400/10`;
        }

        if (type === 'info') {
          return `${base} border-[#00d0ff]/70 shadow-[#00d0ff]/10`;
        }

        return `${base} border-white/10`;
      }}
    />
  );
}
