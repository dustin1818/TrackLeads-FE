import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/leads/CompanyLogo";
import type { GeneratedLead } from "@/lib/types";

interface Props {
  lead: GeneratedLead;
  onSave: (lead: Omit<GeneratedLead, "isSaved">) => Promise<void>;
  onRemove: (lead: Omit<GeneratedLead, "isSaved">) => Promise<void>;
}

export const LeadCard = ({ lead, onSave, onRemove }: Props) => {
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const websiteUrl = /^https?:\/\//i.test(lead.domain)
    ? lead.domain
    : `https://${lead.domain}`;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { isSaved: _isSaved, ...payload } = lead;
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const { isSaved: _isSaved, ...payload } = lead;
      await onRemove(payload);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-3">
        <CompanyLogo
          companyName={lead.companyName}
          domain={lead.domain}
          logoUrl={lead.logoUrl}
        />
        <CardTitle className="text-lg">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-900 hover:text-brand hover:underline dark:text-slate-100"
          >
            {lead.companyName}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
          {lead.description || "No description available."}
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {lead.email}
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        {lead.isSaved ? (
          <Badge className="bg-brand/15 text-brand">Already Saved</Badge>
        ) : (
          <div className="grid w-full grid-cols-2 gap-2">
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={saving || removing}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRemove}
              disabled={saving || removing}
            >
              {removing ? "Removing..." : "Remove"}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
