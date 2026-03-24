import CompanyLogo from '../shared/CompanyLogo';
import { XIcon } from '../icons/XIcon';
import { Discord } from '../icons/Discord';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden space-y-8 mx-auto w-full max-w-(--breakpoint-2xl) py-15 pb-4 md:pt-16 px-6 md:px-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-0">
        <div className="w-full md:max-w-100 space-y-4">
          <CompanyLogo />
          <p className="text-xs max-w-65 text-muted-foreground">
            Automated WhatsApp Referral Contest System. Build, gamify, and grow
            your audience effortlessly.
          </p>

          <div className='flex gap-3 text-muted-foreground'>
            <XIcon /> <Discord />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          <ul className="text-sm text-muted-foreground space-y-3">
            <p className="font-semibold text-base text-foreground">Products</p>
            <li>Features</li>
            <li>Pricing</li>
            <li>Leaderboard Review</li>
            <li>Changelog</li>
          </ul>

          <ul className="text-sm text-muted-foreground space-y-3">
            <p className="font-semibold text-base text-foreground">Company</p>
            <li>About Us</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>

          <ul className="text-sm text-muted-foreground space-y-3">
            <p className="font-semibold text-base text-foreground">Resources</p>
            <li>Doc</li>
            <li>Community</li>
          </ul>
        </div>
      </div>
      <div className="py-4 flex justify-between text-muted-foreground text-xs text-nowrap border-t">
        <p>© 2026 REFCORE Inc. All rights reserved.</p>
        <div className="flex gap-2 items-center">
          <p className="h-2 w-2 shrink-0 bg-green-400 rounded-full animate-pulse"></p>
          Systems Operational
        </div>
      </div>
    </footer>
  );
};

export default Footer;
