import * as core from '@actions/core'

export interface Inputs {
  token: string
  blackDuckUrl: string
  blackDuckApiToken: string
  detectVersion?: string
  scanMode: string
  failOnAllPolicySeverities: boolean
  outputPathOverride: string
  detectTrustCertificate: string
  failIfDetectFails: boolean
  commentPrOnSuccess: boolean
  noPolicyViolationsFoundComment: string
  policyViolationsFoundCommentWarning: string
  policyViolationsFoundCommentFailure: string
}

export enum Input {
  // noinspection SpellCheckingInspection
  GITHUB_TOKEN = 'github-token',
  BLACKDUCK_URL = 'blackduck-url',
  BLACKDUCK_API_TOKEN = 'blackduck-api-token',
  DETECT_VERSION = 'detect-version',
  SCAN_MODE = 'scan-mode',
  FAIL_ON_ALL_POLICY_SEVERITIES = 'fail-on-all-policy-severities',
  OUTPUT_PATH_OVERRIDE = 'output-path-override',
  DETECT_TRUST_CERTIFICATE = 'detect-trust-cert',
  FAIL_IF_DETECT_FAILS = 'fail-if-detect-fails',
  COMMENT_PR_ON_SUCCESS = 'comment-pr-on-success',
  NO_POLICY_VIOLATIONS_FOUND_COMMENT = 'no-policy-violations-found-comment',
  POLICY_VIOLATIONS_FOUND_COMMENT_WARNING = 'policy-violations-found-comment-warning',
  POLICY_VIOLATIONS_FOUND_COMMENT_FAILURE = 'policy-violations-found-comment-failure'
}

export function gatherInputs(): Inputs {
  const token = getInputGitHubToken()
  const blackDuckUrl = getInputBlackDuckUrl()
  const blackDuckApiToken = getInputBlackDuckApiToken()
  const detectVersion = getInputDetectVersion()
  const scanMode = getInputScanMode()
  const failOnAllPolicySeverities = getInputFailOnAllPolicySeverities()
  const outputPathOverride = getInputOutputPathOverride()
  const detectTrustCertificate = getInputDetectTrustCertificate()
  const failIfDetectFails = getInputFailIfDetectFails()
  const commentPrOnSuccess = getInputCommentPrOnSuccess()
  const noPolicyViolationsFoundComment = getNoPolicyViolationsFoundComment()
  const policyViolationsFoundCommentWarning =
    getPolicyViolationsFoundCommentWarning()
  const policyViolationsFoundCommentFailure =
    getPolicyViolationsFoundCommentFailure()
  return {
    token,
    blackDuckUrl,
    blackDuckApiToken,
    detectVersion,
    scanMode,
    failOnAllPolicySeverities,
    outputPathOverride,
    detectTrustCertificate,
    failIfDetectFails,
    commentPrOnSuccess,
    noPolicyViolationsFoundComment,
    policyViolationsFoundCommentWarning,
    policyViolationsFoundCommentFailure
  }
}

function getInputGitHubToken(): string {
  return core.getInput(Input.GITHUB_TOKEN, { required: true })
}

function getInputBlackDuckUrl(): string {
  return core.getInput(Input.BLACKDUCK_URL, { required: true })
}

function getInputBlackDuckApiToken(): string {
  return core.getInput(Input.BLACKDUCK_API_TOKEN, { required: true })
}

function getInputDetectVersion(): string | undefined {
  return core.getInput(Input.DETECT_VERSION) ?? undefined
}

function getInputScanMode(): string {
  return core.getInput(Input.SCAN_MODE).toUpperCase()
}

function getInputFailOnAllPolicySeverities(): boolean {
  return core.getBooleanInput(Input.FAIL_ON_ALL_POLICY_SEVERITIES)
}

function getInputOutputPathOverride(): string {
  return core.getInput(Input.OUTPUT_PATH_OVERRIDE)
}

function getInputDetectTrustCertificate(): string {
  return core.getInput(Input.DETECT_TRUST_CERTIFICATE)
}

function getInputFailIfDetectFails(): boolean {
  return core.getBooleanInput(Input.FAIL_IF_DETECT_FAILS)
}

function getInputCommentPrOnSuccess(): boolean {
  return core.getBooleanInput(Input.COMMENT_PR_ON_SUCCESS)
}

function getNoPolicyViolationsFoundComment(): string {
  return core.getInput(Input.NO_POLICY_VIOLATIONS_FOUND_COMMENT)
}

function getPolicyViolationsFoundCommentWarning(): string {
  return core.getInput(Input.POLICY_VIOLATIONS_FOUND_COMMENT_WARNING)
}

function getPolicyViolationsFoundCommentFailure(): string {
  return core.getInput(Input.POLICY_VIOLATIONS_FOUND_COMMENT_FAILURE)
}
