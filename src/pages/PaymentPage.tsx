import { useState, type FormEvent } from "react";
import { formatMoney, paymentMethods, type PaymentMethod } from "../catalog";
import { Icon } from "../components/Icon";
import { Scene } from "../components/Scene";
import type { Order, PaymentResult } from "../App";
import { TotalcoinCheckout } from "../totalcoin/TotalcoinCheckout";
import type { TotalcoinFinishEvent /* , TotalcoinIntentionData */ } from "../totalcoin/types";

/** Último id usado, para no tener que pegarlo en cada recarga. */
const STORAGE_KEY = "prueba-tienda:intentionId";

function readStoredId() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function storeId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Sin storage (modo privado, etc.): no pasa nada, solo no se recuerda.
  }
}

interface Props {
  order: Order;
  onBack: () => void;
  onFinished: (result: PaymentResult) => void;
}

export function PaymentPage({ order, onBack, onFinished }: Props) {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [receipt, setReceipt] = useState<string>();
  // Después de pagar ya no se puede cambiar de medio.
  const [paid, setPaid] = useState(false);
  const { trip } = order;

  // Id de la intención de pago. En una integración real lo obtiene el backend de la agencia en
  // Totalcoin, uno por reserva; para las pruebas se pega en el campo de arriba.
  // `draftId` es lo que se escribe; `intentionId`, el que usa el checkout.
  const [draftId, setDraftId] = useState(readStoredId);
  const [intentionId, setIntentionId] = useState(draftId.trim());

  const applyId = (e: FormEvent) => {
    e.preventDefault();
    const id = draftId.trim();
    setIntentionId(id);
    storeId(id);
  };

  // Antes el checkout creaba la intención con estos datos (sin uso desde el 2026-10-16).
  // const intention: TotalcoinIntentionData = {
  //   merchantId: import.meta.env.VITE_MERCHANT_ID,
  //   externalReference: order.reference,
  //   amount: trip.price,
  //   concept: `Paquete ${trip.destination} ${trip.nights} noches`,
  // };

  // El checkout no navega: cuando el comprador toca "Volver al comercio", la agencia decide adónde ir.
  // Los eventos solo actualizan la interfaz: antes de emitir los vouchers, el backend de la agencia
  // confirma el pago con la consulta de estado de Totalcoin.
  const handleFinish = ({ reason }: TotalcoinFinishEvent) => {
    if (reason === "success") onFinished({ receipt });
    else setMethod(null);
  };

  return (
    <div className="pay-layout">
      <section>
        <div className="pay-head">
          <div>
            <h1>¿Cómo querés pagar?</h1>
            <p className="muted">
              Reserva <strong>{order.reference}</strong>
            </p>
          </div>
          <button className="link" onClick={onBack} disabled={paid}>
            ← Volver a los paquetes
          </button>
        </div>

        <form className="card intention-form" onSubmit={applyId}>
          <label htmlFor="intention-id">Id de la intención (prueba)</label>
          <div className="intention-row">
            <input
              id="intention-id"
              value={draftId}
              onChange={(e) => setDraftId(e.target.value)}
              placeholder="GUID de la intención"
              spellCheck={false}
              autoComplete="off"
              disabled={paid}
            />
            <button className="btn btn-ghost" type="submit" disabled={paid || draftId.trim() === intentionId}>
              Usar
            </button>
          </div>
        </form>

        <div className="card">
          {method === null ? (
            <ul className="methods">
              {paymentMethods.map((m) => (
                <li key={m.id}>
                  <MethodRow method={m} disabled={trip.price > m.max} onClick={() => setMethod(m)} />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="selected-head">
                <MethodRow method={method} />
                <button className="btn btn-ghost" onClick={() => setMethod(null)} disabled={paid}>
                  Cambiar medio
                </button>
              </div>

              {!method.totalcoin ? (
                <p className="simulated muted">Medio simulado: el único integrado es Tarjeta vía TotalCoin.</p>
              ) : !intentionId ? (
                <p className="simulated muted">Pegá arriba el id de una intención vigente y tocá "Usar".</p>
              ) : (
                // La key reinicia el iframe cuando cambia el id: el SDK no reacciona a cambios de props.
                <TotalcoinCheckout
                  key={intentionId}
                  intentionId={intentionId}
                  onSuccess={(event) => {
                    setReceipt(event.receipt.reference);
                    setPaid(true);
                  }}
                  onError={(event) => console.warn("Totalcoin:", event)}
                  onFinish={handleFinish}
                />
              )}
            </>
          )}
        </div>
      </section>

      <aside className="card summary">
        <Scene trip={trip} />
        <p className="trip-region">{trip.region}</p>
        <h2>{trip.destination}</h2>
        <p className="muted">{trip.nights} noches</p>
        <div className="summary-total">
          <span>Total</span>
          <span>{formatMoney(trip.price)}</span>
        </div>
      </aside>
    </div>
  );
}

/** Con `onClick` es un botón; sin él, el encabezado del medio elegido. */
function MethodRow({ method, disabled, onClick }: { method: PaymentMethod; disabled?: boolean; onClick?: () => void }) {
  const content = (
    <>
      <span className="method-icon">
        <Icon name={method.icon} />
      </span>
      <span className="method-text">
        <strong>{method.title}</strong>
        <span className="muted">Vía {method.via}</span>
      </span>
      <span className="method-limits">
        <span>Mín.: {formatMoney(method.min)}</span>
        <span>Máx.: {formatMoney(method.max)}</span>
      </span>
    </>
  );
  if (!onClick) return <div className="method method-static">{content}</div>;
  return (
    <button className="method" disabled={disabled} onClick={onClick}>
      {content}
    </button>
  );
}
