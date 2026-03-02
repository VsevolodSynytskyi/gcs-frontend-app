import { Flex, Separator, Text } from '@radix-ui/themes'
import { GlassCard } from '../ui/GlassCard'
import { Compass } from './Compass'

interface NavigationCardProps {
  heading: number
  groundSpeed: number
  altitude: number
  verticalSpeed: number
}

export function NavigationCard({ heading, groundSpeed, altitude, verticalSpeed }: NavigationCardProps) {
  return (
    <GlassCard>
      <Compass heading={heading} groundSpeed={groundSpeed} />
      <Separator size="4" className="my-3" />
      <div className="grid grid-cols-2 gap-4">
        <Flex direction="column" gap="1">
          <Text size="1" color="gray" className="uppercase tracking-wider">Altitude</Text>
          <Text size="3" weight="bold" color="gray" highContrast className="font-mono">
            {altitude.toFixed(1)} m
          </Text>
        </Flex>
        <Flex direction="column" gap="1">
          <Text size="1" color="gray" className="uppercase tracking-wider">Vertical Speed</Text>
          <Text size="3" weight="bold" color="gray" highContrast className="font-mono">
            {verticalSpeed > 0 ? '+' : ''}{verticalSpeed.toFixed(1)} m/s
          </Text>
        </Flex>
      </div>
    </GlassCard>
  )
}
