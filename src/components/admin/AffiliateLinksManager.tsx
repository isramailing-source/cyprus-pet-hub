import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  description: string;
  network_name: string;
  placement_type: string;
  is_active: boolean;
  click_count: number;
  display_order: number;
  target_pages: string[];
}

export default function AffiliateLinksManager() {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    description: '',
    network_name: '',
    placement_type: 'banner',
    target_pages: ['shop']
  });

  useEffect(() => {
    fetchAffiliateLinks();
  }, []);

  const fetchAffiliateLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_direct_links')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setAffiliateLinks(data || []);
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      toast.error('Failed to load affiliate links');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.name || !newLink.url) {
      toast.error('Name and URL are required');
      return;
    }

    try {
      const { error } = await supabase
        .from('affiliate_direct_links')
        .insert({
          ...newLink,
          display_order: affiliateLinks.length + 1
        });

      if (error) throw error;

      toast.success('Affiliate link added successfully');
      setNewLink({
        name: '',
        url: '',
        description: '',
        network_name: '',
        placement_type: 'banner',
        target_pages: ['shop']
      });
      fetchAffiliateLinks();
    } catch (error) {
      console.error('Error adding affiliate link:', error);
      toast.error('Failed to add affiliate link');
    }
  };

  const toggleLinkStatus = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('affiliate_direct_links')
        .update({ is_active: !is_active })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Link status updated');
      fetchAffiliateLinks();
    } catch (error) {
      console.error('Error updating link status:', error);
      toast.error('Failed to update link status');
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this affiliate link?')) return;

    try {
      const { error } = await supabase
        .from('affiliate_direct_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Affiliate link deleted');
      fetchAffiliateLinks();
    } catch (error) {
      console.error('Error deleting affiliate link:', error);
      toast.error('Failed to delete affiliate link');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading affiliate links...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Affiliate Links Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Link Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="name">Link Name</Label>
              <Input
                id="name"
                value={newLink.name}
                onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                placeholder="Pet Network Banner"
              />
            </div>
            <div>
              <Label htmlFor="url">Affiliate URL</Label>
              <Input
                id="url"
                value={newLink.url}
                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newLink.description}
                onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                placeholder="Premium pet products..."
              />
            </div>
            <div>
              <Label htmlFor="network">Network Name</Label>
              <Input
                id="network"
                value={newLink.network_name}
                onChange={(e) => setNewLink({...newLink, network_name: e.target.value})}
                placeholder="Affiliate Network"
              />
            </div>
            <div>
              <Label htmlFor="placement">Placement Type</Label>
              <Select
                value={newLink.placement_type}
                onValueChange={(value) => setNewLink({...newLink, placement_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddLink} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>

          {/* Existing Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Affiliate Links</h3>
            {affiliateLinks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No affiliate links found</p>
            ) : (
              affiliateLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{link.name}</h4>
                      <Badge variant={link.is_active ? 'default' : 'secondary'}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{link.placement_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{link.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Network: {link.network_name} • Clicks: {link.click_count}
                    </p>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {link.url.substring(0, 50)}...
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.is_active}
                      onCheckedChange={() => toggleLinkStatus(link.id, link.is_active)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
