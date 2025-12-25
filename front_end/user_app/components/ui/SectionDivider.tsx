const SectionDivider = () => {
  return (
    <div className="container mx-auto w-full flex items-center justify-center py-20 gap-4">
      <div className="flex-1 border-t-4 border-dashed border-black" />
      <span className="font-retro text-sm tracking-widest">
        CONTINUE
      </span>
      <div className="flex-1 border-t-4 border-dashed border-black" />
    </div>
  );
};

export default SectionDivider;