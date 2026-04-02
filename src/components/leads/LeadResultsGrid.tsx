import { Skeleton } from "@/components/ui/skeleton";
import type { GeneratedLead } from "@/lib/types";
import { LeadCard } from "@/components/leads/LeadCard";

interface Props {
  leads: GeneratedLead[];
  loading: boolean;
  onSave: (lead: Omit<GeneratedLead, "isSaved">) => Promise<void>;
  onRemove: (lead: Omit<GeneratedLead, "isSaved">) => Promise<void>;
}

export const LeadResultsGrid = ({
  leads,
  loading,
  onSave,
  onRemove,
}: Props) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-10 text-center text-sm text-slate-500">
        No generated leads yet. Submit a website URL to start.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {leads.map((lead) => (
        <LeadCard
          key={`${lead.email}-${lead.domain}`}
          lead={lead}
          onSave={onSave}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
