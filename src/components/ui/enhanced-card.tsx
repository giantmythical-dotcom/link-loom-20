import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "card-elevated hover:shadow-elegant",
        glass: "glass border-0 card-elevated hover:shadow-glow",
        gradient: "bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-glow",
        floating: "card-hover-lift hover:shadow-glow",
        magnetic: "hover:scale-[1.02] hover:shadow-elegant transition-all duration-500",
        glow: "bg-card/80 backdrop-blur-sm border-primary/30 hover:shadow-glow hover:border-primary/60",
        minimal: "border-0 bg-transparent hover:bg-secondary/50",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  interactive?: boolean
  glow?: boolean
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant, size, interactive = false, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size }),
          interactive && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
          glow && "hover:shadow-glow",
          className
        )}
        {...props}
      >
        {children}
        {glow && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 via-transparent to-primary-glow/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </div>
    )
  }
)
EnhancedCard.displayName = "EnhancedCard"

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
EnhancedCardHeader.displayName = "EnhancedCardHeader"

const EnhancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight transition-colors duration-300 group-hover:text-primary",
      className
    )}
    {...props}
  />
))
EnhancedCardTitle.displayName = "EnhancedCardTitle"

const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground transition-colors duration-300", className)}
    {...props}
  />
))
EnhancedCardDescription.displayName = "EnhancedCardDescription"

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
EnhancedCardContent.displayName = "EnhancedCardContent"

const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
EnhancedCardFooter.displayName = "EnhancedCardFooter"

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
}
