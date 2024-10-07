import Image from "next/image";
import localFont from "next/font/local";

export default function Home() {
  return (
    <div className="w-screen h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-pink-300 text-7xl">Hello World</h1>
    </div>
  );
}
