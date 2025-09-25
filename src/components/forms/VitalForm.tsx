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
import { Activity, Heart, Thermometer, Droplet } from "lucide-react";
import { format } from "date-fns";

interface VitalFormData {
  patientId: string;
  timestamp: string;
  bpSys?: number;
  bpDia?: number;
  glucose?: number;
  temp?: number;
  pulse?: number;
  spo2?: number;
  note: string;
}

interface VitalFormProps {
  patientId: string;
  patientName: string;
  initialData?: Partial<VitalFormData>;
  onSubmit: (data: VitalFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function VitalForm({
  patientId,
  patientName,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: VitalFormProps) {
  const [formData, setFormData] = useState<VitalFormData>({
    patientId,
    timestamp:
      initialData?.timestamp || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    bpSys: initialData?.bpSys,
    bpDia: initialData?.bpDia,
    glucose: initialData?.glucose,
    temp: initialData?.temp,
    pulse: initialData?.pulse,
    spo2: initialData?.spo2,
    note: initialData?.note || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (
    field: keyof VitalFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getVitalStatus = (type: string, value?: number) => {
    if (!value) return "";

    switch (type) {
      case "bpSys":
        if (value > 180) return "text-red-600";
        if (value > 140) return "text-yellow-600";
        return "text-green-600";
      case "bpDia":
        if (value > 110) return "text-red-600";
        if (value > 90) return "text-yellow-600";
        return "text-green-600";
      case "glucose":
        if (value > 250 || value < 70) return "text-red-600";
        if (value > 180 || value < 100) return "text-yellow-600";
        return "text-green-600";
      case "temp":
        if (value > 38.5 || value < 35) return "text-red-600";
        if (value > 37.5 || value < 36) return "text-yellow-600";
        return "text-green-600";
      case "pulse":
        if (value > 120 || value < 50) return "text-red-600";
        if (value > 100 || value < 60) return "text-yellow-600";
        return "text-green-600";
      case "spo2":
        if (value < 90) return "text-red-600";
        if (value < 95) return "text-yellow-600";
        return "text-green-600";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-mucore-text">
          <Activity className="h-5 w-5" />
          <span>Vital Ölçüm Ekle</span>
        </CardTitle>
        <CardDescription>
          {patientName} için vital ölçümlerini kaydedin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Zaman */}
          <div className="space-y-2">
            <Label htmlFor="timestamp">Ölçüm Zamanı</Label>
            <Input
              id="timestamp"
              type="datetime-local"
              value={formData.timestamp}
              onChange={(e) => handleInputChange("timestamp", e.target.value)}
              required
            />
          </div>

          {/* Tansiyon */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-mucore-text flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Tansiyon</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bpSys">Sistolik (mmHg)</Label>
                <Input
                  id="bpSys"
                  type="number"
                  placeholder="120"
                  min="70"
                  max="300"
                  value={formData.bpSys || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "bpSys",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  className={getVitalStatus("bpSys", formData.bpSys)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bpDia">Diastolik (mmHg)</Label>
                <Input
                  id="bpDia"
                  type="number"
                  placeholder="80"
                  min="40"
                  max="200"
                  value={formData.bpDia || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "bpDia",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  className={getVitalStatus("bpDia", formData.bpDia)}
                />
              </div>
            </div>
          </div>

          {/* Diğer Vitaller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kan Şekeri */}
            <div className="space-y-2">
              <Label htmlFor="glucose" className="flex items-center space-x-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                <span>Kan Şekeri (mg/dL)</span>
              </Label>
              <Input
                id="glucose"
                type="number"
                placeholder="120"
                min="30"
                max="500"
                value={formData.glucose || ""}
                onChange={(e) =>
                  handleInputChange(
                    "glucose",
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
                className={getVitalStatus("glucose", formData.glucose)}
              />
            </div>

            {/* Ateş */}
            <div className="space-y-2">
              <Label htmlFor="temp" className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span>Ateş (°C)</span>
              </Label>
              <Input
                id="temp"
                type="number"
                step="0.1"
                placeholder="36.5"
                min="30.0"
                max="45.0"
                value={formData.temp || ""}
                onChange={(e) =>
                  handleInputChange(
                    "temp",
                    e.target.value ? parseFloat(e.target.value) : ""
                  )
                }
                className={getVitalStatus("temp", formData.temp)}
              />
            </div>

            {/* Nabız */}
            <div className="space-y-2">
              <Label htmlFor="pulse">Nabız (atım/dk)</Label>
              <Input
                id="pulse"
                type="number"
                placeholder="72"
                min="30"
                max="200"
                value={formData.pulse || ""}
                onChange={(e) =>
                  handleInputChange(
                    "pulse",
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
                className={getVitalStatus("pulse", formData.pulse)}
              />
            </div>

            {/* SpO2 */}
            <div className="space-y-2">
              <Label htmlFor="spo2">SpO₂ (%)</Label>
              <Input
                id="spo2"
                type="number"
                placeholder="98"
                min="70"
                max="100"
                value={formData.spo2 || ""}
                onChange={(e) =>
                  handleInputChange(
                    "spo2",
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
                className={getVitalStatus("spo2", formData.spo2)}
              />
            </div>
          </div>

          {/* Notlar */}
          <div className="space-y-2">
            <Label htmlFor="note">Notlar</Label>
            <Textarea
              id="note"
              placeholder="Ölçüm sırasında gözlenen özel durumlar..."
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              rows={3}
            />
          </div>

          {/* Uyarı Mesajları */}
          {(formData.bpSys && formData.bpSys > 180) ||
          (formData.bpDia && formData.bpDia > 110) ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ Kritik tansiyon değeri! Acil müdahale gerekebilir.
              </p>
            </div>
          ) : null}

          {formData.glucose &&
          (formData.glucose > 250 || formData.glucose < 70) ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ Kritik kan şekeri değeri! Doktor ile iletişime geçin.
              </p>
            </div>
          ) : null}

          {formData.spo2 && formData.spo2 < 90 ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ Düşük oksijen satürasyonu! Acil müdahale gerekebilir.
              </p>
            </div>
          ) : null}

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
              disabled={isLoading}
            >
              {isLoading ? "Kaydediliyor..." : "Ölçümü Kaydet"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
