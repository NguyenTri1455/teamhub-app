// src/features/members/AddMemberDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import thêm DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { addMember } from "@/services/memberService";

export function AddMemberDialog({ onMemberAdded }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Dùng link ảnh avatar placeholder nếu người dùng không nhập
      const memberData = {
        name: data.name,
        phone: data.phone || "",
        avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.name}`,
      };
      
      const newMember = await addMember(memberData);
      
      // Gọi hàm callback từ cha để cập nhật UI
      if (onMemberAdded) {
        onMemberAdded(newMember);
      }
      
      reset(); // Xóa form
      setOpen(false); // Đóng dialog
    } catch (error) {
      console.error("Failed to add member:", error);
      // Bạn có thể thêm state để hiển thị lỗi ở đây
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Thêm thành viên</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thành viên mới</DialogTitle>
          <DialogDescription>
            Điền thông tin thành viên vào bên dưới.
          </DialogDescription>
        </DialogHeader>
        
        {/* Đây là Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Tên là bắt buộc" })}
              className="col-span-3"
            />
            {errors.name && <p className="col-span-4 text-red-500 text-sm text-right">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
                Điện thoại
            </Label>
            <Input
                id="phone"
                {...register("phone")}
                className="col-span-3"
                type="tel" // Gợi ý bàn phím số trên mobile
            />
            </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Link Avatar
            </Label>
            <Input
              id="avatar"
              {...register("avatar")}
              className="col-span-3"
              placeholder="Để trống để dùng ảnh ngẫu nhiên"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}