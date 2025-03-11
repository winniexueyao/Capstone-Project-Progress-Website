'use client';

import React, { useState } from 'react';
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
  Button,
  Separator
} from '@/components/ui/ui-components';

export default function MembersPage() {
  // 团队成员详细数据
  const teamMembers = [
    { 
      id: 1, 
      name: '张三', 
      role: '前端开发', 
      progress: 85, 
      avatar: '/avatars/member1.png',
      email: 'zhangsan@example.com',
      tasks: [
        { id: 1, title: '首页UI设计', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-20' },
        { id: 2, title: '用户认证模块', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-28' },
        { id: 3, title: '数据可视化组件', status: 'in_progress', progress: 70, priority: 'medium', dueDate: '2025-03-15' },
        { id: 4, title: '响应式布局优化', status: 'pending', progress: 0, priority: 'low', dueDate: '2025-03-25' }
      ]
    },
    { 
      id: 2, 
      name: '李四', 
      role: '后端开发', 
      progress: 78, 
      avatar: '/avatars/member2.png',
      email: 'lisi@example.com',
      tasks: [
        { id: 5, title: '数据库设计', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-15' },
        { id: 6, title: 'API接口开发', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-25' },
        { id: 7, title: '用户权限管理', status: 'in_progress', progress: 60, priority: 'medium', dueDate: '2025-03-10' },
        { id: 8, title: '性能优化', status: 'pending', progress: 0, priority: 'medium', dueDate: '2025-03-20' }
      ]
    },
    { 
      id: 3, 
      name: '王五', 
      role: 'UI设计', 
      progress: 92, 
      avatar: '/avatars/member3.png',
      email: 'wangwu@example.com',
      tasks: [
        { id: 9, title: '设计系统构建', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-10' },
        { id: 10, title: '界面原型设计', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-20' },
        { id: 11, title: '组件库设计', status: 'completed', progress: 100, priority: 'medium', dueDate: '2025-03-01' },
        { id: 12, title: '动效设计', status: 'in_progress', progress: 70, priority: 'low', dueDate: '2025-03-15' }
      ]
    },
    { 
      id: 4, 
      name: '赵六', 
      role: '数据分析', 
      progress: 65, 
      avatar: '/avatars/member4.png',
      email: 'zhaoliu@example.com',
      tasks: [
        { id: 13, title: '需求分析', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-05' },
        { id: 14, title: '数据模型设计', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-15' },
        { id: 15, title: '数据可视化方案', status: 'in_progress', progress: 50, priority: 'medium', dueDate: '2025-03-10' },
        { id: 16, title: '用户行为分析', status: 'pending', progress: 0, priority: 'medium', dueDate: '2025-03-25' }
      ]
    },
    { 
      id: 5, 
      name: '钱七', 
      role: '项目经理', 
      progress: 80, 
      avatar: '/avatars/member5.png',
      email: 'qianqi@example.com',
      tasks: [
        { id: 17, title: '项目规划', status: 'completed', progress: 100, priority: 'high', dueDate: '2025-02-01' },
        { id: 18, title: '团队协调', status: 'in_progress', progress: 80, priority: 'high', dueDate: '2025-04-30' },
        { id: 19, title: '进度跟踪', status: 'in_progress', progress: 75, priority: 'high', dueDate: '2025-04-30' },
        { id: 20, title: '风险管理', status: 'in_progress', progress: 60, priority: 'medium', dueDate: '2025-04-30' }
      ]
    }
  ];

  // 当前选中的成员
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]);

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

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* 页面标题 */}
        <div className="mb-12">
          <PageTitle className="mb-3">组员进度</PageTitle>
          <PageDescription>查看团队成员的工作进度和任务分配</PageDescription>
        </div>

        {/* 成员选择器 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {teamMembers.map(member => (
            <Button
              key={member.id}
              variant={selectedMember.id === member.id ? "primary" : "outline"}
              onClick={() => setSelectedMember(member)}
            >
              {member.name}
            </Button>
          ))}
        </div>

        {/* 成员详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 成员信息卡片 */}
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-3xl mb-4">
                  {selectedMember.name.charAt(0)}
                </div>
                <CardTitle className="text-xl">{selectedMember.name}</CardTitle>
                <p className="text-gray-500">{selectedMember.role}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">邮箱</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">总体进度</p>
                  <div className="flex justify-between text-sm mb-1">
                    <span>完成度</span>
                    <span>{selectedMember.progress}%</span>
                  </div>
                  <Progress value={selectedMember.progress} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">任务完成</p>
                  <p className="font-medium">{getCompletedTasksCount(selectedMember.tasks)}/{selectedMember.tasks.length} 个任务</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 任务列表 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>任务列表</CardTitle>
              </CardHeader>
              <div className="divide-y divide-gray-200">
                {selectedMember.tasks.map(task => (
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
                      截止日期: {formatDate(task.dueDate)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 团队整体进度 */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">团队整体进度</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {teamMembers.map(member => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl mb-2">
                      {member.name.charAt(0)}
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-1">
                    <span>进度</span>
                    <span>{member.progress}%</span>
                  </div>
                  <Progress value={member.progress} className="mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    {getCompletedTasksCount(member.tasks)}/{member.tasks.length} 个任务完成
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
