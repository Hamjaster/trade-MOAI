import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store";
import { uploadTrades, getTrades } from "@/store/tradeSlice";
import { TradesTable } from "@/components/dashboard/trades-table";
import toast from "react-hot-toast";

const tradeData = [
  { month: "JAN", trades: 50 },
  { month: "FEB", trades: 60 },
  { month: "MAR", trades: 70 },
  { month: "APR", trades: 55 },
  { month: "MAY", trades: 58 },
  { month: "JUN", trades: 45 },
  { month: "JUL", trades: 40 },
  { month: "AUG", trades: 48 },
  { month: "SEP", trades: 60 },
  { month: "OCT", trades: 75 },
  { month: "NOV", trades: 85 },
  { month: "DEC", trades: 65 },
];

export default function UploadTradesPage() {
  const dispatch = useAppDispatch();
  const { trades, isLoading } = useAppSelector((state) => state.trade);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    dispatch(uploadTrades(file))
      .unwrap()
      .then((res) => {
        console.log(res, "message!");
        toast.success(res.message);
        dispatch(getTrades());
        setIsDialogOpen(false);
      });
    setFile(null);
  };

  return (
    <div className="w-full mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upload Trades</h1>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search Orders" className="pl-8 w-[300px]" />
          </div>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            + Upload New Trades
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a File to Upload</DialogTitle>
          </DialogHeader>
          <Input type="file" accept=".csv" onChange={handleFileChange} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isLoading || !file}>
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Trades All Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7,156</div>
            <div className="flex items-center mt-2">
              <div className="w-full bg-blue-200 h-2 rounded-full">
                <div className="w-3/4 bg-blue-500 h-2 rounded-full" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">+4% last month</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Winning Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">514</div>
            <div className="flex items-center mt-2">
              <div className="w-full bg-green-200 h-2 rounded-full">
                <div className="w-1/2 bg-green-500 h-2 rounded-full" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">+2% last month</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Losing Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">317</div>
            <div className="flex items-center mt-2">
              <div className="w-full bg-red-200 h-2 rounded-full">
                <div className="w-1/3 bg-red-500 h-2 rounded-full" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              -12% last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trades Per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tradeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="trades" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <TradesTable trades={trades.slice(-3)} />
        </CardContent>
      </Card>
    </div>
  );
}
