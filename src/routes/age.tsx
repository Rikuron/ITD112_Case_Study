import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/age')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/age"!</div>
}
