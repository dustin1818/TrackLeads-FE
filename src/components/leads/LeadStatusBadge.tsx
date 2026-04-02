import { Badge } from '@/components/ui/badge';
import type { LeadStatus } from '@/lib/types';

interface Props {
  status: LeadStatus;
}

const styles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-100 text-amber-700 border-amber-200',
  Qualified: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Converted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Lost: 'bg-rose-100 text-rose-700 border-rose-200',
};

export const LeadStatusBadge = ({ status }: Props) => {
  return <Badge className={styles[status]}>{status}</Badge>;
};
