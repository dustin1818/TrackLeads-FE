import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RemovedLead } from "@/lib/types";

interface Props {
  leads: RemovedLead[];
  search: string;
  sort: string;
  selectedIds: string[];
  bulkLoading?: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onRestoreSelected: () => void;
  onRestoreAll: () => void;
  onRestore: (id: string) => void;
}

export const RemovedLeadTable = ({
  leads,
  search,
  sort,
  selectedIds,
  bulkLoading = false,
  onSearchChange,
  onSortChange,
  onToggleSelect,
  onToggleSelectAll,
  onRestoreSelected,
  onRestoreAll,
  onRestore,
}: Props) => {
  const allSelected = leads.length > 0 && selectedIds.length === leads.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <Button
          variant="outline"
          size="sm"
          disabled={!selectedIds.length || bulkLoading}
          onClick={onRestoreSelected}
        >
          {bulkLoading
            ? "Working..."
            : `Allow Selected Again (${selectedIds.length})`}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!leads.length || bulkLoading}
          onClick={onRestoreAll}
        >
          Allow All Again ({leads.length})
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:grid-cols-2">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search removed leads"
        />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Company Name</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all removed leads"
                />
              </th>
              <th className="p-3">Company</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b dark:border-slate-700">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(lead._id)}
                    onChange={() => onToggleSelect(lead._id)}
                    aria-label={`Select ${lead.companyName}`}
                  />
                </td>
                <td className="p-3">
                  <a
                    href={
                      /^https?:\/\//i.test(lead.domain)
                        ? lead.domain
                        : `https://${lead.domain}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-900 hover:text-brand hover:underline dark:text-slate-100"
                  >
                    {lead.companyName}
                  </a>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lead.domain || "-"}
                  </p>
                </td>
                <td className="p-3 dark:text-slate-300">{lead.email}</td>
                <td className="p-3">
                  <Button size="sm" onClick={() => onRestore(lead._id)}>
                    Allow Again
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!leads.length && (
          <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No removed leads match this filter.
          </p>
        )}
      </div>
    </div>
  );
};
