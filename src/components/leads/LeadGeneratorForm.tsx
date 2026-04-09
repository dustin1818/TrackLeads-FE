import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  generateLeadsSchema,
  type GenerateLeadsFormData,
} from "@/lib/schemas/leadSchemas";

interface Props {
  loading: boolean;
  onGenerate: (websiteUrl: string) => void;
}

export const LeadGeneratorForm = ({ loading, onGenerate }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateLeadsFormData>({
    resolver: zodResolver(generateLeadsSchema),
    defaultValues: {
      websiteUrl: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onGenerate(values.websiteUrl))}
      className="space-y-4 rounded-lg border bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
    >
      <div>
        <Label htmlFor="websiteUrl">Your website URL</Label>
        <Input
          id="websiteUrl"
          placeholder="https://yourcompany.com"
          {...register("websiteUrl")}
        />
        {errors.websiteUrl && (
          <p className="mt-1 text-xs text-red-600">
            {errors.websiteUrl.message}
          </p>
        )}
      </div>

      <Button className="w-full sm:w-auto" disabled={loading} type="submit">
        {loading ? "Generating..." : "Generate Leads"}
      </Button>
    </form>
  );
};
