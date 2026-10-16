import { useEffect, useRef, useState } from "react";
import type { TotalcoinCallbacks /* , TotalcoinIntentionData */ } from "./types";

const CHECKOUT_URL = import.meta.env.VITE_CHECKOUT_URL;

let sdkLoading: Promise<void> | undefined;

/**
 * Carga el SDK una sola vez. Se carga desde el dominio del checkout, no desde el bundle:
 * el SDK solo acepta mensajes del origen del que salió su propio script.
 */
function loadSdk() {
  sdkLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${CHECKOUT_URL}/sdk/v1/checkout.js`;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkLoading = undefined;
      script.remove();
      reject(new Error(`No se pudo cargar ${script.src}`));
    };
    document.head.appendChild(script);
  });
  return sdkLoading;
}

interface Props extends TotalcoinCallbacks {
  /** Id (GUID) de la intención que creó tu backend en Totalcoin. */
  intentionId: string;
  // Antes el checkout creaba la intención con estos datos (sin uso desde el 2026-10-16).
  // intention: TotalcoinIntentionData;
}

/**
 * Monta el checkout embebido. El SDK crea el iframe dentro del div y ajusta su alto al contenido.
 * Al desmontarse llama a `destroy()`, que quita el iframe y su listener.
 *
 * El iframe se crea una sola vez: los cambios de props no lo reinician. Para cobrar otra orden (u otra
 * intención), cambiá la `key` del componente.
 */
export function TotalcoinCheckout(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  // El SDK llama siempre a las props del último render.
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    let instance: { destroy: () => void } | undefined;
    let unmounted = false;

    loadSdk()
      .then(() => {
        if (unmounted || !containerRef.current || !window.TotalcoinCheckout) return;
        instance = window.TotalcoinCheckout.mount(containerRef.current, {
          intentionId: latest.current.intentionId,
          // intention: () => latest.current.intention,
          onReady: (e) => latest.current.onReady?.(e),
          onSuccess: (e) => latest.current.onSuccess?.(e),
          onError: (e) => latest.current.onError?.(e),
          onFinish: latest.current.onFinish && ((e) => latest.current.onFinish?.(e)),
        });
      })
      .catch(() => !unmounted && setLoadError(true));

    return () => {
      unmounted = true;
      instance?.destroy();
    };
  }, []);

  if (loadError) return <p>No se pudo cargar el checkout. Probá de nuevo más tarde.</p>;
  return <div ref={containerRef} />;
}
