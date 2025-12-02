import * as React from 'react';
import { useEffect, useState } from 'react';
import GanttChart, {
  GanttChartProps,
  Task,
  TaskGroup,
} from 'react-modern-gantt';
import { complexDemoData } from './data';
import { format } from 'date-fns';
import dayjs from 'dayjs';

interface DemoCustomizedProps {
  darkMode: boolean;
}

const DemoCustomized: React.FC<DemoCustomizedProps> = ({
  darkMode,
}: DemoCustomizedProps) => {
  const [tasks, setTasks] = useState<TaskGroup[]>(complexDemoData);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Handle task updates
  const handleTaskUpdate = (groupId: string, updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task,
              ),
            }
          : group,
      ),
    );
  };

  // Handle task selection
  const handleTaskSelect = (task: Task, isSelected: boolean) => {
    setSelectedTaskId(isSelected ? task.id : null);
  };

  // Custom task color function
  const getTaskColor = ({
    task,
    isHovered: _isHovered,
    isDragging: _isDragging,
  }: {
    task: Task;
    isHovered: boolean;
    isDragging: boolean;
  }) => {
    // Highlight selected task
    if (task.id === selectedTaskId) {
      return {
        backgroundColor: 'bg-yellow-400',
        borderColor: 'border-yellow-600',
        textColor: 'text-gray-900',
      };
    }

    // Special color for completed tasks
    if (task.percent === 100) {
      return {
        backgroundColor: 'bg-emerald-600',
        borderColor: 'border-emerald-800',
        textColor: 'text-white',
      };
    }

    // Tasks with dependencies
    if (task.dependencies && task.dependencies.length > 0) {
      return {
        backgroundColor: task.color || 'bg-blue-500',
        borderColor: 'border-blue-700',
        textColor: 'text-white',
      };
    }

    // Default colors
    return {
      backgroundColor: task.color || 'bg-blue-500',
      textColor: 'text-white',
    };
  };

  // Custom task renderer
  const renderTask = ({
    task,
    leftPx,
    widthPx,
    topPx,
    isHovered,
    isDragging,
    showProgress,
  }: {
    task: Task;
    leftPx: number;
    widthPx: number;
    topPx: number;
    isHovered: boolean;
    isDragging: boolean;
    showProgress?: boolean;
  }) => {
    // Get colors from the custom color function
    const { backgroundColor, borderColor, textColor } = getTaskColor({
      task,
      isHovered,
      isDragging,
    });

    // Define dynamic classes
    const bgClass = backgroundColor.startsWith('bg-') ? backgroundColor : '';
    const textClass = textColor || 'text-white';
    const borderClass = borderColor || '';

    // Apply inline styles for any non-class colors
    const styles: React.CSSProperties = {
      left: `${Math.max(0, leftPx)}px`,
      width: `${Math.max(20, widthPx)}px`,
      top: `${topPx}px`,
      backgroundColor: !backgroundColor.startsWith('bg-')
        ? backgroundColor
        : undefined,
      borderColor:
        borderColor && !borderColor.startsWith('border-')
          ? borderColor
          : undefined,
    };

    return (
      <div
        className={`absolute h-8 rounded ${bgClass} ${borderClass} ${textClass}
          flex items-center px-2 text-xs font-medium
          ${isHovered ? 'ring-2 ring-white' : ''}
          ${isDragging ? 'shadow-lg' : ''}
          ${task.id === selectedTaskId ? 'ring-2 ring-white' : ''}
          ${borderClass ? 'border' : ''}
        `}
        style={styles}
      >
        <div className='truncate'>{task.name}</div>

        {/* Custom progress indicator */}
        {showProgress && typeof task.percent === 'number' && (
          <div className='absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden'>
            <div
              className='h-full bg-white bg-opacity-80 rounded-full'
              style={{ width: `${task.percent}%` }}
            />
          </div>
        )}

        {/* Show dependencies indicator if they exist */}
        {task.dependencies && task.dependencies.length > 0 && (
          <div className='absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500' />
        )}
      </div>
    );
  };

  // Custom tooltip renderer
  const renderTooltip = ({
    task,
    position: _position,
    dragType,
    startDate,
    endDate,
  }: {
    task: Task;
    position: { x: number; y: number };
    dragType: 'move' | 'resize-left' | 'resize-right' | null;
    startDate: Date;
    endDate: Date;
  }) => {
    return (
      <div
        className={`bg-gray-800 dark:bg-gray-700 text-white p-3 rounded shadow-lg
          border border-gray-700 dark:border-gray-600
        `}
        style={{
          minWidth: '220px',
          maxWidth: '280px',
        }}
      >
        <div className='text-sm font-bold mb-1'>{task.name}</div>

        {dragType && (
          <div className='text-xs text-blue-300 mb-2'>
            {dragType === 'move'
              ? 'Moving task...'
              : dragType === 'resize-left'
                ? 'Adjusting start date...'
                : 'Adjusting end date...'}
          </div>
        )}

        <div className='grid grid-cols-2 gap-x-2 gap-y-1 text-xs'>
          <div className='text-gray-400'>Start:</div>
          <div>{format(startDate, 'MMM d, yyyy')}</div>

          <div className='text-gray-400'>End:</div>
          <div>{format(endDate, 'MMM d, yyyy')}</div>

          <div className='text-gray-400'>Progress:</div>
          <div>{task.percent || 0}%</div>

          {task.dependencies && task.dependencies.length > 0 && (
            <>
              <div className='text-gray-400'>Dependencies:</div>
              <div>{task.dependencies.join(', ')}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  const taskss: TaskGroup[] = [];
  for (let i = 0; i < 24; i++) {
    taskss.push({
      id: i.toString(),
      name: `Task ${i}`,
      tasks: [
        {
          id: `task-${i}`,
          name: `Task Name ${i}`,
          startDate: dayjs().hour(i).minute(0).toDate(),
          endDate: dayjs()
            .hour(i + 1)
            .minute(0)
            .toDate(),
          color: '#3a86ff',
        },
      ],
    });
  }

  useEffect(() => {
    const select = () => {
      const els = document.getElementsByClassName('rmg-timeline-container');
      return els[els.length - 1] as HTMLElement | null;
    };
    let el = select();
    if (!el) {
      console.warn('Elemento para pan não encontrado');
      return;
    }

    // defina touch-action cedo (pode ser 'none' ou 'pan-y' conforme sua necessidade)
    const previousTouchAction = el.style.touchAction || '';
    el.style.touchAction = 'none';

    let isDown = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;
    let rafId: number | null = null;

    const clamp = (n: number, min: number, max: number) =>
      Math.max(min, Math.min(max, n));
    const cancelRAF = () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      // opcional: só botão primário do mouse
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      // leia o elemento atual (pode ter sido re-montado)
      el = select();
      if (!el) return;

      // evita seleção de texto
      e.preventDefault();

      isDown = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startScrollLeft = el.scrollLeft;
      startScrollTop = el.scrollTop;

      try {
        el.setPointerCapture(pointerId);
      } catch {
        // se setPointerCapture falhar, ainda ouviremos pointermove no window como fallback
      }

      el.classList.add('dragging');
      el.style.userSelect = 'none';

      // debug
      // console.log('down', { startScrollLeft, startScrollTop });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      // opcional: ignorar movimentos de outros pointers
      if (pointerId != null && e.pointerId !== pointerId) return;

      el = select();
      if (!el) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);

      const newScrollLeft = clamp(startScrollLeft - dx, 0, maxScrollLeft);
      const newScrollTop = clamp(startScrollTop - dy, 0, maxScrollTop);

      cancelRAF();
      rafId = requestAnimationFrame(() => {
        // aplique somente se mudou (pequeno micro-otimização)
        if (el.scrollLeft !== newScrollLeft) el.scrollLeft = newScrollLeft;
        if (el.scrollTop !== newScrollTop) el.scrollTop = newScrollTop;
      });

      // debug
      // console.log('move', { dx, dy, newScrollLeft, newScrollTop });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;

      el = select();
      try {
        if (pointerId != null && el) el.releasePointerCapture(pointerId);
      } catch {
        // ignore
      }
      pointerId = null;

      if (el) {
        el.classList.remove('dragging');
        el.style.userSelect = '';
      }
      cancelRAF();

      // debug
      // console.log('up', { scrollLeft: el?.scrollLeft, scrollTop: el?.scrollTop });
    };

    // listeners: pointerdown no elemento; pointermove/up no window para garantir entrega
    el.addEventListener('pointerdown', onPointerDown);
    // pointermove e pointerup no window garante que eventos sejam recebidos mesmo que o ponteiro saia do elemento
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    // cleanup completo
    return () => {
      cancelRAF();
      el = select();
      if (el) {
        el.removeEventListener('pointerdown', onPointerDown);
        el.removeEventListener('pointercancel', onPointerUp);
        el.style.touchAction = previousTouchAction;
        el.classList.remove('dragging');
        el.style.userSelect = '';
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const options: Partial<GanttChartProps> = {
    onTaskRightClick(e, task, group) {
      e.stopPropagation();
      e.preventDefault();
      console.log('Right clicked task:', task, 'in group:', group);
    },
    styles: {
      container: 'no-scrollbar',
    },
  };

  return (
    <div style={{ height: 800 }}>
      <GanttChart
        tasks={taskss}
        title='Customized Gantt Chart'
        viewModes={[]}
        viewMode='hour'
        darkMode={darkMode}
        startDate={dayjs().startOf('day').toDate()}
        endDate={dayjs().endOf('day').toDate()}
        {...options}
      />
    </div>
  );
};

export default DemoCustomized;
