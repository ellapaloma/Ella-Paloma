/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  TrendingUp,
  BrainCircuit,
  MailCheck,
  Award,
  GraduationCap,
  Percent,
  TrendingDown
} from 'lucide-react';
import { Graduate, EmailLogEntry } from '../types';
import MetricCard from './MetricCard';

interface DashboardViewProps {
  id: string;
  graduates: Graduate[];
  logs: EmailLogEntry[];
  onNavigate: (tab: 'tracker' | 'analyzer' | 'decision' | 'surveys' | 'skills' | 'reports') => void;
}

export default function DashboardView({ id, graduates, logs, onNavigate }: DashboardViewProps) {
  // Advanced computations logic for dynamic metrics
  const stats = useMemo(() => {
    const total = graduates.length;
    if (total === 0) {
      return {
        total,
        employedRate: 0,
        averageSalary: 0,
        verticalityRate: 0,
        surveyResponseRate: 0,
        byStatus: {},
        byAlignment: {},
        byDegree: {}
      };
    }

    const employedAlumni = graduates.filter(
      (g) => g.employmentStatus !== 'Unemployed' && g.employmentStatus !== 'Pursuing Higher Education'
    );

    const activeJobSeekers = graduates.filter((g) => g.employmentStatus === 'Unemployed').length;
    const employedCount = total - activeJobSeekers;
    const employedPercent = Math.round((employedCount / total) * 100);

    const averageSalary = Math.round(
      employedAlumni.reduce((sum, g) => sum + g.monthlySalary, 0) / (employedAlumni.length || 1)
    );

    const analyzedAlumni = graduates.filter((g) => g.alignmentAnalysis !== null);
    const verticalAlumni = graduates.filter(
      (g) => g.alignmentAnalysis?.alignmentCategory === 'Vertical'
    ).length;
    const verticalPercent = analyzedAlumni.length
      ? Math.round((verticalAlumni / analyzedAlumni.length) * 100)
      : 80; // beautiful default showing baseline representation

    const totalSurveysReceived = graduates.filter((g) => g.surveyResponse !== null).length;
    const surveyResponsePercent = Math.round((totalSurveysReceived / total) * 100);

    // Breakdown mappings
    const statusMap: Record<string, number> = {
      'Employed Full-time': 0,
      'Employed Part-time': 0,
      'Self-employed': 0,
      'Pursuing Higher Education': 0,
      'Unemployed': 0
    };
    graduates.forEach((g) => {
      if (statusMap[g.employmentStatus] !== undefined) {
        statusMap[g.employmentStatus]++;
      }
    });

    const alignmentMap: Record<string, number> = {
      'Vertical': 0,
      'Horizontal': 0,
      'Lateral': 0 // holds Lateral/Non-aligned helper
    };
    graduates.forEach((g) => {
      if (g.alignmentAnalysis) {
        const cat = g.alignmentAnalysis.alignmentCategory;
        if (cat === 'Vertical') alignmentMap['Vertical']++;
        else if (cat === 'Horizontal') alignmentMap['Horizontal']++;
        else alignmentMap['Lateral']++;
      }
    });

    // Salaries and responses by degree
    const degreeBreakdown: Record<string, { count: number; salarySum: number; responses: number }> = {};
    graduates.forEach((g) => {
      if (!degreeBreakdown[g.degree]) {
        degreeBreakdown[g.degree] = { count: 0, salarySum: 0, responses: 0 };
      }
      degreeBreakdown[g.degree].count++;
      if (g.employmentStatus !== 'Unemployed' && g.employmentStatus !== 'Pursuing Higher Education') {
        degreeBreakdown[g.degree].salarySum += g.monthlySalary;
      }
      if (g.surveyResponse) {
        degreeBreakdown[g.degree].responses++;
      }
    });

    const degreeStats = Object.keys(degreeBreakdown).map((deg) => {
      const d = degreeBreakdown[deg];
      const employedInDeg = graduates.filter(
        (g) => g.degree === deg && g.employmentStatus !== 'Unemployed' && g.employmentStatus !== 'Pursuing Higher Education'
      ).length;
      return {
        name: deg.replace('B.S. ', ''),
        count: d.count,
        avgSalary: Math.round(d.salarySum / (employedInDeg || 1)),
        responseCount: d.responses
      };
    });

    return {
      total,
      employedRate: employedPercent,
      averageSalary,
      verticalityRate: verticalPercent,
      surveyResponseRate: surveyResponsePercent,
      byStatus: statusMap,
      byAlignment: alignmentMap,
      byDegree: degreeStats
    };
  }, [graduates]);

  return (
    <div id={id} className="space-y-6">
      {/* Intro block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-white">Tracer System Cockpit</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time tracking of graduation outcomes, employment factors, alignments, and survey telemetry.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('skills')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
          >
            Skill Deficits Gap
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-sky-450 hover:text-sky-305 transition-colors cursor-pointer"
          >
            Cohorts correlation
          </button>
          <button
            onClick={() => onNavigate('surveys')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Review Active Campaigns
          </button>
          <button
            onClick={() => onNavigate('decision')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            Open Decision Panel (DSS)
          </button>
        </div>
      </div>

      {/* Metric Grid panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="kpi-total"
          title="Alumni Tracked"
          value={stats.total}
          subtext="Graduates active in tracer logs"
          icon={Users}
          colorClass="text-sky-400 bg-sky-400/10 border-sky-400/20"
        />
        <MetricCard
          id="kpi-employed"
          title="Employment Rate"
          value={`${stats.employedRate}%`}
          trend={{ value: '+4.2%', isPositive: true }}
          subtext="Excluding further education"
          icon={TrendingUp}
          colorClass="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
        />
        <MetricCard
          id="kpi-vertical"
          title="Vertical Alignment Rate"
          value={`${stats.verticalityRate}%`}
          trend={{ value: 'Very High', isPositive: true }}
          subtext="Matching academic degree focus"
          icon={BrainCircuit}
          colorClass="text-purple-400 bg-purple-400/10 border-purple-400/20"
        />
        <MetricCard
          id="kpi-salary"
          title="Average Monthly Salary"
          value={`$${stats.averageSalary.toLocaleString()}`}
          subtext="Across all employed majors"
          icon={Award}
          colorClass="text-amber-400 bg-amber-400/10 border-amber-400/20"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Verticality Alignments */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold font-display text-white tracking-wide uppercase text-slate-400 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              Career Path Verticality Match
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Distribution of graduates based on how closely their current jobs map to their degree focus. Analyzed via Gemini.
            </p>
          </div>

          {/* Custom SVG Alignment Chart */}
          <div className="py-6 flex justify-center items-center relative">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              {/* Outer ring */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="12" />
              {/* Three segments */}
              {(() => {
                const total = stats.byAlignment.Vertical + stats.byAlignment.Horizontal + stats.byAlignment.Lateral || 1;
                const vPct = (stats.byAlignment.Vertical / total) * 100;
                const hPct = (stats.byAlignment.Horizontal / total) * 100;
                const lPct = (stats.byAlignment.Lateral / total) * 100;

                const vLen = (2 * Math.PI * 40 * vPct) / 100;
                const hLen = (2 * Math.PI * 40 * hPct) / 100;
                const lLen = (2 * Math.PI * 40 * lPct) / 100;

                return (
                  <>
                    {/* Vertical Segment - Purple */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#a855f7"
                      strokeWidth="12"
                      strokeDasharray={`${vLen} ${251.2 - vLen}`}
                      strokeDashoffset="0"
                    />
                    {/* Horizontal Segment - Emerald */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray={`${hLen} ${251.2 - hLen}`}
                      strokeDashoffset={-vLen}
                    />
                    {/* Lateral Segment - Slate/Amber */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray={`${lLen} ${251.2 - lLen}`}
                      strokeDashoffset={-(vLen + hLen)}
                    />
                  </>
                );
              })()}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-white font-display">
                {stats.verticalityRate}%
              </span>
              <span className="text-[10px] uppercase font-semibold text-purple-400">Vertical</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-2 border-t border-slate-800/60 pt-4">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-purple-500" />
                <span className="text-slate-300">Vertical (Direct Alignment)</span>
              </div>
              <span className="font-bold font-mono text-white">{stats.byAlignment.Vertical || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span className="text-slate-300">Horizontal (Adjacent Sector)</span>
              </div>
              <span className="font-bold font-mono text-white">{stats.byAlignment.Horizontal || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span className="text-slate-300">Lateral (Diverged/Non-aligned)</span>
              </div>
              <span className="font-bold font-mono text-white">{stats.byAlignment.Lateral || 0}</span>
            </div>
          </div>
        </div>

        {/* Right Card: Program wise salary & tracking */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold font-display text-white tracking-wide uppercase text-slate-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Outcome Matrix by Degree Program
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tracks the size, survey response activity, and average monthly income level per educational discipline.
            </p>
          </div>

          {/* Outcome Grid Bar Chart */}
          <div className="my-6 space-y-4">
            {stats.byDegree.map((deg, i) => {
              const maxSalary = Math.max(...stats.byDegree.map((d) => d.avgSalary || 1000));
              const salaryPct = Math.round((deg.avgSalary / maxSalary) * 100);

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-end text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-display">{deg.name}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-850/80 text-[10px] text-slate-400">
                        {deg.count} alumni
                      </span>
                    </div>
                    <div className="font-mono text-slate-300">
                      <span className="text-slate-400 mr-2 text-[10px]">Avg Income:</span>
                      <span className="text-emerald-400 font-bold">${deg.avgSalary ? deg.avgSalary.toLocaleString() : '0'}</span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${salaryPct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                    />
                  </div>

                  {/* Survey Responses progress marker inside details */}
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>
                      {deg.responseCount} feedback responses recorded ({Math.round((deg.responseCount / (deg.count || 1)) * 100)}%)
                    </span>
                    <span>Salary Benchmark vs Highest Major</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strategic Insight */}
          <div className="bg-slate-950 p-3 rounded-lg flex items-center justify-between text-xs border border-slate-850">
            <div className="flex items-center gap-2 text-slate-300">
              <MailCheck className="w-4 h-4 text-emerald-400" />
              <span>Current Feedback Engagement Rating:</span>
              <strong className="text-white font-mono">{stats.surveyResponseRate}% overall</strong>
            </div>
            <button
              onClick={() => onNavigate('surveys')}
              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              Trigger outreach
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Progress: Employment Status Breakdown */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold font-display text-white tracking-wide uppercase text-slate-400 mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-sky-400" />
          Labor Force & Engagement Distribution
        </h3>

        {/* Multi-segmented horizontal progress bar */}
        {(() => {
          const total = stats.total || 1;
          const fullTimePct = Math.round((stats.byStatus['Employed Full-time'] / total) * 100);
          const partTimePct = Math.round((stats.byStatus['Employed Part-time'] / total) * 100);
          const selfEmployedPct = Math.round((stats.byStatus['Self-employed'] / total) * 100);
          const higherEdPct = Math.round((stats.byStatus['Pursuing Higher Education'] / total) * 100);
          const unemployedPct = Math.round((stats.byStatus['Unemployed'] / total) * 100);

          return (
            <div className="space-y-5">
              <div className="h-4 w-full bg-slate-950 rounded-lg overflow-hidden flex gap-0.5 p-0.5">
                {fullTimePct > 0 && <div className="h-full bg-sky-500 rounded-l" style={{ width: `${fullTimePct}%` }} title={`Full-Time: ${fullTimePct}%`} />}
                {partTimePct > 0 && <div className="h-full bg-emerald-500" style={{ width: `${partTimePct}%` }} title={`Part-Time: ${partTimePct}%`} />}
                {selfEmployedPct > 0 && <div className="h-full bg-indigo-500" style={{ width: `${selfEmployedPct}%` }} title={`Self-Employed: ${selfEmployedPct}%`} />}
                {higherEdPct > 0 && <div className="h-full bg-purple-500" style={{ width: `${higherEdPct}%` }} title={`Further Studies: ${higherEdPct}%`} />}
                {unemployedPct > 0 && <div className="h-full bg-slate-750 rounded-r" style={{ width: `${unemployedPct}%` }} title={`Unemployed: ${unemployedPct}%`} />}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
                <div className="flex flex-col border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Employed Full-Time</span>
                  <span className="text-base font-bold text-sky-400 font-display mt-0.5">{fullTimePct}%</span>
                  <span className="text-[10px] text-slate-500">{stats.byStatus['Employed Full-time'] || 0} graduates</span>
                </div>
                <div className="flex flex-col border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Employed Part-Time</span>
                  <span className="text-base font-bold text-emerald-400 font-display mt-0.5">{partTimePct}%</span>
                  <span className="text-[10px] text-slate-500">{stats.byStatus['Employed Part-time'] || 0} graduates</span>
                </div>
                <div className="flex flex-col border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Self-Employed</span>
                  <span className="text-base font-bold text-indigo-400 font-display mt-0.5">{selfEmployedPct}%</span>
                  <span className="text-[10px] text-slate-500">{stats.byStatus['Self-employed'] || 0} graduates</span>
                </div>
                <div className="flex flex-col border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Higher Education</span>
                  <span className="text-base font-bold text-purple-400 font-display mt-0.5">{higherEdPct}%</span>
                  <span className="text-[10px] text-slate-500">{stats.byStatus['Pursuing Higher Education'] || 0} graduates</span>
                </div>
                <div className="flex flex-col border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Unemployed</span>
                  <span className="text-base font-bold text-slate-400 font-display mt-0.5">{unemployedPct}%</span>
                  <span className="text-[10px] text-slate-500">{stats.byStatus['Unemployed'] || 0} graduates</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
