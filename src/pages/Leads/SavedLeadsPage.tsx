import { useEffect, useMemo, useState } from "react";
import { SavedLeadTable } from "@/components/leads/SavedLeadTable";
import { useLeadActions, useSavedLeads } from "@/hooks/useSavedLeads";
import type { LeadStatus } from "@/lib/types";

export const SavedLeadsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
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

  const params = useMemo(
    () => ({ search, status, sort }),
    [search, status, sort],
  );

  const { data: leads = [] } = useSavedLeads(params);
  const { updateLead, deleteLead, deleteManyLeads } = useLeadActions();

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

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected lead${selectedIds.length === 1 ? "" : "s"}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    await deleteManyLeads.mutateAsync(selectedIds);
    setSelectedIds([]);
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Saved Leads
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage lead statuses and clean your pipeline.
        </p>
      </div>

      <SavedLeadTable
        leads={leads}
        search={searchInput}
        status={status}
        sort={sort}
        selectedIds={selectedIds}
        bulkDeleting={deleteManyLeads.isPending}
        onSearchChange={setSearchInput}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        onStatusUpdate={(id, nextStatus: LeadStatus) => {
          updateLead.mutate({ id, payload: { status: nextStatus } });
        }}
        onDelete={(id) => {
          const confirmed = window.confirm(
            "Delete this lead? This action cannot be undone.",
          );
          if (!confirmed) {
            return;
          }
          deleteLead.mutate(id);
        }}
      />
    </section>
  );
};
