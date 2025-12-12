// src/features/fund/AddTransactionForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils"; // <-- THÊM
import { format } from "date-fns"; // <-- THÊM
import { vi } from "date-fns/locale"; // <-- THÊM
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // <-- THÊM
import { Calendar } from "@/components/ui/calendar"; // <-- THÊM
import { CalendarIcon } from "lucide-react"; // <-- THÊM

// Định nghĩa schema (cấu trúc) dữ liệu để validate
const formSchema = z.object({
  description: z.string().min(1, "Nội dung là bắt buộc"),
  amount: z.string().min(1, "Số tiền phải lớn hơn 0"), // Giữ nguyên là string
  type: z.enum(["thu", "chi"], { required_error: "Bạn phải chọn loại giao dịch" }),
  eventDate: z.date({ required_error: "Ngày là bắt buộc" }), // <-- THÊM
  eventTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Giờ không lệ (HH:MM)"), // <-- THÊM
});

export function AddTransactionForm({ onSubmit, onSuccess }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "0",
      type: "chi",
      eventDate: new Date(),
      eventTime: format(new Date(), "HH:mm"),
    },
  });

  const handleSubmit = async (values) => {
    try {
      // Kết hợp ngày và giờ
      const [hours, minutes] = values.eventTime.split(':');
      const eventDate = new Date(values.eventDate);
      eventDate.setHours(parseInt(hours), parseInt(minutes));
      const eventTimestamp = eventDate;

      // Chuẩn bị dữ liệu
      const dataToSubmit = {
        description: values.description,
        type: values.type,
        amount: parseInt(values.amount.replace(/\D/g, ""), 10) || 0,
        timestamp: eventTimestamp, // <-- Sửa
      };

      const newTransaction = await onSubmit(dataToSubmit);
      onSuccess(newTransaction);

      // Reset form (bao gồm cả ngày giờ về hiện tại)
      form.reset({
        description: "",
        amount: "0",
        type: "chi",
        eventDate: new Date(),
        eventTime: format(new Date(), "HH:mm"),
      });

    } catch (error) {
      console.error("Lỗi khi thêm giao dịch:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Loại giao dịch */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Loại giao dịch *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="thu" />
                    </FormControl>
                    <FormLabel className="font-normal">Thu</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="chi" />
                    </FormControl>
                    <FormLabel className="font-normal">Chi</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày giao dịch *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian * (HH:MM)</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Nội dung */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung *</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Mua tên miền" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Số tiền */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền (VND) *</FormLabel>
              <FormControl>
                <Input
                  placeholder="0"
                  // Bỏ type="number"
                  {...field} // Vẫn giữ các thuộc tính (name, onBlur...)
                  // Ghi đè onChange để định dạng
                  onChange={(e) => {
                    const value = e.target.value;
                    // 1. Xóa tất cả các ký tự không phải số
                    const digits = value.replace(/\D/g, "");

                    // Nếu rỗng, set về "0" (hoặc "" tùy bạn)
                    if (digits === "") {
                      field.onChange("0");
                      return;
                    }

                    // 2. Chuyển về số để định dạng
                    const numberValue = parseInt(digits, 10);

                    // 3. Định dạng theo kiểu Việt Nam (dùng dấu chấm)
                    const formattedValue = new Intl.NumberFormat("vi-VN").format(
                      numberValue
                    );

                    // 4. Cập nhật giá trị mới (là string đã định dạng)
                    field.onChange(formattedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu giao dịch"}
        </Button>
      </form>
    </Form>
  );
}