import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold">
              Clothify
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Premium clothing for the modern wardrobe. Discover curated collections
              for every style and occasion.
            </p>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">
                Subscribe to our newsletter
              </h4>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" type="email" />
                <Button>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social */}
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/shop/women"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/men"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/new"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/sale"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/help/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help/shipping"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/help/returns"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/help/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/help/size-guide"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Clothify. All rights reserved. Built with Next.js 14.</p>
        </div>
      </div>
    </footer>
  )
}

