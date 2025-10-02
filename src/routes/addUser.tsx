import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/addUser')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/addUser"!</div>
}
