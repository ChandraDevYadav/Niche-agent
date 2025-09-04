export default function NicheResult({ recommendation }) {
  return (
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">Recommendation:</h2>
      <pre className="whitespace-pre-wrap">{recommendation}</pre>
    </div>
  );
}
