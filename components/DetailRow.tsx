// components/DetailRow.tsx
export default function DetailRow({ label, value }: { 
  label: string; 
  value: React.ReactNode 
}) {
  return (
    <div className="flex justify-between py-2 border-b border-purple-800/50 last:border-0">
      <span className="text-purple-400">{label}</span>
      <span className="text-purple-100 font-medium">{value}</span>
    </div>
  );
}