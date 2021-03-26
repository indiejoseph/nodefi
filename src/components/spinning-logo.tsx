import React from 'react';
import { animated, useSpring } from 'react-spring';

export const SpinningLogo: React.FC = () => {
  const props: any = useSpring({
    config: { duration: 1000 },
    from: {
      x: 0,
    },
    to: async next => {
      const reset = () => {
        const ops = next({ x: 1 });

        return ops ? ops.then(() => reset()) : null;
      };

      await reset();
    },
    reset: true,
  });

  /* eslint-disable react/destructuring-assignment */
  return (
    <animated.svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 145 120"
      width="220px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <animated.path
          d="M17.9,49.8l36.4-1.7c10.1-0.5,18,8.5,16.3,18.4L67.8,83c-1.3,7.6-7.8,13.1-15.5,13.1H15.8
	C5.8,96.1-1.6,87,0.3,77.3l2.9-14.8C4.6,55.4,10.7,50.1,17.9,49.8z"
          fill="#8433D3"
          transform={props.x
            .interpolate({ range: [0, 1], output: [-150, 150] })
            .interpolate(x => `translate(${x}, ${x * 0.05})`)}
        />
        <animated.path
          d="M99.6,28.9l23.6-1.1c6.5-0.3,11.7,5.5,10.6,12L132,50.5c-0.9,4.9-5.1,8.5-10.1,8.5H98.2
	c-6.4,0-11.3-5.9-10-12.2l1.9-9.6C91,32.5,94.9,29.1,99.6,28.9z"
          fill="#D134B3"
          transform={props.x
            .interpolate({ range: [0, 1], output: [100, -100] })
            .interpolate(x => `translate(${x}, ${x * 0.05})`)}
        />
        <animated.path
          d="M15.2,120.5c-1.7,0-3.4-0.4-5.1-1.1c-5.1-2.4-7.7-7.6-6.5-13.1l14.1-79.9C21.1,11.8,33.8,1.7,48.7,1.7
  L100.4,0c8.3,0,16.2,3.7,21.5,10.1c5.3,6.4,7.5,14.7,5.9,22.9l-5.5,36.2c-2.9,15-16,25.8-31.2,25.9l-36.5,0.8
  c-9.6,0-19.2,5.1-25.6,13.7l-4.6,6.1C22.2,118.8,18.8,120.5,15.2,120.5z M27.6,28.5l-14.1,79.9c-0.2,0.8,0.1,1.5,0.9,1.8
  c0.8,0.4,1.5,0.2,2-0.5l4.6-6.1c8.3-11.1,20.8-17.7,33.6-17.7L91,85c10.4,0,19.4-7.4,21.4-17.6l5.5-36.2c1-5.2-0.4-10.6-3.8-14.7
  c-3.4-4.1-8.4-6.4-13.7-6.5l-51.7,1.7C38.6,11.7,29.9,18.6,27.6,28.5z"
          fill="#231F20"
        />
        <path
          d="M58.2,111.5c-2.7,0-5-2.2-5-4.9c0-2.8,2.2-5.1,5-5.1l49.8-0.8c10.5,0,19.5-7.4,21.4-17.6l5.5-36.2
		c1-5.2-0.4-10.6-3.8-14.7c-3.4-4.1-8.4-6.4-13.7-6.5l-51.6,1.7c-2.8,0.1-5.1-2.1-5.2-4.9s2.1-5.1,4.9-5.2l51.8-1.7
		c8.3,0,16.2,3.7,21.5,10.1c5.3,6.4,7.5,14.8,5.9,22.9l-5.5,36.2c-2.9,15-16,25.9-31.3,25.9L58.2,111.5
		C58.3,111.5,58.2,111.5,58.2,111.5z"
          fill="#231F20"
        />
      </g>
    </animated.svg>
  );
  /* eslint-enable react/destructuring-assignment */
};
