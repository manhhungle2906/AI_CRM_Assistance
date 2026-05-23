'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, X, Trash2, GripVertical, Clock, CheckCircle2 } from 'lucide-react';

interface Task {
  id: string;
  customerId: string;
  customerName?: string;
  title: string;
  type: string;
  dueDate: string;
  priority: string;
  status: string;
  createdBy: string;
}

interface NewTaskForm {
  title: string;
  customerName: string;
  type: string;
  priority: string;
  dueDate: string;
}

const statusColumns = [
  { key: 'Pending', label: 'To Do', color: 'slate' },
  { key: 'In Progress', label: 'In Progress', color: 'sky' },
  { key: 'Done', label: 'Done', color: 'emerald' },
  { key: 'Overdue', label: 'Overdue', color: 'red' },
];

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-700 border-slate-200',
};

const typeIcons: Record<string, string> = {
  Call: '📞',
  Email: '📧',
  Meeting: '📅',
  Document: '📄',
  Complaint: '⚠️',
  Renewal: '🔄',
  'Document Check': '📋',
  'Complaint Resolution': '⚠️',
  'Campaign Follow-up': '📣',
  'Risk Review': '🔍',
  Default: '📌',
};

const taskTypes = ['Call', 'Email', 'Meeting', 'Document Check', 'Complaint Resolution', 'Renewal', 'Campaign Follow-up', 'Risk Review'];
const priorities = ['High', 'Medium', 'Low'];

export default function TasksPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewTaskForm>({
    title: '',
    customerName: '',
    type: 'Call',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
  });

  // Group tasks by status (local state management)
  const tasksByStatus: Record<string, Task[]> = {
    'Pending': allTasks.filter(t => t.status === 'Pending'),
    'In Progress': allTasks.filter(t => t.status === 'In Progress'),
    'Done': allTasks.filter(t => t.status === 'Done'),
    'Overdue': allTasks.filter(t => t.status === 'Overdue'),
  };

  const summary: Record<string, number> = {
    'pending': tasksByStatus['Pending'].length,
    'inprogress': tasksByStatus['In Progress'].length,
    'done': tasksByStatus['Done'].length,
    'overdue': tasksByStatus['Overdue'].length,
  };

  const getSummaryKey = (statusKey: string): string => {
    const map: Record<string, string> = {
      'pending': 'pending',
      'in progress': 'inprogress',
      'done': 'done',
      'overdue': 'overdue',
    };
    return map[statusKey.toLowerCase()] || statusKey.toLowerCase();
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setAllTasks(result.tasks || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = () => {
    if (!formData.title.trim()) {
      alert('Please enter task title');
      return;
    }

    const newTask: Task = {
      id: `task_${Date.now()}`,
      customerId: `cus_${Date.now()}`,
      customerName: formData.customerName || 'Unknown Customer',
      title: formData.title,
      type: formData.type,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: 'Pending',
      createdBy: 'You',
    };

    setAllTasks(prev => [newTask, ...prev]);
    setShowModal(false);
    setFormData({
      title: '',
      customerName: '',
      type: 'Call',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setAllTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnKey);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedTask && draggedTask.status !== newStatus) {
      // Update locally immediately for instant feedback
      setAllTasks(prev => 
        prev.map(t => 
          t.id === draggedTask.id 
            ? { ...t, status: newStatus }
            : t
        )
      );
    }
    setDraggedTask(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 mt-1">Manage your daily tasks and follow-ups</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {statusColumns.map((col) => (
          <Card key={col.key}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${
                col.color === 'emerald' ? 'text-emerald-600' :
                col.color === 'red' ? 'text-red-600' :
                col.color === 'sky' ? 'text-sky-600' : 'text-slate-600'
              }`}>
                {summary[getSummaryKey(col.key)] || 0}
              </p>
              <p className="text-xs text-slate-500">{col.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {statusColumns.map((col) => (
          <div
            key={col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`flex flex-col rounded-xl transition-all min-h-[400px] ${
              dragOverColumn === col.key ? 'ring-2 ring-sky-400 ring-offset-2' : ''
            }`}
          >
            <div className={`px-4 py-2 rounded-t-lg font-medium text-sm ${
              col.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
              col.color === 'red' ? 'bg-red-100 text-red-700' :
              col.color === 'sky' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {col.label} ({tasksByStatus[col.key]?.length || 0})
            </div>
            <div className="flex-1 bg-slate-50 rounded-b-lg p-2 space-y-2 min-h-[350px] max-h-[calc(100vh-22rem)] overflow-y-auto">
              {tasksByStatus[col.key]?.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className={`p-3 bg-white rounded-lg border border-slate-200 hover:border-sky-200 cursor-grab active:cursor-grabbing transition-all group ${
                    col.key === 'Overdue' ? 'border-l-4 border-l-red-500' : ''
                  } ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-move" />
                    <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </Badge>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                  <h4 className="font-medium text-slate-900 text-sm mb-1 line-clamp-2">{task.title}</h4>
                  {task.customerName && (
                    <p className="text-xs text-slate-500 mb-2">{task.customerName}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      {typeIcons[task.type] || typeIcons.Default} {task.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
              {(tasksByStatus[col.key]?.length || 0) === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-sm">
                  <span>No tasks</span>
                  <span className="text-xs mt-1">Drag tasks here</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Create New Task</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title *</label>
                <Input
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <Input
                  placeholder="Enter customer name (optional)"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {taskTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} className="flex-1">
                  Create Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
