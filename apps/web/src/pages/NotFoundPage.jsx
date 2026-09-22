import { Link } from 'react-router-dom';
import { QrCode, Home, Plus, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 — Page Not Found"
        description="The page you are looking for does not exist."
        noIndex={true}
      />

      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-slate-50/60 dark:bg-slate-950">
        <div className="max-w-md space-y-6">
          {/* Playful QR graphic */}
          <div className="relative mx-auto h-28 w-28 rounded-3xl bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <QrCode className="h-14 w-14 text-blue-600 dark:text-blue-400" />
            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-xs">
              404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Oops! This QR took a wrong turn.
            </h1>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              The link you followed could not be decoded or no longer exists at this location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Back Home</span>
              </Button>
            </Link>

            <Link to="/generator" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                <span>Create QR Code</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
