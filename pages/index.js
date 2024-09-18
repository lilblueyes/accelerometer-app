import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import useAccelerometer from "../hooks/useAccelerometer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const { x, y, z } = useAccelerometer();
  const [permissionGranted, setPermissionGranted] = useState(false);

  // États pour la localisation GPS
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Références pour la moyenne glissante des axes de l'accéléromètre
  const xValues = useRef([]);
  const yValues = useRef([]);
  const zValues = useRef([]);
  const maxValues = 5; // Nombre de valeurs pour la moyenne glissante

  // États pour les valeurs lissées
  const [smoothX, setSmoothX] = useState(0);
  const [smoothY, setSmoothY] = useState(0);
  const [smoothZ, setSmoothZ] = useState(0);

  // Demander l'autorisation pour utiliser les capteurs de mouvement sur iOS
  const requestMotionPermission = async () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          setPermissionGranted(true);
        } else {
          console.log("Permission denied");
        }
      } catch (error) {
        console.error("Permission request error", error);
      }
    }
  };

  // Utilisation de l'API de géolocalisation du navigateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Erreur de géolocalisation", error);
        },
        {
          enableHighAccuracy: true, // Demander une grande précision
          timeout: 5000, // Temps avant l'échec de la requête
          maximumAge: 0, // Ne pas utiliser les coordonnées en cache
        }
      );
    } else {
      console.log("Géolocalisation non prise en charge par ce navigateur.");
    }
  }, []);

  // Moyenne glissante pour lisser les valeurs de l'accéléromètre
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

  useEffect(() => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      requestMotionPermission();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Accéléromètre App avec GPS</title>
        <meta
          name="description"
          content="App avec accéléromètre et géolocalisation"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src="https://nextjs.org/icons/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />

          {!permissionGranted && (
            <button
              onClick={requestMotionPermission}
              className={styles.primary}
            >
              Autoriser l'accès aux capteurs
            </button>
          )}

          {permissionGranted && (
            <div>
              <h1>Accéléromètre iPhone avec GPS</h1>
              <p>
                Accélération X: {smoothX ? smoothX.toFixed(2) : "En attente..."}
              </p>
              <p>
                Accélération Y: {smoothY ? smoothY.toFixed(2) : "En attente..."}
              </p>
              <p>
                Accélération Z: {smoothZ ? smoothZ.toFixed(2) : "En attente..."}
              </p>
              <p>
                Latitude: {latitude ? latitude.toFixed(6) : "En attente..."}
              </p>
              <p>
                Longitude: {longitude ? longitude.toFixed(6) : "En attente..."}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
