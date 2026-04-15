// Force dynamic rendering for login route
// Prevents build failure when Supabase env vars aren't available during static prerender
export const dynamic = "force-dynamic";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
