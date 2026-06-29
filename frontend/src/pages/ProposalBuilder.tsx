import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Proposal } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function ProposalBuilder() {
  const queryClient = useQueryClient();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const { data: proposals, isLoading, error } = useQuery<Proposal[]>({
    queryKey: ['proposals'],
    queryFn: () => api.get('/proposals/').then((r) => r.data),
  });

  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get('/leads/').then((r) => r.data),
  });

  useEffect(() => {
    if (proposals && proposals.length > 0) {
      setProposal(proposals[0]);
    }
  }, [proposals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (proposal) {
      setProposal({
        ...proposal,
        [name]: name === 'machine_count' || name === 'monthly_revenue_estimate' || name === 'commission_split' || name === 'contract_term_months' || name === 'placement_fee'
          ? Number(value)
          : value,
      });
    }
  };

  const handleSave = async () => {
    if (!proposal) return;
    
    try {
      await api.post(`/proposals/${proposal.id}/`, proposal);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    } catch (err) {
      console.error('Failed to save proposal:', err);
    }
  };

  const handleSend = async () => {
    if (!proposal) return;
    setIsSending(true);
    
    try {
      await api.post(`/proposals/${proposal.id}/send/`);
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      setIsSending(false);
    } catch (err) {
      console.error('Failed to send proposal:', err);
      setIsSending(false);
    }
  };

  const handleSign = async () => {
    if (!proposal) return;
    setIsSigning(true);
    
    try {
      await api.post(`/proposals/${proposal.id}/sign/`);
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      setIsSigning(false);
    } catch (err) {
      console.error('Failed to sign proposal:', err);
      setIsSigning(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-600">Failed to load proposals</div>;
  if (!proposal) return <div className="p-6">No proposal found</div>;

  const lead = leads?.find((l: any) => l.id === proposal.lead_id);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Proposal Builder</h1>
        <div className="flex space-x-2">
          {proposal.status === 'draft' && (
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          )}
          {proposal.status === 'draft' && (
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Proposal'}
            </Button>
          )}
          {proposal.status === 'sent' && (
            <Button onClick={handleSign} disabled={isSigning}>
              {isSigning ? 'Signing...' : 'Sign Proposal'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    name="title"
                    value={proposal.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{proposal.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    name="description"
                    value={proposal.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{proposal.description || 'No description'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="machine_type">Machine Type</Label>
                  {isEditing ? (
                    <Input
                      id="machine_type"
                      name="machine_type"
                      value={proposal.machine_type || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{proposal.machine_type || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="machine_count">Machine Count</Label>
                  {isEditing ? (
                    <Input
                      id="machine_count"
                      name="machine_count"
                      type="number"
                      value={proposal.machine_count ?? ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{proposal.machine_count || 0}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthly_revenue_estimate">Monthly Revenue Estimate</Label>
                  {isEditing ? (
                    <Input
                      id="monthly_revenue_estimate"
                      name="monthly_revenue_estimate"
                      type="number"
                      value={proposal.monthly_revenue_estimate ?? ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      ${proposal.monthly_revenue_estimate?.toLocaleString() || 0}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="commission_split">Commission Split (%)</Label>
                  {isEditing ? (
                    <Input
                      id="commission_split"
                      name="commission_split"
                      type="number"
                      value={proposal.commission_split ?? ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{proposal.commission_split || 0}%</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contract_term_months">Contract Term (months)</Label>
                  {isEditing ? (
                    <Input
                      id="contract_term_months"
                      name="contract_term_months"
                      type="number"
                      value={proposal.contract_term_months ?? ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{proposal.contract_term_months || 0}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="placement_fee">Placement Fee</Label>
                  {isEditing ? (
                    <Input
                      id="placement_fee"
                      name="placement_fee"
                      type="number"
                      value={proposal.placement_fee ?? ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      ${proposal.placement_fee?.toLocaleString() || 0}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {proposal.pdf_url && (
            <Card>
              <CardHeader>
                <CardTitle>Proposal Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  src={proposal.pdf_url}
                  className="w-full h-96 border border-gray-200 rounded"
                  title="Proposal Preview"
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent>
              {lead ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Lead information not available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposal Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={proposal.status === 'draft' ? 'default' : proposal.status === 'sent' ? 'secondary' : 'outline'}>
                    {proposal.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm text-gray-600">
                    {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {proposal.sent_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sent</span>
                    <span className="text-sm text-gray-600">
                      {new Date(proposal.sent_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {proposal.viewed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Viewed</span>
                    <span className="text-sm text-gray-600">
                      {new Date(proposal.viewed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {proposal.signed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Signed</span>
                    <span className="text-sm text-gray-600">
                      {new Date(proposal.signed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProposalBuilder;