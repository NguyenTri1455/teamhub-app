// src/features/duty/DutyConfigDialog.jsx
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { getConfigData, updateRotationConfig } from "@/services/dutyService";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GripVertical } from "lucide-react"; // Icon để kéo

// --- Component con cho từng Item có thể kéo (SortableItem) ---
function SortableMemberItem({ member }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm"
    >
      <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-move">
        <GripVertical className="h-5 w-5" />
      </Button>
      <Avatar className="h-8 w-8 ml-2">
        <AvatarImage src={member.avatar} />
        <AvatarFallback>{member.name?.[0]}</AvatarFallback>
      </Avatar>
      <span className="ml-3 font-medium">{member.name}</span>
    </div>
  );
}
// --- Hết Component con ---


// --- Component Dialog chính ---
export function DutyConfigDialog({ onSave }) {
  const [allMembers, setAllMembers] = useState([]); // Tất cả thành viên
  const [rotationList, setRotationList] = useState([]); // List thành viên trong vòng xoay (dạng object)
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { allMembers, rotationData } = await getConfigData();
        setAllMembers(allMembers);
        setRotationList(rotationData.members); // Dùng danh sách đã có
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Logic DND-Kit ---
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setRotationList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  // --- Hết Logic DND-Kit ---

  // Xử lý khi Checkbox
  const handleCheckedChange = (checked, member) => {
    if (checked) {
      // Thêm vào danh sách xoay tua (nếu chưa có)
      if (!rotationList.some(m => m.id === member.id)) {
        setRotationList([...rotationList, member]);
      }
    } else {
      // Xóa khỏi danh sách xoay tua
      setRotationList(rotationList.filter((m) => m.id !== member.id));
    }
  };

  // Xử lý khi Lưu
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const idArray = rotationList.map(member => member.id);
      await updateRotationConfig(idArray);
      onSave(); // Gọi callback báo cho Cha
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Đang tải cấu hình...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* CỘT 1: CHỌN THÀNH VIÊN */}
      <div>
        <h3 className="font-semibold mb-2">Chọn thành viên tham gia</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
          {allMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-2">
              <Checkbox
                id={`member-${member.id}`}
                checked={rotationList.some((m) => m.id === member.id)}
                onCheckedChange={(checked) => handleCheckedChange(checked, member)}
              />
              <Label htmlFor={`member-${member.id}`}>{member.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT 2: SẮP XẾP THỨ TỰ (KÉO-THẢ) */}
      <div>
        <h3 className="font-semibold mb-2">Sắp xếp thứ tự (Kéo thả)</h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rotationList.map(m => m.id)} // Cần mảng ID
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 p-2 border rounded-md min-h-[60px]">
              {rotationList.map((member) => (
                <SortableMemberItem key={member.id} member={member} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Nút LƯU */}
      <div className="md:col-span-2 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Đang lưu..." : "Lưu Cấu Hình"}
        </Button>
      </div>
    </div>
  );
}