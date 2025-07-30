import { registerWorker } from '../queue';
import FileModel from '../models/File';
import { scanFileForMalware } from '../utils/malwareScan';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scanJob(job: { fileId: string; path: string }) {
  console.log(`[Worker] Starting scan for fileId ${job.fileId}`);

  // simulate delay 2-5 seconds
  const delay = 2000 + Math.floor(Math.random() * 3000);
  console.log(`[Worker] Scanning will take ~${delay} ms`);
  await sleep(delay);

  try {
    // scan for malware keywords
    const result = await scanFileForMalware(job.path);
    console.log(`[Worker] Scan result for fileId ${job.fileId}: ${result}`);

    // update DB
    await FileModel.findByIdAndUpdate(job.fileId, {
      status: 'scanned',
      result,
      scannedAt: new Date(),
    });

    console.log(`[Worker] Database updated for fileId ${job.fileId}`);
  } catch (err) {
    console.error(`[Worker] Error scanning fileId ${job.fileId}:`, err);
  }

  // Always trigger next job, whether error or success
  setImmediate(() => registerWorker(scanJob));
}

// Register the worker once to start processing jobs
registerWorker(scanJob);
