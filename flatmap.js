let sentenceArr = ["Try and fail but never fail to try", "Whatever you are be a good one", "Dance until no one's watching"];

function getWords(sentenceArr) {
  // Your code here.
  const result = sentenceArr.flatMap((eachSentence) => (eachSentence).split(" "));
  //.flatMap((sentence) => (sentence).join(" "));
  console.log(result);
}

getWords(sentenceArr);