export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string;
          role: "owner" | "caregiver" | "viewer";
          created_at: string;
        };
        Insert: {
          id: string;
          tenant_id: string;
          role: "owner" | "caregiver" | "viewer";
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          role?: "owner" | "caregiver" | "viewer";
          created_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          national_id?: string;
          dob?: string;
          sex?: string;
          diagnoses?: string;
          allergies?: string;
          chronic?: string;
          devices?: any;
          care_notes?: string;
          timezone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          national_id?: string;
          dob?: string;
          sex?: string;
          diagnoses?: string;
          allergies?: string;
          chronic?: string;
          devices?: any;
          care_notes?: string;
          timezone?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          national_id?: string;
          dob?: string;
          sex?: string;
          diagnoses?: string;
          allergies?: string;
          chronic?: string;
          devices?: any;
          care_notes?: string;
          timezone?: string;
          created_at?: string;
        };
      };
      vitals: {
        Row: {
          id: string;
          patient_id: string;
          ts_utc: string;
          bp_sys?: number;
          bp_dia?: number;
          glucose?: number;
          temp?: number;
          pulse?: number;
          spo2?: number;
          note?: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          ts_utc: string;
          bp_sys?: number;
          bp_dia?: number;
          glucose?: number;
          temp?: number;
          pulse?: number;
          spo2?: number;
          note?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          ts_utc?: string;
          bp_sys?: number;
          bp_dia?: number;
          glucose?: number;
          temp?: number;
          pulse?: number;
          spo2?: number;
          note?: string;
        };
      };
      meds: {
        Row: {
          id: string;
          patient_id: string;
          name: string;
          dose: string;
          route?: string;
          with_food?: boolean;
          times: string[];
          stock_count?: number;
          note?: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          name: string;
          dose: string;
          route?: string;
          with_food?: boolean;
          times: string[];
          stock_count?: number;
          note?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          name?: string;
          dose?: string;
          route?: string;
          with_food?: boolean;
          times?: string[];
          stock_count?: number;
          note?: string;
        };
      };
    };
  };
}
