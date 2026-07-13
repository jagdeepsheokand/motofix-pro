import useAuth from "../hooks/useAuth";

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <h1>⏳ Loading...</h1>; // ← Shows while checking

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {/* ↑ Shows user data in a nice format */}
    </div>
  );
}

export default Dashboard;