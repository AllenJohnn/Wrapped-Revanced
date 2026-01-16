import { motion } from "framer-motion";

export function SkeletonTrack() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 animate-pulse">
      <div className="w-10 h-10 bg-white/10 rounded-lg" />
      <div className="w-16 h-16 bg-white/10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonArtist() {
  return (
    <div className="flex flex-col items-center gap-3 animate-pulse">
      <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white/10 rounded-full" />
      <div className="space-y-2 w-full">
        <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
        <div className="h-3 bg-white/10 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="p-8 bg-white/5 rounded-2xl animate-pulse">
      <div className="h-16 bg-white/10 rounded mb-4" />
      <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
    </div>
  );
}
