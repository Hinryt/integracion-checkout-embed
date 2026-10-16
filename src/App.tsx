import { useState } from "react";
import type { Trip } from "./catalog";
import { CatalogPage } from "./pages/CatalogPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { PaymentPage } from "./pages/PaymentPage";

export interface Order {
  trip: Trip;
  /** Código de reserva. Se usa como `externalReference`: uno nuevo por reserva. */
  reference: string;
}

export interface PaymentResult {
  /** Número de comprobante (`receipt.reference` de `onSuccess`). */
  receipt?: string;
}

type Page =
  | { name: "catalog" }
  | { name: "payment"; order: Order }
  | { name: "confirmation"; order: Order; result: PaymentResult };

export function App() {
  const [page, setPage] = useState<Page>({ name: "catalog" });
  const goToCatalog = () => setPage({ name: "catalog" });

  const book = (trip: Trip) =>
    setPage({ name: "payment", order: { trip, reference: "RV-" + Date.now().toString(36).toUpperCase() } });

  return (
    <>
      <header className="nav">
        <span className="brand">
          Rumbo<span className="brand-light">Viajes</span>
        </span>
      </header>

      <main>
        {page.name === "catalog" && <CatalogPage onBook={book} />}
        {page.name === "payment" && (
          <PaymentPage
            order={page.order}
            onBack={goToCatalog}
            onFinished={(result) => setPage({ name: "confirmation", order: page.order, result })}
          />
        )}
        {page.name === "confirmation" && (
          <ConfirmationPage order={page.order} result={page.result} onDone={goToCatalog} />
        )}
      </main>
    </>
  );
}
