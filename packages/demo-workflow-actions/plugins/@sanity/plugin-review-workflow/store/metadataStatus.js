import client from 'part:@sanity/base/client'
import workflowConfig from 'part:@sanity/plugin-review-workflow/config?'
import {map} from 'rxjs/operators'
import {getDocumentListStateObservable, getDocumentId} from '../lib/document-store'
import {useObservable} from '../lib/utils/hooks'

const workflowTypes = (workflowConfig && workflowConfig.types) || []

const noop = () => void 0

export function getMetadataStatusObservable() {
  const filter = `_id in path("**") && _type in $workflowTypes`
  const projection = `{
    _id,
    _type,
    "metadata": *[
      _type == "workflow.metadata" && (^._id == documentId || ^._id == "drafts." + documentId)
    ][0] {_id}
  }`
  const params = {workflowTypes}

  return getDocumentListStateObservable({
    filter,
    projection,
    params
  }).pipe(
    map(state => {
      const {data, ...restState} = state
      const info = {}

      if (data) {
        for (const d of data) {
          const id = getDocumentId(d._id)

          if (!info[id])
            info[id] = {id, type: d._type, metadata: false, published: false, draft: false}
          if (d.metadata) info[id].metadata = true
          if (d._id.startsWith('drafts.')) info[id].draft = true
          if (!d._id.startsWith('drafts.')) info[id].published = true
        }
      }

      const values = Object.values(info)
      const tagged = values.filter(d => d.metadata)
      const untagged = values.filter(d => !d.metadata)

      return {...restState, importUntagged, tagged, untagged}

      function importUntagged() {
        const tx = untagged.reduce((tx, d) => {
          return tx.createOrReplace({
            _id: `workflow-metadata.${d.id}`,
            _type: 'workflow.metadata',
            documentId: d.id,
            state: d.published ? 'published' : 'draft'
          })
        }, client.transaction())

        tx.commit().catch(err => {
          // TODO
          console.error(err)
        })
      }
    })
  )
}

export function useMetadataStatus() {
  const stream = getMetadataStatusObservable()
  const initialValue = {
    error: null,
    importUntagged: noop,
    loading: false,
    onRetry: noop,
    tagged: [],
    untagged: []
  }

  const keys = []

  return useObservable(stream, initialValue, keys)
}
