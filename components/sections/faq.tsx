'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  content?: {
    title?: string;
    subtitle?: string;
    items?: FAQItem[];
  };
  accentColor?: string;
}

export default function FAQ({ content, accentColor = '#6d28d9' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useI18n();

  const title = content?.title || (t as any).faq?.title || 'Các Câu Hỏi Thường Gặp';
  const subtitle = content?.subtitle || (t as any).faq?.subtitle || 'Giải đáp thắc mắc';
  
  const defaultItems = [
    { question: 'Thời gian hoàn thành đơn?', answer: 'Thông thường khoảng 1-3 ngày tuỳ vào mức rank yêu cầu của bạn.' },
    { question: 'Tài khoản của tôi có an toàn không?', answer: 'An toàn tuyệt đối 100%. Tôi cày tay hoàn toàn, cam kết bảo mật thông tin và không sử dụng tool vi phạm.' },
    { question: 'Làm sao để thanh toán?', answer: 'Sau khi trao đổi qua Discord, bạn sẽ được hướng dẫn chuyển khoản qua Ngân hàng, Momo hoặc Paypal.' },
    { question: 'Tôi có thể theo dõi tiến độ không?', answer: 'Chắc chắn rồi. Bạn có thể nhắn tin trực tiếp để cập nhật điểm số liên tục, hoặc thậm chí yêu cầu tôi stream ẩn qua Discord.' }
  ];

  const faqs = (content?.items?.length ?? 0) > 0 ? content!.items : defaultItems;

  return (
    <section className="py-16 px-4 bg-slate-950">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-slate-400 text-lg">{subtitle}</p>}
        </div>

        <div className="space-y-3">
          {faqs!.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={cn(
                  "rounded-xl overflow-hidden transition-all duration-300 border backdrop-blur-sm",
                  isOpen ? "bg-slate-800/80 shadow-lg shadow-purple-900/10" : "bg-slate-900/40 hover:bg-slate-800/60"
                )}
                style={{ borderColor: isOpen ? `${accentColor}50` : 'rgba(100, 116, 139, 0.2)' }}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span className={cn("font-medium pr-4 transition-colors", isOpen ? "text-white" : "text-slate-300")}>
                    {faq.question}
                  </span>
                  <span 
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
                    style={{ backgroundColor: isOpen ? `${accentColor}20` : 'rgba(51, 65, 85, 0.5)', color: isOpen ? accentColor : '#94a3b8' }}
                  >
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
                  </span>
                </button>
                
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-700/30">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
