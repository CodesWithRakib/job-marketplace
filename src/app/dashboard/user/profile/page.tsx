export default function UserProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                <span className="text-4xl text-gray-500">JD</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Change Photo
              </button>
            </div>
          </div>

          <div className="md:w-2/3">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={4}
                  defaultValue="Frontend developer with 3 years of experience in React and Next.js..."
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    john_doe_resume.pdf
                  </span>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Upload New
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
