import { Reporter } from './reporter'
import { GitHubPRCommenter } from '../github/comment'
import { ReportResult } from '../model/report-result'

export class CommentReporter implements Reporter {
  constructor(private readonly gitHubPRCommenter: GitHubPRCommenter) {}

  async report(data: ReportResult): Promise<void> {
    await this.gitHubPRCommenter.comment(data.report)
  }
}
