import { Button } from "@/components/ui/button";

export default function Page() {
  return (
  <div className="bg-transparent">
    <div className="p-2 inline-flex gap-1 justify-center items-center">
      <img src="/images/analytics logo.png" className="h-15 pointer-events-none"/>
      <p className="text-[#303030] text-[20px]">Analytics</p>
    </div>
    <div className="w-[700px] grid grid-cols-3 bg-transparent pl-4 pr-4 pt-2 pb-2">
      <Button className="bg-[#111111] w-[200px] h-[35px] transform -skew-x-340 relative hover:bg-[#5200ff]">
        <p className="transform skew-x-340 text-[#dcdcdc]">&nbsp;Dashboard</p>
      </Button>
      <Button className="bg-[#111111] w-[200px] h-[35px] transform -skew-x-340 relative hover:bg-[#5200ff]">
        <p className="transform skew-x-340 text-[#dcdcdc]">&nbsp;Dashboard</p>
      </Button> 
      <Button className="bg-[#111111] w-[200px] h-[35px] transform -skew-x-340 relative hover:bg-[#5200ff]">
        <p className="transform skew-x-340 text-[#dcdcdc]">&nbsp;Dashboard</p>
      </Button> 
    </div>
    <div className="grid grid-cols-3 gap-4 bg-transparent w-[900px]">
      <div className="w-[300px] h-[150px] p-2">
        <div className="w-[100%] h-[100%] bg-[#111111] border-1">
          <p className="pl-2 text-[#909090] text-[15px]">Requests Lifeline</p>
          <p className="pl-2 text-[#2bff00] text-[50px] pt-2 ">No data</p>
        </div>
      </div>
      <div className="w-[300px] h-[150px] p-2">
        <div className="w-[100%] h-[100%] bg-[#111111] border-1">
          <p className="pl-2 text-[#909090] text-[15px]">Databases Lifeline</p>
          <p className="pl-2 text-[#2bff00] text-[50px] pt-2 ">No data</p>
        </div>
      </div>
      <div className="w-[300px] h-[150px] p-2">
        <div className="w-[100%] h-[100%] bg-[#111111] border-1">
          <p className="pl-2 text-[#909090] text-[15px]">Offline Applications</p>
          <p className="pl-2 text-[#2bff00] text-[50px] pt-2 ">No data</p>
        </div>
      </div>
    </div>
  </div>
  )
}