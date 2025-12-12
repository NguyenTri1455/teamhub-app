// src/features/utilities/AddEventForm.jsx
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
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Tiếng Việt
import { useEffect } from "react";

// Định nghĩa schema (cấu trúc) dữ liệu
const formSchema = z.object({
  title: z.string().min(1, "Tên sự kiện là bắt buộc"),
  eventDate: z.date({ required_error: "Ngày diễn ra là bắt buộc" }),
  eventTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Giờ không lệ (HH:MM)"),
  location: z.string().min(1, "Địa điểm là bắt buộc"),
  description: z.string().optional(),
});
const extractTime = (date) => format(date, "HH:mm");
export function AddEventForm({ onSubmit, onSuccess, eventToEdit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    // SỬA LẠI defaultValues
    defaultValues: {
      title: eventToEdit?.title || "",
      eventDate: eventToEdit ? eventToEdit.eventTimestamp : undefined,
      eventTime: eventToEdit ? extractTime(eventToEdit.eventTimestamp) : "18:00",
      location: eventToEdit?.location || "",
      description: eventToEdit?.description || "",
    },
  });
  useEffect(() => {
    // Reset form khi eventToEdit thay đổi
    if (eventToEdit) {
      form.reset({
        title: eventToEdit.title,
        eventDate: eventToEdit.eventTimestamp,
        eventTime: extractTime(eventToEdit.eventTimestamp),
        location: eventToEdit.location,
        description: eventToEdit.description || "",
      });
    } else {
      // Reset về rỗng khi thêm mới
      form.reset({
        title: "",
        eventDate: undefined,
        eventTime: "18:00",
        location: "",
        description: "",
      });
    }
  }, [eventToEdit, form.reset]);
  const handleSubmit = async (values) => {
    try {
      // --- XỬ LÝ KẾT HỢP NGÀY VÀ GIỜ ---
      const [hours, minutes] = values.eventTime.split(':');
      const eventDate = new Date(values.eventDate);
      eventDate.setHours(parseInt(hours), parseInt(minutes));

      const eventTimestamp = eventDate; //.toISOString(); TypeORM handles Date object fine usually
      // --- Xong xử lý ---

      const dataToSubmit = {
        title: values.title,
        location: values.location,
        description: values.description,
        eventTimestamp: eventTimestamp,
      };

      await onSubmit(dataToSubmit); // Gọi hàm addEvent
      onSuccess(); // Báo cho cha biết đã thành công
      form.reset();
    } catch (error) {
      console.error("Lỗi khi thêm sự kiện:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Tên sự kiện */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sự kiện *</FormLabel>
              <FormControl>
                <Input placeholder="Tiệc BBQ cuối tháng" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Ngày diễn ra (Dùng Popover Calendar) */}
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày diễn ra *</FormLabel>
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
        {/* Thời gian */}
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
        {/* Địa điểm */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa điểm *</FormLabel>
              <FormControl>
                <Input placeholder="Sân thượng văn phòng" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Mô tả */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Chi tiết về sự kiện..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu sự kiện"}
        </Button>
      </form>
    </Form>
  );
}