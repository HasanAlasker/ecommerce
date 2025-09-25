import React from "react";
import Card from "../components/Card";
import f from '../assets/pics/f.png'

export default function Home() {
  return (
    <>
      <h1>home</h1>
      <Card
        productImage={f}
        productName={"Red flower"}
        productPrice={20}
        productStock={10}
      ></Card>
    </>
  );
}
