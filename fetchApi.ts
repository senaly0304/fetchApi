async function fetchApi(url: string, options?: RequestInit): Promise<Response> {
  const apiRequest = async () => {
    const res = await fetch(url, options);

    return res;
  };
  const response = await pollingWhileDuration(apiRequest);

  return response;
}

const pollingWhileDuration = async (asyncRequest: () => Promise<Response>, durationMs = 3000, intervalMs = 200) => {
  const start = performance.now();
  for (;;) {
    let response;
    try {
      response = await asyncRequest();
    } catch {
      response = { ok: false, status: 0 } as Response; // This is dummy response.
    }

    // Break if more than wait 3 seconds.
    if (response?.ok || performance.now() - start > durationMs) {
      return response;
    } else {
      await sleep(intervalMs);
    }
  }
}

const sleep = (delay: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay));