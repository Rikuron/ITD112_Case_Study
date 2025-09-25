import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/occupation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/occupation"!</div>
}
