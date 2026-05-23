/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  subtext: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  colorClass?: string;
}

export default function MetricCard({
  id,
  title,
  value,
  subtext,
  trend,
  icon: Icon,
  colorClass = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
}: MetricCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="p-5 border rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden bg-slate-900 border-slate-800"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-1 translate-y-1">
        <Icon className="w-24 h-24" />
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-medium tracking-wide uppercase text-slate-400 font-display">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col gap-1 z-10">
        <h3 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
          {value}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          {trend && (
            <span
              className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                trend.isPositive
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : 'text-amber-400 bg-amber-400/10'
              }`}
            >
              {trend.value}
            </span>
          )}
          <span className="text-xs text-slate-400 font-sans tracking-tight">
            {subtext}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
