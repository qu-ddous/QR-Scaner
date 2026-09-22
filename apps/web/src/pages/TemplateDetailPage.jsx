import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  ArrowLeft, ArrowRight, Sparkles, CheckCircle2, ShieldCheck,
  Download, Copy, Sliders, ExternalLink, Info
} from 'lucide-react';
import { toast } from 'sonner';

import { TEMPLATES } from '@/lib/templatesData';
import { formatQRData } from '@/lib/qrDataFormatter';
import SEO from '@/components/SEO';
import Card3D from '@/components/Card3D';
import { Button } from '@/components/ui/button';

export default function TemplateDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const template = TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Template Not Found</h2>
        <p className="text-slate-500 mt-1 mb-6">The requested template configuration does not exist.</p>
        <Link to="/templates">
          <Button variant="outline">Browse All Templates</Button>
        </Link>
      </div>
    );
  }

  const handleCustomize = () => {
    navigate(`/generator?template=${template.slug}`);
  };

  return (
    <>
      <SEO
        title={`${template.title} — QR Template`}
        description={template.description}
        canonical={`/templates/${template.slug}`}
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-12 md:py-20">
        <div className="container-wide max-w-6xl space-y-8">
          {/* Back link */}
          <Link
            to="/templates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all templates</span>
          </Link>

          {/* Split Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Large Preview Card */}
            <div className="lg:col-span-5">
              <Card3D className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center space-y-6">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: template.pastelBg, color: template.accentColor }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{template.category} Blueprint</span>
                </div>

                {/* QR Canvas */}
                <div
                  className="p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800"
                  style={{ backgroundColor: template.customization.bgColor }}
                >
                  <QRCodeCanvas
                    value={formatQRData(template.type, template.defaultData) || 'https://qrhub.app'}
                    size={220}
                    fgColor={template.customization.fgColor}
                    bgColor={template.customization.bgColor}
                    level={template.customization.ecc}
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">
                    Schema: {template.type.toUpperCase()}
                  </span>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Tested for High Scannability</span>
                  </div>
                </div>

                <Button
                  onClick={handleCustomize}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Sliders className="h-4 w-4" />
                  <span>Customize This Template</span>
                </Button>
              </Card3D>
            </div>

            {/* Right: Informational Content */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  {template.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {template.title}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Recommended Deployments */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Recommended Deployments
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {template.useCases.map((useCase, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Design Tips */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Production Tip</span>
                </div>
                <p className="leading-relaxed opacity-90 pl-5.5">
                  {template.tips}
                </p>
              </div>

              {/* Included Default Fields */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Pre-configured Fields
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(template.defaultData).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                    >
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">{k}</span>
                      <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
