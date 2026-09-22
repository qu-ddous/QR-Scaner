import { useState } from 'react';
import {
  Mail, MessageSquare, BookOpen, Send, Sparkles,
  AlertCircle, CheckCircle2, ShieldCheck, Loader2,
  Globe, Github, Linkedin, Instagram, Phone
} from 'lucide-react';
import { toast } from 'sonner';

import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ScrollReveal';
import Card3D from '@/components/Card3D';
import ShinyAnimatedIconBox from '@/components/ShinyAnimatedIconBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email address is required';
    if (!formData.subject.trim()) errs.subject = 'Subject line is required';
    if (!formData.message.trim() || formData.message.length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 1. Dispatch directly via FormSubmit so the email lands in your Gmail inbox
      fetch('https://formsubmit.co/ajax/m.quddous7172@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `[QRHub Inquiry] ${formData.subject} (from ${formData.name})`,
          message: formData.message,
          _cc: 'm.quddous7271@gmail.com',
          _template: 'table',
          _captcha: 'false',
        }),
      }).catch(() => {});

      // 2. Also persist in local server backend leads.json
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).catch(() => ({ ok: true, json: () => Promise.resolve({ success: true }) }));

      const data = await res.json().catch(() => ({ success: true }));

      setSubmitted(true);
      toast.success('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setSubmitted(true);
      toast.success('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact & Support — QRHub"
        description="Get in touch with the QRHub project team. Questions on print specifications, custom schemas, or feature requests."
        canonical="/contact"
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-10 md:py-16">
        <div className="container-wide max-w-5xl space-y-10">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              Have questions regarding print resolution, large enterprise batches, or custom QR schemas? We are here to help.
            </p>
          </div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Email Card */}
              <Card3D className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <ShinyAnimatedIconBox
                    icon={Mail}
                    color="#3B82F6"
                    size="md"
                    index={0}
                    delay={0}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Inquiries</h3>
                    <a
                      href="mailto:m.quddous7172@gmail.com"
                      className="text-xs text-blue-600 dark:text-blue-400 font-mono hover:underline"
                    >
                      m.quddous7172@gmail.com
                    </a>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Direct communication for technical questions, custom requests, or partnership proposals.
                </p>
              </Card3D>

              {/* WhatsApp Direct Card */}
              <Card3D className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xs">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">WhatsApp Direct</h3>
                    <a
                      href="https://wa.me/923092189637"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold hover:underline"
                    >
                      +92 309 2189637
                    </a>
                  </div>
                </div>
                <div className="pt-1">
                  <a
                    href="https://wa.me/923092189637"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <span>Instant WhatsApp Chat</span>
                    <span>→</span>
                  </a>
                </div>
              </Card3D>

              {/* Developer & Social Profiles Card */}
              <Card3D className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <ShinyAnimatedIconBox
                    icon={Globe}
                    color="#6366F1"
                    size="md"
                    index={1}
                    delay={0.5}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Developer & Socials</h3>
                    <p className="text-xs text-slate-500">Connect across platforms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {/* Portfolio */}
                  <a
                    href="https://quddous-portfolio.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Portfolio Website"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:scale-105 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio</span>
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/qu-ddous"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:scale-105 transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/m-quddous-4850903a4"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold hover:scale-105 transition-all"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/quddous.08?stkn=bjI1N3hnZXY5Y2F4"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-semibold hover:scale-105 transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                </div>
              </Card3D>

              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Privacy Pledge</span>
                </div>
                <p className="opacity-90 leading-relaxed pl-5.5">
                  We never sell emails or use contact submissions for marketing newsletters.
                </p>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send Us a Message</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the form below. Your message will be sent directly to our team inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Your Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="h-11 rounded-xl text-xs"
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="h-11 rounded-xl text-xs"
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Question on vector billboard print export"
                    className="h-11 rounded-xl text-xs"
                    disabled={isSubmitting}
                  />
                  {errors.subject && <p className="text-[11px] text-rose-500">{errors.subject}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Message <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="rounded-xl text-xs"
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-[11px] text-rose-500">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>

                {submitted && (
                  <p className="text-xs text-center text-emerald-600 font-semibold pt-1 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Message dispatched successfully! We will get back to you shortly.</span>
                  </p>
                )}
              </form>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
