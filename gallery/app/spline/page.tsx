import Link from "next/link";
import { SplineSceneBasic } from "@/components/ui/splite-demo";

export const metadata = {
  title: "Interactive 3D — UI/UX Pro Max",
};

export default function SplinePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        &larr; Back to gallery
      </Link>
      <div className="mt-6">
        <SplineSceneBasic />
      </div>
    </main>
  );
}
