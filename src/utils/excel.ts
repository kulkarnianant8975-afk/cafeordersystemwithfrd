import * as XLSX from 'xlsx';
import { Order } from '../types';

export const exportOrdersToExcel = (orders: Order[]) => {
  const data = orders.map(order => ({
    'Order ID': order.id,
    'Table Number': order.tableNumber,
    'Items': order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
    'Total ($)': order.subtotal.toFixed(2),
    'Time': new Date(order.orderTime).toLocaleString(),
    'Status': order.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  const fileName = `Orders_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
