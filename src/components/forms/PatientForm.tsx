"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PatientFormData {
  name: string;
  nationalId: string;
  dob: string;
  sex: string;
  diagnoses: string;
  allergies: string;
  chronic: string;
  careNotes: string;
}

interface PatientFormProps {
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PatientForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    name: initialData?.name || "",
    nationalId: initialData?.nationalId || "",
    dob: initialData?.dob || "",
    sex: initialData?.sex || "",
    diagnoses: initialData?.diagnoses || "",
    allergies: initialData?.allergies || "",
    chronic: initialData?.chronic || "",
    careNotes: initialData?.careNotes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-mucore-text">
          {initialData ? "Hasta Bilgilerini Düzenle" : "Yeni Hasta Ekle"}
        </CardTitle>
        <CardDescription>
          Hasta ile ilgili temel bilgileri ve sağlık durumunu girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Örn: Ayşe Yılmaz"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalId">TC Kimlik No</Label>
              <Input
                id="nationalId"
                type="text"
                placeholder="12345678901"
                maxLength={11}
                value={formData.nationalId}
                onChange={(e) =>
                  handleInputChange("nationalId", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Doğum Tarihi</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Cinsiyet</Label>
              <Select
                value={formData.sex}
                onValueChange={(value) => handleInputChange("sex", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cinsiyet seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kadın">Kadın</SelectItem>
                  <SelectItem value="erkek">Erkek</SelectItem>
                  <SelectItem value="diğer">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sağlık Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-mucore-text">
              Sağlık Bilgileri
            </h3>

            <div className="space-y-2">
              <Label htmlFor="diagnoses">Tanılar</Label>
              <Textarea
                id="diagnoses"
                placeholder="Örn: Hipertansiyon, Diyabet Tip 2, Kalp yetmezliği"
                value={formData.diagnoses}
                onChange={(e) => handleInputChange("diagnoses", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Alerjiler</Label>
              <Textarea
                id="allergies"
                placeholder="Örn: Penisilin, Polen, Kedi tüyü"
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chronic">Kronik Hastalıklar</Label>
              <Textarea
                id="chronic"
                placeholder="Örn: Kronik böbrek yetmezliği, KOAH"
                value={formData.chronic}
                onChange={(e) => handleInputChange("chronic", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="careNotes">Bakım Notları</Label>
              <Textarea
                id="careNotes"
                placeholder="Özel bakım gereksinimleri, önemli notlar..."
                value={formData.careNotes}
                onChange={(e) => handleInputChange("careNotes", e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-mucore-primary hover:bg-mucore-primary/90"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
