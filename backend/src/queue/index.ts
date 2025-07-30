type Job = { fileId: string, path: string };

const queue: Job[] = [];

type OnJobCallback = (job: Job) => void;
let onJob: OnJobCallback | null = null;

export function enqueue(job: Job) {
  console.log(`[Queue] Enqueue job for fileId: ${job.fileId}`);
  queue.push(job);
  maybeRunNext();
}

export function registerWorker(callback: OnJobCallback) {
  if (onJob) {
    console.log('[Queue] A worker is already registered - replacing.');
  }
  onJob = callback;
  console.log('[Queue] Worker registered');
  maybeRunNext();
}

function maybeRunNext() {
  if(queue.length && onJob) {
    const job = queue.shift()!;
    console.log(`[Queue] Running job for fileId: ${job.fileId}, ${queue.length} jobs left in queue`);
    onJob(job);
  } else {
    if (!queue.length) {
      console.log('[Queue] No jobs in queue');
    }
    if (!onJob) {
      console.log('[Queue] No worker registered');
    }
  }
}
