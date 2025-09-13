import { Button } from "@/components/ui/button";

export default function Page() {
  return (
  <div className="bg-transparent">
    <div className="p-2 inline-flex gap-1 justify-center items-center">
      <img src="/images/infrastructure.png" className="h-10 pointer-events-none"/>
      <p className="text-[#303030] text-[20px]">Infrastructure</p>
    </div>
    <div className="w-[700px] grid grid-cols-3 bg-transparent pl-4 pr-4 pt-2 pb-2">
      <Button className="bg-[#111111] w-[200px] h-[35px] transform -skew-x-340 relative hover:bg-[#5200ff]">
        <p className="transform skew-x-340 text-[#dcdcdc]">&nbsp;Map</p>
      </Button>
      <Button className="bg-[#111111] w-[200px] h-[35px] transform -skew-x-340 relative hover:bg-[#5200ff]">
        <p className="transform skew-x-340 text-[#dcdcdc]">&nbsp;Datacenters</p>
      </Button> 
      <Button className="bg-[#111111] w-[200px] h-[35px] transform -skew-x-340 relative hover:bg-[#5200ff]">
        <p className="transform skew-x-340 text-[#dcdcdc]">&nbsp;Hardware</p>
      </Button> 
    </div>
    
  </div>
  )
}