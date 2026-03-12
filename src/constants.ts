import { AccountItem } from './types';

export const ACCOUNT_LIST: AccountItem[] = [
  {
    id: '1',
    name: 'Via Việt Cổ - Kháng Ads',
    description: 'Via Việt cổ 2015-2018, đã kháng link 273 hoặc 902, chuyên set camp.',
    price: 150000,
    quantity: 45,
    warranty: 'Bảo hành 24h: Sai pass, checkpoint khi login.',
    category: 'Via'
  },
  {
    id: '2',
    name: 'Via Ngoại (US/PH) - XMDT',
    description: 'Via US hoặc Philippines đã xác minh danh tính, trâu, ít bị quét.',
    price: 220000,
    quantity: 12,
    warranty: 'Bảo hành login lần đầu, 1 đổi 1 nếu lỗi.',
    category: 'Via'
  },
  {
    id: '3',
    name: 'BM50 Kháng - Limit 1m1',
    description: 'Business Manager 50 kháng, limit 1.1tr/ngày, đã ngâm sẵn.',
    price: 350000,
    quantity: 8,
    warranty: 'Bảo hành link die, không bảo hành khi đã add thẻ.',
    category: 'BM'
  },
  {
    id: '4',
    name: 'Clone Reg Phone - 2FA',
    description: 'Clone Việt reg bằng số điện thoại, có 2FA, avatar đầy đủ.',
    price: 5000,
    quantity: 500,
    warranty: 'Bảo hành login lần đầu.',
    category: 'Clone'
  },
  {
    id: '5',
    name: 'Page Cổ Kháng - 5k Follow',
    description: 'Page lập từ 2019, đã kháng nghị, có sẵn 5000 follow thật.',
    price: 850000,
    quantity: 3,
    warranty: 'Bảo hành 7 ngày: Mất quyền admin, page bị hủy đăng.',
    category: 'Page'
  }
];

export const ZALO_PHONE = '0943304685';
export const ZALO_LINK = `https://zalo.me/${ZALO_PHONE}`;

export const BUYING_GUIDE = [
  { step: 1, title: 'Chọn sản phẩm', detail: 'Xem danh sách tài khoản và chọn loại phù hợp với nhu cầu quảng cáo của bạn.' },
  { step: 2, title: 'Thanh toán', detail: 'Nhập số lượng, quét mã QR và thực hiện chuyển khoản với nội dung chính xác.' },
  { step: 3, title: 'Xác nhận', detail: 'Sau khi chuyển khoản, nhấn "Tôi đã thanh toán" để hệ thống ghi nhận.' },
  { step: 4, title: 'Nhận hàng', detail: 'Nhấn nút "Liên hệ Zalo" để gửi thông tin đơn hàng cho Admin và nhận tài khoản ngay.' }
];

export const WARRANTY_POLICY = [
  { title: 'Lỗi đăng nhập', detail: 'Bảo hành 1 đổi 1 nếu tài khoản sai mật khẩu hoặc bị checkpoint ngay khi đăng nhập lần đầu.' },
  { title: 'Thời gian bảo hành', detail: 'Mọi khiếu nại phải được gửi trong vòng 24h kể từ thời điểm mua hàng.' },
  { title: 'Từ chối bảo hành', detail: 'Không bảo hành đối với tài khoản đã lên camp, add thẻ, hoặc vi phạm chính sách cộng đồng sau khi bàn giao.' },
  { title: 'Hỗ trợ kỹ thuật', detail: 'Hỗ trợ ngâm via, cách login an toàn để tránh quét từ Facebook.' }
];

export const FAQS = [
  { q: 'Sau bao lâu thì nhận được tài khoản?', a: 'Thông thường Admin sẽ gửi tài khoản qua Zalo trong vòng 5-15 phút sau khi nhận được thông báo thanh toán.' },
  { q: 'Tài khoản có sẵn 2FA không?', a: 'Tất cả tài khoản Via và Clone tại shop đều có mã bảo mật 2FA đi kèm.' },
  { q: 'Tôi có thể thanh toán qua ngân hàng nào?', a: 'Hệ thống hỗ trợ tất cả các ngân hàng nội địa Việt Nam qua mã QR VietQR.' }
];
