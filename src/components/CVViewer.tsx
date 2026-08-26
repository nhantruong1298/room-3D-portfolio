import React, { useState } from 'react';
import {
  FileText,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Download,
  Printer,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Heart,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CVData } from '../types';
import { playSound } from '../utils/audio';

interface CVViewerProps {
  cvData: CVData;
  onOpenEditor: () => void;
}

export const CVViewer: React.FC<CVViewerProps> = ({ cvData, onOpenEditor }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'skills' | 'projects' | 'education'>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(cvData.profile.email);
    setCopiedEmail(true);
    playSound('click');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  const handleDownloadJSON = () => {
    playSound('success');
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cvData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${cvData.profile.fullName.replace(/\s+/g, '_')}_CV.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="cv-viewer-container" className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden select-text">
      {/* Top CV Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Hồ Sơ Năng Lực IT / Curriculum Vitae
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Live Interactive
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Cập nhật mới nhất • Sẵn sàng thay đổi thông tin theo hồ sơ của bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-edit-cv-data"
            onClick={() => {
              playSound('open');
              onOpenEditor();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-900/30 transition-all cursor-pointer active:scale-95"
            title="Nhập và sửa thông tin CV của bạn"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Nhập / Sửa CV Thật Của Bạn</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            title="Tải tệp JSON dữ liệu CV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tải JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            title="In hoặc Xuất định dạng PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In / PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-1 px-6 py-2 bg-slate-900/90 border-b border-slate-800/80 overflow-x-auto shrink-0">
        {[
          { id: 'all', label: 'Toàn bộ CV (Full View)', icon: Layers },
          { id: 'experience', label: 'Kinh Nghiệm Làm Việc', icon: Briefcase },
          { id: 'skills', label: 'Kỹ Năng Công Nghệ', icon: Code },
          { id: 'projects', label: 'Dự Án Tiêu Biểu', icon: Sparkles },
          { id: 'education', label: 'Học Vấn & Bằng Cấp', icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main CV Scrollable Document Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 print:p-0 print:bg-white print:text-black">
        {/* CV Header Profile Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-750 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {cvData.profile.status}
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {cvData.profile.fullName}
                </h1>
                <p className="text-base md:text-lg font-semibold text-sky-400 mt-0.5">
                  {cvData.profile.title}
                </p>
                <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {cvData.profile.tagline}
                </p>
              </div>

              {/* Contact Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
                  title="Nhấp để sao chép email"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{cvData.profile.email}</span>
                  {copiedEmail ? (
                    <Check className="w-3 h-3 text-emerald-400 ml-1" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-500 ml-1 opacity-60" />
                  )}
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{cvData.profile.phone}</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{cvData.profile.location}</span>
                </div>

                {cvData.profile.github && (
                  <a
                    href={cvData.profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-purple-400" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {cvData.profile.linkedin && (
                  <a
                    href={cvData.profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Experience Badge Card */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800 shrink-0 text-center min-w-[130px]">
              <span className="text-3xl font-black text-sky-400">{cvData.profile.yearsOfExp}+</span>
              <span className="text-xs font-semibold text-slate-300 mt-0.5">Năm Kinh Nghiệm</span>
              <span className="text-[11px] text-slate-400 mt-1">Full Stack & IT</span>
            </div>
          </div>

          {/* Bio / Executive Summary */}
          {cvData.profile.bio && (
            <div className="mt-5 pt-5 border-t border-slate-800 text-xs md:text-sm text-slate-300 leading-relaxed">
              <strong className="text-sky-300 font-semibold">Tóm tắt mục tiêu & định hướng: </strong>
              {cvData.profile.bio}
            </div>
          )}
        </div>

        {/* SECTION: WORK EXPERIENCE */}
        {(activeTab === 'all' || activeTab === 'experience') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Briefcase className="w-4 h-4" />
                </div>
                Kinh Nghiệm Làm Việc Chuyên Môn
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {cvData.experiences.length} Vị trí
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {cvData.experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-sky-500 group-hover:scale-125 group-hover:bg-sky-400 transition-all" />

                  <div className="p-5 rounded-xl bg-slate-800/70 border border-slate-750 hover:border-slate-700 transition-all space-y-3 shadow-md">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                          {exp.role}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mt-0.5">
                          <span>{exp.company}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 font-normal">{exp.location}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 text-[10px]">
                            {exp.type}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-mono text-slate-300">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Responsibilities */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs font-semibold text-slate-400">Trách nhiệm & Nhiệm vụ chính:</span>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                        <span className="font-semibold text-amber-300">Thành tích nổi bật: </span>
                        {exp.achievements.join(' • ')}
                      </div>
                    )}

                    {/* Tech tags */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {exp.technologies.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] font-mono border border-slate-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: SKILLS & TECH STACK */}
        {(activeTab === 'all' || activeTab === 'skills') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Code className="w-4 h-4" />
                </div>
                Kỹ Năng Chuyên Môn & Công Nghệ (Tech Stack)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.skillCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-800/70 border border-slate-750 space-y-3.5 shadow-md"
                >
                  <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2 border-b border-slate-700/60 pb-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    {cat.category}
                  </h4>

                  <div className="space-y-3">
                    {cat.items.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            {skill.years && (
                              <span className="text-[11px] text-slate-400">{skill.years}</span>
                            )}
                            <span className="font-mono text-sky-400 font-bold">{skill.level}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>

                        {skill.tags && skill.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {skill.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/90 text-slate-400 border border-slate-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: FEATURED PROJECTS */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                Dự Án Tiêu Biểu & Sản Phẩm Đã Làm
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {cvData.projects.length} Dự án
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.projects.map((proj, pIdx) => (
                <div
                  key={proj.id || pIdx}
                  className="p-5 rounded-xl bg-slate-800/70 border border-slate-750 hover:border-slate-700 transition-all space-y-3 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          {proj.title}
                          {proj.featured && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                              Featured
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-sky-400 font-medium">{proj.role} • {proj.period}</p>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[11px] font-mono border border-slate-800">
                        {proj.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Highlights */}
                    {proj.highlights && (
                      <ul className="space-y-1 text-xs text-slate-300 pt-1">
                        {proj.highlights.map((hl, hlIdx) => (
                          <li key={hlIdx} className="flex items-start gap-1.5">
                            <span className="text-sky-400 font-bold">•</span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] font-mono border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Mã nguồn</span>
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Trải nghiệm Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: EDUCATION & CERTS */}
        {(activeTab === 'all' || activeTab === 'education') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <GraduationCap className="w-4 h-4" />
                </div>
                Học Vấn & Đào Tạo
              </h3>

              <div className="space-y-3">
                {cvData.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-800/70 border border-slate-750 space-y-2 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                        <p className="text-xs text-sky-400 font-medium">{edu.school}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{edu.year}</span>
                    </div>

                    {edu.gpa && (
                      <p className="text-xs text-emerald-300 font-semibold">{edu.gpa}</p>
                    )}
                    {edu.honors && (
                      <p className="text-xs text-amber-300">{edu.honors}</p>
                    )}
                    {edu.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Award className="w-4 h-4" />
                </div>
                Chứng Chỉ Chuyên Ngành
              </h3>

              <div className="space-y-3">
                {cvData.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/70 border border-slate-750 flex items-start justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                      <p className="text-xs text-slate-400">{cert.issuer} • {cert.issueDate}</p>
                      {cert.credentialId && (
                        <p className="text-[11px] font-mono text-slate-500">ID: {cert.credentialId}</p>
                      )}
                    </div>

                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: LANGUAGES & INTERESTS */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Languages */}
            <div className="p-5 rounded-xl bg-slate-800/70 border border-slate-750 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                Ngoại Ngữ
              </h4>
              <div className="space-y-3">
                {cvData.languages.map((lang, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-200">{lang.language}</span>
                      <span className="text-slate-400">{lang.level}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-sky-400 rounded-full"
                        style={{ width: `${lang.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="p-5 rounded-xl bg-slate-800/70 border border-slate-750 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Sở Thích Cá Nhân & Động Lực
              </h4>
              <div className="flex flex-wrap gap-2">
                {cvData.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs border border-slate-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
