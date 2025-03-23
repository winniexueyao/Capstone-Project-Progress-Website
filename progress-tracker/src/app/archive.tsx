        // return (
        //   <>
        // {/* 项目总体进度 */}
        // <div className="mb-12">
        //   <h2 className="text-2xl font-semibold text-gray-900 mb-6">项目总体进度</h2>
        //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        //     <Card>
        //       <CardHeader>
        //         <CardTitle>总体完成度</CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <div className="flex flex-col items-center">
        //           <div className="relative w-32 h-32">
        //             <svg className="w-full h-full" viewBox="0 0 100 100">
        //               <circle 
        //                 className="text-gray-200" 
        //                 strokeWidth="10" 
        //                 stroke="currentColor" 
        //                 fill="transparent" 
        //                 r="40" 
        //                 cx="50" 
        //                 cy="50" 
        //               />
        //               <circle 
        //                 className="text-blue-600" 
        //                 strokeWidth="10" 
        //                 strokeDasharray={`${projectProgress.overall * 2.51} 251`}
        //                 strokeLinecap="round" 
        //                 stroke="currentColor" 
        //                 fill="transparent" 
        //                 r="40" 
        //                 cx="50" 
        //                 cy="50" 
        //               />
        //             </svg>
        //             <div className="absolute inset-0 flex items-center justify-center">
        //               <span className="text-3xl font-semibold text-gray-900">{projectProgress.overall}%</span>
        //             </div>
        //           </div>
        //         </div>
        //       </CardContent>
        //     </Card>

        //     <Card>
        //       <CardHeader>
        //         <CardTitle>时间进度</CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <div className="mb-2 flex justify-between text-sm">
        //           <span>已用时间</span>
        //           <span>{projectProgress.timeElapsed}%</span>
        //         </div>
        //         <Progress value={projectProgress.timeElapsed} className="mb-4" />
        //         <p className="text-sm text-gray-500">项目预计于2025年4月30日完成</p>
        //       </CardContent>
        //     </Card>

        //     <Card>
        //       <CardHeader>
        //         <CardTitle>任务完成</CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <div className="mb-2 flex justify-between text-sm">
        //           <span>已完成任务</span>
        //           <span>{projectProgress.tasksCompleted}%</span>
        //         </div>
        //         <Progress value={projectProgress.tasksCompleted} className="mb-4" />
        //         <p className="text-sm text-gray-500">已完成28/40个任务</p>
        //       </CardContent>
        //     </Card>

        //     <Card>
        //       <CardHeader>
        //         <CardTitle>里程碑达成</CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <div className="mb-2 flex justify-between text-sm">
        //           <span>已达成里程碑</span>
        //           <span>{projectProgress.milestonesReached}%</span>
        //         </div>
        //         <Progress value={projectProgress.milestonesReached} className="mb-4" />
        //         <p className="text-sm text-gray-500">已达成6/10个里程碑</p>
        //       </CardContent>
        //     </Card>
        //   </div>
        // </div>

        // {/* 团队成员进度 */}
        // <div className="mb-12">
        //   <div className="flex justify-between items-center mb-6">
        //     <h2 className="text-2xl font-semibold text-gray-900">团队成员进度</h2>
        //     <Link href="/members" className="text-blue-600 hover:text-blue-800">
        //       查看详情 &rarr;
        //     </Link>
        //   </div>
        //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //     {teamMembers.map(member => (
        //       <Card key={member.id}>
        //         <CardHeader className="flex flex-row items-center space-x-4">
        //           <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
        //             {member.name.charAt(0)}
        //           </div>
        //           <div>
        //             <CardTitle>{member.name}</CardTitle>
        //             <p className="text-sm text-gray-500">{member.role}</p>
        //           </div>
        //         </CardHeader>
        //         <CardContent>
        //           <div className="mb-2 flex justify-between text-sm">
        //             <span>任务进度</span>
        //             <span>{member.progress}%</span>
        //           </div>
        //           <Progress value={member.progress} />
        //         </CardContent>
        //       </Card>
        //     ))}
        //   </div>
        // </div>

        // {/* 最近里程碑 */}
        // <div className="mb-12">
        //   <div className="flex justify-between items-center mb-6">
        //     <h2 className="text-2xl font-semibold text-gray-900">最近里程碑</h2>
        //     <Link href="/progress" className="text-blue-600 hover:text-blue-800">
        //       查看全部 &rarr;
        //     </Link>
        //   </div>
        //   <Card>
        //     <div className="divide-y divide-gray-200">
        //       {recentMilestones.map(milestone => (
        //         <div key={milestone.id} className="p-6 flex justify-between items-center">
        //           <div>
        //             <h3 className="font-medium text-gray-900">{milestone.title}</h3>
        //             <p className="text-sm text-gray-500">计划日期: {formatDate(milestone.date)}</p>
        //           </div>
        //           <div>
        //             {getStatusBadge(milestone.status)}
        //           </div>
        //         </div>
        //       ))}
        //     </div>
        //   </Card>
        // </div>

        // {/* 快速链接 */}
        // <div>
        //   <h2 className="text-2xl font-semibold text-gray-900 mb-6">快速链接</h2>
        //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        //     <Link href="/proposal" className="block">
        //       <Card className="transition-transform hover:scale-105">
        //         <CardHeader>
        //           <CardTitle>项目设计Proposal</CardTitle>
        //         </CardHeader>
        //         <CardContent>
        //           <p className="text-gray-500">查看项目设计方案和详细说明</p>
        //         </CardContent>
        //         <CardFooter className="justify-end">
        //           <span className="text-blue-600">查看详情 &rarr;</span>
        //         </CardFooter>
        //       </Card>
        //     </Link>
            
        //     <Link href="/progress" className="block">
        //       <Card className="transition-transform hover:scale-105">
        //         <CardHeader>
        //           <CardTitle>项目进度详情</CardTitle>
        //         </CardHeader>
        //         <CardContent>
        //           <p className="text-gray-500">查看项目里程碑和详细进度</p>
        //         </CardContent>
        //         <CardFooter className="justify-end">
        //           <span className="text-blue-600">查看详情 &rarr;</span>
        //         </CardFooter>
        //       </Card>
        //     </Link>
            
        //     <Link href="/about" className="block">
        //       <Card className="transition-transform hover:scale-105">
        //         <CardHeader>
        //           <CardTitle>关于项目</CardTitle>
        //         </CardHeader>
        //         <CardContent>
        //           <p className="text-gray-500">了解项目背景和团队信息</p>
        //         </CardContent>
        //         <CardFooter className="justify-end">
        //           <span className="text-blue-600">查看详情 &rarr;</span>
        //         </CardFooter>
        //       </Card>
        //     </Link>
        //   </div>
        // </div></>
        // );