import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import AiDrawer from './components/AiDrawer';

function AppContent({ searchQuery, setSearchQuery }) {
  return (
    <div className="min-h-screen bg-primary text-txt-primary font-body">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/manga/:id" element={<Detail />} />
      </Routes>
      {/* AI Drawer — globally available on all pages */}
      <AiDrawer />
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <AppContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </BrowserRouter>
  );
}

export default App;
