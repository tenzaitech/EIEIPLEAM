import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, ChefHat, Lock, Mail, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function Login() {
  const [email, setEmail] = useState('admin@tenzai.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-neutral-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t('login.title')}</h1>
            <p className="text-neutral-600 text-lg">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('login.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="กรอกอีเมลของคุณ"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('login.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary-500/25"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : t('login.signin')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="bg-neutral-50 rounded-xl p-4">
              <p className="text-sm text-neutral-600 font-medium mb-2">
                {t('login.demo-credentials')}
              </p>
              <p className="text-xs text-neutral-500">
                admin@tenzai.com / admin123
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4">
                <p className="font-semibold text-primary-700 text-sm mb-1">{t('login.admin-access')}</p>
                <p className="text-xs text-primary-600">{t('login.full-control')}</p>
              </div>
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-4">
                <p className="font-semibold text-secondary-700 text-sm mb-1">{t('login.role-based')}</p>
                <p className="text-xs text-secondary-600">{t('login.multi-roles')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-neutral-500 text-sm">
            © 2025 TENZAI Purchasing System. สงวนลิขสิทธิ์
          </p>
        </div>
      </div>
    </div>
  );
}