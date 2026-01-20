import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import type { JSX } from 'preact'
import { ChevronRight, Folder, FolderOpen, FileText } from 'lucide-preact'
import { cn } from '@/lib/utils'
import { type FileNode } from '@/data/fileTree'

export interface TreeNodeProps {
  /** The file node to render */
  node: FileNode
  /** Current depth level for indentation */
  depth?: number | undefined
  /** Currently selected file ID */
  selectedId?: string | undefined
  /** Callback when a file is clicked */
  onFileClick?: ((node: FileNode) => void) | undefined
}

export function TreeNode({
  node,
  depth = 0,
  selectedId,
  onFileClick,
}: TreeNodeProps): VNode {
  const [isExpanded, setIsExpanded] = useState(depth === 0)
  const isFolder = node.type === 'folder'
  const isSelected = selectedId === node.id
  const hasChildren = isFolder && node.children && node.children.length > 0

  // Sort children: folders first, then files (like VS Code)
  const sortedChildren = hasChildren && node.children
    ? [...node.children].sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1
        if (a.type !== 'folder' && b.type === 'folder') return 1
        return 0
      })
    : []

  const handleClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (isFolder) {
      setIsExpanded(!isExpanded)
    } else if (onFileClick) {
      onFileClick(node)
    }
  }

  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      if (isFolder) {
        setIsExpanded(!isExpanded)
      } else if (onFileClick) {
        onFileClick(node)
      }
    }
  }

  return (
    <div
      role="treeitem"
      aria-expanded={isFolder ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="select-none"
    >
      <div
        className={cn(
          'flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer',
          'transition-colors duration-150',
          'hover:bg-secondary/80',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
          isSelected && 'bg-primary/10 text-primary font-medium',
          !isSelected && 'text-foreground'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Expand/collapse chevron for folders */}
        {isFolder ? (
          <ChevronRight
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200',
              isExpanded && 'rotate-90',
              !hasChildren && 'invisible'
            )}
            aria-hidden="true"
          />
        ) : (
          <span className="w-4" aria-hidden="true" />
        )}

        {/* Icon */}
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" aria-hidden="true" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" aria-hidden="true" />
          )
        ) : (
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}

        {/* Name */}
        <span className="truncate text-sm">{node.name}</span>

        {/* Badge for files with details */}
        {!isFolder && node.details && (
          <span
            className={cn(
              'ml-auto text-xs px-1.5 py-0.5 rounded-full shrink-0',
              'bg-primary/10 text-primary dark:bg-primary/20'
            )}
          >
            {node.details.label}
          </span>
        )}
      </div>

      {/* Children */}
      {isFolder && hasChildren && isExpanded && (
        <div role="group" aria-label={`Contents of ${node.name}`}>
          {sortedChildren.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
