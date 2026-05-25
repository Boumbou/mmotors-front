import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleListSkeleton() {
    return (
        <div className="flex flex-row md:justify-start justify-center flex-wrap gap-5 w-full">
            {Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="w-70 h-[340px] bg-slate-300 rounded-2xl" />
            ))}
        </div>
    )
}