import React from 'react'
import {useDrag} from 'react-use-gesture'
import reviewWorkflowStates from '../../config/states'
import {useMetadataList, useMetadataStatus} from '../../store'
import {Column} from './column'
import {ensureDraft, ensurePublished} from './helpers'
import {Navbar} from './navbar'

import styles from './Board.css'

const columns = reviewWorkflowStates

function useWorkflowBoard() {
  const [dragData, setDragData] = React.useState(null)
  const [targetState, setTargetState] = React.useState(null)
  const [assigneeId, setAssigneeId] = React.useState(null)
  const [typeNameFilter, setTypeNameFilter] = React.useState(null)
  const metadataList = useMetadataList(assigneeId)
  const metadataStatus = useMetadataStatus()
  const handleAssigneeFilterChange = id => setAssigneeId(id)
  const handleTypeNameFilterChange = name => setTypeNameFilter(name)

  const bindDrag = useDrag(({args, down, movement}) => {
    const [metadata, typeName] = args
    const [x, y] = movement
    const documentId = metadata._id.split('.')[1]

    if (down) {
      setDragData({
        documentId,
        down,
        x,
        y,
        state: metadata.state
      })
    } else {
      if (targetState && metadata.state !== targetState) {
        metadataList.move(documentId, targetState)

        if (targetState === 'published') {
          ensurePublished(documentId, typeName)
        } else {
          ensureDraft(documentId, typeName)
        }
      }

      setDragData(null)
      setTargetState(null)
    }
  })

  const handleAssigneeAdd = (metadataId, userId) => {
    metadataList.addAssignee(metadataId, userId)
  }

  const handleAssigneeRemove = (metadataId, userId) => {
    metadataList.removeAssignee(metadataId, userId)
  }

  const handleColumnDragEnter = state => {
    setTargetState(state)
  }

  const handleClearAssignees = metadataId => {
    metadataList.clearAssignees(metadataId)
  }

  return {
    bindDrag,
    dragData,
    handleAssigneeAdd,
    handleAssigneeRemove,
    handleAssigneeFilterChange,
    handleClearAssignees,
    handleColumnDragEnter,
    handleTypeNameFilterChange,
    metadataList,
    metadataStatus,
    targetState,
    typeNameFilter
  }
}

export default function Board() {
  const {
    bindDrag,
    dragData,
    handleAssigneeAdd,
    handleAssigneeRemove,
    handleAssigneeFilterChange,
    handleClearAssignees,
    handleColumnDragEnter,
    handleTypeNameFilterChange,
    metadataList,
    metadataStatus,
    targetState,
    typeNameFilter
  } = useWorkflowBoard()

  const hasUntagged = metadataStatus.untagged.length > 0

  if (metadataList.loading) return <div>Loading...</div>

  return (
    <div className={dragData ? styles.isDragging : styles.root}>
      <div className={styles.nav}>
        <Navbar
          onDocTypeChange={handleTypeNameFilterChange}
          onAssigneeFilterChange={handleAssigneeFilterChange}
        />
      </div>
      {hasUntagged && (
        <div className={styles.bannerActions}>
          {hasUntagged && (
            <div>
              <button onClick={metadataStatus.importUntagged}>
                Import {metadataStatus.untagged.length} untagged
              </button>
            </div>
          )}
        </div>
      )}
      <div className={styles.columnsContainer}>
        <div
          className={styles.columns}
          style={{minWidth: `${columns.length * 300 + (columns.length - 1)}px`}}
        >
          {columns.map(column => {
            return (
              <div key={column.state}>
                <Column
                  {...column}
                  bindDrag={bindDrag}
                  dragData={dragData}
                  isTarget={targetState === column.state}
                  onAssigneeAdd={handleAssigneeAdd}
                  onAssigneeRemove={handleAssigneeRemove}
                  onClearAssignees={handleClearAssignees}
                  onDragEnter={handleColumnDragEnter}
                  results={metadataList.data
                    .filter(m => m.state === column.state)
                    .filter(m => !typeNameFilter || m.ref._type === typeNameFilter)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
