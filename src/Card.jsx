import React, { useState } from "react";

export default function Card({ image }) {
  const angle = Math.random() * 25;
  const styles = {
    position: "absolute",
    transform: `rotate(${angle}deg)`,
  };
  return <img src={image} style={styles} />;
}
