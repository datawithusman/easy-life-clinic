interface TreatmentCardProps {
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function TreatmentCard({ name, description, price, category }: TreatmentCardProps) {
  const categoryColors: Record<string, string> = {
    Skin: "bg-green-100 text-green-700",
    Hair: "bg-purple-100 text-purple-700",
    Laser: "bg-blue-100 text-blue-700",
    Aesthetic: "bg-pink-100 text-pink-700",
    Both: "bg-teal-100 text-teal-700",
    Other: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="card hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[category] || categoryColors.Other}`}>
          {category}
        </span>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-600">
            PKR {price.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">per session</p>
        </div>
      </div>
      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {name}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
