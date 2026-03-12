import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
       const res = await axios.get(`${API_URL}/api/modules`);
        setModules(res.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) return <h2>Loading modules...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Learning Modules</h2>

      {modules.map((module) => (
        <div key={module._id} style={{ marginBottom: "15px" }}>
          <h3>{module.title}</h3>
          <p>{module.description}</p>
          <strong>Level:</strong> {module.level}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ModulesPage;