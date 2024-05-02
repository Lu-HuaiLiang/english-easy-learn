import { useState } from 'react';
import { useGetUnKnownWordList } from '~contents/shared/utils/storageUtils/word';

const DisplayWordItem = (props) => {
  const { words } = props;
  return (
    <div
      style={{
        // fontFamily: 'Avenir Next',
        marginTop: '10px',
        width: '400px',
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-between',
        flexWrap: 'wrap',
        // width: '400px',
        // color: 'red',
      }}
    >
      {words.map((i) => {
        return (
          <span
            style={{
              border: '1px solid black',
              padding: '4px',
              borderRadius: '3px',
              marginBottom: '3px',
              marginLeft: '3px',
            }}
          >
            {i}
          </span>
        );
      })}
    </div>
  );
};

const forLowerCase = (text) => {
  return text?.toLowerCase();
};

function IndexOptions() {
  const [data, setData] = useState('');
  const [UnKnownWordList, setUnknownWordList] = useGetUnKnownWordList();
  const [sucessWords, setSucessWords] = useState([]);
  const [failWords, setFailWords] = useState([]);
  const [hasFinish, setHasFinish] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        marginTop: '50px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // background: 'black',
        // padding: 16,
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontWeight: '10000',
          marginBottom: '8px',
          width: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // color: 'red',
        }}
      >
        <div>{hasFinish ? '🟢' : '⚪️'} 生词本｜导入</div>
        <button
          onClick={async () => {
            const allWords = (await import('~contents/shared/const/word'))
              .allWords;
            console.log(allWords);
            const words = data
              .split('\u000A')
              .filter(Boolean)
              .map(forLowerCase);
            const wrong_words = words.filter((w) => !allWords.includes(w));
            const right_words = words.filter((w) => !wrong_words.includes(w));
            // console.log(words);
            setFailWords(wrong_words);
            setSucessWords(right_words);
            setHasFinish(true);
            setUnknownWordList([
              ...new Set(UnKnownWordList.concat(right_words)),
            ]);
          }}
        >
          确定
        </button>
      </div>
      <div
        style={{ color: 'rgb(0 123 198)', width: '400px', marginBottom: '8px' }}
      >
        请粘贴/输入单词，并使用回车换行,提交后将进行自动识别。
      </div>
      <textarea
        placeholder=""
        style={{ width: '400px', height: '200px' }}
        onChange={(e) => setData(e.target.value)}
        value={data}
      />
      <div
        style={{
          // fontFamily: 'Avenir Next',
          fontSize: '13px',
          fontWeight: '400',
          marginTop: '8px',
          width: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // color: 'white',
        }}
      >
        <div>现存生词数量 {UnKnownWordList.length}</div>
        <div>已传入合法单词数量 0</div>
      </div>
      {hasFinish && (
        <div>
          <div
            style={{
              // fontFamily: 'Avenir Next',
              fontSize: '18px',
              fontWeight: '10000',
              marginTop: '48px',
              width: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              // color: 'red',
            }}
          >
            失败导入单词 {failWords.length}
          </div>
          <div
            style={{
              color: 'rgb(0 123 198)',
              width: '400px',
              marginTop: '8px',
              marginBottom: '8px',
            }}
          >
            未识别单词将不会被添加
          </div>
          <DisplayWordItem words={failWords} />
        </div>
      )}

      {hasFinish && (
        <div>
          <div
            style={{
              // fontFamily: 'Avenir Next',
              fontSize: '18px',
              fontWeight: '10000',
              marginTop: '48px',
              width: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              // color: 'red',
            }}
          >
            成功导入单词 {sucessWords.length}
          </div>
          <div
            style={{
              color: 'rgb(0 123 198)',
              width: '400px',
              marginTop: '8px',
              marginBottom: '8px',
            }}
          >
            下面列举了，已经被成功添加的单词
          </div>
          <DisplayWordItem words={sucessWords} />
        </div>
      )}
    </div>
  );
}

export default IndexOptions;
