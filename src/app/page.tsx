import LandingPage from "@/components/client/LandingPage";
import { auth } from "@/auth";

export default async function Home() {
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
      <LandingPage userDetails={userDetails} />
    </div>
  );
}
