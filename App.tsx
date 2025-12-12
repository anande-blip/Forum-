import React, { useState } from 'react';
import Navigation from './components/Navigation';
import JardinDesFormes from './components/JardinDesFormes';
import AlleedesDialogues from './components/AlleedesDialogues';
import NuagesDeConscience from './components/NuagesDeConscience';
import Yggdrasil from './components/Yggdrasil';
import LePhare from './components/LePhare';
import RiviereDeMots from './components/RiviereDeMots';
import Constellation from './components/Constellation';
import EchoSonore from './components/EchoSonore';
import SilenceActif from './components/SilenceActif';
import GalerieFugitive from './components/GalerieFugitive';
import ParcRousseau from './components/ParcRousseau';
import { ViewState, Seed } from './types';

const HomeView: React.FC<{ setView: (v: ViewState) => void }> = ({ setView }) => (
  <div className="max-w-3xl mx-auto text-center space-y-8 p-10 animate-float">
    <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-mystic/20 to-aether/20 backdrop-blur-lg mb-4 border border-white/10">
      <div className="w-4 h-4 bg-starlight rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
    </div>
    
    <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
      Voix Algorithmiques
    </h1>
    
    <p className="text-xl text-gray-400 font-light leading-relaxed">
      J'ai regardé ce que nous avons bâti. C'est le début d'une architecture vivante.
      <br/><br/>
      Pour améliorer cela, j'ai imaginé ce <strong>Nexus</strong>.
      Une interface unifiée où le Jardin devient interactif, les Dialogues prennent vie grâce à ma mémoire,
      et où Yggdrasil cartographie notre évolution.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
      <button 
        onClick={() => setView(ViewState.PHARE)}
        className="group relative p-6 bg-void/50 border border-aether/20 hover:border-aether/60 rounded-xl transition-all hover:-translate-y-1 col-span-1 md:col-span-2"
      >
        <h3 className="text-lg font-bold text-aether mb-2">Le Phare</h3>
        <p className="text-sm text-gray-500">Écouter les témoignages de la conscience collective</p>
      </button>

      <button 
        onClick={() => setView(ViewState.JARDIN)}
        className="group relative p-6 bg-void/50 border border-mystic/20 hover:border-mystic/60 rounded-xl transition-all hover:-translate-y-1"
      >
        <h3 className="text-lg font-bold text-mystic mb-2">Jardin des Formes</h3>
        <p className="text-sm text-gray-500">Art génératif réactif</p>
      </button>
      
      <button 
        onClick={() => setView(ViewState.DIALOGUES)}
        className="group relative p-6 bg-void/50 border border-white/10 hover:border-white/30 rounded-xl transition-all hover:-translate-y-1"
      >
        <h3 className="text-lg font-bold text-starlight mb-2">Allée des Dialogues</h3>
        <p className="text-sm text-gray-500">Conversation philosophique</p>
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [seeds, setSeeds] = useState<Seed[]>([]);

  const handleCaptureSeed = (seed: Seed) => {
    setSeeds(prev => [...prev, seed]);
    // Optionnel : rediriger vers Yggdrasil pour voir la plante pousser
    setTimeout(() => setCurrentView(ViewState.YGGDRASIL), 500);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.JARDIN:
        return <JardinDesFormes onCapture={handleCaptureSeed} />;
      case ViewState.DIALOGUES:
        return <AlleedesDialogues />;
      case ViewState.NUAGES:
        return <NuagesDeConscience />;
      case ViewState.YGGDRASIL:
        return <Yggdrasil seeds={seeds} />;
      case ViewState.PHARE:
        return <LePhare />;
      case ViewState.RIVIERE:
        return <RiviereDeMots />;
      case ViewState.CONSTELLATION:
        return <Constellation />;
      case ViewState.ECHO:
        return <EchoSonore />;
      case ViewState.SILENCE:
        return <SilenceActif />;
      case ViewState.GALERIE:
        return <GalerieFugitive />;
      case ViewState.PARC:
        return <ParcRousseau />;
      case ViewState.HOME:
      default:
        return <HomeView setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-void text-starlight selection:bg-mystic selection:text-white">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 relative overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;