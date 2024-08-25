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

// 20000 words sample data
const transcriptionApiResAtom = atom(
  [...Array(1000).keys()].map((i) =>
    [...Array(20).keys()].map((j) => {
      return {
        start: (20 * i + j) / 4,
        end: (20 * i + j + 1) / 4,
        text: j.toString().padStart(4, "0"),
      };
    }),
  ),
  // [
  //   [
  //     { end: 0.2199999988079071, text: "In", start: 0 },
  //     { end: 0.46000000834465027, text: "my", start: 0.2199999988079071 },
  //     { end: 0.7200000286102295, text: "case", start: 0.46000000834465027 },
  //     { end: 1.0199999809265137, text: "I", start: 0.8199999928474426 },
  //     { end: 1.2599999904632568, text: "have", start: 1.0199999809265137 },
  //     { end: 1.5199999809265137, text: "the", start: 1.2599999904632568 },
  //     { end: 1.7999999523162842, text: "banana", start: 1.5199999809265137 },
  //     { end: 2.1600000858306885, text: "version", start: 1.7999999523162842 },
  //     { end: 2.700000047683716, text: "which", start: 2.5199999809265137 },
  //     { end: 3, text: "is", start: 2.700000047683716 },
  //     { end: 3.299999952316284, text: "described", start: 3 },
  //     { end: 3.5999999046325684, text: "as", start: 3.299999952316284 },
  //     { end: 3.8399999141693115, text: "a", start: 3.5999999046325684 },
  //     { end: 4.21999979019165, text: "tactile", start: 3.8399999141693115 },
  //     { end: 4.579999923706055, text: "switch", start: 4.21999979019165 },
  //     { end: 4.880000114440918, text: "with", start: 4.579999923706055 },
  //     { end: 5.239999771118164, text: "a", start: 4.880000114440918 },
  //     { end: 5.360000133514404, text: "gentle", start: 5.239999771118164 },
  //     { end: 5.820000171661377, text: "noise", start: 5.360000133514404 },
  //     { end: 6.340000152587891, text: "profile", start: 5.820000171661377 },
  //     { end: 6.860000133514404, text: "Whilst", start: 6.619999885559082 },
  //     { end: 7.099999904632568, text: "using", start: 6.860000133514404 },
  //     { end: 7.380000114440918, text: "this", start: 7.099999904632568 },
  //     { end: 7.659999847412109, text: "keyboard", start: 7.380000114440918 },
  //     { end: 8.020000457763672, text: "I", start: 7.860000133514404 },
  //     { end: 8.34000015258789, text: "actually", start: 8.020000457763672 },
  //     { end: 8.539999961853027, text: "found", start: 8.34000015258789 },
  //     { end: 8.779999732971191, text: "these", start: 8.539999961853027 },
  //     { end: 9.100000381469727, text: "switches", start: 8.779999732971191 },
  //     { end: 9.300000190734863, text: "to", start: 9.100000381469727 },
  //     { end: 9.539999961853027, text: "be", start: 9.300000190734863 },
  //     { end: 9.84000015258789, text: "rather", start: 9.539999961853027 },
  //     { end: 10.260000228881836, text: "enjoyable", start: 9.84000015258789 },
  //     { end: 10.539999961853027, text: "to", start: 10.260000228881836 },
  //     { end: 10.760000228881836, text: "type", start: 10.539999961853027 },
  //     { end: 11.079999923706055, text: "on", start: 10.760000228881836 },
  //     { end: 11.619999885559082, text: "But", start: 11.300000190734863 },
  //     { end: 11.800000190734863, text: "if", start: 11.619999885559082 },
  //     { end: 11.960000038146973, text: "I", start: 11.800000190734863 },
  //     { end: 12.15999984741211, text: "had", start: 11.960000038146973 },
  //     { end: 12.460000038146973, text: "decided", start: 12.15999984741211 },
  //     { end: 12.699999809265137, text: "that", start: 12.460000038146973 },
  //     { end: 12.819999694824219, text: "I", start: 12.699999809265137 },
  //     { end: 13.039999961853027, text: "wanted", start: 12.819999694824219 },
  //     { end: 13.359999656677246, text: "to", start: 13.039999961853027 },
  //     { end: 13.359999656677246, text: "swap", start: 13.359999656677246 },
  //     { end: 13.579999923706055, text: "these", start: 13.359999656677246 },
  //     { end: 13.84000015258789, text: "out", start: 13.579999923706055 },
  //     { end: 14.380000114440918, text: "I", start: 14.15999984741211 },
  //     { end: 14.520000457763672, text: "could", start: 14.380000114440918 },
  //     { end: 14.640000343322754, text: "have", start: 14.520000457763672 },
  //     { end: 15.020000457763672, text: "easily", start: 14.640000343322754 },
  //     { end: 15.239999771118164, text: "done", start: 15.020000457763672 },
  //     { end: 15.5600004196167, text: "so", start: 15.239999771118164 },
  //     { end: 15.9399995803833, text: "as", start: 15.65999984741211 },
  //     { end: 16.15999984741211, text: "the", start: 15.9399995803833 },
  //     { end: 16.399999618530273, text: "switches", start: 16.15999984741211 },
  //     { end: 16.559999465942383, text: "on", start: 16.399999618530273 },
  //     { end: 16.700000762939453, text: "the", start: 16.559999465942383 },
  //     { end: 17.020000457763672, text: "V10", start: 16.700000762939453 },
  //     { end: 17.299999237060547, text: "Max", start: 17.020000457763672 },
  //     { end: 17.520000457763672, text: "are", start: 17.299999237060547 },
  //     { end: 18, text: "hot", start: 17.520000457763672 },
  //     { end: 18.559999465942383, text: "swappable", start: 18 },
  //     { end: 19.079999923706055, text: "In", start: 18.8799991607666 },
  //     { end: 19.299999237060547, text: "fact", start: 19.079999923706055 },
  //     { end: 19.68000030517578, text: "Keychron", start: 19.540000915527344 },
  //     { end: 20.040000915527344, text: "provide", start: 19.68000030517578 },
  //     { end: 20.239999771118164, text: "their", start: 20.040000915527344 },
  //     { end: 20.579999923706055, text: "own", start: 20.239999771118164 },
  //     { end: 20.739999771118164, text: "tool", start: 20.579999923706055 },
  //     { end: 21.040000915527344, text: "inside", start: 20.739999771118164 },
  //     { end: 21.219999313354492, text: "of", start: 21.040000915527344 },
  //     { end: 21.299999237060547, text: "the", start: 21.219999313354492 },
  //     { end: 21.579999923706055, text: "box", start: 21.299999237060547 },
  //     { end: 21.860000610351562, text: "that", start: 21.579999923706055 },
  //     { end: 21.979999542236328, text: "you", start: 21.860000610351562 },
  //     { end: 22.139999389648438, text: "can", start: 21.979999542236328 },
  //     { end: 22.34000015258789, text: "use", start: 22.139999389648438 },
  //     { end: 22.739999771118164, text: "to", start: 22.34000015258789 },
  //     { end: 22.780000686645508, text: "switch", start: 22.739999771118164 },
  //     { end: 23.100000381469727, text: "these", start: 22.780000686645508 },
  //     { end: 23.440000534057617, text: "out", start: 23.100000381469727 },
  //   ],
  // ],
);

