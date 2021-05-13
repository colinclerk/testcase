import {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useMemo,
} from "react";

function useListener(label, add, remove) {
  const [time, setTime] = useState(0);

  const listener = useCallback(() => {
    const newTime = Date.now();
    console.log(label, "listeners called", newTime);
    setTime(newTime);
  }, [setTime]);

  // If you uncomment this hack and comment the add(listener) in
  // useEffect, then the listener gets added twice, even though
  // the logging of the listener being added only occurs once.

  // As far as I can tell, the second addition must be happening
  // during a virtual DOM step.

  // You can see the second addition by manually calling
  // window.Clerk.outerListeners in console

  // const hack = useState(() => {
  //   add(listener);
  //   return 0;
  // });

  useEffect(() => {
    add(listener);
    return () => {
      remove(listener);
    };
  }, [remove, listener, add]);
  return time;
}

function Outer({ children }) {
  const time = useListener(
    "Outer",
    window.Clerk.addOuterListener,
    window.Clerk.removeOuterListener
  );
  console.log("Outer render", time);
  return (
    <div style={{ backgroundColor: "red", padding: "1rem" }}>
      <h3>Outer</h3>
      {time === 0 && children}
    </div>
  );
}

function Inner({ children }) {
  const time = useListener(
    "Inner",
    window.Clerk.addInnerListener,
    window.Clerk.removeInnerListener
  );
  console.log("Inner render", time);
  return (
    <div style={{ backgroundColor: "blue", padding: "1rem" }}>
      <h3>Inner</h3>
      {children}
    </div>
  );
}

function App() {
  return (
    <Outer>
      <Inner />
    </Outer>
  );
}

export default App;
