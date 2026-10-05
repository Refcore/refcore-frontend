import { Suspense } from 'react';
import EmailVerifiedContent from './EmailVerifiedContent';

const EmailVerifiedPage = () => {
  return (
    <Suspense fallback={null}>
      <EmailVerifiedContent />
    </Suspense>
  );
};

export default EmailVerifiedPage;