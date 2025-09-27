import React from "react";
import Card from "../components/Card";
import f from '../assets/pics/f.png'
import Nav from "../components/Nav";
import Banner from "../components/Banner";

export default function Home() {
  return (
    <>
      <Nav></Nav>
      <Banner></Banner>
      <div className="card-cont">
        <Card
        productImage={f}
        productName={"Red flower"}
        productPrice={20}
        productStock={10}
      ></Card>
      <Card
        productImage={f}
        productName={"Red flower"}
        productPrice={20}
        productStock={10}
      ></Card>
      <Card
        productImage={f}
        productName={"Red flower"}
        productPrice={20}
        productStock={10}
      ></Card>
      <Card
        productImage={f}
        productName={"Red flower"}
        productPrice={20}
        productStock={10}
      ></Card>
      </div>
      
    </>
  );
}
