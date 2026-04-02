import { useEffect, useMemo, useState } from "react";
import { RemovedLeadTable } from "@/components/leads/RemovedLeadTable";
import {
  useRemovedLeadActions,
  useRemovedLeads,
} from "@/hooks/useRemovedLeads";

export const RemovedLeadsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const params = useMemo(() => ({ search, sort }), [search, sort]);
  const { data: leads = [] } = useRemovedLeads(params);
  const { restoreLead, restoreManyLeads } = useRemovedLeadActions();

  useEffect(() => {
    const visibleIds = new Set(leads.map((lead) => lead._id));
    setSelectedIds((prev) => prev.filter((id) => visibleIds.has(id)));
  }, [leads]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.length === leads.length) {
        return [];
      }
      return leads.map((lead) => lead._id);
    });
  };

  const handleRestoreSelected = async () => {
    if (!selectedIds.length) {
      return;
    }
    await restoreManyLeads.mutateAsync(selectedIds);
    setSelectedIds([]);
  };

  const handleRestoreAll = async () => {
    const allIds = leads.map((lead) => lead._id);
    if (!allIds.length) {
      return;
    }
    await restoreManyLeads.mutateAsync(allIds);
    setSelectedIds([]);
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Removed Leads</h2>
        <p className="text-sm text-slate-500">
          Leads listed here are excluded from future generation results.
        </p>
      </div>

      <RemovedLeadTable
        leads={leads}
        search={searchInput}
        sort={sort}
        selectedIds={selectedIds}
        bulkLoading={restoreManyLeads.isPending}
        onSearchChange={setSearchInput}
        onSortChange={setSort}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onRestoreSelected={handleRestoreSelected}
        onRestoreAll={handleRestoreAll}
        onRestore={(id) => {
          restoreLead.mutate(id);
        }}
      />
    </section>
  );
};
