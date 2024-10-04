import Image from "next/image";

function Card({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative h-full w-full">
      <Image
        priority
        objectFit="cover"
        className="w-full h-full top-0 left-0 object-cover"
        src={imageUrl}
        fill
        alt=""
      />
    </div>
  );
}

export default Card;
