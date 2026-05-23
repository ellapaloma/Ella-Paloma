/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Graduate } from '../types';
import {
  Calendar,
  Globe,
  TrendingUp,
  SlidersHorizontal,
  BookmarkCheck,
  TrendingDown,
  LineChart,
  FileText
} from 'lucide-react';

interface AdvancedReportsViewProps {
  id: string;
  graduates: Graduate[];
}

export default function AdvancedReportsView({ id, graduates }: AdvancedReportsViewProps) {
  // Customizable date/graduation-year range
  const [fromYear, setFromYear] = useState<number>(2015);
  const [toYear, setToYear] = useState<number>(2026);

  // Filtered dataset based on customizable bracket
  const scopedGraduates = useMemo(() => {
    return graduates.filter(g => g.gradYear >= fromYear && g.gradYear <= toYear);
  }, [graduates, fromYear, toYear]);

  // Extract unique years available in dataset for slider range selectors
  const uniqueClassYears = useMemo(() => {
    const years = Array.from(new Set(graduates.map(g => g.gradYear))).sort((a, b) => a - b);
    return years.length ? years : [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  }, [graduates]);

  // Report 1: Employment Rates by Major
  const employmentByMajor = useMemo(() => {
    const majorsData: Record<string, { total: number; employed: number }> = {};
    
    scopedGraduates.forEach(g => {
      const maj = g.degree.replace('B.S. ', '');
      if (!majorsData[maj]) {
        majorsData[maj] = { total: 0, employed: 0 };
      }
      majorsData[maj].total++;
      if (g.employmentStatus !== 'Unemployed' && g.employmentStatus !== 'Pursuing Higher Education') {
        majorsData[maj].employed++;
      }
    });

    return Object.keys(majorsData).map(maj => {
      const d = majorsData[maj];
      const rate = d.total ? Math.round((d.employed / d.total) * 100) : 0;
      return {
        major: maj,
        totalGrads: d.total,
        employedCount: d.employed,
        rate
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [scopedGraduates]);

  // Report 2: Average Salary Progression Over Time
  const salaryProgression = useMemo(() => {
    const yearSalaryData: Record<number, { sum: number; count: number }> = {};

    scopedGraduates.forEach(g => {
      if (g.employmentStatus !== 'Unemployed' && g.employmentStatus !== 'Pursuing Higher Education') {
        const yr = g.gradYear;
        if (!yearSalaryData[yr]) {
          yearSalaryData[yr] = { sum: 0, count: 0 };
        }
        yearSalaryData[yr].sum += g.monthlySalary;
        yearSalaryData[yr].count++;
      }
    });

    return Object.keys(yearSalaryData)
      .map(yrStr => {
        const yr = Number(yrStr);
        const data = yearSalaryData[yr];
        const average = data.count ? Math.round(data.sum / data.count) : 0;
        return {
          year: yr,
          averageSalary: average,
          sampleCount: data.count
        };
      })
      .sort((a, b) => a.year - b.year);
  }, [scopedGraduates]);

  // Report 3: Geographic Distribution of Alumni
  const geographicDistribution = useMemo(() => {
    const locationData: Record<string, { count: number; salarySum: number; salaryCount: number }> = {};

    scopedGradsExcludingDefaults(scopedGraduates).forEach(g => {
      const loc = g.location || 'Unknown Location';
      if (!locationData[loc]) {
        locationData[loc] = { count: 0, salarySum: 0, salaryCount: 0 };
      }
      locationData[loc].count++;
      if (g.employmentStatus !== 'Unemployed' && g.employmentStatus !== 'Pursuing Higher Education') {
        locationData[loc].salarySum += g.monthlySalary;
        locationData[loc].salaryCount++;
      }
    });

    return Object.keys(locationData)
      .map(loc => {
        const d = locationData[loc];
        return {
          location: loc,
          totalAlumni: d.count,
          averageSalary: d.salaryCount ? Math.round(d.salarySum / d.salaryCount) : 0
        };
      })
      .sort((a, b) => b.totalAlumni - a.totalAlumni);

    function scopedGradsExcludingDefaults(arr: Graduate[]) {
      return arr;
    }
  }, [scopedGraduates]);



  return (
    <div id={id} className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight font-display text-white">Advanced Reports Panel</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Query cohort matrices, calculate salary correlations, and generate custom academic summaries.
          </p>
        </div>

        {/* Date / Graduation Year Selectors */}
        <div className="flex items-center gap-2 bg-slate-900 p-2 border border-slate-800 rounded-xl max-w-full">
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mr-1">Class Scope:</span>
          
          <select
            value={fromYear}
            onChange={(e) => setFromYear(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
          >
            {uniqueClassYears.map(yr => (
              <option key={yr} value={yr}>Class {yr}</option>
            ))}
          </select>
          
          <span className="text-xs text-slate-600">—</span>

          <select
            value={toYear}
            onChange={(e) => setToYear(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
          >
            {uniqueClassYears.filter(yr => yr >= fromYear).map(yr => (
              <option key={yr} value={yr}>Class {yr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of advanced outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report 1 Card: Employment Rates by Major */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookCheckIcon className="w-4 h-4 text-sky-400" />
              Employment Rates by Major Program
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Active employment rates computed against alumni inside the Class of {fromYear} - {toYear} cohort bracket.
            </p>
          </div>

          <div className="space-y-3.5">
            {employmentByMajor.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No alumni records found in selected school range.</p>
            ) : (
              employmentByMajor.map((m, index) => (
                <div key={index} className="space-y-1.5 ">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300 font-display">{m.major}</span>
                    <span className="font-mono text-slate-400">
                      {m.employedCount} / {m.totalGrads} Employed • <strong className="text-sky-400 font-semibold">{m.rate}%</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded transition-all duration-500"
                      style={{ width: `${m.rate}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Report 2 Card: Salary Progression Over Time */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <LineChart className="w-4 h-4 text-emerald-400" />
              Average Salary Progression Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Displays growth or stability trends of average starting salaries by year of graduation.
            </p>
          </div>

          <div className="relative py-2">
            {salaryProgression.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-10 text-center">Insufficient salary data points found.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-550 font-bold uppercase tracking-wide border-b border-slate-800 pb-2">
                  <span>Graduation Class</span>
                  <span className="col-span-2">Average Monthly Compensation</span>
                  <span className="text-right">Cohort Sample</span>
                </div>
                {salaryProgression.map((s, index) => {
                  const maxSalary = Math.max(...salaryProgression.map(item => item.averageSalary || 1000));
                  const percentWidth = maxSalary ? Math.round((s.averageSalary / maxSalary) * 100) : 0;
                  
                  return (
                    <div key={index} className="grid grid-cols-4 gap-2 items-center text-xs">
                      <span className="font-bold text-slate-300 font-display">Class of {s.year}</span>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="flex-1 bg-slate-950 h-2.5 rounded overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded"
                            style={{ width: `${percentWidth}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-emerald-400 shrink-0">${s.averageSalary.toLocaleString()}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-right">{s.sampleCount} employed</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Report 3 Card: Geographic Distribution */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Geographic Dispersion Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Geographic locations where graduates reside, mapped with starting income averages.
            </p>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {geographicDistribution.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No location tracking logged for current range.</p>
            ) : (
              geographicDistribution.map((g, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 bg-indigo-500/10 p-1 rounded-md text-[10px] font-bold font-mono">
                      #{index + 1}
                    </span>
                    <strong className="text-slate-300 font-sans">{g.location}</strong>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-slate-400">
                    <span>{g.totalAlumni} alumni</span>
                    <span className="text-emerald-400 font-bold border-l border-slate-800 pl-3">Avg: ${g.averageSalary ? g.averageSalary.toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


      </div>
    </div>
  );
}

// Light inline Helper Icons
function BookCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 11 3 3L22 4" />
      <path d="M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}
