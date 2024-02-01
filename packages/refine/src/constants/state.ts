export enum WorkloadState {
  UPDATEING = 'updating',
  READY = 'ready',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SUSPENDED = 'suspended',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  UNKNOWN = 'unknown',
  TERMINATING = 'terminating',
  PENDING = 'pending',
  WAITING = 'waiting',
}

// export type DeploymentState = WorkloadState.UPDATEING | WorkloadState.READY;
