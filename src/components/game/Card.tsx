import Image from "next/image";

function Card({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative h-full w-full">
      <Image priority className="object-fill" src={imageUrl} fill alt="" />
    </div>
  );
}

export default Card;
