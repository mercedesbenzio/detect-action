import {
  IComponentReport,
  ILicenseReport,
  IUpgradeReport,
  IVulnerabilityReport,
  ReportLine
} from '../model/report-line'
import { ReportResult } from '../model/report-result'
import { ReportGenerator } from './report-generator'
import { ReportProperties } from './report-properties'
import { TextBuilder } from './text-builder'
import { BlackDuckScanReportGenerator } from './blackduck-scan-report-generator'

const HEADER =
  '| Policies Violated | Dependency | License(s) | Vulnerabilities | Short Term Recommended Upgrade | Long Term Recommended Upgrade |'
const HEADER_ALIGNMENT = '|-|-|-|-|-|-|'

export class BlackDuckReportGenerator
  implements ReportGenerator<ReportProperties, ReportResult>
{
  constructor(
    private readonly blackDuckScanReportGenerator: BlackDuckScanReportGenerator
  ) {}

  private makeReportLine(line: ReportLine): string {
    return `| ${line.policiesViolated} | ${line.dependency} | ${line.licenses} | ${line.vulnerabilities} | ${line.shortTermRecommendedUpgrade} | ${line.longTermRecommendedUpdate} |`
  }

  private addTitleToTextBuilder(
    textBuilder: TextBuilder,
    properties: ReportProperties
  ): void {
    const comment = properties.failureConditionsMet
      ? properties.policyViolationsFoundCommentFailure
      : properties.policyViolationsFoundCommentWarning
    textBuilder.addLines(comment)
  }

  private addHeaderToTextBuilder(textBuilder: TextBuilder): void {
    textBuilder.addLines(HEADER, HEADER_ALIGNMENT)
  }

  private async addContentToTextBuilder(
    textBuilder: TextBuilder,
    componentReports: IComponentReport[]
  ): Promise<boolean> {
    let isContentTruncated = false
    for (const componentReport of componentReports) {
      const line: ReportLine = {
        policiesViolated: this.getViolatedPolicies(
          componentReport.violatedPolicies
        ),
        dependency: this.getDependency(componentReport),
        licenses: this.getLicenses(componentReport.licenses),
        vulnerabilities: this.getVulnerabilities(
          componentReport.vulnerabilities
        ),
        shortTermRecommendedUpgrade: this.getTermUpgrade(
          componentReport.shortTermUpgrade
        ),
        longTermRecommendedUpdate: this.getTermUpgrade(
          componentReport.longTermUpgrade
        )
      }
      const theReportLine = this.makeReportLine(line)
      const addedLines = textBuilder.tryAddLines(theReportLine)
      if (!addedLines) {
        isContentTruncated = true
        break
      }
    }
    return isContentTruncated
  }

  private async generateSuccessReport(
    properties: ReportProperties
  ): Promise<ReportResult> {
    return {
      report: properties.noPolicyViolationsFoundComment,
      failed: false,
      truncated: false,
      hasPolicyViolations: false
    }
  }

  private async generateFailureReport(
    componentReports: IComponentReport[],
    properties: ReportProperties
  ): Promise<ReportResult> {
    const textBuilder = new TextBuilder(properties.maxSize)

    this.addTitleToTextBuilder(textBuilder, properties)
    this.addHeaderToTextBuilder(textBuilder)
    const result = await this.addContentToTextBuilder(
      textBuilder,
      componentReports
    )

    return {
      report: textBuilder.build(),
      failed: properties.failureConditionsMet,
      truncated: result,
      hasPolicyViolations: true
    }
  }

  async generateReport(
    path: string,
    properties: ReportProperties
  ): Promise<ReportResult> {
    const blackDuckScanReport =
      await this.blackDuckScanReportGenerator.generateReport(path)
    return blackDuckScanReport.hasPolicyViolations
      ? this.generateFailureReport(blackDuckScanReport.reports, properties)
      : this.generateSuccessReport(properties)
  }

  private getViolatedPolicies(violatedPolicies: string[]): string {
    return violatedPolicies.join('<br/>')
  }

  private getDependency(component: IComponentReport): string {
    return component?.href
      ? `[${component.name}](${component.href})`
      : component.name
  }

  private getLicenses(licenses: ILicenseReport[]): string {
    return licenses
      .map(license => {
        const name = license.href
          ? `[${license.name}](${license.href})`
          : license.name
        return `${license.violatesPolicy ? ':x: &nbsp; ' : ''}${name}`
      })
      .join('<br/>')
  }

  private getVulnerabilities(vulnerabilities: IVulnerabilityReport[]): string {
    // noinspection SpellCheckingInspection
    return vulnerabilities
      .map(
        vulnerability =>
          `${vulnerability.violatesPolicy ? ':x: &nbsp; ' : ''}[${
            vulnerability.name
          }](${vulnerability.href})${
            vulnerability.cvssScore && vulnerability.severity
              ? ` ${vulnerability.severity}: CVSS ${vulnerability.cvssScore}`
              : ''
          }`
      )
      .join('<br/>')
  }

  private getTermUpgrade(upgradeReport?: IUpgradeReport): string {
    return upgradeReport
      ? `[${upgradeReport.name}](${upgradeReport.href}) (${upgradeReport.vulnerabilityCount} known vulnerabilities)`
      : ''
  }
}
