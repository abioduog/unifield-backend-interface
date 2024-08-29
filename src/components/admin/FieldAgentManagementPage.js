'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, MapPin, BookOpen, BarChart2, TrendingUp, TrendingDown, 
  Download, Upload, CheckCircle, AlertCircle, Search, ChevronDown
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabaseClient';

const FieldAgentManagementPage = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [fieldAgents, setFieldAgents] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainingModules, setTrainingModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch field agents
        const { data: agentsData, error: agentsError } = await supabase
          .from('field_agents')
          .select('*');
        
        if (agentsError) throw agentsError;
        setFieldAgents(agentsData);

        // Fetch territories
        const { data: territoriesData, error: territoriesError } = await supabase
          .from('territories')
          .select('*');
        
        if (territoriesError) throw territoriesError;
        setTerritories(territoriesData);

        // Fetch training modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('training_modules')
          .select('*');
        
        if (modulesError) throw modulesError;
        setTrainingModules(modulesData);

      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addFieldAgent = async (newAgent) => {
    try {
      const { data, error } = await supabase
        .from('field_agents')
        .insert([newAgent])
        .single();
      
      if (error) throw error;
      setFieldAgents([...fieldAgents, data]);
    } catch (error) {
      console.error('Error adding field agent:', error.message);
      setError(error.message);
    }
  };

  const updateFieldAgent = async (id, updatedAgent) => {
    try {
      const { data, error } = await supabase
        .from('field_agents')
        .update(updatedAgent)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setFieldAgents(fieldAgents.map(agent => agent.id === id ? data : agent));
    } catch (error) {
      console.error('Error updating field agent:', error.message);
      setError(error.message);
    }
  };

  const deleteFieldAgent = async (id) => {
    try {
      const { error } = await supabase
        .from('field_agents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setFieldAgents(fieldAgents.filter(agent => agent.id !== id));
    } catch (error) {
      console.error('Error deleting field agent:', error.message);
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAgents = fieldAgents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAgentProfile = (agent) => {
    setSelectedAgent(agent);
    // Here you would typically open a modal or navigate to a detailed profile page
    console.log("Opening profile for agent:", agent);
  };

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Agents</h3>
              <p className="text-3xl font-bold text-blue-900">{fieldAgents.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Avg. Retailers Recruited</h3>
              <p className="text-3xl font-bold text-green-900">
                {isNaN(Math.round(fieldAgents.reduce((acc, agent) => acc + agent.retailersRecruited, 0) / fieldAgents.length)) ? 0 : Math.round(fieldAgents.reduce((acc, agent) => acc + agent.retailersRecruited, 0) / fieldAgents.length)}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Avg. Sales Growth</h3>
              <p className="text-3xl font-bold text-purple-900">
                {isNaN(Math.round(fieldAgents.reduce((acc, agent) => acc + agent.salesGrowth, 0) / fieldAgents.length)) ? 0 : Math.round(fieldAgents.reduce((acc, agent) => acc + agent.salesGrowth, 0) / fieldAgents.length)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Retailers Recruited</TableHead>
                <TableHead>Sales Growth</TableHead>
                <TableHead>Credit Management</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.territory}</TableCell>
                  <TableCell>{agent.retailersRecruited}</TableCell>
                  <TableCell>
                    <Badge variant={agent.salesGrowth > 15 ? "success" : agent.salesGrowth > 10 ? "warning" : "destructive"}>
                      {agent.salesGrowth}%
                    </Badge>
                  </TableCell>
                  <TableCell>{agent.creditManagement}%</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openAgentProfile(agent)}>
                      View Profile
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

  const renderTerritoryTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Territory Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Territories</h3>
              <p className="text-3xl font-bold text-blue-900">{territories.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Retailers</h3>
              <p className="text-3xl font-bold text-green-900">
                {territories.reduce((acc, territory) => acc + territory.retailerCount, 0)}
              </p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Territory Name</TableHead>
                <TableHead>Assigned Agents</TableHead>
                <TableHead>Retailer Count</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {territories.map((territory) => (
                <TableRow key={territory.id}>
                  <TableCell>{territory.name}</TableCell>
                  <TableCell>{territory.agentCount}</TableCell>
                  <TableCell>{territory.retailerCount}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Manage
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
          <CardTitle>Territory Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-200 h-96 flex items-center justify-center">
            <p className="text-gray-600">Interactive map placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Training Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search training modules..."
              className="max-w-sm"
            />
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload New Module
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module Title</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainingModules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell>{module.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${module.completionRate}%` }}></div>
                      </div>
                      <span>{module.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" />
              Always follow up with retailers within 24 hours of initial contact
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" />
              Conduct weekly check-ins with top-performing retailers
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" />
              Utilize the UniField app to track all interactions and sales data
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Field Agent Management</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Add New Agent</DropdownMenuItem>
            <DropdownMenuItem>Generate Performance Report</DropdownMenuItem>
            <DropdownMenuItem>Adjust Territory Assignments</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'performance' ? 'default' : 'outline'}
          onClick={() => setActiveTab('performance')}
        >
          <BarChart2 className="mr-2 h-4 w-4" /> Performance
        </Button>
        <Button
          variant={activeTab === 'territory' ? 'default' : 'outline'}
          onClick={() => setActiveTab('territory')}
        >
          <MapPin className="mr-2 h-4 w-4" /> Territory
        </Button>
        <Button
          variant={activeTab === 'training' ? 'default' : 'outline'}
          onClick={() => setActiveTab('training')}
        >
          <BookOpen className="mr-2 h-4 w-4" /> Training
        </Button>
      </div>

      {activeTab === 'performance' && renderPerformanceTab()}
      {activeTab === 'territory' && renderTerritoryTab()}
      {activeTab === 'training' && renderTrainingTab()}
    </div>
  );
};

export default FieldAgentManagementPage;