import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CaseStudy from '../models/CaseStudy.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mine-safety-app';

const baseCases = [
  {
    title: 'Conveyor entanglement near loading bay',
    sourceType: 'INTERNAL',
    date: new Date('2024-01-12'),
    location: 'Surface conveyor, North loading bay',
    mineSection: 'Conveyor line – loading bay',
    severity: 'major',
    tags: ['conveyor', 'entanglement', 'lockout'],
    hazardTags: ['conveyor', 'unguarded'],
    relevanceRoles: ['worker', 'supervisor'],
    quickSummary: 'Worker’s shawl caught in unguarded conveyor during cleaning. Always isolate power before cleaning.',
    supervisorSummary: 'Cleaning attempted while belt running and guards removed.',
    rootCauses: [
      { type: 'technical', description: 'Return roller guard removed for maintenance.' },
      { type: 'human', description: 'Lockout-tagout skipped before cleaning.' },
    ],
    preventiveChecklist: [
      { text: 'Confirm conveyor isolation before cleaning.', role: 'worker' },
      { text: 'Inspect guards and pull-cords each shift.', role: 'supervisor' },
    ],
    quiz: [
      {
        question: 'What must you do before cleaning a conveyor?',
        options: ['Speed up belt', 'Lockout and test zero energy', 'Ask coworker to hold belt', 'Only press e-stop'],
        correctOption: 1,
        explanation: 'Lockout-tagout and zero energy verification are mandatory.',
      },
    ],
    status: 'published',
  },
  {
    title: 'Roof fall in development heading',
    sourceType: 'DGMS',
    date: new Date('2023-11-05'),
    location: 'UG development panel, East section',
    mineSection: 'Development heading',
    severity: 'fatal',
    tags: ['roof-fall', 'support'],
    hazardTags: ['roof-fall', 'support-delay'],
    relevanceRoles: ['worker', 'supervisor', 'dgms_officer'],
    quickSummary: 'Loader operator hit by roof fall because supports lagged after blasting.',
    supervisorSummary: 'Support installation lagged beyond plan and sounding skipped.',
    rootCauses: [
      { type: 'technical', description: 'Unsupported span in weak shale.' },
      { type: 'organizational', description: 'Support plan allowed excessive bolting lag.' },
    ],
    preventiveChecklist: [
      { text: 'Record sounding readings before re-entry.', role: 'supervisor' },
      { text: 'Never work under unsupported roof.', role: 'worker' },
    ],
    quiz: [
      {
        question: 'When can crews enter after blasting?',
        options: ['When fumes clear', 'After supervisor says OK', 'Only after sounding and support per plan', 'Anytime if cautious'],
        correctOption: 2,
        explanation: 'Sounding plus support must be completed before re-entry.',
      },
    ],
    status: 'published',
  },
];

const caseTemplates = [
  {
    title: 'Continuous miner roof fall exposure',
    sourceType: 'DGMS',
    location: 'Panel 3, Seam XV',
    mineSection: 'Development heading',
    severity: 'major',
    tags: ['roof-fall', 'support'],
    hazardTags: ['roof-fall', 'support-lag'],
    relevanceRoles: ['worker', 'supervisor'],
    quickSummary: 'Roof collapsed because bolting lagged two cuts behind.',
    supervisorSummary: 'Miner advanced without supplementary supports; sounding logs missing.',
  },
  {
    title: 'Conveyor drive fire near bunker',
    sourceType: 'INTERNAL',
    location: 'Surface conveyor line A',
    mineSection: 'Drive head',
    severity: 'major',
    tags: ['fire', 'conveyor'],
    hazardTags: ['fire', 'electrical'],
    relevanceRoles: ['worker', 'supervisor', 'admin'],
    quickSummary: 'Hot bearing ignited spillage when firefighting system was isolated.',
    supervisorSummary: 'Lubrication skipped and alarm acknowledged remotely without inspection.',
  },
  {
    title: 'Haul road berm failure',
    sourceType: 'INTERNAL',
    location: 'OB dump haul road, Sector C',
    mineSection: 'Dump edge',
    severity: 'major',
    tags: ['haulage', 'berm'],
    hazardTags: ['haulage', 'berm'],
    relevanceRoles: ['worker', 'supervisor'],
    quickSummary: 'Truck toppled because berm height was below half tyre height.',
    supervisorSummary: 'Dozer removed berm to widen road and spotter absent.',
  },
  {
    title: 'Methane ignition in development face',
    sourceType: 'DGMS',
    location: 'Panel 7, gassy seam',
    mineSection: 'Development face',
    severity: 'fatal',
    tags: ['gas', 'ignition'],
    hazardTags: ['gas', 'ignition'],
    relevanceRoles: ['worker', 'supervisor', 'dgms_officer'],
    quickSummary: 'Methane accumulated when auxiliary fan stopped and ignited during bolting.',
    supervisorSummary: 'Fan stopped for cable change without permit; no gas test before restart.',
  },
  {
    title: 'Drill jumbo entanglement incident',
    sourceType: 'INTERNAL',
    location: 'Decline drive',
    mineSection: 'Face area',
    severity: 'minor',
    tags: ['drilling', 'entanglement'],
    hazardTags: ['equipment'],
    relevanceRoles: ['worker', 'supervisor'],
    quickSummary: 'Helper’s glove caught in rotating drill steel while clearing cuttings.',
    supervisorSummary: 'Interlock bypassed after jam; helper used hands instead of tools.',
  },
  {
    title: 'Hoist overspeed near skip loading',
    sourceType: 'INTERNAL',
    location: 'Main shaft',
    mineSection: 'Hoisting',
    severity: 'major',
    tags: ['hoist', 'overspeed'],
    hazardTags: ['hoist', 'control-system'],
    relevanceRoles: ['worker', 'supervisor', 'dgms_officer'],
    quickSummary: 'Hoist oversped past landing due to faulty encoder.',
    supervisorSummary: 'Encoder warning ignored and overspeed device overdue for overhaul.',
  },
];

const buildGeneratedCases = () => Array.from({ length: 30 }, (_, idx) => {
  const template = caseTemplates[idx % caseTemplates.length];
  return {
    ...template,
    title: `${template.title} Case ${idx + 1}`,
    date: new Date(2024, (idx * 2) % 12, ((idx * 3) % 28) + 1),
    rootCauses: [
      { type: 'human', description: 'Procedure not followed precisely.' },
      { type: 'technical', description: 'Underlying conditions required additional controls.' },
    ],
    preventiveChecklist: [
      { text: 'Review hazard briefing before shift.', role: 'worker' },
      { text: 'Verify controls are in place before task starts.', role: 'supervisor' },
    ],
    quiz: [
      {
        question: `Key control highlighted in ${template.title}?`,
        options: ['Ignore alarms', 'Follow SOP precisely', 'Skip PPE', 'Work faster'],
        correctOption: 1,
        explanation: 'Following the documented control mitigates the hazard.',
      },
    ],
    status: 'published',
  };
});

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const samples = [...baseCases, ...buildGeneratedCases()];
    const existing = new Set((await CaseStudy.find({}, 'title')).map((doc) => doc.title));
    const newCases = samples.filter((sample) => !existing.has(sample.title));

    if (!newCases.length) {
      console.log('No new case studies to insert.');
    } else {
      await CaseStudy.insertMany(newCases);
      console.log(`Inserted ${newCases.length} case studies.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();


