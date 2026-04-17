'use client';

import { useState } from 'react';
import { useDashboard } from '../context';
import OtpModal from '@/components/OtpModal';

export default function SettingsPage() {
  const { user, accounts, refreshData } = useDashboard();
  const [tab, setTab] = useState('profile');
  const [twoFactor, setTwoFactor] = useState(true);
  const [notifs, setNotifs] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('meridian_notif_prefs');
      if (saved) try { return JSON.parse(saved); } catch {}
    }
    return { email: true, sms: true, push: false, marketing: false };
  });

  const updateNotif = (key: string) => {
    setNotifs((prev: any) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('meridian_notif_prefs', JSON.stringify(updated));
      return updated;
    });
  };

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [city, setCity] = useState(user.city || '');
  const [state, setState] = useState(user.state || '');
  const [zip, setZip] = useState(user.zip || '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // OTP state
  const [showOtp, setShowOtp] = useState(false);
  const [otpAction, setOtpAction] = useState('');
  const [otpLabel, setOtpLabel] = useState('');
  const [otpDetails, setOtpDetails] = useState('');
  const [pendingCallback, setPendingCallback] = useState<(() => Promise<void>) | null>(null);

  const requestOtp = (action: string, label: string, details: string, callback: () => Promise<void>) => {
    setOtpAction(action);
    setOtpLabel(label);
    setOtpDetails(details);
    setPendingCallback(() => callback);
    setShowOtp(true);
  };

  const handleOtpVerified = async () => {
    setShowOtp(false);
    if (pendingCallback) await pendingCallback();
    setPendingCallback(null);
  };

  // Profile save (after OTP)
  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/dashboard/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, address, city, state, zip }) });
      if (res.ok) { setSaveMsg('Profile updated!'); setEditing(false); await refreshData(); setTimeout(() => setSaveMsg(''), 3000); }
    } catch {}
    setSaving(false);
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} className={`w-11 h-6 rounded-full cursor-pointer transition-all relative ${on ? 'bg-navy-900' : 'bg-gray-300'}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </div>
  );

  const checkingAccounts = accounts.filter(a => a.type === 'checking');

  return (
    <div className="grid grid-cols-[220px_1fr] gap-7 max-lg:grid-cols-1">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-fit">
        {['profile', 'security', 'notifications', 'preferences'].map(t => (
          <div key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm cursor-pointer transition-all border-l-[3px] capitalize ${tab === t ? 'bg-navy-900/5 text-navy-700 border-navy-700 font-medium' : 'text-gray-600 border-transparent hover:bg-gray-50'}`}>{t}</div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-7 max-md:p-5">
        {tab === 'profile' && (
          <>
            <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="px-3 py-1.5 text-xs font-semibold text-accent-500 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50">Edit</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(false); setPhone(user.phone || ''); setAddress(user.address || ''); setCity(user.city || ''); setState(user.state || ''); setZip(user.zip || ''); }} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans">Cancel</button>
                  <button onClick={() => requestOtp('profile_edit', 'save profile changes', `Update phone: ${phone}, address: ${address}, ${city}, ${state} ${zip}`, saveProfile)} disabled={saving} className="px-3 py-1.5 text-xs font-semibold text-white bg-navy-900 border-none rounded-md cursor-pointer font-sans hover:bg-navy-800 disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
                </div>
              )}
            </div>
            {saveMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-2.5 mb-4">{saveMsg}</div>}
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-600">Full Name</div>
              <div className="text-sm font-medium text-gray-800">{user.first_name} {user.last_name}</div>
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-600">Email Address</div>
              <div className="text-sm font-medium text-gray-800">{user.email}</div>
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-600">Phone Number</div>
              {editing ? <input value={phone} onChange={e => setPhone(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md outline-none w-48 focus:border-accent-500" /> : <div className="text-sm font-medium text-gray-800">{user.phone || '—'}</div>}
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-600">Date of Birth</div>
              <div className="text-sm font-medium text-gray-800">{user.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</div>
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-600">Mailing Address</div>
              {editing ? (
                <div className="flex flex-col gap-2 items-end">
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md outline-none w-56 focus:border-accent-500" />
                  <div className="flex gap-2">
                    <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md outline-none w-24 focus:border-accent-500" />
                    <input value={state} onChange={e => setState(e.target.value)} placeholder="ST" maxLength={2} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md outline-none w-14 focus:border-accent-500" />
                    <input value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP" maxLength={5} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md outline-none w-20 focus:border-accent-500" />
                  </div>
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-800">{user.address ? `${user.address}, ${user.city}, ${user.state} ${user.zip}` : '—'}</div>
              )}
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div className="text-sm font-medium text-gray-600">Member ID</div>
              <div className="text-sm font-medium text-gray-800">{user.member_id || '—'}</div>
            </div>
          </>
        )}
        {tab === 'security' && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3.5 border-b border-gray-100">Security Settings</h3>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div><div className="text-sm font-medium text-gray-600">Two-Factor Authentication</div><div className="text-xs text-gray-400 mt-0.5">Extra security layer</div></div>
              <Toggle on={twoFactor} onToggle={() => requestOtp('security_change', `${twoFactor ? 'disable' : 'enable'} two-factor authentication`, `${twoFactor ? 'Disable' : 'Enable'} 2FA`, async () => setTwoFactor(!twoFactor))} />
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div><div className="text-sm font-medium text-gray-600">Password</div><div className="text-xs text-gray-400 mt-0.5">Last changed 45 days ago</div></div>
              <button onClick={() => requestOtp('security_change', 'change password', 'Password change request', async () => { setSaveMsg('Use forgot password to change your password.'); setTimeout(() => setSaveMsg(''), 4000); })} className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50">Change</button>
            </div>
          </>
        )}
        {tab === 'notifications' && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3.5 border-b border-gray-100">Notification Preferences</h3>
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Account alerts via email' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Alerts via text message' },
              { key: 'push', label: 'Push Notifications', desc: 'Alerts on mobile device' },
              { key: 'marketing', label: 'Marketing', desc: 'Offers and updates' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-none">
                <div><div className="text-sm font-medium text-gray-600">{item.label}</div><div className="text-xs text-gray-400 mt-0.5">{item.desc}</div></div>
                <Toggle on={(notifs as any)[item.key]} onToggle={() => updateNotif(item.key)} />
              </div>
            ))}
          </>
        )}
        {tab === 'preferences' && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3.5 border-b border-gray-100">Account Preferences</h3>
            {[
              ['Default Account', <select key="da" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">{checkingAccounts.map(a => <option key={a.id}>{a.name}</option>)}</select>],
              ['Statement Delivery', 'Paperless (Email)'],
              ['Language', 'English (US)'],
              ['Time Zone', 'Eastern Time (ET)'],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-none">
                <div className="text-sm font-medium text-gray-600">{label}</div>
                <div className="text-sm font-medium text-gray-800">{value}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {showOtp && (
        <OtpModal
          email={user.email}
          action={otpAction}
          actionLabel={otpLabel}
          details={otpDetails}
          onVerified={handleOtpVerified}
          onCancel={() => { setShowOtp(false); setPendingCallback(null); }}
        />
      )}
    </div>
  );
}
