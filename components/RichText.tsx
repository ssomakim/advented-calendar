type RichTextProps = {
  text: string;
  className?: string;
};

type Token =
  | { type: "text"; value: string }
  | { type: "muted"; value: string }
  | { type: "bold"; value: string };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const regex = /(\*[^*]+\*|&[^&]+&|\[\[[\s\S]+?\]\])/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }

    const value = match[0];

    if (value.startsWith("*") && value.endsWith("*")) {
      tokens.push({
        type: "muted",
        value: value.slice(1, -1),
      });
    } else if (value.startsWith("&") && value.endsWith("&")) {
      tokens.push({
        type: "bold",
        value: value.slice(1, -1),
      });
    } else if (value.startsWith("[[") && value.endsWith("]]")) {
      tokens.push({
        type: "bold",
        value: value.slice(2, -2),
      });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return tokens;
}

export default function RichText({ text, className = "" }: RichTextProps) {
  const tokens = tokenize(text);

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {tokens.map((token, index) => {
        if (token.type === "muted") {
          return (
            <span key={index} className="text-zinc-200">
              {token.value}
            </span>
          );
        }

        if (token.type === "bold") {
          return (
            <strong key={index} className="font-semibold text-zinc-900">
              {token.value}
            </strong>
          );
        }

        return <span key={index}>{token.value}</span>;
      })}
    </div>
  );
}