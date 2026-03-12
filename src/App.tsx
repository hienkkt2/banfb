import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  X,
  CreditCard,
  MessageCircle,
  Facebook,
  ChevronRight,
  Copy,
  HelpCircle,
  BookOpen,
  Info,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BUYING_GUIDE, 
  WARRANTY_POLICY, 
  FAQS 
} from './constants';
import { AccountItem, PurchaseInfo } from './types';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function App() {
  const [products, setProducts] = useState<AccountItem[]>([]);
  const [warrantyPolicy, setWarrantyPolicy] = useState<{title: string, detail: string}[]>([]);
  const [zaloPhone, setZaloPhone] = useState('0943304685');
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<'guide' | 'warranty' | 'faq' | 'admin' | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [paymentStep, setPaymentStep] = useState<'info' | 'qr' | 'success'>('info');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<AccountItem> | null>(null);
  const [editingWarranty, setEditingWarranty] = useState<{title: string, detail: string}[] | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchWarranty();
    fetchZaloPhone();
  }, []);

  const fetchZaloPhone = async () => {
    try {
      const res = await fetch('/api/settings/zalo_phone');
      const data = await res.json();
      if (data.value) setZaloPhone(data.value);
    } catch (error) {
      console.error('Failed to fetch Zalo phone', error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWarranty = async () => {
    try {
      const res = await fetch('/api/settings/warranty_policy');
      const data = await res.json();
      if (data.value) setWarrantyPolicy(data.value);
    } catch (error) {
      console.error('Failed to fetch warranty policy', error);
    }
  };

  const handleBuyClick = (account: AccountItem) => {
    setSelectedAccount(account);
    setPurchaseQuantity(1);
    setPaymentStep('info');
    setIsPaymentModalOpen(true);
  };

  const handleConfirmInfo = () => {
    setPaymentStep('qr');
  };

  const handleConfirmPayment = () => {
    setPaymentStep('success');
  };

  const getZaloMessage = () => {
    return `Chào Admin, tôi đã thanh toán mua:
- Sản phẩm: ${selectedAccount?.name}
- Số lượng: ${purchaseQuantity}
- Tổng tiền: ${formatPrice((selectedAccount?.price || 0) * purchaseQuantity)}
Vui lòng kiểm tra và gửi tài khoản cho tôi.`;
  };

  const handleCopyAndContact = () => {
    const message = getZaloMessage();
    navigator.clipboard.writeText(message).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        window.open(`https://zalo.me/${zaloPhone}`, '_blank');
      }, 1000);
    });
  };

  // Admin Functions
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') { // Simple password for demo
      setIsAdminAuthenticated(true);
    } else {
      alert('Sai mật khẩu!');
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    const method = editingProduct.id ? 'PUT' : 'POST';
    const url = editingProduct.id ? `/api/products/${editingProduct.id}` : '/api/products';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleSaveWarranty = async () => {
    if (!editingWarranty) return;
    try {
      const res = await fetch('/api/settings/warranty_policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: editingWarranty })
      });
      if (res.ok) {
        setWarrantyPolicy(editingWarranty);
        setEditingWarranty(null);
        alert('Đã cập nhật chính sách bảo hành!');
      }
    } catch (error) {
      console.error('Failed to save warranty policy', error);
    }
  };

  const handleSaveZaloPhone = async (newPhone: string) => {
    try {
      const res = await fetch('/api/settings/zalo_phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newPhone })
      });
      if (res.ok) {
        setZaloPhone(newPhone);
        alert('Đã cập nhật số Zalo!');
      }
    } catch (error) {
      console.error('Failed to save Zalo phone', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const renderInfoModal = () => {
    if (!activeInfoModal) return null;

    if (activeInfoModal === 'admin') {
      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveInfoModal(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <Settings className="text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">Quản lý sản phẩm</h3>
              </div>
              <button onClick={() => setActiveInfoModal(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminLogin} className="max-w-sm mx-auto space-y-4 py-10">
                  <div className="text-center mb-6">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="text-gray-400" />
                    </div>
                    <h4 className="font-bold text-gray-900">Yêu cầu đăng nhập</h4>
                    <p className="text-sm text-gray-500">Vui lòng nhập mật khẩu Admin để tiếp tục</p>
                  </div>
                  <input 
                    type="password" 
                    placeholder="Mật khẩu (admin123)" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Đăng nhập
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-900">Danh sách sản phẩm</h4>
                    <button 
                      onClick={() => setEditingProduct({ name: '', description: '', price: 0, quantity: 0, warranty: '', category: 'Via' })}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                    >
                      <Plus size={16} /> Thêm sản phẩm
                    </button>
                  </div>

                  {editingProduct && (
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                      <h5 className="font-bold text-blue-900">{editingProduct.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Tên sản phẩm" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                          <option value="Via">Via</option>
                          <option value="Clone">Clone</option>
                          <option value="BM">BM</option>
                          <option value="Page">Page</option>
                        </select>
                        <input type="number" placeholder="Giá" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        <input type="number" placeholder="Số lượng" value={editingProduct.quantity} onChange={e => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value)})} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        <input placeholder="Bảo hành" value={editingProduct.warranty} onChange={e => setEditingProduct({...editingProduct, warranty: e.target.value})} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm md:col-span-2" />
                        <textarea placeholder="Mô tả" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm md:col-span-2 h-20" />
                      </div>
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setEditingProduct(null)} className="text-gray-500 text-sm font-medium">Hủy</button>
                        <button onClick={handleSaveProduct} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                          <Save size={16} /> Lưu lại
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-bold text-gray-500">Tên</th>
                          <th className="px-4 py-3 font-bold text-gray-500">Giá</th>
                          <th className="px-4 py-3 font-bold text-gray-500">Kho</th>
                          <th className="px-4 py-3 font-bold text-gray-500 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 font-medium">{p.name}</td>
                            <td className="px-4 py-3">{formatPrice(p.price)}</td>
                            <td className="px-4 py-3">{p.quantity}</td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <button onClick={() => setEditingProduct(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <div className="mb-8">
                      <h4 className="font-bold text-gray-900 mb-4">Cấu hình Zalo nhận đơn</h4>
                      <div className="flex gap-4 items-end bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <div className="flex-1">
                          <label className="text-xs font-bold text-blue-900 block mb-2 uppercase">Số điện thoại Zalo</label>
                          <input 
                            type="text" 
                            value={zaloPhone} 
                            onChange={(e) => setZaloPhone(e.target.value)}
                            className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số điện thoại Zalo"
                          />
                        </div>
                        <button 
                          onClick={() => handleSaveZaloPhone(zaloPhone)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                          <Save size={16} /> Lưu Zalo
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 italic">* Số điện thoại này dùng để khách hàng liên hệ và nhận link Zalo khi thanh toán xong.</p>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-900">Chỉnh sửa chính sách bảo hành</h4>
                      {!editingWarranty && (
                        <button 
                          onClick={() => setEditingWarranty([...warrantyPolicy])}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                        >
                          <Edit2 size={16} /> Chỉnh sửa
                        </button>
                      )}
                    </div>

                    {editingWarranty ? (
                      <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        {editingWarranty.map((item, idx) => (
                          <div key={idx} className="space-y-2 pb-4 border-b border-gray-200 last:border-0">
                            <div className="flex justify-between">
                              <label className="text-xs font-bold text-gray-500">Mục {idx + 1}</label>
                              <button onClick={() => setEditingWarranty(editingWarranty.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                            </div>
                            <input 
                              placeholder="Tiêu đề" 
                              value={item.title} 
                              onChange={e => {
                                const newW = [...editingWarranty];
                                newW[idx].title = e.target.value;
                                setEditingWarranty(newW);
                              }} 
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" 
                            />
                            <textarea 
                              placeholder="Chi tiết" 
                              value={item.detail} 
                              onChange={e => {
                                const newW = [...editingWarranty];
                                newW[idx].detail = e.target.value;
                                setEditingWarranty(newW);
                              }} 
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm h-20" 
                            />
                          </div>
                        ))}
                        <div className="flex justify-between pt-2">
                          <button 
                            onClick={() => setEditingWarranty([...editingWarranty, { title: '', detail: '' }])}
                            className="text-blue-600 text-sm font-bold flex items-center gap-1"
                          >
                            <Plus size={16} /> Thêm mục mới
                          </button>
                          <div className="flex gap-3">
                            <button onClick={() => setEditingWarranty(null)} className="text-gray-500 text-sm font-medium">Hủy</button>
                            <button onClick={handleSaveWarranty} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                              <Save size={16} /> Lưu chính sách
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-500 italic">
                        Nhấn nút "Chỉnh sửa" để thay đổi nội dung chính sách bảo hành hiển thị cho khách hàng.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    const content = {
      guide: { title: 'Hướng dẫn mua hàng', icon: <BookOpen className="text-blue-600" />, data: BUYING_GUIDE },
      warranty: { title: 'Chính sách bảo hành', icon: <ShieldCheck className="text-green-600" />, data: warrantyPolicy },
      faq: { title: 'Câu hỏi thường gặp', icon: <HelpCircle className="text-orange-600" />, data: FAQS }
    }[activeInfoModal as any] as any;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveInfoModal(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[80vh] flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-3">
              {content.icon}
              <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            </div>
            <button onClick={() => setActiveInfoModal(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 overflow-y-auto">
            {activeInfoModal === 'guide' && (
              <div className="space-y-8">
                {BUYING_GUIDE.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeInfoModal === 'warranty' && (
              <div className="space-y-6">
                {warrantyPolicy.map((item, idx) => (
                  <div key={idx} className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                    <h4 className="font-bold text-green-900 mb-1 flex items-center gap-2">
                      <CheckCircle2 size={16} /> {item.title}
                    </h4>
                    <p className="text-green-800/80 text-sm whitespace-pre-line">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
            {activeInfoModal === 'faq' && (
              <div className="space-y-6">
                {FAQS.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                      <span className="text-orange-500 font-black">Q:</span> {item.q}
                    </h4>
                    <p className="text-gray-600 text-sm pl-6">
                      <span className="text-green-600 font-bold mr-2">A:</span> {item.a}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Facebook className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900">FB ADS STORE</h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-blue-600 transition-colors">Trang chủ</button>
            <button onClick={() => setActiveInfoModal('warranty')} className="hover:text-blue-600 transition-colors">Bảo hành</button>
            <button onClick={() => setActiveInfoModal('guide')} className="hover:text-blue-600 transition-colors">Hướng dẫn</button>
            <a href={`https://zalo.me/${zaloPhone}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
              <MessageCircle size={16} /> Liên hệ Zalo
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center md:text-left">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
            Hệ Thống Bán Tài Khoản <span className="text-blue-600">Facebook Ads</span> Tự Động
          </motion.h2>
          <p className="text-gray-600 max-w-2xl text-lg mb-6">
            Cung cấp Via, Clone, BM chất lượng cao, đã qua kiểm duyệt. Hệ thống thanh toán tự động, nhận hàng ngay lập tức.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-red-800 space-y-1">
                <p className="font-bold uppercase">Thông báo quan trọng:</p>
                <p>• Hệ thống sẽ tự động xoá dữ liệu đơn hàng sau 7 ngày, vui lòng tự backup dữ liệu.</p>
                <p>• KHÁCH HÀNG VUI LÒNG ĐỌC KĨ THÔNG TIN SẢN PHẨM VÀ CHÍNH SÁCH BẢO HÀNH TRƯỚC KHI MUA HÀNG.</p>
                <p>• Site không bảo hành via login die 282 180 ngày (bảo hành die từ trước &lt;180 ngày).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Warranty Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-blue-600 p-3 rounded-full text-white"><ShieldCheck size={32} /></div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-1">Chế độ bảo hành chuyên nghiệp</h3>
            <p className="text-blue-800/80 text-sm">Bảo hành sai pass, checkpoint khi login lần đầu. Hỗ trợ kỹ thuật 24/7 qua Zalo. Cam kết 1 đổi 1 nếu lỗi do hệ thống.</p>
          </div>
          <div className="md:ml-auto">
            <button onClick={() => setActiveInfoModal('warranty')} className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm border border-blue-200 hover:bg-blue-50 transition-colors">
              Xem chi tiết chính sách
            </button>
          </div>
        </div>

        {/* Account Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-bottom border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mô tả sản phẩm</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Đơn giá</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bảo hành</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Đang tải sản phẩm...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Chưa có sản phẩm nào.</td></tr>
                ) : products.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{account.name}</span>
                        <span className="text-sm text-gray-500 mt-1 line-clamp-1">{account.description}</span>
                        <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 w-fit">{account.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-sm font-semibold ${account.quantity > 10 ? 'text-green-600' : 'text-orange-600'}`}>{account.quantity} cái</span>
                    </td>
                    <td className="px-6 py-5"><span className="font-bold text-blue-600">{formatPrice(account.price)}</span></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><CheckCircle2 size={14} className="text-green-500" /><span>{account.warranty}</span></div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => handleBuyClick(account)} disabled={account.quantity === 0} className={`px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${account.quantity > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                        {account.quantity > 0 ? 'Mua ngay' : 'Hết hàng'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4"><Facebook className="text-blue-600 w-6 h-6" /><span className="text-xl font-bold text-blue-900">FB ADS STORE</span></div>
            <p className="text-gray-500 text-sm leading-relaxed">Hệ thống cung cấp tài khoản Facebook Ads uy tín hàng đầu Việt Nam. Chúng tôi cam kết mang lại giá trị tốt nhất cho nhà quảng cáo.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><button onClick={() => setActiveInfoModal('guide')} className="hover:text-blue-600">Hướng dẫn mua hàng</button></li>
              <li><button onClick={() => setActiveInfoModal('warranty')} className="hover:text-blue-600">Chính sách bảo hành</button></li>
              <li><button onClick={() => setActiveInfoModal('faq')} className="hover:text-blue-600">Câu hỏi thường gặp</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h4>
            <div className="flex flex-col gap-3">
              <a href={`https://zalo.me/${zaloPhone}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"><MessageCircle size={18} className="text-blue-500" />Zalo: {zaloPhone}</a>
              <p className="text-sm text-gray-600">Thời gian làm việc: 08:00 - 23:00</p>
              <button onClick={() => setActiveInfoModal('admin')} className="flex items-center gap-2 text-xs text-gray-300 hover:text-gray-500 transition-colors mt-4"><Settings size={14} /> Quản trị viên</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">© 2026 FB ADS STORE. All rights reserved.</div>
      </footer>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && selectedAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPaymentModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3"><ShoppingCart size={24} /><h3 className="text-xl font-bold">Thanh toán đơn hàng</h3></div>
                <button onClick={() => setIsPaymentModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <div className="p-8">
                {paymentStep === 'info' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">Sản phẩm đã chọn</p>
                      <p className="font-bold text-gray-900">{selectedAccount.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatPrice(selectedAccount.price)} / cái</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng cần mua</label>
                      <div className="flex items-center gap-4">
                        <input type="number" min="1" max={selectedAccount.quantity} value={purchaseQuantity} onChange={(e) => setPurchaseQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                        <span className="text-sm text-gray-400">Tối đa: {selectedAccount.quantity}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-6"><span className="text-gray-500">Tổng thanh toán:</span><span className="text-2xl font-black text-blue-600">{formatPrice(selectedAccount.price * purchaseQuantity)}</span></div>
                      <button onClick={handleConfirmInfo} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">Tiếp tục thanh toán</button>
                    </div>
                  </div>
                )}
                {paymentStep === 'qr' && (
                  <div className="text-center space-y-6">
                    <div className="inline-block p-4 bg-white border-2 border-blue-100 rounded-3xl shadow-inner">
                      <img src={`https://quickchart.io/qr?text=STK:8396869395-NganHang:Techcombank-Amount:${selectedAccount.price * purchaseQuantity}&size=250`} alt="Payment QR Code" className="w-64 h-64" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 font-medium">Ngân hàng: <span className="text-gray-900 font-bold">Techcombank</span></p>
                      <p className="text-sm text-gray-500 font-medium">Số tài khoản: <span className="text-gray-900 font-bold">8396869395</span></p>
                      <p className="text-lg font-bold text-gray-900">Số tiền: {formatPrice(selectedAccount.price * purchaseQuantity)}</p>
                      <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-center gap-2 text-left">
                        <AlertCircle size={18} className="text-orange-500 shrink-0" /><p className="text-xs text-orange-800">Nội dung: <span className="font-bold">MUA {selectedAccount.id} {purchaseQuantity}</span></p>
                      </div>
                    </div>
                    <div className="pt-4 space-y-3">
                      <button onClick={handleConfirmPayment} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-[0.98] flex items-center justify-center gap-2"><CheckCircle2 size={20} />Tôi đã thanh toán</button>
                      <button onClick={() => setPaymentStep('info')} className="w-full text-gray-400 py-2 font-medium text-sm hover:text-gray-600">Quay lại chỉnh sửa</button>
                    </div>
                  </div>
                )}
                {paymentStep === 'success' && (
                  <div className="text-center py-6 space-y-8">
                    <div className="flex justify-center"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="bg-green-100 p-6 rounded-full text-green-600"><CheckCircle2 size={64} /></motion.div></div>
                    <div className="space-y-2"><h4 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h4><p className="text-gray-500">Hệ thống đã ghi nhận đơn hàng.</p></div>
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-left space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-blue-900">Thông báo đơn hàng:</p>
                        <button onClick={() => { navigator.clipboard.writeText(getZaloMessage()); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="text-xs flex items-center gap-1 text-blue-600 hover:underline"><Copy size={12} /> {isCopied ? 'Đã copy' : 'Copy mẫu'}</button>
                      </div>
                      <div className="bg-white/50 p-3 rounded-xl text-xs text-blue-800 font-mono whitespace-pre-line border border-blue-100">{getZaloMessage()}</div>
                      <button onClick={handleCopyAndContact} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200">{isCopied ? <CheckCircle2 size={24} /> : <MessageCircle size={24} />}{isCopied ? 'Đã copy & Mở Zalo' : 'Copy & Nhận tài khoản'}</button>
                    </div>
                    <p className="text-xs text-gray-400 italic">* Nhấn nút trên để tự động copy thông tin và mở Zalo Admin.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Modals */}
      <AnimatePresence>{renderInfoModal()}</AnimatePresence>
    </div>
  );
}
