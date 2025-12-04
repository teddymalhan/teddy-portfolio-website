/**
 * Example component demonstrating Zustand usage
 * This is a reference implementation - you can delete this file once you understand the pattern
 */

"use client"

import { useUIStore } from "@/stores"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ZustandExample() {
  // Option 1: Subscribe to specific values (recommended - only re-renders when these change)
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  // Option 2: Subscribe to multiple values
  const { openModal, closeModal, isModalOpen } = useUIStore()

  // Option 3: Get the entire store (use sparingly - re-renders on any change)
  // const store = useUIStore()

  const handleModalToggle = () => {
    if (isModalOpen("example")) {
      closeModal("example")
    } else {
      openModal("example")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Zustand Example</CardTitle>
        <CardDescription>
          Demonstrating Zustand state management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm">
            Sidebar is: <strong>{sidebarOpen ? "Open" : "Closed"}</strong>
          </p>
          <Button onClick={toggleSidebar} variant="outline" className="w-full">
            Toggle Sidebar
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            Modal is: <strong>{isModalOpen("example") ? "Open" : "Closed"}</strong>
          </p>
          <Button onClick={handleModalToggle} variant="outline" className="w-full">
            Toggle Modal
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Open Redux DevTools to see Zustand state changes
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
