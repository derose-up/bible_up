import React from 'react';
import Tilt from 'react-parallax-tilt';
import CriancasBiblia from '../../assets/criancas-biblia.png'; // imagem com fundo transparente

const Image3DInteractive = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.15}
        glareColor="#ffffff"
        glarePosition="all"
        scale={1.04}
        transitionSpeed={400}
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
      >
        <img
          src={CriancasBiblia}
          alt="Crianças lendo a Bíblia"
          className="w-full object-contain drop-shadow-2xl select-none pointer-events-none"
          draggable={false}
        />
      </Tilt>
    </div>
  );
};
export default Image3DInteractive;
