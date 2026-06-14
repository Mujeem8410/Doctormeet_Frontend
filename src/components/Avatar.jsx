const Avatar = ({ src, size = 40, alt = "Profile" }) => {
  return (
    <div
      className="overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-200/70"
      style={{ width: size, height: size }}
    >
      <img
        src={
          src
            ? src
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt={alt}
        className="h-full w-full rounded-full bg-slate-100 object-cover"
      />
    </div>
  );
};

export default Avatar;
