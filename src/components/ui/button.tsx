import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import gsap from "gsap"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap shadow-sm shadow-[inset_0_1px_0_oklch(1_0_0_/_0.2)] transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px active:shadow-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border-border bg-transparent hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "shadow-none hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground",
        link: "shadow-none text-primary underline-offset-4 hover:underline",
        glass: "bg-black dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 text-background dark:text-foreground shadow-[inset_0_1px_0_oklch(0_0_0_/_0.05)] dark:shadow-[inset_0_1px_0_oklch(1_0_0_/_0.2)] dark:hover:bg-black/20 hover:bg-black/90 hover:scale-105",
      },
      size: {
        default:
          "h-8 gap-1.5 px-4 py-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    glowColor?: string
  }
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      glowColor = "currentColor",
      children,
      ...props
    },
    forwardedRef
  ) => {
    const Comp = asChild ? Slot.Root : "button"
    const id = React.useId()
    const innerRef = React.useRef<HTMLButtonElement>(null)
    const svgRef = React.useRef<SVGSVGElement>(null)
    const wrapperRef = React.useRef<HTMLSpanElement>(null)
    const [buttonSize, setButtonSize] = React.useState<{ width: number; height: number } | null>(null)

    // Merge refs so both forwardRef and innerRef work
    React.useImperativeHandle(forwardedRef, () => innerRef.current!)

    React.useEffect(() => {
      const button = innerRef.current
      const svg = svgRef.current
      const wrapper = wrapperRef.current
      if (!button || !svg || !wrapper) return

      setButtonSize({ width: button.offsetWidth, height: button.offsetHeight })
      const xTo = gsap.quickTo(svg, "x", { duration: 0.5, ease: "power2.out" })
      const yTo = gsap.quickTo(svg, "y", { duration: 0.5, ease: "power2.out" })

      const handleMouseMove = (e: MouseEvent) => {
        const wrapperRect = wrapper.getBoundingClientRect()
        const x = e.clientX - wrapperRect.left - wrapperRect.width / 3
        xTo(x)
        yTo(0)
      }

      button.addEventListener("mousemove", handleMouseMove)

      return () => {
        button.removeEventListener("mousemove", handleMouseMove)
      }
    }, [])

    return (
      <Comp
        ref={innerRef}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        style={{ "--glow-color": glowColor } as React.CSSProperties}
        {...props}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {!asChild ? (
          <>
            <span
              ref={wrapperRef}
              className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full ${buttonSize && buttonSize?.width < 100 ? 'blur-[10px]' : 'blur-lg'}`}
            >
              <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                className="translate-x-[50%]"
                style={{ width: buttonSize ? buttonSize.width / 2 : undefined, height: buttonSize?.height }}
              >
                <defs>
                  <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor={glowColor} />
                  </linearGradient>
                </defs>
                <rect fill={`url(#${id})`} x="30" y="30" width="100" height="50" />
              </svg>
            </span>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
