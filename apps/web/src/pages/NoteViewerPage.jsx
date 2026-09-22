import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Copy, Check, Volume2, VolumeX, Sparkles, Share2,
  ArrowRight, ShieldCheck, Clock, Lock, BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

import { decodeMessagePayload, inspectMessagePayload } from '@/lib/messageCrypto';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NoteViewerPage() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Extract hash parameter (#data=...)
  const hashPayload = useMemo(() => {
    const hash = location.hash || '';
    const match = hash.match(/data=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }, [location.hash]);

  useEffect(() => {
    if (!hashPayload) {
      setError('No message payload found in this link.');
      setLoading(false);
      return;
    }

    try {
      const inspection = inspectMessagePayload(hashPayload);
      if (inspection.isEncrypted) {
        setIsEncrypted(true);
        setLoading(false);
        return;
      }

      decodeMessagePayload(hashPayload)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to read note.');
          setLoading(false);
        });
    } catch (err) {
      setError('The message link appears to be invalid or incomplete.');
      setLoading(false);
    }
  }, [hashPayload]);

  const handleCopy = () => {
    if (!data?.text) return;
    navigator.clipboard.writeText(data.text);
    setCopied(true);
    toast.success('Note copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported on your browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const fullText = (data?.title ? `${data.title}. ` : '') + (data?.text || '');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data?.title || 'Shared Note on QRHub',
        text: data?.text?.slice(0, 100),
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Note URL copied to clipboard!');
    }
  };

  const wordCount = data?.text ? data.text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = data?.text ? data.text.length : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50/80 via-indigo-50/40 to-slate-100/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 transition-colors duration-300 overflow-hidden">
      <SEO
        title={data?.title ? `${data.title} — QRHub Note Viewer` : 'Shared Note — QRHub'}
        description="View notes and messages instantly shared via QRHub QR codes."
      />

      {/* Ambient glowing background orbs for colorful aesthetic */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-80 h-80 bg-purple-500/15 dark:bg-purple-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-20 w-80 h-80 bg-cyan-500/15 dark:bg-cyan-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto space-y-6 pt-4 sm:pt-6">
        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading your note...</p>
          </div>
        )}

        {/* If Payload is Password Protected, Redirect/Prompt to Secret Page */}
        {!loading && isEncrypted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-amber-300/80 dark:border-amber-900/60 shadow-2xl backdrop-blur-xl text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Lock className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                <span>Password Protected</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Secret Note Locked
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                This note requires a password to read. Open it in the Secret Vault to enter your passcode and unlock it.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to={`/secret#data=${hashPayload}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-sm font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                <Lock className="h-4 w-4" />
                <span>Go to Password Unlock Screen</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-lg text-center space-y-3">
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
            <Link to="/generator?type=text" className="inline-block text-xs font-semibold text-blue-600 hover:underline">
              Create a new QR note &rarr;
            </Link>
          </div>
        )}

        {/* Unencrypted Note View */}
        {!loading && !isEncrypted && data && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Colorful Note Card */}
            <div className="relative rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-blue-200/80 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(79,110,247,0.15)] dark:shadow-2xl backdrop-blur-xl overflow-hidden transition-colors">
              {/* Colorful Accent Top Banner Gradient */}
              <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

              {/* Card Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Note</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50">
                    <BookOpen className="h-3 w-3" />
                    <span>{readMinutes} min read</span>
                  </span>
                  {data.timestamp && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(data.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Audio, Share & Copy Toolbar */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSpeech}
                    title={isSpeaking ? 'Stop listening' : 'Listen to note'}
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl transition-colors",
                      isSpeaking
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    title="Share note"
                    className="h-8 w-8 p-0 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    title="Copy note"
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl transition-colors",
                      copied
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-4">
                {data.title && (
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    {data.title}
                  </h1>
                )}

                <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal break-words selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-white">
                  {data.text}
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{wordCount} words • {charCount} characters</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  {copied ? '✓ Copied to clipboard' : 'Copy to clipboard'}
                </button>
              </div>
            </div>

            {/* Viral QRHub Promotion Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-sm">
                    <Sparkles className="h-3 w-3" />
                    <span>Free QR Studio</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black">Create Your Own QR Codes</h3>
                  <p className="text-xs sm:text-sm text-white/85 max-w-md leading-relaxed">
                    Generate vector QR codes for websites, encrypted notes, Wi-Fi networks, contacts, and WhatsApp. Fast, free, and customizable.
                  </p>
                </div>

                <Link
                  to="/generator"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-600 font-bold text-xs shadow-lg hover:bg-white/95 hover:scale-105 transition-all whitespace-nowrap"
                >
                  <span>Open QR Studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
