import { auth, currentUser } from "@clerk/nextjs";

export default async function Dashboard() {
  const user = await currentUser();

  return <div>Dashboard</div>;
}
