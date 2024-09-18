import React from "react";
import './style.css';
import kermitImage from '../../assets/kermit.jpg';

const Sobre = () => {
    return (
        <div className="container-sobre">
            <h1>Sobre</h1>
            <p>Este projeto foi criado por Lucas L. Lopes na aula de programação web.</p>
            <img src={kermitImage} alt="kermit" style={{ width: '300px' }}/>
        </div>
    );
}
export default Sobre;
