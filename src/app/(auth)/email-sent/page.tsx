'use client';
import { useEffect, useState } from 'react';
import { useResendVerificationEmail } from '@/hooks/auth/useResendVerificationEmail';
import Link from 'next/link';
import { MailCheck, RefreshCw } from 'lucide-react';
import { AUTH_ROUTES } from '@/routes';

const EmailSentPage = () => {
  const [email, setEmail] = useState<string | null>(null);

  const { isResending, resendVerificationEmail } = useResendVerificationEmail();

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem('pending_verification_email');

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(pendingEmail);
  }, []);

  const handleResend = async () => {
    if (!email) {
      return;
    }

    await resendVerificationEmail(email);
  };

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#00ff9d]/10">
          <MailCheck className="h-7 w-7 text-[#00ff9d]" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
          Check your email
        </h1>

        <p className="text-sm leading-6 text-gray-400">
          We sent a verification link to the email address you provided. Click
          the link to activate your REFCORE account.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-[#13131a] p-4">
        <ul className="space-y-2 text-sm text-gray-400">
          <li>
            • The verification link is valid for{' '}
            <span className="font-medium text-white">24 hours</span>.
          </li>

          <li>
            • You only need to click the verification link{' '}
            <span className="font-medium text-white">once</span>.
          </li>

          <li>
            • If you cannot find the email, check your spam or junk folder.
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-[#0059ff] to-[#00d0ff] px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Go to sign in
        </Link>

        <button
          type="button"
          onClick={handleResend}
          disabled={!email || isResending}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`}
          />

          {isResending
            ? 'Sending verification email...'
            : 'Resend verification email'}
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-gray-500">
        Entered the wrong email?{' '}
        <Link
          href={AUTH_ROUTES.REGISTER}
          className="text-[#00d0ff] hover:underline"
        >
          Register again
        </Link>
      </p>
    </div>
  );
};

export default EmailSentPage;
