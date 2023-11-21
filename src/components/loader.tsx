"use client";
import dynamic from "next/dynamic";
import SigmaTrade from "@/assets/images/sensa.svg";
const Image = dynamic(() => import("next/image"), { ssr: false });
const Loader = () => {
  return (
    <div className="loader">
      <span className="loader__inner"></span>
      <Image src={SigmaTrade} alt="Picture of the author" width={40} fill={false} />
    </div>
  );
};
export default Loader;
