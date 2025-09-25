import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Pill, Calendar, Activity, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Heart,
      title: "Hasta Kartı",
      description: "Genel bilgiler, tanılar ve bakım notları",
      href: "/patients",
    },
    {
      icon: Activity,
      title: "Vital Ölçümler",
      description: "Tansiyon, şeker, ateş, nabız takibi",
      href: "/vitals",
    },
    {
      icon: Pill,
      title: "İlaç Takibi",
      description: "Doz, saatler ve otomatik bildirimler",
      href: "/medications",
    },
    {
      icon: Calendar,
      title: "Randevu Takibi",
      description: "Doktor randevuları ve hatırlatmalar",
      href: "/appointments",
    },
    {
      icon: Users,
      title: "Bakım Günlüğü",
      description: "Günlük bakım ve beslenme kayıtları",
      href: "/care",
    },
    {
      icon: Shield,
      title: "Güvenli Paylaşım",
      description: "Çoklu kullanıcı ve rol yönetimi",
      href: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-mucore-neutral">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-mucore-primary" />
              <h1 className="text-2xl font-bold text-mucore-text">
                Mucore Care
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href="/login">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-mucore-text mb-4">
            Evde Hasta Bakımını Kolaylaştırın
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            İlaç takibi, vital ölçümler, randevu hatırlatmaları ve günlük bakım
            kayıtları ile sevdiklerinizin sağlığını profesyonel bir şekilde
            takip edin.
          </p>
          <Button
            size="lg"
            className="bg-mucore-primary hover:bg-mucore-primary/90"
            asChild
          >
            <Link href="/dashboard">Hemen Başlayın</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-mucore-text mb-12">
            Temel Özellikler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-8 w-8 text-mucore-primary" />
                      <CardTitle className="text-mucore-text">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-mucore-text mb-12">
            Neden Mucore Care?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-mucore-secondary mb-2">
                7/24
              </div>
              <p className="text-gray-600">Kesintisiz takip ve bildirimler</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-mucore-secondary mb-2">
                📱
              </div>
              <p className="text-gray-600">Mobil uyumlu tasarım</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-mucore-secondary mb-2">
                🔒
              </div>
              <p className="text-gray-600">Güvenli veri saklama</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-mucore-text text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="h-6 w-6" />
            <span className="text-lg font-semibold">Mucore Care</span>
          </div>
          <p className="text-gray-300">
            Aile sağlığı için teknoloji destekli çözümler
          </p>
        </div>
      </footer>
    </div>
  );
}
