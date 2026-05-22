import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center px-4">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          Compensation Intelligence
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The definitive platform for structured, analytical, and reliable compensation data.
          Stop guessing and start comparing standardized tech levels globally.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/salaries">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg">
              Explore Data
            </Button>
          </Link>
          <Link href="/compare">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg">
              Compare Salaries
            </Button>
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Standardized Levels</h3>
            <p className="text-muted-foreground">We map confusing internal titles to standardized levels (L3-L8) for apples-to-apples comparison.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Reliable Data</h3>
            <p className="text-muted-foreground">Confidence scoring and strict validation ensure you are looking at realistic compensation bands.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Deep Analytics</h3>
            <p className="text-muted-foreground">Compare offers side-by-side and dive into company-specific level distributions and medians.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
