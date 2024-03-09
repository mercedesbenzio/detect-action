export interface ReportProperties {
  noPolicyViolationsFoundComment: string
  policyViolationsFoundCommentWarning: string
  policyViolationsFoundCommentFailure: string
  failureConditionsMet: boolean
  maxSize?: number
}
