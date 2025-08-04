export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  defaultValue="Job Portal"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site URL
                </label>
                <input
                  type="text"
                  defaultValue="https://jobportal.example.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  defaultValue="admin@jobportal.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>(GMT-05:00) Eastern Time</option>
                  <option>(GMT-06:00) Central Time</option>
                  <option>(GMT-07:00) Mountain Time</option>
                  <option>(GMT-08:00) Pacific Time</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Server
                </label>
                <input
                  type="text"
                  defaultValue="smtp.jobportal.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="text"
                  defaultValue="587"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Username
                </label>
                <input
                  type="text"
                  defaultValue="notifications@jobportal.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Password
                </label>
                <input
                  type="password"
                  defaultValue="********"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span className="font-medium">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">June 15, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Environment</span>
                <span className="font-medium">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database</span>
                <span className="font-medium">PostgreSQL 14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage</span>
                <span className="font-medium">AWS S3</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Maintenance</h2>
            <div className="space-y-4">
              <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                Clear Cache
              </button>
              <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                Regenerate Thumbnails
              </button>
              <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                Optimize Database
              </button>
              <button className="w-full bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200">
                Backup System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
