'use client';
import React, { useState, useEffect } from 'react';
import { 
  Package, Edit, Trash2, Plus, Search, Filter, 
  TrendingUp, TrendingDown, AlertTriangle, Truck, 
  BarChart2, DollarSign, RefreshCw
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
import { supabase } from '@/lib/supabaseClient';

const InventoryManagementPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*');
      
      if (error) throw error;
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const addProduct = async (newProduct) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .single();
      
      if (error) throw error;
      setProducts([...products, data]);
    } catch (error) {
      console.error('Error adding product:', error.message);
      setError(error.message);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProducts(products.map(p => p.id === id ? data : p));
    } catch (error) {
      console.error('Error updating product:', error.message);
      setError(error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error.message);
      setError(error.message);
    }
  };

  const addSupplier = async (newSupplier) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([newSupplier])
        .single();
      
      if (error) throw error;
      setSuppliers([...suppliers, data]);
    } catch (error) {
      console.error('Error adding supplier:', error.message);
      setError(error.message);
    }
  };
  const updateSupplier = async (id, updatedSupplier) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(updatedSupplier)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setSuppliers(suppliers.map(s => s.id === id ? data : s));
    } catch (error) {
      console.error('Error updating supplier:', error.message);
      setError(error.message);
    }
  };

  const deleteSupplier = async (id) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error.message);
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const openProductDialog = (product = null) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const closeProductDialog = () => {
    setIsProductDialogOpen(false);
    setSelectedProduct(null);
  };

  const openSupplierDialog = (supplier = null) => {
    setSelectedSupplier(supplier);
    setIsSupplierDialogOpen(true);
  };

  const closeSupplierDialog = () => {
    setIsSupplierDialogOpen(false);
    setSelectedSupplier(null);
  };

  const handleProductUpdate = (updatedProduct) => {
    updateProduct(updatedProduct.id, updatedProduct);
    closeProductDialog();
  };

  const handleSupplierUpdate = (updatedSupplier) => {
    updateSupplier(updatedSupplier.id, updatedSupplier);
    closeSupplierDialog();
  };

  const renderProductCatalog = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Button onClick={() => openProductDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₦{product.price}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 100 ? "success" : product.stock > 50 ? "warning" : "destructive"}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openProductDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          {/* Add form fields for product details here */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input id="name" value={selectedProduct?.name || ''} className="col-span-3" />
            </div>
            {/* Add more form fields for SKU, category, price, stock, supplier */}
          </div>
          <Button onClick={closeProductDialog}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderStockManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₦{products.reduce((total, product) => total + (product.price * product.stock), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {products.filter(product => product.stock <= 50).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Out of Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {products.filter(product => product.stock === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.filter(product => product.stock <= 50).map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>
                    <Badge variant={product.stock === 0 ? "destructive" : "warning"}>
                      {product.stock === 0 ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Reorder
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
          <CardTitle>Stock Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Stock forecast chart placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSupplierManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supplier Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Button onClick={() => openSupplierDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add New Supplier
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Reliability</TableHead>
                <TableHead>Avg. Delivery Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.reliability >= 90 ? "success" : supplier.reliability >= 80 ? "warning" : "destructive"}>
                      {supplier.reliability}%
                    </Badge>
                  </TableCell>
                  <TableCell>{supplier.avgDeliveryTime} days</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openSupplierDialog(supplier)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteSupplier(supplier.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          </DialogHeader>
          {/* Add form fields for supplier details here */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="supplierName" className="text-right">
                Name
              </label>
              <Input id="supplierName" value={selectedSupplier?.name || ''} className="col-span-3" />
            </div>
            {/* Add more form fields for reliability, average delivery time, etc. */}
          </div>
          <Button onClick={closeSupplierDialog}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Actions <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Import Products</DropdownMenuItem>
            <DropdownMenuItem>Export Inventory Report</DropdownMenuItem>
            <DropdownMenuItem>Bulk Price Update</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'products' ? 'default' : 'outline'}
          onClick={() => setActiveTab('products')}
        >
          <Package className="mr-2 h-4 w-4" /> Products
        </Button>
        <Button
        variant={activeTab === 'stock' ? 'default' : 'outline'}
        onClick={() => setActiveTab('stock')}
      >
        <BarChart2 className="mr-2 h-4 w-4" /> Stock
      </Button>
      <Button
        variant={activeTab === 'suppliers' ? 'default' : 'outline'}
        onClick={() => setActiveTab('suppliers')}
      >
        <Truck className="mr-2 h-4 w-4" /> Suppliers
      </Button>
    </div>

    {loading && <p>Loading inventory...</p>}
    {error && <p>Error: {error}</p>}
    {!loading && !error && (
      <>
        {activeTab === 'products' && renderProductCatalog()}
        {activeTab === 'stock' && renderStockManagement()}
        {activeTab === 'suppliers' && renderSupplierManagement()}
      </>
    )}
  </div>
);
};

export default InventoryManagementPage;