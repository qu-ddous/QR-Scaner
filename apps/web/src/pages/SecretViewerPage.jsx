import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, KeyRound, Eye, EyeOff, ShieldCheck, Copy, Check,
  Volume2, VolumeX, Sparkles, ArrowRight, AlertCircle,
  Clock, Share2
} from 'lucide-react';
import { toast } from 'sonner';

import { decodeMessagePayload, inspectMessagePayload } from '@/lib/messageCrypto';
import SEO from '@/components/SEO';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SecretViewerPage() {
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedData, setDecryptedData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Extract hash parameter (#data=...)
  const hashPayload = useMemo(() => {
    const hash = location.hash || '';
    const match = hash.match(/data=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }, [location.hash]);

  // If payload is not actually encrypted, decrypt/load automatically
  useEffect(() => {
    if (!hashPayload) {
      setError('No secret note payload found in this link.');
      return;
    }

    try {
      const inspection = inspectMessagePayload(hashPayload);
      if (!inspection.isEncrypted) {
        // Unencrypted note opened on /secret, decode right away
        decodeMessagePayload(hashPayload).then((res) => {
          setDecryptedData(res);
        });
      }
    } catch (err) {
      setError('Invalid or corrupted secret note link.');
    }
  }, [hashPayload]);

  const handleUnlock = async (e) => {
    e?.preventDefault();
    if (!password.trim()) {
      setError('Please enter the secret password / passcode.');
      return;
    }

    setIsDecrypting(true);
    setError(null);

    try {
      const result = await decodeMessagePayload(hashPayload, password.trim());
      setDecryptedData(result);
      toast.success('Note unlocked successfully!');
    } catch (err) {
      if (err.message === 'INCORRECT_PASSWORD') {
        setError('Incorrect password. Please check your passcode and try again.');
      } else {
        setError(err.message || 'Decryption failed.');
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopy = () => {
    if (!decryptedData?.text) return;
    navigator.clipboard.writeText(decryptedData.text);
    setCopied(true);
    toast.success('Secret message copied to clipboard!');
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
    const fullText = (decryptedData?.title ? `${decryptedData.title}. ` : '') + (decryptedData?.text || '');
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
        title: decryptedData?.title || 'Secret Note on QRHub',
        text: 'Encrypted message via QRHub',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const wordCount = decryptedData?.text ? decryptedData.text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = decryptedData?.text ? decryptedData.text.length : 0;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-slate-100/80 dark:from-slate-950 dark:via-slate-900 dark:to-black text-slate-900 dark:text-slate-100 py-10 px-4 transition-colors duration-300 overflow-hidden">
      <SEO
        title="Secret Encrypted Note — QRHub"
        description="End-to-end encrypted secret note protected by QRHub client-side cryptography."
      />

      {/* Ambient decorative warm glowing background orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 dark:bg-amber-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-80 h-80 bg-rose-500/15 dark:bg-rose-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-20 w-80 h-80 bg-purple-500/15 dark:bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-xl mx-auto space-y-6 pt-4 sm:pt-6">
        {/* LOCKED STATE: Password Form */}
        <AnimatePresence mode="wait">
          {!decryptedData ? (
            <motion.div
              key="locked-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-amber-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.18)] dark:shadow-2xl backdrop-blur-xl text-center space-y-6 transition-colors"
            >
              {/* Shield/Lock Graphic */}
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-amber-500/20 blur-xl animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-300/80 text-amber-600 dark:from-amber-500/20 dark:to-rose-500/20 dark:border-amber-500/30 dark:text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <Lock className="h-10 w-10" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                  <KeyRound className="h-3 w-3" />
                  <span>End-to-End Encrypted Note</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Enter Password to Unlock
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  This note is protected with 256-bit AES encryption. Enter the secret passcode to unlock and reveal the message.
                </p>
              </div>

              {/* Password Input Form */}
              <form onSubmit={handleUnlock} className="space-y-4 text-left max-w-sm mx-auto">
                <div className="space-y-1.5">
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter secret passcode..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      autoFocus
                      className="h-12 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-11 text-sm font-semibold tracking-wide focus:border-amber-500 focus:ring-amber-500/20 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 pt-1"
                    >
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isDecrypting || !password.trim()}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01]"
                >
                  {isDecrypting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Decrypting Note...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Unlock Note</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero-Knowledge Client Decryption</span>
              </div>
            </motion.div>
          ) : (
            /* UNLOCKED / DECRYPTED STATE */
            <motion.div
              key="unlocked-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Decrypted Note Card */}
              <div className="relative rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-amber-200/80 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.18)] dark:shadow-2xl backdrop-blur-xl overflow-hidden transition-colors">
                {/* Colorful Top Gradient Strip */}
                <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Decrypted & Verified</span>
                    </span>
                    {decryptedData.timestamp && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(decryptedData.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>

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
                          : "text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800"
                      )}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      title="Share link"
                      className="h-8 w-8 p-0 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800"
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
                          : "text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800"
                      )}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-4">
                  {decryptedData.title && (
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                      {decryptedData.title}
                    </h1>
                  )}

                  <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal break-words selection:bg-amber-100 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-white">
                    {decryptedData.text}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{wordCount} words • {charCount} characters</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    {copied ? '✓ Copied to clipboard' : 'Copy to clipboard'}
                  </button>
                </div>
              </div>

              {/* Viral Promotion */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-600 via-rose-600 to-purple-700 text-white shadow-xl shadow-amber-500/25 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" />
                      <span>Encrypted QR Studio</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black">Send Your Own Secret Notes</h3>
                    <p className="text-xs sm:text-sm text-white/85 max-w-md leading-relaxed">
                      Protect passwords, Wi-Fi codes, or private messages with client-side AES encryption QR codes. Free on QRHub.
                    </p>
                  </div>

                  <Link
                    to="/generator?type=text"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-white/95 hover:scale-105 transition-all whitespace-nowrap"
                  >
                    <span>Create Secret QR</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
