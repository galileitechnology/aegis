import { LucideDatabaseBackup } from "lucide-react";
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { AiOutlineLoading3Quarters } from "react-icons/ai";


async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      status: "Online",
      Database: "farm_hive",
      email: "m@example.com",
    }
  ];
}

export default async function Page() {
  const data = await getData()

  return (
    <div>
      <div className="Container p-5">
        <div className="relative w-20 pb-6">
          <Button className="sticky justify-center" variant="outline"><LucideDatabaseBackup />Update Databases</Button>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}