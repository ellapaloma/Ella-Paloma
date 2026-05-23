/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Send,
  X
} from 'lucide-react';
import { SurveyNotificationState, EmailLogEntry } from '../types';

interface SurveySchedulerProps {
  id: string;
  config: SurveyNotificationState;
  logs: EmailLogEntry[];
  onSaveConfig: (config: Partial<SurveyNotificationState>) => Promise<void>;
  onTriggerInstantBatch: (uncompletedIds: string[]) => Promise<void>;
  uncompletedAlumniCount: number;
  allUncompletedIds: string[];
}

export default function SurveyScheduler({
  id,
  config,
  logs,
  onSaveConfig,
  onTriggerInstantBatch,
  uncompletedAlumniCount,
  allUncompletedIds
}: SurveySchedulerProps) {
  const [subject, setSubject] = useState('');
  const [template, setTemplate] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Quarterly' | 'Bi-Annually' | 'Annually'>('Quarterly');
  const [isActive, setIsActive] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [activePreviewLog, setActivePreviewLog] = useState<EmailLogEntry | null>(null);
  const [outreachLoading, setOutreachLoading] = useState(false);

  useEffect(() => {
    if (config) {
      setSubject(config.emailSubject || '');
      setTemplate(config.emailTemplate || '');
      setFrequency(config.sendingFrequency || 'Quarterly');
      setIsActive(config.isActive !== undefined ? config.isActive : true);
    }
  }, [config]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSaveConfig({
        emailSubject: subject,
        emailTemplate: template,
        sendingFrequency: frequency,
        isActive
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchSurveysInstantly = async () => {
    if (allUncompletedIds.length === 0) return;
    setOutreachLoading(true);
    try {
      await onTriggerInstantBatch(allUncompletedIds);
    } catch (err) {
      console.error(err);
    } finally {
      setOutreachLoading(false);
    }
  };

  return (
    <div id={id} className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight font-display text-white">Automated Survey Notification Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Formulate trigger rules, manipulate mail merges, and view outbound telemetry from our outreach scheduler.
          </p>
        </div>
        {uncompletedAlumniCount > 0 ? (
          <button
            onClick={handleDispatchSurveysInstantly}
            disabled={outreachLoading}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {outreachLoading ? 'Dispatching...' : `Dispatch surveys now to ${uncompletedAlumniCount} uncompleted alumni`}
          </button>
        ) : (
          <div className="p-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-semibold text-xs rounded-lg flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Every alumnus has responded! Zero outstanding dispatches.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template formulation settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <h2 className="text-sm font-bold font-display text-white tracking-wide uppercase text-slate-400 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              Outbound Email Template Layout
            </h2>

            <form onSubmit={handleUpdateSettings} className="space-y-4">
              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Default Subject Line</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Feedback Tracking Campaign..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Body Area */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-300">Email Body Template</label>
                  <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                    Interpolations: &#123;AlumniName&#125;, &#123;GradDegree&#125;, &#123;GradYear&#125;, &#123;AlumniID&#125;
                  </span>
                </div>
                <textarea
                  required
                  rows={10}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-sans leading-relaxed"
                />
              </div>

              {/* Controls triggers and frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/60">
                {/* Frequency selector */}
                <div className="flex flex-col gap-1.5Col">
                  <label className="text-[11px] font-semibold text-slate-400">Trigger Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="Monthly">Monthly Trigger</option>
                    <option value="Quarterly">Quarterly Outreach</option>
                    <option value="Bi-Annually">Bi-Annual Campaign</option>
                    <option value="Annually">Annual Sweep</option>
                  </select>
                </div>

                {/* Status Toggle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">Status Trigger State</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsActive(true)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsActive(false)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        !isActive
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Paused
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Update Settings'}
                  </button>
                </div>
              </div>
            </form>

            <AnimatePresence>
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center rounded-lg font-medium"
                >
                  Notification templates and daemon schedule updated successfully.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Active schedule specs and outbox log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Campaign Status details */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">
              Active Outreach State
            </h3>

            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-start gap-3.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-[0.02]">
                <Clock className="w-20 h-20" />
              </div>

              {/* Glow Dot */}
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shrink-0">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>

              <div className="space-y-1.5 flex-1 select-none">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-200 font-display">
                    AUTOMATED CRON TRIGGER
                  </span>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 font-mono bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulsing-dot" />
                      RUNNING
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 font-mono bg-amber-400/10 px-1.5 py-0.5 rounded-full">
                      SUSPENDED
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Triggers tracer sweeps of missing alumni periodically.
                </p>

                <div className="pt-2 border-t border-slate-900 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>Next scheduled run:</span>
                  <strong className="text-slate-300 font-mono font-medium">
                    {new Date(config?.nextAutoTrigger || Date.now()).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })} (10:00 AM)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Outbox simulation log */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Outbox Historical Logs
            </h3>

            <div className="space-y-2.5 overflow-y-auto max-h-[290px] pr-1">
              {logs.length === 0 ? (
                <span className="text-slate-500 font-medium italic text-xs text-center block py-10">No dispatches triggered yet.</span>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-200 truncate">{log.graduateName}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{log.graduateEmail}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 font-medium text-slate-500">
                        {new Date(log.sentAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} • {new Date(log.sentAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[9px] font-bold font-mono tracking-wide uppercase px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-400/10 border border-emerald-500/10">
                        {log.status}
                      </span>
                      <button
                        onClick={() => setActivePreviewLog(log)}
                        title="Display full fully-interpolated email message"
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Raw message viewer popup popup */}
      <AnimatePresence>
        {activePreviewLog && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-xl w-full p-5 flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Interpolated Delivery Preview</span>
                  <h3 className="text-sm font-bold font-display text-white mt-0.5">Outbox ID: {activePreviewLog.id}</h3>
                </div>
                <button
                  onClick={() => setActivePreviewLog(null)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Header details */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold inline-block w-16">To:</span>
                  <strong className="text-slate-300 font-medium">
                    {activePreviewLog.graduateName} ({activePreviewLog.graduateEmail})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold inline-block w-16">Subject:</span>
                  <strong className="text-white font-medium">{activePreviewLog.subject}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold inline-block w-16">Trigger:</span>
                  <strong className="text-slate-400 font-mono font-medium text-[11px]">
                    {new Date(activePreviewLog.sentAt).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Message fully-rendered */}
              <div className="flex-1 max-h-[300px] overflow-y-auto bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                {activePreviewLog.body}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActivePreviewLog(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-750 text-slate-300 hover:text-white hover:bg-slate-750 transition-colors cursor-pointer"
                >
                  Close Outbox Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
