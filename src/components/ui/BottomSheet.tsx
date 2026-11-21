import type { ComponentProps } from 'react'
import { Modal } from './Modal'

/** Bottom sheet di mobile; menjadi dialog terpusat mulai 768px. */
export function BottomSheet(props: Omit<ComponentProps<typeof Modal>, 'variant'>) {
  return <Modal {...props} variant="sheet" />
}
