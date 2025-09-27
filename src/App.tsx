import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { Messages } from './components/Messages';
import { Calendar } from './components/Calendar';
import CreatePairingModal from './components/CreatePairingModal';
import { ProfileNew } from './components/ProfileNew';
import { Settings } from './components/Settings';
import { Notifications } from './components/Notifications';
import { Onboarding } from './components/OnboardingNew';
import { Toaster } from './components/ui/sonner';
import { InviteFloatingAction } from './components/InviteFloatingAction';
import CreateActivityModal from './components/CreateActivityModal';
import CreateEventChooserModal from './components/CreateEventChooserModal';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isCreatePairingModalOpen, setIsCreatePairingModalOpen] = useState(false);
  const [isCreateChooserOpen, setIsCreateChooserOpen] = useState(false);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setIsLoggedIn(true);
  };

  const handleCreateEvent = () => {
    setIsCreateChooserOpen(true);
  };

  const handleCreatePairing = () => {
    setIsCreatePairingModalOpen(true);
  };

  const handleCreateEventModal = (activityData: any) => {
    toast.success('Event created successfully!', {
      description: `${activityData.title} has been scheduled for ${activityData.date}`,
    });
    console.log('Created event:', activityData);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} onCreateEvent={handleCreateEvent} />;
      case 'search':
        return <Search />;
      case 'messages':
        return <Messages />;
      case 'calendar':
        return <Calendar />;
      case 'profile':
        return <ProfileNew onNavigate={setActiveTab} />;
      case 'settings':
        return <Settings onNavigate={setActiveTab} />;
      case 'notifications':
        return <Notifications onNavigate={setActiveTab} />;
      default:
        return <Home onNavigate={setActiveTab} onCreateEvent={handleCreateEvent} />;
    }
  };

  if (showOnboarding) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Onboarding onComplete={handleOnboardingComplete} />
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Invite Floating Action */}
      <InviteFloatingAction onNavigate={setActiveTab} onCreateEvent={handleCreateEvent} />

      {/* Create Event Chooser */}
      <CreateEventChooserModal
        isOpen={isCreateChooserOpen}
        onClose={() => setIsCreateChooserOpen(false)}
        onChoosePairing={() => { setIsCreateChooserOpen(false); setIsCreatePairingModalOpen(true); }}
        onChooseGroup={() => { setIsCreateChooserOpen(false); setIsCreateEventModalOpen(true); }}
      />

      {/* Create Event Modal */}
      <CreateActivityModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onCreateActivity={handleCreateEventModal}
      />

      <CreatePairingModal
        isOpen={isCreatePairingModalOpen}
        onClose={() => setIsCreatePairingModalOpen(false)}
        onCreatePairing={(pairingData) => {
          toast.success('Pairing request created!', {
            description: `${pairingData.activity || 'Activity'} • ${pairingData.date} ${pairingData.time}`,
          });
          console.log('Created pairing:', pairingData);
        }}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}
