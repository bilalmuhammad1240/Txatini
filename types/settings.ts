export interface Setting {
  key: string;
  value: string;
  label: string | null;
  updated_at: string;
}

export type SettingsMap = Record<string, string>;

// Chaves conhecidas para autocompletar no código
export type SettingKey =
  | 'whatsapp_number'
  | 'store_name'
  | 'store_tagline'
  | 'default_commission'
  | 'mpesa_number'
  | 'mpesa_name'
  | 'delivery_fee';
