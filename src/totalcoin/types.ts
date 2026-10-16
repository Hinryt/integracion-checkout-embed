// Tipos del SDK del checkout embebido de Totalcoin.
//
// El SDK no se instala desde npm: es un script que se carga desde el dominio del checkout
// ({origen}/sdk/v1/checkout.js) y define `window.TotalcoinCheckout`.
//
// Ningún evento trae datos personales (tarjeta, documento, nombre ni email).

/**
 * Sin uso desde el 2026-10-16: ahora tu backend crea la intención y le pasás al checkout el
 * `intentionId`. Datos del pago con los que el checkout creaba la intención.
 */
export interface TotalcoinIntentionData {
  /** Identificador del comercio en Totalcoin (GUID). */
  merchantId: string;
  /**
   * Referencia de la orden en el comercio (hasta 100 caracteres). Con la misma referencia se
   * reutiliza la intención vigente; si ya se pagó, el checkout responde `INTENTION_HAS_PROCESSED`.
   */
  externalReference: string;
  /** Monto en pesos, hasta 2 decimales. 0 = lo ingresa el comprador. */
  amount: number;
  /** Hasta 200 caracteres. */
  concept?: string;
  /** Datos del comprador. Los que falten se le piden en el checkout. */
  payerIdentity?: string;
  payerFirstName?: string;
  payerLastName?: string;
  payerEmail?: string;
  /** URL http/https del logo del comercio. */
  logoUrl?: string;
  /** Vencimiento en ISO 8601, hasta 30 días. Por defecto, 10 minutos. */
  expiration?: string;
}

/** La intención se cargó y el checkout está listo para pagar. */
export interface TotalcoinReadyEvent {
  intentionId: string;
  amount: number;
  variableAmount: boolean;
  externalReference: string;
}

/** Pago con tarjeta aprobado. */
export interface TotalcoinSuccessEvent {
  intentionId: string;
  externalReference: string;
  method: "card";
  receipt: { id: string; status: string; date: string; reference: string };
  installments: number;
  /** Total que paga el comprador, con el costo financiero de las cuotas. */
  totalAmount: number;
}

export type TotalcoinErrorEvent =
  /** Falló un intento de pago. El checkout muestra el error y, si `retryable`, deja reintentar. */
  | { type: "payment_error"; intentionId: string; method: "card"; code: string; retryable: boolean }
  /**
   * El checkout no pudo cargar la intención, por ejemplo `INTENTION_IS_EXPIRED`,
   * `INTENTION_HAS_PROCESSED` o `INVALID_INTENTION_DATA` (`intentionId` inválido, en `fields`).
   */
  | { type: "checkout_error"; code: string; definitive: boolean; fields?: string[] };

/** El comprador terminó: tocó "Volver al comercio" o venció la cuenta regresiva. */
export interface TotalcoinFinishEvent {
  /** `success`: pago aprobado. `error`: el checkout no pudo seguir. */
  reason: "success" | "error";
  intentionId?: string;
}

export interface TotalcoinCallbacks {
  onReady?: (event: TotalcoinReadyEvent) => void;
  onSuccess?: (event: TotalcoinSuccessEvent) => void;
  onError?: (event: TotalcoinErrorEvent) => void;
  /** Sin `onFinish`, el checkout no ofrece "Volver al comercio" y queda en la pantalla final. */
  onFinish?: (event: TotalcoinFinishEvent) => void;
}

declare global {
  interface Window {
    TotalcoinCheckout?: {
      mount: (
        container: string | HTMLElement,
        options: TotalcoinCallbacks & {
          intentionId: string;
          // intention: TotalcoinIntentionData | (() => TotalcoinIntentionData | Promise<TotalcoinIntentionData>);
        },
      ) => { destroy: () => void };
    };
  }
}
