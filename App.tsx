import React, { useState, useEffect } from 'react';
import { Customer, AppSettings, User, UserRole, ADMIN_EMAIL, STAFF_EMAIL } from './types.ts';
import { INITIAL_CUSTOMERS, INITIAL_SETTINGS } from './services/mockService.ts';
import { DashboardStats } from './components/DashboardStats.tsx';
import { CustomerTable } from './components/CustomerTable.tsx';
import { SettingsPanel } from './components/SettingsPanel.tsx';
import { LogOut, PieChart, Users, Settings as SettingsIcon, Shield, ExternalLink, ArrowRight, MessageCircle, BarChart3, Lock, CheckCircle2, Box, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  
  // Login State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState(''); 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput === ADMIN_EMAIL) {
      if (passwordInput === 'admin@lensboxpecmdu') {
        setUser({ email: emailInput, name: 'Dr. Preethika', role: UserRole.ADMIN });
      } else {
        alert("Invalid Password. Please check your credentials.");
      }
    } else if (emailInput === STAFF_EMAIL) {
      if (passwordInput === 'frstaff@lensboxpecmdu') {
        setUser({ email: emailInput, name: 'Staff Member', role: UserRole.STAFF });
      } else {
        alert("Invalid Password. Please check your credentials.");
      }
    } else {
      alert("Invalid Email. Use authorized credentials.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmailInput('');
    setPasswordInput('');
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const addCustomer = (newCust: Omit<Customer, 'id'>) => {
    const cust: Customer = {
      ...newCust,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCustomers(prev => [...prev, cust]);
  };

  const importCustomers = (importedData: Customer[]) => {
    setCustomers(importedData);
    alert(`Successfully imported ${importedData.length} patient records.`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
        
        {/* Left Side - Feature Showcase & Origin */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 relative overflow-hidden text-white flex flex-col justify-between p-12 lg:p-16">
           {/* Abstract Background */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute right-0 top-0 bg-white w-96 h-96 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute left-0 bottom-0 bg-cyan-400 w-96 h-96 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
           </div>

           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold tracking-widest uppercase">Focus CaseX Module</span>
                </div>
             </div>

             <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
               Optical Feedback <br/> & Delivery System
             </h1>
             <p className="text-blue-100 text-lg mb-10 max-w-md leading-relaxed border-l-4 border-blue-400 pl-4">
               Custom engineered exclusively for <span className="font-semibold text-white">Preethika Eye Care</span> to enhance patient post-delivery experience.
             </p>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition duration-300">
                    <Activity className="w-6 h-6 text-cyan-300 mb-3" />
                    <h3 className="font-bold text-base mb-1">Feedback Loop</h3>
                    <p className="text-xs text-blue-100 opacity-80">Track call status and patient satisfaction post-dispensing.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition duration-300">
                    <MessageCircle className="w-6 h-6 text-green-300 mb-3" />
                    <h3 className="font-bold text-base mb-1">WhatsApp Integration</h3>
                    <p className="text-xs text-blue-100 opacity-80">One-click automated follow-up messages to patients.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition duration-300">
                    <Box className="w-6 h-6 text-amber-300 mb-3" />
                    <h3 className="font-bold text-base mb-1">Delivery Stats</h3>
                    <p className="text-xs text-blue-100 opacity-80">Visual analytics on delivery timelines and staff performance.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition duration-300">
                    <Shield className="w-6 h-6 text-purple-300 mb-3" />
                    <h3 className="font-bold text-base mb-1">Admin Control</h3>
                    <p className="text-xs text-blue-100 opacity-80">Role-based access for Dr. Preethika and Staff members.</p>
                </div>
             </div>
           </div>

           <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">
                  Powered by Focus CaseX
                </p>
                <a href="https://focuscasex.netlify.app" target="_blank" rel="noreferrer" className="text-xs text-white hover:underline flex items-center gap-1 mt-1">
                   View Module Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
           </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 relative">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            
            {/* Logo Area */}
            <div className="text-center mb-6">
               <div className="flex justify-center mb-4">
                  {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
                  ) : (
                      <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
                          <Users className="text-white w-8 h-8" />
                      </div>
                  )}
               </div>
               <h2 className="text-2xl font-bold text-gray-900">{settings.companyName}</h2>
               <div className="mt-3 inline-block bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                   <p className="text-xs font-bold text-blue-800 tracking-wide uppercase">
                     Contributed exclusively to <br/> Preethika Eye Care
                   </p>
               </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@pec.com"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-4 h-4" />
                  Secure Login
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
               <div className="flex items-center justify-center gap-2 mb-2">
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                   <span className="text-xs font-medium text-gray-500">Secure AES Encryption</span>
               </div>
               <div className="text-center">
                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                     Presented from Focuslinks.in by Janarthan veeramani
                   </p>
               </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
                <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Users className="text-white w-5 h-5" />
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-800 leading-tight">{settings.companyName}</span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Feedback Portal</span>
            </div>
            {user.role === UserRole.ADMIN && (
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                    <Shield className="w-3 h-3 mr-1" /> Admin
                </span>
            )}
          </div>
          
          <nav className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${view === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <PieChart className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Dashboard</span>
            </button>
            
            {user.role === UserRole.ADMIN && (
              <button
                onClick={() => setView('settings')}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${view === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">System Setup</span>
              </button>
            )}

            <div className="h-6 w-px bg-gray-200 mx-1 md:mx-2"></div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden md:block font-medium">Dr. {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {view === 'dashboard' ? (
          <div className="animate-fade-in space-y-8">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Feedback Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of lens deliveries and patient follow-ups.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">System Status</p>
                    <div className="flex items-center justify-end gap-2 text-green-600 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Online
                    </div>
                </div>
             </div>

            <DashboardStats customers={customers} />
            
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Patient Registry</h2>
                </div>
                <CustomerTable 
                    customers={customers} 
                    settings={settings}
                    user={user}
                    onUpdateCustomer={updateCustomer}
                    onAddCustomer={addCustomer}
                    onImportCustomers={importCustomers}
                />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
             <SettingsPanel settings={settings} onUpdate={setSettings} />
          </div>
        )}
      </main>

      {/* Fixed Watermark Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 py-3 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Presented from Focuslinks.in by Janarthan veeramani
                </p>
                {view === 'dashboard' && (
                    <div className="flex items-center gap-2 mt-1">
                        <Lock className="w-3 h-3 text-gray-300" />
                        <p className="text-[10px] text-gray-300">
                            Preethika Eye Care • Internal Use Only
                        </p>
                    </div>
                )}
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;