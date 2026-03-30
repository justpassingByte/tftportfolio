'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SettingsTabProps {
  initialUsername: string;
}

export default function SettingsTab({ initialUsername }: SettingsTabProps) {
  const [username, setUsername] = useState(initialUsername);
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update username if changed
      if (username !== initialUsername && username.trim().length > 0) {
        // Validate username format (alphanumeric, lowercase, no spaces)
        if (!/^[a-z0-9_-]+$/.test(username)) {
          throw new Error('Đường dẫn (Username) chỉ được chứa chữ cái viết thường, số, gạch ngang (-) hoặc gạch dưới (_).');
        }

        const { error: profileError } = await supabase
          .from('booster_profiles')
          .update({ username: username.toLowerCase().trim() })
          .eq('user_id', user.id);

        if (profileError) {
          if (profileError.code === '23505') { // Unique violation
            throw new Error('Đường dẫn này đã có người sử dụng, vui lòng chọn tên khác.');
          }
          throw profileError;
        }
      }

      // Update password if provided
      if (newPassword.trim().length > 0) {
        if (newPassword.length < 6) {
          throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
        }

        const { error: authError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (authError) throw authError;
      }

      setStatus({ type: 'success', message: 'Cập nhật cài đặt thành công!' });
      setNewPassword(''); // Clear password field after success
      
      if (username !== initialUsername && username.trim().length > 0) {
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setTimeout(() => setStatus({ type: '', message: '' }), 4000);
      }
      
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Có lỗi xảy ra khi cập nhật.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Cài Đặt Tài Khoản</h2>
        <p className="text-slate-400">Thay đổi đường dẫn Profile hoặc cập nhật mật khẩu đăng nhập tại đây.</p>
      </div>

      <div className="space-y-8 bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        {/* URL Setting */}
        <div>
          <Label className="text-slate-300 text-sm mb-1.5 block font-medium">Đường Dẫn Profile (Username)</Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-slate-800 border border-slate-700 rounded-md overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <span className="px-3 py-2 text-slate-500 bg-slate-800/50 border-r border-slate-700 text-sm whitespace-nowrap">
                tacticianclimb.com/u/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent border-none text-white px-3 py-2 text-sm focus:outline-none focus:ring-0 w-full"
                placeholder="my-cool-name"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Đây là đường dẫn công khai khách hàng sẽ thấy khi bạn gửi link cho họ. Không dùng dấu cách.
          </p>
        </div>

        {/* Password Setting */}
        <div className="pt-6 border-t border-slate-800">
          <Label className="text-slate-300 text-sm mb-1.5 block font-medium">Thay Đổi Mật Khẩu</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white max-w-sm"
            placeholder="Nhập mật khẩu mới (bỏ trống nếu không đổi)"
          />
          <p className="text-xs text-slate-500 mt-2">
            Hệ thống sẽ cập nhật mật khẩu mới của bạn ngay lập tức.
          </p>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 ${
            status.type === 'error' 
              ? 'bg-red-900/20 border border-red-500/20 text-red-400' 
              : 'bg-emerald-900/20 border border-emerald-500/20 text-emerald-400'
          }`}>
            {status.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            {status.message}
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white h-10 px-8 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </Button>
        </div>
      </div>
    </div>
  );
}
