import ollama from 'ollama';

export class AiService {
  private static readonly ollamaResponse = async (message: string) => {
    try {
      const response = await ollama.chat({
        model: 'qwen2.5',
        messages: [{ role: 'user', content: message }],
      });
      return response;
    } catch (error: any) {
      console.error('Ollama connection error:', error);
      throw new Error(`Ollama service unavailable: ${error.message}`);
    }
  };

  public static async generate(message: string): Promise<string> {
    if (!message?.trim()) {
      throw new Error('Message cannot be empty');
    }

    try {
      const response = await AiService.ollamaResponse(message);
      console.log('Response from Ollama:', response);

      if (!response?.message?.content) {
        throw new Error('Invalid response format from Ollama');
      }

      return response.message.content;
    } catch (error: any) {
      console.error('AI generation error:', error);
      throw error; // Re-throw to preserve the original error
    }
  }
}
