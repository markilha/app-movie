import { FaStar, FaRegStar } from "react-icons/fa6";
export interface Props {
  rating: number;
}

export default function StarRaging(props: Props) {
  const numStars = Math.round(props.rating / 2);
  const fullStars = [];
  const emptyStars = [];

  for (let i = 0; i < 5; i++) {
    if (i < numStars) {
      fullStars.push(i);
    } else {
      emptyStars.push(i);
    }
  }
  return (
    <div className=" flex flex-row">
      {fullStars.map((index) => (
        <FaStar key={index} className="text-yellow-500" />
      ))}
      {emptyStars.map((index) => (
        <FaRegStar key={index} className="text-yellow-500" />
      ))}
    </div>
  );
}
