'use client';

import { useState } from 'react';
import { useDashboard, ACCOUNTS } from '../context';

export default function SettingsPage() {
  const { user } = useDashboard();
  const [tab, setTab] = useState('profile');
  const [twoFactor, setTwoFactor] = useState(true);
  const [notifs, setNotifs] = useState({ email: true, sms: true, push: false, marketing: false });

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'preferences', label: 'Preferences' },
  ];

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} className={`w-11 h-6 rounded-full cursor-pointer transition-all relative ${on ? 'bg-navy-900' : 'bg-gray-300'}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </div>
  );

  return (
    <div className="grid grid-cols-[220px_1fr] gap-7 max-lg:grid-cols-1">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-fit">
        {tabs.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-3 text-sm cursor-pointer transition-all border-l-[3px] ${tab === t.id ? 'bg-navy-900/5 text-navy-700 border-navy-700 font-medium' : 'text-gray-600 border-transparent hover:bg-gray-50'}`}>{t.label}</div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-7 max-md:p-5">
        {tab === 'profile' && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3.5 border-b border-gray-100">Personal Information</h3>
            {[
              ['Full Name', `${user.first_name} ${user.last_name}`],
              ['Email Address', user.email],
              ['Phone Number', '***-***-4521'],
              ['Mailing Address', '**** Oak Street, City, ST 00000'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3.5 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-600">{label}</div>
                <div className="text-sm font-medium text-gray-800">{value}</div>
              </div>
            ))}
          </>
        )}

        {tab === 'security' && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3.5 border-b border-gray-100">Security Settings</h3>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div><div className="text-sm font-medium text-gray-600">Two-Factor Authentication</div><div className="text-xs text-gray-400 mt-0.5">Extra security layer for your account</div></div>
              <Toggle on={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div><div className="text-sm font-medium text-gray-600">Password</div><div className="text-xs text-gray-400 mt-0.5">Last changed 45 days ago</div></div>
              <button className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50">Change</button>
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div><div className="text-sm font-medium text-gray-600">Login Alerts</div><div className="text-xs text-gray-400 mt-0.5">Get notified on login</div></div>
              <Toggle on={true} onToggle={() => {}} />
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div><div className="text-sm font-medium text-gray-600">Active Sessions</div><div className="text-xs text-gray-400 mt-0.5">2 devices signed in</div></div>
              <button className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer font-sans hover:bg-gray-50">Manage</button>
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
              { key: 'marketing', label: 'Marketing', desc: 'Offers and product updates' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-none">
                <div><div className="text-sm font-medium text-gray-600">{item.label}</div><div className="text-xs text-gray-400 mt-0.5">{item.desc}</div></div>
                <Toggle on={(notifs as any)[item.key]} onToggle={() => setNotifs(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))} />
              </div>
            ))}
          </>
        )}

        {tab === 'preferences' && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-5 pb-3.5 border-b border-gray-100">Account Preferences</h3>
            {[
              ['Default Account', <select key="da" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">{ACCOUNTS.filter(a => a.type === 'checking').map(a => <option key={a.id}>{a.name}</option>)}</select>],
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
    </div>
  );
}
