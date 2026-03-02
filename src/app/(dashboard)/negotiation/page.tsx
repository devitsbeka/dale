"use client";

import { useState } from "react";
import { Plus, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { trpc } from "@/lib/trpc";

const inputClass =
  "rounded-lg border border-primary bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid";

export default function NegotiationPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    company: "",
    title: "",
    baseSalary: "",
    bonus: "",
    equity: "",
    signingBonus: "",
    location: "",
    remotePolicy: "",
    notes: "",
  });

  const { data: offers, refetch } = trpc.negotiation.listOffers.useQuery();
  const createOffer = trpc.negotiation.createOffer.useMutation();
  const deleteOffer = trpc.negotiation.deleteOffer.useMutation();
  const updateOffer = trpc.negotiation.updateOffer.useMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createOffer.mutateAsync({
      company: form.company,
      title: form.title,
      baseSalary: Number(form.baseSalary),
      bonus: form.bonus ? Number(form.bonus) : undefined,
      equity: form.equity ? Number(form.equity) : undefined,
      signingBonus: form.signingBonus ? Number(form.signingBonus) : undefined,
      location: form.location || undefined,
      remotePolicy: form.remotePolicy || undefined,
      notes: form.notes || undefined,
    });
    setForm({ company: "", title: "", baseSalary: "", bonus: "", equity: "", signingBonus: "", location: "", remotePolicy: "", notes: "" });
    setShowForm(false);
    refetch();
  }

  function totalComp(offer: { baseSalary: number; bonus?: number | null; equity?: number | null; signingBonus?: number | null }) {
    return offer.baseSalary + (offer.bonus ?? 0) + (offer.equity ?? 0) + (offer.signingBonus ?? 0);
  }

  const bestOffer = offers?.reduce((best, o) => totalComp(o) > totalComp(best) ? o : best, offers[0]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-sm font-semibold text-primary">Negotiation Intelligence</h1>
          <p className="text-md text-tertiary">
            Compare offers, build counter-offers, and get AI coaching
          </p>
        </div>
        <Button
          color="primary"
          size="md"
          iconLeading={Plus}
          onClick={() => setShowForm(!showForm)}
        >
          Add Offer
        </Button>
      </div>

      {/* New Offer Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
          <h2 className="text-lg font-semibold text-primary">New Offer</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <input className={inputClass} placeholder="Company *" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <input className={inputClass} placeholder="Job Title *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className={inputClass} type="number" placeholder="Base Salary *" required value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} />
            <input className={inputClass} type="number" placeholder="Annual Bonus" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
            <input className={inputClass} type="number" placeholder="Annual Equity/RSU" value={form.equity} onChange={(e) => setForm({ ...form, equity: e.target.value })} />
            <input className={inputClass} type="number" placeholder="Signing Bonus" value={form.signingBonus} onChange={(e) => setForm({ ...form, signingBonus: e.target.value })} />
            <input className={inputClass} placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <select className={inputClass} value={form.remotePolicy} onChange={(e) => setForm({ ...form, remotePolicy: e.target.value })}>
              <option value="">Remote Policy</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          <textarea
            className={inputClass + " mt-4 w-full"}
            rows={3}
            placeholder="Notes (benefits, PTO, etc.)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div className="mt-4 flex gap-3">
            <Button color="primary" size="md" type="submit" isLoading={createOffer.isPending}>
              Save Offer
            </Button>
            <Button color="secondary" size="md" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Offers Comparison */}
      {offers && offers.length > 0 ? (
        <>
          {/* Summary cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
              <p className="text-sm font-medium text-tertiary">Total Offers</p>
              <p className="mt-1 text-display-xs font-semibold text-primary">{offers.length}</p>
            </div>
            <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
              <p className="text-sm font-medium text-tertiary">Best Total Comp</p>
              <p className="mt-1 text-display-xs font-semibold text-success-primary">
                ${bestOffer ? (totalComp(bestOffer) / 1000).toFixed(0) : 0}k
              </p>
              <p className="mt-0.5 text-xs text-tertiary">{bestOffer?.company}</p>
            </div>
            <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
              <p className="text-sm font-medium text-tertiary">Avg Base Salary</p>
              <p className="mt-1 text-display-xs font-semibold text-primary">
                ${(offers.reduce((s, o) => s + o.baseSalary, 0) / offers.length / 1000).toFixed(0)}k
              </p>
            </div>
          </div>

          {/* Offer cards */}
          <div className="mt-8 flex flex-col gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-semibold text-primary">{offer.company}</h3>
                      {offer.id === bestOffer?.id && (
                        <Badge color="success" size="sm">Best Offer</Badge>
                      )}
                      {offer.accepted === true && <Badge color="brand" size="sm">Accepted</Badge>}
                      {offer.accepted === false && <Badge color="gray" size="sm">Declined</Badge>}
                    </div>
                    <p className="text-sm text-tertiary">{offer.title}</p>
                    {offer.location && (
                      <p className="text-xs text-quaternary">{offer.location}{offer.remotePolicy ? ` · ${offer.remotePolicy}` : ""}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      ${(totalComp(offer) / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-tertiary">total comp</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-tertiary">Base</p>
                    <p className="text-sm font-medium text-primary">${(offer.baseSalary / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary">Bonus</p>
                    <p className="text-sm font-medium text-primary">{offer.bonus ? `$${(offer.bonus / 1000).toFixed(0)}k` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary">Equity</p>
                    <p className="text-sm font-medium text-primary">{offer.equity ? `$${(offer.equity / 1000).toFixed(0)}k` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary">Signing</p>
                    <p className="text-sm font-medium text-primary">{offer.signingBonus ? `$${(offer.signingBonus / 1000).toFixed(0)}k` : "—"}</p>
                  </div>
                </div>

                {offer.notes && (
                  <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-sm text-tertiary">{offer.notes}</p>
                )}

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  {offer.accepted === null && (
                    <>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={async () => {
                          await updateOffer.mutateAsync({ id: offer.id, accepted: true });
                          refetch();
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={async () => {
                          await updateOffer.mutateAsync({ id: offer.id, accepted: false });
                          refetch();
                        }}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  <Button
                    color="tertiary"
                    size="sm"
                    iconLeading={Trash01}
                    onClick={async () => {
                      await deleteOffer.mutateAsync({ id: offer.id });
                      refetch();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Side-by-side comparison */}
          {offers.length >= 2 && (
            <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
              <h2 className="text-lg font-semibold text-primary">Side-by-Side Comparison</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary text-left">
                      <th className="pb-3 pr-4 font-medium text-tertiary">Component</th>
                      {offers.map((o) => (
                        <th key={o.id} className="pb-3 pr-4 font-medium text-primary">{o.company}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {["Base Salary", "Bonus", "Equity", "Signing Bonus", "Total Comp"].map((label) => (
                      <tr key={label} className="border-b border-secondary">
                        <td className="py-2 pr-4 text-tertiary">{label}</td>
                        {offers.map((o) => {
                          const val =
                            label === "Base Salary" ? o.baseSalary :
                            label === "Bonus" ? o.bonus :
                            label === "Equity" ? o.equity :
                            label === "Signing Bonus" ? o.signingBonus :
                            totalComp(o);
                          const isBest = label === "Total Comp" && o.id === bestOffer?.id;
                          return (
                            <td key={o.id} className={`py-2 pr-4 font-medium ${isBest ? "text-success-primary" : "text-primary"}`}>
                              {val ? `$${(val / 1000).toFixed(0)}k` : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : !showForm ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl bg-secondary py-16">
          <p className="text-lg font-semibold text-primary">No offers yet</p>
          <p className="text-sm text-tertiary">Add your first offer to start comparing</p>
          <Button color="primary" size="md" iconLeading={Plus} onClick={() => setShowForm(true)}>
            Add Offer
          </Button>
        </div>
      ) : null}
    </div>
  );
}
