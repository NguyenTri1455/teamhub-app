// src/features/duty/DutyRotationSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function DutyRotationSkeleton() {
  return (
    <div className="container mx-auto p-4">
      {/* Skeleton cho Header */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-9 w-64" />
        <div className="flex space-x-2 justify-end w-full md:w-auto">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      {/* Skeleton cho Card List */}
      <Card>
        <CardContent className="space-y-4 p-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-card"
            >
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}