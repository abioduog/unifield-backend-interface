import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Truck, RefreshCcw, Search, Filter, 
  ChevronDown, Edit, Trash2, Plus, Download, Printer,
  Package, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { supabase } from '@/lib/supabaseClient';

const OrderProcessingPage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchOrders();
    fetchReturns();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Change received!', payload);
          fetchOrders(); // Refetch the orders
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (error) throw error;
      setOrders(data);
      setTotalCount(count);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReturns = async () => {
    try {
      const { data, error } = await supabase
        .from('returns')
        .select('*');
      
      if (error) throw error;
      setReturns(data);
    } catch (error) {
      console.error('Error fetching returns:', error.message);
      setError(error.message);
    }
  };

  const addOrder = async (newOrder) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .single();
      
      if (error) throw error;
      setOrders([...orders, data]);
    } catch (error) {
      console.error('Error adding order:', error.message);
      setError(error.message);
    }
  };

  const updateOrder = async (id, updatedOrder) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updatedOrder)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setOrders(orders.map(o => o.id === id ? data : o));
    } catch (error) {
      console.error('Error updating order:', error.message);
      setError(error.message);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setOrders(orders.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error.message);
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReturns = returns ? returns.filter(returnItem => 
    returnItem.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    returnItem.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const openOrderDialog = (order = null) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const closeOrderDialog = () => {
    setIsOrderDialogOpen(false);
    setSelectedOrder(null);
  };

  const openReturnDialog = (returnItem = null) => {
    setSelectedReturn(returnItem);
    setIsReturnDialogOpen(true);
  };

  const closeReturnDialog = () => {
    setIsReturnDialogOpen(false);
    setSelectedReturn(null);
  };

  const handleOrderUpdate = (updatedOrder) => {
    // In a real application, you would make an API call to update the order
    const updatedOrders = orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
    closeOrderDialog();
  };

  const handleReturnUpdate = (updatedReturn) => {
    // In a real application, you would make an API call to update the return
    const updatedReturns = returns.map(returnItem => 
      returnItem.id === updatedReturn.id ? updatedReturn : returnItem
    );
    setReturns(updatedReturns);
    closeReturnDialog();
  };

  const renderOrderManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Orders</DropdownMenuItem>
                  <DropdownMenuItem>Processing</DropdownMenuItem>
                  <DropdownMenuItem>Shipped</DropdownMenuItem>
                  <DropdownMenuItem>Delivered</DropdownMenuItem>
                  <DropdownMenuItem>Returned</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button onClick={() => openOrderDialog()}>
                <Plus className="mr-2 h-4 w-4" /> New Order
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>₦{order.total.toLocaleString()}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'Processing' ? 'default' :
                      order.status === 'Shipped' ? 'secondary' :
                      order.status === 'Delivered' ? 'success' :
                      'destructive'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openOrderDialog(order)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedOrder ? 'Edit Order' : 'New Order'}</DialogTitle>
          </DialogHeader>
          {/* Add form fields for order details here */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="customerName" className="text-right">
                Customer Name
              </label>
              <Input id="customerName" value={selectedOrder?.customerName || ''} className="col-span-3" />
            </div>
            {/* Add more form fields for order date, total, items, status */}
          </div>
          <Button onClick={closeOrderDialog}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderLogisticsDelivery = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logistics & Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {orders.filter(order => order.status === 'Processing').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>In Transit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {orders.filter(order => order.status === 'Shipped').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Delivered Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {orders.filter(order => order.status === 'Delivered' && order.orderDate === new Date().toISOString().split('T')[0]).length}
                </div>
              </CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estimated Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.filter(order => order.status !== 'Delivered').map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Processing' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Truck className="mr-2 h-4 w-4" /> Track
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderReturnsRefunds = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Returns & Refunds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search returns..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Button onClick={() => openReturnDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Process New Return
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return ID</TableHead>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.map((returnItem) => (
                <TableRow key={returnItem.id}>
                  <TableCell>{returnItem.id}</TableCell>
                  <TableCell>{returnItem.orderNumber}</TableCell>
                  <TableCell>{returnItem.customerName}</TableCell>
                  <TableCell>{returnItem.returnDate}</TableCell>
                  <TableCell>{returnItem.reason}</TableCell>
                  <TableCell>
                    <Badge variant={
                      returnItem.status === 'Pending' ? 'default' :
                      returnItem.status === 'Approved' ? 'success' :
                      'destructive'
                    }>
                      {returnItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openReturnDialog(returnItem)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedReturn ? 'Edit Return' : 'Process New Return'}</DialogTitle>
          </DialogHeader>
          {/* Add form fields for return details here */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="orderNumber" className="text-right">
                Order Number
              </label>
              <Input id="orderNumber" value={selectedReturn?.orderNumber || ''} className
              ="col-span-3" />
              </div>
              {/* Add more form fields for customer name, return date, reason, status */}
            </div>
            <Button onClick={closeReturnDialog}>Save Changes</Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Order Processing & Fulfillment</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Bulk Process Orders</DropdownMenuItem>
              <DropdownMenuItem>Generate Shipping Labels</DropdownMenuItem>
              <DropdownMenuItem>Export Order Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Orders
          </Button>
          <Button
            variant={activeTab === 'logistics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('logistics')}
          >
            <Truck className="mr-2 h-4 w-4" /> Logistics & Delivery
          </Button>
          <Button
            variant={activeTab === 'returns' ? 'default' : 'outline'}
            onClick={() => setActiveTab('returns')}
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Returns & Refunds
          </Button>
        </div>
  
        {activeTab === 'orders' && renderOrderManagement()}
        {activeTab === 'logistics' && renderLogisticsDelivery()}
        {activeTab === 'returns' && renderReturnsRefunds()}
      </div>
    );
  };
  
  export default OrderProcessingPage;