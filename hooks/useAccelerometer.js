import { useState, useEffect } from "react";

export default function useAccelerometer() {
  const [acceleration, setAcceleration] = useState({
    x: null,
    y: null,
    z: null,
  });

  useEffect(() => {
    const handleMotionEvent = (event) => {
      setAcceleration({
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z,
      });
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleMotionEvent);
    } else {
      console.log("Accéléromètre non pris en charge par ce navigateur.");
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotionEvent);
    };
  }, []);

  return acceleration;
}
