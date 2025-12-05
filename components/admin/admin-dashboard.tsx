"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice, formatDate } from "@/lib/utils";

interface AdminDashboardProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    recentOrders: any[];
    topProducts: any[];
  };
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="flex min-h-screen bg-muted/50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Clothify Admin</h1>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
          >
            <BarChart3 className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Users className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <TrendingUp className="h-5 w-5" />
            Analytics
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back! Here's your overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                +5 added this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.name ||
                          order.user?.email ||
                          "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(order.total)}
                      </p>
                      <Badge
                        variant={
                          order.status === "DELIVERED"
                            ? "default"
                            : order.status === "CANCELLED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 border-b pb-4 last:border-0"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      {product.images?.[0]?.url && (
                        <img
                          src={product.images[0].url}
                          alt={product.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium line-clamp-1">
                        {product.name || "Unnamed Product"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.category?.name ||
                          product.categoryId ||
                          "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.sales} sold</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.basePrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
