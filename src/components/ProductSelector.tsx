import { useState, useMemo } from 'react';
import data from '../data/products.json';

type Product = {
  id: string;
  name: string;
  tagline: string;
  env: string;
  assembly: string;
  use: string;
  highlight: string;
  software: string[];
  cta: string;
  brand_color: string;
};

type Answers = {
  env: string;
  setup: string;
  use: string;
};

const products: Product[] = (data as { products: Product[] }).products;

/** Architectural edge copy per product and use case—aligns result with the journey they self-selected (Tenstorrent portfolio). */
const HIGHLIGHTS_BY_JOURNEY: Record<string, { research: string; efficiency: string; fleet: string }> = {
  'bh-quietbox': {
    research: '1MB of SRAM per tile for complex physics code and custom VM development. 720 MB total SRAM and 480 Tensix Cores in a quiet, liquid-cooled desktop—built for experimentation and heavy SRAM workloads.',
    efficiency: 'Liquid-cooled desktop with 4 Blackhole processors and 128 GB GDDR6. Strong performance per dollar for inference and development without the noise of a server.',
    fleet: 'Single system runs single-user models up to ~80B parameters or multi-user, multi-model up to ~20B. One box, ready to plug in and run.',
  },
  'bh-p150a': {
    research: '120 Tensix Cores and 32 GB GDDR6 per card, with full access to the metal via TT-Metalium and TT-NN. Link cards with QSFP-DD to scale your research cluster.',
    efficiency: 'Native block float format support to drive down operational costs vs cloud H100s. Build a cost-efficient inference cluster with cards that pay for themselves.',
    fleet: 'QSFP-DD 800G linking lets you pool memory and scale across cards. Build your own multi-card cluster with standard PCIe and open software.',
  },
  'wh-loudbox': {
    research: 'Modular 4U design with Wormhole processors—flexible density for research and multi-user workloads. TT-Forge and TT-NN support diverse model portfolios.',
    efficiency: '4U rack density with strong performance per watt. Multi-tenant capable so you can share one system across cost-sensitive inference workloads.',
    fleet: 'Modular 4U design for multi-user model serving across a diverse model portfolio. Fleet-ready with TT-Forge and TT-NN.',
  },
  galaxy: {
    research: '32 Wormhole processors and 2,560 Tensix Cores in one rack-mounted system. Built for research institutions and HPC—subdivide across hosts or run as one. 384 GB GDDR6, globally addressable.',
    efficiency: 'Ultra-dense rack system with 9.3 PetaFLOPS (FP8). Superior performance density for cost—scale without reprogramming models or re-architecting infrastructure.',
    fleet: 'Pre-configured rack system with 32 Wormhole processors and 41.6 Tbps internal Ethernet. Scale from one host to many; multi-tenant and multi-model ready with TT-Forge and TT-NN.',
  },
};

const RECOMMENDATION_MAP: Record<string, string> = {
  'desk|box|research': 'bh-quietbox',
  'desk|box|efficiency': 'bh-quietbox',
  'desk|box|fleet': 'bh-quietbox',
  'desk|build|research': 'bh-p150a',
  'desk|build|efficiency': 'bh-p150a',
  'desk|build|fleet': 'bh-p150a',
  'rack|box|research': 'galaxy',
  'rack|box|efficiency': 'wh-loudbox',
  'rack|box|fleet': 'galaxy',
  'rack|build|research': 'bh-p150a',
  'rack|build|efficiency': 'bh-p150a',
  'rack|build|fleet': 'bh-p150a',
};

const STEPS = [
  { id: 'intro', title: 'Find the right product', question: 'A few quick questions will help us point you to the hardware and software that fit your environment and goals.', cta: 'Start' },
  {
    id: 'env',
    title: 'Where will you run this?',
    question: 'Deployment environment affects cooling, power, and form factor.',
    options: [
      { value: 'desk', label: 'Desk / office', description: 'Single workstation, quiet operation matters' },
      { value: 'rack', label: 'Data center / rack', description: 'Server room or colo, standard rack mounting' },
    ],
  },
  {
    id: 'setup',
    title: 'How do you want to deploy?',
    question: 'Pre-built systems get you running faster; cards give you flexibility to build your own cluster.',
    options: [
      { value: 'box', label: 'Pre-built system', description: 'Ready to plug in and run' },
      { value: 'build', label: 'Cards only', description: "I'll build or integrate into my own chassis" },
    ],
  },
  {
    id: 'use',
    title: "What's your main goal?",
    question: "We'll match you to the product that fits your primary use case.",
    options: [
      { value: 'research', label: 'Research & development', description: 'Experimentation, custom models, heavy SRAM workloads' },
      { value: 'efficiency', label: 'Cost-efficient inference', description: 'Lower op costs, block float, production inference' },
      { value: 'fleet', label: 'Fleet / multi-tenant serving', description: 'Multiple users, model portfolio, 4U density' },
    ],
  },
];

function getRecommendedProduct(answers: Answers): Product {
  const exact = products.find((p) => p.env === answers.env && p.assembly === answers.setup && p.use === answers.use);
  if (exact) return exact;
  const key = `${answers.env}|${answers.setup}|${answers.use}`;
  const id = RECOMMENDATION_MAP[key];
  const fallback = products.find((p) => p.id === id);
  return fallback ?? products[0];
}

function getArchitecturalEdge(product: Product, useCase: string): string {
  const byUse = HIGHLIGHTS_BY_JOURNEY[product.id];
  if (byUse && (useCase === 'research' || useCase === 'efficiency' || useCase === 'fleet')) {
    return byUse[useCase];
  }
  return product.highlight;
}

