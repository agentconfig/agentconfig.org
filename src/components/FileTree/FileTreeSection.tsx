import { useState } from 'preact/hooks'
import type { VNode } from 'preact'
import { type FileNode } from '@/data/fileTree'
import { FileTree } from './FileTree'
import { FileDetail } from './FileDetail'

export function FileTreeSection(): VNode {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)

  const handleFileClick = (node: FileNode) => {
    // Only select files with details
    if (node.type === 'file' && node.details) {
      setSelectedFile(node)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Tree panel */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Project Structure
        </h3>
        <FileTree
          selectedId={selectedFile?.id}
          onFileClick={handleFileClick}
        />
      </div>

      {/* Detail panel */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          File Details
        </h3>
        <FileDetail node={selectedFile} />
      </div>
    </div>
  )
}
