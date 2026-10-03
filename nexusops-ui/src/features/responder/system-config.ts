export interface IntegrationConfig {
  name: string;
  service: string;
  connected: boolean;
  lastTestAt: number | null;
}

export const initialIntegration: IntegrationConfig = {
  name: '',
  service: 'payments-api',
  connected: false,
  lastTestAt: null,
};
