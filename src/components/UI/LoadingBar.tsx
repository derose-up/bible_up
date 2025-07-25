import React, { useRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";

const LoadingBarWrapper = () => {
  const ref = useRef<LoadingBarRef>(null);

  const start = () => ref.current?.continuousStart();
  const complete = () => ref.current?.complete();

  return (
    <>
      <LoadingBar color="#9333ea" ref={ref} shadow={true} />
      {/* Para usar:
          const loadingRef = useRef<any>(null);
          loadingRef.current?.continuousStart();
          loadingRef.current?.complete();
      */}
    </>
  );
};

export default LoadingBarWrapper;
