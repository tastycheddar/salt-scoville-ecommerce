
import HeroImageSlider from './hero/HeroImageSlider';
import HeroContent from './hero/HeroContent';
import HeroBackground from './hero/HeroBackground';
import './HeroSlider.css';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-start justify-center overflow-hidden bg-char-black -mt-20">
      <HeroImageSlider />
      <HeroBackground />
      <HeroContent />
    </section>
  );
};

export default Hero;
