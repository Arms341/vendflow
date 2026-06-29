import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OperatorWebsite } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function WebsiteBuilder() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<OperatorWebsite[]>({
    queryKey: ['operator_websites'],
    queryFn: () => api.get('/operator_websites/').then((r) => r.data),
  });

  const [website, setWebsite] = useState<OperatorWebsite | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      setWebsite(data[0]);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (website) {
      setWebsite({
        ...website,
        [name]: value,
      });
    }
  };

  const handleToggleChatbot = () => {
    if (website) {
      setWebsite({
        ...website,
        chatbot_enabled: !website.chatbot_enabled,
      });
    }
  };

  const handleSave = async () => {
    if (!website) return;
    
    try {
      await api.post(`/operator_websites/${website.id}/`, website);
      await queryClient.invalidateQueries({ queryKey: ['operator_websites'] });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save website:', err);
    }
  };

  const handlePublish = async () => {
    if (!website) return;
    
    setIsPublishing(true);
    try {
      const updatedWebsite = {
        ...website,
        is_published: true,
      };
      await api.post(`/operator_websites/${website.id}/`, updatedWebsite);
      await queryClient.invalidateQueries({ queryKey: ['operator_websites'] });
      if (website) {
        setWebsite({ ...website, is_published: true });
      }
    } catch (err) {
      console.error('Failed to publish website:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6 text-red-600">Failed to load website data: {String(error)}</div>;
  if (!website) return <div className="p-6">No website data found</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Website Builder</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handlePublish}
            disabled={website.is_published || isPublishing}
            className={`px-4 py-2 rounded-md ${
              website.is_published
                ? 'bg-green-600 text-white'
                : isPublishing
                ? 'bg-gray-400 text-gray-200'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {website.is_published ? 'Published' : isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company_name"
                    value={website.company_name ?? ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{website.company_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tagline</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="tagline"
                    value={website.tagline ?? ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{website.tagline}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={website.phone ?? ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{website.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="email"
                    value={website.email ?? ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{website.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">About</label>
                {isEditing ? (
                  <textarea
                    name="about_text"
                    value={website.about_text ?? ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{website.about_text}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Template & Chatbot</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Template</label>
                {isEditing ? (
                  <select
                    name="template_id"
                    value={website.template_id ?? ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a template</option>
                    <option value="1">Template 1</option>
                    <option value="2">Template 2</option>
                    <option value="3">Template 3</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{website.template_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                {isEditing ? (
                  <input
                    type="color"
                    name="primary_color"
                    value={website.primary_color ?? '#3b82f6'}
                    onChange={handleInputChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1 flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-300 mr-2" 
                      style={{ backgroundColor: website.primary_color ?? '#3b82f6' }}
                    />
                    <span className="text-gray-900">{website.primary_color}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(website.chatbot_enabled)}
                    onChange={handleToggleChatbot}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Chatbot</span>
                </label>
              </div>

              {website.chatbot_enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Chatbot Greeting</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="chatbot_greeting"
                      value={website.chatbot_greeting ?? ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{website.chatbot_greeting}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[200px]">
          <div className="flex items-center mb-4">
            {website.logo_url ? (
              <img src={website.logo_url} alt="Company Logo" className="h-12 w-auto" />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            )}
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900">{website.company_name}</h3>
              <p className="text-gray-600">{website.tagline}</p>
            </div>
          </div>
          <p className="text-gray-700">{website.about_text}</p>
          <div className="mt-4 flex space-x-2">
            {website.phone && (
              <span className="inline-flex items-center text-sm text-gray-600">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {website.phone}
              </span>
            )}
            {website.email && (
              <span className="inline-flex items-center text-sm text-gray-600">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {website.email}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}