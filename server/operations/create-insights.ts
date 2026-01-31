import type { Insight } from "../models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "../tables/insights.ts";
type Input = HasDBClient & {
  brand: number;
  text: string;
  createdAt: Date;
};
export default (input: Input): Insight => {
  console.log("Creating insight");

  const rows = input.db.sql<
    insightsTable.Row
  >`INSERT INTO insights (brand, text, createdAt) VALUES (${input.brand}, ${input.text}, ${input.createdAt}) RETURNING *`;

  if (rows.length === 0) {
    throw new Error("Failed to create insight");
  }

  const row = rows[0];

  const result: Insight = {
    ...row,
    createdAt: new Date(row.createdAt),
  };

  console.log("Created insights successfully: ", result);
  return result;
};
