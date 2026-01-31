// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import { Application, Router } from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import { createTable } from "./tables/insights.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsights from "./operations/create-insights.ts";
import deleteInsights from "./operations/delete-insights.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT") ?? "8080"),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.exec(createTable);
console.log("Initialising server");

const router = new Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx) => {
  // TODO
  const body = await ctx.request.body.json();
  const result = createInsights({
    db,
    brand: body.brand,
    text: body.text,
    createdAt: body.createdAt,
  });
  ctx.response.body = result;
  ctx.response.status = 201;
});

router.delete("/insights/delete/:id", (ctx) => {
  // TODO
  const id = Number(ctx.params.id);

  if (Number.isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid ID" };
    return;
  }

  deleteInsights({ db, id });
  ctx.response.status = 204;
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
