// src/features/members/EditMemberDialog.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { updateMember } from "@/services/memberService";

export function EditMemberDialog({ member, onMemberUpdated, open, onOpenChange }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    // ĐIỂM QUAN TRỌNG: Lấy giá trị mặc định từ 'member'
    defaultValues: {
      name: member.name,
      phone: member.phone || "",
      avatar: member.avatar || "",
    }
  });

  // Reset form khi 'member' prop thay đổi (để đảm bảo form luôn đúng)
  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        phone: member.phone || "",
        avatar: member.avatar || "",
      });
    }
  }, [member, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Dùng link ảnh avatar placeholder nếu người dùng xóa trống
      const memberData = {
        ...data,
        avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.name}`,
      };
      
      await updateMember(member.id, memberData);
      
      // Gọi hàm callback từ cha để cập nhật UI
      if (onMemberUpdated) {
        onMemberUpdated(member.id, memberData); // Gửi ID và data mới
      }
      
      onOpenChange(false); // Đóng dialog
    } catch (error) {
      console.error("Failed to update member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Dialog này được điều khiển (controlled) từ component cha
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sửa thông tin: {member.name}</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho thành viên này.
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
                type="tel"
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}