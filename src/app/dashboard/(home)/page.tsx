export default function Page() {
  return (
    <div className="inline-grid grid-cols-3 gap-0">
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
  )
}