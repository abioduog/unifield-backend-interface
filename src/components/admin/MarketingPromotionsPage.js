'use client';
import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Target, TrendingUp, Gift, Clock, Award,
  Plus, Edit, Trash2, ChevronDown, Download, Calendar
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
// import { DatePicker } from "@/components/ui/date-picker"; // Remove or comment this line
import { Select } from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from '@/lib/supabaseClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MarketingPromotionsPage = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loyaltyProgram, setLoyaltyProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCampaigns();
      await fetchPromotions();
      await fetchLoyaltyProgram();
    };
    fetchData();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*');
      
      if (error) throw error;
      setCampaigns(data);
    } catch (error) {
      handleError(error, 'fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select('*');
      
      if (error) throw error;
      setPromotions(data);
    } catch (error) {
      handleError(error, 'fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoyaltyProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_program')
        .select('*')
        .single();
      
      if (error) throw error;
      setLoyaltyProgram(data);
    } catch (error) {
      console.error('Error fetching loyalty program:', error.message);
      setError('Failed to fetch loyalty program. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPromotions = promotions.filter(promotion => 
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCampaignDialog = (campaign = null) => {
    setSelectedCampaign(campaign);
    setIsCampaignDialogOpen(true);
  };

  const closeCampaignDialog = () => {
    setIsCampaignDialogOpen(false);
    setSelectedCampaign(null);
  };

  const openPromotionDialog = (promotion = null) => {
    setSelectedPromotion(promotion);
    setIsPromotionDialogOpen(true);
  };

  const closePromotionDialog = () => {
    setIsPromotionDialogOpen(false);
    setSelectedPromotion(null);
  };

  const handleCampaignUpdate = async (updatedCampaign) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updatedCampaign)
        .eq('id', updatedCampaign.id)
        .single();
      
      if (error) throw error;
      setCampaigns(campaigns.map(campaign => campaign.id === updatedCampaign.id ? data : campaign));
      closeCampaignDialog();
    } catch (error) {
      handleError(error, 'update campaign');
    }
  };

  const handlePromotionUpdate = async (updatedPromotion) => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .update(updatedPromotion)
        .eq('id', updatedPromotion.id)
        .single();
      
      if (error) throw error;
      setPromotions(promotions.map(promotion => promotion.id === updatedPromotion.id ? data : promotion));
      closePromotionDialog();
    } catch (error) {
      handleError(error, 'update promotion');
    }
  };

  const handleError = (error, operation) => {
    console.error(`Error ${operation}:`, error.message);
    setError(`Failed to ${operation}. Please try again.`);
    // Implement a toast or notification system to show errors to the user
  };

  const renderCampaignManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Button onClick={() => openCampaignDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Create New Campaign
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.target}</TableCell>
                  <TableCell>{campaign.startDate}</TableCell>
                  <TableCell>{campaign.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      campaign.status === 'Active' ? 'success' :
                      campaign.status === 'Scheduled' ? 'warning' :
                      'secondary'
                    }>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {campaign.status === 'Active' ? `${campaign.performance}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openCampaignDialog(campaign)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="campaignName" className="text-right">
                Campaign Name
              </label>
              <Input id="campaignName" value={selectedCampaign?.name || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="campaignTarget" className="text-right">
                Target
              </label>
              <Select id="campaignTarget" value={selectedCampaign?.target || ''} className="col-span-3">
                <option value="All Retailers">All Retailers</option>
                <option value="New Retailers">New Retailers</option>
                <option value="Top Performers">Top Performers</option>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="campaignStartDate" className="text-right">
                Start Date
              </label>
              <Input type="date" id="campaignStartDate" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="campaignEndDate" className="text-right">
                End Date
              </label>
              <Input type="date" id="campaignEndDate" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="campaignStatus" className="text-right">
                Status
              </label>
              <Select id="campaignStatus" value={selectedCampaign?.status || ''} className="col-span-3">
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
              </Select>
            </div>
          </div>
          <Button onClick={closeCampaignDialog}>
            {selectedCampaign ? 'Update Campaign' : 'Create Campaign'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderPromotionSetup = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Promotion Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Button onClick={() => openPromotionDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Create New Promotion
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell>{promotion.type}</TableCell>
                  <TableCell>{promotion.value}</TableCell>
                  <TableCell>{promotion.startDate}</TableCell>
                  <TableCell>{promotion.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      promotion.status === 'Active' ? 'success' :
                      promotion.status === 'Scheduled' ? 'warning' :
                      'secondary'
                    }>
                      {promotion.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openPromotionDialog(promotion)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPromotion ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="promotionName" className="text-right">
                Promotion Name
              </label>
              <Input id="promotionName" value={selectedPromotion?.name || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="promotionType" className="text-right">
                Type
              </label>
              <Select id="promotionType" value={selectedPromotion?.type || ''} className="col-span-3">
                <option value="Discount">Discount</option>
                <option value="Bundle">Bundle</option>
                <option value="Flash Sale">Flash Sale</option>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap
            -4">
              <label htmlFor="promotionValue" className="text-right">
                Value
              </label>
              <Input id="promotionValue" value={selectedPromotion?.value || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="promotionStartDate" className="text-right">
                Start Date
              </label>
              <DatePicker id="promotionStartDate" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="promotionEndDate" className="text-right">
                End Date
              </label>
              <DatePicker id="promotionEndDate" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="promotionStatus" className="text-right">
                Status
              </label>
              <Select id="promotionStatus" value={selectedPromotion?.status || ''} className="col-span-3">
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
              </Select>
            </div>
          </div>
          <Button onClick={closePromotionDialog}>
            {selectedPromotion ? 'Update Promotion' : 'Create Promotion'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderLoyaltyProgram = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program: {loyaltyProgram?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Description:</p>
              <p>{loyaltyProgram?.description}</p>
            </div>
            <div>
              <p className="font-semibold">Point Value:</p>
              <p>₦{loyaltyProgram?.point_value?.toFixed(2) ?? 'N/A'} per point</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Loyalty Tiers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier Name</TableHead>
                  <TableHead>Point Threshold</TableHead>
                  <TableHead>Benefits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loyaltyProgram?.tiers?.map((tier, index) => (
                  <TableRow key={index}>
                    <TableCell>{tier.name}</TableCell>
                    <TableCell>{tier.threshold} points</TableCell>
                    <TableCell>{tier.benefits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return <div>Loading loyalty program...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Marketing & Promotions</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Generate Campaign Report</DropdownMenuItem>
            <DropdownMenuItem>Export Promotion Data</DropdownMenuItem>
            <DropdownMenuItem>Manage Loyalty Program Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'campaigns' ? 'default' : 'outline'}
          onClick={() => setActiveTab('campaigns')}
        >
          <Megaphone className="mr-2 h-4 w-4" /> Campaigns
        </Button>
        <Button
          variant={activeTab === 'promotions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('promotions')}
        >
          <Gift className="mr-2 h-4 w-4" /> Promotions
        </Button>
        <Button
          variant={activeTab === 'loyalty' ? 'default' : 'outline'}
          onClick={() => setActiveTab('loyalty')}
        >
          <Award className="mr-2 h-4 w-4" /> Loyalty Program
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          {activeTab === 'campaigns' && renderCampaignManagement()}
          {activeTab === 'promotions' && renderPromotionSetup()}
          {activeTab === 'loyalty' && renderLoyaltyProgram()}
        </>
      )}
    </div>
  );
};

export default MarketingPromotionsPage;