export interface AccountItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  warranty: string;
  category: 'Via' | 'Clone' | 'BM' | 'Page';
}

export interface PurchaseInfo {
  accountId: string;
  accountName: string;
  quantity: number;
  totalPrice: number;
}
