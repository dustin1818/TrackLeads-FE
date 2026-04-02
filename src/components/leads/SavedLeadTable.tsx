import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import type { LeadStatus, SavedLead } from "@/lib/types";

interface Props {
  leads: SavedLead[];
  search: string;
  status: string;
  sort: string;
  selectedIds: string[];
  bulkDeleting?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
  onStatusUpdate: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}

const statuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost",
];

export const SavedLeadTable = ({
  leads,
  search,
  status,
  sort,
  selectedIds,
  bulkDeleting = false,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteSelected,
  onStatusUpdate,
  onDelete,
}: Props) => {
  const allSelected = leads.length > 0 && selectedIds.length === leads.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3">
        <Button
          variant="destructive"
          size="sm"
          disabled={!selectedIds.length || bulkDeleting}
          onClick={onDeleteSelected}
        >
          {bulkDeleting
            ? "Deleting..."
            : `Delete Selected (${selectedIds.length})`}
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company or email"
        />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Company Name</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all saved leads"
                />
              </th>
              <th className="p-3">Company</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b">
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
                    className="font-medium text-slate-900 hover:text-brand hover:underline"
                  >
                    {lead.companyName}
                  </a>
                  <p className="text-xs text-slate-500">{lead.domain || "-"}</p>
                </td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <select
                      className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      value={lead.status}
                      onChange={(e) =>
                        onStatusUpdate(lead._id, e.target.value as LeadStatus)
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(lead._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!leads.length && (
          <p className="p-8 text-center text-sm text-slate-500">
            No saved leads match this filter.
          </p>
        )}
      </div>
    </div>
  );
};
