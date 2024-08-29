'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Book, Video, TicketIcon } from 'lucide-react';

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('knowledge-base');

  // Mock data for knowledge base articles and support tickets
  const knowledgeBaseArticles = [
    { id: 1, title: 'How to place an order', type: 'FAQ' },
    { id: 2, title: 'Troubleshooting inventory sync issues', type: 'Guide' },
    { id: 3, title: 'Understanding credit limits', type: 'FAQ' },
  ];

  const supportTickets = [
    { id: 1, title: "Can't update retailer information", status: 'Open', assignedTo: 'John Doe' },
    { id: 2, title: 'Order not showing in system', status: 'In Progress', assignedTo: 'Jane Smith' },
    { id: 3, title: 'Need help with returns process', status: 'Closed', assignedTo: 'Mike Johnson' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="support-tickets">Support Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge-base">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Search our database of FAQs and guides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <Input 
                  placeholder="Search knowledge base..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mr-2"
                />
                <Button><Search className="mr-2 h-4 w-4" /> Search</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {knowledgeBaseArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>{article.title}</TableCell>
                      <TableCell>{article.type}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          {article.type === 'FAQ' ? <Book className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support-tickets">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage and track support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="mb-4"><TicketIcon className="mr-2 h-4 w-4" /> Create New Ticket</Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>#{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>{ticket.assignedTo}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupportPage;