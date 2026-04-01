function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Roboto:Regular','Noto_Sans_Devanagari:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[20px] text-black whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[normal]">गौतम बुद्ध विश्वविद्यालय</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[18px] text-black whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[normal]">GAUTAM BUDDHA UNIVERSITY</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0">
      <Frame3 />
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#949393] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[normal]">An Ultimate Destination for Higher Learning</p>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[7px] items-start justify-center px-[15px] relative size-full">
      <Frame4 />
      <Frame2 />
    </div>
  );
}