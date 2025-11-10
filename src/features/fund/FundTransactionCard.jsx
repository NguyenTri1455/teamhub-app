// src/features/fund/FundTransactionCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
// Hàm helper định dạng tiền tệ (copy từ FundLedger.jsx)
const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export function FundTransactionCard({ transaction, onDelete }) {
  const isIncome = transaction.type === "thu";
  
  return (
    <Card className="relative">
        <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{transaction.description}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {transaction.timestamp.toDate().toLocaleString("vi-VN")}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Số dư sau GD</p>
          <p className="font-medium">
            {formatCurrency(transaction.balanceAfter)}
          </p>
        </div>
        <div
          className={`text-xl font-bold ${
            isIncome ? "text-green-600" : "text-red-600"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </div>
      </CardContent>
    </Card>
  );
}