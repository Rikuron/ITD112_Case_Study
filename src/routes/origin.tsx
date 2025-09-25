import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/origin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/origin"!</div>
}
