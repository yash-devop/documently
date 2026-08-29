"use client";
import { authClient } from "../lib/better-auth";

export default function Home() {
  const { data } = authClient.useSession();
  const handleLogout = async () => {
    await authClient.signOut();
  };

  console.log("data", data);
  return (
    <div>
      <span>Home page</span>
      <span>{JSON.stringify(data?.user.email)}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
