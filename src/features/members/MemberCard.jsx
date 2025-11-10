// src/features/members/MemberCard.jsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteMember } from "@/services/memberService";
import { MoreVertical, Phone } from "lucide-react"; 
import { EditMemberDialog } from "./EditMemberDialog";
export function MemberCard({ member, onMemberDeleted, onMemberUpdated }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMember(member.id);
      if (onMemberDeleted) {
        onMemberDeleted(member.id); // Gọi callback báo cho cha
      }
    } catch (error) {
      console.error("Failed to delete member:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg relative">
        {/* Nút 3 chấm (Dropdown Menu) */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>Sửa (Edit)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-500">
                Xóa (Delete)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Nội dung Card */}
        <CardHeader className="flex items-center pt-8">
          <img
            src={member.avatar || 'https://i.pravatar.cc/150'}
            alt={member.name}
            className="w-24 h-24 rounded-full mb-4"
          />
          <CardTitle>{member.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-1.5">
            <Phone className="h-4 w-4" />
            {member.phone || 'Chưa có SĐT'}
        </p>
        </CardContent>
      </Card>

      {/* Hộp thoại xác nhận Xóa */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn thành viên
              <span className="font-bold"> {member.name} </span>
              khỏi cơ sở dữ liệu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditMemberDialog
        member={member}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onMemberUpdated={onMemberUpdated}
      />
    </>
  );
}