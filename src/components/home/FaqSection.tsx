import { useState } from 'react';
import { FAQ_DATA } from '../../data/faqAndTestimonials';
import { HelpCircle, ChevronDown, ChevronUp, Mail, ShieldAlert } from 'lucide-react';

interface FaqSectionProps {
  onContactSupport: () => void;
}

export function FaqSection({ onContactSupport }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-slate-950/70 border-t border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Candidate Knowledge Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400">
            Everything you need to know about enrollment, prerequisite preparation, hands-on lab environments, and certificate verification.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_DATA.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl bg-slate-900/70 border border-slate-800/90 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left text-white hover:text-cyan-300 transition-colors cursor-pointer gap-4"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-semibold">
                      {faq.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-100">
                      {faq.question}
                    </h4>
                  </div>
                  
                  <div className={`p-1.5 rounded-lg bg-slate-800 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions prompt */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h5 className="text-sm font-bold text-white">Have a specific question not covered here?</h5>
            <p className="text-xs text-slate-400">Our academic advisory and admissions team is available to assist you.</p>
          </div>
          <button
            onClick={onContactSupport}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Admissions</span>
          </button>
        </div>

      </div>
    </section>
  );
}
