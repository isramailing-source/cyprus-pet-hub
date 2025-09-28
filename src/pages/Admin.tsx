import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import ArticleGenerator from "@/components/ArticleGenerator";
import AffiliateManager from "@/components/AffiliateManager";
import { TestPerplexityGenerator } from "@/components/TestPerplexityGenerator";
import TestAliExpressIntegration from "@/components/TestAliExpressIntegration";
import TestAmazonIntegration from "@/components/TestAmazonIntegration";
import { AdSenseTestComponent } from "@/components/ads";
import ComprehensiveSystemTest from "@/components/ComprehensiveSystemTest";
import ImageFallbackTest from "@/components/ImageFallbackTest";
import NetworkConnectivityTest from "@/components/NetworkConnectivityTest";
import AffiliateLinksManager from "@/components/admin/AffiliateLinksManager";
// Import removed - CreateAdForm not needed for blog transformation
import { supabase } from "@/integrations/supabase/client";

// Simple role-guarded Admin Dashboard with content moderation and bulk product import
const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    else if (!loading && user && !isAdmin) navigate("/");
  }, [user, loading, isAdmin, navigate]);

  // Bulk product import (CSV) -> supabase table: affiliate_products
  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      // naive CSV parser: header: title,price,url,image_url,brand,category,sku
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      const [header, ...rows] = lines;
      const cols = header.split(",").map(h => h.trim().toLowerCase());
      const required = ["title","price","url"];
      for (const r of required) if (!cols.includes(r)) {
        toast({ title: "Invalid CSV", description: `Missing column: ${r}`, variant: "destructive" });
        return;
      }
      const idx = (k: string) => cols.indexOf(k);
      const payload = rows.map((row) => {
        const parts = row.split(",");
        return {
          title: parts[idx("title")]?.trim() || "",
          price: parseFloat(parts[idx("price")] || "0") || 0,
          url: parts[idx("url")]?.trim() || "",
          image_url: parts[idx("image_url")]?.trim() || null,
          brand: parts[idx("brand")]?.trim() || null,
          category: parts[idx("category")]?.trim() || null,
          sku: parts[idx("sku")]?.trim() || null,
          created_by: user?.id || null,
        };
      }).filter(p => p.title && p.url);

      if (payload.length === 0) {
        toast({ title: "No valid rows", description: "Nothing to import.", variant: "destructive" });
        return;
      }

      const transformedPayload = payload.map(p => ({
        title: p.title,
        price: p.price,
        affiliate_link: p.url,
        external_product_id: p.sku || `import-${Date.now()}-${Math.random()}`,
        network_id: '00000000-0000-0000-0000-000000000001', // Default network
        image_url: p.image_url,
        brand: p.brand,
        category: p.category
      }));
      
      const { error } = await supabase.from("affiliate_products").insert(transformedPayload);
      if (error) throw error;
      toast({ title: "Import complete", description: `${payload.length} products imported.` });
      e.target.value = "";
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message || "Unknown error", variant: "destructive" });
      e.target.value = "";
    }
  };

  // Basic content moderation - simplified to remove database calls
  const approveContent = async () => {
    toast({ title: "Content approved", description: "Example action - no database changes" });
  };
  const rejectContent = async () => {
    toast({ title: "Content rejected", description: "Example action - no database changes" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          Loading...
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <>
        <Helmet>
          <title>Access Denied | Cyprus Pets</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 py-16">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Access Denied</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">You need administrator privileges to access this page.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Cyprus Pets</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="system-test">
                <TabsList className="flex flex-wrap gap-2">
                  <TabsTrigger value="system-test">🔍 System Test</TabsTrigger>
                  <TabsTrigger value="content">Content Moderation</TabsTrigger>
                  <TabsTrigger value="affiliate">Affiliate Management</TabsTrigger>
                  <TabsTrigger value="affiliate-links">Affiliate Links</TabsTrigger>
                  <TabsTrigger value="amazon">Amazon Test</TabsTrigger>
                  <TabsTrigger value="adsense">AdSense Test</TabsTrigger>
                  <TabsTrigger value="aliexpress">AliExpress Test</TabsTrigger>
                  <TabsTrigger value="products">Bulk Product Import</TabsTrigger>
                  <TabsTrigger value="articles">Article Generation</TabsTrigger>
                  <TabsTrigger value="perplexity">Perplexity Test</TabsTrigger>
                  <TabsTrigger value="images">Image Assets</TabsTrigger>
                  <TabsTrigger value="network">Network Test</TabsTrigger>
                </TabsList>

                <TabsContent value="system-test" className="mt-4">
                  <ComprehensiveSystemTest />
                </TabsContent>

                <TabsContent value="content" className="mt-4">
                  <p className="mb-2 text-sm text-muted-foreground">Approve or reject pending items.</p>
                  {/* Example controls; real list should be separate component with data fetching */}
                  <div className="flex gap-2">
                    <Button onClick={approveContent}>Approve Example Topic</Button>
                    <Button variant="destructive" onClick={rejectContent}>Reject Example Topic</Button>
                  </div>
                </TabsContent>

                <TabsContent value="affiliate" className="mt-4">
                  <AffiliateManager />
                </TabsContent>

                <TabsContent value="affiliate-links" className="mt-4">
                  <AffiliateLinksManager />
                </TabsContent>

                <TabsContent value="amazon" className="mt-4">
                  <TestAmazonIntegration />
                </TabsContent>

                <TabsContent value="adsense" className="mt-4">
                  <AdSenseTestComponent />
                </TabsContent>

                <TabsContent value="aliexpress" className="mt-4">
                  <TestAliExpressIntegration />
                </TabsContent>

                <TabsContent value="products" className="mt-4">
                  <div className="space-y-3">
                    <Label htmlFor="bulk-file">Upload CSV</Label>
                    <Input id="bulk-file" type="file" accept=".csv,text/csv" onChange={handleBulkImport} />
                    <p className="text-xs text-muted-foreground">Required columns: title, price, url. Optional: image_url, brand, category, sku.</p>
                  </div>
                </TabsContent>

                <TabsContent value="articles" className="mt-4">
                  <ArticleGenerator />
                </TabsContent>

                <TabsContent value="perplexity" className="mt-4">
                  <TestPerplexityGenerator />
                </TabsContent>

                <TabsContent value="images" className="mt-4">
                  <ImageFallbackTest />
                </TabsContent>

                <TabsContent value="network" className="mt-4">
                  <NetworkConnectivityTest />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Admin;
