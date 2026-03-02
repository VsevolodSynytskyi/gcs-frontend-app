import { Flex, Text } from '@radix-ui/themes'
import { GlassCard } from '../ui/GlassCard'

interface PositionCardProps {
  lat: number
  lon: number
}

export function PositionCard({ lat, lon }: PositionCardProps) {
  return (
    <GlassCard>
      <div className="grid grid-cols-2 gap-4">
        <Flex direction="column" gap="1">
          <Text size="1" color="gray" className="uppercase tracking-wider">Latitude</Text>
          <Text size="3" weight="bold" color="gray" highContrast className="font-mono">{lat.toFixed(7)}</Text>
        </Flex>
        <Flex direction="column" gap="1">
          <Text size="1" color="gray" className="uppercase tracking-wider">Longitude</Text>
          <Text size="3" weight="bold" color="gray" highContrast className="font-mono">{lon.toFixed(7)}</Text>
        </Flex>
      </div>
    </GlassCard>
  )
}
