'use client';

import { useState, useEffect } from 'react';

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

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('获取用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加新用户
  const addUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('请填写姓名和邮箱');
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
        fetchUsers(); // 重新获取用户列表
        alert('用户添加成功！');
      } else {
        alert('添加用户失败');
      }
    } catch (error) {
      console.error('添加用户失败:', error);
      alert('添加用户失败');
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🍽️ EatToday 用户管理
        </h1>

        {/* 添加用户表单 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">添加新用户</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="姓名"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="邮箱"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addUser}
              disabled={isAdding}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? '添加中...' : '添加用户'}
            </button>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">用户列表</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">暂无用户数据</p>
              <p className="text-gray-400 text-sm mt-2">请添加第一个用户</p>
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
                      姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      邮箱
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
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

        {/* 状态信息 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>后端API: http://127.0.0.1:8000</p>
          <p>当前用户数量: {users.length}</p>
        </div>
      </div>
    </div>
  );
}