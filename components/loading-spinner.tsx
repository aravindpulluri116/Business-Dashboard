export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-secondary/30 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Initializing Control Center
          </h2>
          <p className="text-muted-foreground">Loading real-time data...</p>
        </div>
      </div>
    </div>
  )
}
