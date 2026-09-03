import Link from 'next/link';
import { ArrowLeft, CheckCircle2, MailCheck, ShieldCheck } from 'lucide-react';
import { AUTH_ROUTES } from '@/routes';

const EmailSentPage = () => {
  return (
    <div className="p-3">
      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/10 shadow-[0_0_35px_rgba(0,255,157,0.18)]">
        <MailCheck className="h-10 w-10 text-[#00ff9d]" />
      </div>
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00ff9d]/20 bg-[#00ff9d]/10 px-3 py-1.5">
          <CheckCircle2 className="h-4 w-4 text-[#00ff9d]" />
          <span className="text-xs font-semibold text-[#00ff9d]">
            Account created successfully
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Check your email
        </h1>

        <p className="mx-auto max-w-md leading-7 text-gray-400">
          We sent a verification link to the email address you provided. Open
          the email and click the verification link to activate your REFCORE
          account.
        </p>
      </div>
      <div className="my-3 rounded-2xl border border-[#00d0ff]/20 bg-[#13131a] p-2">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00d0ff]/10">
            <ShieldCheck className="h-5 w-5 text-[#00d0ff]" />
          </div>

          <div>
            <h2 className="mb-1 font-semibold text-white">
              Complete your verification
            </h2>

            <p className="text-sm leading-6 text-gray-400">
              You will not be able to sign in until your email address has been
              verified.
            </p>

            <p className="text-sm leading-6 text-gray-400">
              If you can&apos;t find mail in your inbox, check your SPAM folder or
              try resending the verification email.
            </p>
          </div>
        </div>
      </div>
      <Link
        href={AUTH_ROUTES.LOGIN}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0059ff] to-[#00d0ff] px-5 py-3.5 font-semibold text-white shadow-[0_0_25px_rgba(183,0,255,0.2)] transition hover:scale-[1.01] hover:opacity-90"
      >
        Go to sign in
      </Link>

      <div className="mt-6 text-center">
        <p className="text-sm leading-6 text-gray-500">
          Cannot find the email? Check your spam or junk folder and confirm that
          you entered the correct email address.
        </p>
      </div>
      <Link
        href={AUTH_ROUTES.REGISTER}
        className="mx-auto mt-6 flex w-fit items-center gap-2 text-sm text-gray-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to registration
      </Link>
    </div>
  );
};

export default EmailSentPage;
