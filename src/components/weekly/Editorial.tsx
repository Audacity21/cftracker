import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Problems.css';

const Editorial = ({ link }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the table row
  };

  return (
    <div>
      <a className="editorial_link" href={link} target="_blank" rel="noreferrer" onClick={handleClick}>
        <FontAwesomeIcon icon={faYoutube} size="2x" />
      </a>
    </div>
  );
};

export default Editorial;
