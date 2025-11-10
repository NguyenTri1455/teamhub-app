// src/features/members/MemberList.jsx
import { useState, useEffect } from "react";
import { getMembers } from "@/services/memberService";
import { AddMemberDialog } from "./AddMemberDialog";
import { MemberCard } from "./MemberCard"; 
import { MemberListSkeleton } from "./MemberListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
export function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách thành viên.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleMemberAdded = (newMember) => {
    setMembers((prevMembers) => [newMember, ...prevMembers]);
  };
    const handleMemberUpdated = (updatedMemberId, updatedData) => {
        // Cập nhật lại mảng state
        setMembers((prevMembers) =>
        prevMembers.map((member) =>
            member.id === updatedMemberId
            ? { ...member, ...updatedData } // Nếu đúng ID, thay thế data
            : member // Nếu không, giữ nguyên
        )
        );
    };
  // 2. Hàm callback XÓA
  const handleMemberDeleted = (deletedMemberId) => {
    // Lọc và xóa thành viên khỏi state
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== deletedMemberId)
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-64" /> {/* Skeleton cho Title */}
          <Skeleton className="h-10 w-32" /> {/* Skeleton cho Button */}
        </div>
        <MemberListSkeleton /> {/* <-- Dùng Skeleton */}
      </div>
    );
  }
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-start gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Danh sách Thành viên</h1>
        <AddMemberDialog onMemberAdded={handleMemberAdded} />
      </div> 
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* 3. Dùng MemberCard và truyền callback vào */}
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onMemberDeleted={handleMemberDeleted}
            onMemberUpdated={handleMemberUpdated}
          />
        ))}
      </div>
    </div>
  );
}