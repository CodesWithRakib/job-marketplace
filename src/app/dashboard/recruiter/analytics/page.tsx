export default function RecruiterAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-600">Track your recruitment performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Application Sources</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Job Boards</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Company Website</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Referrals</span>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Social Media</span>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: "10%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hiring Funnel</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-24 text-sm font-medium">Applied</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-medium">120</div>
            </div>
            <div className="flex items-center">
              <div className="w-24 text-sm font-medium">Screened</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-medium">72</div>
            </div>
            <div className="flex items-center">
              <div className="w-24 text-sm font-medium">Interview</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-purple-600 h-4 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-medium">36</div>
            </div>
            <div className="flex items-center">
              <div className="w-24 text-sm font-medium">Offer</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-yellow-600 h-4 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-medium">18</div>
            </div>
            <div className="flex items-center">
              <div className="w-24 text-sm font-medium">Hired</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-medium">12</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Time to Hire</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Average Time to Hire</span>
              <span className="text-sm font-medium">24 days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0 days</span>
              <span>40 days</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Fastest Hire</p>
              <p className="text-2xl font-bold">7 days</p>
              <p className="text-xs text-gray-500">Frontend Developer</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Slowest Hire</p>
              <p className="text-2xl font-bold">42 days</p>
              <p className="text-xs text-gray-500">Senior Developer</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Industry Average</p>
              <p className="text-2xl font-bold">30 days</p>
              <p className="text-xs text-gray-500">Tech Industry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
