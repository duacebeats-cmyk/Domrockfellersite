import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Simulator } from './components/Simulator';
import { HowItWorks } from './components/HowItWorks';
import { Offices } from './components/Offices';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { ProposalModal } from './components/ProposalModal';
import { AiChatbot } from './components/AiChatbot';
import { AdminPanel } from './components/AdminPanel';
import { ClientPortal } from './components/ClientPortal';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from './services/api';

export function App() {
  const [activeView, setActiveView] = useState('site'); // 'site' | 'admin' | 'client'
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Check saved session on startup
  useEffect(() => {
    const saved = api.getCurrentUser();
    if (saved) {
      setCurrentUser(saved);
    }
  }, []);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveView('admin');
      addToast(`Bem-vindo, Administrador ${user.name}!`);
    } else {
      setActiveView('client');
      addToast(`Bem-vindo ao Portal do Cliente, ${user.name}!`);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveView('site');
    addToast('Você saiu da sua conta.');
  };

  const handleCompleteSimulation = (data) => {
    setSimulationData(data);
    setIsProposalModalOpen(true);
    addToast(`Cálculo realizado! Economia estimada de R$ ${data.estimatedSavings?.toLocaleString('pt-BR')}`);
  };

  const handleLeadCreated = (lead) => {
    addToast(`Proposta enviada com sucesso para a equipe de ${lead.cityUnit}!`);
  };

  const scrollToSection = (id) => {
    setActiveView('site');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar with brand, dual offices, and unified user area */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSimulator={() => scrollToSection('simulador')}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activeView === 'site' && (
          <>
            <Hero
              onOpenSimulator={() => scrollToSection('simulador')}
              onOpenChat={() => setIsChatOpen(true)}
            />

            <Simulator onCompleteSimulation={handleCompleteSimulation} />
            
            <HowItWorks onOpenSimulator={() => scrollToSection('simulador')} />
            
            <Offices onOpenSimulator={() => scrollToSection('simulador')} />
            
            <Testimonials />
            
            <Faq />
          </>
        )}

        {activeView === 'admin' && (
          <AdminPanel
            currentUser={currentUser}
            onBackToSite={() => setActiveView('site')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeView === 'client' && (
          <ClientPortal
            currentUser={currentUser}
            onOpenSimulator={() => scrollToSection('simulador')}
            onBackToSite={() => setActiveView('site')}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer
        setActiveView={setActiveView}
        onOpenSimulator={() => scrollToSection('simulador')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Lead Formalization Modal */}
      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        simulationData={simulationData}
        onLeadCreated={handleLeadCreated}
      />

      {/* AI Assistant Chatbot */}
      <AiChatbot
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onOpenSimulator={() => {
          setIsChatOpen(false);
          scrollToSection('simulador');
        }}
        onScrollToSection={(sec) => {
          setIsChatOpen(false);
          scrollToSection(sec);
        }}
      />

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className="toast">
              <CheckCircle2 size={18} color="#10B981" />
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;
