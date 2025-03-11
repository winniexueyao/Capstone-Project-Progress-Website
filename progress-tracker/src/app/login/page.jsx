'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiService } from '@/lib/api-service';
import { 
  Container, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Button,
  Input,
  Label,
  Alert
} from '@/components/ui/ui-components';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(true);
  const router = useRouter();

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await ApiService.verifyToken();
          if (response.success) {
            router.push('/admin');
          }
        }
      } catch (err) {
        console.error('验证令牌错误:', err);
        localStorage.removeItem('auth_token');
      }
    };

    // 检查数据库是否已初始化
    const checkInitialization = async () => {
      try {
        const response = await fetch('/api/auth/check-init');
        const data = await response.json();
        setIsInitialized(data.initialized);
      } catch (err) {
        console.error('检查初始化状态错误:', err);
        setIsInitialized(false);
      }
    };

    checkAuth();
    checkInitialization();
  }, [router]);

  // 处理登录
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await ApiService.login(username, password);
      
      if (response.success) {
        localStorage.setItem('auth_token', response.token);
        router.push('/admin');
      } else {
        setError(response.message || '登录失败');
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据库
  const handleInitialize = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await ApiService.initializeDatabase();
      
      if (response.success) {
        setIsInitialized(true);
        setUsername('admin');
        setPassword('admin123');
        alert('数据库初始化成功！默认管理员账号: admin, 密码: admin123');
      } else {
        setError(response.message || '初始化失败');
      }
    } catch (err) {
      console.error('初始化错误:', err);
      setError('初始化失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md">
        <Card>
          <CardHeader className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">毕设项目进度展示网站</h1>
            <p className="text-gray-500 mt-2">请登录以访问管理后台</p>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="error" className="mb-4">
                <p>{error}</p>
              </Alert>
            )}
            
            {!isInitialized && (
              <div className="mb-6">
                <Alert variant="warning" className="mb-4">
                  <p>系统尚未初始化，请先初始化数据库</p>
                </Alert>
                <Button 
                  onClick={handleInitialize} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? '处理中...' : '初始化数据库'}
                </Button>
              </div>
            )}
            
            {isInitialized && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              © 2025 毕设项目进度展示网站
            </p>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}
