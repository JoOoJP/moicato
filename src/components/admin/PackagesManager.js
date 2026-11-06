"use client";

import { useActionState } from "react";
import { deletePackageAction, savePackageAction } from "../../app/admin/actions";
import { FormMessage, SubmitButton } from "./ui";

const cell = "h-10 w-full border border-verdemoikato/20 bg-white px-2 text-sm focus:border-verdemoikato focus:outline-none";

function PackageRow({ pack, usage }) {
  const [state, action] = useActionState(savePackageAction, null);
  const isNew = !pack.id;
  return (
    <div className="border-b border-verdemoikato/10 py-3 last:border-b-0">
      <form action={action} className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[minmax(0,1fr)_80px_80px_80px_90px_auto]">
        {pack.id && <input type="hidden" name="id" value={pack.id} />}
        <label className="col-span-2 sm:col-span-1">
          <span className="text-xs text-verdemoikato/60">Nome</span>
          <input name="name" defaultValue={pack.name ?? ""} placeholder="Ex.: Caixinha de joia" className={cell} required />
        </label>
        <label>
          <span className="text-xs text-verdemoikato/60">Compr. (cm)</span>
          <input name="lengthCm" defaultValue={pack.lengthCm ?? ""} inputMode="numeric" className={cell} required />
        </label>
        <label>
          <span className="text-xs text-verdemoikato/60">Largura (cm)</span>
          <input name="widthCm" defaultValue={pack.widthCm ?? ""} inputMode="numeric" className={cell} required />
        </label>
        <label>
          <span className="text-xs text-verdemoikato/60">Altura (cm)</span>
          <input name="heightCm" defaultValue={pack.heightCm ?? ""} inputMode="numeric" className={cell} required />
        </label>
        <label>
          <span className="text-xs text-verdemoikato/60">Peso vazia (g)</span>
          <input name="weightG" defaultValue={pack.weightG ?? ""} inputMode="numeric" className={cell} />
        </label>
        <SubmitButton variant={isNew ? "primary" : "secondary"} pendingLabel="…" className="h-10 min-h-10">
          {isNew ? "Adicionar" : "Salvar"}
        </SubmitButton>
      </form>
      <div className="mt-1 flex items-center justify-between gap-3 text-xs">
        <span className="text-verdemoikato/50">{pack.id ? `${usage} ${usage === 1 ? "peça usa" : "peças usam"} esta embalagem` : ""}</span>
        <div className="flex items-center gap-3">
          <FormMessage state={state} />
          {pack.id && (
            <form action={deletePackageAction}>
              <input type="hidden" name="id" value={pack.id} />
              <button type="submit" className="min-h-9 text-terra-700 hover:underline">Excluir</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PackagesManager({ packages, usage }) {
  return (
    <div className="border border-verdemoikato/15 bg-white/50 px-4">
      {packages.map((pack) => (
        <PackageRow key={pack.id} pack={pack} usage={usage[pack.id] ?? 0} />
      ))}
      <div className="bg-verdemoikato/[0.03] -mx-4 px-4">
        <PackageRow key={`new-${packages.length}`} pack={{}} />
      </div>
    </div>
  );
}
