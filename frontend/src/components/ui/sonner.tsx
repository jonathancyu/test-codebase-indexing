import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import * as React from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#FFFFFF",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "#D4D4D4",
          "--description-bg": "transparent",
          "--description-text": "var(--popover-foreground)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          display: 'inline-flex',
          height: '94px',
          padding: '24px 32px 24px 24px',
          alignItems: 'center',
          gap: '16px',
          flexShrink: '0',
          borderRadius: '6px',
          border: '1px solid #D4D4D4',
          background: '#FFFFFF',
          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
          color: 'hsl(var(--popover-foreground))',
        },
        classNames: {
          description: '!text-slate-600 !font-normal !text-sm !opacity-80',
          toast: '[&_[data-description]]:!text-slate-600 [&_[data-description]]:!font-normal [&_[data-description]]:!text-sm [&_[data-description]]:!opacity-80 [&_[data-action]]:!ml-auto [&_[data-action]>button]:!inline-flex [&_[data-action]>button]:!items-center [&_[data-action]>button]:!justify-center [&_[data-action]>button]:!gap-2.5 [&_[data-action]>button]:!px-4 [&_[data-action]>button]:!py-2.5 [&_[data-action]>button]:!text-sm [&_[data-action]>button]:!font-medium [&_[data-action]>button]:!rounded-md [&_[data-action]>button]:!border [&_[data-action]>button]:!bg-background [&_[data-action]>button]:!shadow-xs [&_[data-action]>button]:hover:!bg-accent [&_[data-action]>button]:hover:!text-accent-foreground',
          title: '!font-medium !text-base',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
