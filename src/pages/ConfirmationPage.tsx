import type { Order, PaymentResult } from "../App";
import { formatMoney } from "../catalog";
import { Icon } from "../components/Icon";

interface Props {
  order: Order;
  result: PaymentResult;
  onDone: () => void;
}

export function ConfirmationPage({ order, result, onDone }: Props) {
  return (
    <section className="confirm">
      <span className="confirm-icon ok">
        <Icon name="check" size={36} />
      </span>
      <h1>¡Reserva confirmada!</h1>
      <p className="muted">Te enviamos los vouchers por email. ¡Buen viaje a {order.trip.destination}!</p>
      <dl className="card">
        <div>
          <dt>Reserva</dt>
          <dd>{order.reference}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>{formatMoney(order.trip.price)}</dd>
        </div>
        {result.receipt && (
          <div>
            <dt>Comprobante</dt>
            <dd>{result.receipt}</dd>
          </div>
        )}
      </dl>
      <button className="btn btn-primary" onClick={onDone}>
        Buscar otro viaje
      </button>
    </section>
  );
}
