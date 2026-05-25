
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { vehicleStatusLabels, type VehicleType } from "@/types/VehicleType";
import {motion} from "framer-motion";


export default function VehicleCard({vehicle, searchParams}: {vehicle: VehicleType, searchParams: string}) {
    const navigate = useNavigate();
    return (

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Card 
                className="group relative md:w-70 w-85 h-[340px] overflow-hidden rounded-2xl border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                key={vehicle.id}
                onClick={() => navigate(`/catalogue/vehicle/${vehicle.id}?${searchParams}`,{})}
                >
                <img
                    src={vehicle.imageUrl ?? "/NoPicture.png"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
                    <div className="mb-3">
                    <Badge className="bg-white/20 text-white backdrop-blur-md hover:bg-white/30">
                        {vehicleStatusLabels[vehicle.status]}
                    </Badge>
                    </div>

                    <h3 className="text-2xl font-semibold tracking-tight">
                    {vehicle.brand} {vehicle.model}
                    </h3>

                    <div className="mt-2 flex items-center justify-between text-sm text-white/85">
                    <span>{vehicle.mileage.toLocaleString()} km</span>
                    <span className="text-lg font-bold text-white">
                        {vehicle.listedAmount.toLocaleString()} €
                    </span>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}