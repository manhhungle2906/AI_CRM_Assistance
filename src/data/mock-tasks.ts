// ============================================
// OceanBank AI CRM Assistant - Mock Tasks
// ============================================
import { Task, TaskType, TaskPriority, TaskStatus } from '../lib/types';

export const mockTasks: Task[] = [
  // High Priority Tasks
  {
    id: 'task_001',
    customerId: 'cus_013',
    customerName: 'Minh An Retail',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    title: 'Resolve complaint about transaction delay',
    description: 'Customer reported delayed payment to supplier causing penalty fees. Need to escalate and resolve urgently.',
    type: 'Complaint Resolution',
    dueDate: '2026-05-24',
    priority: 'High',
    status: 'In Progress',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_002',
    customerId: 'cus_012',
    customerName: 'Blue Ocean Logistics',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    title: 'Schedule FX consultation meeting',
    description: 'Customer interested in FX hedging for new European contracts. Need to schedule consultation.',
    type: 'Meeting',
    dueDate: '2026-05-26',
    priority: 'High',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_003',
    customerId: 'cus_009',
    customerName: 'Green Farm Agriculture',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    title: 'Retention call - high churn risk',
    description: 'Customer showing declining transactions and has not been contacted in 90+ days. Immediate outreach required.',
    type: 'Call',
    dueDate: '2026-05-24',
    priority: 'High',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_004',
    customerId: 'cus_021',
    customerName: 'Viet Steel Corporation',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    title: 'Prepare increased credit facility proposal',
    description: 'Customer expanding production capacity. Need to prepare proposal for increased credit facility.',
    type: 'Meeting',
    dueDate: '2026-05-28',
    priority: 'High',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  // Medium Priority Tasks
  {
    id: 'task_005',
    customerId: 'cus_001',
    customerName: 'Nguyen Van A',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    title: 'Send mobile app tutorial for international transfer',
    description: 'Customer inquired about international transfer feature. Send tutorial video.',
    type: 'Email',
    dueDate: '2026-05-25',
    priority: 'Medium',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_006',
    customerId: 'cus_010',
    customerName: 'Bui Thi K',
    assignedRMId: 'rm_007',
    assignedRMName: 'Dao Van G',
    title: 'Arrange wealth management specialist meeting',
    description: 'Customer interested in alternative investments. Arrange specialist consultation.',
    type: 'Meeting',
    dueDate: '2026-05-30',
    priority: 'Medium',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_007',
    customerId: 'cus_011',
    customerName: 'ABC Trading Co.',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    title: 'Prepare SME Overdraft proposal',
    description: 'Based on Q1 review, customer needs overdraft for Q2 cash flow. Prepare proposal.',
    type: 'Document Check',
    dueDate: '2026-05-27',
    priority: 'Medium',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_008',
    customerId: 'cus_016',
    customerName: 'Sunrise Tech Solutions',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    title: 'Follow up on BIZ Banking activation',
    description: 'Hot lead interested in BIZ Banking. Follow up on activation progress.',
    type: 'Call',
    dueDate: '2026-05-25',
    priority: 'Medium',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  // Low Priority Tasks
  {
    id: 'task_009',
    customerId: 'cus_014',
    customerName: 'Lotus Food Service',
    assignedRMId: 'rm_003',
    assignedRMName: 'Le Van C',
    title: 'Quarterly check-in call',
    description: 'Regular quarterly touchpoint with satisfied customer.',
    type: 'Call',
    dueDate: '2026-06-01',
    priority: 'Low',
    status: 'Pending',
    createdBy: 'RM',
  },
  {
    id: 'task_010',
    customerId: 'cus_020',
    customerName: 'Saigon Electronics',
    assignedRMId: 'rm_003',
    assignedRMName: 'Le Van C',
    title: 'Working capital loan review',
    description: 'Review customer working capital needs and adjust loan structure if needed.',
    type: 'Meeting',
    dueDate: '2026-05-29',
    priority: 'Medium',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  // Renewal Tasks
  {
    id: 'task_011',
    customerId: 'cus_006',
    customerName: 'Vu Thi F',
    assignedRMId: 'rm_003',
    assignedRMName: 'Le Van C',
    title: 'Home loan renewal reminder',
    description: 'Home loan renewal due in 30 days. Prepare renewal documentation.',
    type: 'Renewal',
    dueDate: '2026-06-10',
    priority: 'High',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_012',
    customerId: 'cus_038',
    customerName: 'Dao Thi Y',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    title: 'Home loan renewal reminder',
    description: 'Home loan renewal due in 25 days. Prepare renewal documentation.',
    type: 'Renewal',
    dueDate: '2026-06-15',
    priority: 'High',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  // Campaign Follow-up
  {
    id: 'task_013',
    customerId: 'cus_031',
    customerName: 'Vu Van Q',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    title: 'Credit card campaign follow-up',
    description: 'Follow up on credit card offer from May campaign. Customer showed interest.',
    type: 'Campaign Follow-up',
    dueDate: '2026-05-26',
    priority: 'Medium',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_014',
    customerId: 'cus_032',
    customerName: 'Trinh Thi R',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    title: 'Insurance campaign follow-up',
    description: 'Follow up on life insurance offer. Customer is education sector with stable income.',
    type: 'Campaign Follow-up',
    dueDate: '2026-05-27',
    priority: 'Medium',
    status: 'Pending',
    createdBy: 'AI Assistant',
  },
  // Risk Review
  {
    id: 'task_015',
    customerId: 'cus_043',
    customerName: 'North Express Transport',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    title: 'Credit risk review',
    description: 'Customer showing declining transactions. Review credit facility and risk level.',
    type: 'Risk Review',
    dueDate: '2026-05-25',
    priority: 'High',
    status: 'In Progress',
    createdBy: 'AI Assistant',
  },
  // Done Tasks
  {
    id: 'task_016',
    customerId: 'cus_014',
    customerName: 'Lotus Food Service',
    assignedRMId: 'rm_003',
    assignedRMName: 'Le Van C',
    title: 'Complaint resolution follow-up',
    description: 'Complaint from last month has been resolved. Verify customer satisfaction.',
    type: 'Complaint Resolution',
    dueDate: '2026-05-15',
    priority: 'Medium',
    status: 'Done',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_017',
    customerId: 'cus_012',
    customerName: 'Blue Ocean Logistics',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    title: 'Business card renewal processing',
    description: 'Process business credit card renewal as requested.',
    type: 'Document Check',
    dueDate: '2026-05-10',
    priority: 'Low',
    status: 'Done',
    createdBy: 'RM',
  },
  // Overdue Tasks
  {
    id: 'task_018',
    customerId: 'cus_009',
    customerName: 'Green Farm Agriculture',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    title: 'Loan restructuring follow-up',
    description: 'Follow up on loan restructuring options discussed in February.',
    type: 'Call',
    dueDate: '2026-05-20',
    priority: 'High',
    status: 'Overdue',
    createdBy: 'AI Assistant',
  },
  {
    id: 'task_019',
    customerId: 'cus_033',
    customerName: 'Nguyen Van S',
    assignedRMId: 'rm_003',
    assignedRMName: 'Le Van C',
    title: 'Digital banking activation outreach',
    description: 'Customer with very low digital adoption. Personal outreach needed.',
    type: 'Call',
    dueDate: '2026-05-18',
    priority: 'Medium',
    status: 'Overdue',
    createdBy: 'AI Assistant',
  },
  // More tasks
  ...generateMoreTasks(61),
];

function generateMoreTasks(count: number): Task[] {
  const types: TaskType[] = ['Call', 'Email', 'Meeting', 'Document Check', 'Complaint Resolution', 'Renewal', 'Campaign Follow-up', 'Risk Review'];
  const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  const statuses: TaskStatus[] = ['Pending', 'In Progress', 'Done'];
  const customerNames = [
    'Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E',
    'Vu Thi F', 'Dao Van G', 'Nguyen Thi H', 'Trinh Van I', 'Bui Thi K',
    'ABC Trading Co.', 'Blue Ocean Logistics', 'Minh An Retail', 'Lotus Food Service',
    'Green Farm Agriculture', 'Sunrise Tech Solutions', 'Mekong Distribution', 'Viet Textile Co.',
    'Hanoi Construction JSC', 'Saigon Electronics', 'Viet Steel Corporation', 'VN Oil Energy Group',
    'OceanBank Corp', 'VN Telecom Inc.', 'Sai Gon Retail Group', 'Pham Van D',
    'Nguyen Thi L', 'Tran Van M', 'Le Thi N', 'Hoang Van P', 'Vu Van Q',
  ];
  
  const tasks: Task[] = [];
  
  for (let i = 0; i < count; i++) {
    const customerIndex = i % 30;
    const type = types[i % types.length];
    const priority = priorities[i % 3];
    const status = i < 30 ? 'Pending' : statuses[i % 3];
    const day = 15 + (i % 16);
    
    tasks.push({
      id: `task_${20 + i}`,
      customerId: `cus_${String(customerIndex + 1).padStart(3, '0')}`,
      customerName: customerNames[customerIndex],
      assignedRMId: `rm_${String((i % 10) + 1).padStart(3, '0')}`,
      assignedRMName: ['Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E', 'Vu Thi F', 'Dao Van G', 'Trinh Van H', 'Bui Thi I', 'Nguyen Van J'][i % 10],
      title: `${type} task for ${customerNames[customerIndex]}`,
      description: `Routine ${type.toLowerCase()} task generated by AI system.`,
      type,
      dueDate: `2026-05-${String(day).padStart(2, '0')}`,
      priority,
      status,
      createdBy: i % 3 === 0 ? 'RM' : 'AI Assistant',
    });
  }
  
  return tasks;
}

// Helper functions
export function getTaskById(id: string): Task | undefined {
  return mockTasks.find((t) => t.id === id);
}

export function getTasksByCustomer(customerId: string): Task[] {
  return mockTasks.filter((t) => t.customerId === customerId);
}

export function getTasksByRM(rmId: string): Task[] {
  return mockTasks.filter((t) => t.assignedRMId === rmId);
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  return mockTasks.filter((t) => t.status === status);
}

export function getTodaysTasks(): Task[] {
  const today = '2026-05-23';
  return mockTasks.filter((t) => t.dueDate === today && t.status !== 'Done');
}

export function getOverdueTasks(): Task[] {
  return mockTasks.filter((t) => t.status === 'Overdue');
}

export function getTasksByPriority(priority: TaskPriority): Task[] {
  return mockTasks.filter((t) => t.priority === priority);
}

export function getUpcomingRenewals(): Task[] {
  return mockTasks.filter((t) => t.type === 'Renewal' && t.status !== 'Done');
}
