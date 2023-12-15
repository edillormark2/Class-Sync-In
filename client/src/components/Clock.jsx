import React, { useState, useEffect } from "react";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const formattedDateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  const formattedDate = currentTime.toLocaleDateString(
    undefined,
    formattedDateOptions
  );

  return (
    <div className="bg-gray-300 bg-opacity-50 text-black w-68 p-2 text-3xl font-semibold rounded-lg">
      <p style={{ fontFamily: "DS-Digital, sans-serif", fontSize: "2.3rem" }}>
        {formattedTime}
      </p>
      <p className="text-lg mt-2">
        {formattedDate}
      </p>
    </div>
  );
};

export default React.memo(Clock);
