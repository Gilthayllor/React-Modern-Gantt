import React, { useRef, useState } from 'react';
import { TaskGroup, ViewMode, TaskListProps } from '@/types';
import { CollisionService } from '@/services';
import TooltipGroup from '../ui/TooltipGroup';

/**
 * TaskList Component - Displays the list of task groups on the left side of the Gantt chart
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks = [],
  headerLabel = 'Resources',
  showIcon = false,
  showTaskCount = false,
  showDescription = true,
  rowHeight = 40,
  className = '',
  onGroupClick,
  showTooltipGroup,
  renderTooltipGroup,
  viewMode,
}) => {
  const [hoveredGroup, setHoveredGroup] = useState<TaskGroup | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Validate task groups array
  const validTasks = Array.isArray(tasks) ? tasks : [];

  // Calculate height for each group based on tasks
  const getGroupHeight = (taskGroup: TaskGroup) => {
    if (!taskGroup.tasks || !Array.isArray(taskGroup.tasks)) {
      return 60; // Default height for empty groups
    }

    const taskRows = CollisionService.detectOverlaps(taskGroup.tasks, viewMode);
    return Math.max(60, taskRows.length * rowHeight + 20);
  };

  // Handle group click
  const handleGroupClick = (group: TaskGroup) => {
    if (onGroupClick) {
      onGroupClick(group);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setTooltipPosition({
      x: e.clientX + 20,
      y: e.clientY,
    });
  };

  const handleGroupMouseEnter = (group: TaskGroup) => {
    setHoveredGroup(group);
  };

  const handleGroupMouseLeave = () => {
    setHoveredGroup(null);
  };

  return (
    <div
      className={`rmg-task-list ${className}`}
      data-rmg-component='task-list'
    >
      {/* Header - CSS handles the height adjustment based on view mode */}
      <div className='rmg-task-list-header'>{headerLabel}</div>

      {/* Task Groups */}
      {validTasks.map(taskGroup => {
        if (!taskGroup) return null;

        const groupHeight = getGroupHeight(taskGroup);

        return (
          <div
            key={`task-group-${taskGroup.id || 'unknown'}`}
            className='rmg-task-group'
            style={{ height: `${groupHeight}px` }}
            onClick={() => handleGroupClick(taskGroup)}
            onMouseEnter={() => handleGroupMouseEnter(taskGroup)}
            onMouseLeave={handleGroupMouseLeave}
            onMouseMove={handleMouseMove}
            data-testid={`task-group-${taskGroup.id || 'unknown'}`}
            data-rmg-component='task-group'
            data-group-id={taskGroup.id}
          >
            <div className='rmg-task-group-content'>
              {/* Icon (if enabled) */}
              {showIcon && taskGroup.icon && (
                <span
                  className='rmg-task-group-icon'
                  dangerouslySetInnerHTML={{ __html: taskGroup.icon }}
                  data-rmg-component='task-group-icon'
                />
              )}

              {/* Group name */}
              <div
                className='rmg-task-group-name'
                data-rmg-component='task-group-name'
              >
                {taskGroup.name || 'Unnamed'}
              </div>
            </div>

            {/* Description (if available and enabled) */}
            {showDescription && taskGroup.description && (
              <div
                className='rmg-task-group-description'
                data-rmg-component='task-group-description'
              >
                {taskGroup.description}
              </div>
            )}

            {/* Task count (if enabled) */}
            {showTaskCount && taskGroup.tasks && taskGroup.tasks.length > 0 && (
              <div
                className='rmg-task-group-count'
                data-rmg-component='task-group-count'
              >
                {taskGroup.tasks.length}{' '}
                {taskGroup.tasks.length === 1 ? 'task' : 'tasks'}
              </div>
            )}
          </div>
        );
      })}
      {showTooltipGroup && hoveredGroup && (
        <TooltipGroup
          group={hoveredGroup}
          position={{ x: tooltipPosition.x, y: tooltipPosition.y }}
          renderTooltip={renderTooltipGroup}
        />
      )}
    </div>
  );
};

export default TaskList;
