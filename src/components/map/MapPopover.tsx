import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export interface MapPopoverItem {
  label: string
  icon?: ReactNode
  disabled?: boolean
  onClick: () => void
}

interface MapPopoverProps {
  open: boolean
  x: number
  y: number
  items: MapPopoverItem[]
  onClose: () => void
}

export function MapPopover({
  open,
  x,
  y,
  items,
  onClose,
}: MapPopoverProps) {
  return (
    <Popover key={`${x}-${y}`} open={open} onOpenChange={(o) => !o && onClose()}>
      <PopoverAnchor asChild>
        <div
          className="pointer-events-none absolute"
          style={{ left: x, top: y }}
        />
      </PopoverAnchor>
      <PopoverContent
        className="w-auto p-1"
        side="bottom"
        sideOffset={8}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-stretch">
          <div className="flex flex-col">
            {items.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </div>
          <div className="bg-border mx-1 w-px self-stretch" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
