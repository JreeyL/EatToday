'use client';

import { useState, useEffect } from 'react';
import * as Sentry from "@sentry/nextjs";
import ErrorBoundary from '../components/ErrorBoundary';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [isAdding, setIsAdding] = useState(false);

  // Fetch user list
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Capture error to Sentry
      Sentry.captureException(error, {
        tags: {
          action: 'fetch_users',
          endpoint: '/users'
        },
        extra: {
          error_message: error.message,
          stack: error.stack
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const addUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in name and email');
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setNewUser({ name: '', email: '' });
        fetchUsers(); // Refresh user list
        alert('User added successfully!');
      } else {
        alert('Failed to add user');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      // Capture error to Sentry
      Sentry.captureException(error, {
        tags: {
          action: 'add_user',
          endpoint: '/users'
        },
        extra: {
          user_data: newUser,
          error_message: error.message,
          stack: error.stack
        }
      });
      alert('Failed to add user');
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🍽️ EatToday User Management
        </h1>

        {/* Add user form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addUser}
              disabled={isAdding}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </div>

        {/* User list */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">User List</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No user data</p>
              <p className="text-gray-400 text-sm mt-2">Please add the first user</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status information */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Backend API: http://127.0.0.1:8000</p>
          <p>Current user count: {users.length}</p>
        </div>

        {/* Sentry test link */}
        <div className="mt-4 text-center">
          <a
            href="/test-error"
            className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            🧪 Test Sentry Error Capture
          </a>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}