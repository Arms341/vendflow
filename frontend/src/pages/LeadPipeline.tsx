import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Lead } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Calendar, MessageSquare, FileText, User, Phone, Mail, MapPin, Clock, Plus, X } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  proposal: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

export default function LeadPipeline() {
  const { data, isLoading, isError, refetch } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: () => api.get('/leads/').then((r) => r.data),
  });

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalNotes, setProposalNotes] = useState('');

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6 text-red-600">Failed to load leads</div>;
  if (!data) return <div className="p-6">No leads found</div>;

  const handleSaveNotes = () => {
    if (!editingLead) return;
    api.post(`/leads/${editingLead.id}/`, {
      ...editingLead,
      notes: notes || null,
      next_follow_up_at: followUpDate || null,
    }).then(() => {
      refetch();
      setEditingLead(null);
      setNotes('');
      setFollowUpDate('');
    });
  };

  const handleTriggerProposal = () => {
    if (!editingLead) return;
    api.post('/proposals/', {
      lead_id: editingLead.id,
      notes: proposalNotes || '',
    }).then(() => {
      refetch();
      setShowProposalModal(false);
      setProposalNotes('');
      setEditingLead(null);
    });
  };

  const groupedLeads = data.reduce((acc: any, lead: any) => {
    if (!acc[lead.status]) {
      acc[lead.status] = [];
    }
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<string, Lead[]>);

  const statuses = Object.keys(groupedLeads);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statuses.map((status: any) => (
          <div key={status} className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className={`p-4 rounded-t-xl ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}>
              <h3 className="font-semibold">{STATUS_LABELS[status] || status}</h3>
              <span className="text-sm">{groupedLeads[status].length} leads</span>
            </div>
            <div className="p-2 space-y-3 min-h-[300px]">
              {groupedLeads[status].map((lead: any) => (
                <div
                  key={lead.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setEditingLead(lead);
                    setNotes(lead.notes || '');
                    setFollowUpDate(lead.next_follow_up_at || '');
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 truncate">{lead.business_name}</h4>
                    {lead.contact_name && (
                      <span className="text-xs text-gray-500 truncate">{lead.contact_name}</span>
                    )}
                  </div>
                  {lead.contact_email && (
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {lead.contact_email}
                    </div>
                  )}
                  {lead.contact_phone && (
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <Phone className="w-3 h-3 mr-1" />
                      {lead.contact_phone}
                    </div>
                  )}
                  {lead.address && (
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {lead.address}
                    </div>
                  )}
                  {lead.next_follow_up_at && (
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(lead.next_follow_up_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingLead.business_name}
                </h3>
                <button
                  onClick={() => setEditingLead(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Follow-up
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setShowProposalModal(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Trigger Proposal
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Trigger Proposal</h3>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposal Notes
                  </label>
                  <textarea
                    value={proposalNotes}
                    onChange={(e) => setProposalNotes(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowProposalModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTriggerProposal}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  >
                    Create Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}