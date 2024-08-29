'use client';
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, FileText, AlertCircle, Download, ChevronDown, 
  CreditCard, TrendingUp, BarChart2, PieChart, RefreshCw
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
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { supabase } from '@/lib/supabaseClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FinancialManagementPage = () => {
  const [activeTab, setActiveTab] = useState('billing');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [partnerBrands, setPartnerBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchInvoices(),
          fetchRevenueData(),
          fetchCategoryData(),
          fetchPartnerBrands()
        ]);
      } catch (error) {
        handleError(error, 'fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*');
      
      if (error) throw error;
      setInvoices(data);
    } catch (error) {
      handleError(error, 'fetch invoices');
    }
  };

  const addInvoice = async (newInvoice) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([newInvoice])
        .single();
      
      if (error) throw error;
      setInvoices([...invoices, data]);
    } catch (error) {
      handleError(error, 'add invoice');
    }
  };

  const updateInvoice = async (id, updatedInvoice) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updatedInvoice)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setInvoices(invoices.map(i => i.id === id ? data : i));
    } catch (error) {
      handleError(error, 'update invoice');
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setInvoices(invoices.filter(i => i.id !== id));
    } catch (error) {
      handleError(error, 'delete invoice');
    }
  };

  const fetchRevenueData = async () => {
    try {
      const { data, error } = await supabase
        .from('revenue')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setRevenueData(data);
    } catch (error) {
      handleError(error, 'fetch revenue data');
    }
  };

  const fetchCategoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      setCategoryData(data);
    } catch (error) {
      handleError(error, 'fetch category data');
    }
  };

  const fetchPartnerBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_brands')
        .select('*');
      
      if (error) throw error;
      setPartnerBrands(data);
    } catch (error) {
      handleError(error, 'fetch partner brands');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.retailer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openInvoiceDialog = (invoice = null) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDialogOpen(true);
  };

  const closeInvoiceDialog = () => {
    setIsInvoiceDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleInvoiceUpdate = (updatedInvoice) => {
    updateInvoice(updatedInvoice.id, updatedInvoice);
    closeInvoiceDialog();
  };

  const handleError = (error, operation) => {
    console.error(`Error ${operation}:`, error.message);
    setError(`Failed to ${operation}. Please try again.`);
    // Implement a toast or notification system to show errors to the user
  };

  const renderBillingInvoicing = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing & Invoicing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Button onClick={() => openInvoiceDialog()}>
              <FileText className="mr-2 h-4 w-4" /> Generate New Invoice
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Retailer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.retailer}</TableCell>
                  <TableCell>₦{invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.status === 'Paid' ? 'success' :
                      invoice.status === 'Pending' ? 'warning' :
                      'destructive'
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openInvoiceDialog(invoice)}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedInvoice ? 'Invoice Details' : 'Generate New Invoice'}</DialogTitle>
          </DialogHeader>
          {/* Add form fields for invoice details here */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="retailer" className="text-right">
                Retailer
              </label>
              <Input id="retailer" value={selectedInvoice?.retailer || ''} className="col-span-3" />
            </div>
            {/* Add more form fields for amount, date, status */}
          </div>
          <Button onClick={closeInvoiceDialog}>
            {selectedInvoice ? 'Update Invoice' : 'Generate Invoice'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderRevenueAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₦{revenueData.reduce((total, data) => total + data.revenue, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₦{(revenueData.reduce((total, data) => total + data.revenue, 0) / revenueData.length).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {revenueData && revenueData.length > 1 ? (
                `+${((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100).toFixed(2)}%`
              ) : (
                'N/A'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderPartnerReconciliation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Partner Brand Reconciliation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner Brand</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerBrands.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>₦{partner.sales.toLocaleString()}</TableCell>
                  <TableCell>₦{partner.commission.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partner Sales Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={partnerBrands}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
              <Bar dataKey="commission" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Financial Management</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Generate Financial Report</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
            <DropdownMenuItem>Reconcile Partner Payments</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'billing' ? 'default' : 'outline'}
          onClick={() => setActiveTab('billing')}
        >
          <CreditCard className="mr-2 h-4 w-4" /> Billing & Invoicing
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart2 className="mr-2 h-4 w-4" /> Revenue Analytics
        </Button>
        <Button
          variant={activeTab === 'partners' ? 'default' : 'outline'}
          onClick={() => setActiveTab('partners')}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Partner Reconciliation
        </Button>
      </div>
      {activeTab === 'billing' && renderBillingInvoicing()}
      {activeTab === 'analytics' && renderRevenueAnalytics()}
      {activeTab === 'partners' && renderPartnerReconciliation()}
    </div>
  );
};

export default FinancialManagementPage;