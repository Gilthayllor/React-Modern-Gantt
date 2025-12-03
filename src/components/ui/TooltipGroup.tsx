import { TooltipGroupProps, TooltipGroupRenderProps } from '@/types';
import React from 'react';

/**
 * Tooltip Group Component - Shows group information on hover
 */
const TooltipGroup: React.FC<
  TooltipGroupProps & {
    renderTooltip?: (props: TooltipGroupRenderProps) => React.ReactNode;
  }
> = ({ position, className = '', renderTooltip, group, rowHeight = 60 }) => {
  if (renderTooltip) {
    return (
      <div
        className={`rmg-tooltip ${className} rmg-tooltip-visible`}
        style={{
          left: `${position.x}px`,
          top: `${position.y - rowHeight}px`,
        }}
        data-rmg-component='tooltip'
      >
        {renderTooltip({
          position,
          group,
        })}
      </div>
    );
  }

  // Default tooltip group rendering
  return (
    <div
      className={`rmg-tooltip ${className} rmg-tooltip-visible`}
      style={{
        left: `${position.x}px`,
        top: `${position.y - rowHeight}px`,
      }}
      data-rmg-component='tooltip'
    >
      {/* Group name */}
      <div className='rmg-tooltip-title' data-rmg-component='tooltip-title'>
        {group.name || 'Unnamed Group'}
      </div>
      {/* Group description */}
      <div className='rmg-tooltip-content' data-rmg-component='tooltip-content'>
        <div className='rmg-tooltip-row' data-rmg-component='tooltip-row'>
          <div className='rmg-tooltip-label'>Description:</div>
          <div className='rmg-tooltip-value'>
            {group.description || 'No description'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TooltipGroup;
