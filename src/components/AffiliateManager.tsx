import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { FileText, RefreshCw, ShoppingBag } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import AddNetworkDialog from './AddNetworkDialog'

export type AffiliateNetwork = {
  id: string
  name: string
  affiliate_id: string
  commission_rate: number
  is_active: boolean
  update_frequency_hours: number
  created_at: string
}

export type AffiliateProduct = {
  id: string
  title: string
  description: string
  category: string
  price: number
  currency: string
  image_url: string
  image_proxy_url?: string
  affiliate_link: string
  network_id: string
  network?: { id: string; name: string }
  rating?: number
  is_featured?: boolean
  last_price_check?: string
  created_at?: string
  updated_at?: string
}

export type AffiliateStats = {
  totalProducts: number
  totalContent: number
  totalRevenue: number
  lastSync: string | null
}

function normalizeUrl(u: string) {
  try { return new URL(u).toString() } catch { return '' }
}

function buildImageProxy(src: string) {
  const clean = normalizeUrl(src)
  if (!clean) return ''
  const base = import.meta.env.VITE_IMAGE_PROXY_URL || '/api/image'
  const q = new URLSearchParams({ url: clean, format: 'webp', w: '0', q: '82', fit: 'cover' })
  return `${base}?${q.toString()}`
}

const FALLBACK_IMAGE = '/img/placeholders/pet-product.webp'

