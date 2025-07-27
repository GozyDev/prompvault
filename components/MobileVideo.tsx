export default function MobileVideo() {
  return (
    <div className="block md:hidden p-10">
      <video
        src="/video/Samsung-Galaxy-S20-localhost-ra9g6_32srr_6d.webm"
        autoPlay
        loop
        muted
        playsInline
        className="object-cover"
      ></video>
    </div>
  );
}
