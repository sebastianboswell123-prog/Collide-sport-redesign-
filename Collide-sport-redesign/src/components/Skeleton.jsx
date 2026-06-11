import React from "react";

const variantClasses = {
  rect: "rounded-md",
  circle: "rounded-full",
  text: "rounded h-4 w-full",
};

function Skeleton({ className = "", variant = "rect" }) {
  return (
    <div
      className={`bg-lavender-dark/60 animate-skeleton ${variantClasses[variant] || variantClasses.rect} ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Skeleton variant="rect" className="aspect-square w-full rounded-2xl" />
      <Skeleton variant="text" className="h-4 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/4" />
      <Skeleton variant="rect" className="h-10 w-full rounded-full" />
    </div>
  );
}

export default Skeleton;
