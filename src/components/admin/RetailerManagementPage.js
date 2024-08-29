'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, CreditCard, MessageSquare, Bell, ChevronDown, ChevronRight, X, Plus, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabaseClient';

const RetailerManagementPage = () => {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRetailers, setFilteredRetailers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isRetailerDialogOpen, setIsRetailerDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRetailers();
  }, []);

  useEffect(() => {
    const filtered = retailers.filter(retailer =>
      (retailer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (retailer.location?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );
    setFilteredRetailers(filtered);
  }, [searchTerm, retailers]);

  const fetchRetailers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('retailers')
        .select('*');

      if (error) throw error;

      // Ensure all required fields are present
      const validRetailers = data.filter(retailer => 
        retailer && retailer.name && retailer.location
      );
      
      setRetailers(validRetailers);
      setFilteredRetailers(validRetailers);
      console.log('Retailers data:', validRetailers); // Log the valid retailers
    } catch (error) {
      console.error('Error fetching retailers:', error.message);
      setError('Failed to fetch retailers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addRetailer = async (newRetailer) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const retailerWithUserInfo = {
        ...newRetailer,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('retailers')
        .insert([retailerWithUserInfo])
        .single();

      if (error) throw error;
      setRetailers([...retailers, data]);
      setFilteredRetailers([...filteredRetailers, data]);
    } catch (error) {
      console.error('Error adding retailer:', error.message);
      setError(error.message);
    }
  };

  const updateRetailer = async (id, updatedRetailer) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const retailerWithUserInfo = {
        ...updatedRetailer,
        updatedBy: user.id,
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('retailers')
        .update(retailerWithUserInfo)
        .eq('id', id)
        .single();

      if (error) throw error;
      const updatedRetailers = retailers.map(r => r.id === id ? data : r);
      setRetailers(updatedRetailers);
      setFilteredRetailers(updatedRetailers);
    } catch (error) {
      console.error('Error updating retailer:', error.message);
      setError(error.message);
    }
  };

  const deleteRetailer = async (id) => {
    try {
      const { error } = await supabase
        .from('retailers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      const updatedRetailers = retailers.filter(r => r.id !== id);
      setRetailers(updatedRetailers);
      setFilteredRetailers(updatedRetailers);
    } catch (error) {
      console.error('Error deleting retailer:', error.message);
      setError(error.message);
    }
  };

  const openRetailerDialog = (retailer = null) => {
    setSelectedRetailer(retailer);
    setIsRetailerDialogOpen(true);
  };

  const handleRetailerSubmit = async (formData) => {
    const retailerData = {
      name: formData.get('name'),
      location: formData.get('location'),
      businessType: formData.get('businessType'),
      contactPerson: formData.get('contactPerson'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      registrationNumber: formData.get('registrationNumber'),
      yearEstablished: parseInt(formData.get('yearEstablished')),
      annualRevenue: parseFloat(formData.get('annualRevenue')),
      employeeCount: parseInt(formData.get('employeeCount')),
      description: formData.get('description'),
      salesVolume: parseFloat(formData.get('salesVolume')) || 0,
      creditStatus: formData.get('creditStatus') || 'Good',
    };

    if (selectedRetailer) {
      await updateRetailer(selectedRetailer.id, retailerData);
    } else {
      await addRetailer(retailerData);
    }

    setIsRetailerDialogOpen(false);
    setSelectedRetailer(null);
    fetchRetailers();
  };

  const handleDeleteRetailer = async (id) => {
    if (window.confirm('Are you sure you want to delete this retailer?')) {
      await deleteRetailer(id);
      fetchRetailers();
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Retailer Management</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Card>
              <CardHeader>
                <CardTitle>Retailers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Input
                    type="text"
                    placeholder="Search retailers..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-w-sm"
                  />
                  <Button onClick={() => openRetailerDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Retailer
                  </Button>
                </div>
                {loading ? (
                  <p>Loading retailers...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Business Type</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Sales Volume</TableHead>
                        <TableHead>Credit Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRetailers.map(retailer => (
                        <TableRow key={retailer.id}>
                          <TableCell>{retailer.name || 'N/A'}</TableCell>
                          <TableCell>{retailer.location || 'N/A'}</TableCell>
                          <TableCell>{retailer.businessType || 'N/A'}</TableCell>
                          <TableCell>{retailer.contactPerson || 'N/A'}</TableCell>
                          <TableCell>₦{retailer.salesVolume?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={retailer.creditStatus === 'Excellent' ? 'success' : retailer.creditStatus === 'Good' ? 'warning' : 'destructive'}>
                              {retailer.creditStatus || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => openRetailerDialog(retailer)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteRetailer(retailer.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Dialog open={isRetailerDialogOpen} onOpenChange={setIsRetailerDialogOpen}>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>{selectedRetailer ? 'Edit Retailer' : 'Create New Retailer'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleRetailerSubmit(new FormData(e.target));
                }}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right">Name</label>
                      <Input id="name" name="name" defaultValue={selectedRetailer?.name || ''} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="location" className="text-right">Location</label>
                      <Input id="location" name="location" defaultValue={selectedRetailer?.location || ''} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="businessType" className="text-right">Business Type</label>
                      <Select name="businessType" defaultValue={selectedRetailer?.businessType || ''}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grocery">Grocery Store</SelectItem>
                          <SelectItem value="convenience">Convenience Store</SelectItem>
                          <SelectItem value="supermarket">Supermarket</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="department">Department Store</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="contactPerson" className="text-right">Contact Person</label>
                      <Input id="contactPerson" name="contactPerson" defaultValue={selectedRetailer?.contactPerson || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right">Email</label>
                      <Input id="email" name="email" type="email" defaultValue={selectedRetailer?.email || ''} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="phone" className="text-right">Phone</label>
                      <Input id="phone" name="phone" type="tel" defaultValue={selectedRetailer?.phone || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="registrationNumber" className="text-right">Registration Number</label>
                      <Input id="registrationNumber" name="registrationNumber" defaultValue={selectedRetailer?.registrationNumber || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="yearEstablished" className="text-right">Year Established</label>
                      <Input id="yearEstablished" name="yearEstablished" type="number" defaultValue={selectedRetailer?.yearEstablished || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="annualRevenue" className="text-right">Annual Revenue (₦)</label>
                      <Input id="annualRevenue" name="annualRevenue" type="number" step="0.01" defaultValue={selectedRetailer?.annualRevenue || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="employeeCount" className="text-right">Number of Employees</label>
                      <Input id="employeeCount" name="employeeCount" type="number" defaultValue={selectedRetailer?.employeeCount || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="salesVolume" className="text-right">Sales Volume (₦)</label>
                      <Input id="salesVolume" name="salesVolume" type="number" step="0.01" defaultValue={selectedRetailer?.salesVolume || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="creditStatus" className="text-right">Credit Status</label>
                      <Select name="creditStatus" defaultValue={selectedRetailer?.creditStatus || 'Good'}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select credit status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="description" className="text-right">Description</label>
                      <Textarea id="description" name="description" defaultValue={selectedRetailer?.description || ''} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {selectedRetailer ? 'Update Retailer' : 'Create Retailer'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RetailerManagementPage;