interface VisionMissionCardProps {
  name: string;
  nim: string;
  visi: string;
  misi: string[];
}

const VisionMissionCard = ({
  name,
  nim,
  visi,
  misi,
}: VisionMissionCardProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#f6efe6] border-4 border-black p-6">
      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="border-t-4 border-dashed border-black mb-4" />

        <h2 className="font-retro text-2xl">{name}</h2>

        <span className="inline-block mt-2 bg-orange-400 text-white font-mono text-xs px-3 py-1 border-2 border-black">
          {nim}
        </span>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* VISI */}
        <div className="relative bg-white border-4 border-black p-4">
          <span className="absolute -top-4 left-4 bg-blue-400 text-white font-retro px-3 py-1 border-2 border-black">
            Visi
          </span>
          <p className="font-mono text-sm leading-relaxed mt-4">
            {visi}
          </p>
        </div>

        {/* MISI */}
        <div className="relative bg-white border-4 border-black p-4">
          <span className="absolute -top-4 left-4 bg-green-400 text-white font-retro px-3 py-1 border-2 border-black">
            Misi
          </span>
          <ul className="font-mono text-sm list-decimal ml-5 mt-4 space-y-2">
            {misi.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisionMissionCard;
