import { auth, currentUser } from "@clerk/nextjs";

export default async function Dashboard() {
  const user = await currentUser();
  console.log(user);

  return <div>Dashboard</div>;
}
