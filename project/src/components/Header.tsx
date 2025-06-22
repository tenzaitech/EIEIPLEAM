import React, { useState } from 'react';
import { Search, Bell, Settings, User, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder={t('common.search') + '...'}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Help Button */}
          <div className="relative">
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="relative p-2.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
              title="ความช่วยเหลือ"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            
            {showHelp && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 p-4 z-50">
                <h3 className="font-semibold text-neutral-900 mb-3">คู่มือการใช้งานด่วน</h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>ใช้แถบค้นหาเพื่อหาข้อมูลได้ทุกหน้า</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>คลิกปุ่ม "เพิ่ม" เพื่อสร้างข้อมูลใหม่</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>ใช้ตัวกรองเพื่อแสดงข้อมูลที่ต้องการ</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>เปลี่ยนภาษาได้ที่มุมขวาบน</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 text-neutral-400 hover:text-warning-600 hover:bg-warning-50 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
          </button>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Settings */}
          <button className="p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-neutral-200"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.role}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
                <button className="flex items-center space-x-3 w-full px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <User className="w-4 h-4" />
                  <span>{t('user.profile')}</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>{t('user.settings')}</span>
                </button>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2.5 text-left text-sm text-error-600 hover:bg-error-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('user.logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}