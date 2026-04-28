import { useSearchParams } from "react-router"

export default function Vehicles() {
    //get last url section to determine if we are in achats or locations
    const [searchParams] = useSearchParams();
    const transactionType = searchParams.get("type") || null;
    console.log(transactionType);
    return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Vehicles</h1>
          <p>Liste des véhicules disponibles {transactionType && `en ${transactionType}`}</p>
        </div>
      </div>
    </div>
  )
}