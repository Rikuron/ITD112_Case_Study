import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/civilStatus')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/civilStatus"!</div>
}
