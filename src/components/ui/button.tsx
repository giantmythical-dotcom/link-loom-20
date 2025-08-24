import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:scale-105 active:scale-95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/30 hover:scale-105 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md hover:scale-105 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
        gradient: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5 btn-glow",
        glow: "bg-primary text-primary-foreground hover:shadow-glow hover:scale-110 active:scale-95 btn-glow",
        shimmer: "bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground hover:scale-105 active:scale-95 bg-[length:200%_100%] animate-shimmer",
        floating: "bg-primary text-primary-foreground hover:shadow-elegant hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0",
        magnetic: "bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 group hover:scale-105 active:scale-95",
        ripple: "bg-primary text-primary-foreground hover:shadow-lg overflow-hidden relative before:absolute before:inset-0 before:bg-white/20 before:scale-0 hover:before:scale-100 before:transition-transform before:duration-500 before:rounded-full",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
