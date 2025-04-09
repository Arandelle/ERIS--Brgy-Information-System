

export default function NotFound() {

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* Error graphic */}
          <div className="mb-8">
            <svg
              className="mx-auto h-40 w-40 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="mt-4 flex justify-center">
              <div className="text-7xl font-bold text-gray-900">4</div>
              <div className="text-7xl font-bold text-blue-600 mx-1">0</div>
              <div className="text-7xl font-bold text-gray-900">4</div>
            </div>
          </div>

          {/* Error message */}
          <h1 className="mt-3 text-2xl font-extrabold text-gray-900">
            Page Not Found
          </h1>
          <p className="mt-2 text-base text-gray-600">
            The page you are looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            © 2025 ERIS - Emergency Response and Information System
          </p>
        </div>
      </div>
    </div>
  );
}