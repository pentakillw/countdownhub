import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-bg-muted rounded-xl shadow-sm overflow-hidden border border-border-default h-full flex flex-col animate-pulse">
      {/* Imagen Skeleton */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700/50"></div>
      
      <div className="p-5 flex flex-col flex-grow">
        {/* Badge Platform Skeleton */}
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700/50 rounded-full mb-4 self-end"></div>
        
        {/* Title Skeleton */}
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700/50 rounded mb-2"></div>
        <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700/50 rounded mb-6"></div>
        
        <div className="flex-grow"></div>
        
        {/* Footer info Skeleton */}
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-border-default border-dashed">
           <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700/50 rounded"></div>
           <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700/50 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;