import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-mucore-neutral flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="h-10 w-10 text-mucore-primary" />
            <h1 className="text-3xl font-bold text-mucore-text">Mucore Care</h1>
          </div>
          <p className="text-gray-600">Evde hasta bakım takip sistemi</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Giriş Yap</CardTitle>
            <CardDescription className="text-center">
              Hesabınıza giriş yapın veya yeni hesap oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="rounded" />
                <Label htmlFor="remember" className="text-sm">
                  Beni hatırla
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-mucore-primary hover:underline"
              >
                Şifremi unuttum
              </Link>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full bg-mucore-primary hover:bg-mucore-primary/90"
                asChild
              >
                <Link href="/dashboard">Giriş Yap</Link>
              </Button>
              <Button variant="outline" className="w-full">
                Google ile Giriş Yap
              </Button>
            </div>
            <div className="text-center text-sm">
              <span className="text-gray-600">Hesabınız yok mu? </span>
              <Link
                href="/register"
                className="text-mucore-primary hover:underline"
              >
                Kayıt Ol
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Mucore Care. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  );
}
