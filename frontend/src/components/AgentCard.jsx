export default function AgentCard({ agent }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="font-bold text-lg">{agent.name}</h2>
      <p className="text-gray-700">{agent.description}</p>
      <p className="text-sm text-gray-500">Protocol: {agent.protocolVersion}</p>
    </div>
  );
}
