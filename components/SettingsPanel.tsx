import React, { useState } from 'react';
import { AppSettings } from '../types.ts';
import { Save, Plus, Trash2, LayoutTemplate, Building2, Users, MessageSquare, Image as ImageIcon, Eye } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [newStaffName, setNewStaffName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof AppSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const addStaff = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newStaffName.trim()) {
      setLocalSettings(prev => ({
        ...prev,
        staffMembers: [...prev.staffMembers, newStaffName.trim()]
      }));
      setNewStaffName('');
      setIsSaved(false);
    }
  };

  const removeStaff = (name: string) => {
    setLocalSettings(prev => ({
      ...prev,
      staffMembers: prev.staffMembers.filter(s => s !== name)
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onUpdate(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const whatsappPreview = localSettings.whatsappTemplate
    .replace('{name}', 'John Doe')
    .replace('{date}', new Date().toISOString().split('T')[0]);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutTemplate className="w-7 h-7 text-blue-600" />
            System Configuration
          </h1>
          <p className="text-gray-500 mt-1">Manage organization details, staff access, and communication templates.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg ${
            isSaved 
            ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' 
            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
          }`}
        >
          <Save className="w-5 h-5" />
          {isSaved ? 'Changes Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Branding Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-800">Organization Branding</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={localSettings.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. LensBox"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Logo URL</label>
                <div className="relative">
                   <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={localSettings.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
              {localSettings.logoUrl && (
                <div className="col-span-1 md:col-span-2 bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100 border-dashed">
                  <span className="text-sm text-gray-500 font-medium">Logo Preview:</span>
                  <img src={localSettings.logoUrl} alt="Logo Preview" className="h-12 w-auto object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-800">WhatsApp Template</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message Template</label>
                 <textarea
                    value={localSettings.whatsappTemplate}
                    onChange={(e) => handleChange('whatsappTemplate', e.target.value)}
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed"
                    placeholder="Enter your message..."
                  />
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200 font-mono">{'name'}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200 font-mono">{'date'}</span>
                    <span className="text-xs text-gray-400 self-center ml-1">Click variables to copy (future feature)</span>
                  </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                    <MessageSquare className="w-16 h-16 text-green-600" />
                 </div>
                 <h4 className="text-xs font-bold text-green-800 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Live Preview
                 </h4>
                 <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100 text-sm text-gray-800 whitespace-pre-wrap relative z-10">
                    {whatsappPreview}
                 </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Staff */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Staff Management</h3>
            </div>
            <div className="p-6 flex flex-col h-[calc(100%-60px)]">
              <form onSubmit={addStaff} className="relative mb-6">
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Add new staff member..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!newStaffName.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                   {localSettings.staffMembers.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                          <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">No staff members added yet.</p>
                      </div>
                   )}
                   {localSettings.staffMembers.map((staff, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200 transition-colors group">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                             {staff.charAt(0)}
                           </div>
                           <span className="font-medium text-gray-700">{staff}</span>
                        </div>
                        <button 
                          onClick={() => removeStaff(staff)}
                          className="text-gray-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-500">{localSettings.staffMembers.length}</span> active staff members
                  </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};