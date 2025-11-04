import { BedDouble, Bath, Ruler, Home } from "lucide-react";

type StatItemProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

const StatItem = ({ icon, label, value }: StatItemProps) => (
  <div className="flex items-center gap-3">
    <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center">
      <span className="text-muted-foreground">{icon}</span>
    </div>
    <div className="leading-tight">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  </div>
);
export default StatItem