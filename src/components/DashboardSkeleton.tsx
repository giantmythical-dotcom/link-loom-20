import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileSkeleton = () => (
  <Card className="glass border-0 card-elevated">
    <CardHeader className="pb-6">
      <Skeleton className="h-6 w-24" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export const LinkSkeleton = () => (
  <div className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/5">
    <Skeleton className="w-4 h-4" />
    <Skeleton className="w-8 h-8 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="w-10 h-6 rounded-full" />
      <Skeleton className="w-8 h-8" />
      <Skeleton className="w-8 h-8" />
    </div>
  </div>
);

export const LinksSkeleton = () => (
  <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <LinkSkeleton key={i} />
        ))}
      </div>
    </CardContent>
  </Card>
);

export const DashboardHeaderSkeleton = () => (
  <div className="flex justify-between items-center mb-10">
    <Skeleton className="h-10 w-32" />
    <div className="flex items-center gap-3">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-9 rounded-lg" />
      <Skeleton className="h-9 w-20" />
    </div>
  </div>
);
