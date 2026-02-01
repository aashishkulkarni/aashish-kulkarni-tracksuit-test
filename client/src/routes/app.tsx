import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import { AddInsight } from "../components/add-insight/add-insight.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [addInsightOpen, setAddInsightOpen] = useState(false);

  //load insights
  useEffect(() => {
    const loadInsights = async () => {
      const response = await fetch("/api/insights");
      const data: Insight[] = await response.json();
      setInsights(data);
    };

    loadInsights();
  }, []);

  //delete insight
  const deleteInsight = async (id: number) => {
    await fetch(`/api/insights/delete/${id}`, { method: "DELETE" });

    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  //Add insight
  const addInsight = async (brand: number, text: string) => {
    const response = await fetch(`/api/insights/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand,
        text,
        createdAt: new Date().toISOString(),
      }),
    });

    const created: Insight = await response.json();

    setInsights((prev) => [created, ...prev]);
    setAddInsightOpen(false);
  };

  return (
    <main className={styles.main}>
      <Header onAddClick={() => setAddInsightOpen(true)} />

      <AddInsight
        open={addInsightOpen}
        onClose={() => setAddInsightOpen(false)}
        add={addInsight}
      />

      <Insights
        className={styles.insights}
        insights={insights}
        onDelete={deleteInsight}
      />
    </main>
  );
};
