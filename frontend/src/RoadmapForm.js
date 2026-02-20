import React, { useState } from "react";

function RoadmapForm() {
  const [formData, setFormData] = useState({
    educationLevel: "",
    targetField: "",
    experienceLevel: "",
    duration: "",
    goal: ""
  });

  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Generate Learning Roadmap</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="educationLevel" placeholder="Education Level" onChange={handleChange} required /><br/>
        <input type="text" name="targetField" placeholder="Target Field" onChange={handleChange} required /><br/>
        <input type="text" name="experienceLevel" placeholder="Experience Level" onChange={handleChange} required /><br/>
        <input type="text" name="duration" placeholder="Duration" onChange={handleChange} required /><br/>
        <input type="text" name="goal" placeholder="Desired Mastery Level" onChange={handleChange} required /><br/>
        <button type="submit">Generate Roadmap</button>
      </form>

      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default RoadmapForm;