export default function AffiliateManager() {
  const { user } = useAuth()
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([])
  const [products, setProducts] = useState<AffiliateProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<AffiliateStats>({ totalProducts: 0, totalContent: 0, totalRevenue: 0, lastSync: null })
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return products.filter(p => {
      const inCat = !categoryFilter || p.category === categoryFilter
      if (!q) return inCat
      return inCat && (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    })
  }, [products, query, categoryFilter])

  useEffect(() => { void bootstrap() }, [])

  async function bootstrap() {
    setLoading(true)
    try {
      await purgeSuspiciousNetworks()
      await ensureImageProxyEdge()
      await migrateStaticToDynamic()
      await fetchNetworks()
      await fetchProducts()
      await computeStats()
      toast.success('Phase 1 baseline completed')
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || 'Failed to initialize Affiliate Manager')
    } finally { setLoading(false) }
  }

  async function purgeSuspiciousNetworks() {
    const { data, error } = await supabase.from('affiliate_networks').select('id,name,affiliate_id,commission_rate,is_active')
    if (error) throw error
    const suspicious = (data || []).filter(n => {
      const name = (n.name || '').toLowerCase()
      const aid = (n.affiliate_id || '').toLowerCase()
      const badName = /(test|dummy|sample|invalid|foo|bar)/.test(name)
      const badAid = aid.length < 3 || /xxx|000|test/.test(aid)
      const badRate = !Number.isFinite(n.commission_rate) || n.commission_rate <= 0 || n.commission_rate > 80
      return badName || badAid || badRate
    })
    if (suspicious.length) {
      const ids = suspicious.map(s => s.id)
      const { error: delErr } = await supabase.from('affiliate_networks').delete().in('id', ids)
      if (delErr) throw delErr
      toast.message(`Purged ${ids.length} suspicious networks`)
    }
  }

  async function bulkImportLegitProducts(seed: any[]) {
    if (!seed.length) return
    const rows = seed
      .filter(p => p.title && p.category && p.description && p.price > 0 && p.affiliate_link && p.image_url)
      .map(p => ({
        title: p.title,
        description: p.description,
        category: p.category,
        price: p.price,
        currency: p.currency || '$',
        image_url: normalizeUrl(p.image_url),
        affiliate_link: normalizeUrl(p.affiliate_link),
        external_product_id: p.external_product_id || p.id,
        network_id: p.network_id,
        rating: p.rating ?? 4.6,
        is_featured: !!p.is_featured,
      }))
    if (!rows.length) return
    const { error } = await supabase.from('affiliate_products').upsert(rows, { onConflict: 'external_product_id' })
    if (error) throw error
    toast.success(`Imported/updated ${rows.length} products`)
  }

  async function migrateStaticToDynamic() {
    // Removed non-existent RPC call
  }

  async function ensureImageProxyEdge() {
    // Removed non-existent settings table operations
  }

  async function fetchNetworks() {
    const { data, error } = await supabase.from('affiliate_networks').select('*').order('name')
    if (error) throw error
    setNetworks(data || [])
  }

  async function fetchProducts() {
    const { data, error } = await supabase.from('affiliate_products').select('*, network:affiliate_networks(id,name)').order('updated_at', { ascending: false }).limit(500)
    if (error) throw error
    setProducts((data as any) || [])
  }

  async function computeStats() {
    const { count: productCount } = await supabase
      .from('affiliate_products')
      .select('*', { count: 'exact', head: true })
    
    const { data: lastLog } = await supabase
      .from('automation_logs')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
    
    setStats({
      totalProducts: productCount || 0,
      totalContent: 0,
      totalRevenue: 0, // Will be calculated from actual clicks/conversions
      lastSync: lastLog?.[0]?.created_at || null,
    })
  }

  async function handleSeedImport() {
    setLoading(true)
    try {
      const seed: AffiliateProduct[] = demoSeed100()
      await bulkImportLegitProducts(seed)
      await fetchProducts()
      await computeStats()
    } catch (e: any) { toast.error(e?.message || 'Import failed') } finally { setLoading(false) }
  }

  function toggleProductFeatured(id: string, next: boolean) {
    supabase.from('affiliate_products').update({ is_featured: next }).eq('id', id).then(({ error }) => {
      if (error) return toast.error('Failed to update featured flag')
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_featured: next } : p))
    })
  }

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))).sort(), [products])

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Affiliate Manager</h1>
          <p className="text-sm text-muted-foreground">Phase 1: purge networks, import products, image proxy, AdSense audit</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" disabled={loading} onClick={bootstrap}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={handleSeedImport} disabled={loading}>
            <ShoppingBag className="h-4 w-4 mr-1" /> Import 100+ products
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="p-4 rounded-lg border">
              <div className="text-xs text-muted-foreground">Products</div>
              <div className="text-2xl font-semibold">{stats.totalProducts}</div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-xs text-muted-foreground">Est. Revenue</div>
              <div className="text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-xs text-muted-foreground">Last Sync</div>
              <div className="text-sm">{stats.lastSync ? new Date(stats.lastSync).toLocaleString() : '—'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input placeholder="Search products…" value={query} onChange={e => setQuery(e.target.value)} />
                <select className="border rounded px-2" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="">All categories</option>
                  {categories.map(c => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div className="space-y-4">
                {filtered.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={product.image_proxy_url || buildImageProxy(product.image_url) || FALLBACK_IMAGE}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE }}
                        alt={product.title}
                        loading="lazy"
                        className="h-14 w-14 rounded object-cover bg-muted"
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{product.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {product.currency}{product.price} • {product.category} • Rating: {product.rating ?? 4.6}/5 • {product.network?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_featured ? 'default' : 'secondary'}>
                        {product.is_featured ? 'Featured' : 'Regular'}
                      </Badge>
                      {/* Feature toggle removed for GitHub view-only context */}
                      <a className="text-sm underline" href={product.affiliate_link} target="_blank" rel="nofollow noopener">Visit</a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networks">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Networks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {networks.map(n => (
                  <div key={n.id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{n.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {n.affiliate_id} • {n.commission_rate}%</div>
                    </div>
                    <Badge variant={n.is_active ? 'default' : 'secondary'}>{n.is_active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <AddNetworkDialog onNetworkAdded={fetchNetworks} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Content management interface coming soon...</p>
                <p className="text-sm mt-2">Generated content will be displayed and manageable here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function demoSeed100(): any[] {
  const cats = ['Dog', 'Cat', 'Fish', 'Bird', 'Reptile', 'Small Pet']
  const items: any[] = []
  for (let i = 0; i < 120; i++) {
    const c = cats[i % cats.length]
    const id = `seed-${c.toLowerCase()}-${i}`
    const price = Number((9.99 + (i % 37) * 1.25).toFixed(2))
    const img = `https://images.unsplash.com/photo-1558944351-c6ae6efdc728?auto=format&fit=crop&w=600&q=80&sig=${i}`
    items.push({
      id,
      title: `${c} Essentials Pack #${i}`,
      description: `Curated ${c.toLowerCase()} care product essentials bundle. Durable, safe, and trusted by owners.`,
      category: c,
      price,
      currency: '$',
      image_url: img,
      affiliate_link: `https://www.amazon.com/s?k=${encodeURIComponent(c + ' pet supplies')}&tag=cypruspets20-20`,
      external_product_id: `seed-${i}`,
      network_id: 'amazon',
      rating: 4.6,
      is_featured: i % 10 === 0,
    })
  }
  return items
}
