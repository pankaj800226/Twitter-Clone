import { useState, useEffect } from "react";
interface User {
  id: string;
  displayName: string;
}
const DalyWishes = () => {
  const [timeOfDay, setTimeOfDay] = useState("");

  const userDataString: string | null = localStorage.getItem("user");

  const user: User | null = userDataString
    ? (JSON.parse(userDataString) as User)
    : null;

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setTimeOfDay("Good Morning");
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay("Good Afternoon");
      } else if (hour >= 18 && hour < 24) {
        setTimeOfDay("Good Evening");
      } else {
        setTimeOfDay("Good Night");
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="dalyWishes">
        <h4>{timeOfDay}</h4>
        <h5>{user?.displayName}</h5>
      </div>
    </>
  );
};

export default DalyWishes;
