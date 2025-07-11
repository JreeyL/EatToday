'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function TestErrorPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  // Test JavaScript error
  const testJavaScriptError = () => {
    try {
      // Intentionally throw a JavaScript error
      throw new Error('This is a test JavaScript error');
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          test_type: 'javascript_error',
          page: 'test-error',
        },
        extra: {
          error_message: error.message,
          stack: error.stack,
        },
      });
      setTestResults((prev) => [...prev, '✅ JavaScript error captured to Sentry']);
    }
  };

  // Test API call error
  const testApiError = async() => {
    try {
      const response = await fetch('http://127.0.0.1:8000/non-existent-endpoint');
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          test_type: 'api_error',
          page: 'test-error',
        },
        extra: {
          error_message: error.message,
          endpoint: '/non-existent-endpoint',
        },
      });
      setTestResults((prev) => [...prev, '✅ API error captured to Sentry']);
    }
  };

  // Test uncaught error
  const testUncaughtError = () => {
    // Intentionally trigger an uncaught error
    setTimeout(() => {
      // This will trigger an error in the next event loop
      throw new Error('This is an uncaught async error');
    }, 100);
    setTestResults((prev) => [...prev, '⏳ Async error will trigger in 1 second']);
  };

  // Test React component error
  const testReactError = () => {
    // Intentionally access a non-existent property to trigger an error
    const obj: unknown = null;
    try {
      (obj as { nonExistentMethod: () => void }).nonExistentMethod();
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          test_type: 'react_error',
          page: 'test-error',
        },
      });
      setTestResults((prev) => [...prev, '✅ React error captured to Sentry']);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🧪 Sentry Error Test Page
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Error Test Tools</h2>
          <p className="text-gray-600 mb-6">
            Click the buttons below to test different types of error capture. Each error will be sent to Sentry for monitoring.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testJavaScriptError}
              className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              🚨 Test JavaScript Error
            </button>

            <button
              onClick={testApiError}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🌐 Test API Call Error
            </button>

            <button
              onClick={testUncaughtError}
              className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              ⚡ Test Async Error
            </button>

            <button
              onClick={testReactError}
              className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              ⚛️ Test React Error
            </button>
          </div>
        </div>

        {/* Test results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Test Results</h2>

          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests have been run yet. Please click the buttons above to start testing.</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Test Instructions</h3>
          <ul className="text-blue-700 space-y-1">
            <li>• <strong>JavaScript Error</strong>: Directly thrown errors, caught by try-catch</li>
            <li>• <strong>API Call Error</strong>: Network request failure errors</li>
            <li>• <strong>Async Error</strong>: Uncaught errors thrown in async operations</li>
            <li>• <strong>React Error</strong>: Runtime errors in React components</li>
          </ul>
          <p className="text-blue-600 mt-3">
            💡 After testing, please check your Sentry console to view error reports.
          </p>
        </div>

        {/* Return link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
