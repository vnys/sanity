import React from 'react'
import LinkIcon from 'part:@sanity/base/link-icon'
import {IntentLink} from 'part:@sanity/base/router'
import schema from 'part:@sanity/base/schema'
import {WithReferringDocuments} from 'part:@sanity/base/with-referring-documents'
import Dialog from 'part:@sanity/components/dialogs/default'
import DialogContent from 'part:@sanity/components/dialogs/content'
import {List, Item} from 'part:@sanity/components/lists/default'
import Spinner from 'part:@sanity/components/loading/spinner'
import Preview from '../../Preview'
import {AssetAction, AssetRecord} from './types'

import styles from './AssetDialog.css'

interface Props {
  actions: AssetAction[]
  asset: AssetRecord
  dialogType: string
  onAction: (action: AssetAction) => void
  onClose: () => void
}

export default function AssetDialog({actions, asset, dialogType, onAction, onClose}: Props) {
  return (
    <Dialog
      title={dialogType === 'error' ? 'Could not delete asset' : 'Documents using this'}
      color={dialogType === 'error' ? 'danger' : undefined}
      onClose={onClose}
      onAction={onAction}
      actions={actions}
    >
      <DialogContent size="medium" key={dialogType}>
        <div className={styles.dialogContent}>
          <img src={`${asset.url}?w=200`} style={{maxWidth: '200px'}} />

          <WithReferringDocuments id={asset._id}>
            {({isLoading, referringDocuments}) => {
              const drafts = referringDocuments.reduce(
                (acc, doc) => (doc._id.startsWith('drafts.') ? acc.concat(doc._id.slice(7)) : acc),
                []
              )

              const filteredDocuments = referringDocuments.filter(doc => !drafts.includes(doc._id))

              if (isLoading) {
                return <Spinner>Loading…</Spinner>
              }

              return (
                <div>
                  {filteredDocuments.length === 0 ? (
                    <div>No documents are referencing this asset</div>
                  ) : (
                    <>
                      {dialogType === 'error' && (
                        <div>
                          <h4 className={styles.dialogSubtitle}>
                            {filteredDocuments.length > 1
                              ? `${filteredDocuments.length} documents are using this asset`
                              : 'A document is using this asset'}
                          </h4>
                          <p className={styles.referringDocumentsDescription}>
                            {`Open the document${
                              referringDocuments.length > 1 ? 's' : ''
                            } and remove the asset before deleting it.`}
                          </p>
                        </div>
                      )}

                      <List>
                        {filteredDocuments.map(doc => {
                          return (
                            <Item key={doc._id}>
                              <IntentLink
                                intent="edit"
                                params={{id: doc._id}}
                                key={doc._id}
                                className={styles.intentLink}
                              >
                                <Preview value={doc} type={schema.get(doc._type)} />
                                <span className={styles.openDocLink}>
                                  <LinkIcon /> Open
                                </span>
                              </IntentLink>
                            </Item>
                          )
                        })}
                      </List>
                    </>
                  )}
                </div>
              )
            }}
          </WithReferringDocuments>
        </div>
      </DialogContent>
    </Dialog>
  )
}
