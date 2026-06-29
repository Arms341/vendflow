// REFERENCE IMPLEMENTATION — NOT A LOCKED TEMPLATE
// ==================================================
// Admin Settings: company info, branding, color preview, legal, notifications
// Route: /admin/settings (AdminRoute)
// Hooks: useCompany(), useUpdateCompany()
// Do NOT import or deploy this file.
// ==================================================
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { useCompany, useUpdateCompany } from '@/hooks/useCompany';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface CompanyForm {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  disclaimer_text: string;
  order_notification_email: string;
}

export default function AdminSettings() {
  const { isAdmin } = useAuth();
  const { data: company, isLoading } = useCompany();
  const updateCompany = useUpdateCompany();
  const [form, setForm] = useState<CompanyForm>({
    name: '', tagline: '', phone: '', email: '', website: '', address: '',
    logo_url: '', primary_color: '1D4ED8', secondary_color: '059669',
    disclaimer_text: '', order_notification_email: '',
  });

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name ?? '',
        tagline: company.tagline ?? '',
        phone: company.phone ?? '',
        email: company.email ?? '',
        website: company.website ?? '',
        address: company.address ?? '',
        logo_url: company.logo_url ?? '',
        primary_color: company.primary_color ?? '1D4ED8',
        secondary_color: company.secondary_color ?? '059669',
        disclaimer_text: company.disclaimer_text ?? '',
        order_notification_email: company.order_notification_email ?? '',
      });
    }
  }, [company]);

  const handleSave = async () => {
    try {
      await updateCompany.mutateAsync(form as unknown as { [key: string]: unknown; id: number; });
      toast.success('Settings saved. Refresh to see brand color changes.');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const update = (field: keyof CompanyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>

      {/* Company Info */}
      <Section title="Company Information">
        <div className="space-y-4">
          <Field label="Company Name" value={form.name} onChange={update('name')} />
          <Field label="Tagline" value={form.tagline} onChange={update('tagline')} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={form.phone} onChange={update('phone')} />
            <Field label="Email" value={form.email} onChange={update('email')} />
          </div>
          <Field label="Website" value={form.website} onChange={update('website')} />
          <Field label="Address" value={form.address} onChange={update('address')} />
        </div>
      </Section>

      {/* Branding */}
      <Section title="Branding">
        <div className="space-y-4">
          <Field label="Logo URL" value={form.logo_url} onChange={update('logo_url')} hint="Direct URL to company logo image" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={`#${form.primary_color}`}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value.replace('#', '') })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value.replace('#', '') })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="1D4ED8"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={`#${form.secondary_color}`}
                  onChange={(e) => setForm({ ...form, secondary_color: e.target.value.replace('#', '') })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.secondary_color}
                  onChange={(e) => setForm({ ...form, secondary_color: e.target.value.replace('#', '') })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="059669"
                />
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="h-10 rounded-lg text-white font-semibold flex items-center justify-center"
                style={{ backgroundColor: `#${form.primary_color}` }}>
                Sample Primary Button
              </div>
              <div className="h-10 rounded-lg text-white font-semibold flex items-center justify-center"
                style={{ backgroundColor: `#${form.secondary_color}` }}>
                Sample Secondary Button
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: `#${form.primary_color}` }} />
              <div className="text-sm" style={{ color: `#${form.primary_color}` }}>
                Sample branded link text
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Legal */}
      <Section title="Legal">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disclaimer Text</label>
          <textarea
            value={form.disclaimer_text}
            onChange={update('disclaimer_text')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            placeholder="This estimate is provided for informational purposes only..."
          />
          <p className="mt-1 text-xs text-gray-400">Shown at the bottom of shared sheets and PDF exports</p>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Field
          label="Order Submission Email"
          value={form.order_notification_email}
          onChange={update('order_notification_email')}
          hint="Email address to receive new order notifications"
        />
      </Section>

      {/* Save button */}
      <div className="sticky bottom-4">
        <button
          onClick={handleSave}
          disabled={updateCompany.isPending}
          className="w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl shadow-lg hover:opacity-95 transition"
          style={{ backgroundColor: 'var(--color-brand)' }}
        >
          <Save size={20} />
          {updateCompany.isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">{title}</h3>
      <div className="bg-white rounded-xl border border-gray-200 p-6">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="text" value={value} onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}