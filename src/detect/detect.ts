import { exec } from '@actions/exec'

export class Detect {
  constructor(private readonly path: string) {}

  async run(args: string[]): Promise<number> {
    const detectArguments = ['-jar', this.path].concat(args)
    return exec(`java`, detectArguments, {
      ignoreReturnCode: true
    })
  }
}
