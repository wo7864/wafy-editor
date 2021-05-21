import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from './states/Context';
import Header from './Component/Header';
import Tool from './Component/Tool';
import Stage from './Component/Stage';
import Controller from './Component/Controller';
import AnimationComponent from './Component/AnimationComponent';

import './static/css/App.css';

const App = observer(() => {
  const { windowStore } = useStores();


  return (
    <div className="container">
      <Header />
      <div className="body-container">
        <Tool />
        <Stage />
        <Controller />
      </div>
      {windowStore.animationComponent && <AnimationComponent/>}
    </div>
  );
})

export default App;
