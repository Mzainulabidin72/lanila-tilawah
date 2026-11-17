import { Hammer } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import type { NavItem } from '@/config/nav'

export function PlaceholderPage({ item }: { item: NavItem }) {
  return (
    <Card>
      <EmptyState
        icon={item.icon ?? Hammer}
        title={`${item.label} segera hadir`}
        description={`${item.description} Fitur ini dikerjakan di fase pengembangan berikutnya.`}
      />
    </Card>
  )
}
