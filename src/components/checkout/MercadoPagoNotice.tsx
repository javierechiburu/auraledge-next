import { CreditCard, ShieldCheck, Wallet } from "lucide-react";

export default function MercadoPagoNotice() {
  return (
    <div className="space-y-5 rounded-[22px] border border-line bg-black p-7">
      <div className="flex items-center gap-4">
        <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-grad">
          <Wallet className="h-5 w-5 text-[#1a0a00]" />
        </div>
        <div>
          <p className="font-semibold text-ink">
            Pago seguro con <span className="text-grad">Mercado Pago</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Al confirmar, te llevamos a un entorno protegido de Mercado Pago
            para pagar.
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-line pt-5 text-[13px] text-muted">
        <div className="flex items-center gap-2.5">
          <CreditCard className="h-4 w-4 flex-shrink-0 text-brand" />
          <span>Tarjetas de crédito, débito y efectivo</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 flex-shrink-0 text-brand" />
          <span>
            Tus datos de pago viajan encriptados, nunca pasan por nosotros
          </span>
        </div>
      </div>
    </div>
  );
}
