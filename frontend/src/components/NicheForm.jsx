import { useState } from "react";
import { api } from "../api";
import NicheResult from "./NicheResult";

export default function NicheForm() {
  const [formData, setFormData] = useState([{ question: "", answer: "" }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/", { formData });
      setResult(response.data.response.result.recommendation);
    } catch (err) {
      console.error(err);
      setResult("Error generating niche recommendation.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (idx, field, value) => {
    const newData = [...formData];
    newData[idx][field] = value;
    setFormData(newData);
  };

  const addPair = () =>
    setFormData([...formData, { question: "", answer: "" }]);
  const removePair = (idx) => setFormData(formData.filter((_, i) => i !== idx));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Consulting Niche Generator</h1>
      <form onSubmit={handleSubmit}>
        {formData.map((pair, idx) => (
          <div key={idx} className="mb-3">
            <input
              placeholder="Question"
              value={pair.question}
              onChange={(e) => handleChange(idx, "question", e.target.value)}
              className="border p-2 mr-2 w-80"
            />
            <input
              placeholder="Answer"
              value={pair.answer}
              onChange={(e) => handleChange(idx, "answer", e.target.value)}
              className="border p-2 mr-2 w-80"
            />
            {formData.length > 1 && (
              <button
                type="button"
                onClick={() => removePair(idx)}
                className="text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addPair}
          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
        >
          Add Question
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Niche"}
        </button>
      </form>

      {result && <NicheResult recommendation={result} />}
    </div>
  );
}
