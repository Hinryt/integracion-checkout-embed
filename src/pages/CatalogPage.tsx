import { formatMoney, trips, type Trip } from "../catalog";
import { Icon } from "../components/Icon";
import { Scene } from "../components/Scene";

export function CatalogPage({ onBook }: { onBook: (trip: Trip) => void }) {
  return (
    <>
      <section className="hero">
        <h1>Tu próximo viaje empieza acá</h1>
        <p>Paquetes con vuelo, hotel y traslados. Pagá con tarjeta, en cuotas, sin salir del sitio.</p>
      </section>

      <div className="grid">
        {trips.map((trip) => (
          <article key={trip.id} className="trip">
            <Scene trip={trip} />
            <div className="trip-body">
              <p className="trip-region">{trip.region}</p>
              <h3>{trip.destination}</h3>
              <ul className="trip-includes">
                {trip.includes.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={14} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="trip-foot">
                <div>
                  <span className="muted small">{trip.nights} noches</span>
                  <strong className="price">{formatMoney(trip.price)}</strong>
                </div>
                <button className="btn btn-primary" onClick={() => onBook(trip)}>
                  Reservar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
