export default function Skeleton({ className = "", variant = "text" }) {
  const base = "bg-gray-200 rounded animate-pulse";
  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-2/3",
    circle: "rounded-full",
    rect: "h-32 w-full",
    button: "h-10 w-32",
  };
  return <div className={`${base} ${variants[variant]} ${className}`} />;
}

// Compound components
Skeleton.Text = ({ className = "" }) => (
  <Skeleton variant="text" className={className} />
);
Skeleton.Title = ({ className = "" }) => (
  <Skeleton variant="title" className={className} />
);
Skeleton.Circle = ({ size = 40, className = "" }) => (
  <Skeleton
    variant="circle"
    className={`w-${size / 4} h-${size / 4} ${className}`}
    style={{ width: size, height: size }}
  />
);
Skeleton.Card = ({ rows = 3 }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
    <Skeleton.Title className="w-1/3" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton.Text key={i} />
    ))}
  </div>
);
