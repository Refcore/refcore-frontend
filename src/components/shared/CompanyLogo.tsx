import { Zap } from 'lucide-react';

export default function CompanyLogo({ noText }: { noText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-gradient-success flex items-center justify-center">
        <Zap className="w-4 h-4 text-black" />
      </div>

      {!noText && (
        <span className="text-xl font-bold tracking-wider">REFCORE</span>
      )}
    </div>
  );
}
