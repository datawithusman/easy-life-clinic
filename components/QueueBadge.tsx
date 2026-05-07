interface QueueBadgeProps {
  number: number;
  size?: "sm" | "md" | "lg";
}

export default function QueueBadge({ number, size = "md" }: QueueBadgeProps) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-20 h-20 text-3xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary-500 text-white font-bold flex items-center justify-center shadow-lg`}
    >
      #{number}
    </div>
  );
}
