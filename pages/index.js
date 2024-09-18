import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import useAccelerometer from "../hooks/useAccelerometer";

export default function Home() {
  const { x, y, z } = useAccelerometer();
  const [smoothX, setSmoothX] = useState(0);
  const [smoothY, setSmoothY] = useState(0);
  const [smoothZ, setSmoothZ] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const xValues = useRef([]);
  const yValues = useRef([]);
  const zValues = useRef([]);
  const maxValues = 5;

  const requestMotionPermission = async () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          setPermissionGranted(true);
          console.log("Permission granted");
        } else {
          console.log("Permission denied");
        }
      } catch (error) {
        console.error("Permission request error", error);
      }
    }
  };

  useEffect(() => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      requestMotionPermission();
    }
  }, []);

  useEffect(() => {
    if (x !== null && y !== null && z !== null) {
      xValues.current.push(x);
      yValues.current.push(y);
      zValues.current.push(z);

      if (xValues.current.length > maxValues) xValues.current.shift();
      if (yValues.current.length > maxValues) yValues.current.shift();
      if (zValues.current.length > maxValues) zValues.current.shift();

      setSmoothX(
        xValues.current.reduce((a, b) => a + b, 0) / xValues.current.length
      );
      setSmoothY(
        yValues.current.reduce((a, b) => a + b, 0) / yValues.current.length
      );
      setSmoothZ(
        zValues.current.reduce((a, b) => a + b, 0) / zValues.current.length
      );
    }
  }, [x, y, z]);

  return (
    <>
      <Head>
        <title>Accéléromètre</title>
        <meta
          name="description"
          content="App utilisant l'accéléromètre de l'iPhone"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={containerStyle}>
        <main style={mainStyle}>
          <Image
            style={logoStyle}
            src="https://nextjs.org/icons/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />

          {!permissionGranted && (
            <button onClick={requestMotionPermission} style={buttonStyle}>
              Autoriser l'accès aux capteurs
            </button>
          )}

          {permissionGranted && (
            <div>
              <h1 style={titleStyle}>Données de l'accéléromètre</h1>
              <div style={gridStyle}>
                <div style={cardStyle}>
                  <h2 style={cardTitleStyle}>Axe X</h2>
                  <p style={valueStyle}>{smoothX.toFixed(2)}</p>
                </div>
                <div style={cardStyle}>
                  <h2 style={cardTitleStyle}>Axe Y</h2>
                  <p style={valueStyle}>{smoothY.toFixed(2)}</p>
                </div>
                <div style={cardStyle}>
                  <h2 style={cardTitleStyle}>Axe Z</h2>
                  <p style={valueStyle}>{smoothZ.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer style={footerStyle}>
          <p>App utilisant l'accéléromètre &bull; Déployé sur Vercel</p>
        </footer>
      </div>
    </>
  );
}

const containerStyle = {
  minHeight: "100vh",
  padding: "0 2rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const mainStyle = {
  padding: "5rem 0",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const titleStyle = {
  margin: 0,
  fontSize: "4rem",
  textAlign: "center",
};

const gridStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "2rem",
  marginTop: "3rem",
};

const cardStyle = {
  background: "#ffffff",
  padding: "1.5rem",
  textAlign: "center",
  border: "1px solid #eaeaea",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  width: "200px",
};

const cardTitleStyle = {
  margin: 0,
  fontSize: "1.5rem",
  color: "#0070f3",
};

const valueStyle = {
  marginTop: "0.5rem",
  fontSize: "2rem",
};

const footerStyle = {
  width: "100%",
  padding: "2rem",
  borderTop: "1px solid #eaeaea",
  textAlign: "center",
};

const logoStyle = {
  marginBottom: "2rem",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "20px",
};
