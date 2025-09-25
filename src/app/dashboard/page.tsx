import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Pill,
  Calendar,
  Activity,
  Users,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Örnek veri - gerçek uygulamada API'den gelecek
  const stats = [
    {
      title: "Aktif Hastalar",
      value: "3",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Günlük İlaçlar",
      value: "12",
      icon: Pill,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Bu Hafta Randevu",
      value: "2",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Kritik Uyarılar",
      value: "1",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const recentActivities = [
    {
      type: "vital",
      patient: "Ayşe Hanım",
      action: "Tansiyon ölçümü kaydedildi (140/90)",
      time: "10 dakika önce",
      status: "warning",
    },
    {
      type: "med",
      patient: "Mehmet Bey",
      action: "Sabah ilaçları verildi",
      time: "2 saat önce",
      status: "success",
    },
    {
      type: "appointment",
      patient: "Fatma Hanım",
      action: "Kardiolog randevusu yarın",
      time: "Yarın 14:00",
      status: "info",
    },
  ];

  const upcomingMeds = [
    {
      patient: "Ayşe Hanım",
      medication: "Amlodipine 5mg",
      time: "14:00",
      status: "pending",
    },
    {
      patient: "Mehmet Bey",
      medication: "Metformin 500mg",
      time: "16:00",
      status: "pending",
    },
    {
      patient: "Fatma Hanım",
      medication: "Aspirin 100mg",
      time: "18:00",
      status: "pending",
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
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hoş geldiniz, Kullanıcı</span>
              <Button variant="outline" size="sm">
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-mucore-text">Dashboard</h2>
            <p className="text-gray-600 mt-1">
              Günlük bakım özeti ve kritik bilgiler
            </p>
          </div>
          <Button className="bg-mucore-primary hover:bg-mucore-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Hasta Ekle
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-mucore-text">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Son Aktiviteler</span>
              </CardTitle>
              <CardDescription>Son 24 saatte yapılan işlemler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg border"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "warning"
                        ? "bg-yellow-500"
                        : activity.status === "success"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.patient}</p>
                    <p className="text-gray-600 text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/activities">Tüm Aktiviteleri Gör</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5" />
                <span>Yaklaşan İlaçlar</span>
              </CardTitle>
              <CardDescription>Bugün verilecek ilaçlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMeds.map((med, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium text-sm">{med.patient}</p>
                    <p className="text-gray-600 text-sm">{med.medication}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{med.time}</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Verildi
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/medications">İlaç Listesi</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-mucore-text mb-4">
            Hızlı İşlemler
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              asChild
            >
              <Link href="/vitals/new">
                <Activity className="h-6 w-6" />
                <span>Vital Ekle</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              asChild
            >
              <Link href="/medications/new">
                <Pill className="h-6 w-6" />
                <span>İlaç Ekle</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              asChild
            >
              <Link href="/appointments/new">
                <Calendar className="h-6 w-6" />
                <span>Randevu Ekle</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              asChild
            >
              <Link href="/care/new">
                <Users className="h-6 w-6" />
                <span>Bakım Ekle</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
