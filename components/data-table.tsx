import type { OrderData } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"

interface DataTableProps {
  orders: OrderData[]
}

export function DataTable({ orders }: DataTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Order Data</h3>
        <p className="text-muted-foreground">No orders found</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Complete Order Data ({orders.length} orders)</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Order ID</th>
              <th className="text-left p-3 font-medium">Customer Name</th>
              <th className="text-left p-3 font-medium">Phone</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Item</th>
              <th className="text-left p-3 font-medium">Category</th>
              <th className="text-left p-3 font-medium">Qty</th>
              <th className="text-left p-3 font-medium">Price/Item</th>
              <th className="text-left p-3 font-medium">Total Amount</th>
              <th className="text-left p-3 font-medium">Discount %</th>
              <th className="text-left p-3 font-medium">Final Amount</th>
              <th className="text-left p-3 font-medium">Payment</th>
              <th className="text-left p-3 font-medium">Order Status</th>
              <th className="text-left p-3 font-medium">Delivery Type</th>
              <th className="text-left p-3 font-medium">Delivery Status</th>
              <th className="text-left p-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="p-3 text-sm">
                  {order.date === "Invalid Date" ? (
                    <span className="text-red-500">Invalid Date</span>
                  ) : (
                    (() => {
                      try {
                        const date = new Date(order.date)
                        return isNaN(date.getTime()) ? (
                          <span className="text-red-500">Invalid Date</span>
                        ) : (
                          date.toLocaleDateString()
                        )
                      } catch {
                        return <span className="text-red-500">Invalid Date</span>
                      }
                    })()
                  )}
                </td>
                <td className="p-3 text-sm font-mono">{order.orderId}</td>
                <td className="p-3 text-sm">{order.customerName}</td>
                <td className="p-3 text-sm">{order.customerPhone}</td>
                <td className="p-3 text-sm text-blue-600">{order.customerEmail}</td>
                <td className="p-3 text-sm">{order.itemName}</td>
                <td className="p-3 text-sm">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{order.category}</span>
                </td>
                <td className="p-3 text-sm text-center">{order.quantity}</td>
                <td className="p-3 text-sm">
                  {isNaN(order.pricePerItem) ? (
                    <span className="text-red-500">Invalid Price</span>
                  ) : (
                    formatCurrency(order.pricePerItem)
                  )}
                </td>
                <td className="p-3 text-sm">{formatCurrency(order.totalAmount)}</td>
                <td className="p-3 text-sm text-center">{order.discountPercent}%</td>
                <td className="p-3 text-sm font-medium">
                  {isNaN(order.finalAmount) ? (
                    <span className="text-red-500">Invalid Amount</span>
                  ) : (
                    formatCurrency(order.finalAmount)
                  )}
                </td>
                <td className="p-3 text-sm">{order.paymentMethod}</td>
                <td className="p-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.orderStatus?.toLowerCase().includes("completed") ||
                      order.orderStatus?.toLowerCase().includes("delivered")
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus?.toLowerCase().includes("pending")
                          ? "bg-yellow-100 text-yellow-800"
                          : order.orderStatus?.toLowerCase().includes("cancelled")
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-3 text-sm">{order.deliveryType}</td>
                <td className="p-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.deliveryStatus?.toLowerCase().includes("delivered")
                        ? "bg-green-100 text-green-800"
                        : order.deliveryStatus?.toLowerCase().includes("pending")
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.deliveryStatus}
                  </span>
                </td>
                <td className="p-3 text-sm max-w-xs truncate" title={order.notes}>
                  {order.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