function ResultCard({ product, useCase }: { product: Product; useCase: string }) {
  const architecturalEdge = getArchitecturalEdge(product, useCase);
  return (
    <div className="bg-slate-plus p-8 text-tt-black text-left rounded-lg max-w-2xl border border-slate-plus" style={{ borderLeftColor: product.brand_color, borderLeftWidth: '4px' }}>
      <h1 className="text-4xl md:text-5xl font-light mb-2 font-display text-tt-black">{product.name}</h1>
      <p className="text-xl font-medium mb-6 font-display text-tt-black/80">{product.tagline}</p>
      <div className="border-l-2 pl-4 mb-8" style={{ borderColor: product.brand_color }}>
        <p className="text-sm font-mono uppercase tracking-widest text-tt-black/50 mb-1">Architectural edge</p>
        <p className="text-lg font-body">{architecturalEdge}</p>
      </div>
      {product.software?.length > 0 && <p className="text-sm font-mono text-tt-black/60 mb-6">Software: {product.software.join(', ')}</p>}
      <button className="text-white px-8 py-3 font-medium font-body hover:opacity-90 transition-opacity rounded" style={{ backgroundColor: product.brand_color }}>{product.cta}</button>
      <div className="mt-12 text-xs font-mono text-tt-black/40">REF: TENSTORRENT BRAND v1.1 | PROTOTYPE</div>
    </div>
  );
}

function StepQuestion({ step, answers, onAnswer, onNext, onBack }: { step: (typeof STEPS)[number]; answers: Answers; onAnswer: (key: keyof Answers, value: string) => void; onNext: () => void; onBack: () => void }) {
  const stepIndex = STEPS.findIndex((s) => s.id === step.id);
  const isIntro = step.id === 'intro';
  const isLastQuestion = stepIndex === STEPS.length - 1;

  if (isIntro) {
    return (
      <div className="text-left max-w-xl">
        <h1 className="text-4xl md:text-5xl font-light font-display text-tt-black mb-4">{step.title}</h1>
        <p className="text-lg font-body text-tt-black/80 mb-10">{step.question}</p>
        <button onClick={onNext} className="bg-tens-purple text-white px-8 py-3 font-medium font-body hover:opacity-90 transition-opacity rounded">{step.cta}</button>
      </div>
    );
  }

  const options = ('options' in step ? step.options : undefined) ?? [];
  const answerKey = step.id === 'env' ? 'env' : step.id === 'setup' ? 'setup' : 'use';
  const currentValue = answers[answerKey];

  return (
    <div className="text-left max-w-2xl">
      <button type="button" onClick={onBack} className="text-sm font-mono text-tt-black/50 hover:text-tt-black mb-6 inline-flex items-center gap-1">← Back</button>
      <h2 className="text-3xl md:text-4xl font-light font-display text-tt-black mb-2">{step.title}</h2>
      <p className="text-lg font-body text-tt-black/80 mb-8">{step.question}</p>
      <div className="space-y-3">
        {options.map((opt: { value: string; label: string; description?: string }) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onAnswer(answerKey, opt.value)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-colors font-body ${currentValue === opt.value ? 'border-tens-purple bg-slate-plus' : 'border-slate-plus bg-white hover:border-tt-black/20'}`}
          >
            <span className="font-medium text-tt-black">{opt.label}</span>
            {opt.description && <span className="block text-sm text-tt-black/60 mt-1">{opt.description}</span>}
          </button>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-4">
        <button onClick={onBack} className="text-tt-black/60 font-body hover:text-tt-black">Back</button>
        <button onClick={onNext} disabled={!currentValue} className="bg-tens-purple text-white px-8 py-3 font-medium font-body hover:opacity-90 transition-opacity rounded disabled:opacity-50 disabled:cursor-not-allowed">{isLastQuestion ? 'See my match' : 'Next'}</button>
      </div>
    </div>
  );
}

export function ProductSelector() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ env: '', setup: '', use: '' });
  const recommendedProduct = useMemo(() => getRecommendedProduct(answers), [answers]);
  const isResultStep = stepIndex === STEPS.length;
  const currentStep = STEPS[stepIndex];

  const handleNext = () => { if (stepIndex < STEPS.length) setStepIndex((i) => i + 1); };
  const handleBack = () => { if (stepIndex > 0) setStepIndex((i) => i - 1); };
  const handleAnswer = (key: keyof Answers, value: string) => { setAnswers((a) => ({ ...a, [key]: value })); };

  return (
    <div className="w-full min-h-screen flex items-center justify-start bg-white px-6 py-10 sm:px-10 md:px-16 md:py-14">
      <div className="w-full max-w-4xl mx-auto">
        {!isResultStep && (
          <div className="mb-10 flex items-center gap-2">
            {STEPS.filter((s) => s.id !== 'intro').map((s) => {
              const stepNum = STEPS.findIndex((x) => x.id === s.id);
              const active = stepIndex === stepNum;
              const done = stepIndex > stepNum;
              return <div key={s.id} className={`h-1 flex-1 max-w-[80px] rounded-full ${active ? 'bg-tens-purple' : done ? 'bg-tens-purple/50' : 'bg-slate-plus'}`} aria-hidden />;
            })}
          </div>
        )}
        {isResultStep ? (
          <div className="flex flex-col items-start">
            <ResultCard product={recommendedProduct} useCase={answers.use} />
            <button type="button" onClick={() => setStepIndex(STEPS.length - 1)} className="mt-6 text-sm font-mono text-tt-black/50 hover:text-tt-black">← Change my answers</button>
          </div>
        ) : currentStep ? (
          <StepQuestion step={currentStep} answers={answers} onAnswer={handleAnswer} onNext={handleNext} onBack={handleBack} />
        ) : null}
      </div>
    </div>
  );
}
