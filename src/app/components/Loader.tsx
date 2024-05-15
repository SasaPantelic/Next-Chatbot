
import { useState, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const ReadLoading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <div className="flex items-center space-x-2 animate-pulse">
          <AiOutlineLoading className="text-3xl text-blue-500" />
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Title</h2>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReadLoading;
