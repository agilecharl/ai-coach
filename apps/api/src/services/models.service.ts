import { Pool } from 'pg';

export interface Model {
  id: string;
  name: string;
  description?: string;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class ModelService {
  async getModels(): Promise<Model[]> {
    const res = await pool.query('SELECT * FROM ai_models');
    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
    }));
  }

  async createModel(data: Partial<Model>): Promise<Model> {
    const res = await pool.query(
      `INSERT INTO ai_models (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name || 'Unnamed Model', data.description, new Date()]
    );
    const row = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
    };
  }
}
