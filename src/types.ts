export type RoomObjectId =
  | 'computer'
  | 'arcade'
  | 'whiteboard'
  | 'bookshelf'
  | 'beanbag'
  | 'social_frames'
  | 'window'
  | 'plant';

export interface CameraViewpoint {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface RoomObjectInfo {
  id: RoomObjectId;
  name: string;
  vietnameseName: string;
  shortDesc: string;
  category: string;
  badge: string;
  camera: CameraViewpoint;
  details: {
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    actions?: {
      label: string;
      icon?: string;
      onClickId?: string;
    }[];
  };
}

export interface SkillItem {
  name: string;
  level: number;
  years?: string;
  tags?: string[];
}

export interface SkillCategory {
  category: string;
  icon: string;
  items: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  category: 'Full Stack' | 'Frontend' | 'Backend' | 'Mobile' | 'AI / Game';
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface EducationItem {
  degree: string;
  major: string;
  school: string;
  year: string;
  gpa?: string;
  honors?: string;
  description?: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
}

export interface CVData {
  profile: {
    fullName: string;
    title: string;
    tagline: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    portfolio: string;
    bio: string;
    status: string;
    yearsOfExp: number;
  };
  skillCategories: SkillCategory[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  languages: { language: string; level: string; percent: number }[];
  interests: string[];
}

export type DesktopAppId =
  | 'about'
  | 'experience'
  | 'contact'
  | 'resume'
  | 'credits'
  | 'projects';
