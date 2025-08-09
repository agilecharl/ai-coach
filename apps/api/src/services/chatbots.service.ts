import { Pool } from 'pg';

export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  createdAt: Date;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class ChatbotService {
  async getChatbots(): Promise<Chatbot[]> {
    const res = await pool.query('SELECT * FROM chatbots');
    return res.rows.map(
      (row: {
        id: any;
        name: any;
        description: any;
        avatar_url: any;
        created_at: any;
      }) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        avatarUrl: row.avatar_url,
        createdAt: row.created_at,
      })
    );
  }

  async createChatbot(data: Partial<Chatbot>): Promise<Chatbot> {
    const res = await pool.query(
      `INSERT INTO chatbots (name, description, avatar_url, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.name || 'Unnamed Chatbot',
        data.description,
        data.avatarUrl,
        new Date(),
      ]
    );
    const row = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
    };
  }
}
