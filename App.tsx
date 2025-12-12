import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JoinUs from './pages/JoinUs';
import PostDetail from './pages/PostDetail';
import PageDetail from './pages/PageDetail';
import { Menu, X } from 'lucide-react';

// Main App Component simulating Layout
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lid-worden" element={<JoinUs />} />
            <Route path="/nieuws/:slug" element={<PostDetail />} />
            <Route path="/over-ons/:slug" element={<PageDetail />} />
            {/* Fallback for other routes */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;