import React, { useState } from 'react';
import { X, Save, RotateCcw, Plus, Trash2, CheckCircle, Code } from 'lucide-react';
import { CVData } from '../types';
import { DEFAULT_CV_DATA } from '../data/cvData';
import { playSound } from '../utils/audio';

interface CVEditorModalProps {
  isOpen: boolean;
  cvData: CVData;
  onSave: (newData: CVData) => void;
  onClose: () => void;
}

export const CVEditorModal: React.FC<CVEditorModalProps> = ({
  isOpen,
  cvData,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<CVData>(cvData);
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'skills' | 'projects' | 'json'>('profile');
  const [jsonText, setJsonText] = useState(JSON.stringify(cvData, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProfileChange = (field: keyof CVData['profile'], value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (activeTab === 'json') {
      try {
        const parsed = JSON.parse(jsonText);
        onSave(parsed);
        playSound('success');
        onClose();
        return;
      } catch (err) {
        setJsonError('Invalid JSON syntax: ' + (err as Error).message);
        return;
      }
    }
    playSound('success');
    onSave(formData);
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to default CV data?')) {
      setFormData(DEFAULT_CV_DATA);
      setJsonText(JSON.stringify(DEFAULT_CV_DATA, null, 2));
      playSound('click');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="flex flex-col w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              ✏️ Edit & Update Your CV Information
            </h2>
            <p className="text-xs text-slate-400">
              Enter your CV details or paste JSON to update instantly
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 overflow-x-auto shrink-0">
          {[
            { id: 'profile', label: '1. Profile Info' },
            { id: 'experience', label: '2. Work Experience' },
            { id: 'skills', label: '3. Skills & Tech' },
            { id: 'projects', label: '4. Projects' },
            { id: 'json', label: '5. Raw JSON' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'json') {
                  setJsonText(JSON.stringify(formData, null, 2));
                }
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={formData.profile.fullName}
                  onChange={(e) => handleProfileChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="e.g. Nguyen Van Nhan"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Professional Title *</label>
                <input
                  type="text"
                  value={formData.profile.title}
                  onChange={(e) => handleProfileChange('title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="e.g. Senior Full Stack Developer"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-300">Tagline / Short Intro</label>
                <input
                  type="text"
                  value={formData.profile.tagline}
                  onChange={(e) => handleProfileChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="e.g. Passionate about building high-performance web applications"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Email *</label>
                <input
                  type="email"
                  value={formData.profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="nhantruong1298@gmail.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Phone</label>
                <input
                  type="text"
                  value={formData.profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="(+84) 987 654 321"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Location</label>
                <input
                  type="text"
                  value={formData.profile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="Ho Chi Minh City, Vietnam (Remote/Hybrid)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Years of Experience</label>
                <input
                  type="number"
                  value={formData.profile.yearsOfExp}
                  onChange={(e) => handleProfileChange('yearsOfExp', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">GitHub URL</label>
                <input
                  type="text"
                  value={formData.profile.github}
                  onChange={(e) => handleProfileChange('github', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">LinkedIn URL</label>
                <input
                  type="text"
                  value={formData.profile.linkedin}
                  onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-300">Biography & Summary (Bio)</label>
                <textarea
                  rows={4}
                  value={formData.profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-750 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="Describe your core strengths, experiences, and goals..."
                />
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Companies and roles:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      experiences: [
                        {
                          id: 'exp-' + Date.now(),
                          role: 'Software Engineer',
                          company: 'New Company',
                          location: 'Ho Chi Minh City',
                          type: 'Full-time',
                          startDate: '01/2024',
                          endDate: 'Present',
                          description: 'Role overview and contributions...',
                          responsibilities: ['Developed key features', 'Optimized performance'],
                          achievements: ['Delivered project on schedule'],
                          technologies: ['React', 'Node.js', 'TypeScript'],
                        },
                        ...prev.experiences,
                      ],
                    }));
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Position</span>
                </button>
              </div>

              {formData.experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400">Position #{idx + 1}</span>
                    <button
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          experiences: prev.experiences.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const newExp = [...formData.experiences];
                        newExp[idx].role = e.target.value;
                        setFormData((prev) => ({ ...prev, experiences: newExp }));
                      }}
                      placeholder="Role Title"
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...formData.experiences];
                        newExp[idx].company = e.target.value;
                        setFormData((prev) => ({ ...prev, experiences: newExp }));
                      }}
                      placeholder="Company Name"
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExp = [...formData.experiences];
                        newExp[idx].startDate = e.target.value;
                        setFormData((prev) => ({ ...prev, experiences: newExp }));
                      }}
                      placeholder="From (MM/YYYY)"
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExp = [...formData.experiences];
                        newExp[idx].endDate = e.target.value;
                        setFormData((prev) => ({ ...prev, experiences: newExp }));
                      }}
                      placeholder="To (MM/YYYY or Present)"
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        const newExp = [...formData.experiences];
                        newExp[idx].location = e.target.value;
                        setFormData((prev) => ({ ...prev, experiences: newExp }));
                      }}
                      placeholder="Location"
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...formData.experiences];
                      newExp[idx].description = e.target.value;
                      setFormData((prev) => ({ ...prev, experiences: newExp }));
                    }}
                    placeholder="Summary of contributions..."
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Your technical skill categories:
              </p>
              {formData.skillCategories.map((cat, cIdx) => (
                <div key={cIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-sky-400">{cat.category}</h4>
                  <div className="space-y-2">
                    {cat.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newCats = [...formData.skillCategories];
                            newCats[cIdx].items[iIdx].name = e.target.value;
                            setFormData((prev) => ({ ...prev, skillCategories: newCats }));
                          }}
                          className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                          placeholder="Skill Name (e.g. React, Node.js)"
                        />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={item.level}
                          onChange={(e) => {
                            const newCats = [...formData.skillCategories];
                            newCats[cIdx].items[iIdx].level = Number(e.target.value);
                            setFormData((prev) => ({ ...prev, skillCategories: newCats }));
                          }}
                          className="w-20 px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                          placeholder="%"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Featured projects:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      projects: [
                        {
                          id: 'proj-' + Date.now(),
                          title: 'New Project Title',
                          role: 'Full Stack Developer',
                          category: 'Full Stack',
                          period: '2025',
                          description: 'Summary of project...',
                          highlights: ['Key feature 1', 'Optimized architecture'],
                          technologies: ['React', 'TypeScript', 'Node.js'],
                          featured: true,
                        },
                        ...prev.projects,
                      ],
                    }));
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </button>
              </div>

              {formData.projects.map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400">Project #{pIdx + 1}</span>
                    <button
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          projects: prev.projects.filter((_, i) => i !== pIdx),
                        }));
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const newProjs = [...formData.projects];
                        newProjs[pIdx].title = e.target.value;
                        setFormData((prev) => ({ ...prev, projects: newProjs }));
                      }}
                      placeholder="Project Name"
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={proj.role}
                      onChange={(e) => {
                        const newProjs = [...formData.projects];
                        newProjs[pIdx].role = e.target.value;
                        setFormData((prev) => ({ ...prev, projects: newProjs }));
                      }}
                      placeholder="Your Role"
                      className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => {
                      const newProjs = [...formData.projects];
                      newProjs[pIdx].description = e.target.value;
                      setFormData((prev) => ({ ...prev, projects: newProjs }));
                    }}
                    placeholder="Project description..."
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          )}

          {/* JSON DIRECT EDIT TAB */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Paste your raw CV JSON data here:</span>
                <span className="font-mono text-emerald-400">JSON Schema</span>
              </div>
              {jsonError && (
                <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300">
                  {jsonError}
                </div>
              )}
              <textarea
                rows={16}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError(null);
                }}
                className="w-full p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-750 focus:border-sky-500 focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-lg shadow-sky-900/40 cursor-pointer active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update CV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
