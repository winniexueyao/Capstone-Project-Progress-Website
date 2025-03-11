'use client';

import React, { useEffect } from 'react';
import { useData } from '@/lib/data-context';
import { 
  Container, 
  PageTitle, 
  PageDescription, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Progress,
  Badge,
  Alert
} from '@/components/ui/ui-components';

export default function MembersPage() {
  const { 
    users, 
    tasks, 
    loading, 
    error,
    getUserTasks
  } = useData();

  // 获取状态标签样式
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">已完成</Badge>;
      case 'in_progress':
        return <Badge variant="primary">进行中</Badge>;
      case 'pending':
        return <Badge variant="warning">待处理</Badge>;
      case 'delayed':
        return <Badge variant="danger">已延期</Badge>;
      default:
        return <Badge>未知</Badge>;
    }
  };

  // 获取优先级标签样式
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">高</Badge>;
      case 'medium':
        return <Badge variant="warning">中</Badge>;
      case 'low':
        return <Badge variant="success">低</Badge>;
      default:
        return <Badge>未知</Badge>;
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 计算已完成任务数量
  const getCompletedTasksCount = (tasks) => {
    return tasks.filter(task => task.status === 'completed').length;
  };

  // 计算用户进度
  const calculateUserProgress = (userId) => {
    const userTasks = tasks.filter(task => task.user_id === userId);
    if (userTasks.length === 0) return 0;
    
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    return Math.round((completedTasks.length / userTasks.length) * 100);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">正在加载数据...</p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <Container>
          <Alert variant="error" className="my-8">
            <p>加载数据时出错: {error}</p>
          </Alert>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* 页面标题 */}
        <div className="mb-12">
          <PageTitle className="mb-3">组员进度</PageTitle>
          <PageDescription>查看团队成员的工作进度和任务分配</PageDescription>
        </div>

        {/* 团队整体进度 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">团队整体进度</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {users.map(user => {
              const userProgress = calculateUserProgress(user.id);
              const userTasks = getUserTasks(user.id);
              
              return (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl mb-2">
                        {user.name.charAt(0)}
                      </div>
                      <CardTitle>{user.name}</CardTitle>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span>进度</span>
                      <span>{userProgress}%</span>
                    </div>
                    <Progress value={userProgress} className="mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      {getCompletedTasksCount(userTasks)}/{userTasks.length} 个任务完成
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 成员详细信息 */}
        {users.map(user => {
          const userTasks = getUserTasks(user.id);
          const userProgress = calculateUserProgress(user.id);
          
          return (
            <div key={user.id} className="mb-12">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg mr-4">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-gray-500">{user.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>总体进度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span>完成度</span>
                      <span>{userProgress}%</span>
                    </div>
                    <Progress value={userProgress} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>任务完成</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className="text-3xl font-semibold text-gray-900">
                        {getCompletedTasksCount(userTasks)}/{userTasks.length}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">已完成/总任务</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>进行中任务</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className="text-3xl font-semibold text-gray-900">
                        {userTasks.filter(task => task.status === 'in_progress').length}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">进行中的任务</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>待处理任务</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className="text-3xl font-semibold text-gray-900">
                        {userTasks.filter(task => task.status === 'pending').length}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">待处理的任务</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>任务列表</CardTitle>
                </CardHeader>
                <div className="divide-y divide-gray-200">
                  {userTasks.length > 0 ? (
                    userTasks.map(task => (
                      <div key={task.id} className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <div className="flex space-x-2">
                            {getPriorityBadge(task.priority)}
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">进度</span>
                            <span className="text-gray-500">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} />
                        </div>
                        <div className="text-sm text-gray-500">
                          截止日期: {formatDate(task.due_date)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      暂无任务
                    </div>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </Container>
    </main>
  );
}
