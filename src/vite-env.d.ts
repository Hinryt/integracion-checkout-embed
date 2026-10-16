/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHECKOUT_URL: string;
  /** Id (GUID) de la intención de pago. En una integración real lo da tu backend. */
  readonly VITE_INTENTION_ID?: string;
}
