import { auth } from "@/auth";
import dynamic from "next/dynamic";

// Dynamically import ClientPage as it is a client-side component
const ClientPage = dynamic(() => import("./clientPage"), {
  ssr: false, // This prevents server-side rendering
});

export default async function LandingPage() {
  const session = await auth();
  let userDetails = null;

  if (session?.user) {
    console.log(`USER SESSION: ${session.user.email}`);
    userDetails = {
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      avatarUrl: session.user.image ?? "",
    };
  }

  return (
    <div>
      <ClientPage userDetails={userDetails} />
    </div>
  );
}
