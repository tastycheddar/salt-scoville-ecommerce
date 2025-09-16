import { Flame, Beaker, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FlavaDaveSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-char-black via-slate-900 to-char-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-flame-red/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-burnt-orange/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-flame-red/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame className="h-8 w-8 text-flame-red animate-pulse" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-im-fell font-bold text-white">
              Meet FlavaDave
            </h2>
            <Flame className="h-8 w-8 text-flame-red animate-pulse" />
          </div>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Built from Dave's own brainwaves, this AI knows what slaps, what smokes, and what should never touch your tongue. Tap the flame below and let Dave guide you through flavor alchemy 101 or simply click on one of the features below to get started now!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <Link to="/flava-dave" className="text-center group h-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-flame-red/50 transition-all duration-300 hover:scale-105 h-full flex flex-col cursor-pointer hover:bg-white/15 active:scale-95">
              <Beaker className="h-12 w-12 text-flame-red mx-auto mb-4 group-hover:animate-pulse" />
              <h4 className="text-xl font-bold text-white mb-3">Dave's Lab</h4>
              <p className="text-slate-300">Hang with Dave one-on-one in his secret spice lab</p>
            </div>
          </Link>

          <Link to="/recipe-wizard" className="text-center group h-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-flame-red/50 transition-all duration-300 hover:scale-105 h-full flex flex-col cursor-pointer hover:bg-white/15 active:scale-95">
              <BookOpen className="h-12 w-12 text-flame-red mx-auto mb-4 group-hover:animate-pulse" />
              <h4 className="text-xl font-bold text-white mb-3">Recipe Wizard</h4>
              <p className="text-slate-300">Get personalized recipes based on your heat tolerance</p>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FlavaDaveSection;