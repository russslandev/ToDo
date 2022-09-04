import React, { FC } from "react";

const Loader: FC = () => {
  return (
    <div className='ui segment !shadow-none !border-none !rounded-none !bg-transparent'>
      <p></p>
      <div className='ui active inverted dimmer !bg-transparent'>
        <div className='ui large loader'></div>
      </div>
    </div>
  );
};

export default Loader;
