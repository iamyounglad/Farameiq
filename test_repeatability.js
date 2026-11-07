import http from 'http';
import https from 'https';

// Small 1x1 or test base64 JPEG
const sampleBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

async function runAnalysisRun(runIndex) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      imageBase64: sampleBase64,
      mimeType: "image/jpeg",
      fileName: "repeatability_test.jpg",
      fileSizeKB: 2,
      imageDimensions: { width: 800, height: 600 }
    });

    const req = http.request({
      hostname: "localhost",
      port: 3000,
      path: "/api/analyze",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Run ${runIndex} failed with status ${res.statusCode}: ${data}`));
        }
        try {
          const json = JSON.parse(data);
          resolve({
            run: runIndex,
            overallScore: json.overallScore,
            tier: json.overallTier,
            model: json.engineMetadata?.modelIdentifier,
            promptVersion: json.engineMetadata?.promptVersion,
            categories: json.categories
          });
        } catch (e) {
          reject(new Error(`Run ${runIndex} JSON parse error: ${data.slice(0, 100)}`));
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log("================================================================");
  console.log("FRAMEIQ BY FAZLENZ — REPEATABILITY TESTING (5 CONSECUTIVE RUNS)");
  console.log("================================================================");

  const runs = 5;
  const results = [];

  for (let i = 1; i <= runs; i++) {
    try {
      console.log(`Executing run ${i}/${runs}...`);
      const res = await runAnalysisRun(i);
      results.push(res);
      console.log(` -> Run ${i} Success: Overall Score = ${res.overallScore} (${res.tier}) [Prompt: ${res.promptVersion}]`);
    } catch (err) {
      console.error(` -> Run ${i} Error:`, err.message);
      results.push({ run: i, error: err.message });
    }
    // Brief pause between runs
    await new Promise(r => setTimeout(r, 600));
  }

  const validScores = results.filter(r => !r.error).map(r => r.overallScore);
  if (validScores.length > 0) {
    const min = Math.min(...validScores);
    const max = Math.max(...validScores);
    const variance = max - min;
    console.log("----------------------------------------------------------------");
    console.log(`REPEATABILITY SUMMARY (${validScores.length} successful runs):`);
    console.log(`Scores: ${validScores.join(', ')}`);
    console.log(`Minimum Score: ${min}`);
    console.log(`Maximum Score: ${max}`);
    console.log(`Score Variation: ${variance} points (Target: <= 5 points)`);
    if (variance <= 5) {
      console.log("STATUS: SUCCESS — REPEATABILITY TARGET MET!");
    } else {
      console.log("STATUS: VARIANCE EXCEEDS TARGET.");
    }
    console.log("================================================================");
  } else {
    console.error("All runs failed.");
  }
}

main();
