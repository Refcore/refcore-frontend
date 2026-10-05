'use client';

import Link from 'next/link';
import {
  CheckCircle2,
  CircleAlert,
  RefreshCw,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { AUTH_ROUTES } from '@/routes';

const EmailVerifiedContent = () => {
  const searchParams = useSearchParams();

  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');
  const errorDescription = searchParams.get('error_description');

  const verificationFailed = !!error;
  const isExpired = errorCode === 'otp_expired';

  if (verificationFailed) {
    return (
      <div className="mx-auto w-full max-w-md p-4 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <CircleAlert className="h-7 w-7 text-red-400" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-white">
          Verification failed
        </h1>

        <p className="mb-6 text-sm leading-6 text-gray-400">
          {isExpired
            ? 'This verification link has expired or has already been used.'
            : errorDescription ||
              'We could not verify your email address. The link may be invalid or expired.'}
        </p>

        <div className="space-y-3">
          <Link
            href="/email-sent"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0059ff] to-[#00d0ff] px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Resend verification email
          </Link>

          <Link
            href={AUTH_ROUTES.LOGIN}
            className="flex w-full items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            Go to sign in
          </Link>
        </div>

        {errorCode && (
          <p className="mt-5 text-xs text-gray-600">
            Error: {errorCode}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md p-4 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#00ff9d]/10">
        <CheckCircle2 className="h-7 w-7 text-[#00ff9d]" />
      </div>

      <h1 className="mb-2 text-2xl font-bold text-white">
        Email verified
      </h1>

      <p className="mb-6 text-sm leading-6 text-gray-400">
        Your email address has been successfully verified. You can now sign in
        to your REFCORE account and continue setting up your channel.
      </p>

      <Link
        href={AUTH_ROUTES.LOGIN}
        className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-[#0059ff] to-[#00d0ff] px-5 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Continue to sign in
      </Link>
    </div>
  );
};

export default EmailVerifiedContent;