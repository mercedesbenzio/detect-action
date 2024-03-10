import * as core from '@actions/core'
import client, { UploadArtifactOptions } from '@actions/artifact'

export async function uploadArtifact(
  name: string,
  outputPath: string,
  files: string[]
): Promise<void> {
  const options: UploadArtifactOptions = {
    retentionDays: 0
  }

  core.info(`Attempting to upload ${name}...`)

  const uploadResponse = await client.uploadArtifact(
    name,
    files,
    outputPath,
    options
  )

  if (uploadResponse.id && uploadResponse.size) {
    core.info(
      `Artifact ${name} has been successfully uploaded with id ${uploadResponse.id}!`
    )
  } else if (files.length === 0) {
    core.warning(`Expected to upload ${name}, but no files were provided!`)
  } else {
    core.warning(`An error was encountered when uploading ${name}.`)
  }
}
