import useAccelerometer from "../hooks/useAccelerometer";

export default function Home() {
  const { x, y, z } = useAccelerometer();

  return (
    <div>
      <h1>Accéléromètre iPhone</h1>
      <div>
        <p>Accélération X: {x ? x.toFixed(2) : "En attente..."}</p>
        <p>Accélération Y: {y ? y.toFixed(2) : "En attente..."}</p>
        <p>Accélération Z: {z ? z.toFixed(2) : "En attente..."}</p>
      </div>
    </div>
  );
}
