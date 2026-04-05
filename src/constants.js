import { User, Globe, Shield, GraduationCap, Plane } from 'lucide-react';

export const DOC_CATEGORIES = [
  { id: 'pp_photo', name: 'PP Size Photo', icon: User, desc: 'Professional headshot' },
  { id: 'passport', name: 'Passport', icon: Globe, desc: 'Bio page & valid stamps' },
  { id: 'citizenship', name: 'Citizenship', icon: Shield, desc: 'Front & Back combined' },
  { id: 'academic', name: 'Academic Transcripts', icon: GraduationCap, desc: 'SLC, +2, Bachelors' },
  { id: 'english_test', name: 'IELTS / PTE', icon: Plane, desc: 'Original Scorecard' },
];

export const PROCESS_STEPS = [
  'Onboarding', 
  'Missing Documents', 
  'Docs Complete - Awaiting IELTS', 
  'University Application', 
  'Offer Letter Received', 
  'Visa Processing', 
  'Visa Approved'
];