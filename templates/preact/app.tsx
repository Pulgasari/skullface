import { signal } from "@preact/signals";

const count = signal(0);

export function App() {
  return (
    <div>
      <h1>Preact + Signals</h1>
      <button onClick={() => count.value++}>Increment</button>
      <p>{count}</p>
    </div>
  );
}
