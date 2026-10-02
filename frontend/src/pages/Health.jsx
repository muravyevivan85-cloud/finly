import { useEffect, useState } from "react";
import { api } from "../services/api";
import Loading from "../components/Loading";

export default function Health() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.health()
      .then(setData)
      .catch((error) => setError(error.message));
  }, []);

  return (
    <main className="section">
      <div className="container narrow">
        <h1>Состояние API</h1>
        {!data && !error && <Loading />}
        {error && <div className="error-message">{error}</div>}
        {data && (
          <div className="status-card">
            <p><strong>Server:</strong> {data.server}</p>
            <p><strong>Database:</strong> {data.database}</p>
            <p><strong>Database time:</strong> {data.databaseTime}</p>
          </div>
        )}
      </div>
    </main>
  );
}
