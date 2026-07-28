export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold mb-4">Admin Dashboard</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Welcome to the Master Control Panel. Select an option from the sidebar to manage your platform.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Projects</h3>
          <p className="text-muted-foreground mb-4">Manage marketplace projects.</p>
          <a href="/admin/projects" className="text-primary font-medium hover:underline">View Projects &rarr;</a>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Publish</h3>
          <p className="text-muted-foreground mb-4">Add new projects to the store.</p>
          <a href="/admin/projects/new" className="text-primary font-medium hover:underline">Publish Project &rarr;</a>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Requests</h3>
          <p className="text-muted-foreground mb-4">View custom project requests.</p>
          <a href="/admin/requests" className="text-primary font-medium hover:underline">View Requests &rarr;</a>
        </div>
      </div>
    </div>
  );
}
