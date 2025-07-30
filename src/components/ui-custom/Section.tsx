import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  title?: string
  subtitle?: string
  titleClassName?: string
}

export function Section({
  children,
  className,
  contentClassName,
  title,
  subtitle,
  titleClassName
}: SectionProps) {
  return (
    <section className={cn("relative", className)}>
      {(title || subtitle) && (
        <div className="space-y-4 mb-12">
          {title && <h2 className={titleClassName || "woodcraft-heading"}>{title}</h2>}
          {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center leading-relaxed">{subtitle}</p>}
        </div>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </section>
  )
}
