'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bot, RefreshCw, CheckCircle, Bell, Moon, Sun, Monitor, Key, Save, Zap, Globe, Languages } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    dailyBriefing: true,
    riskAlerts: true,
    retentionAlerts: true,
  });
  
  const [aiMode, setAIMode] = useState<'mock' | 'openai'>('openai');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleSaveSettings = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('crm_settings', JSON.stringify({
      theme,
      aiMode,
      language,
      notifications,
    }));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>
          <p className="text-slate-500 mt-1">
            {language === 'vi' ? 'Cấu hình AI CRM Assistant' : 'Configure your AI CRM Assistant'}
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving} className="flex items-center gap-2">
          {saving ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> {language === 'vi' ? 'Đang lưu...' : 'Saving...'}</>
          ) : saved ? (
            <><CheckCircle className="w-4 h-4" /> {language === 'vi' ? 'Đã lưu!' : 'Saved!'}</>
          ) : (
            <><Save className="w-4 h-4" /> {t('app.save')}</>
          )}
        </Button>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-sky-600" />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-sky-50 border border-sky-200">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-sky-600" />
              <span className="font-medium text-sky-800">
                {language === 'vi' ? 'Ngôn ngữ hiện tại' : 'Current Language'}
              </span>
            </div>
            <p className="text-sm text-sky-700">
              {language === 'vi' 
                ? 'Hệ thống đang sử dụng Tiếng Việt. Chuyển đổi giữa Tiếng Việt và Tiếng Anh.'
                : 'System is using English. Switch between English and Vietnamese.'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('vi')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                language === 'vi' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {language === 'vi' && <CheckCircle className="w-5 h-5 text-sky-600" />}
                <span className="font-medium">🇻🇳 Tiếng Việt</span>
              </div>
              <p className="text-sm text-slate-500">
                {language === 'vi' ? 'Đang sử dụng' : 'Vietnamese'}
              </p>
            </button>
            
            <button
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                language === 'en' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {language === 'en' && <CheckCircle className="w-5 h-5 text-sky-600" />}
                <span className="font-medium">🇬🇧 English</span>
              </div>
              <p className="text-sm text-slate-500">
                {language === 'en' ? 'Đang sử dụng' : 'English'}
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* AI Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-sky-600" />
            AI Assistant Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            aiMode === 'mock' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {aiMode === 'mock' ? (
                <><Badge variant="warning">{language === 'vi' ? 'Chế độ Mock' : 'Mock Mode'}</Badge></>
              ) : (
                <><Badge variant="success" className="flex items-center gap-1"><Zap className="w-3 h-3" /> {language === 'vi' ? 'OpenAI Mode' : 'OpenAI Mode'}</Badge></>
              )}
            </div>
            <p className="text-sm text-slate-600">
              {aiMode === 'mock' 
                ? (language === 'vi' ? 'Mock Mode dùng phản hồi rule-based cho demo.' : 'Mock Mode uses rule-based responses for demonstration.')
                : (language === 'vi' ? 'OpenAI Mode dùng GPT-4 để phản hồi thông minh.' : 'OpenAI Mode uses GPT-4 for intelligent responses.')}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-slate-600" />
              <span className="font-medium text-slate-800">API Key</span>
              <Badge variant="success">{language === 'vi' ? 'Đã cấu hình' : 'Configured'}</Badge>
            </div>
            <p className="text-sm text-slate-600">
              {language === 'vi' 
                ? 'OpenAI API key được cấu hình trong biến môi trường (bảo mật server).'
                : 'OpenAI API key is configured in environment variables (server-side secured).'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setAIMode('mock')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                aiMode === 'mock' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {aiMode === 'mock' && <CheckCircle className="w-5 h-5 text-sky-600" />}
                <span className="font-medium">{language === 'vi' ? 'Mock Mode' : 'Mock Mode'}</span>
              </div>
              <p className="text-sm text-slate-500">{language === 'vi' ? 'Rule-based simulation' : 'Rule-based simulation'}</p>
            </button>
            
            <button
              onClick={() => setAIMode('openai')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                aiMode === 'openai' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {aiMode === 'openai' && <CheckCircle className="w-5 h-5 text-sky-600" />}
                <span className="font-medium flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" /> {language === 'vi' ? 'OpenAI Mode' : 'OpenAI Mode'}
                </span>
              </div>
              <p className="text-sm text-slate-500">GPT-4</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            {t('settings.notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email', label: language === 'vi' ? 'Thông báo Email' : 'Email Notifications', desc: language === 'vi' ? 'Nhận tổng hợp hàng ngày' : 'Receive daily summary' },
            { key: 'push', label: language === 'vi' ? 'Thông báo Push' : 'Push Notifications', desc: language === 'vi' ? 'Thông báo trình duyệt' : 'Browser notifications' },
            { key: 'dailyBriefing', label: language === 'vi' ? 'Tin tức hàng ngày' : 'Daily Briefing', desc: language === 'vi' ? 'Tin tức AI buổi sáng' : 'AI morning briefing' },
            { key: 'riskAlerts', label: language === 'vi' ? 'Cảnh báo rủi ro' : 'Risk Alerts', desc: language === 'vi' ? 'Khách hàng rủi ro cao' : 'High-risk customers' },
            { key: 'retentionAlerts', label: language === 'vi' ? 'Cảnh báo giữ chân' : 'Retention Alerts', desc: language === 'vi' ? 'Rủi ro churn' : 'Churn risk' },
          ].map((item, idx) => (
            <div key={item.key} className={`flex items-center justify-between py-3 ${idx < 4 ? 'border-b border-slate-100' : ''}`}>
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-sky-500' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform absolute top-0.5 ${
                  notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-600" />
            {t('settings.theme')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { mode: 'light' as const, icon: Sun, label: language === 'vi' ? 'Sáng' : 'Light' },
              { mode: 'dark' as const, icon: Moon, label: language === 'vi' ? 'Tối' : 'Dark' },
              { mode: 'system' as const, icon: Monitor, label: language === 'vi' ? 'Hệ thống' : 'System' },
            ].map((item) => (
              <button
                key={item.mode}
                onClick={() => setTheme(item.mode)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === item.mode ? 'border-sky-500 bg-sky-50 dark:bg-sky-900' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <item.icon className={`w-6 h-6 mx-auto mb-2 ${theme === item.mode ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-sm font-medium block text-center">{item.label}</span>
                {theme === item.mode && (
                  <span className="text-xs text-sky-600 block text-center mt-1">✓</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.about')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p><strong>OceanBank AI CRM Assistant</strong></p>
          <p>Version 1.0.0</p>
          <p className="pt-2">
            {language === 'vi' 
              ? 'Prototype khóa luận tốt nghiệp minh họa trợ lý AI nội bộ hỗ trợ RM trong CRM ngân hàng.'
              : 'Academic graduation thesis prototype for AI CRM Assistant.'}
          </p>
          <p className="pt-2 text-amber-600">
            ⚠️ {language === 'vi' ? 'Prototype mô phỏng. Không có quyết định ngân hàng thực.' : 'Simulation prototype. No real banking decisions.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
