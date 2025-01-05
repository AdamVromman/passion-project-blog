import "../styles/source.css";

interface SourceProps {
  APA: string;
  name: string;
  link: string;
  year: number;
}

const Source = ({ APA, name, link, year }: SourceProps) => {
  return (
    <span id={APA} className="source">
      <a href={link} target="_blank" className="bg"></a>
      <span className="apa">{APA}</span>
      <span className="name">
        ({name}, {year})
      </span>
    </span>
  );
};

export default Source;
