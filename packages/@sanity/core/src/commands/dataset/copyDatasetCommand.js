import EventSource from 'eventsource'
import Observable from '@sanity/observable/minimal'
import chalk from 'chalk'
import promptForDatasetName from '../../actions/dataset/datasetNamePrompt'
import validateDatasetName from '../../actions/dataset/validateDatasetName'

const helpText = `
Options
  --wait Waits for the operation to finish

Examples
  sanity dataset copy
  sanity dataset copy <source-dataset>
  sanity dataset copy <source-dataset> <target-dataset>
`

const progress = url => {
  return new Observable(observer => {
    const progressSource = new EventSource(url)

    function onError(error) {
      progressSource.close()
      observer.error(error)
    }

    function onMessage(event) {
      observer.next(JSON.parse(event.data))
    }

    function onComplete() {
      progressSource.removeEventListener('error', onError)
      progressSource.removeEventListener('channelError', onError)
      progressSource.removeEventListener('job', onMessage)
      progressSource.removeEventListener('done', onComplete)
      progressSource.close()
      observer.complete()
    }

    progressSource.addEventListener('error', onError)
    progressSource.addEventListener('channelError', onError)
    progressSource.addEventListener('job', onMessage)
    progressSource.addEventListener('done', onComplete)
  })
}

export default {
  name: 'copy',
  group: 'dataset',
  signature: '[SOURCE_DATASET] [TARGET_DATASET]',
  helpText,
  description: 'Copies a dataset including its assets to a new dataset',
  action: async (args, context) => {
    const {apiClient, output, prompt} = context
    const [sourceDataset, targetDataset] = args.argsWithoutOptions
    const flags = args.extOptions
    const client = apiClient()

    const nameError = sourceDataset && validateDatasetName(sourceDataset)
    if (nameError) {
      throw new Error(nameError)
    }

    const [datasets] = await Promise.all([
      client.datasets.list().then(sets => sets.map(ds => ds.name))
    ])

    const sourceDatasetName = await (sourceDataset || promptForDatasetName(prompt))
    if (!datasets.includes(sourceDatasetName)) {
      throw new Error(`Dataset "${sourceDatasetName}" doesn't exist`)
    }

    const targetDatasetName = await (targetDataset || promptForDatasetName(prompt))
    if (datasets.includes(targetDatasetName)) {
      throw new Error(`Dataset "${targetDatasetName}" already exists`)
    }

    try {
      const response = await client.datasets.copy(sourceDatasetName, targetDatasetName)
      output.print('Dataset copying successfully started...')

      if (!flags.wait) {
        return
      }

      const spinner = output
        .spinner({
          text: `Copying dataset ${chalk.green(sourceDatasetName)} to ${chalk.green(
            targetDatasetName
          )}`
        })
        .start()

      progress(`${client.config().apiHost}/v1/jobs/${response.id}/listen`).subscribe({
        next: event => {
          spinner.text = `Copying dataset ${chalk.green(sourceDatasetName)} to ${chalk.green(
            targetDatasetName
          )}... ${event.progress}% done.`
        },
        error: () => {
          spinner.fail('There was an error copying the dataset.')
        },
        complete: () => {
          spinner.succeed(
            `Finished copying dataset ${chalk.green(sourceDatasetName)} to ${chalk.green(
              targetDatasetName
            )}.`
          )
        }
      })
    } catch (err) {
      throw new Error(`Dataset copying failed:\n${err.message}`)
    }
  }
}
