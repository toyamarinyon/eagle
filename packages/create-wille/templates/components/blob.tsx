import { blobContainer, blobItem } from "./blob.css";

const Blob1 = (): JSX.Element => (
  <svg
    width="197"
    height="234"
    viewBox="0 0 197 234"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={blobItem({ animationDuration: 21, color: "blue" })}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M75.2316 0.399797C127.01 -4.28545 173.918 32.7667 190.314 82.268C207.052 132.804 192.138 190.692 148.109 220.43C107.848 247.624 54.6683 230.669 18.2404 198.491C-9.39644 174.079 -0.0580456 134.065 10.154 98.57C22.1642 56.8246 32.1022 4.30242 75.2316 0.399797Z"
      fill="current-color"
    />
  </svg>
);

const Blob2 = (): JSX.Element => (
  <svg
    width="252"
    height="202"
    viewBox="0 0 252 202"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={blobItem({
      animationDuration: 20,
      animationDirection: "left",
      color: "pink",
    })}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.18767 150.026C-11.5787 102.526 10.5646 47.2868 56.4757 17.2397C99.5445 -10.9472 154.276 -0.909353 195.011 26.4488C235.601 53.7098 264.271 99.1002 246.088 144.587C228.748 187.966 174.076 199.929 125.222 201.036C76.0003 202.152 22.1446 192.688 6.18767 150.026Z"
      fill="current-color"
    />
  </svg>
);
const Blob3 = (): JSX.Element => (
  <svg
    width="215"
    height="203"
    viewBox="0 0 215 203"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={blobItem({ animationDuration: 19, color: "lime" })}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M183.773 45.2794C211.292 82.2054 231.055 133.684 194.791 175.154C160.048 214.884 102.856 203.038 57.9101 189.209C22.7532 178.391 -1.91343 152.125 0.335762 115.32C2.97431 72.1438 23.8731 23.7237 69.0778 6.4635C116.051 -11.4719 158.635 11.5473 183.773 45.2794Z"
      fill="#3B5BDB"
    />
  </svg>
);
const Blob4 = (): JSX.Element => (
  <svg
    width="237"
    height="227"
    viewBox="0 0 237 227"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={blobItem({ animationDuration: 17, color: "yellow" })}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M34.9833 66.9754C57.6122 31.0452 87.1083 -6.92595 131.642 1.67005C184.675 11.9067 230.047 54.1374 235.935 105.764C241.762 156.855 204.208 197.585 156.044 215.643C107.907 233.691 47.3378 230.594 13.5762 189.134C-16.9853 151.603 10.8556 105.285 34.9833 66.9754Z"
      fill="current-color"
    />
  </svg>
);
const Blob5 = (): JSX.Element => (
  <svg
    width="215"
    height="212"
    viewBox="0 0 215 212"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={blobItem({
      animationDuration: 22,
      animationDirection: "left",
      color: "grape",
    })}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M134.991 0.405635C181.122 3.9312 197.39 50.0665 209.539 89.3664C219.325 121.021 217.829 155.313 189.463 176.612C152.173 204.611 100.928 225.136 59.5776 201.964C11.3294 174.927 -11.8675 121.608 6.0154 73.8121C23.7124 26.5132 78.5895 -3.90487 134.991 0.405635Z"
      fill="current-color"
    />
  </svg>
);

export const Blob = (): JSX.Element => {
  return (
    <section className={blobContainer}>
      <Blob1 />
      <Blob2 />
      <Blob3 />
      <Blob4 />
      <Blob5 />
    </section>
  );
};
