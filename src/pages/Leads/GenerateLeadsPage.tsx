import { LeadGeneratorForm } from "@/components/leads/LeadGeneratorForm";
import { LeadResultsGrid } from "@/components/leads/LeadResultsGrid";
import { useLeadGenerator } from "@/hooks/useLeadGenerator";
import { useLeadStore } from "@/store/leadStore";
import type { GeneratedLead } from "@/lib/types";

export const GenerateLeadsPage = () => {
  const { generate, saveLead, removeLead } = useLeadGenerator();
  const leads = useLeadStore((s) => s.generatedLeads);

  const handleSave = async (lead: Omit<GeneratedLead, "isSaved">) => {
    await saveLead.mutateAsync(lead);
  };

  const handleRemove = async (lead: Omit<GeneratedLead, "isSaved">) => {
    await removeLead.mutateAsync(lead);
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Generate Leads
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Find 20 companies from your website domain.
        </p>
      </div>

      <LeadGeneratorForm
        loading={generate.isPending}
        onGenerate={(websiteUrl) => {
          generate.mutate(websiteUrl);
        }}
      />

      <LeadResultsGrid
        leads={leads}
        loading={generate.isPending}
        onSave={handleSave}
        onRemove={handleRemove}
      />
    </section>
  );
};
