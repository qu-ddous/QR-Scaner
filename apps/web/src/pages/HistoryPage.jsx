import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History, Search, Trash2, ExternalLink, Copy,
  QrCode, Plus, Folder
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeCanvas } from 'qrcode.react';

import { 
  getHistory, deleteFromHistory, clearHistory, 
  updateHistoryEntry, DEFAULT_TAGS 
} from '@/lib/qrHistory';
import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ScrollReveal';
import Card3D from '@/components/Card3D';
import { Button } from '@/components/ui/button';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    // Only load real user-generated QR codes from local storage
    setHistory(getHistory());
  }, []);

  const handleDelete = (id) => {
    const updated = deleteFromHistory(id);
    setHistory(updated);
    toast.success('Removed from local history');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your saved QR history?')) {
      clearHistory();
      setHistory([]);
      toast.success('Local history cleared');
    }
  };

  const handleCopy = (payload) => {
    navigator.clipboard.writeText(payload);
    toast.success('Payload copied to clipboard!');
  };

  const handleUpdateTag = (id, newTag) => {
    const updated = updateHistoryEntry(id, { tag: newTag });
    setHistory(updated);
    toast.success(`Moved to ${newTag}`);
  };

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.payload?.toLowerCase().includes(search.toLowerCase()) ||
      item.type?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesTag = tagFilter === 'All' || (item.tag || 'General') === tagFilter;
    return matchesSearch && matchesType && matchesTag;
  });

  const uniqueTypes = Array.from(new Set(history.map((h) => h.type)));

  return (
    <>
      <SEO
        title="Saved QR Codes & History — QRHub"
        description="View and manage previously generated, downloaded, and shared QR codes stored privately on your device."
        canonical="/history"
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-6 md:py-12 pb-24 lg:pb-14">
        <div className="container-wide space-y-7">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Your Saved QR Codes
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                QR codes you create, download, or share are saved locally on your device.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="rounded-xl text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Clear all saved history"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  <span>Clear All</span>
                </Button>
              )}
              <Link to="/generator">
                <Button className="rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm flex items-center gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span>Create New QR</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Tag & Folder Bar */}
          {history.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
                  <Folder className="h-3.5 w-3.5" />
                  Folders:
                </span>
                {DEFAULT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      tagFilter === tag
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Search & Filter Strip */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search history by payload, title, type..."
                    className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar min-w-0">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      typeFilter === 'all'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    All Types
                  </button>
                  {uniqueTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all shrink-0 ${
                        typeFilter === type
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
              {filtered.map((item, idx) => (
                <ScrollReveal key={item.id} delay={idx * 0.04}>
                  <Card3D className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-full space-y-4">
                    {/* Top Row: Type & Date */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                            {item.type}
                          </span>
                          <select
                            value={item.tag || 'General'}
                            onChange={(e) => handleUpdateTag(item.id, e.target.value)}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none"
                            title="Assign to folder"
                          >
                            {DEFAULT_TAGS.filter(t => t !== 'All').map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* QR Thumbnail Preview */}
                      <div className="flex justify-center items-center py-4 my-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div
                          className="p-2 rounded-xl shadow-xs"
                          style={{ backgroundColor: item.bgColor || '#ffffff' }}
                        >
                          <QRCodeCanvas
                            value={item.payload}
                            size={120}
                            fgColor={item.fgColor || '#172033'}
                            bgColor={item.bgColor || '#ffffff'}
                            level={item.ecc || 'M'}
                            includeMargin={false}
                          />
                        </div>
                      </div>

                      {/* Title & Payload */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <p className="font-mono text-xs text-slate-500 break-all line-clamp-2">
                          {item.payload}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/generator?type=${item.type}`)}
                        className="h-8 text-xs font-semibold rounded-lg flex-1 border-slate-200 dark:border-slate-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        <span>Open Studio</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(item.payload)}
                        className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-blue-600"
                        title="Copy payload"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Delete from history"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card3D>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* EMPTY HISTORY STATE */
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 md:p-16 text-center max-w-xl mx-auto shadow-sm space-y-5">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
                <QrCode className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No saved QR codes yet
                </h3>
                <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  When you create, download, or share QR codes in the Studio, they will be saved here on your device.
                </p>
              </div>
              <div className="flex items-center justify-center pt-2">
                <Link to="/generator">
                  <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-7 py-3 rounded-xl shadow-md flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Your First QR Code</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
