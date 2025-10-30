"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
                    className,
                    value,
                    ...props
                  }: React.ComponentProps<typeof ProgressPrimitive.Root>) {

  const progressValue = value || 0;

  let colorClass = "bg-destructive"; // 0-19%

  if (progressValue === 100) {
    colorClass = "bg-green-600"; // 100%
  } else if (progressValue >= 80) {
    colorClass = "bg-cyan-500"; // 80-99%
  } else if (progressValue >= 60) {
    colorClass = "bg-blue-600"; // 60-79%
  } else if (progressValue >= 40) {
    colorClass = "bg-yellow-500"; // 40-59%
  } else if (progressValue >= 20) {
    colorClass = "bg-orange-500"; // 20-39%
  }

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all",
          colorClass
        )}
        style={{ transform: `translateX(-${100 - (progressValue)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }