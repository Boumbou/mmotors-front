import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  const handleBtnClick = (type: string) => {
    navigate(`/catalogue?type=${type}&pagenumber=1&pagesize=1`);
  }

  return (
    <div className="flex basis-full flex-wrap gap-10 justify-center flex-row">
      <h1 className="flex md:basis-1/4 text-8xl font-extrabold leading-20 uppercase pt-10 mb-5">{"Roulez\navec\npassion"}</h1>
      <div className="flex flex-col md:basis-1/4 justify-center">
          <img src="/landingPageImage.png" alt="home" className="flex min-w-full rounded-lg object-contain" />
          <div className="flex flex-row gap-4 justify-center">
            <ButtonGroup className="rounded-full">
              <Button variant="outline" size="lg" className="flex h-10 rounded-full" onClick={() => handleBtnClick("locations")}>Découvrir nos véhicules en location</Button>
              <Button variant="outline" size="lg" className="flex h-10 rounded-full bg-black text-white" onClick={() => handleBtnClick("achats")}>Découvrir nos véhicules en vente</Button>
            </ButtonGroup>
          </div>
      </div>
    </div>
  )
}