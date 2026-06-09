import React from 'react';
import MissionPanel from './MissionPanel';
import VisionPanel from './VisionPanel';
import TypewriterText from './TypewriterText';

const MissionVisionSection = React.memo(function MissionVisionSection() {
  return (
    <section id="mission-vision" className="relative">
      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <MissionPanel />
        <VisionPanel />
      </div>

      {/* Frase filosófica central */}
      <div className="bg-charcoal-deep py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-xl md:text-2xl lg:text-3xl text-cream/80 italic leading-relaxed">
            &ldquo;
            <TypewriterText
              text="El mar nos da sus tesoros, nosotros los honramos con fuego, sazón y el alma de Honduras."
              speed={30}
            />
            &rdquo;
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="w-8 h-px bg-gold/40" />
            <span className="font-body text-xs text-gold/60 tracking-widest uppercase">
              Chef Ejecutivo
            </span>
            <span className="w-8 h-px bg-gold/40" />
          </div>
        </div>
      </div>
    </section>
  );
});

export default MissionVisionSection;
