import { Link } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-4">
              <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
          <CardDescription className="text-base mt-2">
            The page you are looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pb-8">
          <Link to="/" className={buttonVariants({ variant: 'default', size: 'lg' })}>
            Return Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
