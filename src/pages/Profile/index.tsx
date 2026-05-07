import { motion } from 'framer-motion';
import { useTelegram } from '@/shared/hooks/useTelegram';
import { Bell, Star, Shield, ChevronRight } from 'lucide-react';

export const Profile = () => {
  const { user, triggerHaptic } = useTelegram();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <header>
        <h2 className="text-2xl font-black">Профиль</h2>
        <p className="text-tg-hint text-xs">Управление аккаунтом</p>
      </header>

      {/* Карточка пользователя */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center mt-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-tg-link to-blue-500 flex items-center justify-center text-white text-4xl font-black shadow-[0_0_20px_rgba(0,242,254,0.3)] mb-4">
          {user?.first_name?.charAt(0) || 'F'}
        </div>
        <h3 className="text-xl font-bold">{user?.first_name || 'Рыбак'} {user?.last_name || ''}</h3>
        <p className="text-tg-hint text-sm mt-1">ID: {user?.id || 'PRO-User'}</p>
        <div className="mt-4 px-4 py-1.5 bg-tg-button/20 text-tg-button rounded-full text-[10px] font-black uppercase tracking-widest border border-tg-button/30">
          Premium Аккаунт
        </div>
      </div>

      {/* Меню настроек */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl space-y-1">
        <button 
          onClick={() => triggerHaptic('light')}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-tg-link" />
            <span className="font-medium text-sm">Уведомления о клеве</span>
          </div>
          {/* iOS Toggle switch UI */}
          <div className="w-10 h-6 bg-tg-button rounded-full relative shadow-[0_0_10px_rgba(0,242,254,0.5)]">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </button>

        <button 
          onClick={() => triggerHaptic('light')}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Star size={18} className="text-fish-peaceful" />
            <span className="font-medium text-sm">Избранные места</span>
          </div>
          <span className="text-tg-hint text-sm font-bold bg-white/5 px-3 py-1 rounded-full">0</span>
        </button>

        <button 
          onClick={() => triggerHaptic('light')}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-tg-hint" />
            <span className="font-medium text-sm text-tg-hint">Политика конф.</span>
          </div>
          <ChevronRight size={16} className="text-tg-hint opacity-50" />
        </button>
      </div>
    </motion.div>
  );
};
