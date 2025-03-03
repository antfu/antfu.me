export interface QuansyncGraphNode {
  id: string
  name: string
  x: number
  y: number
  color?: 'red' | 'blue' | 'purple' | 'none'
  to?: string[]
  hover?: () => void
  blur?: () => void
}

export interface QuansyncGraphArrow {
  from: { x: number, y: number }
  to: { x: number, y: number }
  color?: 'red' | 'blue' | 'purple' | 'none'
}

export interface QuansyncGraphLink {
  id: string
  source: QuansyncGraphNode
  target: QuansyncGraphNode
  color?: 'red' | 'blue' | 'purple' | 'none'
}
