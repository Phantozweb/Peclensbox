import React, { useState, useEffect, useRef } from 'react';
import { Customer, AppSettings, User, UserRole } from '../types';
import { MessageCircle, Check, X, Edit2, ShieldCheck, Filter, Search, ChevronDown, Calendar, User as UserIcon, Phone, Download, Upload } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  settings: AppSettings;
  user: User;
  onUpdateCustomer: (customer: Customer) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onImportCustomers: (customers: Customer[]) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  settings,
  user,
  onUpdateCustomer,
  onAddCustomer,
  onImportCustomers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // File Input Ref for Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Customer>>({
    sNo: customers.length + 1,
    dateOfDelivery: new Date().toISOString().split('T')[0],
    customerName: '',
    phoneNumber: '',
    calledBy: '',
    callStatus: 'Not Called',
    salesComment: '',
    isApproved: false
  });

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleEdit = (customer: Customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({
      sNo: customers.length + 1,
      dateOfDelivery: new Date().toISOString().split('T')[0],
      customerName: '',
      phoneNumber: '',
      calledBy: user.name, // Default to current user if they are staff
      callStatus: 'Not Called',
      salesComment: '',
      isApproved: false
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdateCustomer({ ...formData, id: editingId } as Customer);
    } else {
      onAddCustomer(formData as Omit<Customer, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleWhatsApp = (customer: Customer) => {
    if (!customer.phoneNumber) return;
    
    let message = settings.whatsappTemplate
      .replace('{name}', customer.customerName)
      .replace('{date}', customer.dateOfDelivery);
    
    const url = `https://wa.me/${customer.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleApproval = (customer: Customer) => {
    if (user.role !== UserRole.ADMIN) return;
    onUpdateCustomer({ ...customer, isApproved: !customer.isApproved });
  };

  // Export / Import Logic
  const handleExport = () => {
    const dataStr = JSON.stringify(customers, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lensbox_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          if(window.confirm(`Found ${parsed.length} records. This will replace the current data on your screen. Do you want to continue?`)) {
             onImportCustomers(parsed);
          }
        } else {
          alert("Invalid file format. Expected an array of customers.");
        }
      } catch (error) {
        alert("Error parsing JSON file");
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };


  // Filtering
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || c.callStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full shadow-sm"
              aria-label="Search patients by name or phone"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white shadow-sm cursor-pointer"
              aria-label="Filter by call status"
            >
              <option value="All">All Status</option>
              <option value="Called">Called</option>
              <option value="Not Called">Not Called</option>
              <option value="Pending Follow-up">Pending Follow-up</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {user.role === UserRole.ADMIN && (
            <>
              <button
                onClick={handleExport}
                className="bg-white text-gray-700 px-3 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2"
                title="Export Data Backup"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={handleImportClick}
                className="bg-white text-gray-700 px-3 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2"
                title="Import Data Backup"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="application/json" 
              />
            </>
          )}

          <button 
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition w-full md:w-auto shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            aria-label="Add new patient"
          >
            <UserIcon className="w-4 h-4" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="grid">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-3" scope="col">S.No</th>
              <th className="px-6 py-3" scope="col">Date</th>
              <th className="px-6 py-3" scope="col">Patient Details</th>
              <th className="px-6 py-3" scope="col">Status</th>
              <th className="px-6 py-3" scope="col">Handled By</th>
              <th className="px-6 py-3 w-1/4" scope="col">Notes</th>
              <th className="px-6 py-3 text-center" scope="col">Approved</th>
              <th className="px-6 py-3 text-right" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCustomers.length === 0 ? (
                <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                                <Search className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="font-medium">No patients found</p>
                            <p className="text-xs mt-1">Try adjusting your filters or add a new patient.</p>
                        </div>
                    </td>
                </tr>
            ) : (
                filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-blue-50/30 transition group">
                    <td className="px-6 py-4 font-medium text-gray-900">#{customer.sNo}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.dateOfDelivery}</td>
                    <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{customer.customerName}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                        <Phone className="w-3 h-3 mr-1" />
                        {customer.phoneNumber}
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${customer.callStatus === 'Called' ? 'bg-green-50 text-green-700 border-green-100' : 
                        customer.callStatus === 'Not Called' ? 'bg-red-50 text-red-700 border-red-100' : 
                        'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                             customer.callStatus === 'Called' ? 'bg-green-500' : 
                             customer.callStatus === 'Not Called' ? 'bg-red-500' : 
                             'bg-amber-500'
                        }`}></span>
                        {customer.callStatus}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center mr-2 text-gray-600 font-medium">
                                {customer.calledBy ? customer.calledBy.charAt(0) : '-'}
                            </div>
                            {customer.calledBy || <span className="text-gray-400 italic">Unassigned</span>}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="truncate max-w-xs" title={customer.salesComment}>
                            {customer.salesComment || <span className="text-gray-300">-</span>}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                    <button 
                        onClick={() => handleApproval(customer)}
                        disabled={user.role !== UserRole.ADMIN}
                        className={`p-1.5 rounded-full transition-all duration-200 ${customer.isApproved ? 'bg-blue-100 text-blue-600 shadow-sm' : 'bg-gray-100 text-gray-300'} ${user.role === UserRole.ADMIN ? 'cursor-pointer hover:bg-blue-200 hover:scale-110' : 'cursor-default'}`}
                        title={user.role === UserRole.ADMIN ? "Toggle Approval" : "Admin only"}
                        aria-pressed={customer.isApproved}
                        aria-label={`Toggle approval for ${customer.customerName}`}
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleWhatsApp(customer)}
                                className="text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 p-2 rounded-lg transition shadow-sm"
                                title="Send WhatsApp Message"
                                aria-label={`Send WhatsApp message to ${customer.customerName}`}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleEdit(customer)}
                                className="text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 p-2 rounded-lg transition shadow-sm"
                                title="Edit Patient Details"
                                aria-label={`Edit ${customer.customerName}`}
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Accessible & Mobile Friendly Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setIsModalOpen(false)} // Close on backdrop click
        >
          <div 
            className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-fade-in-up"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
          >
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm sm:rounded-t-2xl">
              <h3 id="modal-title" className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5 text-blue-500" /> : <UserIcon className="w-5 h-5 text-blue-500" />}
                {editingId ? 'Edit Patient Record' : 'New Patient Entry'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* S.No */}
                <div className="col-span-1">
                    <label htmlFor="sNo" className="block text-sm font-semibold text-gray-700 mb-2">Serial Number</label>
                    <input 
                      id="sNo"
                      type="number" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                      value={formData.sNo}
                      onChange={e => setFormData({...formData, sNo: parseInt(e.target.value)})}
                      autoFocus
                      aria-required="true"
                    />
                </div>

                {/* Date */}
                <div className="col-span-1">
                    <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">Date of Delivery</label>
                    <div className="relative">
                        <input 
                        id="date"
                        type="date" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                        value={formData.dateOfDelivery}
                        onChange={e => setFormData({...formData, dateOfDelivery: e.target.value})}
                        aria-required="true"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Customer Name */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-2">Patient Name</label>
                  <div className="relative">
                    <input 
                        id="customerName"
                        type="text" 
                        placeholder="e.g. John Doe"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                        value={formData.customerName}
                        onChange={e => setFormData({...formData, customerName: e.target.value})}
                        aria-required="true"
                    />
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Phone */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <input 
                        id="phoneNumber"
                        type="tel" 
                        placeholder="e.g. 9876543210"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                        value={formData.phoneNumber}
                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        aria-required="true"
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Staff */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="calledBy" className="block text-sm font-semibold text-gray-700 mb-2">Handled By</label>
                  <div className="relative">
                    <select 
                      id="calledBy"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                      value={formData.calledBy}
                      onChange={e => setFormData({...formData, calledBy: e.target.value})}
                      aria-required="true"
                    >
                      <option value="">Select Staff Member</option>
                      {settings.staffMembers.map(staff => (
                        <option key={staff} value={staff}>{staff}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">Call Status</label>
                  <div className="relative">
                    <select 
                      id="status"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                      value={formData.callStatus}
                      onChange={e => setFormData({...formData, callStatus: e.target.value as any})}
                      aria-required="true"
                    >
                      <option value="Not Called">Not Called</option>
                      <option value="Called">Called</option>
                      <option value="Pending Follow-up">Pending Follow-up</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Comments */}
                <div className="col-span-2">
                  <label htmlFor="comments" className="block text-sm font-semibold text-gray-700 mb-2">Notes / Comments</label>
                  <textarea 
                    id="comments"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white resize-none"
                    rows={3}
                    placeholder="Enter any feedback or delivery notes..."
                    value={formData.salesComment}
                    onChange={e => setFormData({...formData, salesComment: e.target.value})}
                    aria-required="false"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm sm:rounded-b-2xl flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                <Check className="w-5 h-5" />
                {editingId ? 'Update Record' : 'Save Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};