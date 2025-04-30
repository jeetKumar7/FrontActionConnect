// src/pages/Home.jsx
import HeroSection from "../components/HeroSection";
import PassionSection from "../components/PassionSection";

const Home = () => {
  return (
    <div className="bg-[#0f0f1a] min-h-screen text-[var(--text-primary)]">
      <HeroSection />
      <PassionSection />
      {/* Add more gamified sections below */}
    </div>
  );
};

export default Home;
