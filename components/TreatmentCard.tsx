interface TreatmentCardProps {
  name: string;
  description: string;
  price: number;
  category: string;
}

const categoryDot: Record<string, string> = {
  Skin: "bg-emerald-400",
  Hair: "bg-violet-400",
  Laser: "bg-sky-400",
  Aesthetic: "bg-rose-400",
  Both: "bg-teal-400",
  Other: "bg-gray-500",
};

export default function TreatmentCard({ name, description, price, category }: TreatmentCardProps) {
  const dot = categoryDot[category] ?? categoryDot.Other;

  return (
    <div className="gold-border-card p-6 group flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-5">
        <div className="flex items-center gap-2 pt-0.5">
          <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
          <span className="text-[11px] font-bold text-ivory/40 uppercase tracking-[0.14em]">{category}</span>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-xl text-gold-400 font-light leading-none">
            PKR {price.toLocaleString()}
          </p>
          <p className="text-ivory/22 text-[11px] mt-1">per session</p>
        </div>
      </div>
      <h3 className="text-ivory font-bold mb-2.5 leading-snug group-hover:text-gold-300 transition-colors duration-250">
        {name}
      </h3>
      <p className="text-ivory/45 text-sm leading-relaxed flex-1">{description}</p>
    </div>
  );
}
