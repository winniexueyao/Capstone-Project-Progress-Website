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
  CardFooter,
  Progress,
  Badge,
  Alert
} from '@/components/ui/ui-components';

export default function HomePage() {
  const { 
    projects, 
    users, 
    tasks, 
    milestones, 
    loading, 
    error 
  } = useData();

  // 计算项目总体进度
  const calculateProjectProgress = () => {
    if (!projects.length || !milestones.length || !tasks.length) {
      return {
        overall: 0,
        timeElapsed: 0,
        tasksCompleted: 0,
        milestonesReached: 0
      };
    }

    // 假设只有一个主项目
    const mainProject = projects[0];
    
    // 计算时间进度
    const today = new Date();
    const start = new Date(mainProject.start_date);
    const end = new Date(mainProject.end_date);
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const elapsedDays = Math.min((today - start) / (1000 * 60 * 60 * 24), totalDays);
    const timeElapsed = Math.round((elapsedDays / totalDays) * 100);
    
    // 计算任务完成度
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const tasksCompleted = Math.round((completedTasks / tasks.length) * 100);
    
    // 计算里程碑达成度
    const completedMilestones = milestones.filter(milestone => milestone.status === 'completed').length;
    const milestonesReached = Math.round((completedMilestones / milestones.length) * 100);
    
    // 计算总体进度（可以根据需要调整权重）
    const overall = Math.round((tasksCompleted * 0.6) + (milestonesReached * 0.4));
    
    return {
      overall,
      timeElapsed,
      tasksCompleted,
      milestonesReached
    };
  };

  const projectProgress = calculateProjectProgress();

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

  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 获取最近的里程碑
  const getRecentMilestones = () => {
    if (!milestones.length) return [];
    
    return milestones
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 4);
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
        <div className="mb-12 text-center">
          <PageTitle className="text-3xl md:text-4xl mb-3">毕设项目进度展示</PageTitle>
          <PageDescription className="text-xl">实时跟踪项目进展和团队成员工作状态</PageDescription>
        </div>

        {/* 项目总体进度 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">项目总体进度</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>总体完成度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-gray-200" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className="text-blue-600" 
                        strokeWidth="10" 
                        strokeDasharray={`${projectProgress.overall * 2.51} 251`}
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-semibold text-gray-900">{projectProgress.overall}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>时间进度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between text-sm">
                  <span>已用时间</span>
                  <span>{projectProgress.timeElapsed}%</span>
                </div>
                <Progress value={projectProgress.timeElapsed} className="mb-4" />
                <p className="text-sm text-gray-500">
                  {projects.length > 0 && `项目预计于${formatDate(projects[0].end_date)}完成`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>任务完成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between text-sm">
                  <span>已完成任务</span>
                  <span>{projectProgress.tasksCompleted}%</span>
                </div>
                <Progress value={projectProgress.tasksCompleted} className="mb-4" />
                <p className="text-sm text-gray-500">
                  已完成{tasks.filter(t => t.status === 'completed').length}/{tasks.length}个任务
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>里程碑达成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between text-sm">
                  <span>已达成里程碑</span>
                  <span>{projectProgress.milestonesReached}%</span>
                </div>
                <Progress value={projectProgress.milestonesReached} className="mb-4" />
                <p className="text-sm text-gray-500">
                  已达成{milestones.filter(m => m.status === 'completed').length}/{milestones.length}个里程碑
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 团队成员进度 */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">团队成员进度</h2>
            <a href="/members" className="text-blue-600 hover:text-blue-800">
              查看详情 &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => {
              // 计算用户任务进度
              const userTasks = tasks.filter(task => task.user_id === user.id);
              const completedTasks = userTasks.filter(task => task.status === 'completed');
              const progress = userTasks.length > 0 
                ? Math.round((completedTasks.length / userTasks.length) * 100) 
                : 0;
              
              return (
                <Card key={user.id}>
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle>{user.name}</CardTitle>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>任务进度</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 最近里程碑 */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">最近里程碑</h2>
            <a href="/progress" className="text-blue-600 hover:text-blue-800">
              查看全部 &rarr;
            </a>
          </div>
          <Card>
            <div className="divide-y divide-gray-200">
              {getRecentMilestones().map(milestone => (
                <div key={milestone.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                    <p className="text-sm text-gray-500">计划日期: {formatDate(milestone.due_date)}</p>
                  </div>
                  <div>
                    {getStatusBadge(milestone.status)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 快速链接 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">快速链接</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/proposal" className="block">
              <Card className="transition-transform hover:scale-105">
                <CardHeader>
                  <CardTitle>项目设计Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">查看项目设计方案和详细说明</p>
                </CardContent>
                <CardFooter className="justify-end">
                  <span className="text-blue-600">查看详情 &rarr;</span>
                </CardFooter>
              </Card>
            </a>
            
            <a href="/progress" className="block">
              <Card className="transition-transform hover:scale-105">
                <CardHeader>
                  <CardTitle>项目进度详情</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">查看项目里程碑和详细进度</p>
                </CardContent>
                <CardFooter className="justify-end">
                  <span className="text-blue-600">查看详情 &rarr;</span>
                </CardFooter>
              </Card>
            </a>
            
            <a href="/about" className="block">
              <Card className="transition-transform hover:scale-105">
                <CardHeader>
                  <CardTitle>关于项目</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">了解项目背景和团队信息</p>
                </CardContent>
                <CardFooter className="justify-end">
                  <span className="text-blue-600">查看详情 &rarr;</span>
                </CardFooter>
              </Card>
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
