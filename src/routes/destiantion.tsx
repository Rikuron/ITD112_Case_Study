import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/destiantion')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/destiantion"!</div>
}
