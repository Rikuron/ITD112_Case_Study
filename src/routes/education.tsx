import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education"!</div>
}
