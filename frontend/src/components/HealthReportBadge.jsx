import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, ShieldCheck } from 'lucide-react';

export default function HealthReportBadge({ report }) {
  if (!report) return null;

  const isGreen = report.status === 'GREEN';
  const isYellow = report.status === 'YELLOW';
  const isRed = report.status === 'RED';

  const badgeConfig = {
    GREEN: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
      pill: 'bg-emerald-600 text-white',
      icon: CheckCircle2,
      label: 'Nutritionally Beneficial',
    },
    YELLOW: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
      pill: 'bg-amber-500 text-white',
      icon: AlertTriangle,
      label: 'Nutrient Caution Note',
    },
    RED: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300',
      pill: 'bg-rose-600 text-white',
      icon: AlertOctagon,
      label: 'Nutritional Attention Flag',
    },
  }[report.status] || {
    bg: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200',
    pill: 'bg-slate-600 text-white',
    icon: Info,
    label: 'Health Analysis',
  };

  const IconComponent = badgeConfig.icon;

  return (
    <div className={`rounded-2xl border p-5 ${badgeConfig.bg} shadow-sm space-y-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconComponent className="w-6 h-6 shrink-0" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Scientific Assessment</span>
            <h4 className="text-base font-bold">{report.nutrient_highlight}</h4>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeConfig.pill} shadow-sm`}>
          {report.status} STATUS
        </span>
      </div>

      <p className="text-sm leading-relaxed opacity-90">{report.explanation}</p>

      {/* Benefits */}
      {report.benefits && report.benefits.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Positive Nutritional Contributions
          </span>
          <ul className="text-xs space-y-1 list-disc list-inside opacity-90 pl-1">
            {report.benefits.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns if any */}
      {report.concerns && report.concerns.length > 0 && report.status !== 'GREEN' && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Areas for Dietary Moderation
          </span>
          <ul className="text-xs space-y-1 list-disc list-inside opacity-90 pl-1">
            {report.concerns.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Allergens */}
      {report.allergens && report.allergens.length > 0 && (
        <div className="pt-2 border-t border-current/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold opacity-75">Identified Allergens:</span>
          {report.allergens.map((alg, idx) => (
            <span key={idx} className="text-xs px-2.5 py-0.5 rounded-md bg-white/60 dark:bg-slate-900/60 font-medium border border-current/20">
              {alg}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

