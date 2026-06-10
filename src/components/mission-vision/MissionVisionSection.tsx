import React from 'react';
import MissionPanel from './MissionPanel';
import VisionPanel from './VisionPanel';
import TypewriterText from './TypewriterText';
import SectionTitle from '../ui/SectionTitle';

const stats = [
  { value: 'Desde 2019', label: 'Sirviendo el sabor del mar' },
  { value: '100%', label: 'Mariscos del Caribe hondureño' },
  { value: 'Garífuna', label: 'Tradición y recetas ancestrales' },
];

const MissionVisionSection = React.memo(function MissionVisionSection() {
  return (
    <section id="nosotros" className="relative">
      {/* Nuestra Historia */}
      <div className="bg-charcoal section-padding">
        <div className="section-container">
          <SectionTitle
            label="Nosotros"
            title="Nuestra Historia"
            subtitle="Una historia de mar, fuego y raíces caribeñas que comenzó hace más de cinco años."
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12 lg:mt-16 items-start">
            {/* Narrativa */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <p className="font-body text-warmgray leading-relaxed text-sm md:text-base">
                Tony&apos;s Mar nació en{' '}
                <span className="text-gold">2019</span> en el corazón del Caribe
                hondureño, de la mano de una familia profundamente ligada al mar
                y a la tradición garífuna. Lo que empezó como una pequeña cocina
                frente a la costa se convirtió en un homenaje vivo a los sabores
                de Tela, La Ceiba y las Islas de la Bahía.
              </p>
              <p className="font-body text-warmgray/80 leading-relaxed text-sm md:text-base">
                Cada mañana, los mariscos llegan frescos de pescadores
                artesanales que conocen estas aguas de toda la vida. Honramos las
                recetas heredadas de las comunidades garífunas —el coco, el
                plátano, los sofritos de la costa— y las elevamos con técnica y
                respeto. Más que un restaurante, somos un pedazo de Honduras
                servido en la mesa, con el alma del Caribe en cada bocado.
              </p>
            </div>

            {/* Estadísticas / datos */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="bg-charcoal-light/30 border border-gold/10 p-6 text-center sm:text-left"
                >
                  <p className="font-display text-2xl md:text-3xl text-gradient-gold leading-tight">
                    {stat.value}
                  </p>
                  <p className="font-body text-xs md:text-sm text-warmgray/80 mt-2 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
