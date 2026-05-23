/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  BrainCircuit,
  GraduationCap,
  MailCheck,
  Award,
  Clock,
  Sparkles,
  Database,
  Layers,
  HelpCircle,
  AlertCircle,
  KeyRound,
  LineChart,
  X
} from 'lucide-react';

import { Graduate, SurveyNotificationState, EmailLogEntry } from './types';
import {
  fetchAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  resetDatabase,
  analyzeAlignment,
  generateCurriculumReport,
  fetchSurveyConfig,
  saveSurveyConfig,
  fetchSurveyLogs,
  sendSurveyBatch,
  simulateAlumniResponse
} from './lib/api';

// Components
import DashboardView from './components/DashboardView';
import GraduateTracker from './components/GraduateTracker';
import VerticalityAnalyzer from './components/VerticalityAnalyzer';
import DecisionReview from './components/DecisionReview';
import SurveyScheduler from './components/SurveyScheduler';
import GraduateProfileModal from './components/GraduateProfileModal';
import SkillsAnalysisView from './components/SkillsAnalysisView';
import AdvancedReportsView from './components/AdvancedReportsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracker' | 'skills' | 'reports' | 'analyzer' | 'decision' | 'surveys'>('dashboard');

  // Core global data states
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [surveyConfig, setSurveyConfig] = useState<SurveyNotificationState | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);
  const [programs, setPrograms] = useState<string[]>(['Bachelor of Science in Information Technology (BSIT)']);
  const [appLoading, setAppLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Profile modal state
  const [selectedGrad, setSelectedGrad] = useState<Graduate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API Key state detection
  const [apiKeyDetected, setApiKeyDetected] = useState(true);

  // UTC clock state
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());

  // Load initial global data
  const loadWorkspaceData = async (quiet = false) => {
    if (!quiet) setAppLoading(true);
    setGlobalError(null);
    try {
      const [alumniData, configData, logsData, programsData] = await Promise.all([
        fetchAlumni(),
        fetchSurveyConfig(),
        fetchSurveyLogs(),
        fetch('/api/programs').then(r => r.json()).catch(() => ['Bachelor of Science in Information Technology (BSIT)'])
      ]);
      setGraduates(alumniData);
      setSurveyConfig(configData);
      setEmailLogs(logsData);
      if (Array.isArray(programsData)) {
        setPrograms(programsData);
      }
    } catch (err: any) {
      console.error(err);
      setGlobalError('Unable to connect to the CRM Node server. Verify server is running on port 3000.');
    } finally {
      if (!quiet) setAppLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();

    // Setup periodic polling clock
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);

    return () => clearInterval(clockTimer);
  }, []);

  // API wrappers
  const handleAddProgram = async (name: string) => {
    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add program');
      }
      const data = await res.json();
      setPrograms((prev) => [...prev, data.name]);
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'Failed to add program.');
    }
  };

  const handleDeleteProgram = async (name: string) => {
    try {
      const res = await fetch('/api/programs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete program');
      }
      setPrograms((prev) => prev.filter((p) => p !== name));
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'Failed to delete program.');
    }
  };

  const handleCreateOrUpdateGraduate = async (payload: Omit<Graduate, 'id'>) => {
    try {
      if (selectedGrad) {
        const updated = await updateAlumni(selectedGrad.id, payload);
        setGraduates((prev) => prev.map((g) => (g.id === selectedGrad.id ? updated : g)));
      } else {
        const added = await createAlumni(payload);
        setGraduates((prev) => [added, ...prev]);
      }
      setIsModalOpen(false);
      setSelectedGrad(null);
    } catch (err: any) {
      console.error(err);
      setGlobalError('Failed to save graduate profile. Ensure server is active.');
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this graduate profile registry?')) {
      return;
    }
    try {
      await deleteAlumni(id);
      setGraduates((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
      setGlobalError('Failed to delete registry profile.');
    }
  };

  const handleTriggerSurvey = async (id: string) => {
    try {
      const response = await sendSurveyBatch([id]);
      setEmailLogs((prev) => [...response.logs, ...prev]);
      // Update local graduated list mapping outstanding states
      setGraduates((prev) =>
        prev.map((g) => {
          if (g.id === id && g.surveyResponse === null) {
            // we simulate marking as outreach sent
            return g;
          }
          return g;
        })
      );
    } catch (err) {
      console.error(err);
      setGlobalError('Failed to dispatch survey template.');
    }
  };

  const handleTriggerBulkSurveys = async (ids: string[]) => {
    try {
      const response = await sendSurveyBatch(ids);
      setEmailLogs((prev) => [...response.logs, ...prev]);
    } catch (err) {
      console.error(err);
      setGlobalError('Failed to dispatch bulk survey campaign.');
    }
  };

  const handleTriggerAnalyze = async (id: string) => {
    try {
      const updated = await analyzeAlignment(id);
      setGraduates((prev) => prev.map((g) => (g.id === id ? updated : g)));
    } catch (err: any) {
      console.error(err);
      throw err; // bubble up for localized component error tracking
    }
  };

  const handleGenerateReport = async () => {
    try {
      return await generateCurriculumReport();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const handleSaveSurveyConfig = async (newConfig: Partial<SurveyNotificationState>) => {
    try {
      const updated = await saveSurveyConfig(newConfig);
      setSurveyConfig(updated);
    } catch (err) {
      console.error(err);
      setGlobalError('Failed to save survey config.');
    }
  };

  const handleSimulateSurveyAnswer = async (
    usefulSkills: string,
    obsoleteSkills: string,
    curriculumGaps: string,
    relevanceRating: number
  ) => {
    if (!selectedGrad) return;
    try {
      const updated = await simulateAlumniResponse({
        id: selectedGrad.id,
        usefulSkills,
        obsoleteSkills,
        curriculumGaps,
        relevanceRating
      });
      setGraduates((prev) => prev.map((g) => (g.id === selectedGrad.id ? updated : g)));
    } catch (err) {
      console.error(err);
      setGlobalError('Failed to submit simulated feedback.');
    }
  };

  const handleWipeAndReset = async () => {
    if (
      !window.confirm(
        'Warning: This instantly resets the database to default preloaded alumni profiles, survey configurations, and outbox logs. Proceed?'
      )
    ) {
      return;
    }
    try {
      setAppLoading(true);
      await resetDatabase();
      await loadWorkspaceData(true);
    } catch (err) {
      console.error(err);
    } finally {
      setAppLoading(false);
    }
  };

  // Helper stats for campaign outreach alerts. Fits automated survey email notification constraints
  const outstandingAlumni = graduates.filter((g) => g.surveyResponse === null);
  const outreachRecipientIds = outstandingAlumni.map((g) => g.id);

  if (appLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300 gap-5 select-none font-sans">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
          <Database className="w-8 h-8 text-emerald-400 animate-bounce" />
        </div>
        <div className="text-center">
          <h2 className="text-sm font-bold font-display text-white">Initializing Alumni Tracer CRM workspace...</h2>
          <p className="text-[11px] text-slate-400 mt-1">Contacting internal Node.js cluster services.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none selection:bg-emerald-500/20 antialiased">
      {/* Upper Navigation Rail */}
      <header className="border-b border-slate-900 bg-slate-950 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-7xl mx-auto w-full">
          {/* Project Title branding */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BrainCircuit className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight font-display text-white">
                  RSU San Fernando Campus
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                  Alumni Tracer
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">Romblon State University Academic Quality CRM</p>
            </div>
          </div>

          {/* UTC Clock & Reset trigger */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-900 pt-3 sm:pt-0">
            {/* System Clock */}
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <div className="text-[11px] text-slate-500 font-mono flex flex-col items-start leading-none select-none">
                <span className="font-semibold text-slate-400">System Clock</span>
                <span className="mt-0.5">{new Date(currentTime).toLocaleTimeString([], { hour12: false }) || '13:15:02'} UTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab selector bar */}
        <div className="bg-slate-950/60 backdrop-blur border-t border-slate-900/60">
          <div className="px-4 sm:px-6 flex gap-2 sm:gap-6 overflow-x-auto max-w-7xl mx-auto w-full shrink-0">
            {[
              { id: 'dashboard', label: 'Tracers Cockpit', icon: Layers },
              { id: 'tracker', label: 'Alumni Registries', icon: Users },
              { id: 'skills', label: 'Skills Gap Analysis', icon: Sparkles },
              { id: 'reports', label: 'Analytical Reports', icon: LineChart },
              { id: 'analyzer', label: 'Verticality Analyzer', icon: Award },
              { id: 'decision', label: 'DSS Quality proposals', icon: GraduationCap },
              { id: 'surveys', label: 'Automated Outreach', icon: MailCheck }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setGlobalError(null);
                  }}
                  className={`py-3.5 text-xs font-semibold uppercase tracking-wide flex items-center gap-2 cursor-pointer border-b-2 transition-all relative shrink-0 ${
                    isActive
                      ? 'border-emerald-500 text-emerald-400 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 overflow-hidden">
        {globalError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 rounded-xl flex gap-3 mb-6 items-start shadow-inner">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold font-display">System Connection Advisory</p>
              <p className="mt-1 leading-relaxed text-slate-300">{globalError}</p>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dynamic sub views loading */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                id="view-dashboard"
                graduates={graduates}
                logs={emailLogs}
                onNavigate={(t) => {
                  setActiveTab(t);
                  setGlobalError(null);
                }}
              />
            )}

            {activeTab === 'tracker' && (
              <GraduateTracker
                id="view-tracker"
                graduates={graduates}
                programs={programs}
                onAddProgram={handleAddProgram}
                onDeleteProgram={handleDeleteProgram}
                onAddOrEdit={(grad) => {
                  setSelectedGrad(grad || null);
                  setIsModalOpen(true);
                }}
                onDeleteProfile={handleDeleteProfile}
                onTriggerSurvey={handleTriggerSurvey}
                onTriggerBulkSurveys={handleTriggerBulkSurveys}
                onTriggerAnalyze={handleTriggerAnalyze}
                onResetDatabase={handleWipeAndReset}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsAnalysisView
                id="view-skills"
                graduates={graduates}
              />
            )}

            {activeTab === 'reports' && (
              <AdvancedReportsView
                id="view-reports"
                graduates={graduates}
              />
            )}

            {activeTab === 'analyzer' && (
              <VerticalityAnalyzer
                id="view-analyzer"
                graduates={graduates}
                onTriggerAnalyze={handleTriggerAnalyze}
                apiKeyProvided={apiKeyDetected}
              />
            )}

            {activeTab === 'decision' && (
              <DecisionReview
                id="view-decision"
                graduates={graduates}
                onGenerateReport={handleGenerateReport}
              />
            )}

            {activeTab === 'surveys' && surveyConfig && (
              <SurveyScheduler
                id="view-surveys"
                config={surveyConfig}
                logs={emailLogs}
                onSaveConfig={handleSaveSurveyConfig}
                onTriggerInstantBatch={handleTriggerBulkSurveys}
                uncompletedAlumniCount={outstandingAlumni.length}
                allUncompletedIds={outreachRecipientIds}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Graduate Creation & Editing Popup Drawer */}
      <GraduateProfileModal
        id="modal-profile"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGrad(null);
        }}
        onSubmit={handleCreateOrUpdateGraduate}
        graduate={selectedGrad}
        programs={programs}
        onSimulateSurvey={
          selectedGrad
            ? (u, o, c, r) => handleSimulateSurveyAnswer(u, o, c, r)
            : undefined
        }
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 select-none text-center text-[10px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-medium font-sans">
            Romblon State University-San Fernando Campus • Alumni Outcomes CRM & Quality Assurance Decision Support Engine
          </p>
          <div className="flex gap-4 font-display">
            <span className="hover:text-slate-400 transition-colors">Documentation</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">Privacy Regulations</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">Security Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
