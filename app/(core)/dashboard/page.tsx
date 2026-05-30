import { BarChart3, Lightbulb, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="border-b border-indigo-100/60 bg-white/50 px-6 py-8 backdrop-blur-sm lg:px-10">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          <span className="gemini-gradient-text">Dashboard</span>
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          Track validation progress across your startup ideas.
        </p>
      </header>

      <div className="flex-1 px-6 py-8 lg:px-10">
        <div className="grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-white/80 bg-white/90 gemini-card-glow">
            <CardHeader>
              <Lightbulb className="mb-2 size-8 text-indigo-600" />
              <CardTitle>Your ideas</CardTitle>
              <CardDescription>Manage and validate concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="rounded-xl gemini-btn-gradient w-full" asChild>
                <Link href="/ideas">Go to ideas</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-white/80 bg-white/90 opacity-80">
            <CardHeader>
              <TrendingUp className="mb-2 size-8 text-indigo-400" />
              <CardTitle>Validation scores</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-white/80 bg-white/90 opacity-80 sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <BarChart3 className="mb-2 size-8 text-indigo-400" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
