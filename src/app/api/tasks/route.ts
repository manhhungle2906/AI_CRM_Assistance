import { NextResponse } from 'next/server';
import { mockTasks, getTasksByStatus, getTodaysTasks, getOverdueTasks, getTasksByRM } from '@/data/mock-tasks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const status = searchParams.get('status');
  const rmId = searchParams.get('rmId');
  const overdue = searchParams.get('overdue');
  const today = searchParams.get('today');

  let tasks = [...mockTasks];

  if (status) {
    tasks = getTasksByStatus(status as never);
  }

  if (rmId) {
    tasks = getTasksByRM(rmId);
  }

  if (overdue === 'true') {
    tasks = getOverdueTasks();
  }

  if (today === 'true') {
    tasks = getTodaysTasks();
  }

  // Group by status for kanban view
  const byStatus = {
    Pending: mockTasks.filter(t => t.status === 'Pending'),
    'In Progress': mockTasks.filter(t => t.status === 'In Progress'),
    Done: mockTasks.filter(t => t.status === 'Done'),
    Overdue: getOverdueTasks(),
  };

  return NextResponse.json({
    tasks,
    byStatus,
    total: tasks.length,
    summary: {
      pending: byStatus.Pending.length,
      inProgress: byStatus['In Progress'].length,
      done: byStatus.Done.length,
      overdue: byStatus.Overdue.length,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, taskId, taskData } = body;

  // Simulate task actions
  if (action === 'update_status' && taskId) {
    return NextResponse.json({
      success: true,
      taskId,
      newStatus: taskData?.status || 'In Progress',
      message: 'Task status updated successfully',
    });
  }

  if (action === 'create') {
    return NextResponse.json({
      success: true,
      task: {
        id: `task_${Date.now()}`,
        ...taskData,
        status: 'Pending',
        createdBy: 'AI Assistant',
      },
      message: 'Task created successfully',
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
