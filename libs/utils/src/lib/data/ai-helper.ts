import { insertRecord } from './rest';

export const getRecordsOllamaResponse = (
  endpoint: string,
  body: any
): Promise<string | { message: string }> => {
  return new Promise((resolve, reject) => {
    insertRecord(endpoint, body)
      .then((response: { content: any } | undefined) => {
        if (response === undefined) {
          resolve({ message: 'No content found' });
        } else {
          const content = response.content;

          if (content) {
            resolve(content);
          } else {
            resolve({ message: 'No content found' });
          }
        }
      })
      .catch((error: any) => {
        console.log('Ollama error', error);
        let errorMessage;
        if (typeof error === 'string') {
          errorMessage = error;
        } else {
          errorMessage = JSON.stringify(error);
        }
        reject(error instanceof Error ? error : new Error(errorMessage));
      });
  });
};

export const getChatResponse = (
  task: string,
  message: string
): Promise<string | { message: string }> => {
  return new Promise((resolve, reject) => {
    try {
      let requestMessage;

      if (task === 'instruction') {
        requestMessage = message;
      } else if (task === 'summary') {
        requestMessage = 'Create a summary of the page : ' + message;
      }

      getRecordsOllamaResponse('ai/generate', {
        title: requestMessage
          ? requestMessage.substring(0, 250)
          : message.substring(0, 250),
        message: requestMessage,
        url: '',
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          let errorObj;
          if (error instanceof Error) {
            errorObj = error;
          } else {
            errorObj = new Error(
              typeof error === 'string' ? error : JSON.stringify(error)
            );
          }
          reject(errorObj);
        });
    } catch (error) {
      let errorObj;
      if (error instanceof Error) {
        errorObj = error;
      } else {
        errorObj = new Error(
          typeof error === 'string' ? error : JSON.stringify(error)
        );
      }
      reject(errorObj);
    }
  });
};
