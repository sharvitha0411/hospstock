import React from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-sm text-slate-900">Role-Based Access Control (RBAC)</h2>
              <p className="text-[11px] text-slate-500">Select an operational stakeholder persona</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Persona Choices */}
        <div className="p-5 space-y-2.5 max-h-[65vh] overflow-y-auto">
          <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-900 text-xs font-medium flex items-center justify-between">
            <span>Choose any of the 10 demo accounts:</span>
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-teal-300 font-bold">
              Password: demo-password
            </span>
          </div>

          {DEMO_USERS.map((user) => {
            const isSelected = user.id === currentUser.id;

            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{user.name}</h4>
                      {isSelected && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-teal-600 text-white">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{user.roleTitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-full inline-block">
                        {user.role.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-mono">
            <Lock className="w-3 h-3 text-slate-400" /> JWT Bearer Verified
          </span>
          <span className="text-teal-700 font-semibold">RBAC Security v2.4</span>
        </div>
      </div>
    </div>
  );
};
