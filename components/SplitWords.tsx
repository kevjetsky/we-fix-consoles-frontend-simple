import {Fragment, type CSSProperties} from 'react';

/** Wraps each word in a mask so it can slide up (see `.split-word` in app/motions.css). */
export function SplitWords({text}: {text: string}) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="split-word">
            <span style={{'--w': i} as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}
