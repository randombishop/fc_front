import { getBackendUrl, getTaskUrl } from '../../utils';


class AsyncTaskHandler {

  private pollingInterval: number;
  private maxAttempts: number;
  

  constructor(pollingInterval: number = 1000, maxAttempts: number = 100) { 
    this.pollingInterval = pollingInterval;
    this.maxAttempts = maxAttempts;
  }

  async triggerTask(endpoint: string, payload: object): Promise<string> {
    const response = await fetch(getBackendUrl() + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to trigger task');
    }
    const data = await response.json();
    const ok = data.insertOK && data.publishOK && data.uuid;
    if (!ok) {
      console.error(`triggerTask error: ${JSON.stringify(data)}`) ;
      throw new Error('Failed to trigger task');
    }
    return data.uuid;
  }

  async checkTaskStatus(token: string): Promise<any> {
    const response = await fetch(getTaskUrl(token), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to check task status');
    }
    return await response.json();
  }

  async runTask(
    endpoint: string,
    payload: object
  ): Promise<any> {
    try {
      const token: string = await this.triggerTask(endpoint, payload);
      let attempts = 0;
      let task: any;
      while (attempts < this.maxAttempts) {
        attempts++;
        task = await this.checkTaskStatus(token);
        if (task.error || task.result) {
          if (task.result && task.result.error) {
            task.error = task.result.error ;    
          }
          return task ;
        }
        await new Promise((resolve) => setTimeout(resolve, this.pollingInterval));
      }
      return {error: 'Task timed out'};
    } catch (err: any) {
      return {error: err.message};
    }
  }

}

export default AsyncTaskHandler;