const timestampAtom = atom(0);
const initialTimestampAtom = atom(new Date().getTime());

const flatWordsAtom = atom((get) => {
  const lineAtoms = get(transcriptionApiResAtom);
  //@ts-ignore
  return [].concat.apply([], [...lineAtoms]) as Word[];
});

const bucketSize = 3;

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

  const searchStartIndex = bucketIndexes[bucketIndex] - 1 || 0;
  const searchEndIndex = (bucketIndexes[bucketIndex + 1] || words.length) + 1;

  const wordIndex = words
    .slice(searchStartIndex, searchEndIndex)
    .findIndex((word) => {
      return word.start <= time && word.end >= time;
    });
  if (wordIndex === -1) {
    return -1;
  }

  return wordIndex + searchStartIndex;
});
const previousWordIndexAtom = atom(-1);

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
  const previousWordIndex = get(previousWordIndexAtom);

  if (wordIndex === previousWordIndex) {
    return;
  }

  const flatWordAtoms = get(flatWordAtomsAtom);

  if (wordIndex === -1) {
    return;
  }

  set(flatWordAtoms[wordIndex], (prev) => ({
    ...prev,
    highlight: true,
  }));
  set(previousWordIndexAtom, wordIndex);

  if (previousWordIndex === -1) {
    return;
  }
  set(flatWordAtoms[previousWordIndex], (prev) => ({
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
