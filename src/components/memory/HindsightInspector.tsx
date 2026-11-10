'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  ShieldCheck,
  Trash2,
  Edit2,
  RefreshCw,
  Plus,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { hindsightEngine, MemoryEntry, ReflectionInsight } from '@/services/hindsightMemory';
import { soundEngine } from '@/lib/audio';

export const HindsightInspector: React.FC = () => {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [reflections, setReflections] = useState<ReflectionInsight[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryEntry['category']>('preference');
  const [showAddForm, setShowAddForm] = useState(false);

  const refreshData = () => {
    setMemories(hindsightEngine.inspectAll());
    setReflections(hindsightEngine.reflect());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSaveEdit = (id: string) => {
    soundEngine.playClick();
    hindsightEngine.correct(id, editValue);
    setEditingId(null);
    refreshData();
  };

  const handleDelete = (id: string) => {
    soundEngine.playClick();
    hindsightEngine.forget(id);
    refreshData();
  };

  const handleWipeAll = () => {
    if (confirm('Are you sure you want to permanently erase all stored Hindsight memory?')) {
      soundEngine.playClick();
      hindsightEngine.wipeAll();
      refreshData();
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    soundEngine.playClick();
    hindsightEngine.retain({
      category: newCategory,
      key: newKey.trim(),
      value: newValue.trim(),
      confidence: 0.9,
      consentGranted: true,
    });

    setNewKey('');
    setNewValue('');
    setShowAddForm(false);
    refreshData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-black border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Brain className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Hindsight Long-Term Memory & Reflection Engine
              </h2>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              KAAMSETU uses Hindsight to remember your verified skills, constraints, past job application outcomes, and user feedback. You retain 100% control to inspect, modify, or permanently delete any stored fact.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                soundEngine.playClick();
                refreshData();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Memories</span>
            </button>
            <button
              onClick={handleWipeAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-300 hover:text-red-200 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe All Memory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Measurable Improvement Demonstration: Before vs After Memory Reflection */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-[#FF6B00]/30 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-[#FFE066] text-sm font-bold">
          <Sparkles className="w-4 h-4 text-[#FF6B00]" />
          <span>Measurable AI Recommendation Adaptation (Before vs After Memory)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Baseline without memory */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">
              INITIAL (Without Past Context)
            </span>
            <p className="font-semibold text-zinc-200 text-sm">Repeated Corporate Job Queries</p>
            <p className="text-zinc-400 leading-relaxed">
              Standard systems keep searching repetitive high-experience corporate electrical job vacancies in Aligarh, causing applicant frustration when unresponded due to lack of PSU accreditation.
            </p>
          </div>

          {/* Memory informed recommendation */}
          <div className="p-4 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/40 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF6B00]/20 text-[#FF8F3D]">
              HINDSIGHT REFLECTED (With Memory)
            </span>
            <p className="font-semibold text-white text-sm">Intelligent Credential & Enterprise Pivot</p>
            <p className="text-zinc-300 leading-relaxed">
              Recognizes the pattern of unresponded corporate applications. Automatically redirects candidate to the UPPTCL NAPS Apprenticeship Cell (Aligarh Zone) and PM Surya Ghar Solar PV credentialing, paving a fast-track to certified PSU employment.
            </p>
          </div>
        </div>
      </div>

      {/* Active Reflections List */}
      {reflections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Active Hindsight Reflections ({reflections.length})</span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {reflections.map((r, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-indigo-300 text-sm">{r.topic}</div>
                  <p className="text-zinc-400">{r.observation}</p>
                  <p className="text-zinc-200 font-medium flex items-center gap-1.5 mt-1">
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF8F3D] shrink-0" />
                    <span>Adjustment: {r.actionableAdjustment}</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold shrink-0">
                  Reflected from {r.derivedFromIds.length} facts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory Table / Inspector */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Retained Context Items ({memories.length})</span>
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Every item stored here was collected with your consent and directly influences JARVIS responses.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 border border-[#FF6B00]/40 text-[#FF8F3D] text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory Fact</span>
          </button>
        </div>

        {/* Add Fact Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddCustom}
            className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3 text-xs"
          >
            <div className="font-semibold text-white">Record New User Preference / Constraint</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-zinc-300 focus:outline-none"
              >
                <option value="skill">Skill</option>
                <option value="preference">Preference</option>
                <option value="outcome">Past Outcome</option>
                <option value="feedback">User Feedback</option>
                <option value="business_idea">Business Idea</option>
              </select>

              <input
                type="text"
                placeholder="Key (e.g. target_role)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Value (e.g. Carpenter / Modular Furniture)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#FF6B00] text-black font-bold hover:bg-[#FF8F3D]"
              >
                Save Fact
              </button>
            </div>
          </form>
        )}

        {/* Memory Items List */}
        <div className="space-y-2.5">
          {memories.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-white/15 transition-all"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300">
                    {m.category}
                  </span>
                  <span className="font-semibold text-[#FFE066]">{m.key}</span>
                  <span className="text-[10px] text-zinc-500">
                    Confidence: {Math.round(m.confidence * 100)}%
                  </span>
                </div>

                {editingId === m.id ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-[#FF6B00] text-white text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(m.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-zinc-200 text-xs font-normal leading-relaxed">{m.value}</p>
                )}
              </div>

              {editingId !== m.id && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(m.id);
                      setEditValue(m.value);
                    }}
                    title="Correct this fact"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    title="Permanently forget this fact"
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
