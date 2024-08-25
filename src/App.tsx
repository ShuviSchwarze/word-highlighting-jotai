import { Atom, atom, useAtom, useAtomValue } from "jotai";
import "./App.css";
import { useEffect } from "react";
import { PrimitiveAtom } from "jotai/vanilla";
import { atomEffect } from "jotai-effect";

type Word = {
  start: number;
  end: number;
  text: string;
  highlight: boolean;
};

const transcriptionApiResAtom = atom(
  [...Array(500).keys()].map((i) =>
    [...Array(20).keys()].map((j) => {
      return {
        start: (20 * i + j) / 4,
        end: (20 * i + j + 1) / 4,
        text: j.toString().padStart(4, "0"),
      };
    }),
  ),
);

const timestampAtom = atom(0);
const initialTimestampAtom = atom(new Date().getTime());

const flatWordsAtom = atom((get) => {
  const lineAtoms = get(transcriptionApiResAtom);
  //@ts-ignore
  return [].concat.apply([], [...lineAtoms]) as Word[];
});

const bucketSize = 5;

const timeBucketAtom = atom((get) => {
  const words = get(flatWordsAtom);

  const maxTime = words[words.length - 1].end;

  const bucketCount = Math.ceil(words.length / bucketSize);
  const timeInterval = Math.ceil(maxTime / bucketCount);

  const bucketIndexes = words.reduce(
    (acc, curr, i) => {
      const bucketIndex = Math.floor(curr.end / timeInterval);
      if (!acc[bucketIndex]) {
        acc[bucketIndex] = i;
      }
      return acc;
    },
    {} as Record<number, number>,
  );
  console.log(bucketIndexes, words);

  return {
    bucketIndexes,
    timeInterval,
  };
});

const wordIndexAtom = atom((get) => {
  const time = get(timestampAtom);
  const words = get(flatWordsAtom);
  const { bucketIndexes, timeInterval } = get(timeBucketAtom);

  const bucketIndex = Math.floor(time / timeInterval);

  const searchStartIndex = bucketIndexes[bucketIndex] || 0;
  const searchEndIndex = (bucketIndexes[bucketIndex + 1] || words.length) + 1;

  const wordIndex = words
    .slice(searchStartIndex, searchEndIndex)
    .findIndex((word) => {
      return word.start <= time && word.end >= time;
    });
  if (wordIndex === -1) {
    console.log("word not found", time, searchStartIndex, searchEndIndex);
    return -1;
  }

  return wordIndex + searchStartIndex;
});

const Timer = () => {
  const [timestamp, setTimestamp] = useAtom(timestampAtom);
  const [initialTimestamp, setInitialTimestamp] = useAtom(initialTimestampAtom);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp((_) => (new Date().getTime() - initialTimestamp) / 1000);
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, [initialTimestamp]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid",
      }}
    >
      <span>{timestamp}</span>
      <button onClick={() => setInitialTimestamp(new Date().getTime())}>
        Restart
      </button>
    </div>
  );
};

const transcribedAtom = atom((get) => {
  return get(transcriptionApiResAtom).map((line) =>
    line.map((word) =>
      atom({
        ...word,
        highlight: false,
      }),
    ),
  );
});

const flatWordAtomsAtom = atom((get) => {
  const lineAtoms = get(transcribedAtom);
  //@ts-ignore
  return [].concat.apply([], [...lineAtoms]) as PrimitiveAtom<Word>[];
});

const highlightWordEffect = atomEffect((get, set) => {
  const wordIndex = get(wordIndexAtom);

  const flatWordAtoms = get(flatWordAtomsAtom);

  if (wordIndex === -1) {
    return;
  }

  set(flatWordAtoms[wordIndex], (prev) => ({
    ...prev,
    highlight: true,
  }));
  if (wordIndex === 0) {
    return;
  }
  set(flatWordAtoms[wordIndex - 1], (prev) => ({
    ...prev,
    highlight: false,
  }));
});

const Word = ({ wordAtom }: { wordAtom: Atom<Word> }) => {
  const word = useAtomValue(wordAtom);
  return (
    <span
      style={{
        backgroundColor: word.highlight ? "yellow" : "transparent",
      }}
    >
      {word.text}{" "}
    </span>
  );
};

function App() {
  const transcription = useAtomValue(transcribedAtom);
  useAtom(highlightWordEffect);

  return (
    <>
      <Timer />
      <ul>
        {transcription.map((line, i) => (
          <li key={i}>
            {line.map((word, j) => (
              <Word key={j} wordAtom={word} />
            ))}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
