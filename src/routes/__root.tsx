import { useRef } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import Header from '../components/header'
import NavBar from '../components/navBar'
import { NavBarProvider } from '../context/navBarContext'
import { useNavBarWidth } from '../hooks/useNavBarWidth'

export const Route = createRootRoute({
  component: () => {
    const headerRef = useRef<HTMLElement>(null)
    const navBarRef = useRef<HTMLElement>(null)
    const navBarWidth = useNavBarWidth(navBarRef)

    return (
      <NavBarProvider>
        <div className="app-layout flex h-screen">
          <aside className="sidebar" role="navigation" aria-label="Main navigation">
            <NavBar ref={navBarRef} />
          </aside>
          <div 
            className="main-content flex-1 flex flex-col overflow-hidden"
            style={{
              marginLeft: navBarWidth ? `${navBarWidth}px` : '4rem'
            }}
          >
            <Header ref={headerRef} />

            <main 
              className="content flex-1 overflow-auto px-4 py-2 bg-primary" 
              role="main"
            >
              <Outlet />
            </main>
          </div>
        </div>
        
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </NavBarProvider>
    )
  },
})
