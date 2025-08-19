export interface OrderData {
  date: string
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  itemName: string
  category: string
  quantity: number
  pricePerItem: number
  totalAmount: number
  discountPercent: number
  finalAmount: number
  paymentMethod: string
  orderStatus: string
  deliveryType: string
  deliveryStatus: string
  notes: string
  price: number
  total: number
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  topCategories: Array<{ category: string; count: number; revenue: number }>
  revenueByDate: Array<{ date: string; revenue: number }>
  orderStatusDistribution: Array<{ status: string; count: number }>
  paymentMethodDistribution: Array<{ method: string; count: number }>
}
