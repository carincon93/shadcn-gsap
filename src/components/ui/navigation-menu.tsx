
import * as React from "react"
import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"
import gsap from "gsap"

import { cn } from "@/lib/utils"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {

  const navRef = React.useRef<React.ComponentRef<typeof NavigationMenuPrimitive.Root>>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const activeItemRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const svg = svgRef.current
    const navWrapper = navRef.current
    if (!svg || !navWrapper) return

    const xTo = gsap.quickTo(svg, "x", { duration: 0.3, ease: "power2.out" })

    const moveSvgElement = (target: HTMLElement) => {
      activeItemRef.current = target
      const { left, width } = target.getBoundingClientRect()
      xTo(((left - navWrapper.getBoundingClientRect().left) + width / 2) - 75)
    }

    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const item = target.closest('[data-slot="navigation-menu-item"]') as HTMLElement
      if (item) {
        moveSvgElement(item)
      }
    }

    const items = navWrapper.querySelectorAll('[data-slot="navigation-menu-item"]') as NodeListOf<HTMLElement>
    items.forEach((item) => {
      item.addEventListener("mouseenter", handleInteraction)
      item.addEventListener("click", handleInteraction)
    })

    const observer = new ResizeObserver(() => {
      if (activeItemRef.current) {
        moveSvgElement(activeItemRef.current)

        const rect = activeItemRef.current.getBoundingClientRect()
        const navbarLeft = navWrapper.getBoundingClientRect().left

        // Also update the viewport offset during resize
        navWrapper.style.setProperty('--custom-viewport-offset', `${rect.left - navbarLeft}px`)
      }
    })
    observer.observe(navWrapper)

    return () => {
      items.forEach((item) => {
        item.removeEventListener("mouseenter", handleInteraction)
        item.removeEventListener("click", handleInteraction)
      })
      observer.disconnect()
    }
  }, [])

  return (
    <NavigationMenuPrimitive.Root
      ref={navRef}
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu fixed mx-auto inset-x-0 w-[92%] sm:w-[85%] md:w-[80%] lg:w-5xl xl:w-7xl z-50 top-4 flex flex-1 items-center justify-center rounded-xl bg-background/60 py-3 px-6 text-foreground ring-1 ring-foreground/10 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.8)]",
        className
      )}
      {...props}
    >
      <span
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full blur-lg`}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 60 120"
          height="60"
          width="120"
          style={{ transform: "translateX(-35px)" }}
        >
          <defs>
            <linearGradient id="active-link-svg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="yellow" />
              <stop offset="100%" stopColor="lime" />
            </linearGradient>
          </defs>
          <rect fill={`url(#active-link-svg)`} x="0" y="30" width="120" height="60" />
        </svg>
      </span>
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-between gap-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  const menuItemRef = React.useRef<HTMLLIElement>(null)

  React.useEffect(() => {
    const el = menuItemRef.current
    if (!el || el.children[0]?.tagName !== 'BUTTON') return

    const handleSubMenuEffect = () => {
      const rect = el.getBoundingClientRect()
      const nav = document.querySelector("nav")

      if (!nav) return

      // 1. Get the navbar left position
      const navbarLeft = nav.getBoundingClientRect().left

      const navElement = el.closest("nav")
      if (!navElement) return

      navElement.style.setProperty('--custom-viewport-offset', `${rect.left - navbarLeft}px`)
    }

    el.addEventListener("mouseenter", handleSubMenuEffect)
    el.addEventListener("click", handleSubMenuEffect)

    return () => {
      el.removeEventListener("mouseenter", handleSubMenuEffect)
      el.removeEventListener("click", handleSubMenuEffect)
    }
  }, [])

  return (
    <NavigationMenuPrimitive.Item
      ref={menuItemRef}
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full isolate z-50 flex"
      )}
      // data-slot="navigation-menu-viewport"
      style={{
        left: "var(--custom-viewport-offset, 0px)",
      }}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 md:w-(--radix-navigation-menu-viewport-width) data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none in-data-[slot=navigation-menu-content]:hover:bg-muted in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
