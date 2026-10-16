# Checkout embebido de Totalcoin: ejemplo con React

Agencia de viajes ficticia (Vite + React + TypeScript) que cobra sus paquetes con el checkout embebido de Totalcoin: catálogo, listado de medios de pago y confirmación.

## Archivos

| Archivo | Qué hace |
|---|---|
| `src/totalcoin/TotalcoinCheckout.tsx` | Componente que carga el SDK, monta el checkout y lo destruye al desmontarse. Se puede copiar tal cual a tu proyecto. |
| `src/totalcoin/types.ts` | Tipos de los datos del pago y de los eventos. |
| `src/pages/PaymentPage.tsx` | Uso: monta el checkout con el id de la intención al elegir "Tarjeta de crédito o débito vía TotalCoin" y reacciona a los eventos. El id sale de `VITE_INTENTION_ID`. Es el único medio real; el resto son simulados. |
| `src/App.tsx`, `src/pages/CatalogPage.tsx`, `src/pages/ConfirmationPage.tsx` | Catálogo, navegación y confirmación de la agencia. No dependen de Totalcoin. |

## Cómo funciona

1. Tu backend obtiene en Totalcoin el id de la intención de pago, uno por orden. Las credenciales de la API nunca van al navegador. En el ejemplo, el id se configura en `VITE_INTENTION_ID`.
2. `<TotalcoinCheckout intentionId={…} />` carga `{VITE_CHECKOUT_URL}/sdk/v1/checkout.js` y crea el iframe del checkout con esa intención. El SDK se carga siempre desde el dominio de Totalcoin, no se incluye en tu bundle.
   - Si la intención vence o ya se pagó, el checkout lo informa con `onError`: para volver a cobrar, creá otra intención y volvé a montar el checkout.
3. El comprador paga dentro del iframe. Eventos:
   - `onSuccess`: pago con tarjeta aprobado (trae el número de comprobante).
   - `onError`: un intento de pago falló o el checkout no pudo cargar la intención. El checkout ya le muestra el error al comprador.
   - `onFinish`: el comprador tocó "Volver al comercio" (`reason`: `success` o `error`). El checkout nunca navega: tu app decide qué mostrar.

Los eventos sirven para actualizar la interfaz, no para confirmar el pago: llegan por el navegador. Antes de entregar el pedido, confirmá del lado servidor que el pago existe y que el monto coincide con la consulta de estado de Totalcoin (`GET /api/v2/checkout/status/{externalReference}`; ver la guía de integración).

## Correr el ejemplo

1. Instalá las dependencias:

   ```bash
   npm install
   ```

2. Creá `.env.local` con el id de una intención vigente de test (en una integración real lo obtiene tu backend):

   ```
   VITE_INTENTION_ID=<GUID de la intención>
   ```

3. Levantá la app apuntando al ambiente de test (ltest). Toma el checkout de `.env.ltest`:

   ```bash
   npm run dev:ltest
   ```

4. Abrí http://localhost:5175, elegí un paquete y "Tarjeta de crédito o débito vía TotalCoin".

Para apuntar a otro checkout (por ejemplo, uno local en `http://localhost:4173`), poné `VITE_CHECKOUT_URL` en `.env.local` y usá `npm run dev`. Las variables están documentadas en `.env.example`.

Tu dominio tiene que estar habilitado en Totalcoin para embeber el checkout. Pedí el alta indicando cada origen exacto (por ejemplo, `https://www.tutienda.com`).
