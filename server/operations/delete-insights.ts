import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "../tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};
export default (input: Input): void => {
  console.log(`Looking up insight for id=${input.id}`);

  const [row] = input.db
    .sql<
    insightsTable.Row
  >`SELECT * FROM insights WHERE id = ${input.id} LIMIT 1`;

  if (row) {
    input.db.sql`DELETE FROM insights WHERE id = ${input.id}`;
    console.log("Deleted insight successfully!");
  } else {
    console.log("Insight not found, nothing to delete");
  }
};
