import { useState, useEffect } from "react";

export const useFetch = (url, opts) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch(url, opts)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setLoading(false);
      });
  }, [url]);
  return [response, loading, hasError];
};
