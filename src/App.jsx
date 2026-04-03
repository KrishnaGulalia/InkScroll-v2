import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Genre from './pages/Genre';
import AiDrawer from './components/AiDrawer';
import Sidebar from './components/Sidebar';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function AppContent({ searchQuery, setSearchQuery }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary text-txt-primary font-body">
      <Navbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="pt-14 sm:pt-[60px]">
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/manga/:id" element={<Detail />} />
          <Route path="/genre/:genreName" element={<Genre />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
      {/* AI Drawer — globally available on all pages */}
      <AiDrawer />
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
