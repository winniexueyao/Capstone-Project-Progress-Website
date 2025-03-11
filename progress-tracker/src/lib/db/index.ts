import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// 数据库类型定义
export interface DbUser {
  id: string;
  username: string;
  password_hash: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface DbProject {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface DbMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  due_date: string;
  start_date?: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface DbTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  start_date: string;
  due_date: string;
  completed_date?: string;
  progress: number;
  priority: string;
  user_id: string;
  milestone_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DbProposal {
  id: string;
  project_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DbProposalSection {
  id: string;
  proposal_id: string;
  title: string;
  content: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface DbDocument {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  upload_date: string;
  proposal_id?: string;
  created_at: string;
  updated_at: string;
}

// 数据库类
class DB {
  private db: Database | null = null;
  private initialized = false;

  // 初始化数据库
  async init() {
    if (this.initialized) return;

    try {
      // 使用内存数据库进行开发
      const sqlite = require('sqlite');
      const sqlite3 = require('sqlite3');
      
      this.db = await sqlite.open({
        filename: ':memory:',
        driver: sqlite3.Database
      });

      await this.createTables();
      this.initialized = true;
      console.log('数据库初始化成功');
    } catch (error) {
      console.error('数据库初始化错误:', error);
      throw error;
    }
  }

  // 创建数据库表
  private async createTables() {
    if (!this.db) throw new Error('数据库未初始化');

    // 用户表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS Users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT UNIQUE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 项目表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS Projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 里程碑表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS Milestones (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        start_date TIMESTAMP,
        due_date TIMESTAMP NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES Projects(id)
      )
    `);

    // 任务表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS Tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        start_date TIMESTAMP NOT NULL,
        due_date TIMESTAMP NOT NULL,
        completed_date TIMESTAMP,
        progress INTEGER DEFAULT 0,
        priority TEXT NOT NULL,
        user_id TEXT NOT NULL,
        milestone_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (milestone_id) REFERENCES Milestones(id)
      )
    `);

    // Proposal表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS Proposals (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES Projects(id)
      )
    `);

    // Proposal章节表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS ProposalSections (
        id TEXT PRIMARY KEY,
        proposal_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        order_num INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (proposal_id) REFERENCES Proposals(id)
      )
    `);

    // 文档表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS Documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        file_type TEXT NOT NULL,
        upload_date TIMESTAMP NOT NULL,
        proposal_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (proposal_id) REFERENCES Proposals(id)
      )
    `);
  }

  // 初始化示例数据
  async initializeData() {
    if (!this.db) await this.init();

    try {
      // 创建管理员用户
      const adminId = uuidv4();
      const passwordHash = await bcrypt.hash('admin123', 10);
      await this.db!.run(
        `INSERT INTO Users (id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)`,
        [adminId, 'admin', passwordHash, '管理员', 'admin']
      );

      // 创建团队成员
      const memberIds = [];
      const members = [
        { username: 'zhangsan', name: '张三', role: '前端开发' },
        { username: 'lisi', name: '李四', role: '后端开发' },
        { username: 'wangwu', name: '王五', role: 'UI设计' },
        { username: 'zhaoliu', name: '赵六', role: '数据分析' },
        { username: 'qianqi', name: '钱七', role: '项目经理' }
      ];

      for (const member of members) {
        const id = uuidv4();
        memberIds.push(id);
        const passwordHash = await bcrypt.hash('password123', 10);
        await this.db!.run(
          `INSERT INTO Users (id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)`,
          [id, member.username, passwordHash, member.name, member.role]
        );
      }

      // 创建项目
      const projectId = uuidv4();
      const startDate = new Date('2025-01-15').toISOString();
      const endDate = new Date('2025-04-30').toISOString();
      await this.db!.run(
        `INSERT INTO Projects (id, name, description, start_date, end_date, progress) VALUES (?, ?, ?, ?, ?, ?)`,
        [projectId, '毕设项目进度展示网站', '用于展示毕业设计项目进度的网站', startDate, endDate, 60]
      );

      // 创建里程碑
      const milestoneIds = [];
      const milestones = [
        { title: '需求分析', status: 'completed', progress: 100, due_date: '2025-01-31' },
        { title: '设计阶段', status: 'completed', progress: 100, due_date: '2025-02-15' },
        { title: '开发阶段', status: 'in_progress', progress: 70, due_date: '2025-03-31' },
        { title: '测试阶段', status: 'pending', progress: 0, due_date: '2025-04-15' },
        { title: '部署上线', status: 'pending', progress: 0, due_date: '2025-04-30' }
      ];

      for (const milestone of milestones) {
        const id = uuidv4();
        milestoneIds.push(id);
        await this.db!.run(
          `INSERT INTO Milestones (id, project_id, title, due_date, status, progress) VALUES (?, ?, ?, ?, ?, ?)`,
          [id, projectId, milestone.title, new Date(milestone.due_date).toISOString(), milestone.status, milestone.progress]
        );
      }

      // 创建任务
      const tasks = [
        { title: '需求收集', status: 'completed', progress: 100, priority: 'high', user_id: memberIds[4], milestone_id: milestoneIds[0], start_date: '2025-01-15', due_date: '2025-01-20' },
        { title: '需求分析', status: 'completed', progress: 100, priority: 'high', user_id: memberIds[3], milestone_id: milestoneIds[0], start_date: '2025-01-20', due_date: '2025-01-31' },
        { title: 'UI设计', status: 'completed', progress: 100, priority: 'medium', user_id: memberIds[2], milestone_id: milestoneIds[1], start_date: '2025-02-01', due_date: '2025-02-10' },
        { title: '数据库设计', status: 'completed', progress: 100, priority: 'high', user_id: memberIds[1], milestone_id: milestoneIds[1], start_date: '2025-02-01', due_date: '2025-02-15' },
        { title: '前端开发', status: 'in_progress', progress: 80, priority: 'high', user_id: memberIds[0], milestone_id: milestoneIds[2], start_date: '2025-02-16', due_date: '2025-03-15' },
        { title: '后端开发', status: 'in_progress', progress: 70, priority: 'high', user_id: memberIds[1], milestone_id: milestoneIds[2], start_date: '2025-02-16', due_date: '2025-03-15' },
        { title: '集成测试', status: 'pending', progress: 0, priority: 'medium', user_id: memberIds[0], milestone_id: milestoneIds[3], start_date: '2025-03-16', due_date: '2025-04-05' },
        { title: '用户测试', status: 'pending', progress: 0, priority: 'medium', user_id: memberIds[2], milestone_id: milestoneIds[3], start_date: '2025-04-01', due_date: '2025-04-15' },
        { title: '部署准备', status: 'pending', progress: 0, priority: 'low', user_id: memberIds[1], milestone_id: milestoneIds[4], start_date: '2025-04-16', due_date: '2025-04-25' },
        { title: '上线发布', status: 'pending', progress: 0, priority: 'high', user_id: memberIds[4], milestone_id: milestoneIds[4], start_date: '2025-04-25', due_date: '2025-04-30' }
      ];

      for (const task of tasks) {
        const id = uuidv4();
        await this.db!.run(
          `INSERT INTO Tasks (id, title, status, progress, priority, user_id, milestone_id, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, task.title, task.status, task.progress, task.priority, task.user_id, task.milestone_id, new Date(task.start_date).toISOString(), new Date(task.due_date).toISOString()]
        );
      }

      // 创建Proposal
      const proposalId = uuidv4();
      await this.db!.run(
        `INSERT INTO Proposals (id, project_id, title) VALUES (?, ?, ?)`,
        [proposalId, projectId, '毕设项目进度展示网站设计方案']
      );

      // 创建Proposal章节
      const sections = [
        { title: '项目概述', content: '本项目旨在开发一个毕设项目进度展示网站，用于展示团队成员的工作进度、项目整体进度以及项目设计方案。', order_num: 1 },
        { title: '需求分析', content: '根据用户需求，网站需要满足展示项目进度、团队成员工作情况、项目设计方案等功能。', order_num: 2 },
        { title: '技术架构', content: '本项目采用Next.js作为前端框架，结合Tailwind CSS进行样式设计，后端使用Next.js API Routes和SQLite数据库。', order_num: 3 },
        { title: '数据库设计', content: '数据库采用关系型设计，包括用户表、项目表、里程碑表、任务表等。', order_num: 4 },
        { title: '界面设计', content: '网站界面采用苹果风格设计，简洁明了，突出重要信息。', order_num: 5 },
        { title: '功能模块', content: '网站主要包含用户认证、项目概览、组员进度、项目进度、项目设计等功能模块。', order_num: 6 },
        { title: '实施计划', content: '项目实施分为需求分析、设计、开发、测试和部署五个阶段。', order_num: 7 },
        { title: '总结与展望', content: '本项目将为团队提供一个直观的项目进度展示平台，未来可以扩展更多功能。', order_num: 8 }
      ];

      for (const section of sections) {
        const id = uuidv4();
        await this.db!.run(
          `INSERT INTO ProposalSections (id, proposal_id, title, content, order_num) VALUES (?, ?, ?, ?, ?)`,
          [id, proposalId, section.title, section.content, section.order_num]
        );
      }

      // 创建文档
      const documents = [
        { title: '需求规格说明书', description: '详细的需求规格说明文档', file_url: '/documents/requirements.pdf', file_type: 'pdf', upload_date: '2025-01-31', proposal_id: proposalId },
        { title: '系统设计文档', description: '系统架构和设计文档', file_url: '/documents/design.pdf', file_type: 'pdf', upload_date: '2025-02-15', proposal_id: proposalId },
        { title: '数据库设计文档', description: '数据库表结构和关系设计', file_url: '/documents/database.pdf', file_type: 'pdf', upload_date: '2025-02-15', proposal_id: proposalId },
        { title: 'UI设计稿', description: '用户界面设计稿和原型', file_url: '/documents/ui-design.zip', file_type: 'zip', upload_date: '2025-02-10', proposal_id: proposalId }
      ];

      for (const doc of documents) {
        const id = uuidv4();
        await this.db!.run(
          `INSERT INTO Documents (id, title, description, file_url, file_type, upload_date, proposal_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, doc.title, doc.description, doc.file_url, doc.file_type, new Date(doc.upload_date).toISOString(), doc.proposal_id]
        );
      }

      return true;
    } catch (error) {
      console.error('初始化数据错误:', error);
      return false;
    }
  }

  // 检查数据库是否已初始化
  async checkInitialized() {
    if (!this.db) await this.init();

    try {
      const result = await this.db!.get('SELECT COUNT(*) as count FROM Users');
      return result.count > 0;
    } catch (error) {
      console.error('检查初始化状态错误:', error);
      return false;
    }
  }

  // 用户相关方法
  async getUsers() {
    if (!this.db) await this.init();
    return this.db!.all('SELECT id, username, name, role, email, avatar, created_at, updated_at FROM Users');
  }

  async getUser(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('SELECT id, username, name, role, email, avatar, created_at, updated_at FROM Users WHERE id = ?', [id]);
  }

  async getUserByUsername(username: string) {
    if (!this.db) await this.init();
    return this.db!.get('SELECT * FROM Users WHERE username = ?', [username]);
  }

  async createUser(userData: Partial<DbUser>) {
    if (!this.db) await this.init();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db!.run(
      `INSERT INTO Users (id, username, password_hash, name, role, email, avatar, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userData.username, userData.password_hash, userData.name, userData.role, userData.email || null, userData.avatar || null, now, now]
    );
    
    return this.getUser(id);
  }

  async updateUser(id: string, userData: Partial<DbUser>) {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    
    const user = await this.getUser(id);
    if (!user) return null;
    
    const updates = [];
    const values = [];
    
    if (userData.username) {
      updates.push('username = ?');
      values.push(userData.username);
    }
    
    if (userData.password_hash) {
      updates.push('password_hash = ?');
      values.push(userData.password_hash);
    }
    
    if (userData.name) {
      updates.push('name = ?');
      values.push(userData.name);
    }
    
    if (userData.role) {
      updates.push('role = ?');
      values.push(userData.role);
    }
    
    if (userData.email !== undefined) {
      updates.push('email = ?');
      values.push(userData.email || null);
    }
    
    if (userData.avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(userData.avatar || null);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    values.push(id);
    
    await this.db!.run(
      `UPDATE Users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getUser(id);
  }

  async deleteUser(id: string) {
    if (!this.db) await this.init();
    
    const user = await this.getUser(id);
    if (!user) return false;
    
    await this.db!.run('DELETE FROM Users WHERE id = ?', [id]);
    return true;
  }

  // 项目相关方法
  async getProjects() {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Projects');
  }

  async getProject(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('SELECT * FROM Projects WHERE id = ?', [id]);
  }

  async createProject(projectData: Partial<DbProject>) {
    if (!this.db) await this.init();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db!.run(
      `INSERT INTO Projects (id, name, description, start_date, end_date, progress, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, projectData.name, projectData.description || null, projectData.start_date, projectData.end_date, projectData.progress || 0, now, now]
    );
    
    return this.getProject(id);
  }

  async updateProject(id: string, projectData: Partial<DbProject>) {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    
    const project = await this.getProject(id);
    if (!project) return null;
    
    const updates = [];
    const values = [];
    
    if (projectData.name) {
      updates.push('name = ?');
      values.push(projectData.name);
    }
    
    if (projectData.description !== undefined) {
      updates.push('description = ?');
      values.push(projectData.description || null);
    }
    
    if (projectData.start_date) {
      updates.push('start_date = ?');
      values.push(projectData.start_date);
    }
    
    if (projectData.end_date) {
      updates.push('end_date = ?');
      values.push(projectData.end_date);
    }
    
    if (projectData.progress !== undefined) {
      updates.push('progress = ?');
      values.push(projectData.progress);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    values.push(id);
    
    await this.db!.run(
      `UPDATE Projects SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getProject(id);
  }

  async deleteProject(id: string) {
    if (!this.db) await this.init();
    
    const project = await this.getProject(id);
    if (!project) return false;
    
    await this.db!.run('DELETE FROM Projects WHERE id = ?', [id]);
    return true;
  }

  // 里程碑相关方法
  async getMilestones() {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Milestones');
  }

  async getMilestone(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('SELECT * FROM Milestones WHERE id = ?', [id]);
  }

  async getProjectMilestones(projectId: string) {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Milestones WHERE project_id = ?', [projectId]);
  }

  async createMilestone(milestoneData: Partial<DbMilestone>) {
    if (!this.db) await this.init();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db!.run(
      `INSERT INTO Milestones (id, project_id, title, description, start_date, due_date, status, progress, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, milestoneData.project_id, milestoneData.title, milestoneData.description || null, milestoneData.start_date || null, milestoneData.due_date, milestoneData.status, milestoneData.progress || 0, now, now]
    );
    
    return this.getMilestone(id);
  }

  async updateMilestone(id: string, milestoneData: Partial<DbMilestone>) {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    
    const milestone = await this.getMilestone(id);
    if (!milestone) return null;
    
    const updates = [];
    const values = [];
    
    if (milestoneData.project_id) {
      updates.push('project_id = ?');
      values.push(milestoneData.project_id);
    }
    
    if (milestoneData.title) {
      updates.push('title = ?');
      values.push(milestoneData.title);
    }
    
    if (milestoneData.description !== undefined) {
      updates.push('description = ?');
      values.push(milestoneData.description || null);
    }
    
    if (milestoneData.start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(milestoneData.start_date || null);
    }
    
    if (milestoneData.due_date) {
      updates.push('due_date = ?');
      values.push(milestoneData.due_date);
    }
    
    if (milestoneData.status) {
      updates.push('status = ?');
      values.push(milestoneData.status);
    }
    
    if (milestoneData.progress !== undefined) {
      updates.push('progress = ?');
      values.push(milestoneData.progress);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    values.push(id);
    
    await this.db!.run(
      `UPDATE Milestones SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getMilestone(id);
  }

  async deleteMilestone(id: string) {
    if (!this.db) await this.init();
    
    const milestone = await this.getMilestone(id);
    if (!milestone) return false;
    
    await this.db!.run('DELETE FROM Milestones WHERE id = ?', [id]);
    return true;
  }

  // 任务相关方法
  async getTasks() {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Tasks');
  }

  async getTask(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('SELECT * FROM Tasks WHERE id = ?', [id]);
  }

  async getUserTasks(userId: string) {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Tasks WHERE user_id = ?', [userId]);
  }

  async getMilestoneTasks(milestoneId: string) {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Tasks WHERE milestone_id = ?', [milestoneId]);
  }

  async createTask(taskData: Partial<DbTask>) {
    if (!this.db) await this.init();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db!.run(
      `INSERT INTO Tasks (id, title, description, status, start_date, due_date, completed_date, progress, priority, user_id, milestone_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, taskData.title, taskData.description || null, taskData.status, taskData.start_date, taskData.due_date, taskData.completed_date || null, taskData.progress || 0, taskData.priority, taskData.user_id, taskData.milestone_id || null, now, now]
    );
    
    return this.getTask(id);
  }

  async updateTask(id: string, taskData: Partial<DbTask>) {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    
    const task = await this.getTask(id);
    if (!task) return null;
    
    const updates = [];
    const values = [];
    
    if (taskData.title) {
      updates.push('title = ?');
      values.push(taskData.title);
    }
    
    if (taskData.description !== undefined) {
      updates.push('description = ?');
      values.push(taskData.description || null);
    }
    
    if (taskData.status) {
      updates.push('status = ?');
      values.push(taskData.status);
    }
    
    if (taskData.start_date) {
      updates.push('start_date = ?');
      values.push(taskData.start_date);
    }
    
    if (taskData.due_date) {
      updates.push('due_date = ?');
      values.push(taskData.due_date);
    }
    
    if (taskData.completed_date !== undefined) {
      updates.push('completed_date = ?');
      values.push(taskData.completed_date || null);
    }
    
    if (taskData.progress !== undefined) {
      updates.push('progress = ?');
      values.push(taskData.progress);
    }
    
    if (taskData.priority) {
      updates.push('priority = ?');
      values.push(taskData.priority);
    }
    
    if (taskData.user_id) {
      updates.push('user_id = ?');
      values.push(taskData.user_id);
    }
    
    if (taskData.milestone_id !== undefined) {
      updates.push('milestone_id = ?');
      values.push(taskData.milestone_id || null);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    values.push(id);
    
    await this.db!.run(
      `UPDATE Tasks SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getTask(id);
  }

  async deleteTask(id: string) {
    if (!this.db) await this.init();
    
    const task = await this.getTask(id);
    if (!task) return false;
    
    await this.db!.run('DELETE FROM Tasks WHERE id = ?', [id]);
    return true;
  }

  // Proposal相关方法
  async getProposals() {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Proposals');
  }

  async getProposal(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('SELECT * FROM Proposals WHERE id = ?', [id]);
  }

  async getProjectProposals(projectId: string) {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Proposals WHERE project_id = ?', [projectId]);
  }

  async createProposal(proposalData: Partial<DbProposal>) {
    if (!this.db) await this.init();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db!.run(
      `INSERT INTO Proposals (id, project_id, title, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, proposalData.project_id, proposalData.title, now, now]
    );
    
    return this.getProposal(id);
  }

  async updateProposal(id: string, proposalData: Partial<DbProposal>) {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    
    const proposal = await this.getProposal(id);
    if (!proposal) return null;
    
    const updates = [];
    const values = [];
    
    if (proposalData.project_id) {
      updates.push('project_id = ?');
      values.push(proposalData.project_id);
    }
    
    if (proposalData.title) {
      updates.push('title = ?');
      values.push(proposalData.title);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    values.push(id);
    
    await this.db!.run(
      `UPDATE Proposals SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getProposal(id);
  }

  async deleteProposal(id: string) {
    if (!this.db) await this.init();
    
    const proposal = await this.getProposal(id);
    if (!proposal) return false;
    
    await this.db!.run('DELETE FROM Proposals WHERE id = ?', [id]);
    return true;
  }

  // Proposal章节相关方法
  async getProposalSections(proposalId: string) {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM ProposalSections WHERE proposal_id = ? ORDER BY order_num', [proposalId]);
  }

  async getProposalSection(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('SELECT * FROM ProposalSections WHERE id = ?', [id]);
  }

  async createProposalSection(sectionData: Partial<DbProposalSection>) {
    if (!this.db) await this.init();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db!.run(
      `INSERT INTO ProposalSections (id, proposal_id, title, content, order_num, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, sectionData.proposal_id, sectionData.title, sectionData.content, sectionData.order_num, now, now]
    );
    
    return this.getProposalSection(id);
  }

  async updateProposalSection(id: string, sectionData: Partial<DbProposalSection>) {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    
    const section = await this.getProposalSection(id);
    if (!section) return null;
    
    const updates = [];
    const values = [];
    
    if (sectionData.proposal_id) {
      updates.push('proposal_id = ?');
      values.push(sectionData.proposal_id);
    }
    
    if (sectionData.title) {
      updates.push('title = ?');
      values.push(sectionData.title);
    }
    
    if (sectionData.content) {
      updates.push('content = ?');
      values.push(sectionData.content);
    }
    
    if (sectionData.order_num !== undefined) {
      updates.push('order_num = ?');
      values.push(sectionData.order_num);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    values.push(id);
    
    await this.db!.run(
      `UPDATE ProposalSections SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getProposalSection(id);
  }

  async deleteProposalSection(id: string) {
    if (!this.db) await this.init();
    
    const section = await this.getProposalSection(id);
    if (!section) return false;
    
    await this.db!.run('DELETE FROM ProposalSections WHERE id = ?', [id]);
    return true;
  }

  // 文档相关方法
  async getDocuments() {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Documents');
  }

  async getDocument(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('SELECT * FROM Documents WHERE id = ?', [id]);
  }

  async getProposalDocuments(proposalId: string) {
    if (!this.db) await this.init();
    return this.db!.all('SELECT * FROM Documents WHERE proposal_id = ?', [proposalId]);
  }

  async createDocument(documentData: Partial<DbDocument>) {
    if (!this.db) await this.init();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db!.run(
      `INSERT INTO Documents (id, title, description, file_url, file_type, upload_date, proposal_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, documentData.title, documentData.description || null, documentData.file_url, documentData.file_type, documentData.upload_date, documentData.proposal_id || null, now, now]
    );
    
    return this.getDocument(id);
  }

  async updateDocument(id: string, documentData: Partial<DbDocument>) {
    if (!this.db) await this.init();
    const now = new Date().toISOString();
    
    const document = await this.getDocument(id);
    if (!document) return null;
    
    const updates = [];
    const values = [];
    
    if (documentData.title) {
      updates.push('title = ?');
      values.push(documentData.title);
    }
    
    if (documentData.description !== undefined) {
      updates.push('description = ?');
      values.push(documentData.description || null);
    }
    
    if (documentData.file_url) {
      updates.push('file_url = ?');
      values.push(documentData.file_url);
    }
    
    if (documentData.file_type) {
      updates.push('file_type = ?');
      values.push(documentData.file_type);
    }
    
    if (documentData.upload_date) {
      updates.push('upload_date = ?');
      values.push(documentData.upload_date);
    }
    
    if (documentData.proposal_id !== undefined) {
      updates.push('proposal_id = ?');
      values.push(documentData.proposal_id || null);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    values.push(id);
    
    await this.db!.run(
      `UPDATE Documents SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getDocument(id);
  }

  async deleteDocument(id: string) {
    if (!this.db) await this.init();
    
    const document = await this.getDocument(id);
    if (!document) return false;
    
    await this.db!.run('DELETE FROM Documents WHERE id = ?', [id]);
    return true;
  }
}

// 导出数据库实例
export const db = new DB();
